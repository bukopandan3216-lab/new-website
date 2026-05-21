import { useState } from 'react'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className='min-h-screen flex items-center justify-center bg-slate-50'>
      <div className='w-full max-w-md bg-white rounded-3xl p-8 shadow'>
        <h1 className='text-3xl font-bold mb-6'>Register</h1>
        <form className='space-y-4'>
          <input
            type='text'
            placeholder='Full name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='w-full rounded-xl border px-4 py-3'
          />
          <input
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='w-full rounded-xl border px-4 py-3'
          />
          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='w-full rounded-xl border px-4 py-3'
          />
          <button className='w-full bg-green-700 text-white rounded-xl py-3'>Create account</button>
        </form>
      </div>
    </div>
  )
}
