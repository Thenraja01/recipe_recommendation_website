import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Star, Clock, MapPin, Phone, UtensilsCrossed, Plus, Minus, ShoppingCart, Loader2, Leaf, Flame, AlertTriangle, MessageSquare, Send, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import api from '@/lib/api'
import { useAuth } from '@/context/AuthContext'

export default function RestaurantDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [restaurant, setRestaurant] = useState(null)
  const [cart, setCart] = useState({})
  const [loading, setLoading] = useState(true)
  const [waiterQuestion, setWaiterQuestion] = useState('')
  const [waiterResponse, setWaiterResponse] = useState(null)
  const [askingWaiter, setAskingWaiter] = useState(false)

  useEffect(() => {
    fetchRestaurant()
  }, [id])

  const fetchRestaurant = async () => {
    try {
      setLoading(true)
      const { data } = await api.get(`/restaurants/${id}`)
      setRestaurant(data.restaurant)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (itemId) => {
    setCart(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }))
  }

  const removeFromCart = (itemId) => {
    setCart(prev => {
      const newCart = { ...prev }
      if (newCart[itemId] > 1) {
        newCart[itemId] -= 1
      } else {
        delete newCart[itemId]
      }
      return newCart
    })
  }

  const getCartTotal = () => {
    if (!restaurant) return 0
    let total = 0
    Object.entries(cart).forEach(([itemId, qty]) => {
      const item = restaurant.menuCategories?.flatMap(c => c.menuItems || []).find(i => i.id === itemId)
      if (item) total += item.price * qty
    })
    return total
  }

  const getCartItems = () => {
    if (!restaurant) return []
    return Object.entries(cart).map(([itemId, qty]) => {
      const item = restaurant.menuCategories?.flatMap(c => c.menuItems || []).find(i => i.id === itemId)
      return { item, qty }
    }).filter(x => x.item)
  }

  const getAllergenWarning = (item) => {
    if (!user?.preferences?.allergens || user.preferences.allergens.length === 0) return null
    if (!item.allergens || item.allergens.length === 0) return null

    const userAllergensLower = user.preferences.allergens.map(a => a.toLowerCase())
    const matched = item.allergens.filter(ra => 
      userAllergensLower.some(ua => 
        ra.toLowerCase().includes(ua) || ua.includes(ra.toLowerCase())
      )
    )

    return matched.length > 0 ? matched : null
  }

  const handleOrder = () => {
    if (!user) {
      alert('Please login to place an order')
      return
    }
    const items = getCartItems().map(({ item, qty }) => ({
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      quantity: qty
    }))
    navigate('/order', {
      state: {
        orderData: {
          restaurantId: restaurant.id,
          items,
          deliveryAddress: '',
          specialInstructions: ''
        }
      }
    })
  }

  const askWaiter = async () => {
    if (!waiterQuestion.trim()) return
    setAskingWaiter(true)
    try {
      const { data } = await api.post('/orders/ask-waiter', {
        restaurantId: id,
        question: waiterQuestion
      })
      setWaiterResponse(data.response)
      setWaiterQuestion('')
    } catch (err) {
      console.error(err)
      alert('Failed to get waiter response')
    } finally {
      setAskingWaiter(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-orange-600" />
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Restaurant not found</h2>
          <Link to="/restaurants">
            <Button className="bg-orange-600 hover:bg-orange-700">Back to Restaurants</Button>
          </Link>
        </div>
      </div>
    )
  }

  const cartItems = getCartItems()
  const cartTotal = getCartTotal()

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {restaurant.image && (
        <div className="relative h-72 overflow-hidden">
          <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/restaurants">
          <Button variant="ghost" className="mb-6 text-gray-700 hover:text-orange-600">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Restaurants
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-4xl font-black text-gray-800 mb-2">{restaurant.name}</h1>
                  <p className="text-gray-600">{restaurant.cuisineType || 'Various cuisines'}</p>
                </div>
                <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-full">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <span className="text-lg font-bold text-gray-800">{restaurant.rating.toFixed(1)}</span>
                </div>
              </div>

              {restaurant.description && (
                <p className="text-gray-600 mb-6">{restaurant.description}</p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {restaurant.address && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <MapPin className="h-5 w-5 text-orange-600" />
                    <span>{restaurant.address}</span>
                  </div>
                )}
                {restaurant.phone && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <Phone className="h-5 w-5 text-orange-600" />
                    <span>{restaurant.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-gray-600">
                  <Clock className="h-5 w-5 text-orange-600" />
                  <span>{restaurant.openingTime || 'N/A'} - {restaurant.closingTime || 'N/A'}</span>
                </div>
                <div className={`flex items-center gap-3 ${restaurant.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                  <UtensilsCrossed className="h-5 w-5" />
                  <span className="font-semibold">{restaurant.isOpen ? 'Open Now' : 'Closed'}</span>
                </div>
              </div>
            </div>

            {restaurant.menuCategories?.map((category) => (
              <Card key={category.id} className="mb-6 border-none shadow-lg">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-green-50">
                  <CardTitle className="text-2xl">{category.name}</CardTitle>
                  {category.description && (
                    <p className="text-sm text-gray-600">{category.description}</p>
                  )}
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {category.menuItems?.map((item) => {
                      const allergenWarning = getAllergenWarning(item)
                      return (
                        <div key={item.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                          {item.image && (
                            <img src={item.image} alt={item.name} className="w-full h-32 object-cover rounded-lg mb-3" />
                          )}
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-gray-800">{item.name}</h3>
                            <span className="font-bold text-orange-600">${item.price.toFixed(2)}</span>
                          </div>
                          {item.description && (
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                          )}
                          <div className="flex flex-wrap gap-2 mb-3">
                            {item.isVegetarian && (
                              <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                <Leaf className="h-3 w-3" /> Veg
                              </span>
                            )}
                            {item.isVegan && (
                              <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                <Leaf className="h-3 w-3" /> Vegan
                              </span>
                            )}
                            {item.isSpicy && (
                              <span className="flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                                <Flame className="h-3 w-3" /> Spicy
                              </span>
                            )}
                            {item.allergens?.length > 0 && (
                              <span className="flex items-center gap-1 text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                                <AlertTriangle className="h-3 w-3" /> {item.allergens.length} allergens
                              </span>
                            )}
                          </div>
                          {allergenWarning && (
                            <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                              <p className="text-xs text-red-700 font-semibold flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3" /> Contains your allergens: {allergenWarning.join(', ')}
                              </p>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeFromCart(item.id)}
                              disabled={!cart[item.id]}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-semibold">{cart[item.id] || 0}</span>
                            <Button
                              size="sm"
                              onClick={() => addToCart(item.id)}
                              disabled={!item.isAvailable}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* RIGHT SIDEBAR: ORDER CART & AI WAITER */}
          <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-20 self-start max-h-[calc(100vh-6rem)] overflow-y-auto pr-1 scrollbar-thin">
            {/* CART CARD */}
            <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white">
              <CardHeader className="bg-gradient-to-r from-[#ff751f] to-amber-500 text-white p-5">
                <CardTitle className="flex items-center gap-2 text-lg font-bold">
                  <ShoppingCart className="h-5 w-5" /> Your Order
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {cartItems.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p className="font-medium text-sm">Your cart is empty</p>
                    <p className="text-xs text-gray-400 mt-1">Add items from the menu to get started</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-1">
                      {cartItems.map(({ item, qty }) => (
                        <div key={item.id} className="flex justify-between items-center text-sm">
                          <div>
                            <p className="font-bold text-gray-800">{item.name}</p>
                            <p className="text-xs text-gray-500">Qty: {qty} × ${item.price.toFixed(2)}</p>
                          </div>
                          <span className="font-bold text-gray-800">${(item.price * qty).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-gray-100 pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-bold text-gray-800">Total</span>
                        <span className="text-2xl font-black text-[#ff751f]">${cartTotal.toFixed(2)}</span>
                      </div>
                      <Button onClick={handleOrder} className="w-full bg-[#ff751f] hover:bg-orange-600 text-white font-bold rounded-2xl h-12 text-sm uppercase tracking-wider shadow-md">
                        Place Order
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* AI WAITER CARD */}
            <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-5">
                <CardTitle className="flex items-center gap-2 text-lg font-bold">
                  <Sparkles className="h-5 w-5" /> AI Dining Waiter
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-xs text-gray-500 mb-4 font-medium">
                  Ask our AI waiter for dish recommendations, dietary advice, or menu questions!
                </p>
                {waiterResponse && (
                  <div className="mb-4 p-3.5 bg-purple-50 rounded-2xl border border-purple-100">
                    <p className="text-xs sm:text-sm text-purple-900 leading-relaxed">
                      {waiterResponse.recipe?.recommendation || waiterResponse.recipe?.title || 'Here are some suggestions!'}
                    </p>
                    {waiterResponse.recipe?.dishes && (
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {waiterResponse.recipe.dishes.map((dish, idx) => (
                          <span key={idx} className="text-[11px] font-bold bg-purple-100 text-purple-700 px-2.5 py-0.5 rounded-full">
                            {dish}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                <div className="flex gap-2">
                  <Input
                    value={waiterQuestion}
                    onChange={(e) => setWaiterQuestion(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && askWaiter()}
                    placeholder="e.g. What's the chef's best pasta?"
                    className="flex-1 h-10 rounded-xl text-xs"
                    disabled={askingWaiter}
                  />
                  <Button
                    onClick={askWaiter}
                    disabled={askingWaiter || !waiterQuestion.trim()}
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 h-10 px-3.5 rounded-xl text-white shadow-sm"
                  >
                    {askingWaiter ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
