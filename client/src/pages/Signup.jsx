import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import {
  Mail,
  KeyRound,
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  UtensilsCrossed,
  Loader2,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react'
import api from '@/lib/api'
import AuthFoodShowcase from '@/components/AuthFoodShowcase'

export default function Signup() {
  const [step, setStep] = useState('email') // email | otp | done
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const navigate = useNavigate()
  const location = useLocation()
  const { register } = useAuth()

  const from = location.state?.from?.pathname || '/'

  const startCountdown = () => {
    setCountdown(60)
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(interval)
          return 0
        }
        return c - 1
      })
    }, 1000)
  }

  const handleSendOtp = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError('')
    try {
      await api.post('/auth/send-otp', { email })
      setOtpSent(true)
      startCountdown()
      setStep('otp')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send verification code')
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (countdown > 0) return
    setLoading(true)
    setError('')
    try {
      await api.post('/auth/send-otp', { email })
      startCountdown()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend verification code')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    if (!otp.trim() || !username.trim() || !password.trim()) {
      setError('Please fill in all fields')
      return
    }
    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/auth/verify-otp', { email, otp, username, password })
      if (data.token) {
        localStorage.setItem('token', data.token)
      }
      localStorage.setItem('user', JSON.stringify(data.user))
      navigate(from, { replace: true })
      window.location.reload()
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Please check the code.')
    } finally {
      setLoading(false)
    }
  }

  const handleDirectRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await register(username, email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex flex-col lg:flex-row bg-slate-50">
      {/* ========================================================
          LEFT SIDE: DYNAMIC FOOD IMAGE SHOWCASE
      ======================================================== */}
      <AuthFoodShowcase badge="Join RecipeRec" />

      {/* ========================================================
          RIGHT SIDE: SIGNUP AUTH LAYOUT
      ======================================================== */}
      <div className="w-full lg:w-5/12 xl:w-5/12 flex items-center justify-center p-6 sm:p-10 lg:p-14 bg-white">
        <div className="w-full max-w-md">
          {/* Brand Header */}
          <div className="mb-6 text-left">
            <Link to="/" className="inline-flex items-center space-x-2 mb-4 group">
              <div className="p-2.5 rounded-2xl bg-orange-100 text-[#ff751f] group-hover:scale-105 transition-transform shadow-md">
                <UtensilsCrossed className="h-6 w-6" />
              </div>
              <span className="font-anton text-2xl tracking-normal text-gray-900 uppercase">
                Recipe<span className="text-[#ff751f]">Rec</span>
              </span>
            </Link>

            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              Create an Account
            </h1>
            <p className="text-gray-500 text-sm mt-1.5">
              {step === 'email'
                ? 'Sign up to unlock personalized recipes, AI chef chat, and blogs.'
                : step === 'otp'
                ? `Enter the 6-digit verification code sent to ${email}`
                : 'Direct account registration without OTP verification.'}
            </p>

            {/* Stepper Indicator */}
            <div className="flex items-center gap-2 mt-4">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                  step === 'email'
                    ? 'bg-black text-white'
                    : 'bg-green-100 text-green-800'
                }`}
              >
                1. Email
              </span>
              <span className="text-gray-300">→</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                  step === 'otp'
                    ? 'bg-black text-white'
                    : step === 'done'
                    ? 'bg-gray-100 text-gray-500'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                2. Verify & Profile
              </span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 animate-in fade-in duration-200">
              {error}
            </div>
          )}

          {/* ==============================================
              STEP 1: EMAIL VERIFICATION
          ============================================== */}
          {step === 'email' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <Label
                  htmlFor="signup-email"
                  className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-2"
                >
                  Email Address
                </Label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-4 text-gray-400 h-5 w-5 pointer-events-none" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-13 pl-12 pr-4 rounded-2xl border-gray-200 bg-gray-50/60 focus:bg-white text-gray-900 text-sm focus-visible:ring-2 focus-visible:ring-black transition-all"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading || !email.trim()}
                className="w-full h-13 rounded-2xl bg-black hover:bg-gray-800 text-white font-extrabold text-base uppercase tracking-wider shadow-xl transition-all duration-200 active:scale-[0.99] flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Sending code...</span>
                  </>
                ) : (
                  <>
                    <Mail className="h-5 w-5 mr-1" />
                    <span>Send Verification Code</span>
                  </>
                )}
              </Button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setStep('done')}
                  className="text-xs font-bold text-gray-500 hover:text-black underline transition-colors"
                >
                  Or register directly with password
                </button>
              </div>

              <div className="pt-4 text-center border-t border-gray-100">
                <p className="text-sm text-gray-600 font-medium">
                  Already have an account?{' '}
                  <Link
                    to="/auth"
                    className="text-[#ff751f] hover:text-[#d4560a] font-extrabold transition-colors ml-1"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </form>
          )}

          {/* ==============================================
              STEP 2: OTP + USERNAME + PASSWORD
          ============================================== */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-2xl text-xs sm:text-sm text-green-800 font-semibold">
                <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                <span>Verification code sent to {email}</span>
              </div>

              {/* OTP Input */}
              <div>
                <Label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-1.5">
                  6-Digit OTP Code
                </Label>
                <div className="relative flex items-center">
                  <KeyRound className="absolute left-4 text-gray-400 h-5 w-5 pointer-events-none" />
                  <Input
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="h-13 pl-12 pr-4 rounded-2xl border-gray-200 bg-gray-50/60 focus:bg-white text-gray-900 text-center text-xl tracking-[6px] font-bold focus-visible:ring-2 focus-visible:ring-black"
                    maxLength={6}
                    required
                    autoFocus
                  />
                </div>
              </div>

              {/* Username Input */}
              <div>
                <Label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-1.5">
                  Username
                </Label>
                <div className="relative flex items-center">
                  <User className="absolute left-4 text-gray-400 h-5 w-5 pointer-events-none" />
                  <Input
                    placeholder="chef_alex"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-13 pl-12 pr-4 rounded-2xl border-gray-200 bg-gray-50/60 focus:bg-white text-gray-900 text-sm focus-visible:ring-2 focus-visible:ring-black"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <Label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-1.5">
                  Create Password
                </Label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-4 text-gray-400 h-5 w-5 pointer-events-none" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-13 pl-12 pr-12 rounded-2xl border-gray-200 bg-gray-50/60 focus:bg-white text-gray-900 text-sm focus-visible:ring-2 focus-visible:ring-black"
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading || otp.length !== 6 || !username.trim() || password.length < 6}
                className="w-full h-13 rounded-2xl bg-black hover:bg-gray-800 text-white font-extrabold text-base uppercase tracking-wider shadow-xl transition-all duration-200 active:scale-[0.99] flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Verifying & creating account...</span>
                  </>
                ) : (
                  <span>Verify & Complete Registration</span>
                )}
              </Button>

              {/* Actions: change email / resend */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setStep('email')
                    setOtpSent(false)
                  }}
                  className="text-xs font-bold text-gray-500 hover:text-black flex items-center transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Change email
                </button>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={countdown > 0 || loading}
                  className="text-xs font-bold text-[#ff751f] hover:text-[#d4560a] disabled:text-gray-400 transition-colors"
                >
                  {countdown > 0 ? `Resend code in ${countdown}s` : 'Resend Code'}
                </button>
              </div>
            </form>
          )}

          {/* ==============================================
              STEP 3: DIRECT REGISTRATION
          ============================================== */}
          {step === 'done' && (
            <form onSubmit={handleDirectRegister} className="space-y-4">
              <div>
                <Label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-1.5">
                  Username
                </Label>
                <div className="relative flex items-center">
                  <User className="absolute left-4 text-gray-400 h-5 w-5 pointer-events-none" />
                  <Input
                    placeholder="your_username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-13 pl-12 pr-4 rounded-2xl border-gray-200 bg-gray-50/60 focus:bg-white text-gray-900 text-sm focus-visible:ring-2 focus-visible:ring-black"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <Label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-1.5">
                  Email Address
                </Label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-4 text-gray-400 h-5 w-5 pointer-events-none" />
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-13 pl-12 pr-4 rounded-2xl border-gray-200 bg-gray-50/60 focus:bg-white text-gray-900 text-sm focus-visible:ring-2 focus-visible:ring-black"
                    required
                  />
                </div>
              </div>

              <div>
                <Label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-1.5">
                  Password
                </Label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-4 text-gray-400 h-5 w-5 pointer-events-none" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-13 pl-12 pr-12 rounded-2xl border-gray-200 bg-gray-50/60 focus:bg-white text-gray-900 text-sm focus-visible:ring-2 focus-visible:ring-black"
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-13 rounded-2xl bg-black hover:bg-gray-800 text-white font-extrabold text-base uppercase tracking-wider shadow-xl transition-all duration-200 active:scale-[0.99] flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <span>Create Account</span>
                )}
              </Button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="text-xs font-bold text-gray-500 hover:text-black underline transition-colors"
                >
                  ← Switch back to Email verification
                </button>
              </div>

              <div className="pt-4 text-center border-t border-gray-100">
                <p className="text-sm text-gray-600 font-medium">
                  Already have an account?{' '}
                  <Link
                    to="/auth"
                    className="text-[#ff751f] hover:text-[#d4560a] font-extrabold transition-colors ml-1"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          )}

          {/* Security Badge */}
          <div className="pt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
            <ShieldCheck className="h-4 w-4 text-green-600" />
            <span>Secure registration powered by RecipeRec</span>
          </div>
        </div>
      </div>
    </div>
  )
}
