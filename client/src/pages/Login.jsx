import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { BsGithub, BsGoogle } from 'react-icons/bs'
import api from '@/lib/api'
import { useNavigate } from 'react-router-dom'
import { UtensilsCrossed, User } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', { email, password })
      localStorage.setItem('token', data.token || 'dummy_token') 
      localStorage.setItem('user', JSON.stringify(data.user || { username: 'Member' }))
      alert('Login successful!')
      navigate('/')
    } catch (err) {
      console.error('Login error:', err)
      alert(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGuestAccess = () => {
    localStorage.setItem('userType', 'guest')
    alert('Welcome, Guest!')
    navigate('/')
  }

  return (
    <div className='w-full h-full m-auto bg-slate-50 flex items-center justify-center p-6'>
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 border border-slate-100">
        <div className="text-center mb-8">
            <div className="inline-flex p-3 rounded-2xl bg-green-100 text-green-600 mb-4 shadow-xl shadow-green-200">
                <UtensilsCrossed className="h-8 w-8" />
            </div>
            <h1 className='text-3xl font-black text-slate-900 uppercase italic tracking-tighter'>Digital Menu <span className="text-green-600">Access</span></h1>
            <p className="text-slate-400 font-medium">Log in to your account for rewards</p>
        </div>

        <form onSubmit={handleLogin} className="grid gap-4">
            <div className="form-inputs">
                <Label htmlFor="email" className="font-black uppercase tracking-widest text-xs text-slate-400">Email Address</Label>
                <Input 
                    id="email"
                    type="email"
                    placeholder="E.g. burger@lover.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 rounded-2xl border-slate-200 focus-visible:ring-green-600 bg-slate-50/50"
                    required
                />
            </div>

            <div className="form-inputs">
                <Label htmlFor="password" className="font-black uppercase tracking-widest text-xs text-slate-400">Security Key</Label>
                <Input 
                    id="password"
                    placeholder="••••••••" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-14 rounded-2xl border-slate-200 focus-visible:ring-green-600 bg-slate-50/50"
                    required
                />
            </div>
            
            <Button disabled={loading} type="submit" className="h-16 rounded-2xl bg-slate-900 hover:bg-green-600 text-white font-black uppercase tracking-[2px] shadow-2xl transition-all active:scale-95">
                {loading ? 'Validating...' : 'Log in Now'}
            </Button>

            <div className="relative my-4">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-4 text-slate-400 font-bold tracking-widest">or quick access</span></div>
            </div>

            <Button 
                onClick={handleGuestAccess}
                type="button" 
                variant="outline" 
                className="h-14 rounded-2xl border-2 border-slate-100 text-slate-600 font-black uppercase tracking-widest hover:bg-slate-50 flex items-center justify-center transition-all group"
            >
                <User className="h-5 w-5 mr-3 group-hover:text-green-600 transition-colors" />
                Continue as Guest
            </Button>

            <div className="mt-8 text-center">
                <h2 className='text-sm text-slate-500 font-medium'>
                    New around here? <Link to="register" className='text-green-600 cursor-pointer underline font-black'>Join our Club</Link>
                </h2>
            </div>
        </form>
      </div>
    </div>
  )
}



