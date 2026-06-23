import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { checkAndDecrementCredit } from '../../services/supabase.service'
import { createOrder, loadRazorpay, openRazorpayCheckout } from '../../services/n8n.service'
import { Check, Info, Sparkles, Crown, Zap, ArrowRight } from 'lucide-react'
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
      icon: Zap,
      gradient: 'from-slate-500 to-slate-600',
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
      icon: Crown,
      gradient: 'from-amber-500 to-amber-600',
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
      icon: Sparkles,
      gradient: 'from-sky-500 to-cyan-500',
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
    <div className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-bg" />
      <div className="orb orb-primary w-[500px] h-[500px] -top-40 left-1/3" />
      <div className="orb orb-accent w-[400px] h-[400px] bottom-20 right-0" />

      <div className="relative z-10 py-24 px-4 sm:px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/15 bg-primary/5 text-xs text-primary-hover mb-6 font-medium">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Simple Pricing</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading mb-6 leading-tight">
            Affordable, <span className="gradient-text-warm">Simple</span> Pricing
          </h1>
          <p className="text-text-muted max-w-xl mx-auto text-sm sm:text-base">
            Start for free, upgrade as you grow. Choose between recurring subscriptions or simple bulk credit packs.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan, idx) => {
            const Icon = plan.icon
            return (
              <div 
                key={plan.id}
                className={`relative flex flex-col justify-between transition-all duration-300 animate-fade-in-up hover:scale-[1.03] ${
                  plan.isPopular 
                    ? 'card-highlight p-8 shadow-glow hover:shadow-glow-lg' 
                    : 'card p-8 hover:shadow-card-hover hover:border-primary/20'
                }`}
                style={{ animationDelay: `${idx * 0.1}s`, opacity: 0, animationFillMode: 'forwards' }}
              >
                {plan.isPopular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-primary text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-glow-sm">
                    Most Popular
                  </span>
                )}
                <div>
                  {/* Plan icon */}
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${plan.gradient} w-fit mb-5 shadow-lg`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-1.5">{plan.name}</h3>
                  <p className="text-xs text-text-muted mb-6">{plan.description}</p>
                  
                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                    {plan.period && <span className="text-sm text-text-muted">{plan.period}</span>}
                  </div>

                  <div className="divider mb-8" />

                  <ul className="flex flex-col gap-4 text-sm text-text-secondary mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <div className="h-5 w-5 rounded-full bg-success/10 border border-success/20 flex items-center justify-center flex-shrink-0">
                          <Check className="h-3 w-3 text-success" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  disabled={loadingPlan === plan.id}
                  onClick={() => handlePlanSelect(plan)}
                  className={`w-full py-3.5 rounded-xl text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 group ${
                    plan.isPopular 
                      ? 'btn-primary' 
                      : 'bg-background-tertiary border text-white hover:bg-card-solid hover:shadow-glow-sm'
                  }`}
                  style={!plan.isPopular ? { borderColor: 'var(--card-border)' } : {}}
                  id={`plan-select-${plan.id}`}
                >
                  {loadingPlan === plan.id ? 'Processing...' : (
                    <>
                      {plan.cta}
                      {plan.isPopular && <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                    </>
                  )}
                </button>
              </div>
            )
          })}
        </div>

        {/* Tax/Refund Note */}
        <div className="mt-12 text-center max-w-md mx-auto flex items-center gap-2.5 justify-center text-xs text-text-muted">
          <Info className="h-4 w-4 shrink-0 text-primary" />
          <span>Prices are in INR. Tax added during checkout. Refund policy applies to purchases within 7 days.</span>
        </div>
      </div>
    </div>
  )
}
