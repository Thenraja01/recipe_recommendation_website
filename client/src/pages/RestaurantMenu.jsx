import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../lib/api'
import RecipeCard from '../components/RecipeCard'
import { ArrowLeft, Clock, Star, Loader2 } from 'lucide-react'

export default function RestaurantMenu() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/restaurants/${id}`)
      .then(({ data }) => setRestaurant(data.restaurant))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <Loader2 className="h-10 w-10 animate-spin text-green-600" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Restaurant not found.</p>
        <Link to="/recommendations" className="text-green-600 underline mt-4 inline-block">Back</Link>
      </div>
    );
  }

  const menuCards = restaurant.menuItems.map((item, idx) => ({
    id: `${restaurant._id}-${idx}`,
    title: item.title,
    category: item.category,
    prepTime: item.prepTime,
    difficulty: 'Easy',
    price: item.price,
    image: item.image
  }));

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="relative h-56 md:h-72">
        <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <Link
          to="/recommendations"
          className="absolute top-4 left-4 bg-white/90 p-2 rounded-full hover:bg-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="absolute bottom-6 left-6 text-white">
          <h1 className="text-3xl font-bold">{restaurant.name}</h1>
          <p className="text-sm opacity-90">{restaurant.tagline}</p>
          <div className="flex gap-4 mt-2 text-sm">
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              {restaurant.rating}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {restaurant.deliveryTime} min delivery
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Menu</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {menuCards.map(item => (
            <RecipeCard key={item.id} recipe={item} />
          ))}
        </div>
      </div>

    </div>
  )
}
