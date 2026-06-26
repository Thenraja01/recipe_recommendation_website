import Login from './pages/Login'
import Register from './pages/Register'
import AuthLayout from './layouts/AuthLayout'
import { Route, Routes } from 'react-router-dom'
import Layout from './layouts/Layout'
import Home from './pages/Home'
import Recipes from './pages/Recipes'
import Favorites from './pages/Favorites'
import Profile from './pages/Profile'
import ProtectedRoute from './components/ProtectedRoute'
import DishDetails from './pages/DishDetails'
import Blogs from './pages/Blogs'
import BlogDetails from './pages/BlogDetails'
import WriteBlog from './pages/WriteBlog'

export default function App() {
  return (
  <Routes>
    <Route path='/' element={<Layout/>}>

        {/* Private Routes */}
        <Route element={<ProtectedRoute />}>
            <Route index element={<Home/>}/>
            <Route path='recipes' element={<Recipes/>}/>
            <Route path='recipe/:id' element={<DishDetails/>}/>
            <Route path='favorites' element={<Favorites/>}/>
            <Route path='profile' element={<Profile/>}/>
            <Route path='blogs' element={<Blogs/>}/>
            <Route path='blog/:id' element={<BlogDetails/>}/>
            <Route path='blogs/write' element={<WriteBlog/>}/>
            <Route path='blogs/edit/:id' element={<WriteBlog/>}/>
        </Route>


        {/* Auth Routes */}
        <Route path='auth' element={<AuthLayout/>}>
            <Route index element={<Login/>}/>
            <Route path='register' element={<Register/>}/>
        </Route>

    </Route>
  </Routes>
  )
}



