import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import api from '@/lib/api'
import { useNavigate, Link } from 'react-router-dom'

export default function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await api.post('/auth/register', { username, email, password })
      console.log('Registration successful:', data)
      alert('Registration successful! Please login.')
      navigate('/auth')
    } catch (err) {
      console.error('Registration error:', err)
      alert(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='w-full h-full m-auto'>
      <form onSubmit={handleRegister} className="grid p-4 mx-10 min-h-full content-center gap-4">
        <h1 className='text-center font-bold text-2xl mb-4'>Create Account</h1>
        
        <div className="form-inputs">
          <Label htmlFor="username">Username</Label>
          <Input 
            id="username"
            placeholder="enter your username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-inputs">
          <Label htmlFor="email">Email Address</Label>
          <Input 
            id="email"
            type="email"
            placeholder="enter your email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-inputs">
          <Label htmlFor="password">Password</Label>
          <Input 
            id="password"
            placeholder="enter your password" 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <Button disabled={loading} type="submit" className="mt-2">
          {loading ? 'Creating...' : 'Register'}
        </Button>

        <div className="mt-4">
          <p className='text-center font-semibold'>
            Already have an account? <Link to="/auth" className='text-blue-600 underline'>Login</Link>
          </p>
        </div>
      </form>
    </div>
  )
}
