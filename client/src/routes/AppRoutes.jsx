import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Marketplace from '../pages/Marketplace'
import ProductDetails from '../pages/ProductDetails'
import Cart from '../pages/Cart'
import Checkout from '../pages/Checkout'
import Profile from '../pages/Profile'
import About from '../pages/About'
import Contact from '../pages/Contact'
import FarmerStore from '../pages/FarmerStore'
import Dashboard from '../pages/dashboard/Dashboard'
import Products from '../pages/dashboard/Products'
import AddProduct from '../pages/dashboard/AddProduct'
import Orders from '../pages/dashboard/Orders'
import Analytics from '../pages/dashboard/Analytics'
import ProtectedRoute from '../components/ProtectedRoute'

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/marketplace' element={<Marketplace />} />
        <Route path='/product/:id' element={<ProductDetails />} />
        <Route path='/store/:id' element={<FarmerStore />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/checkout' element={<Checkout />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route
          path='/dashboard'
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path='/dashboard/products' element={<Products />} />
        <Route path='/dashboard/add-product' element={<AddProduct />} />
        <Route path='/dashboard/orders' element={<Orders />} />
        <Route path='/dashboard/analytics' element={<Analytics />} />
      </Routes>
    </BrowserRouter>
  )
}
