import { supabase } from '../lib/supabase'

// ========================
// PROFILE SERVICES
// ========================

export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) throw error
  return data
}

export async function updateProfile(userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  if (error) throw error
  return data
}

// ========================
// CREDITS SERVICES
// ========================

export async function getCredits(userId) {
  const { data, error } = await supabase
    .from('credits')
    .select('*')
    .eq('user_id', userId)
    .single()
  if (error) throw error
  return data
}

export async function checkAndDecrementCredit(userId) {
  // First check current credits
  const credits = await getCredits(userId)

  // Check if user has available credits
  if (credits.plan === 'free' && credits.used_credits >= credits.total_credits) {
    throw new Error('All 5 free credits have been used. Upgrade to Pro for unlimited processing.')
  }

  if (credits.plan === 'pro') return true // Unlimited

  // Decrement
  const { error } = await supabase
    .from('credits')
    .update({ used_credits: credits.used_credits + 1 })
    .eq('user_id', userId)

  if (error) throw error
  return true
}

// ========================
// UPLOAD SERVICES
// ========================

export async function createUploadRecord(userId, data) {
  const { data: record, error } = await supabase
    .from('uploads')
    .insert({
      user_id: userId,
      original_url: data.originalUrl,
      cloudinary_original_id: data.cloudinaryId,
      original_filename: data.filename,
      file_size: data.fileSize,
      status: 'pending',
    })
    .select()
    .single()
  if (error) throw error
  return record
}

export async function updateUploadRecord(uploadId, updates) {
  const { data, error } = await supabase
    .from('uploads')
    .update(updates)
    .eq('id', uploadId)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getUploads(userId, days = 7) {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)

  const { data, error } = await supabase
    .from('uploads')
    .select('*')
    .eq('user_id', userId)
    .gte('created_at', cutoff.toISOString())
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getUploadById(uploadId) {
  const { data, error } = await supabase
    .from('uploads')
    .select('*')
    .eq('id', uploadId)
    .single()
  if (error) throw error
  return data
}

// ========================
// SUBSCRIPTION SERVICES
// ========================

export async function getSubscription(userId) {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single()
  if (error && error.code !== 'PGRST116') throw error
  return data
}

// ========================
// TRANSACTION SERVICES
// ========================

export async function getTransactions(userId) {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20)
  if (error) throw error
  return data
}

// ========================
// API KEYS SERVICES
// ========================

export async function getApiKeys(userId) {
  const { data, error } = await supabase
    .from('api_keys')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function createApiKey(userId, name, keyHash, keyPrefix) {
  const { data, error } = await supabase
    .from('api_keys')
    .insert({ user_id: userId, name, key_hash: keyHash, key_prefix: keyPrefix })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function revokeApiKey(keyId, userId) {
  const { error } = await supabase
    .from('api_keys')
    .update({ is_active: false })
    .eq('id', keyId)
    .eq('user_id', userId)
  if (error) throw error
}

// ========================
// ADMIN SERVICES
// ========================

export async function getAdminStats() {
  const { data, error } = await supabase
    .from('admin_stats')
    .select('*')
    .single()
  if (error) throw error
  return data
}

export async function getAllUsers(page = 1, limit = 20) {
  const from = (page - 1) * limit
  const { data, error, count } = await supabase
    .from('profiles')
    .select('*, credits(*)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, from + limit - 1)
  if (error) throw error
  return { data, count }
}

export async function getAllUploads(page = 1, limit = 20) {
  const from = (page - 1) * limit
  const { data, error, count } = await supabase
    .from('uploads')
    .select('*, profiles(email, full_name)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, from + limit - 1)
  if (error) throw error
  return { data, count }
}

export async function getAllTransactions(page = 1, limit = 20) {
  const from = (page - 1) * limit
  const { data, error, count } = await supabase
    .from('transactions')
    .select('*, profiles(email, full_name)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, from + limit - 1)
  if (error) throw error
  return { data, count }
}

export async function getLogs(page = 1, limit = 50) {
  const from = (page - 1) * limit
  const { data, error, count } = await supabase
    .from('logs')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, from + limit - 1)
  if (error) throw error
  return { data, count }
}
