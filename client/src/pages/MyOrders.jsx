import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  ShoppingBag, 
  Clock, 
  MapPin, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle, 
  Truck, 
  UtensilsCrossed, 
  ArrowLeft, 
  Loader2 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import api from '@/lib/api'
import { useAuth } from '@/context/AuthContext'

export default function MyOrders() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/orders/my-orders')
      setOrders(data.orders || [])
    } catch (err) {
      console.error('Failed to fetch orders:', err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-green-100 text-green-700">
            <CheckCircle2 className="h-3.5 w-3.5" /> Delivered
          </span>
        )
      case 'PREPARING':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-orange-100 text-orange-700 animate-pulse">
            <UtensilsCrossed className="h-3.5 w-3.5" /> Preparing
          </span>
        )
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-blue-100 text-blue-700">
            <Truck className="h-3.5 w-3.5" /> Confirmed
          </span>
        )
      case 'PENDING':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-100 text-amber-700">
            <Clock className="h-3.5 w-3.5" /> Pending
          </span>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/40 via-white to-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/restaurants')} 
                className="text-gray-500 hover:text-black -ml-2 h-8 px-2 text-xs font-bold uppercase tracking-wider"
              >
                <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Restaurants
              </Button>
            </div>
            <h1 className="text-3xl sm:text-4xl font-anton text-gray-900 uppercase tracking-wide flex items-center gap-3">
              <ShoppingBag className="h-8 w-8 text-[#ff751f]" />
              My Orders & History
            </h1>
            <p className="text-sm text-gray-600 mt-1 font-medium">
              Track current dining delivery orders and past culinary favorites.
            </p>
          </div>

          <Link to="/restaurants">
            <Button className="bg-[#ff751f] hover:bg-orange-600 text-white font-extrabold rounded-full px-5 text-xs uppercase tracking-wider shadow-md">
              Order Again
            </Button>
          </Link>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="h-10 w-10 animate-spin text-[#ff751f] mb-3" />
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <Card className="border border-dashed border-gray-200 shadow-sm rounded-3xl p-12 text-center bg-white">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mx-auto mb-4 text-[#ff751f]">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No orders placed yet</h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
              Browse our partner restaurants and use the AI Waiter or dining menu to place your first delicious meal.
            </p>
            <Link to="/restaurants">
              <Button className="bg-black hover:bg-gray-800 text-white font-extrabold rounded-full px-8 uppercase text-xs tracking-wider">
                Explore Restaurants
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <Card 
                key={order.id} 
                className="overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow rounded-2xl bg-white"
              >
                <div className="p-5 sm:p-6">
                  {/* Top Row: Restaurant info & Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      {order.restaurant?.image ? (
                        <img 
                          src={order.restaurant.image} 
                          alt={order.restaurant.name} 
                          className="w-12 h-12 rounded-xl object-cover border border-gray-100 shadow-xs" 
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 font-black">
                          <UtensilsCrossed className="h-6 w-6" />
                        </div>
                      )}
                      <div>
                        <Link 
                          to={`/restaurant/${order.restaurant?.id}`}
                          className="font-black text-gray-900 text-lg hover:text-[#ff751f] transition-colors"
                        >
                          {order.restaurant?.name || 'Partner Restaurant'}
                        </Link>
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                          <Clock className="h-3 w-3" />
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center">
                      {getStatusBadge(order.status)}
                    </div>
                  </div>

                  {/* Middle Row: Items list */}
                  <div className="py-4 space-y-2">
                    <p className="text-xs font-black uppercase tracking-wider text-gray-400">Order Items</p>
                    <div className="space-y-1.5">
                      {order.orderItems?.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                          <span className="text-gray-700 font-medium">
                            <span className="font-bold text-black">{item.quantity}×</span> {item.menuItem?.name || 'Special Dish'}
                          </span>
                          <span className="font-bold text-gray-900">
                            ${(Number(item.price) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Row: Address & Total */}
                  <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-gray-600">
                    {order.deliveryAddress && (
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <MapPin className="h-3.5 w-3.5 text-[#ff751f] shrink-0" />
                        <span className="truncate max-w-xs">{order.deliveryAddress}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                      <span className="text-gray-500 uppercase font-bold text-[11px] tracking-wider">Total Paid:</span>
                      <span className="text-lg font-black text-gray-900 font-anton text-[#ff751f]">
                        ${Number(order.totalAmount).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
