import { BookOpen, Heart, LogOut, Menu, Search, User, UtensilsCrossed, X } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'

const linkClass = 'text-gray-700 hover:text-green-600 transition-colors'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { isAuthenticated, user, logout, loading } = useAuth()
  const navigate = useNavigate()

  const closeMenu = () => setIsOpen(false)

  const handleLogout = async () => {
    closeMenu()
    await logout()
    navigate('/')
  }

  const guestLinks = (
    <>
      <Link to="/" className={linkClass} onClick={closeMenu}>Home</Link>
      <Link to="/about" className={linkClass} onClick={closeMenu}>About</Link>
      <Link to="/doc" className={linkClass} onClick={closeMenu}>Doc</Link>
      <Link to="/auth" className={linkClass} onClick={closeMenu}>Login</Link>
      <Link to="/blogs" className={`flex items-center ${linkClass}`} onClick={closeMenu}>
        <BookOpen className="h-4 w-4 mr-1" /> Blogs
      </Link>
    </>
  )

  const authLinks = (
    <>
      <Link to="/" className={linkClass} onClick={closeMenu}>Home</Link>
      <Link to="/recipes" className={linkClass} onClick={closeMenu}>Recipe</Link>
      <Link to="/blogs" className={`flex items-center ${linkClass}`} onClick={closeMenu}>
        <BookOpen className="h-4 w-4 mr-1" /> Food Blogs
      </Link>
      <Link to="/profile" className={`flex items-center ${linkClass}`} onClick={closeMenu}>
        <User className="h-4 w-4 mr-1" /> Profile
      </Link>
      <Link to="/favorites" className={`flex items-center ${linkClass}`} onClick={closeMenu}>
        <Heart className="h-4 w-4 mr-1" /> Favorites
      </Link>
      <Link to="/search">
        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={closeMenu}>
          <Search className="h-4 w-4 mr-1" /> Search
        </Button>
      </Link>
    </>
  )

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
            <UtensilsCrossed className="h-6 w-6 text-green-600" />
            <span className="font-bold text-lg text-gray-800">RecipeRec</span>
          </Link>

          {!loading && (
            <div className="hidden md:flex items-center space-x-6">
              {isAuthenticated ? authLinks : guestLinks}
              {isAuthenticated && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleLogout}
                  className="text-gray-600 border-gray-200"
                >
                  <LogOut className="h-4 w-4 mr-1" /> Logout
                </Button>
              )}
            </div>
          )}

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-green-600"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && !loading && (
        <div className="md:hidden bg-white shadow-lg border-t border-gray-100">
          <div className="px-4 py-3 space-y-3">
            {isAuthenticated ? (
              <>
                <Link to="/" className={`block ${linkClass}`} onClick={closeMenu}>Home</Link>
                <Link to="/recipes" className={`block ${linkClass}`} onClick={closeMenu}>Recipe</Link>
                <Link to="/blogs" className={`block ${linkClass}`} onClick={closeMenu}>Food Blogs</Link>
                <Link to="/profile" className={`flex items-center ${linkClass}`} onClick={closeMenu}>
                  <User className="h-4 w-4 mr-1" /> Profile
                </Link>
                <Link to="/favorites" className={`flex items-center ${linkClass}`} onClick={closeMenu}>
                  <Heart className="h-4 w-4 mr-1" /> Favorites
                </Link>
                <Link to="/search" className={`block ${linkClass}`} onClick={closeMenu}>Search</Link>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-1" /> Logout ({user?.username})
                </Button>
              </>
            ) : (
              <>
                <Link to="/" className={`block ${linkClass}`} onClick={closeMenu}>Home</Link>
                <Link to="/about" className={`block ${linkClass}`} onClick={closeMenu}>About</Link>
                <Link to="/doc" className={`block ${linkClass}`} onClick={closeMenu}>Doc</Link>
                <Link to="/auth" className={`block ${linkClass}`} onClick={closeMenu}>Login</Link>
                <Link to="/blogs" className={`block ${linkClass}`} onClick={closeMenu}>Blogs</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
