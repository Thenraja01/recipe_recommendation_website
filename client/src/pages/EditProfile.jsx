import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Camera, Save, Loader2, ArrowLeft, Leaf, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import api from '@/lib/api'
import { useAuth } from '@/context/AuthContext'

export default function EditProfile() {
  const { user, refreshUser } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    avatar: '',
    dietary: 'ANY',
    allergens: ''
  })

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        avatar: user.avatar || '',
        dietary: user.preferences?.dietary || 'ANY',
        allergens: user.preferences?.allergens?.join(', ') || ''
      })
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.put('/auth/profile', {
        username: formData.username,
        email: formData.email,
        avatar: formData.avatar
      })
      
      await api.put('/auth/preferences', {
        dietary: formData.dietary,
        allergens: formData.allergens.split(',').map(a => a.trim()).filter(a => a)
      })
      
      await refreshUser()
      navigate('/profile')
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" onClick={() => navigate('/profile')} className="mb-6 text-gray-700 hover:text-green-600">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Profile
        </Button>

        <Card className="border-none shadow-xl">
          <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-3xl">
            <CardTitle className="text-2xl flex items-center gap-2">
              <User className="h-6 w-6" /> Edit Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="username">Username *</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="mt-2"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-2 h-12 rounded-xl"
                  required
                />
              </div>

              <div>
                <Label htmlFor="avatar">Avatar URL</Label>
                <div className="relative mt-2">
                  <Camera className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="avatar"
                    value={formData.avatar}
                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                    placeholder="https://example.com/avatar.jpg"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-green-600" /> Dietary Preferences
                </h3>
                
                <div>
                  <Label htmlFor="dietary">Dietary Type</Label>
                  <select
                    id="dietary"
                    value={formData.dietary}
                    onChange={(e) => setFormData({ ...formData, dietary: e.target.value })}
                    className="w-full mt-2 p-3 border rounded-xl"
                  >
                    <option value="ANY">No Restrictions</option>
                    <option value="VEG">Vegetarian</option>
                    <option value="VEGAN">Vegan</option>
                    <option value="NON_VEG">Non-Vegetarian</option>
                  </select>
                </div>

                <div className="mt-4">
                  <Label htmlFor="allergens" className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    Allergens (comma-separated)
                  </Label>
                  <Input
                    id="allergens"
                    value={formData.allergens}
                    onChange={(e) => setFormData({ ...formData, allergens: e.target.value })}
                    placeholder="peanuts, dairy, gluten, shellfish"
                    className="mt-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">We'll warn you about recipes containing these allergens</p>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-green-600 hover:bg-green-700 rounded-xl text-lg font-semibold"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-5 w-5" /> Save Changes
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
