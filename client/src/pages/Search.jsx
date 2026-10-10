import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Loader2, Search as SearchIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import api from '@/lib/api'
import { getBlogUrl } from '@/lib/slug'

export default function Search() {
  const [query, setQuery] = useState('')
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/blogs', { params: { limit: 50 } })
        setBlogs(data.blogs || [])
      } catch (err) {
        console.error('Search data load failed:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const normalizedQuery = query.trim().toLowerCase()

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title?.toLowerCase().includes(normalizedQuery) ||
      blog.content?.toLowerCase().includes(normalizedQuery) ||
      blog.ingredients?.toLowerCase().includes(normalizedQuery)
  )

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24">
      <section className="bg-gradient-to-r from-orange-500 via-[#ff751f] to-amber-500 text-white py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <SearchIcon className="h-10 w-10 mx-auto mb-3 opacity-90" />
          <h1 className="text-3xl md:text-5xl font-black mb-2 tracking-tight">Search Food Blogs</h1>
          <p className="opacity-95 mb-6 text-base md:text-lg">Find culinary stories, recipes, and masterclasses across RecipeRec</p>
          <div className="relative max-w-xl mx-auto">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
            <Input
              placeholder="Search by story title, ingredients, or keywords..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-14 pl-12 rounded-full border-none bg-white text-gray-800 shadow-xl text-base font-medium"
            />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 mt-10">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-[#ff751f]" />
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-[#ff751f]" />
                Food Blogs & Stories ({filteredBlogs.length})
              </h2>
            </div>
            {filteredBlogs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBlogs.map((blog) => (
                  <Link key={blog.id} to={getBlogUrl(blog)}>
                    <div className="bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all h-full border border-gray-100 flex flex-col overflow-hidden">
                      {blog.image && (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={blog.image}
                            alt={blog.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-extrabold text-gray-900 line-clamp-2 mb-2 hover:text-[#ff751f] transition-colors">{blog.title}</h3>
                          <p className="text-sm text-gray-500 line-clamp-3">{blog.content}</p>
                        </div>
                        <span className="text-xs font-bold text-[#ff751f] mt-4 inline-block">
                          Read story →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-3xl border border-gray-100">
                <p className="text-gray-500 font-semibold text-lg">No blogs match your search query.</p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  )
}
