import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'
import { Spinner, StatCard } from '../components/ui'
import toast from 'react-hot-toast'

const DashboardPage = () => {
  const { user, updateUser } = useAuth()
  const [enrollments, setEnrollments] = useState([])
  const [loading,     setLoading]     = useState(true)
  const [tab,         setTab]         = useState('courses')
  const [saving,      setSaving]      = useState(false)
  const [profile,     setProfile]     = useState({
    name:  user?.name  || '',
    phone: user?.phone || '',
    city:  user?.city  || '',
    bio:   user?.bio   || '',
  })

  useEffect(() => {
    api.get('/enrollments/my')
      .then(({ data }) => setEnrollments(data.enrollments))
      .catch(() => toast.error('Failed to load enrollments'))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async e => {
    e.preventDefault()
    setSaving(true)
    try {
      const { data } = await api.put('/auth/updateprofile', profile)
      updateUser(data.user)
      toast.success('Profile updated!')
    } catch { toast.error('Update failed') }
    finally   { setSaving(false) }
  }

  const completed  = enrollments.filter(e => e.isCompleted).length
  const inProgress = enrollments.filter(e => !e.isCompleted && e.progressPercent > 0).length

  return (
    <div className="pt-[68px] min-h-screen bg-gray-50">
      {/* Top */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-100 flex items-center justify-center font-bold text-xl text-teal-700 flex-shrink-0">
            {user?.name?.slice(0,2).toUpperCase()}
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-gray-900">
              Welcome back, {user?.name?.split(' ')[0]}!
            </h1>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon="fa-graduation-cap" value={enrollments.length} label="Enrolled"    color="teal"  />
          <StatCard icon="fa-spinner"        value={inProgress}         label="In Progress" color="amber" />
          <StatCard icon="fa-circle-check"   value={completed}          label="Completed"   color="green" />
          <StatCard icon="fa-star"           value="4.9"                label="Rating"      color="purple"/>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-7">
          {[{id:'courses',label:'My Courses',icon:'fa-book'},{id:'profile',label:'Profile',icon:'fa-user'}].map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer border-0
                ${tab===t.id ? 'bg-white shadow text-teal-700' : 'text-gray-500 hover:text-gray-700 bg-transparent'}`}>
              <i className={`fa-solid ${t.icon} text-xs`}/>{t.label}
            </button>
          ))}
        </div>

        {/* MY COURSES */}
        {tab === 'courses' && (
          loading ? <div className="flex justify-center py-20"><Spinner size="lg"/></div>
          : enrollments.length === 0 ? (
            <div className="card p-14 text-center">
              <div className="w-16 h-16 rounded-2xl bg-teal-50 flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-book-open text-teal-400 text-2xl"/>
              </div>
              <h3 className="font-display text-xl font-bold text-gray-900 mb-2">No courses yet</h3>
              <p className="text-sm text-gray-500 mb-6">Browse our courses and enroll to start your exam preparation.</p>
              <Link to="/courses" className="btn-primary inline-flex">
                <i className="fa-solid fa-graduation-cap text-sm"/>Browse Courses
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {enrollments.map(e => {
                const c = e.course
                const grad = c?.colorTheme==='purple' ? 'from-purple-700 to-purple-500'
                           : c?.colorTheme==='green'  ? 'from-emerald-700 to-emerald-500'
                           : 'from-teal-700 to-teal-500'
                return (
                  <div key={e._id} className="card overflow-hidden">
                    <div className="h-1.5 bg-gray-100">
                      <div className="h-full bg-teal-500 transition-all" style={{width:`${e.progressPercent}%`}}/>
                    </div>
                    <div className="p-5 flex gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center flex-shrink-0`}>
                        <i className={`fa-solid ${c?.iconClass||'fa-book'} text-white text-lg`}/>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate text-sm">{c?.title}</h4>
                        <p className="text-xs text-gray-500 mt-0.5 mb-3">{c?.instructor}</p>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-teal-500 rounded-full" style={{width:`${e.progressPercent}%`}}/>
                          </div>
                          <span className="text-xs font-bold text-teal-600 flex-shrink-0">{e.progressPercent}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                            e.isCompleted ? 'bg-green-50 text-green-600'
                            : e.progressPercent > 0 ? 'bg-amber-50 text-amber-600'
                            : 'bg-gray-100 text-gray-500'
                          }`}>
                            {e.isCompleted ? '✓ Completed' : e.progressPercent>0 ? 'In Progress' : 'Not Started'}
                          </span>
                          <Link to={`/courses/${c?.slug}`}
                            className="text-xs font-bold text-teal-600 hover:underline flex items-center gap-1">
                            <i className="fa-solid fa-play text-[10px]"/>Continue
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )
        )}

        {/* PROFILE */}
        {tab === 'profile' && (
          <div className="max-w-lg">
            <div className="card p-7">
              <h3 className="font-display text-xl font-bold text-gray-900 mb-6">Update Profile</h3>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Full Name</label>
                  <input value={profile.name} onChange={e=>setProfile(p=>({...p,name:e.target.value}))}
                    className="input-field" required/>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Email (cannot change)</label>
                  <input value={user?.email} disabled className="input-field opacity-60 cursor-not-allowed"/>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Phone Number</label>
                  <input value={profile.phone} onChange={e=>setProfile(p=>({...p,phone:e.target.value}))}
                    className="input-field" placeholder="+92 300 1234567"/>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">City</label>
                  <input value={profile.city} onChange={e=>setProfile(p=>({...p,city:e.target.value}))}
                    className="input-field" placeholder="Lahore, Pakistan"/>
                </div>
                <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
                  {saving
                    ? <><i className="fa-solid fa-spinner fa-spin text-sm"/>Saving...</>
                    : <><i className="fa-solid fa-floppy-disk text-sm"/>Save Changes</>}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardPage
