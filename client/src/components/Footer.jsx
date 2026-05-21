import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className='bg-slate-950 text-slate-200'>
      <div className='mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4'>
        <div className='space-y-4'>
          <div className='flex items-center gap-2 text-2xl font-bold text-white'>🌾 FarmDirect</div>
          <p className='text-sm text-slate-400'>Connecting farmers and buyers with fresh produce and fair prices.</p>
          <p className='text-sm text-slate-400'>Small 3-5% platform fee per order.</p>
        </div>

        <div>
          <h3 className='mb-4 text-lg font-semibold text-white'>Quick Links</h3>
          <ul className='space-y-3 text-sm text-slate-400'>
            <li><Link to='/marketplace' className='hover:text-white'>Shop All</Link></li>
            <li><Link to='/about' className='hover:text-white'>About Us</Link></li>
            <li><Link to='/register' className='hover:text-white'>Become a Seller</Link></li>
            <li><Link to='/marketplace' className='hover:text-white'>Featured Stores</Link></li>
          </ul>
        </div>

        <div>
          <h3 className='mb-4 text-lg font-semibold text-white'>Support</h3>
          <ul className='space-y-3 text-sm text-slate-400'>
            <li><Link to='/contact' className='hover:text-white'>Contact Us</Link></li>
            <li className='hover:text-white'>FAQ</li>
            <li className='hover:text-white'>Shipping Info</li>
            <li className='hover:text-white'>Returns</li>
          </ul>
        </div>

        <div>
          <h3 className='mb-4 text-lg font-semibold text-white'>Contact Info</h3>
          <p className='text-sm text-slate-400'><strong>Email:</strong> support@farmdirect.com</p>
          <p className='text-sm text-slate-400'><strong>Phone:</strong> +63 917 123 4567</p>
          <p className='text-sm text-slate-400'>Mon-Sat: 8AM - 6PM</p>
        </div>
      </div>
      <div className='border-t border-slate-800 py-4 text-center text-sm text-slate-500'>
        © 2026 FarmDirect. All rights reserved.
      </div>
    </footer>
  )
}
