import { useState } from 'react'
import RecipeCard from '../components/RecipeCard'
import api from '../lib/api'
import { Search, Carrot, Loader2, Camera, Sparkles } from 'lucide-react'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'

export default function IngredientSearch() {
  const [ingredients, setIngredients] = useState('')
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async () => {
    if (!ingredients.trim()) return
    
    setLoading(true)
    setSearched(true)
    try {
      const { data } = await api.get(`/recipes/search/ingredients?ingredients=${encodeURIComponent(ingredients)}`)
      setRecipes(data.recipes || [])
    } catch (err) {
      console.error(err)
      setRecipes([])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="bg-orange-100 p-4 rounded-full">
              <Carrot className="h-12 w-12 text-orange-600" />
            </div>
          </div>
          <h1 className="text-4xl font-black text-gray-800 uppercase italic mb-3">
            What's in Your Kitchen?
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Enter ingredients you have and we'll find recipes you can make right now!
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-10">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="e.g., tomato, cheese, basil, pasta"
                  className="h-14 pl-12 rounded-xl text-lg"
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={loading}
                className="h-14 px-8 bg-orange-600 hover:bg-orange-700 rounded-xl text-lg font-semibold"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  'Search Recipes'
                )}
              </Button>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
              <Camera className="h-4 w-4" />
              <span>Tip: Separate ingredients with commas for better results</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-orange-600" />
          </div>
        ) : searched && recipes.length > 0 ? (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="h-5 w-5 text-orange-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                Found {recipes.length} recipe{recipes.length !== 1 ? 's' : ''}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </div>
        ) : searched && recipes.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-lg">
            <Carrot className="h-20 w-20 mx-auto text-gray-300 mb-4" />
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No recipes found</h3>
            <p className="text-gray-500">Try different ingredients or check your spelling</p>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="bg-white rounded-3xl shadow-lg p-12 max-w-md mx-auto">
              <Carrot className="h-16 w-16 mx-auto text-orange-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-700 mb-2">Start Cooking</h3>
              <p className="text-gray-500">Enter your ingredients above to discover recipes</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
