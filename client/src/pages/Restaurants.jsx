import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Building2, 
  Star, 
  Clock, 
  MapPin, 
  UtensilsCrossed, 
  Loader2, 
  Search, 
  Sparkles, 
  ShoppingBag,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import api from '@/lib/api'
import { useAuth } from '@/context/AuthContext'

export default function Restaurants() {
  const { user, isAuthenticated } = useAuth()
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCuisine, setSelectedCuisine] = useState('All')
  const [onlyOpen, setOnlyOpen] = useState(false)

  useEffect(() => {
    fetchRestaurants()
  }, [])

  const fetchRestaurants = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/restaurants')
      setRestaurants(data.restaurants || [])
    } catch (err) {
      console.error('Failed to load restaurants:', err)
    } finally {
      setLoading(false)
    }
  }

  // Derive unique cuisines from the fetched restaurants
  const cuisines = [
    'All',
    ...Array.from(
      new Set(
        restaurants
          .map((r) => r.cuisineType)
          .filter(Boolean)
          .flatMap((c) => c.split(/[,/]/).map((s) => s.trim()))
      )
    ),
  ]

  const filteredRestaurants = restaurants.filter((r) => {
    const matchesSearch =
      r.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.cuisineType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCuisine =
      selectedCuisine === 'All' ||
      r.cuisineType?.toLowerCase().includes(selectedCuisine.toLowerCase())

    const matchesOpen = !onlyOpen || r.isOpen

    return matchesSearch && matchesCuisine && matchesOpen
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/50 via-white to-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* HERO SECTION */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100/80 text-[#ff751f] text-xs font-black uppercase tracking-wider mb-4 border border-orange-200">
            <UtensilsCrossed className="h-4 w-4" /> Partner Dining & AI Ordering
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-anton text-gray-900 uppercase tracking-tight mb-4">
            Partner <span className="text-[#ff751f]">Restaurants</span> & Dining
          </h1>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
            Browse our handpicked gourmet eateries, interact with our real-time AI Dining Waiter, and order delightful dishes delivered fresh.
          </p>

          {/* QUICK LINKS FOR LOGGED IN USERS */}
          {isAuthenticated && (
            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              <Link to="/orders">
                <Button variant="outline" size="sm" className="rounded-full border-gray-300 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 hover:border-[#ff751f] hover:text-[#ff751f]">
                  <ShoppingBag className="h-3.5 w-3.5 text-[#ff751f]" /> My Orders
                </Button>
              </Link>
              {(user?.role === 'ADMIN' || user?.role === 'OWNER') && (
                <Link to="/restaurant-admin">
                  <Button variant="outline" size="sm" className="rounded-full border-gray-300 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 hover:border-[#ff751f] hover:text-[#ff751f]">
                    <Building2 className="h-3.5 w-3.5 text-amber-500" /> Manage Restaurant Portal
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>

        {/* SEARCH AND FILTERS */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-100 mb-10 max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search restaurants, cuisines, dishes, or locations..."
                className="pl-11 h-12 rounded-2xl border-gray-200 focus:border-[#ff751f] focus:ring-1 focus:ring-[#ff751f] text-sm"
              />
            </div>
            <div className="flex items-center gap-2 self-stretch md:self-auto">
              <Button
                variant={onlyOpen ? 'default' : 'outline'}
                onClick={() => setOnlyOpen(!onlyOpen)}
                className={`rounded-2xl h-12 px-5 font-bold text-xs uppercase tracking-wide flex items-center gap-2 ${
                  onlyOpen
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                <Clock className="h-4 w-4" />
                {onlyOpen ? 'Showing Open Only' : 'Filter: Open Now'}
              </Button>
            </div>
          </div>

          {/* CUISINE CHIPS */}
          {cuisines.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pt-4 mt-3 border-t border-gray-100 scrollbar-none">
              <span className="text-xs font-black uppercase tracking-wider text-gray-400 shrink-0 mr-1">
                Cuisine:
              </span>
              {cuisines.map((cuisine) => (
                <button
                  key={cuisine}
                  onClick={() => setSelectedCuisine(cuisine)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCuisine === cuisine
                      ? 'bg-black text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cuisine}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RESTAURANTS LIST */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="h-12 w-12 animate-spin text-[#ff751f] mb-3" />
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Discovering Restaurants...</p>
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <Card className="text-center py-20 border border-dashed border-gray-200 rounded-3xl bg-white max-w-xl mx-auto p-8">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mx-auto mb-4 text-[#ff751f]">
              <Building2 className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No matching restaurants</h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
              Try adjusting your search keywords or cuisine filter to explore other dining spots.
            </p>
            <Button
              onClick={() => {
                setSearchQuery('')
                setSelectedCuisine('All')
                setOnlyOpen(false)
              }}
              variant="outline"
              className="rounded-full font-bold text-xs uppercase tracking-wider"
            >
              Reset Filters
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRestaurants.map((restaurant) => (
              <Link 
                key={restaurant.id} 
                to={`/restaurant/${restaurant.id}`}
                className="group focus:outline-none"
              >
                <Card className="overflow-hidden border border-gray-100 hover:border-orange-200 shadow-sm hover:shadow-xl transition-all duration-300 rounded-3xl h-full flex flex-col bg-white group-hover:-translate-y-1">
                  {/* RESTAURANT IMAGE */}
                  <div className="relative h-52 w-full overflow-hidden bg-gray-100">
                    {restaurant.image ? (
                      <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                        <Building2 className="h-16 w-16 text-orange-300" />
                      </div>
                    )}

                    {/* OPEN / CLOSED BADGE */}
                    <div className="absolute top-4 left-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider shadow-md backdrop-blur-md ${
                          restaurant.isOpen
                            ? 'bg-green-500/90 text-white'
                            : 'bg-black/70 text-gray-200'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${restaurant.isOpen ? 'bg-white animate-ping' : 'bg-red-400'}`} />
                        {restaurant.isOpen ? 'Open Now' : 'Closed'}
                      </span>
                    </div>

                    {/* RATING BADGE */}
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs font-black text-gray-900">
                        {Number(restaurant.rating || 4.5).toFixed(1)}
                      </span>
                    </div>
                  </div>

                  {/* RESTAURANT DETAILS */}
                  <CardContent className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#ff751f] transition-colors line-clamp-1">
                          {restaurant.name}
                        </h3>
                      </div>

                      <p className="text-xs font-bold text-[#ff751f] uppercase tracking-wide mb-3">
                        {restaurant.cuisineType || 'Artisanal Cuisine'}
                      </p>

                      {restaurant.description && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                          {restaurant.description}
                        </p>
                      )}
                    </div>

                    <div className="pt-4 border-t border-gray-100 space-y-2.5">
                      {restaurant.address && (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <MapPin className="h-3.5 w-3.5 text-[#ff751f] shrink-0" />
                          <span className="truncate">{restaurant.address}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                        <span>
                          {restaurant.openingTime && restaurant.closingTime
                            ? `${restaurant.openingTime} – ${restaurant.closingTime}`
                            : 'Hours available on menu'}
                        </span>
                      </div>

                      <div className="pt-2">
                        <Button className="w-full bg-black group-hover:bg-[#ff751f] text-white font-extrabold rounded-2xl h-11 transition-colors flex items-center justify-center gap-2 text-xs uppercase tracking-wider shadow-sm">
                          <UtensilsCrossed className="h-4 w-4" /> View Menu & AI Waiter
                          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </Button>
                      </div>
                    </div>
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
