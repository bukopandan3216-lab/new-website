export default function Dashboard() {
  return (
    <div className='min-h-screen bg-slate-100 p-8'>
      <h1 className='text-4xl font-bold mb-6'>Farmer Dashboard</h1>
      <div className='grid gap-6 md:grid-cols-3'>
        <div className='rounded-3xl bg-white p-6 shadow'>Products</div>
        <div className='rounded-3xl bg-white p-6 shadow'>Orders</div>
        <div className='rounded-3xl bg-white p-6 shadow'>Analytics</div>
      </div>
    </div>
  )
}
