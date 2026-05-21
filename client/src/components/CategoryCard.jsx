export default function CategoryCard({ emoji, title, items }) {
  return (
    <div className='rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg'>
      <div className='text-3xl'>{emoji}</div>
      <h3 className='mt-4 text-lg font-semibold text-slate-900'>{title}</h3>
      <p className='mt-2 text-sm text-slate-500'>{items} items</p>
    </div>
  )
}
