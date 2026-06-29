import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import RecipeCard from '../components/RecipeCard'
import api from '../lib/api'
import { useAuth } from '@/context/AuthContext'
import {
  Search,
  Sparkles,
  Utensils,
  Coffee,
  Pizza,
  Soup,
  BookOpen,
  Loader2,
  Bot,
  ArrowRight,
  Heart,
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'

const categories = [
  { id: 'all', name: 'All Recipes', icon: Sparkles },
  { id: 'breakfast', name: 'Breakfast', icon: Coffee },
  { id: 'lunch', name: 'Lunch', icon: Utensils },
  { id: 'dinner', name: 'Dinner', icon: Pizza },
  { id: 'soups', name: 'Soups', icon: Soup },
]

function GuestHome({ blogs, loadingBlogs }) {
  return (
    <div className="relative min-h-screen bg-[#f8fafc] pb-24">
      <section className="relative min-h-[480px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-800 via-green-800 to-green-600">
        <div className="absolute inset-0 z-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1543353071-873f17a7a088?ixlib=rb-4.0.3"
            alt="background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-md">
            AI Recipe Recommendations & <span className="text-yellow-300">Food Blogs</span>
          </h1>
          <p className="text-lg md:text-xl font-light opacity-90 mb-8 max-w-2xl mx-auto">
            Discover dishes, read food stories, and let our AI chef help you cook — sign up to unlock personalized recipes and favorites.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/auth/signup">
              <Button className="h-12 px-8 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold">
                Get Started Free
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="outline" className="h-12 px-8 rounded-2xl border-white text-white hover:bg-white/10">
                Login
              </Button>
            </Link>
            <Link to="/blogs">
              <Button variant="outline" className="h-12 px-8 rounded-2xl border-white/60 text-white hover:bg-white/10">
                Browse Blogs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-10">Why RecipeRec?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center border border-gray-100">
            <Sparkles className="h-10 w-10 mx-auto text-green-600 mb-4" />
            <h3 className="font-bold text-lg mb-2">Smart Recommendations</h3>
            <p className="text-gray-500 text-sm">Get recipe picks tailored to your taste once you create an account.</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center border border-gray-100">
            <Bot className="h-10 w-10 mx-auto text-orange-500 mb-4" />
            <h3 className="font-bold text-lg mb-2">AI Chef Assistant</h3>
            <p className="text-gray-500 text-sm">Ask for any dish and receive step-by-step cooking guidance instantly.</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center border border-gray-100">
            <Heart className="h-10 w-10 mx-auto text-red-500 mb-4" />
            <h3 className="font-bold text-lg mb-2">Save Favorites</h3>
            <p className="text-gray-500 text-sm">Bookmark recipes you love and access them anytime from your profile.</p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-purple-500" />
            Featured Food Blogs
          </h2>
          <Link to="/blogs" className="text-green-600 font-semibold text-sm hover:underline flex items-center gap-1">
            Read more <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {loadingBlogs ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {blogs.map((blog) => (
              <Link key={blog.id} to={`/blog/${blog.id}`}>
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer group h-full">
                  {blog.image && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-800 line-clamp-2 mb-2 group-hover:text-green-600 transition-colors">
                      {blog.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2">{blog.content}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="max-w-4xl mx-auto px-4 mt-20">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-8 md:p-12 text-center text-white shadow-xl">
          <h3 className="text-2xl md:text-3xl font-bold mb-3">Ready to cook smarter?</h3>
          <p className="opacity-90 mb-6 max-w-xl mx-auto">
            Join RecipeRec for personalized recommendations, saved favorites, and full access to our AI chef.
          </p>
          <Link to="/auth/signup">
            <Button className="bg-white text-green-700 hover:bg-yellow-100 rounded-2xl h-12 px-8 font-bold">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

function AuthenticatedHome({ user, blogs, loadingBlogs, recipes, loadingRecipes }) {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesCategory = activeCategory === 'all' || recipe.category === activeCategory
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="relative min-h-screen bg-[#f8fafc] pb-24">
      <section className="relative h-[450px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-500 to-green-700">
        <div className="absolute inset-0 z-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1543353071-873f17a7a088?ixlib=rb-4.0.3"
            alt="background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-3xl animate-in fade-in zoom-in duration-700">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-md">
            Welcome back, <span className="text-yellow-300 capitalize">{user.username}</span>
          </h1>
          <p className="text-xl md:text-2xl font-light opacity-90 mb-8 max-w-2xl mx-auto">
            Your personalized hub for recipes, food blogs, and AI-powered cooking help.
          </p>
          <div className="relative max-w-xl mx-auto group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors group-focus-within:text-green-600" />
            <Input
              placeholder="Search recipes and food blogs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-14 pl-12 rounded-2xl border-none bg-white/90 backdrop-blur-md text-gray-800 shadow-xl focus-visible:ring-2 focus-visible:ring-yellow-400 transition-all text-lg"
            />
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <Link to="/recipes">
              <Button className="bg-white/20 hover:bg-white/30 text-white border border-white/40 rounded-xl">
                Browse Recipes
              </Button>
            </Link>
            <Link to="/search">
              <Button className="bg-yellow-400 hover:bg-yellow-300 text-slate-900 rounded-xl font-semibold">
                Advanced Search
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 mt-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-purple-500" />
            Latest Food Blogs
          </h2>
          <Link to="/blogs" className="text-green-600 font-semibold text-sm hover:underline">
            See all blogs →
          </Link>
        </div>
        {loadingBlogs ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {blogs.map((blog) => (
              <Link key={blog.id} to={`/blog/${blog.id}`}>
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer group">
                  {blog.image && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-800 line-clamp-2 mb-2 group-hover:text-green-600 transition-colors">
                      {blog.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2">{blog.content}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-4 mt-12">
        <div className="bg-white/70 backdrop-blur-xl p-4 rounded-3xl shadow-2xl flex items-center space-x-2 md:space-x-4 overflow-x-auto no-scrollbar border border-white/40">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-2xl transition-all whitespace-nowrap active:scale-95 ${
                activeCategory === cat.id
                  ? 'bg-green-600 text-white shadow-lg shadow-green-600/30'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <cat.icon className="h-5 w-5" />
              <span className="font-semibold">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 mt-12">
        <div className="flex items-center justify-between mb-8 px-2">
          <h2 className="text-3xl font-bold text-gray-800">
            {activeCategory === 'all' ? 'Popular Recipes' : `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Recipes`}
          </h2>
          <span className="text-gray-500 text-sm font-medium">
            {loadingRecipes ? 'Loading...' : `Showing ${filteredRecipes.length} results`}
          </span>
        </div>

        {loadingRecipes ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredRecipes.map((recipe) => (
              <div key={recipe.id} className="animate-in fade-in slide-in-from-bottom-5 duration-500">
                <RecipeCard recipe={recipe} />
              </div>
            ))}
            {filteredRecipes.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <Soup className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-xl font-semibold">No dishes found. Try another category or search.</p>
              </div>
            )}
          </div>
        )}
      </section>

      <section className="max-w-4xl mx-auto px-4 mt-24">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Need a custom recipe?</h3>
          <p className="text-gray-500 mb-6 font-medium leading-relaxed">
            Open the green chat button — enter a dish name or prompt and our AI chef will generate steps for you.
          </p>
        </div>
      </section>
    </div>
  )
}

export default function Home() {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const [recipes, setRecipes] = useState([])
  const [blogs, setBlogs] = useState([])
  const [loadingRecipes, setLoadingRecipes] = useState(false)
  const [loadingBlogs, setLoadingBlogs] = useState(true)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoadingBlogs(true)
        const { data } = await api.get('/blogs')
        setBlogs((data.blogs || []).slice(0, 4))
      } catch (error) {
        console.error('Error fetching blogs:', error)
      } finally {
        setLoadingBlogs(false)
      }
    }
    fetchBlogs()
  }, [])

  useEffect(() => {
    if (!isAuthenticated) return

    const fetchRecipes = async () => {
      try {
        setLoadingRecipes(true)
        const { data } = await api.get('/recipes')
        setRecipes(data.recipes || [])
      } catch (error) {
        console.error('Error fetching recipes:', error)
      } finally {
        setLoadingRecipes(false)
      }
    }
    fetchRecipes()
  }, [isAuthenticated])

  if (authLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <GuestHome blogs={blogs} loadingBlogs={loadingBlogs} />
  }

  return (
    <AuthenticatedHome
      user={user}
      blogs={blogs}
      loadingBlogs={loadingBlogs}
      recipes={recipes}
      loadingRecipes={loadingRecipes}
    />
  )
}
