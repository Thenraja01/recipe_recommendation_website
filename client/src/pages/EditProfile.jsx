import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  User, 
  Mail, 
  Camera, 
  Save, 
  Loader2, 
  ArrowLeft, 
  Leaf, 
  AlertTriangle,
  Lock,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  XCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import api from '@/lib/api'
import { useAuth } from '@/context/AuthContext'

const COMMON_ALLERGENS = [
  'Peanuts',
  'Tree Nuts',
  'Dairy',
  'Gluten',
  'Shellfish',
  'Soy',
  'Eggs',
  'Fish',
  'Sesame'
]

export default function EditProfile() {
  const { user, refreshUser } = useAuth()
  const navigate = useNavigate()
  
  const [activeTab, setActiveTab] = useState('profile') // 'profile' | 'security'
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [statusMessage, setStatusMessage] = useState(null) // { type: 'success' | 'error', text: '' }

  // Profile Form
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    avatar: '',
    dietary: 'ANY',
    allergens: []
  })

  // Password Form
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        avatar: user.avatar || '',
        dietary: user.preferences?.dietary || 'ANY',
        allergens: user.preferences?.allergens || []
      })
    }
  }, [user])

  const toggleAllergen = (item) => {
    setFormData((prev) => {
      const exists = prev.allergens.some((a) => a.toLowerCase() === item.toLowerCase())
      if (exists) {
        return {
          ...prev,
          allergens: prev.allergens.filter((a) => a.toLowerCase() !== item.toLowerCase())
        }
      } else {
        return {
          ...prev,
          allergens: [...prev.allergens, item]
        }
      }
    })
  }

  // Handle Profile & Dietary Preferences Save
  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setSavingProfile(true)
    setStatusMessage(null)
    try {
      // 1. Update basic profile info
      await api.put('/auth/profile', {
        username: formData.username,
        email: formData.email,
        avatar: formData.avatar
      })

      // 2. Update dietary and allergen preferences
      await api.put('/auth/preferences', {
        dietary: formData.dietary,
        allergens: formData.allergens
      })

      await refreshUser()
      setStatusMessage({ type: 'success', text: 'Profile and dietary preferences updated successfully!' })
    } catch (err) {
      console.error(err)
      setStatusMessage({
        type: 'error',
        text: err.response?.data?.message || err.response?.data?.error || 'Failed to update profile'
      })
    } finally {
      setSavingProfile(false)
    }
  }

  // Handle Password Change
  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setStatusMessage(null)

    if (passwordData.newPassword.length < 6) {
      setStatusMessage({ type: 'error', text: 'New password must be at least 6 characters long' })
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setStatusMessage({ type: 'error', text: 'New passwords do not match' })
      return
    }

    setSavingPassword(true)
    try {
      await api.put('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })

      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setStatusMessage({ type: 'success', text: 'Account password changed successfully!' })
    } catch (err) {
      console.error(err)
      setStatusMessage({
        type: 'error',
        text: err.response?.data?.message || err.response?.data?.error || 'Failed to update password'
      })
    } finally {
      setSavingPassword(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/50 via-white to-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* TOP BAR */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/profile')}
            className="text-gray-500 hover:text-black -ml-2 text-xs font-bold uppercase tracking-wider h-9 px-2"
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to Profile
          </Button>
          <span className="text-xs font-black uppercase tracking-wider text-gray-400">
            Account Management
          </span>
        </div>

        {/* TABS */}
        <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-6">
          <button
            onClick={() => {
              setActiveTab('profile')
              setStatusMessage(null)
            }}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
              activeTab === 'profile'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-black'
            }`}
          >
            <User className="h-4 w-4 text-[#ff751f]" />
            Profile & Dietary
          </button>
          <button
            onClick={() => {
              setActiveTab('security')
              setStatusMessage(null)
            }}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
              activeTab === 'security'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-black'
            }`}
          >
            <KeyRound className="h-4 w-4 text-[#ff751f]" />
            Account Security
          </button>
        </div>

        {/* NOTIFICATION STATUS */}
        {statusMessage && (
          <div
            className={`mb-6 p-4 rounded-2xl flex items-center gap-3 text-sm font-semibold transition-all ${
              statusMessage.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* TAB 1: PROFILE & DIETARY SETTINGS */}
        {activeTab === 'profile' && (
          <Card className="border border-gray-100 shadow-xl rounded-3xl overflow-hidden bg-white">
            <CardHeader className="bg-gradient-to-r from-stone-900 via-stone-800 to-black text-white p-6 sm:p-8">
              <CardTitle className="text-xl sm:text-2xl font-anton uppercase tracking-wide flex items-center gap-2.5">
                <User className="h-6 w-6 text-[#ff751f]" />
                Personal Profile & Dietary
              </CardTitle>
              <p className="text-xs text-gray-400 mt-1">
                Customize your display identity and dining safety preferences
              </p>
            </CardHeader>

            <CardContent className="p-6 sm:p-8">
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                {/* AVATAR PREVIEW & URL */}
                <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-gray-100">
                  <div className="relative">
                    {formData.avatar ? (
                      <img
                        src={formData.avatar}
                        alt="Avatar preview"
                        className="w-20 h-20 rounded-2xl object-cover border-2 border-orange-200 shadow-md bg-gray-50"
                        onError={(e) => {
                          e.target.style.display = 'none'
                        }}
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#ff751f] to-amber-500 text-white font-black text-2xl flex items-center justify-center uppercase shadow-md">
                        {formData.username ? formData.username.charAt(0) : 'U'}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 w-full">
                    <Label htmlFor="avatar" className="text-xs font-black uppercase text-gray-700">
                      Profile Picture URL
                    </Label>
                    <div className="relative mt-1.5">
                      <Camera className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="avatar"
                        value={formData.avatar}
                        onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        className="pl-10 h-11 rounded-xl text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* USERNAME & EMAIL */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="username" className="text-xs font-black uppercase text-gray-700">
                      Username *
                    </Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="mt-1.5 h-11 rounded-xl"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-xs font-black uppercase text-gray-700">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="mt-1.5 h-11 rounded-xl"
                      required
                    />
                  </div>
                </div>

                {/* DIETARY PREFERENCES */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Leaf className="h-4 w-4 text-[#ff751f]" />
                    <Label className="text-xs font-black uppercase text-gray-800">
                      Dietary Lifestyle
                    </Label>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { key: 'ANY', label: 'No Restrictions' },
                      { key: 'VEG', label: 'Vegetarian' },
                      { key: 'VEGAN', label: 'Vegan' },
                      { key: 'NON_VEG', label: 'Non-Vegetarian' }
                    ].map((option) => (
                      <button
                        type="button"
                        key={option.key}
                        onClick={() => setFormData({ ...formData, dietary: option.key })}
                        className={`p-3 rounded-2xl text-xs font-bold transition-all border text-center ${
                          formData.dietary === option.key
                            ? 'bg-black text-white border-black shadow-sm'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ALLERGENS TOGGLE */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <Label className="text-xs font-black uppercase text-gray-800">
                      Allergen Safety Tags
                    </Label>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">
                    Select your food allergies. Our partner menu & AI Waiter will automatically flag matching ingredients!
                  </p>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {COMMON_ALLERGENS.map((item) => {
                      const isSelected = formData.allergens.some(
                        (a) => a.toLowerCase() === item.toLowerCase()
                      )
                      return (
                        <button
                          type="button"
                          key={item}
                          onClick={() => toggleAllergen(item)}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                            isSelected
                              ? 'bg-red-500 text-white border-red-500 shadow-xs'
                              : 'bg-white text-gray-700 border-gray-200 hover:border-red-200 hover:bg-red-50/50'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '}
                          {item}
                        </button>
                      )
                    })}
                  </div>

                  {/* CUSTOM ALLERGEN WRITING */}
                  <Input
                    placeholder="Other allergens (comma separated, e.g. mustard, kiwi)"
                    value={formData.allergens.filter(a => !COMMON_ALLERGENS.some(c => c.toLowerCase() === a.toLowerCase())).join(', ')}
                    onChange={(e) => {
                      const custom = e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                      const existingPreset = formData.allergens.filter(a => COMMON_ALLERGENS.some(c => c.toLowerCase() === a.toLowerCase()))
                      setFormData({
                        ...formData,
                        allergens: [...existingPreset, ...custom]
                      })
                    }}
                    className="h-10 text-xs rounded-xl"
                  />
                </div>

                {/* SUBMIT BUTTON */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={savingProfile}
                    className="w-full h-12 bg-black hover:bg-gray-800 text-white font-extrabold rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md"
                  >
                    {savingProfile ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-[#ff751f]" />
                        Updating Profile...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 text-[#ff751f]" />
                        Save Profile & Preferences
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* TAB 2: ACCOUNT SECURITY & PASSWORD */}
        {activeTab === 'security' && (
          <Card className="border border-gray-100 shadow-xl rounded-3xl overflow-hidden bg-white">
            <CardHeader className="bg-gradient-to-r from-stone-900 via-stone-800 to-black text-white p-6 sm:p-8">
              <CardTitle className="text-xl sm:text-2xl font-anton uppercase tracking-wide flex items-center gap-2.5">
                <Lock className="h-6 w-6 text-[#ff751f]" />
                Account Security & Password
              </CardTitle>
              <p className="text-xs text-gray-400 mt-1">
                Ensure your RecipeRec account credentials are protected with a strong password
              </p>
            </CardHeader>

            <CardContent className="p-6 sm:p-8">
              <form onSubmit={handlePasswordSubmit} className="space-y-5">
                <div>
                  <Label htmlFor="currentPassword" className="text-xs font-black uppercase text-gray-700">
                    Current Password *
                  </Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    placeholder="••••••••"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="mt-1.5 h-11 rounded-xl"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="newPassword" className="text-xs font-black uppercase text-gray-700">
                    New Password *
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Minimum 6 characters"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="mt-1.5 h-11 rounded-xl"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="confirmPassword" className="text-xs font-black uppercase text-gray-700">
                    Confirm New Password *
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Re-enter your new password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="mt-1.5 h-11 rounded-xl"
                    required
                  />
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <Button
                    type="submit"
                    disabled={savingPassword}
                    className="w-full h-12 bg-black hover:bg-gray-800 text-white font-extrabold rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md"
                  >
                    {savingPassword ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-[#ff751f]" />
                        Updating Password...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="h-4 w-4 text-[#ff751f]" />
                        Update Account Password
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  )
}
