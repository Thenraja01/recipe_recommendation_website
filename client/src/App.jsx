import { Route, Routes } from 'react-router-dom'
import Layout from './layouts/Layout'
import AuthLayout from './layouts/AuthLayout'
import Home from './pages/Home'
import About from './pages/About'
import Doc from './pages/Doc'
import Contact from './pages/Contact'
import Privacy from './pages/Privacy'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Favorites from './pages/Favorites'
import Profile from './pages/Profile'
import Search from './pages/Search'
import ProtectedRoute from './components/ProtectedRoute'
import Blogs from './pages/Blogs'
import BlogDetails from './pages/BlogDetails'
import WriteBlog from './pages/WriteBlog'
import EditProfile from './pages/EditProfile'
import RestaurantAdmin from './pages/RestaurantAdmin'
import Restaurants from './pages/Restaurants'
import RestaurantDetail from './pages/RestaurantDetail'
import OrderPage from './pages/OrderPage'
import MyOrders from './pages/MyOrders'
import ErrorBoundary from './components/ErrorBoundary'

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="doc" element={<Doc />} />
          <Route path="contact" element={<Contact />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="blogs" element={<Blogs />} />
          <Route path="blog/:id" element={<BlogDetails />} />
          <Route path="restaurants" element={<Restaurants />} />
          <Route path="restaurant/:id" element={<RestaurantDetail />} />

          <Route element={<ProtectedRoute />}>
            <Route path="favorites" element={<Favorites />} />
            <Route path="profile" element={<Profile />} />
            <Route path="profile/edit" element={<EditProfile />} />
            <Route path="order" element={<OrderPage />} />
            <Route path="orders" element={<MyOrders />} />
            <Route path="orders/my-orders" element={<MyOrders />} />
            <Route path="restaurant-admin" element={<RestaurantAdmin />} />
            <Route path="search" element={<Search />} />
            <Route path="blogs/write" element={<WriteBlog />} />
            <Route path="blogs/edit/:id" element={<WriteBlog />} />
          </Route>

          <Route path="auth" element={<AuthLayout />}>
            <Route index element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="register" element={<Signup />} />
          </Route>
        </Route>
      </Routes>
    </ErrorBoundary>
  )
}
