import React, { useState } from 'react'

export default function Accounts() {
  const [tab, setTab] = useState('login')
  const [token, setToken] = useState('')
  const [profile, setProfile] = useState(null)

  async function api(path, opts) {
    const res = await fetch(`/api${path}`, {
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      ...opts,
    })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  }

  async function login(e) {
    e.preventDefault()
    const form = new FormData(e.target)
    const body = { email: form.get('email'), password: form.get('password') }
    const data = await api('/auth/login', { method: 'POST', body: JSON.stringify(body) })
    setToken(data.token)
    setProfile(data.user)
  }

  async function signup(e) {
    e.preventDefault()
    const form = new FormData(e.target)
    const body = { name: form.get('name'), email: form.get('email'), password: form.get('password') }
    const data = await api('/auth/register', { method: 'POST', body: JSON.stringify(body) })
    setToken(data.token)
    setProfile(data.user)
  }

  async function fetchMe() {
    const data = await api('/me')
    setProfile(data.user)
  }

  function logout() { setToken(''); setProfile(null) }

  return (
    <div className="container my-5">
      {!profile ? (
        <div className="card mx-auto" style={{maxWidth: 500}}>
          <div className="card-body">
            <ul className="nav nav-tabs mb-3">
              <li className="nav-item"><button className={`nav-link ${tab==='login'?'active':''}`} onClick={()=>setTab('login')}>Login</button></li>
              <li className="nav-item"><button className={`nav-link ${tab==='signup'?'active':''}`} onClick={()=>setTab('signup')}>Sign Up</button></li>
            </ul>
            {tab==='login' ? (
              <form onSubmit={login}>
                <div className="mb-3"><label>Email</label><input name="email" type="email" className="form-control" required /></div>
                <div className="mb-3"><label>Password</label><input name="password" type="password" className="form-control" required /></div>
                <button className="btn btn-dark w-100">Login</button>
              </form>
            ) : (
              <form onSubmit={signup}>
                <div className="mb-3"><label>Full Name</label><input name="name" className="form-control" required /></div>
                <div className="mb-3"><label>Email</label><input name="email" type="email" className="form-control" required /></div>
                <div className="mb-3"><label>Password</label><input name="password" type="password" className="form-control" required /></div>
                <button className="btn btn-primary w-100">Sign Up</button>
              </form>
            )}
          </div>
        </div>
      ) : (
        <div>
          <h2 className="mb-3">Welcome, {profile.name}</h2>
          <div className="mb-3"><code>JWT:</code> {token.slice(0,25)}…</div>
          <div className="d-flex gap-2"><button className="btn btn-outline-dark" onClick={fetchMe}>Refresh Profile</button><button className="btn btn-danger" onClick={logout}>Logout</button></div>
        </div>
      )}
    </div>
  )
}


