import React from 'react'
import { Heart, Clock, User, Star } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { useNavigate } from 'react-router-dom'

export default function RecipeCard({ recipe }) {
  const [isLiked, setIsLiked] = React.useState(false);
  const navigate = useNavigate();

  // Check if item is already liked on mount
  React.useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (favorites.some(fav => fav.id === recipe.id)) {
      setIsLiked(true);
    }
  }, [recipe.id]);

  const toggleLike = (e) => {
    e.stopPropagation();
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    let updatedFavorites;
    
    if (isLiked) {
      updatedFavorites = favorites.filter(fav => fav.id !== recipe.id);
    } else {
      updatedFavorites = [...favorites, recipe];
    }
    
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    setIsLiked(!isLiked);
  };

  return (
    <Card 
      onClick={() => navigate(`/recipe/${recipe.id}`)}
      className="overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl group border-none bg-white shadow-xl rounded-3xl"
    >
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={recipe.image} 
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
        <div className="absolute bottom-3 left-3 px-3 py-1 rounded-xl bg-black/60 text-white text-[10px] font-black uppercase tracking-widest backdrop-blur-sm">
          {recipe.category}
        </div>
      </div>
      
      <CardHeader className="p-5 pb-2">
        <CardTitle className="text-xl font-black truncate text-gray-800 uppercase italic">
          {recipe.title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-5 pt-0 space-y-3">
        <div className="flex items-center justify-between text-sm text-gray-500 font-bold">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 text-green-600" />
            {recipe.prepTime}m
          </div>
          <div className="flex items-center">
             <span className="text-green-600 mr-1">$</span>{recipe.price}
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

