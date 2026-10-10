import { useState, useEffect } from "react"
import {
  Search,
  Calendar,
  User,
  Plus,
  BookOpen,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Heart,
} from "lucide-react"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "../components/ui/card"
import { Link, useSearchParams } from "react-router-dom"
import api from "../lib/api"
import { useAuth } from "../context/AuthContext"
import { getBlogUrl } from "@/lib/slug"

export default function Blogs() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialSearch = searchParams.get("search") || ""
  const [blogs, setBlogs] = useState([])
  const [favoriteBlogIds, setFavoriteBlogIds] = useState(new Set())
  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 6,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  })

  const { user } = useAuth()

  // Fetch user favorites when logged in
  useEffect(() => {
    if (!user) {
      setFavoriteBlogIds(new Set())
      return
    }
    api.get('/favorites')
      .then(({ data }) => {
        const ids = (data.blogs || []).map(b => b.id || b.blogId)
        setFavoriteBlogIds(new Set(ids))
      })
      .catch(() => {})
  }, [user])

  const toggleFavorite = async (e, blogId) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) {
      window.location.href = '/auth'
      return
    }
    const isFav = favoriteBlogIds.has(blogId)
    try {
      if (isFav) {
        await api.delete(`/favorites/blog/${blogId}`)
        setFavoriteBlogIds(prev => {
          const next = new Set(prev)
          next.delete(blogId)
          return next
        })
      } else {
        await api.post('/favorites/blog', { blogId })
        setFavoriteBlogIds(prev => new Set(prev).add(blogId))
      }
    } catch (err) {
      console.error('Failed to toggle blog favorite:', err)
    }
  }

  // Sync searchQuery with URL query parameter when it changes externally
  useEffect(() => {
    const urlQuery = searchParams.get("search") || ""
    if (urlQuery !== searchQuery) {
      setSearchQuery(urlQuery)
    }
  }, [searchParams])

  // Reset to page 1 whenever search query changes
  useEffect(() => {
    setPage(1)
  }, [searchQuery])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBlogs(page, searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery, page])

  const fetchBlogs = async (currentPage = 1, query = "") => {
    try {
      setLoading(true)
      const params = {
        page: currentPage,
        limit: 6,
      }
      if (query.trim()) params.search = query.trim()

      const { data } = await api.get("/blogs", { params })
      setBlogs(data.blogs ?? [])
      if (data.pagination) {
        setPagination(data.pagination)
      } else {
        setPagination({
          total: data.blogs?.length || 0,
          page: currentPage,
          limit: 6,
          totalPages: Math.ceil((data.blogs?.length || 0) / 6) || 1,
          hasNextPage: false,
          hasPrevPage: false,
        })
      }
    } catch (error) {
      console.error("Error fetching blogs:", error)
      setBlogs([])
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Recent"
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return "Recent"
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages || newPage === page) return
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-8 border-b border-gray-200">
          <div>
            <div className="inline-flex it  ms-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-[#ff751f] text-xs font-black uppercase tracking-wider mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Community Stories</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">
              Food <span className="text-[#ff751f]">Blogs</span> & Recipes
            </h1>
            <p className="text-gray-600 text-base sm:text-lg mt-2 max-w-2xl">
              Explore culinary adventures, masterclass kitchen techniques, and authentic stories from chefs and home cooks.
            </p>
          </div>

          {user ? (
            <Link to="/blogs/write">
              <Button className="bg-black hover:bg-gray-800 text-white rounded-full px-7 py-3.5 font-bold shadow-xl whitespace-nowrap flex items-center gap-2">
                <Plus className="h-5 w-5 text-[#ff751f]" />
                Write New Story
              </Button>
            </Link>
          ) : (
            <Link to="/auth">
              <Button className="bg-white border-2 border-black text-black hover:bg-black hover:text-white rounded-full px-6 py-3 font-extrabold text-sm shadow-md transition-all">
                Sign In to Publish
              </Button>
            </Link>
          )}
        </div>

        {/* Search Bar & Stats */}
        <div className="mb-10 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search by recipe title, ingredients, or keywords..."
                value={searchQuery}
                onChange={(e) => {
                  const val = e.target.value
                  setSearchQuery(val)
                  if (val.trim()) {
                    setSearchParams({ search: val }, { replace: true })
                  } else {
                    setSearchParams({}, { replace: true })
                  }
                }}
                className="w-full h-14 pl-12 pr-4 rounded-full border-2 border-gray-200 focus:border-black bg-white text-gray-900 text-base shadow-sm font-medium"
              />
          </div>

          <div className="text-sm font-semibold text-gray-500 whitespace-nowrap">
            {!loading && (
              <span>
                Showing {blogs.length} of {pagination.total} {pagination.total === 1 ? "story" : "stories"}
              </span>
            )}
          </div>
        </div>

        {/* Blog Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="h-12 w-12 animate-spin text-[#ff751f] mb-4" />
            <p className="text-gray-500 font-semibold text-base">Loading food blogs...</p>
          </div>
        ) : blogs.length > 0 ? (
          <>
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
                        onClick={(e) => toggleFavorite(e, blog.id)}
                        className="absolute top-3 right-3 p-2.5 rounded-full bg-white/95 backdrop-blur-sm shadow-md hover:scale-110 active:scale-95 transition-all z-10 group/heart"
                        title={favoriteBlogIds.has(blog.id) ? "Remove from favorites" : "Save to favorites"}
                      >
                        <Heart
                          className={`h-4 w-4 transition-colors ${
                            favoriteBlogIds.has(blog.id)
                              ? "text-red-500 fill-red-500"
                              : "text-gray-500 group-hover/heart:text-red-500"
                          }`}
                        />
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
                          <span>{blog.author?.username || "Chef"}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{formatDate(blog.createdAt)}</span>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="p-6 pt-0">
                      <div className="w-full py-2.5 px-4 rounded-xl bg-gray-50 group-hover:bg-[#ff751f] text-gray-800 group-hover:text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors">
                        <span>Read Full Story</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="mt-16 pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-500 font-medium">
                  Page <span className="font-bold text-gray-900">{pagination.page}</span> of{" "}
                  <span className="font-bold text-gray-900">{pagination.totalPages}</span>
                </p>

                <div className="flex items-center gap-2">
                  {/* Prev Button */}
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={!pagination.hasPrevPage}
                    className="rounded-full px-4 h-11 border-gray-200 font-bold text-sm flex items-center gap-1 disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Previous</span>
                  </Button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1 mx-1">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-10 h-10 rounded-full font-bold text-sm transition-all ${
                          pageNum === page
                            ? "bg-black text-white shadow-md scale-105"
                            : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>

                  {/* Next Button */}
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={!pagination.hasNextPage}
                    className="rounded-full px-4 h-11 border-gray-200 font-bold text-sm flex items-center gap-1 disabled:opacity-40"
                  >
                    <span>Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
            <BookOpen className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-2xl font-black text-gray-900 mb-2">No food stories found</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6 text-sm">
              {searchQuery
                ? `No articles matched "${searchQuery}". Try different keywords or clear your search.`
                : "No food stories have been published yet."}
            </p>
            {searchQuery ? (
              <Button
                onClick={() => setSearchQuery("")}
                variant="outline"
                className="rounded-full px-6 font-bold"
              >
                Clear Search
              </Button>
            ) : user ? (
              <Link to="/blogs/write">
                <Button className="bg-[#ff751f] hover:bg-[#e06212] text-black font-extrabold rounded-full px-6 shadow-md">
                  <Plus className="h-4 w-4 mr-1" />
                  Write the First Story
                </Button>
              </Link>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}
