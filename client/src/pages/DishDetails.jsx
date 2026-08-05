import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock, Flame, Utensils, ChefHat, Loader2, AlertTriangle, Activity, Wheat, Droplets } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import api from '../lib/api'

export default function DishDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get(`/recipes/${id}`)
      .then(({ data }) => {
        if (!data.success) {
          setError(data.message || 'Recipe not found')
          return
        }
        setRecipe(data.recipe)
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to load recipe')
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-green-600" />
      </div>
    )
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <ChefHat className="h-20 w-20 text-gray-300" />
        <h2 className="text-2xl font-bold text-gray-700">{error || 'Recipe not found'}</h2>
        <Button onClick={() => navigate(-1)} className="bg-green-600 hover:bg-green-700">
          <ArrowLeft className="h-4 w-4 mr-2" /> Go Back
        </Button>
      </div>
    )
  }

  const difficultyColors = {
    EASY: 'bg-green-100 text-green-700',
    MEDIUM: 'bg-yellow-100 text-yellow-700',
    HARD: 'bg-red-100 text-red-700'
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="relative h-[400px]">
        <img
          src={recipe.image || 'https://images.unsplash.com/photo-1543353071-873f17a7a088?w=1200'}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <Button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 h-12 w-12 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 p-0"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
      </div>

      <div className="max-w-4xl mx-auto w-full -mt-20 relative z-10 px-4 pb-12">
        <div className="bg-white rounded-[2rem] shadow-2xl p-8 md:p-12 border border-slate-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest mb-2 inline-block ${difficultyColors[recipe.difficulty] || 'bg-slate-100 text-slate-600'}`}>
                {recipe.difficulty || 'EASY'}
              </span>
              <h1 className="text-4xl md:text-5xl font-black text-slate-800 uppercase italic tracking-tighter">
                {recipe.title}
              </h1>
              {recipe.creator && (
                <p className="text-slate-400 font-medium mt-2 text-sm">
                  by {recipe.creator.username}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-6 mb-10 pb-10 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-green-600" />
              <span className="font-bold text-slate-500 uppercase text-xs tracking-wider">Prep Time: {recipe.prepTime}m</span>
            </div>
            <div className="flex items-center space-x-2">
              <Utensils className="h-5 w-5 text-blue-500" />
              <span className="font-bold text-slate-500 uppercase text-xs tracking-wider">Servings: {recipe.servings}</span>
            </div>
            <div className="flex items-center space-x-2">
              <ChefHat className="h-5 w-5 text-orange-500" />
              <span className="font-bold text-slate-500 uppercase text-xs tracking-wider">Difficulty: {recipe.difficulty}</span>
            </div>
          </div>

          <div className="mb-12">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-[3px] mb-4 flex items-center">
              <Flame className="h-4 w-4 mr-2 text-red-500" /> Ingredients
            </h3>
            <div className="flex flex-wrap gap-3">
              {(recipe.ingredients || []).map((ing, i) => (
                <span key={i} className="px-5 py-2 bg-slate-100 rounded-xl text-slate-700 font-bold text-sm shadow-sm">
                  {ing.name || ing}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-[3px] mb-4 flex items-center">
              <ChefHat className="h-4 w-4 mr-2 text-green-500" /> Instructions
            </h3>
            <div className="text-slate-600 text-lg leading-relaxed whitespace-pre-wrap">
              {recipe.instructions}
            </div>
          </div>

          {/* Nutrition Information */}
          {(recipe.calories || recipe.protein || recipe.carbs) && (
            <Card className="mb-8 border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-600" /> Nutrition Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {recipe.calories && (
                    <div className="text-center p-3 bg-white rounded-xl">
                      <Flame className="h-5 w-5 mx-auto text-orange-500 mb-1" />
                      <p className="text-2xl font-bold text-slate-800">{recipe.calories}</p>
                      <p className="text-xs text-slate-500 uppercase">Calories</p>
                    </div>
                  )}
                  {recipe.protein && (
                    <div className="text-center p-3 bg-white rounded-xl">
                      <Activity className="h-5 w-5 mx-auto text-blue-500 mb-1" />
                      <p className="text-2xl font-bold text-slate-800">{recipe.protein}g</p>
                      <p className="text-xs text-slate-500 uppercase">Protein</p>
                    </div>
                  )}
                  {recipe.carbs && (
                    <div className="text-center p-3 bg-white rounded-xl">
                      <Wheat className="h-5 w-5 mx-auto text-yellow-600 mb-1" />
                      <p className="text-2xl font-bold text-slate-800">{recipe.carbs}g</p>
                      <p className="text-xs text-slate-500 uppercase">Carbs</p>
                    </div>
                  )}
                  {recipe.fat && (
                    <div className="text-center p-3 bg-white rounded-xl">
                      <Droplets className="h-5 w-5 mx-auto text-purple-500 mb-1" />
                      <p className="text-2xl font-bold text-slate-800">{recipe.fat}g</p>
                      <p className="text-xs text-slate-500 uppercase">Fat</p>
                    </div>
                  )}
                </div>
                {(recipe.sodium || recipe.fiber || recipe.sugar) && (
                  <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                    {recipe.sodium && <div className="bg-white p-2 rounded-lg text-center"><span className="text-slate-500">Sodium:</span> <span className="font-bold">{recipe.sodium}mg</span></div>}
                    {recipe.fiber && <div className="bg-white p-2 rounded-lg text-center"><span className="text-slate-500">Fiber:</span> <span className="font-bold">{recipe.fiber}g</span></div>}
                    {recipe.sugar && <div className="bg-white p-2 rounded-lg text-center"><span className="text-slate-500">Sugar:</span> <span className="font-bold">{recipe.sugar}g</span></div>}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Allergen Warnings */}
          {recipe.allergens && recipe.allergens.length > 0 && (
            <Card className="mb-8 border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" /> Allergen Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {recipe.allergens.map((allergen, i) => (
                    <span key={i} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                      {allergen}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-red-600 mt-3">
                  This recipe contains the allergens listed above. Please check if you have any dietary restrictions.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
