import {
  BookOpen,
  Building2,
  ChevronDown,
  Heart,
  LogOut,
  Menu,
  Plus,
  ShoppingBag,
  User,
  UtensilsCrossed,
  X,
} from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const { isAuthenticated, user, logout, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const closeMenu = () => {
    setIsOpen(false)
    setProfileDropdownOpen(false)
  }

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    closeMenu()
    await logout()
    navigate('/')
  }

  const isCurrent = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* BRAND LOGO */}
          <Link to="/" className="flex items-center space-x-2 group" onClick={closeMenu}>
            <UtensilsCrossed className="h-6 w-6 text-[#ff751f] transition-transform group-hover:scale-110" />
            <span className="font-anton text-2xl tracking-normal text-black uppercase">
              Recipe<span className="text-[#ff751f]">Rec</span>
            </span>
          </Link>

          {/* DESKTOP NAVIGATION */}
          {!loading && (
            <div className="hidden md:flex items-center space-x-7">
              {/* RESTAURANTS & DINING LINK (Public) */}
              <Link
                to="/restaurants"
                className={`text-sm font-bold transition-colors flex items-center gap-1.5 ${
                  isCurrent('/restaurants') || isCurrent('/restaurant')
                    ? 'text-[#ff751f]'
                    : 'text-gray-700 hover:text-[#ff751f]'
                }`}
              >
                <UtensilsCrossed className="h-4 w-4 text-[#ff751f]" />
                Restaurants
              </Link>

              {/* BLOGS LINK (Public) */}
              <Link
                to="/blogs"
                className={`text-sm font-bold transition-colors flex items-center gap-1.5 ${
                  isCurrent('/blogs') || isCurrent('/blog')
                    ? 'text-[#ff751f]'
                    : 'text-gray-700 hover:text-[#ff751f]'
                }`}
              >
                Blogs
              </Link>

              {isAuthenticated ? (
                <>
                  {/* WRITE BLOG STORY CTA */}
                  <Link to="/blogs/write">
                    <Button
                      size="sm"
                      className="bg-black hover:bg-gray-800 text-white font-bold rounded-full px-4 h-9 shadow-sm flex items-center gap-1.5 text-xs uppercase tracking-wide"
                    >
                      <Plus className="h-3.5 w-3.5 text-[#ff751f]" />
                      Write Story
                    </Button>
                  </Link>

                  {/* USER AVATAR & DROPDOWN */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setProfileDropdownOpen((prev) => !prev)}
                      className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
                      aria-label="User menu"
                    >
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#ff751f] to-amber-500 text-white font-black text-sm flex items-center justify-center shadow-md uppercase select-none">
                        {user?.username ? user.username.charAt(0) : 'U'}
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                          profileDropdownOpen ? 'rotate-180 text-black' : ''
                        }`}
                      />
                    </button>

                    {profileDropdownOpen && (
                      <div className="absolute right-0 mt-3 w-60 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                        {/* User Header */}
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-black text-gray-900 truncate">
                            {user?.username}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                          <div className="mt-1.5 inline-flex items-center px-2 py-0.5 rounded-full bg-orange-50 text-[#ff751f] text-[10px] font-black uppercase tracking-wider">
                            {user?.role || 'User'}
                          </div>
                        </div>

                        {/* Personal Essentials & Dining Orders */}
                        <div className="py-1">
                          <Link
                            to="/orders"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#ff751f] font-semibold transition-colors"
                          >
                            <ShoppingBag className="h-4 w-4 mr-3 text-[#ff751f]" /> My Orders
                          </Link>

                          {(user?.role === 'ADMIN' || user?.role === 'OWNER') && (
                            <Link
                              to="/restaurant-admin"
                              onClick={() => setProfileDropdownOpen(false)}
                              className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#ff751f] font-semibold transition-colors"
                            >
                              <Building2 className="h-4 w-4 mr-3 text-amber-500" /> Restaurant Admin
                            </Link>
                          )}

                          <Link
                            to="/favorites"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#ff751f] font-semibold transition-colors"
                          >
                            <Heart className="h-4 w-4 mr-3 text-red-500" /> Favorites
                          </Link>

                          <Link
                            to="/profile"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#ff751f] font-semibold transition-colors"
                          >
                            <User className="h-4 w-4 mr-3 text-gray-500" /> Profile & Settings
                          </Link>
                        </div>

                        {/* Sign Out */}
                        <div className="border-t border-gray-100 pt-1">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-semibold transition-colors"
                          >
                            <LogOut className="h-4 w-4 mr-3 text-red-500" /> Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                /* GUEST LOGIN BUTTON */
                <Link to="/auth" onClick={closeMenu}>
                  <Button
                    size="sm"
                    className="bg-black hover:bg-gray-800 text-white font-extrabold rounded-full px-6 h-9 shadow-sm text-xs uppercase tracking-wide"
                  >
                    Login
                  </Button>
                </Link>
              )}
            </div>
          )}

          {/* MOBILE MENU TOGGLE */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-black p-2"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6 text-black" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {isOpen && !loading && (
        <div className="md:hidden bg-white shadow-2xl border-t border-gray-100 animate-in slide-in-from-top-2 duration-150">
          <div className="px-5 py-4 space-y-3">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#ff751f] to-amber-500 text-white font-black text-sm flex items-center justify-center uppercase">
                    {user?.username ? user.username.charAt(0) : 'U'}
                  </div>
                  <div>
                    <p className="font-extrabold text-gray-900">{user?.username}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>

                <Link
                  to="/restaurants"
                  className="flex items-center gap-2 font-bold text-gray-800 hover:text-[#ff751f] py-1"
                  onClick={closeMenu}
                >
                  <UtensilsCrossed className="h-4 w-4 text-[#ff751f]" /> Restaurants
                </Link>
                <Link
                  to="/blogs"
                  className="block font-bold text-gray-800 hover:text-[#ff751f] py-1"
                  onClick={closeMenu}
                >
                  Blogs
                </Link>
                <Link
                  to="/blogs/write"
                  className="block font-bold text-[#ff751f] py-1"
                  onClick={closeMenu}
                >
                  + Write Story
                </Link>

                <div className="border-t border-gray-100 pt-2 space-y-2">
                  <Link
                    to="/orders"
                    className="flex items-center font-semibold text-gray-700 py-1"
                    onClick={closeMenu}
                  >
                    <ShoppingBag className="h-4 w-4 mr-2 text-[#ff751f]" /> My Orders
                  </Link>
                  {(user?.role === 'ADMIN' || user?.role === 'OWNER') && (
                    <Link
                      to="/restaurant-admin"
                      className="flex items-center font-semibold text-gray-700 py-1"
                      onClick={closeMenu}
                    >
                      <Building2 className="h-4 w-4 mr-2 text-amber-500" /> Restaurant Admin
                    </Link>
                  )}
                  <Link
                    to="/favorites"
                    className="flex items-center font-semibold text-gray-700 py-1"
                    onClick={closeMenu}
                  >
                    <Heart className="h-4 w-4 mr-2 text-red-500" /> Favorites
                  </Link>
                  <Link
                    to="/profile"
                    className="flex items-center font-semibold text-gray-700 py-1"
                    onClick={closeMenu}
                  >
                    <User className="h-4 w-4 mr-2 text-gray-500" /> Profile & Settings
                  </Link>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <Button
                    variant="outline"
                    className="w-full text-red-600 border-red-200 hover:bg-red-50 font-bold"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" /> Sign Out
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/restaurants"
                  className="flex items-center gap-2 font-bold text-gray-800 hover:text-[#ff751f] py-1"
                  onClick={closeMenu}
                >
                  <UtensilsCrossed className="h-4 w-4 text-[#ff751f]" /> Restaurants
                </Link>
                <Link
                  to="/blogs"
                  className="block font-bold text-gray-800 hover:text-[#ff751f] py-1"
                  onClick={closeMenu}
                >
                  Blogs
                </Link>
                <Link to="/auth" onClick={closeMenu}>
                  <Button className="w-full bg-black text-white rounded-full font-bold">
                    Login
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
