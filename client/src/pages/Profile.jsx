import { Link, useNavigate } from 'react-router-dom'
import {
  User,
  Settings,
  LogOut,
  FileText,
  Heart,
  Sparkles,
  Mail,
  Edit,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'

export default function Profile() {
  const { user, loading, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white shadow-xl rounded-3xl p-8 text-center">
          <User className="mx-auto h-20 w-20 text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">You&apos;re not logged in</h2>
          <p className="text-gray-500 mt-3">
            Please sign in to view your profile, manage your blogs, and access AI-powered recipe features.
          </p>
          <div className="mt-8 space-y-3">
            <Link to="/auth">
              <Button className="w-full bg-green-600 hover:bg-green-700">Login</Button>
            </Link>
            <Link to="/auth/signup">
              <Button variant="outline" className="w-full">Create Account</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-red-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="h-40 bg-gradient-to-br from-[#8cc89a] via-[#c6ebd4] to-[#f0f9f2]" />

        <div className="relative px-8 pb-8">
          <div className="-mt-16 flex justify-center">
            <div className="bg-white rounded-full p-2 shadow-xl">
              <div className="h-32 w-32 rounded-full bg-green-100 flex items-center justify-center overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.username} className="h-full w-full object-cover" />
                ) : (
                  <User className="h-16 w-16 text-green-600" />
                )}
              </div>
            </div>
          </div>

          <div className="text-center mt-4">
            <h2 className="text-3xl font-bold text-gray-800 capitalize">{user.username}</h2>
            <div className="flex justify-center items-center gap-2 mt-2 text-gray-500">
              <Mail size={16} />
              {user.email}
            </div>
            <p className="mt-2 text-sm text-green-700 font-medium uppercase tracking-wide">{user.role}</p>
            <p className="mt-4 text-gray-600 max-w-xl mx-auto">
              Passionate food lover sharing recipes, cooking tips, and AI-powered culinary experiences.
            </p>
            <Button className="mt-6 rounded-full bg-green-600 hover:bg-green-700">
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-5 mt-10">
            <Link to="/blogs" className="bg-orange-50 rounded-2xl p-6 text-center hover:shadow-lg transition block">
              <FileText className="mx-auto text-orange-500 mb-3" />
              <h3 className="text-lg font-bold text-gray-800">My Blogs</h3>
              <p className="text-gray-500 text-sm">View & write posts</p>
            </Link>
            <Link to="/favorites" className="bg-red-50 rounded-2xl p-6 text-center hover:shadow-lg transition block">
              <Heart className="mx-auto text-red-500 mb-3" />
              <h3 className="text-lg font-bold text-gray-800">Favorites</h3>
              <p className="text-gray-500 text-sm">Saved recipes</p>
            </Link>
            <Link to="/search" className="bg-yellow-50 rounded-2xl p-6 text-center hover:shadow-lg transition block">
              <Sparkles className="mx-auto text-yellow-500 mb-3" />
              <h3 className="text-lg font-bold text-gray-800">Search</h3>
              <p className="text-gray-500 text-sm">Find recipes & blogs</p>
            </Link>
          </div>

          <div className="mt-10 space-y-4">
            <Button variant="outline" className="w-full h-14 rounded-2xl flex justify-between px-6">
              <div className="flex items-center">
                <Settings className="mr-3 h-5 w-5" />
                Account Settings
              </div>
              →
            </Button>
            <Button
              onClick={handleLogout}
              className="w-full h-14 rounded-2xl bg-red-500 hover:bg-red-600"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
