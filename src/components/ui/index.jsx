import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

/* ── Spinner ── */
export const Spinner = ({ size = 'md', color = 'teal' }) => {
  const sz = { sm:'w-4 h-4', md:'w-7 h-7', lg:'w-11 h-11' }
  const cl = { teal:'border-teal-600', white:'border-white', gray:'border-gray-300' }
  return <div className={`${sz[size]} rounded-full border-2 border-t-transparent ${cl[color]} animate-spin`}/>
}

/* ── Page Loader ── */
export const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <Spinner size="lg"/>
      <p className="text-sm text-gray-400 font-medium">Loading...</p>
    </div>
  </div>
)

/* ── Protected Route ── */
export const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth()
  if (loading) return <PageLoader/>
  if (!user)   return <Navigate to="/login" replace/>
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace/>
  return children
}

/* ── Course Card ── */
export const CourseCard = ({ course, enrolled=false, progress=0, onEnroll, enrolling=false }) => {
  const theme = {
    teal:   { grad:'from-teal-700 to-teal-500',     btn:'bg-teal-600 hover:bg-teal-700'     },
    purple: { grad:'from-purple-700 to-purple-500', btn:'bg-purple-600 hover:bg-purple-700' },
    green:  { grad:'from-emerald-700 to-emerald-500',btn:'bg-emerald-600 hover:bg-emerald-700'},
  }
  const t = theme[course.colorTheme] || theme.teal

  const totalLessons = course.hasModules
    ? (course.modules || []).reduce((s, m) => s + (m.lessons?.length || 0), 0)
    : (course.lessons?.length || 0)

  return (
    <div className="card overflow-hidden flex flex-col hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300 group">
      {/* Thumb */}
      <div className={`h-44 relative overflow-hidden bg-gradient-to-br ${t.grad} flex items-center justify-center`}>
        <div className="absolute inset-0 opacity-[0.07]"
          style={{backgroundImage:'radial-gradient(circle,white 1px,transparent 1px)',backgroundSize:'22px 22px'}}/>
        <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center border border-white/20 relative z-10">
          <i className={`fa-solid ${course.iconClass||'fa-book'} text-white text-2xl`}/>
        </div>
        <span className="absolute top-3 right-3 text-[11px] font-semibold text-white bg-white/20 backdrop-blur px-2.5 py-1 rounded-full border border-white/20 z-10">
          {course.badge}
        </span>
        {enrolled && (
          <div className="absolute bottom-0 inset-x-0 h-1.5 bg-black/20">
            <div className="h-full bg-white transition-all duration-700" style={{width:`${progress}%`}}/>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {course.tags?.slice(0,3).map(t => (
            <span key={t} className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-100">
              {t}
            </span>
          ))}
        </div>
        <h3 className="font-display text-lg font-semibold text-gray-900 mb-2 leading-snug">{course.title}</h3>
        <p className="text-sm text-gray-500 leading-relaxed flex-1 mb-4 line-clamp-2">{course.shortDesc}</p>

        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-4">
          <span className="flex items-center gap-1.5"><i className="fa-solid fa-signal text-teal-500 text-[10px]"/>{course.level}</span>
          <span className="flex items-center gap-1.5"><i className="fa-solid fa-book text-teal-500 text-[10px]"/>{totalLessons} lessons</span>
          <span className="flex items-center gap-1.5"><i className="fa-solid fa-star text-amber-400 text-[10px]"/>{course.rating}</span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center font-bold text-[11px] text-teal-700">DM</div>
            <span className="text-xs font-semibold text-gray-600">{course.instructor}</span>
          </div>
          {enrolled ? (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-teal-600">
              <i className="fa-solid fa-circle-check text-green-500 text-xs"/>Enrolled · {progress}%
            </span>
          ) : (
            <button onClick={onEnroll} disabled={enrolling}
              className={`${t.btn} text-white text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 disabled:opacity-60 shadow-sm hover:-translate-y-0.5 border-0 cursor-pointer`}>
              {enrolling
                ? <i className="fa-solid fa-spinner fa-spin text-[10px]"/>
                : <i className="fa-solid fa-lock text-[10px]"/>}
              Enroll Now
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Stat Card ── */
export const StatCard = ({ icon, value, label, color='teal', sub='' }) => {
  const cls = {
    teal:  'bg-teal-50   text-teal-600',
    purple:'bg-purple-50 text-purple-600',
    amber: 'bg-amber-50  text-amber-600',
    green: 'bg-green-50  text-green-600',
    rose:  'bg-rose-50   text-rose-600',
  }
  return (
    <div className="card p-5 flex items-start gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${cls[color]}`}>
        <i className={`fa-solid ${icon} text-lg`}/>
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-900 leading-tight">{value}</div>
        <div className="text-sm text-gray-500">{label}</div>
        {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
      </div>
    </div>
  )
}
