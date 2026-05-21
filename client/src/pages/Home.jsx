import { Link } from 'react-router-dom'
import CategoryCard from '../components/CategoryCard'
import ProductCard from '../components/ProductCard'

const categories = [
  { emoji: '🥦', title: 'Vegetables', items: 45 },
  { emoji: '🍎', title: 'Fruits', items: 32 },
  { emoji: '🌾', title: 'Grains & Rice', items: 18 },
  { emoji: '🌿', title: 'Herbs & Spices', items: 24 },
  { emoji: '🥔', title: 'Root Crops', items: 15 },
  { emoji: '🥚', title: 'Dairy & Eggs', items: 12 },
]

const featuredProducts = [
  { title: 'Organic Tomatoes', description: 'Farm fresh and locally grown.', price: '120.00', image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=800&q=80' },
  { title: 'Native Brown Rice', description: 'High-fiber harvest direct from the farm.', price: '220.00', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80' },
  { title: 'Free-range Eggs', description: 'Healthy, fresh eggs from local farms.', price: '180.00', image: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?auto=format&fit=crop&w=800&q=80' },
]

export default function Home() {
  return (
    <div className='space-y-24 pb-24'>
      <section className='relative overflow-hidden bg-gradient-to-r from-emerald-600 via-emerald-700 to-slate-900 text-white'>
        <div className='mx-auto flex max-w-7xl flex-col gap-10 px-6 py-20 lg:flex-row lg:items-center lg:justify-between'>
          <div className='max-w-2xl space-y-6'>
            <span className='inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-white/80'>Direct from Farm to Table</span>
            <h1 className='text-5xl font-bold tracking-tight sm:text-6xl'>Fresh Produce Without the Middleman</h1>
            <p className='max-w-xl text-lg text-slate-100/90'>Connect directly with local farmers. Get the freshest produce at fair prices while supporting your community.</p>
            <div className='flex flex-wrap gap-4'>
              <Link to='/marketplace' className='inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-emerald-900 shadow-lg shadow-emerald-900/20 hover:bg-emerald-50'>Browse Products</Link>
              <Link to='/register' className='inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white hover:bg-white/20'>Become a Seller</Link>
            </div>
          </div>
          <div className='grid gap-6 sm:grid-cols-2 lg:max-w-xl'>
            {featuredProducts.map((product) => (
              <div key={product.title} className='rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl shadow-slate-950/10 backdrop-blur-xl'>
                <div className='mb-4 h-52 overflow-hidden rounded-3xl bg-slate-800'>
                  <img src={product.image} alt={product.title} className='h-full w-full object-cover' />
                </div>
                <h2 className='text-2xl font-semibold'>{product.title}</h2>
                <p className='mt-2 text-sm text-slate-100/80'>{product.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='mx-auto max-w-7xl px-6'>
        <div className='mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between'>
          <div>
            <h2 className='text-3xl font-bold text-slate-900'>Featured Farmer Shops</h2>
            <p className='mt-2 text-slate-600'>Browse live farmer stores and shop directly from the source.</p>
          </div>
          <Link to='/marketplace' className='text-sm font-semibold text-emerald-700 hover:text-emerald-900'>View all stores</Link>
        </div>
        <div className='grid gap-6 md:grid-cols-3'>
          <div className='rounded-3xl bg-white p-8 shadow-sm'>
            <h3 className='text-xl font-semibold'>Sunrise Farms</h3>
            <p className='mt-3 text-slate-600'>Organic vegetables and herbs with same-day pickup.</p>
          </div>
          <div className='rounded-3xl bg-white p-8 shadow-sm'>
            <h3 className='text-xl font-semibold'>Harvest Roots</h3>
            <p className='mt-3 text-slate-600'>Root crops, rice, and pantry staples from local growers.</p>
          </div>
          <div className='rounded-3xl bg-white p-8 shadow-sm'>
            <h3 className='text-xl font-semibold'>Dairy Direct</h3>
            <p className='mt-3 text-slate-600'>Fresh eggs, milk, and dairy products from trusted farms.</p>
          </div>
        </div>
      </section>

      <section className='mx-auto max-w-7xl px-6'>
        <div className='mb-10 flex items-center justify-between'>
          <div>
            <h2 className='text-3xl font-bold text-slate-900'>Shop by Category</h2>
            <p className='mt-2 text-slate-600'>Browse our wide selection of fresh farm products.</p>
          </div>
        </div>
        <div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3'>
          {categories.map((category) => (
            <CategoryCard key={category.title} {...category} />
          ))}
        </div>
      </section>

      <section className='mx-auto max-w-7xl px-6'>
        <div className='mb-10 flex items-center justify-between'>
          <div>
            <h2 className='text-3xl font-bold text-slate-900'>Featured Products</h2>
            <p className='mt-2 text-slate-600'>Fresh picks from our farmers.</p>
          </div>
          <Link to='/marketplace' className='text-sm font-semibold text-emerald-700 hover:text-emerald-900'>View All</Link>
        </div>
        <div className='grid gap-6 lg:grid-cols-3'>
          {featuredProducts.map((product) => (
            <ProductCard key={product.title} {...product} />
          ))}
        </div>
      </section>
    </div>
  )
}
