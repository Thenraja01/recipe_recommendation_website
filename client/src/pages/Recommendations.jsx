import { useEffect, useState } from 'react'
import RecipeCard from '../components/RecipeCard'
import api from '../lib/api'
import { Sparkles, Filter, Loader2, ChefHat } from 'lucide-react'
import { Button } from '../components/ui/button'

export default function Recommendations() {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/recipes')
        setRecipes(data.recipes || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24">
      <section className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-6 w-6" />
            <span className="text-sm font-semibold uppercase tracking-wider opacity-90">
              AI-Powered Picks
            </span>
          </div>
          <h1 className="text-4xl font-extrabold">Recommended for You</h1>
          <p className="mt-2 text-lg opacity-90 max-w-xl">
            Discover recipes tailored to your taste. Use the AI Chef chat (green button) for personalized suggestions!
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 mt-10">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-green-600" />
          </div>
        ) : recipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recipes.map((r) => (
              <RecipeCard key={r.id} recipe={r} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <ChefHat className="h-20 w-20 mx-auto text-gray-300 mb-4" />
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No recipes yet</h3>
            <p className="text-gray-500">Check back later or chat with our AI Chef for instant suggestions!</p>
          </div>
        )}
      </section>
    </div>
  )
}
