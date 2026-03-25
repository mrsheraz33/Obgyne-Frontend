import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'
import { Spinner, StatCard } from '../components/ui'
import toast from 'react-hot-toast'

// ─── Course Form Modal with FULL Modules & Lessons Management ───
const CourseModal = ({ course, onSave, onClose }) => {
  const [form, setForm] = useState({
    title: course?.title || '',
    shortDesc: course?.shortDesc || '',
    description: course?.description || '',
    level: course?.level || 'All Levels',
    language: course?.language || 'Urdu / English',
    tags: course?.tags?.join(', ') || '',
    isFree: course?.isFree ?? false,
    isPaid: course?.isPaid ?? true,
    isPublished: course?.isPublished ?? true,
    colorTheme: course?.colorTheme || 'teal',
    iconClass: course?.iconClass || 'fa-book-medical',
    badge: course?.badge || 'Enrolling Now',
    enrollmentCount: course?.enrollmentCount || 0,
    rating: course?.rating || 4.9,
    whatYouLearn: course?.whatYouLearn?.join('\n') || '',
    requirements: course?.requirements?.join('\n') || '',
    hasModules: course?.hasModules ?? false,
  })

  const [modules, setModules] = useState(course?.modules || [])
  const [saving, setSaving] = useState(false)

  const handle = async e => {
    e.preventDefault()
    setSaving(true)
    
    const payload = {
      ...form,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      whatYouLearn: form.whatYouLearn.split('\n').filter(Boolean),
      requirements: form.requirements.split('\n').filter(Boolean),
      enrollmentCount: Number(form.enrollmentCount),
      rating: Number(form.rating),
      hasModules: form.hasModules,
      modules: form.hasModules ? modules : [],
    }
    
    try {
      if (course?._id) {
        const { data } = await api.put(`/courses/${course._id}`, payload)
        onSave(data.course, 'update')
      } else {
        const { data } = await api.post('/courses', payload)
        onSave(data.course, 'create')
      }
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  // Module Management Functions
  const addModule = () => {
    setModules([...modules, {
      title: 'New Module',
      order: modules.length + 1,
      lessons: []
    }])
  }

  const updateModuleTitle = (index, title) => {
    const newModules = [...modules]
    newModules[index].title = title
    setModules(newModules)
  }

  const deleteModule = (index) => {
    if (!confirm('Delete this module and all its lessons?')) return
    const newModules = modules.filter((_, i) => i !== index)
    setModules(newModules)
  }

  // Lesson Management Functions
  const addLesson = (moduleIndex) => {
    const newModules = [...modules]
    newModules[moduleIndex].lessons.push({
      title: 'New Lesson',
      duration: '30 min',
      isFree: false,
      videoUrl: '',
      order: newModules[moduleIndex].lessons.length + 1
    })
    setModules(newModules)
  }

  const updateLesson = (moduleIndex, lessonIndex, field, value) => {
    const newModules = [...modules]
    newModules[moduleIndex].lessons[lessonIndex][field] = value
    setModules(newModules)
  }

  const deleteLesson = (moduleIndex, lessonIndex) => {
    if (!confirm('Delete this lesson?')) return
    const newModules = [...modules]
    newModules[moduleIndex].lessons = newModules[moduleIndex].lessons.filter((_, i) => i !== lessonIndex)
    setModules(newModules)
  }

  const F = ({ label, children }) => (
    <div>
      <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-slideUp">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h3 className="font-display text-xl font-bold text-gray-900">
            {course?._id ? 'Edit Course' : 'Add New Course'}
          </h3>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors cursor-pointer border-0 bg-transparent text-gray-500">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
        
        <form onSubmit={handle} className="p-6 space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <F label="Course Title *">
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                required className="input-field" placeholder="Theory Group" />
            </F>
            <F label="Short Description">
              <input value={form.shortDesc} onChange={e => setForm(f => ({ ...f, shortDesc: e.target.value }))}
                className="input-field" placeholder="One-line summary shown on cards" />
            </F>
          </div>

          <F label="Full Description *">
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              required rows={3} className="input-field resize-none" />
          </F>

          <div className="grid grid-cols-2 gap-4">
            <F label="Level">
              <select value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value }))} className="input-field">
                {['All Levels', 'Beginner', 'Intermediate', 'Advanced'].map(l => <option key={l}>{l}</option>)}
              </select>
            </F>
            <F label="Language">
              <input value={form.language} onChange={e => setForm(f => ({ ...f, language: e.target.value }))}
                className="input-field" placeholder="Urdu / English" />
            </F>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <F label="Color Theme">
              <select value={form.colorTheme} onChange={e => setForm(f => ({ ...f, colorTheme: e.target.value }))} className="input-field">
                {['teal', 'purple', 'green'].map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </F>
            <F label="Icon Class">
              <input value={form.iconClass} onChange={e => setForm(f => ({ ...f, iconClass: e.target.value }))}
                className="input-field" placeholder="fa-book-medical" />
            </F>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <F label="Badge Text">
              <input value={form.badge} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))}
                className="input-field" placeholder="Enrolling Now" />
            </F>
            <F label="Tags (comma separated)">
              <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                className="input-field" placeholder="FCPS, MCPS, Theory" />
            </F>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <F label="Enrollment Count">
              <input type="number" value={form.enrollmentCount} onChange={e => setForm(f => ({ ...f, enrollmentCount: e.target.value }))}
                className="input-field" min="0" />
            </F>
            <F label="Rating (0-5)">
              <input type="number" value={form.rating} onChange={e => setForm(f => ({ ...f, rating: e.target.value }))}
                className="input-field" min="0" max="5" step="0.1" />
            </F>
          </div>

          <F label="What You'll Learn (one per line)">
            <textarea value={form.whatYouLearn} onChange={e => setForm(f => ({ ...f, whatYouLearn: e.target.value }))}
              rows={3} className="input-field resize-none" placeholder="Complete FCPS syllabus&#10;MCQ practice&#10;..." />
          </F>

          <F label="Requirements (one per line)">
            <textarea value={form.requirements} onChange={e => setForm(f => ({ ...f, requirements: e.target.value }))}
              rows={2} className="input-field resize-none" placeholder="MBBS degree&#10;..." />
          </F>

          <div className="flex flex-wrap gap-5 pt-1">
            {[
              { key: 'isFree', label: 'Free Course' },
              { key: 'isPaid', label: 'Paid Course' },
              { key: 'isPublished', label: 'Published' },
            ].map(cb => (
              <label key={cb.key} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox" checked={form[cb.key]}
                  onChange={e => setForm(f => ({ ...f, [cb.key]: e.target.checked }))}
                  className="w-4 h-4 rounded accent-teal-600" />
                {cb.label}
              </label>
            ))}
          </div>

          {/* ─── MODULES & LESSONS SECTION ─── */}
          <div className="border-t border-gray-200 pt-5 mt-2">
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.hasModules}
                  onChange={(e) => setForm(f => ({ ...f, hasModules: e.target.checked }))}
                  className="w-4 h-4 rounded accent-teal-600"
                />
                <span className="text-sm font-semibold text-gray-700">
                  <i className="fa-solid fa-layer-group mr-2 text-teal-600" />
                  Use Modules (TOACS style with accordion)
                </span>
              </label>
              {form.hasModules && (
                <button
                  type="button"
                  onClick={addModule}
                  className="text-xs bg-teal-600 text-white px-3 py-1.5 rounded-lg hover:bg-teal-700"
                >
                  <i className="fa-solid fa-plus mr-1" /> Add Module
                </button>
              )}
            </div>

            {form.hasModules ? (
              <div className="space-y-4">
                {modules.length === 0 && (
                  <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <i className="fa-solid fa-folder-open text-3xl text-gray-300 mb-2" />
                    <p className="text-sm text-gray-500">No modules yet. Click "Add Module" to start.</p>
                  </div>
                )}
                
                {modules.map((mod, mIdx) => (
                  <div key={mIdx} className="border border-gray-200 rounded-xl overflow-hidden">
                    {/* Module Header */}
                    <div className="bg-gray-50 p-4 flex items-center gap-3">
                      <div className="flex-1">
                        <input
                          value={mod.title}
                          onChange={(e) => updateModuleTitle(mIdx, e.target.value)}
                          className="w-full input-field text-sm font-semibold"
                          placeholder="Module Title (e.g., Obstetrics Module)"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => addLesson(mIdx)}
                          className="text-xs bg-teal-50 text-teal-600 px-3 py-1.5 rounded-lg hover:bg-teal-100"
                        >
                          <i className="fa-solid fa-plus mr-1" /> Add Lesson
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteModule(mIdx)}
                          className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg"
                        >
                          <i className="fa-solid fa-trash" />
                        </button>
                      </div>
                    </div>

                    {/* Lessons List */}
                    <div className="divide-y divide-gray-100">
                      {mod.lessons?.length === 0 && (
                        <div className="p-4 text-center text-gray-400 text-sm">
                          <i className="fa-solid fa-info-circle mr-1" /> No lessons in this module
                        </div>
                      )}
                      {mod.lessons?.map((lesson, lIdx) => (
                        <div key={lIdx} className="p-4 bg-white">
                          <div className="grid grid-cols-12 gap-2">
                            <div className="col-span-4">
                              <input
                                value={lesson.title}
                                onChange={(e) => updateLesson(mIdx, lIdx, 'title', e.target.value)}
                                className="w-full input-field text-sm py-2"
                                placeholder="Lesson title"
                              />
                            </div>
                            <div className="col-span-2">
                              <input
                                value={lesson.duration}
                                onChange={(e) => updateLesson(mIdx, lIdx, 'duration', e.target.value)}
                                className="w-full input-field text-sm py-2"
                                placeholder="Duration (e.g., 35 min)"
                              />
                            </div>
                            <div className="col-span-4">
                              <input
                                value={lesson.videoUrl || ''}
                                onChange={(e) => updateLesson(mIdx, lIdx, 'videoUrl', e.target.value)}
                                className="w-full input-field text-sm py-2"
                                placeholder="YouTube URL (e.g., https://youtu.be/...)"
                              />
                            </div>
                            <div className="col-span-1 flex items-center gap-2">
                              <label className="flex items-center gap-1 text-xs">
                                <input
                                  type="checkbox"
                                  checked={lesson.isFree}
                                  onChange={(e) => updateLesson(mIdx, lIdx, 'isFree', e.target.checked)}
                                  className="w-3.5 h-3.5 rounded"
                                />
                                <span className="text-gray-600">Free</span>
                              </label>
                            </div>
                            <div className="col-span-1 flex justify-end">
                              <button
                                type="button"
                                onClick={() => deleteLesson(mIdx, lIdx)}
                                className="text-red-400 hover:text-red-600 p-1"
                              >
                                <i className="fa-solid fa-trash-can" />
                              </button>
                            </div>
                          </div>
                          {lesson.videoUrl && (
                            <div className="mt-2 text-xs text-green-600">
                              <i className="fa-brands fa-youtube mr-1" /> Video link added
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl p-6 text-center">
                <i className="fa-solid fa-list-ul text-2xl text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">Flat lesson list mode (coming soon)</p>
                <p className="text-xs text-gray-400 mt-1">For now, use Modules mode for full control</p>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-5 border-t border-gray-100">
            <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
              {saving
                ? <><i className="fa-solid fa-spinner fa-spin text-sm" />Saving...</>
                : <><i className="fa-solid fa-floppy-disk text-sm" />Save Course</>}
            </button>
            <button type="button" onClick={onClose} className="btn-outline cursor-pointer">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Main Admin Page ─────────────────────────────────
const AdminPage = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [courses, setCourses] = useState([])
  const [users, setUsers] = useState([])
  const [enrolls, setEnrolls] = useState([])
  const [modal, setModal] = useState(null)
  const [pwForm, setPwForm] = useState({ email: '', newPassword: '' })
  const [pwSaving, setPwSaving] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const [s, c, u, e] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/courses/admin/all'),
          api.get('/admin/users'),
          api.get('/enrollments'),
        ])
        setStats(s.data.stats)
        setCourses(c.data.courses)
        setUsers(u.data.users)
        setEnrolls(e.data.enrollments)
      } catch {
        toast.error('Failed to load admin data')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const deleteCourse = async id => {
    if (!confirm('Delete this course? This cannot be undone.')) return
    try {
      await api.delete(`/courses/${id}`)
      setCourses(cs => cs.filter(c => c._id !== id))
      toast.success('Course deleted')
    } catch {
      toast.error('Delete failed')
    }
  }

  const deleteUser = async id => {
    if (!confirm('Delete this user?')) return
    try {
      await api.delete(`/admin/users/${id}`)
      setUsers(us => us.filter(u => u._id !== id))
      toast.success('User deleted')
    } catch {
      toast.error('Delete failed')
    }
  }

  // ✅ NEW: Approve User Function
  const approveUser = async (userId) => {
    try {
      const { data } = await api.put(`/admin/users/${userId}/approve`)
      setUsers(users.map(u => 
        u._id === userId ? { ...u, isApproved: true } : u
      ))
      toast.success(data.message || 'User approved! They can now access videos.')
    } catch {
      toast.error('Failed to approve user')
    }
  }

  const toggleRole = async u => {
    const nr = u.role === 'admin' ? 'student' : 'admin'
    try {
      await api.put(`/admin/users/${u._id}`, { role: nr })
      setUsers(us => us.map(x => x._id === u._id ? { ...x, role: nr } : x))
      toast.success(`Role changed to ${nr}`)
    } catch {
      toast.error('Failed')
    }
  }

  const handleCourseSave = (course, type) => {
    if (type === 'create') setCourses(cs => [course, ...cs])
    else setCourses(cs => cs.map(c => c._id === course._id ? course : c))
    toast.success(type === 'create' ? 'Course created!' : 'Course updated!')
  }

  const resetPw = async e => {
    e.preventDefault()
    setPwSaving(true)
    try {
      const { data } = await api.put('/admin/resetpassword', pwForm)
      toast.success(data.message)
      setPwForm({ email: '', newPassword: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed')
    } finally {
      setPwSaving(false)
    }
  }

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  const TABS = [
    { id: 'overview', label: 'Overview', icon: 'fa-gauge-high' },
    { id: 'courses', label: 'Courses', icon: 'fa-book' },
    { id: 'users', label: 'Users', icon: 'fa-users' },
    { id: 'enrolls', label: 'Enrollments', icon: 'fa-list-check' },
    { id: 'settings', label: 'Settings', icon: 'fa-gear' },
  ]

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-[68px]"><Spinner size="lg" /></div>

  return (
    <div className="pt-[68px] min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center flex-shrink-0">
              <i className="fa-solid fa-shield-halved text-white" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-xs text-gray-500">OBGyne Simplified</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 hidden sm:block">
              Logged in as <strong className="text-gray-800">{user?.name}</strong>
            </span>
            <button onClick={handleLogout}
              className="flex items-center gap-2 text-xs font-semibold text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors cursor-pointer border-0 bg-transparent">
              <i className="fa-solid fa-right-from-bracket" />Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-8">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer border-0
                ${tab === t.id ? 'bg-white shadow text-teal-700' : 'text-gray-500 hover:text-gray-700 bg-transparent'}`}>
              <i className={`fa-solid ${t.icon} text-xs`} />{t.label}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {tab === 'overview' && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard icon="fa-users" value={stats?.totalStudents} label="Students" color="teal" />
              <StatCard icon="fa-book" value={stats?.totalCourses} label="Courses" color="purple" />
              <StatCard icon="fa-list-check" value={stats?.totalEnrollments} label="Enrollments" color="amber" />
              <StatCard icon="fa-chart-line" value={`${stats?.completionRate}%`} label="Completion" color="green" />
            </div>
            <div className="card overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-display text-lg font-bold text-gray-900">Recent Enrollments</h3>
                <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">{enrolls.length} total</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      {['Student', 'Course', 'Progress', 'Date'].map(h => (
                        <th key={h} className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {enrolls.slice(0, 8).map(e => (
                      <tr key={e._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 font-medium text-gray-800">{e.user?.name}</td>
                        <td className="py-3 px-4 text-gray-600 text-xs">{e.course?.title}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-teal-500" style={{ width: `${e.progressPercent}%` }} />
                            </div>
                            <span className="text-xs text-gray-500">{e.progressPercent}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-xs text-gray-400">
                          {new Date(e.enrolledAt).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── COURSES ── */}
        {tab === 'courses' && (
          <div>
            <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
              <h2 className="font-display text-xl font-bold text-gray-900">Courses ({courses.length})</h2>
              <button onClick={() => setModal('add')} className="btn-primary">
                <i className="fa-solid fa-plus text-sm" />Add New Course
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {courses.map(c => (
                <div key={c._id} className="card p-5 flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
                    ${c.colorTheme === 'purple' ? 'bg-purple-100' : c.colorTheme === 'green' ? 'bg-emerald-100' : 'bg-teal-100'}`}>
                    <i className={`fa-solid ${c.iconClass || 'fa-book'} text-xl
                      ${c.colorTheme === 'purple' ? 'text-purple-600' : c.colorTheme === 'green' ? 'text-emerald-600' : 'text-teal-600'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate text-sm">{c.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5 mb-2">{c.enrollmentCount} enrolled · {c.rating}★</p>
                    <div className="flex flex-wrap gap-1.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${c.isPublished ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                        {c.isPublished ? 'Published' : 'Draft'}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-50 text-teal-600">
                        {c.isFree ? 'Free' : c.isPaid ? 'Paid' : '—'}
                      </span>
                      {c.hasModules && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-50 text-purple-600">Has Modules</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => setModal(c)}
                      className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-teal-50 hover:text-teal-600 flex items-center justify-center transition-colors text-gray-500 cursor-pointer border-0">
                      <i className="fa-solid fa-pen text-xs" />
                    </button>
                    <button onClick={() => deleteCourse(c._id)}
                      className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-colors text-gray-500 cursor-pointer border-0">
                      <i className="fa-solid fa-trash text-xs" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── USERS ── */}
        {tab === 'users' && (
          <div>
            <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
              <h2 className="font-display text-xl font-bold text-gray-900">Users ({users.length})</h2>
              <div className="relative">
                <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  className="input-field pl-9 py-2.5 text-sm w-56" placeholder="Search by name or email..." />
              </div>
            </div>
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      {['User', 'Email', 'Role', 'Approved', 'City', 'Joined', 'Actions'].map(h => (
                        <th key={h} className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr><td colSpan={7} className="text-center text-gray-500 py-10 text-sm">No users found</td></tr>
                    ) : filteredUsers.map(u => (
                      <tr key={u._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center font-bold text-[11px] text-teal-700 flex-shrink-0">
                              {u.name?.slice(0, 2).toUpperCase()}
                            </div>
                            <span className="font-medium text-gray-800 text-sm">{u.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-500 text-xs">{u.email}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${u.role === 'admin' ? 'bg-purple-50 text-purple-700' : 'bg-teal-50 text-teal-700'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {u.role === 'admin' ? (
                            <span className="text-xs text-gray-400">—</span>
                          ) : u.isApproved ? (
                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-600">
                              <i className="fa-solid fa-check mr-1" />Approved
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-600">
                              <i className="fa-solid fa-clock mr-1" />Pending
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-gray-400 text-xs">{u.city || '—'}</td>
                        <td className="py-3 px-4 text-xs text-gray-400">
                          {new Date(u.createdAt).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            {/* ✅ APPROVE BUTTON - Only show if not approved and not admin */}
                            {!u.isApproved && u.role !== 'admin' && (
                              <button onClick={() => approveUser(u._id)}
                                className="text-xs px-2.5 py-1 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors cursor-pointer border-0">
                                <i className="fa-solid fa-check mr-1" />Approve
                              </button>
                            )}
                            <button onClick={() => toggleRole(u)}
                              className="text-xs px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 hover:bg-teal-50 hover:text-teal-700 transition-colors cursor-pointer border-0 whitespace-nowrap">
                              Toggle Role
                            </button>
                            <button onClick={() => deleteUser(u._id)}
                              className="text-xs px-2.5 py-1 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors cursor-pointer border-0">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── ENROLLMENTS ── */}
        {tab === 'enrolls' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-gray-900">Enrollments ({enrolls.length})</h2>
            </div>
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      {['Student', 'Email', 'Course', 'Progress', 'Status', 'Date'].map(h => (
                        <th key={h} className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {enrolls.map(e => (
                      <tr key={e._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 font-medium text-gray-800">{e.user?.name}</td>
                        <td className="py-3 px-4 text-gray-400 text-xs">{e.user?.email}</td>
                        <td className="py-3 px-4 text-gray-600 text-xs">{e.course?.title}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-teal-500" style={{ width: `${e.progressPercent}%` }} />
                            </div>
                            <span className="text-xs text-gray-500">{e.progressPercent}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            e.isCompleted ? 'bg-green-50 text-green-600'
                              : e.progressPercent > 0 ? 'bg-amber-50 text-amber-600'
                                : 'bg-gray-100 text-gray-500'
                          }`}>
                            {e.isCompleted ? 'Completed' : e.progressPercent > 0 ? 'In Progress' : 'Not Started'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-xs text-gray-400">
                          {new Date(e.enrolledAt).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── SETTINGS ── */}
        {tab === 'settings' && (
          <div className="max-w-md space-y-6">
            <div className="card p-7">
              <h3 className="font-display text-xl font-bold text-gray-900 mb-2">Reset Any Password</h3>
              <p className="text-sm text-gray-500 mb-6">Use this to reset the password for any account — including admin.</p>
              <form onSubmit={resetPw} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Account Email</label>
                  <input type="email" value={pwForm.email} onChange={e => setPwForm(f => ({ ...f, email: e.target.value }))}
                    required className="input-field" placeholder="account@email.com" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">New Password</label>
                  <input type="password" value={pwForm.newPassword} onChange={e => setPwForm(f => ({ ...f, newPassword: e.target.value }))}
                    required className="input-field" placeholder="New password (min 6 chars)" minLength={6} />
                </div>
                <button type="submit" disabled={pwSaving} className="btn-primary disabled:opacity-60">
                  {pwSaving
                    ? <><i className="fa-solid fa-spinner fa-spin text-sm" />Updating...</>
                    : <><i className="fa-solid fa-key text-sm" />Update Password</>}
                </button>
              </form>
            </div>

            <div className="card p-6 bg-teal-50 border border-teal-100">
              <h4 className="font-semibold text-teal-800 mb-3 flex items-center gap-2">
                <i className="fa-solid fa-circle-info text-teal-600" />Current Admin Account
              </h4>
              <div className="space-y-1.5 text-sm">
                <p><span className="text-teal-600 font-semibold">Name:</span> <span className="text-teal-800">{user?.name}</span></p>
                <p><span className="text-teal-600 font-semibold">Email:</span> <span className="text-teal-800">{user?.email}</span></p>
                <p><span className="text-teal-600 font-semibold">Role:</span> <span className="text-teal-800 capitalize">{user?.role}</span></p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Course Modal */}
      {modal && (
        <CourseModal
          course={modal === 'add' ? null : modal}
          onSave={handleCourseSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}

export default AdminPage