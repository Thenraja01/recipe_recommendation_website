import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Utensils, Plus, Trash2, Loader2, ArrowLeft } from 'lucide-react'
import api from '@/lib/api'

export default function CreateRecipe() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [instructions, setInstructions] = useState('')
  const [prepTime, setPrepTime] = useState('')
  const [servings, setServings] = useState('')
  const [difficulty, setDifficulty] = useState('Medium')
  const [ingredients, setIngredients] = useState([''])
  const [error, setError] = useState('')

  const addIngredient = () => {
    setIngredients([...ingredients, ''])
  }

  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index))
  }

  const updateIngredient = (index, value) => {
    const updated = [...ingredients]
    updated[index] = value
    setIngredients(updated)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!title || !instructions || !prepTime || !servings) {
      setError('Please fill in all required fields')
      return
    }

    const validIngredients = ingredients.filter(i => i.trim() !== '')
    if (validIngredients.length === 0) {
      setError('Please add at least one ingredient')
      return
    }

    setLoading(true)
    try {
      const { data } = await api.post('/recipes', {
        title,
        instructions,
        prepTime: parseInt(prepTime),
        servings: parseInt(servings),
        difficulty,
        ingredients: validIngredients
      })
      navigate(`/recipe/${data.recipe.id}`)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create recipe')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/recipes')}
          className="mb-6 text-gray-600 hover:text-green-600"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Recipes
        </Button>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="h-32 bg-gradient-to-br from-[#8cc89a] via-[#c6ebd4] to-[#f0f9f2] flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <Utensils className="h-10 w-10 text-green-700" />
              <h1 className="text-3xl font-black text-gray-800 uppercase italic">Create Recipe</h1>
            </div>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="title">Recipe Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Grandma's Apple Pie"
                  className="h-12 rounded-xl"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty Level</Label>
                <select
                  id="difficulty"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prepTime">Prep Time (minutes) *</Label>
                  <Input
                    id="prepTime"
                    type="number"
                    value={prepTime}
                    onChange={(e) => setPrepTime(e.target.value)}
                    placeholder="30"
                    className="h-12 rounded-xl"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="servings">Servings *</Label>
                  <Input
                    id="servings"
                    type="number"
                    value={servings}
                    onChange={(e) => setServings(e.target.value)}
                    placeholder="4"
                    className="h-12 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>Ingredients *</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addIngredient}
                    className="text-green-600 border-green-200 hover:bg-green-50"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Ingredient
                  </Button>
                </div>
                {ingredients.map((ingredient, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={ingredient}
                      onChange={(e) => updateIngredient(index, e.target.value)}
                      placeholder={`Ingredient ${index + 1}`}
                      className="h-12 rounded-xl flex-1"
                    />
                    {ingredients.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeIngredient(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructions">Instructions *</Label>
                <textarea
                  id="instructions"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Step-by-step cooking instructions..."
                  className="w-full min-h-[150px] px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-green-600 hover:bg-green-700 rounded-xl text-lg font-semibold"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Creating...
                  </>
                ) : (
                  'Create Recipe'
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
