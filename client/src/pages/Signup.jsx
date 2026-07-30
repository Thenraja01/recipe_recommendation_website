import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Mail, KeyRound, User, Lock, ArrowLeft, UtensilsCrossed, Loader2 } from 'lucide-react'
import api from '@/lib/api'

export default function Signup() {
  const [step, setStep] = useState('email') // email | otp | done
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
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
        if (c <= 1) { clearInterval(interval); return 0 }
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
      setError(err.response?.data?.message || 'Failed to send OTP')
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
      setError(err.response?.data?.message || 'Failed to resend OTP')
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
      // Manually set user since we bypassed the register() context method
      localStorage.setItem('user', JSON.stringify(data.user))
      navigate(from, { replace: true })
      window.location.reload()
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed')
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
    <div className="w-full min-h-[calc(100vh-4rem)] bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 border border-slate-100">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-green-100 text-green-600 mb-4 shadow-xl shadow-green-200">
            <UtensilsCrossed className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">
            Join <span className="text-green-600">RecipeRec</span>
          </h1>
          <p className="text-slate-400 font-medium mt-2">
            {step === 'email' ? 'Start with your email' : step === 'otp' ? 'Verify your email' : 'Create your account'}
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {step === 'email' && (
          <form onSubmit={handleSendOtp} className="grid gap-4">
            <div>
              <Label className="font-black uppercase tracking-widest text-xs text-slate-400">Email Address</Label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 rounded-2xl border-slate-200 focus-visible:ring-green-600 bg-slate-50/50"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={loading || !email.trim()}
              className="h-14 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-black uppercase tracking-[2px] shadow-2xl transition-all active:scale-95"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Mail className="h-5 w-5 mr-2" /> Send OTP</>}
            </Button>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-400 font-medium text-center mb-3">OR register directly</p>
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep('done')}
                className="w-full h-12 rounded-2xl border-slate-200"
              >
                Direct Registration
              </Button>
            </div>
            <div className="text-center">
              <p className="text-sm text-slate-500 font-medium">
                Already have an account?{' '}
                <Link to="/auth" className="text-green-600 underline font-black">Sign in</Link>
              </p>
            </div>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="grid gap-4">
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-2xl text-sm text-green-700 font-medium">
              <Mail className="h-4 w-4" />
              OTP sent to {email}
            </div>

            <div>
              <Label className="font-black uppercase tracking-widest text-xs text-slate-400">OTP Code</Label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 h-5 w-5" />
                <Input
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="h-14 pl-12 rounded-2xl border-slate-200 focus-visible:ring-green-600 bg-slate-50/50 text-center text-2xl tracking-[8px] font-bold"
                  maxLength={6}
                  required
                />
              </div>
            </div>

            <div>
              <Label className="font-black uppercase tracking-widest text-xs text-slate-400">Username</Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 h-5 w-5" />
                <Input
                  placeholder="your_username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-14 pl-12 rounded-2xl border-slate-200 focus-visible:ring-green-600 bg-slate-50/50"
                  required
                />
              </div>
            </div>

            <div>
              <Label className="font-black uppercase tracking-widest text-xs text-slate-400">Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 h-5 w-5" />
                <Input
                  type="password"
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-14 pl-12 rounded-2xl border-slate-200 focus-visible:ring-green-600 bg-slate-50/50"
                  minLength={6}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || otp.length !== 6 || !username.trim() || password.length < 6}
              className="h-14 rounded-2xl bg-slate-900 hover:bg-green-600 text-white font-black uppercase tracking-[2px] shadow-2xl transition-all active:scale-95"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Verify & Register'}
            </Button>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => { setStep('email'); setOtpSent(false) }}
                className="text-sm text-slate-400 hover:text-slate-600 flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-1" /> Change email
              </button>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={countdown > 0 || loading}
                className="text-sm text-green-600 hover:text-green-700 font-semibold disabled:text-slate-300"
              >
                {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
              </button>
            </div>
          </form>
        )}

        {step === 'done' && (
          <form onSubmit={handleDirectRegister} className="grid gap-4">
            <div>
              <Label className="font-black uppercase tracking-widest text-xs text-slate-400">Username</Label>
              <Input
                placeholder="your_username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-14 rounded-2xl border-slate-200 focus-visible:ring-green-600 bg-slate-50/50"
                required
              />
            </div>
            <div>
              <Label className="font-black uppercase tracking-widest text-xs text-slate-400">Email Address</Label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 rounded-2xl border-slate-200 focus-visible:ring-green-600 bg-slate-50/50"
                required
              />
            </div>
            <div>
              <Label className="font-black uppercase tracking-widest text-xs text-slate-400">Password</Label>
              <Input
                type="password"
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 rounded-2xl border-slate-200 focus-visible:ring-green-600 bg-slate-50/50"
                minLength={6}
                required
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="h-14 rounded-2xl bg-slate-900 hover:bg-green-600 text-white font-black uppercase tracking-[2px] shadow-2xl transition-all active:scale-95"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
            <div className="text-center">
              <p className="text-sm text-slate-500 font-medium">
                Back to{' '}
                <button type="button" onClick={() => setStep('email')} className="text-green-600 underline font-black">
                  OTP registration
                </button>
                {' '}or{' '}
                <Link to="/auth" className="text-green-600 underline font-black">Sign in</Link>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
