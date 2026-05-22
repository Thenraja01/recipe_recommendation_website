import { Clock, Star, MapPin, Percent } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function RestaurantCard({ restaurant, rank }) {
  const topItem = restaurant.menuItems?.[0];

  return (
    <Link
      to={`/restaurant/${restaurant._id}`}
      className="group block bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden border border-gray-100 active:scale-[0.98]"
    >
      <div className="relative h-40 overflow-hidden">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {rank && rank <= 3 && (
          <span className="absolute top-3 left-3 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-lg">
            #{rank} For You
          </span>
        )}
        {restaurant.offer && (
          <span className="absolute top-3 right-3 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1">
            <Percent className="h-3 w-3" />
            {restaurant.offer}
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start gap-2">
          <div>
            <h3 className="font-bold text-gray-900 group-hover:text-green-600 transition-colors">
              {restaurant.name}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">{restaurant.tagline}</p>
          </div>
          <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-lg text-sm font-bold shrink-0">
            <Star className="h-3.5 w-3.5 fill-green-600 text-green-600" />
            {restaurant.rating}
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {restaurant.location} · {restaurant.cuisine}
        </p>
        <div className="flex items-center justify-between mt-3 text-xs text-gray-600">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-green-600" />
            {restaurant.deliveryTime} min
          </span>
          <span>From ${restaurant.minOrder}</span>
        </div>
        {topItem && (
          <p className="mt-2 text-xs text-gray-500 truncate">
            Popular: {topItem.title} · ${topItem.price}
          </p>
        )}
      </div>
    </Link>
  )
}
