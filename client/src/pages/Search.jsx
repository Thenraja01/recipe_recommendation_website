import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Loader2, Search as SearchIcon, UtensilsCrossed } from 'lucide-react'
import { Input } from '@/components/ui/input'
import RecipeCard from '@/components/RecipeCard'
import api from '@/lib/api'

export default function Search() {
  const [query, setQuery] = useState('')
  const [recipes, setRecipes] = useState([])
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [recipesRes, blogsRes] = await Promise.all([
          api.get('/recipes'),
          api.get('/blogs'),
        ])
        setRecipes(recipesRes.data.recipes || [])
        setBlogs(blogsRes.data.blogs || [])
      } catch (err) {
        console.error('Search data load failed:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const normalizedQuery = query.trim().toLowerCase()

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title?.toLowerCase().includes(normalizedQuery)
  )

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title?.toLowerCase().includes(normalizedQuery) ||
      blog.content?.toLowerCase().includes(normalizedQuery)
  )

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24">
      <section className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <SearchIcon className="h-10 w-10 mx-auto mb-3 opacity-90" />
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Search</h1>
          <p className="opacity-90 mb-6">Find recipes and food blogs across RecipeRec</p>
          <div className="relative max-w-xl mx-auto">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search by title or keyword..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-14 pl-12 rounded-2xl border-none bg-white text-gray-800 shadow-xl text-lg"
            />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 mt-10">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-green-600" />
          </div>
        ) : (
          <>
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-6">
                <UtensilsCrossed className="h-6 w-6 text-green-600" />
                Recipes ({filteredRecipes.length})
              </h2>
              {filteredRecipes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredRecipes.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No recipes match your search.</p>
              )}
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-6">
                <BookOpen className="h-6 w-6 text-purple-500" />
                Food Blogs ({filteredBlogs.length})
              </h2>
              {filteredBlogs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBlogs.map((blog) => (
                    <Link key={blog.id} to={`/blog/${blog.id}`}>
                      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all h-full">
                        {blog.image && (
                          <div className="aspect-video overflow-hidden">
                            <img
                              src={blog.image}
                              alt={blog.title}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <div className="p-4">
                          <h3 className="font-bold text-gray-800 line-clamp-2 mb-2">{blog.title}</h3>
                          <p className="text-sm text-gray-500 line-clamp-3">{blog.content}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No blogs match your search.</p>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  )
}
