import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Building2, 
  Plus, 
  Edit, 
  Trash2, 
  Loader2, 
  ArrowLeft, 
  UtensilsCrossed, 
  Clock, 
  Check, 
  X,
  Layers,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  Truck,
  CheckCircle2
} from 'lucide-react'
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
  const [activeTab, setActiveTab] = useState('restaurants') // 'restaurants' | 'menu' | 'orders'
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)
  const [restaurantOrders, setRestaurantOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)

  // Forms
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingRestaurantId, setEditingRestaurantId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    address: '',
    phone: '',
    email: '',
    cuisineType: '',
    openingTime: '09:00 AM',
    closingTime: '10:00 PM',
    isOpen: true
  })

  // Category Form
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [categoryData, setCategoryData] = useState({ name: '', description: '' })

  // Menu Item Form
  const [showItemForm, setShowItemForm] = useState(false)
  const [itemData, setItemData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    categoryId: '',
    isVegetarian: false,
    isSpicy: false
  })

  useEffect(() => {
    fetchRestaurants()
  }, [])

  const fetchRestaurants = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/restaurants')
      const userRestaurants = (data.restaurants || []).filter(
        (r) => user?.role === 'ADMIN' || r.ownerId === user?.id
      )
      setRestaurants(userRestaurants)
      if (userRestaurants.length > 0 && !selectedRestaurant) {
        setSelectedRestaurant(userRestaurants[0])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectRestaurant = (r) => {
    setSelectedRestaurant(r)
    if (activeTab === 'orders') {
      fetchIncomingOrders(r.id)
    }
  }

  const fetchIncomingOrders = async (restId) => {
    try {
      setOrdersLoading(true)
      const { data } = await api.get(`/orders/restaurant/${restId}`)
      setRestaurantOrders(data.orders || [])
    } catch (err) {
      console.error('Failed to load restaurant orders:', err)
      setRestaurantOrders([])
    } finally {
      setOrdersLoading(false)
    }
  }

  // Create / Update Restaurant
  const handleSubmitRestaurant = async (e) => {
    e.preventDefault()
    try {
      if (editingRestaurantId) {
        await api.put(`/restaurants/${editingRestaurantId}`, formData)
      } else {
        await api.post('/restaurants', formData)
      }
      setShowCreateForm(false)
      setEditingRestaurantId(null)
      setFormData({
        name: '',
        description: '',
        image: '',
        address: '',
        phone: '',
        email: '',
        cuisineType: '',
        openingTime: '09:00 AM',
        closingTime: '10:00 PM',
        isOpen: true
      })
      fetchRestaurants()
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.message || 'Failed to save restaurant')
    }
  }

  const startEdit = (rest) => {
    setEditingRestaurantId(rest.id)
    setFormData({
      name: rest.name || '',
      description: rest.description || '',
      image: rest.image || '',
      address: rest.address || '',
      phone: rest.phone || '',
      email: rest.email || '',
      cuisineType: rest.cuisineType || '',
      openingTime: rest.openingTime || '09:00 AM',
      closingTime: rest.closingTime || '10:00 PM',
      isOpen: rest.isOpen ?? true
    })
    setShowCreateForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this restaurant? This cannot be undone.')) return
    try {
      await api.delete(`/restaurants/${id}`)
      if (selectedRestaurant?.id === id) {
        setSelectedRestaurant(null)
      }
      fetchRestaurants()
    } catch (err) {
      console.error(err)
      alert('Failed to delete restaurant')
    }
  }

  // Add Category
  const handleCreateCategory = async (e) => {
    e.preventDefault()
    if (!selectedRestaurant) return
    try {
      await api.post(`/restaurants/${selectedRestaurant.id}/categories`, {
        ...categoryData,
        restaurantId: selectedRestaurant.id
      })
      setCategoryData({ name: '', description: '' })
      setShowCategoryForm(false)
      // Refresh current restaurant
      const { data } = await api.get(`/restaurants/${selectedRestaurant.id}`)
      setSelectedRestaurant(data.restaurant)
    } catch (err) {
      console.error(err)
      alert('Failed to add category')
    }
  }

  // Add Menu Item
  const handleCreateMenuItem = async (e) => {
    e.preventDefault()
    if (!selectedRestaurant) return
    try {
      await api.post(`/restaurants/${selectedRestaurant.id}/menu-items`, {
        ...itemData,
        restaurantId: selectedRestaurant.id
      })
      setItemData({
        name: '',
        description: '',
        price: '',
        image: '',
        categoryId: '',
        isVegetarian: false,
        isSpicy: false
      })
      setShowItemForm(false)
      const { data } = await api.get(`/restaurants/${selectedRestaurant.id}`)
      setSelectedRestaurant(data.restaurant)
    } catch (err) {
      console.error(err)
      alert('Failed to add menu item')
    }
  }

  // Update order status
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus })
      if (selectedRestaurant) {
        fetchIncomingOrders(selectedRestaurant.id)
      }
    } catch (err) {
      console.error(err)
      alert('Failed to update status')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#ff751f]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/40 via-white to-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* HEADER BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/restaurants')}
              className="text-gray-500 hover:text-black -ml-2 text-xs font-bold uppercase tracking-wider"
            >
              <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Dining Catalog
            </Button>
            <div>
              <h1 className="text-3xl sm:text-4xl font-anton text-gray-900 uppercase tracking-wide flex items-center gap-2">
                <Building2 className="h-8 w-8 text-[#ff751f]" />
                Restaurant Manager
              </h1>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                Partner Dining, Menu Catalog & Live Kitchen Orders
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => {
                setEditingRestaurantId(null)
                setFormData({
                  name: '',
                  description: '',
                  image: '',
                  address: '',
                  phone: '',
                  email: '',
                  cuisineType: '',
                  openingTime: '09:00 AM',
                  closingTime: '10:00 PM',
                  isOpen: true
                })
                setShowCreateForm(!showCreateForm)
              }}
              className="bg-black hover:bg-gray-800 text-white rounded-full px-5 text-xs font-bold uppercase tracking-wide"
            >
              <Plus className="h-4 w-4 mr-1 text-[#ff751f]" />
              {showCreateForm ? 'Cancel' : 'Register Restaurant'}
            </Button>
          </div>
        </div>

        {/* TAB NAVIGATION */}
        <div className="flex gap-2 border-b border-gray-200 mb-6 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('restaurants')}
            className={`px-4 py-2 font-black text-xs uppercase tracking-wider rounded-xl transition-all ${
              activeTab === 'restaurants'
                ? 'bg-[#ff751f] text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            My Restaurants ({restaurants.length})
          </button>
          {selectedRestaurant && (
            <>
              <button
                onClick={() => {
                  setActiveTab('menu')
                }}
                className={`px-4 py-2 font-black text-xs uppercase tracking-wider rounded-xl transition-all ${
                  activeTab === 'menu'
                    ? 'bg-[#ff751f] text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Menu & Categories ({selectedRestaurant.name})
              </button>
              <button
                onClick={() => {
                  setActiveTab('orders')
                  fetchIncomingOrders(selectedRestaurant.id)
                }}
                className={`px-4 py-2 font-black text-xs uppercase tracking-wider rounded-xl transition-all ${
                  activeTab === 'orders'
                    ? 'bg-[#ff751f] text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Incoming Orders ({selectedRestaurant.name})
              </button>
            </>
          )}
        </div>

        {/* CREATE / EDIT RESTAURANT MODAL FORM */}
        {showCreateForm && (
          <Card className="mb-8 border-orange-200 shadow-xl rounded-3xl overflow-hidden bg-white">
            <CardHeader className="bg-orange-50/70 border-b border-orange-100">
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center justify-between">
                <span>{editingRestaurantId ? 'Edit Restaurant Details' : 'Register New Partner Restaurant'}</span>
                <button onClick={() => setShowCreateForm(false)} className="text-gray-400 hover:text-black">
                  <X className="h-5 w-5" />
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmitRestaurant} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase">Restaurant Name *</label>
                  <Input
                    className="mt-1"
                    placeholder="e.g. Bella Italia Bistro"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase">Cuisine Type</label>
                  <Input
                    className="mt-1"
                    placeholder="e.g. Italian, Pasta, Pizza"
                    value={formData.cuisineType}
                    onChange={(e) => setFormData({ ...formData, cuisineType: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase">Image URL (Banner/Cover)</label>
                  <Input
                    className="mt-1"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase">Physical Address</label>
                  <Input
                    className="mt-1"
                    placeholder="123 Culinary Ave, City"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase">Contact Phone</label>
                  <Input
                    className="mt-1"
                    placeholder="+1 555-0192"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase">Official Email</label>
                  <Input
                    className="mt-1"
                    placeholder="contact@restaurant.com"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase">Opening Time</label>
                  <Input
                    className="mt-1"
                    placeholder="09:00 AM"
                    value={formData.openingTime}
                    onChange={(e) => setFormData({ ...formData, openingTime: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase">Closing Time</label>
                  <Input
                    className="mt-1"
                    placeholder="10:00 PM"
                    value={formData.closingTime}
                    onChange={(e) => setFormData({ ...formData, closingTime: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-gray-700 uppercase">About / Description</label>
                  <textarea
                    placeholder="Share story, signature flavors, and dining atmosphere..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full mt-1 p-3 border rounded-xl resize-none text-sm min-h-[90px]"
                  />
                </div>
                <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-[#ff751f] hover:bg-orange-600 text-white font-bold">
                    {editingRestaurantId ? 'Save Changes' : 'Register Restaurant'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* TAB 1: RESTAURANTS LIST */}
        {activeTab === 'restaurants' && (
          <div>
            {restaurants.length === 0 ? (
              <Card className="text-center py-20 border border-dashed border-gray-200 rounded-3xl bg-white p-8">
                <Building2 className="h-16 w-16 mx-auto text-gray-300 mb-3" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">No registered restaurants yet</h3>
                <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
                  Click 'Register Restaurant' above to launch your partner restaurant on RecipeRec dining.
                </p>
                <Button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-black hover:bg-gray-800 text-white rounded-full font-bold text-xs uppercase"
                >
                  <Plus className="h-4 w-4 mr-1 text-[#ff751f]" /> Add First Restaurant
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {restaurants.map((rest) => (
                  <Card
                    key={rest.id}
                    className={`overflow-hidden border transition-all rounded-3xl bg-white ${
                      selectedRestaurant?.id === rest.id
                        ? 'border-[#ff751f] shadow-md ring-2 ring-orange-100'
                        : 'border-gray-200 shadow-xs hover:border-gray-300'
                    }`}
                  >
                    <div className="h-40 bg-gray-100 relative overflow-hidden">
                      {rest.image ? (
                        <img src={rest.image} alt={rest.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-tr from-orange-100 to-amber-100 flex items-center justify-center text-orange-400">
                          <Building2 className="h-12 w-12" />
                        </div>
                      )}
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase text-gray-800">
                        {rest.cuisineType || 'Dining'}
                      </div>
                    </div>

                    <CardContent className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg text-gray-900 truncate">{rest.name}</h3>
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                            rest.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {rest.isOpen ? 'Open' : 'Closed'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-4">{rest.description || 'No description'}</p>

                      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            handleSelectRestaurant(rest)
                            setActiveTab('menu')
                          }}
                          className="text-xs font-bold rounded-xl"
                        >
                          <UtensilsCrossed className="h-3.5 w-3.5 mr-1 text-[#ff751f]" /> Manage Menu
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            handleSelectRestaurant(rest)
                            setActiveTab('orders')
                            fetchIncomingOrders(rest.id)
                          }}
                          className="text-xs font-bold rounded-xl"
                        >
                          <ShoppingBag className="h-3.5 w-3.5 mr-1 text-blue-600" /> View Orders
                        </Button>
                      </div>

                      <div className="flex gap-2 mt-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => startEdit(rest)}
                          className="flex-1 text-xs text-gray-600 hover:text-black"
                        >
                          <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(rest.id)}
                          className="flex-1 text-xs text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MENU & CATEGORIES */}
        {activeTab === 'menu' && selectedRestaurant && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedRestaurant.name} — Menu Catalog</h2>
                <p className="text-xs text-gray-500">Configure dishes, pricing, dietary tags and menu sections</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowCategoryForm(!showCategoryForm)}
                  className="rounded-full text-xs font-bold"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add Category
                </Button>
                <Button
                  size="sm"
                  onClick={() => setShowItemForm(!showItemForm)}
                  className="bg-[#ff751f] hover:bg-orange-600 text-white rounded-full text-xs font-bold"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add Dish / Item
                </Button>
              </div>
            </div>

            {/* CATEGORY FORM MODAL */}
            {showCategoryForm && (
              <Card className="border-orange-200 rounded-2xl p-5 bg-orange-50/40">
                <h3 className="font-bold text-sm text-gray-800 mb-3">Create Menu Category</h3>
                <form onSubmit={handleCreateCategory} className="flex flex-col sm:flex-row gap-3">
                  <Input
                    placeholder="Category Name (e.g. Starters, Main Course)"
                    value={categoryData.name}
                    onChange={(e) => setCategoryData({ ...categoryData, name: e.target.value })}
                    required
                    className="flex-1 bg-white"
                  />
                  <Input
                    placeholder="Short description (optional)"
                    value={categoryData.description}
                    onChange={(e) => setCategoryData({ ...categoryData, description: e.target.value })}
                    className="flex-1 bg-white"
                  />
                  <div className="flex gap-2">
                    <Button type="submit" size="sm" className="bg-black text-white font-bold">
                      Save
                    </Button>
                    <Button type="button" size="sm" variant="ghost" onClick={() => setShowCategoryForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {/* ITEM FORM MODAL */}
            {showItemForm && (
              <Card className="border-orange-200 rounded-2xl p-5 bg-white shadow-md">
                <h3 className="font-bold text-sm text-gray-800 mb-4">Add Dish to Restaurant Menu</h3>
                <form onSubmit={handleCreateMenuItem} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 uppercase">Dish Name *</label>
                    <Input
                      placeholder="e.g. Truffle Margherita Pizza"
                      value={itemData.name}
                      onChange={(e) => setItemData({ ...itemData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 uppercase">Price ($) *</label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="14.99"
                      value={itemData.price}
                      onChange={(e) => setItemData({ ...itemData, price: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 uppercase">Category</label>
                    <select
                      value={itemData.categoryId}
                      onChange={(e) => setItemData({ ...itemData, categoryId: e.target.value })}
                      className="w-full h-10 border rounded-md px-3 text-sm"
                    >
                      <option value="">Select a category</option>
                      {selectedRestaurant.menuCategories?.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 uppercase">Dish Image URL</label>
                    <Input
                      placeholder="https://..."
                      value={itemData.image}
                      onChange={(e) => setItemData({ ...itemData, image: e.target.value })}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-gray-700 uppercase">Description</label>
                    <Input
                      placeholder="Ingredients, preparation and flavor profile..."
                      value={itemData.description}
                      onChange={(e) => setItemData({ ...itemData, description: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={itemData.isVegetarian}
                        onChange={(e) => setItemData({ ...itemData, isVegetarian: e.target.checked })}
                      />
                      Vegetarian
                    </label>
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={itemData.isSpicy}
                        onChange={(e) => setItemData({ ...itemData, isSpicy: e.target.checked })}
                      />
                      Spicy
                    </label>
                  </div>
                  <div className="sm:col-span-2 flex justify-end gap-2">
                    <Button type="button" variant="ghost" onClick={() => setShowItemForm(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-[#ff751f] hover:bg-orange-600 text-white font-bold">
                      Add Dish to Menu
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {/* DISPLAY CURRENT MENU CATEGORIES & ITEMS */}
            <div className="space-y-6">
              {selectedRestaurant.menuCategories?.length === 0 ? (
                <Card className="text-center py-12 border-dashed border-gray-200 rounded-3xl p-6 bg-white">
                  <p className="text-gray-500 text-sm">No menu categories yet. Create your first category above!</p>
                </Card>
              ) : (
                selectedRestaurant.menuCategories?.map((cat) => (
                  <Card key={cat.id} className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-xs">
                    <div className="bg-gray-50/80 px-5 py-3 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="font-black text-gray-800 text-base uppercase tracking-wide">{cat.name}</h3>
                      <span className="text-xs text-gray-400 font-semibold">{cat.menuItems?.length || 0} items</span>
                    </div>
                    <CardContent className="p-5">
                      {cat.menuItems?.length === 0 ? (
                        <p className="text-xs text-gray-400 italic">No items in this category yet.</p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {cat.menuItems?.map((dish) => (
                            <div key={dish.id} className="border border-gray-100 rounded-xl p-3 flex gap-3 items-center">
                              {dish.image && (
                                <img src={dish.image} alt={dish.name} className="w-12 h-12 rounded-lg object-cover" />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-gray-900 text-sm truncate">{dish.name}</p>
                                <p className="text-xs font-black text-[#ff751f]">${Number(dish.price).toFixed(2)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 3: INCOMING ORDERS & STATUS */}
        {activeTab === 'orders' && selectedRestaurant && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedRestaurant.name} — Incoming Kitchen Orders</h2>
                <p className="text-xs text-gray-500">Live order queue and dining fulfillment status</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => fetchIncomingOrders(selectedRestaurant.id)}
                className="text-xs font-bold"
              >
                Refresh
              </Button>
            </div>

            {ordersLoading ? (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-[#ff751f] mx-auto mb-2" />
                <p className="text-xs text-gray-400">Loading incoming orders...</p>
              </div>
            ) : restaurantOrders.length === 0 ? (
              <Card className="text-center py-16 border-dashed border-gray-200 rounded-3xl bg-white p-6">
                <ShoppingBag className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                <h3 className="font-bold text-gray-700">No active orders right now</h3>
                <p className="text-xs text-gray-400">Orders placed by diners will appear here instantly.</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {restaurantOrders.map((order) => (
                  <Card key={order.id} className="border border-gray-100 rounded-2xl p-5 bg-white shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-gray-900">Order #{order.id.slice(-6)}</span>
                          <span className="text-xs text-gray-400">
                            by {order.user?.username || order.user?.email || 'Guest Diner'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {order.deliveryAddress || 'Dine-in / Standard Delivery'}
                        </p>
                      </div>

                      {/* Status Selector */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black uppercase text-gray-400">Status:</span>
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                          className="h-8 px-2 border rounded-lg text-xs font-bold uppercase tracking-wider bg-orange-50 text-orange-700 border-orange-200 focus:outline-none"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="PREPARING">PREPARING</option>
                          <option value="DELIVERED">DELIVERED</option>
                        </select>
                      </div>
                    </div>

                    <div className="py-3 space-y-1">
                      {order.orderItems?.map((it, idx) => (
                        <div key={idx} className="flex justify-between text-xs text-gray-700">
                          <span>
                            {it.quantity}× {it.menuItem?.name || 'Dish'}
                          </span>
                          <span className="font-bold">${(Number(it.price) * it.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex justify-between items-center text-xs">
                      <span className="text-gray-400">
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="font-black text-sm text-gray-900">
                        Total: ${Number(order.totalAmount).toFixed(2)}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
