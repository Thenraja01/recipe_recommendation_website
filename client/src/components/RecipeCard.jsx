import { useState, useEffect } from 'react'
import { Heart, Clock, User, ChefHat } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'

export default function RecipeCard({ recipe }) {
  const [isLiked, setIsLiked] = useState(false)
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) return
    api.get('/favorites')
      .then(({ data }) => {
        const favIds = (data.favorites || []).map(f => f.recipeId)
        if (favIds.includes(recipe.id)) setIsLiked(true)
      })
      .catch(() => {})
  }, [recipe.id, isAuthenticated])

  const toggleLike = async (e) => {
    e.stopPropagation()
    if (!isAuthenticated) {
      navigate('/auth')
      return
    }
    try {
      if (isLiked) {
        await api.delete(`/favorites/${recipe.id}`)
        setIsLiked(false)
      } else {
        await api.post('/favorites', { recipeId: recipe.id })
        setIsLiked(true)
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err)
    }
  }

  const difficultyColor = {
    EASY: 'bg-green-100 text-green-700',
    MEDIUM: 'bg-yellow-100 text-yellow-700',
    HARD: 'bg-red-100 text-red-700'
  }

  return (
    <Card
      onClick={() => navigate(`/recipe/${recipe.id}`)}
      className="overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl group border-none bg-white shadow-xl rounded-3xl"
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={recipe.image || 'https://images.unsplash.com/photo-1543353071-873f17a7a088?w=600'}
          alt={recipe.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <button
          onClick={toggleLike}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all z-10 ${
            isLiked ? 'bg-red-500 text-white' : 'bg-white/40 text-white hover:bg-white/60'
          }`}
        >
          <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
        </button>
        <div className={`absolute bottom-3 left-3 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest backdrop-blur-sm ${difficultyColor[recipe.difficulty] || 'bg-black/60 text-white'}`}>
          {recipe.difficulty || 'EASY'}
        </div>
      </div>

      <CardHeader className="p-5 pb-2">
        <CardTitle className="text-xl font-black truncate text-gray-800 uppercase italic">
          {recipe.title}
        </CardTitle>
        {recipe.creator && (
          <div className="flex items-center text-xs text-gray-400 mt-1">
            <User className="h-3 w-3 mr-1" />
            {recipe.creator.username}
          </div>
        )}
      </CardHeader>

      <CardContent className="p-5 pt-0 space-y-3">
        <div className="flex items-center justify-between text-sm text-gray-500 font-bold">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 text-green-600" />
            {recipe.prepTime}m
          </div>
          <div className="flex items-center">
            <ChefHat className="h-4 w-4 mr-1 text-orange-500" />
            {recipe.servings} serving{recipe.servings > 1 ? 's' : ''}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0">
        <Button className="w-full bg-slate-900 border-none hover:bg-green-600 text-white rounded-2xl transition-all shadow-lg font-black uppercase tracking-widest text-xs">
          View Recipe
        </Button>
      </CardFooter>
    </Card>
  )
}
