import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { useQueryClient } from '@tanstack/react-query'
import { validateImageFile } from '../../lib/utils'
import { uploadToCloudinary } from '../../lib/cloudinary'
import { createUploadRecord, updateUploadRecord, checkAndDecrementCredit } from '../../services/supabase.service'
import { removeBackgroundBinary } from '../../services/n8n.service'
import { useDropzone } from 'react-dropzone'
import { Upload, FileImage, ShieldAlert, Sparkles, RefreshCw, Trash2, Download } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { saveLocalUpload, getLocalUploadById, fileToBase64, urlToBase64 } from '../../services/localDb.service'

function dataURLtoFile(dataurl, filename) {
  const arr = dataurl.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}

export default function UploadPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [isUploading, setIsUploading] = React.useState(false)
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [selectedFile, setSelectedFile] = React.useState(null)
  const [previewUrl, setPreviewUrl] = React.useState(null)
  const [resultUrl, setResultUrl] = React.useState(null)
  const [error, setError] = React.useState(null)

  const handleClearSelected = () => {
    if (previewUrl && !previewUrl.startsWith('data:')) {
      URL.revokeObjectURL(previewUrl)
    }
    setSelectedFile(null)
    setPreviewUrl(null)
    setResultUrl(null)
    setError(null)
    setProgress(0)
    localStorage.removeItem('snapcut_current_upload_id')
  }

  React.useEffect(() => {
    async function restoreUploadState() {
      if (!user?.id) return
      const currentUploadId = localStorage.getItem('snapcut_current_upload_id')
      if (!currentUploadId) return
      
      try {
        const record = await getLocalUploadById(currentUploadId)
        if (record && record.user_id === user.id) {
          if (record.original_url && record.original_url.startsWith('data:')) {
            try {
              const reconstructedFile = dataURLtoFile(record.original_url, record.original_filename)
              setSelectedFile(reconstructedFile)
              setPreviewUrl(record.original_url)
            } catch (e) {
              console.error('Failed to reconstruct file from base64:', e)
              setPreviewUrl(record.original_url)
            }
          } else {
            setPreviewUrl(record.original_url)
          }

          if (record.status === 'completed') {
            setResultUrl(record.result_url)
          } else if (record.status === 'failed') {
            setError(record.error_message || 'Failed to remove background. Please try again.')
          } else if (record.status === 'pending') {
            setError('Processing was interrupted. Please retry.')
          }
        }
      } catch (err) {
        console.error('Failed to restore upload state:', err)
      }
    }
    
    restoreUploadState()
  }, [user?.id])

  const handleDownload = async () => {
    if (!resultUrl) return
    try {
      const response = await fetch(resultUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `transparent_${selectedFile?.name || 'result.png'}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      toast.success('Download started!')
    } catch (err) {
      console.error(err)
      toast.error('Failed to trigger download. Opening image in new tab.')
      window.open(resultUrl, '_blank')
    }
  }

  const handleProcess = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setProgress(0)
    setError(null)
    let tempUploadRecord = null

    try {
      // 0. Perform Credit check
      await checkAndDecrementCredit(user.id)

      // 1. Upload Original Image to Cloudinary (with fallback if disabled/placeholder)
      let originalUrl = ''
      let cloudinaryId = ''
      const configuredCloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME

      try {
        const isCloudinaryPlaceholder = 
          !configuredCloudName || 
          configuredCloudName.includes('your-cloud-name') || 
          configuredCloudName === ''

        if (isCloudinaryPlaceholder) {
          console.warn('Cloudinary cloud name is a placeholder or not configured. Using local preview URL fallback.')
          originalUrl = previewUrl || ''
          cloudinaryId = 'mock-original-id'
          setProgress(100)
        } else {
          const cloudinaryResult = await uploadToCloudinary(selectedFile, (percent) => {
            setProgress(percent)
          })
          originalUrl = cloudinaryResult.url
          cloudinaryId = cloudinaryResult.publicId
        }
      } catch (uploadErr) {
        console.error('Cloudinary upload failed, falling back to local preview URL:', uploadErr)
        originalUrl = previewUrl || ''
        cloudinaryId = 'failed-cloudinary-id'
        setProgress(100)
      }

      setIsUploading(false)
      setIsProcessing(true)

      // 2. Save Pending upload log row in Supabase
      try {
        tempUploadRecord = await createUploadRecord(user.id, {
          originalUrl: originalUrl,
          cloudinaryId: cloudinaryId,
          filename: selectedFile.name,
          fileSize: selectedFile.size,
        })
      } catch (dbErr) {
        console.warn('Failed to create remote upload record, creating local-only record:', dbErr)
        tempUploadRecord = {
          id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          user_id: user.id,
          original_filename: selectedFile.name,
          file_size: selectedFile.size,
          status: 'pending',
          created_at: new Date().toISOString()
        }
      }

      // Convert original file to base64 for offline/local storage
      const originalBase64 = await fileToBase64(selectedFile)
      const localRecord = {
        id: tempUploadRecord.id,
        user_id: user.id,
        original_filename: selectedFile.name,
        file_size: selectedFile.size,
        status: 'pending',
        original_url: originalBase64,
        result_url: '',
        created_at: tempUploadRecord.created_at || new Date().toISOString()
      }
      await saveLocalUpload(localRecord)
      localStorage.setItem('snapcut_current_upload_id', tempUploadRecord.id)

      // 3. Send payload details to n8n AI webhook
      const aiResult = await removeBackgroundBinary(selectedFile)

      // 4. Update the record to completed status
      try {
        await updateUploadRecord(tempUploadRecord.id, {
          status: 'completed',
          result_url: aiResult.url,
          cloudinary_result_id: '',
        })
      } catch (dbUpdateErr) {
        console.warn('Failed to update remote record status:', dbUpdateErr)
      }

      // Convert result to base64 and save locally
      let resultBase64 = ''
      try {
        resultBase64 = await urlToBase64(aiResult.url)
      } catch (e) {
        console.error('Failed to convert result image to base64:', e)
        resultBase64 = aiResult.url
      }

      await saveLocalUpload({
        id: tempUploadRecord.id,
        user_id: user.id,
        original_filename: selectedFile.name,
        file_size: selectedFile.size,
        original_url: originalBase64,
        status: 'completed',
        result_url: resultBase64
      })

      // Invalidate queries to update credits quota and history lists immediately
      queryClient.invalidateQueries({ queryKey: ['credits', user.id] })
      queryClient.invalidateQueries({ queryKey: ['uploads', user.id] })
      queryClient.invalidateQueries({ queryKey: ['uploads-full', user.id] })

      toast.success('Background removed successfully!')
      setResultUrl(resultBase64)
      setIsProcessing(false)
    } catch (err) {
      console.error(err)
      setError('Failed to remove background. Please try again.')
      toast.error('Failed to remove background. Please try again.')
      
      // Update upload log as failed if record exists
      if (tempUploadRecord) {
        try {
          await updateUploadRecord(tempUploadRecord.id, {
            status: 'failed',
            error_message: err.message || 'Unknown processing error',
          })
        } catch (dbErr) {
          console.warn('Failed to update remote record status to failed:', dbErr)
        }

        const fallbackBase64 = await fileToBase64(selectedFile).catch(() => '')
        await saveLocalUpload({
          id: tempUploadRecord.id,
          user_id: user.id,
          original_filename: selectedFile.name,
          file_size: selectedFile.size,
          original_url: fallbackBase64,
          status: 'failed',
          error_message: err.message || 'Unknown processing error'
        })

        // Invalidate queries to update logs and credits
        queryClient.invalidateQueries({ queryKey: ['credits', user.id] })
        queryClient.invalidateQueries({ queryKey: ['uploads', user.id] })
        queryClient.invalidateQueries({ queryKey: ['uploads-full', user.id] })
      }
      setIsUploading(false)
      setIsProcessing(false)
    }
  }

  const onDrop = React.useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (!file) return

    const validation = validateImageFile(file)
    if (!validation.valid) {
      toast.error(validation.error)
      return
    }

    // Revoke the old preview URL if any to free resources
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    setResultUrl(null)
    setError(null)
  }, [previewUrl])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': [],
    },
    maxFiles: 1,
    disabled: isUploading || isProcessing,
  })

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-extrabold font-heading text-white">Upload Workspace</h1>
        <p className="text-sm text-text-secondary mt-1">Upload an image to cleanly remove the background in less than 5 seconds.</p>
      </div>

      <div className="card p-8 bg-card border-card-border flex flex-col gap-8 items-center justify-center">
        {resultUrl ? (
          <div className="w-full flex flex-col gap-8 animate-fade-in">
            {/* Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {/* Original Image */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider text-center">Original Image</span>
                <div className="aspect-[4/3] w-full rounded-xl border border-card-border bg-background-secondary overflow-hidden flex items-center justify-center p-2">
                  <img src={previewUrl} className="h-full w-full object-contain rounded-lg" alt="Original" />
                </div>
              </div>

              {/* Background Removed Image */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider text-center">Background Removed Image</span>
                <div 
                  className="aspect-[4/3] w-full rounded-xl border border-card-border overflow-hidden flex items-center justify-center p-2"
                  style={{ backgroundImage: "radial-gradient(circle, #222222 10%, transparent 11%)", backgroundSize: "12px 12px", backgroundColor: "#0A0A0A" }}
                >
                  <img src={resultUrl} className="h-full w-full object-contain rounded-lg animate-fade-in" alt="Result cutout" />
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="divider" />
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center w-full">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white">Pristine quality PNG ready</span>
                <span className="text-xs text-text-muted mt-0.5">Transparent background, self-contained download</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  onClick={handleClearSelected}
                  className="btn-secondary px-6 py-2.5 flex items-center justify-center gap-2 cursor-pointer text-sm font-semibold transition-all duration-200"
                >
                  <RefreshCw className="h-4.5 w-4.5" />
                  Upload Another Image
                </button>
                <button
                  onClick={handleDownload}
                  className="btn-primary px-6 py-2.5 flex items-center justify-center gap-2 cursor-pointer text-sm font-semibold transition-all duration-200"
                >
                  <Download className="h-4.5 w-4.5" />
                  Download PNG
                </button>
              </div>
            </div>
          </div>
        ) : selectedFile ? (
          <div className="w-full flex flex-col md:flex-row gap-8 items-center md:items-start animate-fade-in">
            {/* Left Column: Image Preview */}
            <div className="w-full md:w-1/2 aspect-[4/3] rounded-xl border border-card-border bg-background-secondary overflow-hidden flex items-center justify-center p-2 relative group shadow-glow-hover transition-all duration-300">
              <img src={previewUrl} className="h-full w-full object-contain rounded-lg transition-transform duration-300 group-hover:scale-[1.02]" alt="Selected preview" />
            </div>

            {/* Right Column: Details & Actions */}
            <div className="w-full md:w-1/2 flex flex-col gap-6 justify-between self-stretch py-2">
              <div className="flex flex-col gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight break-all">
                    {selectedFile.name}
                  </h3>
                  <p className="text-xs text-text-muted mt-1.5">
                    Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>

                <div className="divider" />

                {isUploading || isProcessing ? (
                  <div className="w-full flex flex-col gap-3">
                    <div className="flex items-center justify-between text-xs text-text-secondary font-semibold">
                      <span>{isUploading ? `Uploading original asset (${progress}%)` : 'Removing Background...'}</span>
                      <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                    </div>
                    <div className="progress-bar w-full">
                      <div className="progress-fill" style={{ width: `${isUploading ? progress : 100}%` }} />
                    </div>
                    <p className="text-[11px] text-text-muted">
                      {isUploading ? 'Preparing secure temp logs...' : 'AI is isolating background elements. Usually takes < 5s.'}
                    </p>
                  </div>
                ) : error ? (
                  <div className="p-4 rounded-lg border border-error/20 bg-error/5 flex items-start gap-3">
                    <ShieldAlert className="h-5 w-5 text-error shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-semibold text-error font-heading">Error</span>
                      <p className="text-[11px] text-text-secondary leading-normal">
                        {error}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-lg border border-primary/20 bg-primary/5 flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-semibold text-white font-heading">Credit consumption</span>
                      <p className="text-[11px] text-text-secondary leading-normal">
                        This operation consumes 1 credit. Free users receive 5 lifetime credits.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-4 w-full">
                <button
                  onClick={handleClearSelected}
                  disabled={isUploading || isProcessing}
                  className="btn-secondary flex-1 flex items-center justify-center gap-2 py-2.5 cursor-pointer text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="h-4.5 w-4.5" />
                  Change Image
                </button>
                {isUploading || isProcessing ? (
                  <button
                    disabled
                    className="btn-primary flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold opacity-75 cursor-not-allowed"
                  >
                    <RefreshCw className="h-4.5 w-4.5 animate-spin" />
                    Removing Background...
                  </button>
                ) : error ? (
                  <button
                    onClick={handleProcess}
                    className="btn-primary flex-1 flex items-center justify-center gap-2 py-2.5 cursor-pointer text-sm font-semibold transition-all duration-200"
                  >
                    <RefreshCw className="h-4.5 w-4.5" />
                    Retry
                  </button>
                ) : (
                  <button
                    onClick={handleProcess}
                    className="btn-primary flex-1 flex items-center justify-center gap-2 py-2.5 cursor-pointer text-sm font-semibold transition-all duration-200"
                  >
                    <Sparkles className="h-4.5 w-4.5" />
                    Remove Background
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div 
            {...getRootProps()} 
            className={`upload-zone w-full p-16 flex flex-col items-center justify-center gap-4 text-center select-none hover:scale-[1.01] hover:shadow-glow-sm transition-all duration-300 ${
              isDragActive ? 'active' : ''
            }`}
          >
            <input {...getInputProps()} />
            <div className="p-4 rounded-full bg-primary/10 border border-primary/20 text-primary">
              <Upload className="h-8 w-8" />
            </div>
            <div>
              <p className="text-base font-semibold text-white">Drag & drop your image here</p>
              <p className="text-xs text-text-muted mt-1.5">or click to browse files on your device</p>
            </div>
            <div className="divider my-2 max-w-[200px]" />
            <p className="text-[10px] text-text-muted uppercase font-bold tracking-wider">
              JPG, PNG, or WEBP up to 10MB (max 5000x5000px)
            </p>
          </div>
        )}
      </div>

      {/* Safety Notice Banner */}
      <div className="card border-card-border p-4 bg-background-secondary flex items-start gap-3">
        <ShieldAlert className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-white">Temporary Storage Agreement</span>
          <p className="text-[11px] text-text-muted leading-relaxed">
            All files are deleted securely from our temporary buckets within 24 hours. They are not stored permanently.
          </p>
        </div>
      </div>
    </div>
  )
}
