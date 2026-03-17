import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [dropOpen,  setDropOpen]  = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const fn = (e) => { if (!e.target.closest('#profileDrop')) setDropOpen(false) }
    document.addEventListener('click', fn)
    return () => document.removeEventListener('click', fn)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
    setDropOpen(false)
    setMenuOpen(false)
  }

  const lc = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
      isActive ? 'text-teal-700 bg-teal-50' : 'text-gray-600 hover:text-teal-700 hover:bg-teal-50'
    }`

  return (
    <>
      <nav className={`fixed top-0 inset-x-0 z-50 h-[68px] transition-all duration-300
        ${scrolled ? 'bg-white/96 backdrop-blur-xl shadow-sm border-b border-gray-100' : 'bg-white/85 backdrop-blur-md'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-full flex items-center gap-3">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 mr-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-700 to-teal-500 flex items-center justify-center shadow-md">
              <i className="fa-solid fa-stethoscope text-white text-sm"/>
            </div>
            <div className="leading-tight">
              <div className="font-display font-semibold text-[1.05rem] text-gray-900 leading-none">OBGyne</div>
              <div className="text-[9px] font-bold text-teal-600 uppercase tracking-widest">Simplified</div>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/"        className={lc} end>Home</NavLink>
            <NavLink to="/courses" className={lc}>Courses</NavLink>
            <NavLink to="/about"   className={lc}>About</NavLink>
            <NavLink to="/contact" className={lc}>Contact</NavLink>
          </div>

          {/* Right */}
          <div className="hidden md:flex items-center gap-2 ml-auto">
            {user ? (
              <div className="relative" id="profileDrop">
                <button onClick={(e) => { e.stopPropagation(); setDropOpen(o=>!o) }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-teal-50 transition-colors cursor-pointer border-0 bg-transparent">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center font-bold text-xs text-teal-700 flex-shrink-0">
                    {user.name?.slice(0,2).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-gray-800">{user.name?.split(' ')[0]}</span>
                  <i className={`fa-solid fa-chevron-down text-[9px] text-gray-400 transition-transform ${dropOpen?'rotate-180':''}`}/>
                </button>
                {dropOpen && (
                  <div className="absolute right-0 top-12 w-54 bg-white rounded-2xl shadow-xl border border-gray-100 py-1 z-50 animate-slideUp">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="text-sm font-semibold text-gray-800 truncate">{user.name}</div>
                      <div className="text-xs text-gray-500 truncate">{user.email}</div>
                    </div>
                    <Link to="/dashboard" onClick={()=>setDropOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 hover:bg-teal-50 hover:text-teal-700 transition-colors">
                      <i className="fa-solid fa-gauge-high text-xs w-4 text-center"/>My Courses
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" onClick={()=>setDropOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 hover:bg-teal-50 hover:text-teal-700 transition-colors">
                        <i className="fa-solid fa-shield-halved text-xs w-4 text-center"/>Admin Panel
                      </Link>
                    )}
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer border-0 bg-transparent">
                        <i className="fa-solid fa-right-from-bracket text-xs w-4 text-center"/>Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login"    className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-teal-700 rounded-lg hover:bg-teal-50 transition-all">Sign In</Link>
                <Link to="/register" className="btn-primary text-sm px-4 py-2.5">
                  <i className="fa-solid fa-graduation-cap text-xs"/>Enroll Now
                </Link>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button onClick={()=>setMenuOpen(o=>!o)}
            className="md:hidden ml-auto flex flex-col gap-[5px] p-2 cursor-pointer border-0 bg-transparent"
            aria-label="Toggle menu">
            <span className={`block w-5 h-0.5 bg-gray-700 rounded transition-all ${menuOpen?'translate-y-[7px] rotate-45':''}`}/>
            <span className={`block w-5 h-0.5 bg-gray-700 rounded transition-all ${menuOpen?'opacity-0':''}`}/>
            <span className={`block w-5 h-0.5 bg-gray-700 rounded transition-all ${menuOpen?'-translate-y-[7px] -rotate-45':''}`}/>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed top-[68px] inset-x-0 z-40 bg-white border-b border-gray-100 shadow-lg px-4 py-4 flex flex-col gap-1 md:hidden animate-slideUp">
          <NavLink to="/"        className={lc} end    onClick={()=>setMenuOpen(false)}>Home</NavLink>
          <NavLink to="/courses" className={lc}        onClick={()=>setMenuOpen(false)}>All Courses</NavLink>
          <NavLink to="/about"   className={lc}        onClick={()=>setMenuOpen(false)}>About Dr. Mariam</NavLink>
          <NavLink to="/contact" className={lc}        onClick={()=>setMenuOpen(false)}>Contact</NavLink>
          {user ? (
            <>
              <NavLink to="/dashboard" className={lc} onClick={()=>setMenuOpen(false)}>My Courses</NavLink>
              {isAdmin && <NavLink to="/admin" className={lc} onClick={()=>setMenuOpen(false)}>Admin Panel</NavLink>}
              <button onClick={handleLogout}
                className="text-left mt-1 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors cursor-pointer border-0 bg-transparent">
                Sign Out
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-3 border-t border-gray-100 mt-1">
              <Link to="/login"    className="btn-outline justify-center" onClick={()=>setMenuOpen(false)}>Sign In</Link>
              <Link to="/register" className="btn-primary justify-center"  onClick={()=>setMenuOpen(false)}>
                <i className="fa-solid fa-graduation-cap text-xs"/>Enroll Now
              </Link>
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default Navbar
