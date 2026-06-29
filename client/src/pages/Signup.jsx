import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { UtensilsCrossed } from 'lucide-react'

export default function Signup() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const { register } = useAuth()

  const from = location.state?.from?.pathname || '/'

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await register(username, email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Registration failed. Please try again.')
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
            Create an account to save recipes, write blogs, and chat with our AI chef
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="grid gap-4">
          <div className="form-inputs">
            <Label htmlFor="username" className="font-black uppercase tracking-widest text-xs text-slate-400">
              Username
            </Label>
            <Input
              id="username"
              placeholder="your_username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-14 rounded-2xl border-slate-200 focus-visible:ring-green-600 bg-slate-50/50"
              required
            />
          </div>

          <div className="form-inputs">
            <Label htmlFor="email" className="font-black uppercase tracking-widest text-xs text-slate-400">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-14 rounded-2xl border-slate-200 focus-visible:ring-green-600 bg-slate-50/50"
              required
            />
          </div>

          <div className="form-inputs">
            <Label htmlFor="password" className="font-black uppercase tracking-widest text-xs text-slate-400">
              Password
            </Label>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-14 rounded-2xl border-slate-200 focus-visible:ring-green-600 bg-slate-50/50"
              minLength={6}
              required
            />
          </div>

          <Button
            disabled={loading}
            type="submit"
            className="h-14 rounded-2xl bg-slate-900 hover:bg-green-600 text-white font-black uppercase tracking-[2px] shadow-2xl transition-all active:scale-95"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500 font-medium">
              Already have an account?{' '}
              <Link to="/auth" className="text-green-600 underline font-black">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
