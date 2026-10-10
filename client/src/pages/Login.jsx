import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import {
  UtensilsCrossed,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
} from 'lucide-react'
import AuthFoodShowcase from '@/components/AuthFoodShowcase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const from = location.state?.from?.pathname || '/'

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex flex-col lg:flex-row bg-slate-50">
      {/* ========================================================
          LEFT SIDE: DYNAMIC FOOD IMAGE SHOWCASE
      ======================================================== */}
      <AuthFoodShowcase badge="AI Kitchen" />

      {/* ========================================================
          RIGHT SIDE: AUTHENTICATION FORM LAYOUT
      ======================================================== */}
      <div className="w-full lg:w-5/12 xl:w-5/12 flex items-center justify-center p-6 sm:p-10 lg:p-14 bg-white">
        <div className="w-full max-w-md">
          {/* Brand Header */}
          <div className="mb-8 text-left">
            <Link to="/" className="inline-flex items-center space-x-2 mb-6 group">
              <div className="p-2.5 rounded-2xl bg-orange-100 text-[#ff751f] group-hover:scale-105 transition-transform shadow-md">
                <UtensilsCrossed className="h-6 w-6" />
              </div>
              <span className="font-anton text-2xl tracking-normal text-gray-900 uppercase">
                Recipe<span className="text-[#ff751f]">Rec</span>
              </span>
            </Link>

            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-gray-500 text-sm sm:text-base mt-2">
              Sign in to unlock your personalized AI recommendations and saved recipes.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 animate-in fade-in duration-200">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div>
              <Label
                htmlFor="email"
                className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-2"
              >
                Email Address
              </Label>
              <div className="relative flex items-center">
                <Mail className="absolute left-4 text-gray-400 h-5 w-5 pointer-events-none" />
                <Input
                  id="email"
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

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label
                  htmlFor="password"
                  className="block text-xs font-black uppercase tracking-wider text-gray-700"
                >
                  Password
                </Label>
                <Link
                  to="/auth"
                  className="text-xs font-bold text-[#1800ad] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative flex items-center">
                <Lock className="absolute left-4 text-gray-400 h-5 w-5 pointer-events-none" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-13 pl-12 pr-12 rounded-2xl border-gray-200 bg-gray-50/60 focus:bg-white text-gray-900 text-sm focus-visible:ring-2 focus-visible:ring-black transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-gray-400 hover:text-gray-700 transition-colors focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center space-x-2.5 cursor-pointer text-sm text-gray-600 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-black border-gray-300 focus:ring-black focus:ring-offset-0 cursor-pointer"
                />
                <span className="font-medium">Keep me signed in</span>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              disabled={loading}
              type="submit"
              className="w-full h-13 rounded-2xl bg-black hover:bg-gray-800 text-white font-extrabold text-base uppercase tracking-wider shadow-xl transition-all duration-200 active:scale-[0.99] flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </Button>

            {/* Sign Up Link */}
            <div className="pt-4 text-center border-t border-gray-100">
              <p className="text-sm text-gray-600 font-medium">
                Don't have an account yet?{' '}
                <Link
                  to="/auth/signup"
                  className="text-[#ff751f] hover:text-[#d4560a] font-extrabold transition-colors ml-1"
                >
                  Create free account
                </Link>
              </p>
            </div>

            {/* Security Badge */}
            <div className="pt-2 flex items-center justify-center gap-2 text-xs text-gray-400">
              <ShieldCheck className="h-4 w-4 text-green-600" />
              <span>Secure, encrypted login powered by RecipeRec</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
