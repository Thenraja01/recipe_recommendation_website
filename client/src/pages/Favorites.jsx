import React, { useState, useEffect } from 'react'
import RecipeCard from '../components/RecipeCard'
import { Heart, Utensils, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(saved);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 bg-white min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-red-100 rounded-2xl shadow-xl shadow-red-100">
                <Heart className="h-8 w-8 text-red-500 fill-current" />
            </div>
            <div>
                <h1 className="text-4xl font-black text-gray-800 uppercase italic">My Favorites</h1>
                <p className="text-gray-400 font-medium tracking-wide">Dishes you loved at first sight</p>
            </div>
          </div>
          <Link to="/recipes" className="group flex items-center space-x-2 text-slate-400 font-black uppercase tracking-widest text-xs hover:text-green-600 transition-colors">
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Menu</span>
          </Link>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {favorites.map((item) => (
            <RecipeCard key={item.id} recipe={item} />
          ))}
        </div>
      ) : (
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-12 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
            <Utensils className="h-20 w-20 text-slate-200 mb-6" />
            <h2 className="text-3xl font-black text-slate-400 uppercase italic mb-4">No Favorites Yet</h2>
            <p className="text-slate-400 font-medium max-w-sm">Browse our menu and click the heart icon on any dish to save it here for later!</p>
            <Link to="/recipes" className="mt-8 px-10 py-4 bg-green-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-green-700 transition-all active:scale-95 shadow-xl shadow-green-600/20">
                Start Exploring
            </Link>
        </div>
      )}
    </div>
  )
}
