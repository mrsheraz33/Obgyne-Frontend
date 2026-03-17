import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'
import toast from 'react-hot-toast'

const AuthCard = ({ children, title, subtitle }) => (
  <div className="min-h-screen flex items-center justify-center px-4 pt-[68px] pb-12 bg-gray-50">
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-6 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-700 to-teal-500 flex items-center justify-center shadow-lg group-hover:shadow-teal-200 transition-all">
            <i className="fa-solid fa-stethoscope text-white text-sm"/>
          </div>
          <div className="text-left">
            <div className="font-display font-semibold text-lg text-gray-900 leading-none">OBGyne</div>
            <div className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">Simplified</div>
          </div>
        </Link>
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
      <div className="card p-8">{children}</div>
    </div>
  </div>
)

/* ── LOGIN ── */
export const LoginPage = () => {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [form,    setForm]    = useState({ email:'', password:'' })
  const [loading, setLoading] = useState(false)
  const [showPw,  setShowPw]  = useState(false)

  const handle = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      navigate(user.role === 'admin' ? '/admin' : '/dashboard', { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally { setLoading(false) }
  }

  return (
    <AuthCard title="Welcome back" subtitle="Sign in to continue your exam preparation">
      <form onSubmit={handle} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Email Address</label>
          <input type="email" value={form.email}
            onChange={e => setForm(f=>({...f,email:e.target.value}))}
            required autoComplete="email"
            className="input-field" placeholder="your@email.com"/>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Password</label>
            <Link to="/forgot-password" className="text-xs text-teal-600 font-semibold hover:underline">Forgot password?</Link>
          </div>
          <div className="relative">
            <input type={showPw?'text':'password'} value={form.password}
              onChange={e => setForm(f=>({...f,password:e.target.value}))}
              required autoComplete="current-password"
              className="input-field pr-10" placeholder="••••••••"/>
            <button type="button" onClick={() => setShowPw(p=>!p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer border-0 bg-transparent">
              <i className={`fa-solid ${showPw?'fa-eye-slash':'fa-eye'} text-sm`}/>
            </button>
          </div>
        </div>
        <button type="submit" disabled={loading}
          className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed mt-2">
          {loading
            ? <><i className="fa-solid fa-spinner fa-spin text-sm"/>Signing in...</>
            : <><i className="fa-solid fa-right-to-bracket text-sm"/>Sign In</>}
        </button>
      </form>
      <p className="text-center text-sm text-gray-500 mt-6">
        Don't have an account?{' '}
        <Link to="/register" className="text-teal-600 font-semibold hover:underline">Register free</Link>
      </p>
    </AuthCard>
  )
}

/* ── REGISTER ── */
export const RegisterPage = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form,    setForm]    = useState({ name:'', email:'', password:'', confirm:'' })
  const [loading, setLoading] = useState(false)
  const [showPw,  setShowPw]  = useState(false)

  const handle = async e => {
    e.preventDefault()
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      await register(form.name, form.email, form.password)
      navigate('/courses')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally { setLoading(false) }
  }

  const pwStrength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3
  const strengthLabel = ['','Weak','Fair','Strong'][pwStrength]
  const strengthColor = ['','bg-red-400','bg-amber-400','bg-green-500'][pwStrength]

  return (
    <AuthCard title="Create account" subtitle="Start your OB/GYN exam preparation today">
      <form onSubmit={handle} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Full Name</label>
          <input type="text" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}
            required autoComplete="name" className="input-field" placeholder="Dr. Sara Ahmed"/>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Email Address</label>
          <input type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}
            required autoComplete="email" className="input-field" placeholder="your@email.com"/>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Password</label>
          <div className="relative">
            <input type={showPw?'text':'password'} value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))}
              required autoComplete="new-password" className="input-field pr-10" placeholder="Min. 6 characters"/>
            <button type="button" onClick={()=>setShowPw(p=>!p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer border-0 bg-transparent">
              <i className={`fa-solid ${showPw?'fa-eye-slash':'fa-eye'} text-sm`}/>
            </button>
          </div>
          {form.password && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex gap-1 flex-1">{[1,2,3].map(i=>(
                <div key={i} className={`flex-1 h-1 rounded-full transition-colors ${i<=pwStrength ? strengthColor : 'bg-gray-200'}`}/>
              ))}</div>
              <span className="text-xs text-gray-500">{strengthLabel}</span>
            </div>
          )}
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Confirm Password</label>
          <input type={showPw?'text':'password'} value={form.confirm} onChange={e=>setForm(f=>({...f,confirm:e.target.value}))}
            required autoComplete="new-password" className="input-field" placeholder="Repeat password"/>
          {form.confirm && form.password !== form.confirm && (
            <p className="text-xs text-red-500 mt-1"><i className="fa-solid fa-circle-xmark mr-1"/>Passwords do not match</p>
          )}
        </div>
        <button type="submit" disabled={loading}
          className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed mt-2">
          {loading
            ? <><i className="fa-solid fa-spinner fa-spin text-sm"/>Creating account...</>
            : <><i className="fa-solid fa-user-plus text-sm"/>Create Free Account</>}
        </button>
      </form>
      <p className="text-center text-xs text-gray-400 mt-4">By registering you agree to our terms of service.</p>
      <p className="text-center text-sm text-gray-500 mt-3">
        Already have an account?{' '}
        <Link to="/login" className="text-teal-600 font-semibold hover:underline">Sign in</Link>
      </p>
    </AuthCard>
  )
}

