import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock, Star, Leaf, Flame, Utensils, Zap, Calendar } from 'lucide-react'
import { Button } from '../components/ui/button'
  
export default function DishDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dish = menuItems.find(item => item.id === parseInt(id));

  if (!dish) return <div>Dish not found</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="relative h-[400px]">
        <img src={dish.image} alt={dish.title} className="w-full h-full object-cover" />
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
                <span className="px-3 py-1 bg-green-100 text-green-600 rounded-lg text-[10px] font-black uppercase tracking-widest mb-2 inline-block">
                    {dish.category}
                </span>
                <h1 className="text-4xl md:text-5xl font-black text-slate-800 uppercase italic tracking-tighter">
                    {dish.title}
                </h1>
              </div>
              <div className="bg-yellow-400 px-6 py-2 rounded-2xl shadow-xl">
                 <span className="text-2xl font-black text-slate-900">${dish.price}</span>
              </div>
           </div>

           <div className="flex flex-wrap gap-6 mb-10 pb-10 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-green-600" />
                <span className="font-bold text-slate-500 uppercase text-xs tracking-wider">Backing Time: {dish.prepTime}m</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <span className="font-bold text-slate-500 uppercase text-xs tracking-wider">Rating: {dish.rating} / 5</span>
              </div>
              <div className="flex items-center space-x-2">
                <Utensils className="h-5 w-5 text-blue-500" />
                <span className="font-bold text-slate-500 uppercase text-xs tracking-wider">Difficulty: {dish.difficulty}</span>
              </div>
           </div>

           <div className="mb-10">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-[3px] mb-4 flex items-center">
                 <Leaf className="h-4 w-4 mr-2 text-green-500" /> Description
              </h3>
              <p className="text-slate-600 text-lg leading-relaxed font-medium capitalize italic">
                 {dish.description}
              </p>
           </div>

           <div className="mb-12">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-[3px] mb-4 flex items-center">
                 <Flame className="h-4 w-4 mr-2 text-red-500" /> Ingredients
              </h3>
              <div className="flex flex-wrap gap-3">
                 {dish.ingredients.map((ing, i) => (
                    <span key={i} className="px-5 py-2 bg-slate-100 rounded-xl text-slate-700 font-bold text-sm shadow-sm">
                        {ing}
                    </span>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
