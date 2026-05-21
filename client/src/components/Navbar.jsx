import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className='sticky top-0 z-50 bg-white shadow-sm'>
      <div className='mx-auto flex max-w-7xl items-center justify-between px-6 py-4'>
        <Link to='/' className='flex items-center gap-2 text-xl font-bold text-green-700'>
          <span>🌾</span>
          <span>FarmDirect</span>
        </Link>

        <div className='hidden items-center gap-6 text-sm text-slate-600 md:flex'>
          <Link to='/marketplace' className='hover:text-green-700'>Shop All</Link>
          <Link to='/about' className='hover:text-green-700'>About</Link>
          <Link to='/contact' className='hover:text-green-700'>Contact</Link>
        </div>

        <div className='hidden items-center gap-3 md:flex'>
          <input
            type='search'
            placeholder='Search products...'
            className='w-72 rounded-full border border-slate-200 px-4 py-2 text-sm outline-none focus:border-green-600'
          />
          <Link to='/login' className='text-sm text-slate-600 hover:text-green-700'>Login</Link>
          <Link to='/register' className='rounded-full bg-green-700 px-5 py-2 text-sm text-white hover:bg-green-800'>Become a Seller</Link>
        </div>
      </div>
    </nav>
  )
}
