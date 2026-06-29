import { Link, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './layouts/Layout'
import AuthLayout from './layouts/AuthLayout'
import Home from './pages/Home'
import About from './pages/About'
import Doc from './pages/Doc'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Recipes from './pages/Recipes'
import Favorites from './pages/Favorites'
import Profile from './pages/Profile'
import Search from './pages/Search'
import ProtectedRoute from './components/ProtectedRoute'
import DishDetails from './pages/DishDetails'
import Blogs from './pages/Blogs'
import BlogDetails from './pages/BlogDetails'
import WriteBlog from './pages/WriteBlog'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="doc" element={<Doc />} />
        <Route path="blogs" element={<Blogs />} />
        <Route path="blog/:id" element={<BlogDetails />} />

        <Route element={<ProtectedRoute />}>
          <Route path="recipes" element={<Recipes />} />
          <Route path="recipe/:id" element={<DishDetails />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="profile" element={<Profile />} />
          <Route path="search" element={<Search />} />
          <Route path="blogs/write" element={<WriteBlog />} />
          <Route path="blogs/edit/:id" element={<WriteBlog />} />
        </Route>

        <Route path="auth" element={<AuthLayout />}>
          <Route index element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="register" element={<Navigate to="/auth/signup" replace />} />
        </Route>
      </Route>
    </Routes>
  )
}
