import { useState, useEffect } from 'react'
import RecipeCard from '../components/RecipeCard'
import api from '../lib/api'
import { Utensils, Search, Loader2 } from 'lucide-react'
import { Input } from '../components/ui/input'

export default function Recipes() {
  const [search, setSearch] = useState('')
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/recipes')
      .then(({ data }) => {
        setRecipes(data.recipes || [])
      })
      .catch((err) => {
        console.error(err)
        setError(err.response?.data?.message || 'Failed to load recipes. Please try again.')
      })
      .finally(() => setLoading(false))
  }, [])

  const filtered = recipes.filter(item =>
    item.title?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 bg-white min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-green-100 rounded-2xl">
            <Utensils className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-gray-800 uppercase italic">Recipes</h1>
            <p className="text-gray-400 font-medium tracking-wide">Discover dishes from our community</p>
          </div>
        </div>
        <div className="relative w-full md:w-[400px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 h-5 w-5" />
          <Input
            placeholder="Search recipes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-14 pl-12 rounded-2xl border-gray-100 bg-gray-50 focus-visible:ring-green-600"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-green-600" />
        </div>
      ) : error ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center text-center p-12 bg-red-50 rounded-[3rem] border-2 border-dashed border-red-200">
          <Utensils className="h-20 w-20 text-red-200 mb-6" />
          <h2 className="text-3xl font-black text-red-400 uppercase italic mb-4">Something Went Wrong</h2>
          <p className="text-red-400 font-medium max-w-sm">{error}</p>
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filtered.map((item) => (
            <RecipeCard key={item.id} recipe={item} />
          ))}
        </div>
      ) : (
        <div className="min-h-[40vh] flex flex-col items-center justify-center text-center p-12 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
          <Utensils className="h-20 w-20 text-slate-200 mb-6" />
          <h2 className="text-3xl font-black text-slate-400 uppercase italic mb-4">No Recipes Found</h2>
          <p className="text-slate-400 font-medium max-w-sm">Try adjusting your search or check back later for new recipes!</p>
        </div>
      )}
    </div>
  )
}
