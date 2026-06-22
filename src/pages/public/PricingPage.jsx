import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { checkAndDecrementCredit } from '../../services/supabase.service'
import { createOrder, loadRazorpay, openRazorpayCheckout } from '../../services/n8n.service'
import { Check, Info } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function PricingPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [loadingPlan, setLoadingPlan] = React.useState(null)

  const plans = [
    {
      id: 'free',
      name: 'Free Plan',
      price: '₹0',
      description: 'Ideal for casual editing, cropping, and personal projects.',
      features: [
        '5 free downloads daily',
        'Standard resolution previews',
        'Auto-delete after 24 hours',
        'Basic community support',
      ],
      cta: 'Current Plan',
      isPopular: false,
    },
    {
      id: 'pro_monthly',
      name: 'Pro Monthly',
      price: '₹499',
      period: '/ month',
      description: 'Perfect for creators, freelancers, and growing eCommerce shops.',
      features: [
        'Unlimited background removals',
        'Full high-resolution exports (5000x5000)',
        'B2B API credentials (100 reqs/min)',
        'Priority email support',
        'Priority queue processing',
      ],
      cta: 'Upgrade to Pro',
      isPopular: true,
    },
    {
      id: 'credits_pack_100',
      name: '100 Credits Pack',
      price: '₹199',
      description: 'One-off credit purchase for bulk processing tasks.',
      features: [
        '100 high-res exports',
        'Credits never expire',
        'Full high-resolution exports',
        'Priority queue processing',
        'No monthly recurring billing',
      ],
      cta: 'Buy Credits Pack',
      isPopular: false,
    },
  ]

  const handlePlanSelect = async (plan) => {
    if (!user) {
      toast.error('Please login or register to choose a plan.')
      navigate('/login')
      return
    }

    if (plan.id === 'free') {
      navigate('/dashboard')
      return
    }

    setLoadingPlan(plan.id)
    try {
      const scriptLoaded = await loadRazorpay()
      if (!scriptLoaded) {
        toast.error('Failed to load payment gateway checkout.')
        setLoadingPlan(null)
        return
      }

      // 1. Create Order via n8n webhook
      const orderData = await createOrder({
        userId: user.id,
        userEmail: user.email,
        planId: plan.id,
        amount: plan.id === 'pro_monthly' ? 49900 : 19900, // in paise
      })

      // 2. Open Razorpay Checkout Modal
      const checkoutOptions = {
        name: 'SnapCut AI',
        description: `Upgrade to ${plan.name}`,
        image: 'https://snapcut.ai/logo.png',
        order_id: orderData.orderId,
        prefill: {
          email: user.email,
        },
        notes: {
          userId: user.id,
          planId: plan.id,
        },
      }

      const paymentResponse = await openRazorpayCheckout(checkoutOptions)
      
      // Verification is usually handled via Razorpay Webhook to n8n, 
      // but we show optimistic success to the user.
      toast.success('Payment authorized successfully! Your credits are being updated.')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.message || 'Payment flow cancelled or failed.')
    } finally {
      setLoadingPlan(null)
    }
  }

  return (
    <div className="py-20 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-extrabold font-heading mb-4 gradient-text-warm">
          Affordable, Simple Pricing
        </h1>
        <p className="text-text-secondary max-w-xl mx-auto">
          Start for free, upgrade as you grow. Choose between recurring subscriptions or simple bulk credits packs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            className={`card p-8 flex flex-col justify-between relative ${
              plan.isPopular ? 'border-primary shadow-glow bg-card' : 'border-card-border bg-card'
            }`}
          >
            {plan.isPopular && (
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Most Popular
              </span>
            )}
            <div>
              <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
              <p className="text-xs text-text-muted mb-6">{plan.description}</p>
              
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                {plan.period && <span className="text-sm text-text-muted">{plan.period}</span>}
              </div>

              <div className="divider mb-8" />

              <ul className="flex flex-col gap-4 text-sm text-text-secondary mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2.5">
                    <Check className="h-4.5 w-4.5 text-success shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              disabled={loadingPlan === plan.id}
              onClick={() => handlePlanSelect(plan)}
              className={`w-full py-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                plan.isPopular 
                  ? 'btn-primary' 
                  : 'bg-background-secondary border border-card-border text-white hover:bg-card'
              }`}
            >
              {loadingPlan === plan.id ? 'Processing...' : plan.cta}
            </button>
          </div>
        ))}
      </div>

      {/* Tax/Refund Note */}
      <div className="mt-12 text-center max-w-md mx-auto flex items-center gap-2 justify-center text-xs text-text-muted">
        <Info className="h-4 w-4 shrink-0 text-primary" />
        <span>Prices are in INR. Tax added during checkout. Refund policy applies to purchases within 7 days.</span>
      </div>
    </div>
  )
}