/* ── FORGOT PASSWORD ── */
export const ForgotPasswordPage = () => {
  const [email,   setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [result,  setResult]  = useState(null)

  const handle = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await api.post('/auth/forgotpassword', { email })
      setResult(data)
      toast.success('Reset link generated!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed — check your email address')
    } finally { setLoading(false) }
  }

  return (
    <AuthCard title="Forgot Password?" subtitle="Enter your email to generate a reset link">
      {!result ? (
        <form onSubmit={handle} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Email Address</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required
              className="input-field" placeholder="your@email.com" autoComplete="email"/>
          </div>
          <button type="submit" disabled={loading}
            className="btn-primary w-full justify-center disabled:opacity-60">
            {loading
              ? <><i className="fa-solid fa-spinner fa-spin text-sm"/>Processing...</>
              : <><i className="fa-solid fa-paper-plane text-sm"/>Generate Reset Link</>}
          </button>
          <div className="text-center">
            <Link to="/login" className="text-sm text-teal-600 font-semibold hover:underline">← Back to Sign In</Link>
          </div>
        </form>
      ) : (
        <div className="text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto">
            <i className="fa-solid fa-circle-check text-green-500 text-3xl"/>
          </div>
          <h3 className="font-semibold text-gray-900">Reset Link Ready!</h3>
          {result.resetToken && (
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 text-left">
              <p className="text-xs font-bold text-teal-700 mb-2">Click the link below to reset your password:</p>
              <Link to={`/reset-password/${result.resetToken}`}
                className="text-sm text-teal-600 font-semibold hover:underline break-all">
                → Click here to set new password
              </Link>
              <p className="text-xs text-teal-600 mt-2 opacity-60">Expires in 15 minutes.</p>
            </div>
          )}
          <Link to="/login" className="btn-primary justify-center w-full">
            <i className="fa-solid fa-right-to-bracket text-sm"/>Go to Sign In
          </Link>
        </div>
      )}
    </AuthCard>
  )
}

/* ── RESET PASSWORD ── */
export const ResetPasswordPage = () => {
  const { token } = useParams()
  const navigate  = useNavigate()
  const [form,    setForm]    = useState({ password:'', confirm:'' })
  const [loading, setLoading] = useState(false)
  const [showPw,  setShowPw]  = useState(false)

  const handle = async e => {
    e.preventDefault()
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return }
    if (form.password.length < 6)       { toast.error('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      await api.put(`/auth/resetpassword/${token}`, { password: form.password })
      toast.success('Password reset successfully! Please sign in.')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed — link may have expired')
    } finally { setLoading(false) }
  }

  return (
    <AuthCard title="Set New Password" subtitle="Enter and confirm your new password">
      <form onSubmit={handle} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">New Password</label>
          <div className="relative">
            <input type={showPw?'text':'password'} value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))}
              required className="input-field pr-10" placeholder="Min. 6 characters"/>
            <button type="button" onClick={()=>setShowPw(p=>!p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer border-0 bg-transparent">
              <i className={`fa-solid ${showPw?'fa-eye-slash':'fa-eye'} text-sm`}/>
            </button>
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Confirm Password</label>
          <input type={showPw?'text':'password'} value={form.confirm} onChange={e=>setForm(f=>({...f,confirm:e.target.value}))}
            required className="input-field" placeholder="Repeat new password"/>
        </div>
        <button type="submit" disabled={loading}
          className="btn-primary w-full justify-center disabled:opacity-60">
          {loading
            ? <><i className="fa-solid fa-spinner fa-spin text-sm"/>Resetting...</>
            : <><i className="fa-solid fa-check text-sm"/>Reset Password</>}
        </button>
      </form>
    </AuthCard>
  )
}
