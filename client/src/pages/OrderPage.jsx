import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, MapPin, CreditCard, Loader2, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import api from '@/lib/api'
import { useAuth } from '@/context/AuthContext'

export default function OrderPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const [orderData, setOrderData] = useState({
    restaurantId: '',
    items: [],
    deliveryAddress: '',
    specialInstructions: ''
  })
  const [orderSuccess, setOrderSuccess] = useState(false)

  useEffect(() => {
    if (location.state?.orderData) {
      setOrderData(location.state.orderData)
    } else {
      navigate('/restaurants')
    }
  }, [location, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      alert('Please login to place an order')
      navigate('/auth')
      return
    }

    setLoading(true)
    try {
      const { data } = await api.post('/orders', orderData)
      setOrderSuccess(true)
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.message || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50 flex items-center justify-center px-4">
        <Card className="max-w-md w-full text-center p-8">
          <CheckCircle className="h-20 w-20 mx-auto text-green-600 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h2>
          <p className="text-gray-600 mb-6">Your order has been received and is being prepared.</p>
          <Button onClick={() => navigate('/orders/my-orders')} className="bg-green-600 hover:bg-green-700">
            View My Orders
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 text-gray-700 hover:text-orange-600">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <Card className="border-none shadow-xl">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-green-500 text-white rounded-t-3xl">
            <CardTitle className="text-2xl">Complete Your Order</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="address">Delivery Address *</Label>
                <div className="relative mt-2">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="address"
                    value={orderData.deliveryAddress}
                    onChange={(e) => setOrderData({ ...orderData, deliveryAddress: e.target.value })}
                    placeholder="Enter your delivery address"
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="instructions">Special Instructions (Optional)</Label>
                <textarea
                  id="instructions"
                  value={orderData.specialInstructions}
                  onChange={(e) => setOrderData({ ...orderData, specialInstructions: e.target.value })}
                  placeholder="Any special requests or dietary requirements?"
                  className="w-full mt-2 p-3 border rounded-xl resize-none min-h-[100px]"
                />
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-bold text-gray-800 mb-3">Order Summary</h3>
                <div className="space-y-2">
                  {orderData.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.name} × {item.quantity}</span>
                      <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t mt-3 pt-3 flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-orange-600">
                    ${orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-gray-800">Payment</span>
                </div>
                <p className="text-sm text-gray-600">Payment will be collected upon delivery. Cash and card accepted.</p>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-orange-600 hover:bg-orange-700 text-lg font-semibold"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...
                  </>
                ) : (
                  'Place Order'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
