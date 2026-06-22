import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { createOrder, loadRazorpay, openRazorpayCheckout } from '../../services/n8n.service'
import { Coins, Check, AlertCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function CreditsPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [loadingId, setLoadingId] = React.useState(null)

  const creditPacks = [
    {
      id: 'credits_pack_20',
      name: 'Starter Pack',
      credits: 20,
      price: '₹99',
      cost: 9900,
      badge: 'Bestseller',
      description: 'Ideal for occasional high-res outputs.',
    },
    {
      id: 'credits_pack_100',
      name: 'Bulk Pack',
      credits: 100,
      price: '₹199',
      cost: 19900,
      badge: 'Super Value',
      description: 'Ideal for medium ecommerce operations.',
    },
    {
      id: 'credits_pack_500',
      name: 'Professional Pack',
      credits: 500,
      price: '₹799',
      cost: 79900,
      badge: 'Bulk Discount',
      description: 'Perfect for regular professional designers.',
    },
  ]

  const handlePurchase = async (pack) => {
    if (!user) {
      toast.error('Sign in to purchase credit packs.')
      navigate('/login')
      return
    }

    setLoadingId(pack.id)
    try {
      const scriptLoaded = await loadRazorpay()
      if (!scriptLoaded) {
        toast.error('Failed to initialize Payment Gateway.')
        setLoadingId(null)
        return
      }

      // Create Order payload for credits
      const orderData = await createOrder({
        userId: user.id,
        userEmail: user.email,
        planId: pack.id,
        amount: pack.cost,
      })

      const checkoutOptions = {
        name: 'SnapCut AI',
        description: `Purchase ${pack.name} — ${pack.credits} Credits`,
        image: 'https://snapcut.ai/logo.png',
        order_id: orderData.orderId,
        prefill: {
          email: user.email,
        },
        notes: {
          userId: user.id,
          planId: pack.id,
        },
      }

      await openRazorpayCheckout(checkoutOptions)
      toast.success('Credits purchase authorized! Check dashboard in a moment.')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.message || 'Payment flow cancelled.')
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold font-heading text-white">Purchase Credits</h1>
        <p className="text-sm text-text-secondary mt-1">Buy one-off credits to process full-resolution background removal. Credits never expire.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch mt-4">
        {creditPacks.map((pack) => (
          <div key={pack.id} className="card p-6 bg-card border-card-border flex flex-col justify-between gap-6 relative">
            {pack.badge && (
              <span className="absolute -top-3 left-4 bg-primary text-black text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                {pack.badge}
              </span>
            )}

            <div>
              <h3 className="text-lg font-bold text-white">{pack.name}</h3>
              <p className="text-xs text-text-muted mt-1">{pack.description}</p>
              
              <div className="flex items-baseline gap-2 mt-6">
                <span className="text-4xl font-extrabold text-primary">{pack.credits}</span>
                <span className="text-xs text-text-muted uppercase font-bold tracking-wider">Credits</span>
              </div>

              <div className="text-xl font-bold text-white mt-2">{pack.price}</div>
            </div>

            <button
              disabled={loadingId === pack.id}
              onClick={() => handlePurchase(pack)}
              className="w-full btn-primary py-2.5 text-xs font-semibold cursor-pointer"
            >
              {loadingId === pack.id ? 'Connecting...' : 'Buy Now'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
