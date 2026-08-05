import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, Plus, Edit, Trash2, Loader2, ArrowLeft, UtensilsCrossed, Clock, DollarSign, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import api from '@/lib/api'
import { useAuth } from '@/context/AuthContext'

export default function RestaurantAdmin() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    address: '',
    phone: '',
    email: '',
    cuisineType: '',
    openingTime: '',
    closingTime: ''
  })

  useEffect(() => {
    fetchRestaurants()
  }, [])

  const fetchRestaurants = async () => {
    try {
      const { data } = await api.get('/restaurants')
      setRestaurants(data.restaurants.filter(r => r.ownerId === user?.id))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/restaurants', formData)
      setShowCreateForm(false)
      setFormData({
        name: '',
        description: '',
        image: '',
        address: '',
        phone: '',
        email: '',
        cuisineType: '',
        openingTime: '',
        closingTime: ''
      })
      fetchRestaurants()
    } catch (err) {
      console.error(err)
      alert(' failed to create restaurant')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this restaurant?')) return
    try {
      await api.delete(`/restaurants/${id}`)
      fetchRestaurants()
    } catch (err) {
      console.error(err)
      alert('Failed to delete restaurant')
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
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/')} className="text-gray-600 hover:text-orange-600">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 p-3 rounded-2xl">
                <Building2 className="h-8 w-8 text-orange-600" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-gray-800 uppercase italic">Restaurant Admin</h1>
                <p className="text-gray-500">Manage your restaurants and menus</p>
              </div>
            </div>
          </div>
          <Button onClick={() => setShowCreateForm(!showCreateForm)} className="bg-orange-600 hover:bg-orange-700">
            <Plus className="mr-2 h-4 w-4" /> {showCreateForm ? 'Cancel' : 'Add Restaurant'}
          </Button>
        </div>

        {showCreateForm && (
          <Card className="mb-8 border-orange-200 shadow-lg">
            <CardHeader className="bg-orange-50">
              <CardTitle>Create New Restaurant</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Restaurant Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <Input
                  placeholder="Cuisine Type"
                  value={formData.cuisineType}
                  onChange={(e) => setFormData({ ...formData, cuisineType: e.target.value })}
                />
                <Input
                  placeholder="Image URL"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                />
                <Input
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                <Input
                  placeholder="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <Input
                  placeholder="Address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
                <Input
                  placeholder="Opening Time (e.g., 9:00 AM)"
                  value={formData.openingTime}
                  onChange={(e) => setFormData({ ...formData, openingTime: e.target.value })}
                />
                <Input
                  placeholder="Closing Time (e.g., 10:00 PM)"
                  value={formData.closingTime}
                  onChange={(e) => setFormData({ ...formData, closingTime: e.target.value })}
                />
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="md:col-span-2 min-h-[100px] p-3 border rounded-xl resize-none"
                />
                <Button type="submit" className="md:col-span-2 bg-orange-600 hover:bg-orange-700">
                  Create Restaurant
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {restaurants.length === 0 ? (
          <Card className="text-center py-16">
            <Building2 className="h-20 w-20 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">No restaurants yet</h3>
            <p className="text-gray-500">Create your first restaurant to get started</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <Card key={restaurant.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                {restaurant.image && (
                  <img src={restaurant.image} alt={restaurant.name} className="w-full h-48 object-cover" />
                )}
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl">{restaurant.name}</CardTitle>
                  <p className="text-sm text-gray-500">{restaurant.cuisineType || 'Various cuisines'}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{restaurant.openingTime || 'N/A'} - {restaurant.closingTime || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className={`h-4 w-4 ${restaurant.isOpen ? 'text-green-600' : 'text-red-600'}`} />
                    <span>{restaurant.isOpen ? 'Open' : 'Closed'}</span>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => navigate(`/restaurant/${restaurant.id}/menu`)}
                      className="flex-1 bg-orange-600 hover:bg-orange-700"
                      size="sm"
                    >
                      <UtensilsCrossed className="h-4 w-4 mr-1" /> Menu
                    </Button>
                    <Button
                      onClick={() => navigate(`/restaurant/${restaurant.id}/orders`)}
                      variant="outline"
                      className="flex-1"
                      size="sm"
                    >
                      Orders
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(restaurant.id)}
                      className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
