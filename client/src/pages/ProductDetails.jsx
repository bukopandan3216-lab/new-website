import { useParams } from 'react-router-dom'

export default function ProductDetails() {
  const { id } = useParams()

  return (
    <div className='min-h-screen bg-slate-50 p-8'>
      <h1 className='text-4xl font-bold mb-4'>Product Details</h1>
      <p>Product ID: {id}</p>
      <div className='mt-6 rounded-3xl bg-white p-6 shadow'>Product information goes here.</div>
    </div>
  )
}
