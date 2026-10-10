import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  User,
  Settings,
  LogOut,
  BookOpen,
  Heart,
  ShoppingBag,
  Building2,
  Mail,
  Edit,
  Loader2,
  ShieldCheck,
  Leaf,
  AlertTriangle,
  ChevronRight,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/context/AuthContext'
import api from '@/lib/api'

export default function Profile() {
  const { user, loading, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [blogCount, setBlogCount] = useState(0)
  const [favoriteCount, setFavoriteCount] = useState(0)
  const [orderCount, setOrderCount] = useState(0)

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserStats()
    }
  }, [isAuthenticated, user])

  const fetchUserStats = async () => {
    try {
      // Fetch blogs by user
      const blogsRes = await api.get('/blogs')
      const myBlogs = (blogsRes.data.blogs || []).filter(b => b.authorId === user.id)
      setBlogCount(myBlogs.length)
    } catch {
      // silent
    }

    try {
      // Fetch favorite blogs
      const favRes = await api.get('/blogs/favorites')
      setFavoriteCount(favRes.data.favorites?.length || 0)
    } catch {
      // silent
    }

    try {
      // Fetch user orders
      const ordersRes = await api.get('/orders/my-orders')
      setOrderCount(ordersRes.data.orders?.length || 0)
    } catch {
      // silent
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-[#ff751f]" />
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white shadow-xl rounded-3xl p-8 text-center border border-gray-100">
          <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mx-auto mb-4 text-[#ff751f]">
            <User className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">You're not logged in</h2>
          <p className="text-gray-500 text-sm mt-2">
            Sign in to access your profile, food stories, saved favorites, and dining orders.
          </p>
          <div className="mt-6 space-y-3">
            <Link to="/auth" className="block">
              <Button className="w-full bg-black hover:bg-gray-800 text-white font-bold rounded-full py-2.5">
                Sign In
              </Button>
            </Link>
            <Link to="/auth/signup" className="block">
              <Button variant="outline" className="w-full rounded-full font-bold">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const dietary = user.preferences?.dietary || 'ANY'
  const allergens = user.preferences?.allergens || []

  const getDietaryLabel = (type) => {
    switch (type) {
      case 'VEG':
        return 'Vegetarian'
      case 'VEGAN':
        return 'Vegan'
      case 'NON_VEG':
        return 'Non-Vegetarian'
      default:
        return 'No Restrictions'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/50 via-white to-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* PROFILE CARD */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {/* BANNER */}
          <div className="h-44 bg-gradient-to-r from-stone-900 via-stone-800 to-black relative">
            <div className="absolute inset-0 bg-[radial-gradient(#ff751f_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-black uppercase tracking-wider border border-white/20">
                <ShieldCheck className="h-3.5 w-3.5 text-[#ff751f]" />
                {user.role || 'User'}
              </span>
            </div>
          </div>

          <div className="px-6 sm:px-8 pb-8 relative">
            {/* AVATAR */}
            <div className="-mt-16 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
              <div className="flex items-end gap-4">
                <div className="p-1.5 bg-white rounded-3xl shadow-xl">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="h-28 w-28 rounded-2xl object-cover bg-gray-100"
                    />
                  ) : (
                    <div className="h-28 w-28 rounded-2xl bg-gradient-to-tr from-[#ff751f] to-amber-500 text-white font-black text-4xl flex items-center justify-center uppercase select-none shadow-inner">
                      {user.username ? user.username.charAt(0) : 'U'}
                    </div>
                  )}
                </div>
                <div className="pb-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-gray-900 capitalize leading-tight">
                    {user.username}
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
                    <Mail className="h-3.5 w-3.5 text-gray-400" />
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => navigate('/profile/edit')}
                  className="bg-black hover:bg-gray-800 text-white font-bold rounded-2xl px-5 h-11 text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm"
                >
                  <Edit className="h-3.5 w-3.5 text-[#ff751f]" />
                  Edit Profile & Settings
                </Button>
              </div>
            </div>

            {/* QUICK STATS CARDS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-gray-100">
              <Link
                to="/blogs"
                className="p-4 rounded-2xl bg-gray-50 hover:bg-orange-50/60 border border-transparent hover:border-orange-100 transition-all text-center group"
              >
                <BookOpen className="h-5 w-5 mx-auto text-[#ff751f] mb-1.5 transition-transform group-hover:scale-110" />
                <p className="text-xl font-anton text-gray-900">{blogCount}</p>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Stories</p>
              </Link>

              <Link
                to="/favorites"
                className="p-4 rounded-2xl bg-gray-50 hover:bg-red-50/60 border border-transparent hover:border-red-100 transition-all text-center group"
              >
                <Heart className="h-5 w-5 mx-auto text-red-500 mb-1.5 transition-transform group-hover:scale-110" />
                <p className="text-xl font-anton text-gray-900">{favoriteCount}</p>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Saved Blogs</p>
              </Link>

              <Link
                to="/orders"
                className="p-4 rounded-2xl bg-gray-50 hover:bg-blue-50/60 border border-transparent hover:border-blue-100 transition-all text-center group"
              >
                <ShoppingBag className="h-5 w-5 mx-auto text-blue-600 mb-1.5 transition-transform group-hover:scale-110" />
                <p className="text-xl font-anton text-gray-900">{orderCount}</p>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Dining Orders</p>
              </Link>

              <Link
                to="/restaurants"
                className="p-4 rounded-2xl bg-gray-50 hover:bg-green-50/60 border border-transparent hover:border-green-100 transition-all text-center group"
              >
                <Sparkles className="h-5 w-5 mx-auto text-green-600 mb-1.5 transition-transform group-hover:scale-110" />
                <p className="text-xl font-anton text-gray-900">Explore</p>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Restaurants</p>
              </Link>
            </div>
          </div>
        </div>

        {/* DIETARY & ALLERGEN PREFERENCES CARD */}
        <Card className="border border-gray-100 shadow-sm rounded-3xl overflow-hidden bg-white">
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-[#ff751f]">
                  <Leaf className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Dietary & Allergen Preferences</h2>
                  <p className="text-xs text-gray-500">
                    Used by the dining menu and AI Waiter to customize food suggestions & alert allergens
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/profile/edit')}
                className="rounded-full text-xs font-bold uppercase tracking-wider hover:border-[#ff751f] hover:text-[#ff751f]"
              >
                Update
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* DIETARY PREFERENCE */}
              <div className="p-5 rounded-2xl bg-orange-50/40 border border-orange-100">
                <p className="text-xs font-black uppercase tracking-wider text-gray-400 mb-2">Dietary Lifestyle</p>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-gray-900 font-extrabold text-sm border border-orange-200 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-[#ff751f]" />
                    {getDietaryLabel(dietary)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-3 leading-relaxed">
                  Dishes aligning with your lifestyle are highlighted across partner restaurant menus.
                </p>
              </div>

              {/* ALLERGEN WARNING LIST */}
              <div className="p-5 rounded-2xl bg-red-50/40 border border-red-100">
                <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-red-600 mb-2">
                  <AlertTriangle className="h-3.5 w-3.5" /> Allergen Safety Warnings
                </div>
                {allergens.length === 0 ? (
                  <p className="text-xs text-gray-500 italic mt-1">
                    No allergens registered. Add allergens (e.g. peanuts, dairy) to receive instant dining alerts.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {allergens.map((alg, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase"
                      >
                        ⚠️ {alg}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-3 leading-relaxed">
                  Our system cross-references these with partner dishes and warns you automatically.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* ACCOUNT SETTINGS & ACTIONS */}
        <div className="space-y-3">
          <Button
            variant="outline"
            onClick={() => navigate('/profile/edit')}
            className="w-full h-16 rounded-3xl border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-between px-6 transition-all shadow-xs group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-700 group-hover:bg-orange-100 group-hover:text-[#ff751f] transition-colors">
                <Settings className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-900 text-sm">Account Settings & Password Security</p>
                <p className="text-xs text-gray-400">Change your login password and manage preferences</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-black transition-transform group-hover:translate-x-1" />
          </Button>

          {(user.role === 'ADMIN' || user.role === 'OWNER') && (
            <Button
              variant="outline"
              onClick={() => navigate('/restaurant-admin')}
              className="w-full h-16 rounded-3xl border-gray-200 bg-white hover:bg-orange-50/50 flex items-center justify-between px-6 transition-all shadow-xs group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                  <Building2 className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-900 text-sm">Partner Restaurant Management Portal</p>
                  <p className="text-xs text-gray-400">Manage dishes, menu categories and kitchen order queues</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-black transition-transform group-hover:translate-x-1" />
            </Button>
          )}

          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full h-14 rounded-3xl text-red-600 hover:bg-red-50 hover:text-red-700 font-bold flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
          >
            <LogOut className="h-4 w-4" />
            Sign Out of RecipeRec
          </Button>
        </div>

      </div>
    </div>
  )
}
