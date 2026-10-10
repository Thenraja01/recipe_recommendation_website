import { useState, useEffect } from 'react'
import api from '../lib/api'
import { Heart, ArrowLeft, Loader2, BookOpen, Calendar, User, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Card, CardHeader, CardContent } from '../components/ui/card'
import { getBlogUrl } from '@/lib/slug'

export default function Favorites() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      setBlogs([])
      setLoading(false)
      return
    }

    fetchFavorites()
  }, [isAuthenticated])

  const fetchFavorites = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/favorites')
      setBlogs(data.blogs || [])
    } catch (err) {
      console.error('Error fetching favorites:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveBlog = async (e, blogId) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await api.delete(`/favorites/blog/${blogId}`)
      setBlogs(prev => prev.filter(b => b.id !== blogId && b.blogId !== blogId))
    } catch (err) {
      console.error('Failed to remove blog favorite:', err)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Recent'
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Recent'
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 pb-6 border-b border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="p-3.5 bg-red-100 rounded-2xl shadow-xl shadow-red-100/50">
            <Heart className="h-8 w-8 text-red-500 fill-current" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              My Favorite <span className="text-[#ff751f]">Blogs</span>
            </h1>
            <p className="text-gray-500 font-medium text-sm sm:text-base mt-0.5">
              Saved culinary food stories and community recipes
            </p>
          </div>
        </div>

        {/* Back Link */}
        <Link
          to="/blogs"
          className="group flex items-center space-x-2 text-gray-500 font-bold uppercase tracking-wider text-xs hover:text-[#ff751f] transition-colors"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span>Explore More Blogs</span>
        </Link>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 className="h-10 w-10 animate-spin text-[#ff751f] mb-3" />
          <p className="text-gray-500 font-semibold text-sm">Loading your favorite blogs...</p>
        </div>
      ) : blogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <Link key={blog.id} to={getBlogUrl(blog)} className="group h-full">
              <Card className="overflow-hidden border border-gray-200/80 bg-white hover:border-orange-300 shadow-md hover:shadow-2xl transition-all duration-300 rounded-3xl h-full flex flex-col group-hover:-translate-y-1">
                <div className="relative aspect-video overflow-hidden bg-gray-100">
                  {blog.image ? (
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white">
                      <BookOpen className="h-12 w-12 opacity-80" />
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={(e) => handleRemoveBlog(e, blog.id)}
                    className="absolute top-3 right-3 p-2.5 rounded-full bg-white/95 backdrop-blur-sm shadow-md hover:scale-110 active:scale-95 transition-all z-10 text-red-500 hover:bg-red-50"
                    title="Remove from favorites"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <CardHeader className="p-6 pb-2">
                  <h3 className="text-xl font-extrabold text-gray-900 line-clamp-2 group-hover:text-[#ff751f] transition-colors leading-snug">
                    {blog.title}
                  </h3>
                </CardHeader>

                <CardContent className="p-6 pt-2 flex-grow flex flex-col justify-between">
                  <p className="text-gray-600 line-clamp-3 text-sm leading-relaxed mb-4">
                    {blog.content}
                  </p>

                  <div className="flex items-center justify-between text-xs font-semibold text-gray-400 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1.5 text-gray-700 font-bold">
                      <User className="h-3.5 w-3.5 text-[#ff751f]" />
                      <span>{blog.author?.username || 'Chef'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{formatDate(blog.createdAt)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="min-h-[45vh] flex flex-col items-center justify-center text-center p-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <BookOpen className="h-16 w-16 text-slate-300 mb-4" />
          <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight mb-2">
            No Favorite Food Blogs Yet
          </h2>
          <p className="text-gray-500 font-medium max-w-sm text-sm mb-6">
            Browse food stories and tap the heart icon on any blog to save it here.
          </p>
          <Link
            to="/blogs"
            className="px-8 py-3.5 bg-black text-white hover:bg-gray-800 rounded-full font-extrabold text-sm shadow-xl transition-all"
          >
            Explore Food Blogs
          </Link>
        </div>
      )}
    </div>
  )
}
