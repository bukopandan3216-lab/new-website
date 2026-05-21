export default function ProductCard({ title, description, price, image }) {
  return (
    <div className='rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg'>
      <div className='h-52 w-full overflow-hidden rounded-3xl bg-slate-100'>
        <img src={image} alt={title} className='h-full w-full object-cover' />
      </div>
      <div className='mt-5'>
        <h3 className='text-xl font-semibold text-slate-900'>{title}</h3>
        <p className='mt-2 text-sm text-slate-500'>{description}</p>
        <div className='mt-4 flex items-center justify-between'>
          <span className='text-lg font-bold text-green-700'>₱{price}</span>
          <button className='rounded-full bg-green-700 px-4 py-2 text-sm text-white hover:bg-green-800'>Add to cart</button>
        </div>
      </div>
    </div>
  )
}
