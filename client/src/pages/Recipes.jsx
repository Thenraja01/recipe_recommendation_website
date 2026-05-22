import React, { useState, useEffect } from 'react'
import RecipeCard from '../components/RecipeCard'
import api from '../lib/api'
import { Utensils, Search, Loader2 } from 'lucide-react'
import { Input } from '../components/ui/input'

export default function Recipes() {
  const [search, setSearch] = useState('');
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/restaurants')
      .then(({ data }) => {
        const flat = (data.restaurants || []).flatMap(r =>
          (r.menuItems || []).map((item, idx) => ({
            id: `${r._id}-${idx}`,
            title: item.title,
            category: item.category,
            prepTime: item.prepTime,
            difficulty: 'Easy',
            price: item.price,
            image: item.image
          }))
        );
        setMenuItems(flat);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = menuItems.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 bg-white min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-green-100 rounded-2xl">
            <Utensils className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-gray-800 uppercase italic">Digital Menu</h1>
            <p className="text-gray-400 font-medium tracking-wide">All dishes from partner hotels</p>
          </div>
        </div>
        <div className="relative w-full md:w-[400px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 h-5 w-5" />
          <Input
            placeholder="Search food item..."
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
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filtered.map((item) => (
            <RecipeCard key={item.id} recipe={item} />
          ))}
        </div>
      )}
    </div>
  )
}
