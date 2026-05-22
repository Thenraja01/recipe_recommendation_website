import React, { useState, useEffect } from 'react'
import RecipeCard from '../components/RecipeCard'
import RestaurantCard from '../components/RestaurantCard'
import api from '../lib/api'
import { Search, Sparkles, Utensils, Coffee, Pizza, Soup, Store, Loader2 } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Link } from 'react-router-dom'

const categories = [
  { id: 'all', name: 'All Recipes', icon: Sparkles },
  { id: 'breakfast', name: 'Breakfast', icon: Coffee },
  { id: 'lunch', name: 'Lunch', icon: Utensils },
  { id: 'dinner', name: 'Dinner', icon: Pizza },
  { id: 'soups', name: 'Soups', icon: Soup },
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loadingHotels, setLoadingHotels] = useState(true);

  const userStr = localStorage.getItem('user');
  const userType = localStorage.getItem('userType');
  const user = userStr ? JSON.parse(userStr) : null;
  const username = user ? user.username : (userType === 'guest' ? 'Guest' : 'Member');

  useEffect(() => {
    const prefs = user?.preferences
      ? user.preferences
      : { preferredCuisines: [], dietary: 'any', maxDeliveryMinutes: 45 };
    const params = user ? {} : { preferences: JSON.stringify(prefs) };

    api.get('/restaurants/recommendations', { params })
      .then(({ data }) => {
        const list = data.restaurants || [];
        setRestaurants(list.slice(0, 4));
        const flat = list.flatMap(r =>
          (r.menuItems || []).map((item, idx) => ({
            id: `${r._id}-${idx}`,
            title: item.title,
            category: item.category,
            prepTime: item.prepTime,
            difficulty: 'Easy',
            price: item.price,
            image: item.image,
            restaurantName: r.name
          }))
        );
        setMenuItems(flat);
      })
      .catch(console.error)
      .finally(() => setLoadingHotels(false));
  }, [user]);

  const filteredRecipes = menuItems.filter(recipe => {
    const matchesCategory = activeCategory === 'all' || recipe.category === activeCategory;
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="relative min-h-screen bg-[#f8fafc] pb-24">
      <section className="relative h-[450px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-500 to-green-700">
        <div className="absolute inset-0 z-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1543353071-873f17a7a088?ixlib=rb-4.0.3"
            alt="background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-3xl animate-in fade-in zoom-in duration-700">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-md">
            Welcome, <span className="text-yellow-300 capitalize">{username}</span>
          </h1>
          <p className="text-xl md:text-2xl font-light opacity-90 mb-8 max-w-2xl mx-auto">
            Order from hotels near you or ask our AI chef for any recipe.
          </p>

          <div className="relative max-w-xl mx-auto group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors group-focus-within:text-green-600" />
            <Input
              placeholder="Search dishes from partner hotels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-14 pl-12 rounded-2xl border-none bg-white/90 backdrop-blur-md text-gray-800 shadow-xl focus-visible:ring-2 focus-visible:ring-yellow-400 transition-all text-lg"
            />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 mt-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Store className="h-6 w-6 text-orange-500" />
            Top picks for you
          </h2>
          <Link to="/recommendations" className="text-green-600 font-semibold text-sm hover:underline">
            See all restaurants →
          </Link>
        </div>
        {loadingHotels ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {restaurants.map((r, i) => (
              <RestaurantCard key={r._id} restaurant={r} rank={i + 1} />
            ))}
          </div>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-4 -mt-4 relative z-20 mt-12">
        <div className="bg-white/70 backdrop-blur-xl p-4 rounded-3xl shadow-2xl flex items-center space-x-2 md:space-x-4 overflow-x-auto no-scrollbar border border-white/40">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-2xl transition-all whitespace-nowrap active:scale-95 ${
                activeCategory === cat.id
                  ? 'bg-green-600 text-white shadow-lg shadow-green-600/30'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <cat.icon className="h-5 w-5" />
              <span className="font-semibold">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 mt-12">
        <div className="flex items-center justify-between mb-8 px-2">
          <h2 className="text-3xl font-bold text-gray-800">
            {activeCategory === 'all' ? 'Dishes from partner hotels' : `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} menu`}
          </h2>
          <span className="text-gray-500 text-sm font-medium">Showing {filteredRecipes.length} results</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredRecipes.map((recipe) => (
            <div key={recipe.id} className="animate-in fade-in slide-in-from-bottom-5 duration-500">
              <RecipeCard recipe={recipe} />
            </div>
          ))}
          {filteredRecipes.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <Soup className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-xl font-semibold">No dishes found. Try another category or search.</p>
            </div>
          )}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 mt-24">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Need a custom recipe?</h3>
          <p className="text-gray-500 mb-6 font-medium leading-relaxed">
            Open the green chat button — enter a dish name or prompt and our AI chef will generate steps for you.
          </p>
        </div>
      </section>

    </div>
  )
}
