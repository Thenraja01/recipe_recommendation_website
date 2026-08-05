import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Building2, Star, Clock, MapPin, UtensilsCrossed, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import api from '@/lib/api'

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRestaurants()
  }, [])

  const fetchRestaurants = async () => {
    try {
      const { data } = await api.get('/restaurants')
      setRestaurants(data.restaurants || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-orange-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="bg-orange-100 p-4 rounded-full">
              <Building2 className="h-12 w-12 text-orange-600" />
            </div>
          </div>
          <h1 className="text-4xl font-black text-gray-800 uppercase italic mb-3">
            Discover Restaurants
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explore amazing restaurants and order your favorite dishes
          </p>
        </div>

        {restaurants.length === 0 ? (
          <Card className="text-center py-16">
            <Building2 className="h-20 w-20 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">No restaurants yet</h3>
            <p className="text-gray-500">Check back later for new restaurants!</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <Link key={restaurant.id} to={`/restaurant/${restaurant.id}`}>
                <Card className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer h-full">
                  {restaurant.image ? (
                    <img src={restaurant.image} alt={restaurant.name} className="w-full h-48 object-cover" />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-orange-100 to-green-100 flex items-center justify-center">
                      <Building2 className="h-16 w-16 text-orange-300" />
                    </div>
                  )}
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{restaurant.name}</h3>
                    <p className="text-sm text-gray-500 mb-3">{restaurant.cuisineType || 'Various cuisines'}</p>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-semibold text-gray-700">{restaurant.rating.toFixed(1)}</span>
                    </div>

                    {restaurant.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{restaurant.description}</p>
                    )}

                    <div className="space-y-2">
                      {restaurant.address && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span className="truncate">{restaurant.address}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{restaurant.isOpen ? 'Open now' : 'Closed'}</span>
                        {restaurant.openingTime && restaurant.closingTime && (
                          <span className="text-gray-400">• {restaurant.openingTime} - {restaurant.closingTime}</span>
                        )}
                      </div>
                    </div>

                    <Button className="w-full mt-4 bg-orange-600 hover:bg-orange-700">
                      <UtensilsCrossed className="h-4 w-4 mr-2" /> View Menu
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
