import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api'
import { useAuth } from '../context/AuthContext'
import { Spinner } from '../components/ui'
import toast from 'react-hot-toast'

/* Module Accordion for TOACS */
const ModuleAccordion = ({ modules }) => {
  const [open, setOpen] = useState(0)
  return (
    <div className="space-y-2">
      {modules.map((mod, i) => (
        <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
          <button onClick={() => setOpen(open === i ? -1 : i)}
            className="w-full flex items-center justify-between px-4 py-3.5 bg-gray-50 hover:bg-teal-50 transition-colors text-left cursor-pointer border-0">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-700 text-xs font-bold flex items-center justify-center flex-shrink-0">{i+1}</span>
              <span className="text-sm font-semibold text-gray-800">{mod.title}</span>
              <span className="text-xs text-gray-400">({mod.lessons?.length || 0} lessons)</span>
            </div>
            <i className={`fa-solid fa-chevron-down text-gray-400 text-xs transition-transform ${open===i?'rotate-180':''}`}/>
          </button>
          {open === i && (
            <div className="divide-y divide-gray-100">
              {mod.lessons?.map((l, j) => (
                <div key={j} className="flex items-center gap-3 px-4 py-3 bg-white hover:bg-gray-50 transition-colors">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${l.isFree?'bg-green-50':'bg-gray-100'}`}>
                    <i className={`fa-solid ${l.isFree?'fa-play text-green-600':'fa-lock text-gray-400'} text-[10px]`}/>
                  </div>
                  <span className="text-sm text-gray-700 flex-1">{l.title}</span>
                  <span className="text-xs text-gray-400 flex-shrink-0">{l.duration}</span>
                  {l.isFree && <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-200 flex-shrink-0">FREE</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

/* Flat lesson list */
const LessonList = ({ lessons }) => {
  const [showAll, setShowAll] = useState(false)
  const visible = showAll ? lessons : lessons.slice(0, 6)
  return (
    <div>
      <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
        {visible.map((l, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3 bg-white hover:bg-gray-50 transition-colors">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${l.isFree?'bg-green-50':'bg-gray-100'}`}>
              <i className={`fa-solid ${l.isFree?'fa-play text-green-600':'fa-lock text-gray-400'} text-[10px]`}/>
            </div>
            <span className="text-sm text-gray-700 flex-1">{l.title}</span>
            <span className="text-xs text-gray-400 flex-shrink-0">{l.duration}</span>
            {l.isFree && <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-200 flex-shrink-0">FREE</span>}
          </div>
        ))}
      </div>
      {lessons.length > 6 && (
        <button onClick={() => setShowAll(s=>!s)}
          className="mt-3 text-sm text-teal-600 font-semibold hover:underline cursor-pointer border-0 bg-transparent">
          {showAll ? '↑ Show less' : `↓ Show all ${lessons.length} lessons`}
        </button>
      )}
    </div>
  )
}

/* Full course detail card */
const CourseDetail = ({ course, enrolled, progress, onEnroll, enrolling }) => {
  const [tab, setTab] = useState('overview')
  const grad = course.colorTheme==='purple' ? 'from-purple-700 to-purple-500'
             : course.colorTheme==='green'  ? 'from-emerald-700 to-emerald-500'
             : 'from-teal-700 to-teal-500'
  const btnCls = course.colorTheme==='purple' ? 'bg-purple-600 hover:bg-purple-700'
               : course.colorTheme==='green'  ? 'bg-emerald-600 hover:bg-emerald-700'
               : 'bg-teal-600 hover:bg-teal-700'

  const totalLessons = course.hasModules
    ? (course.modules||[]).reduce((s,m) => s+(m.lessons?.length||0), 0)
    : (course.lessons?.length||0)

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className={`bg-gradient-to-br ${grad} p-7 relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-[0.07]" style={{backgroundImage:'radial-gradient(circle,white 1px,transparent 1px)',backgroundSize:'20px 20px'}}/>
        <div className="relative z-10">
          <span className="text-[11px] font-semibold text-white/80 bg-white/15 px-2.5 py-1 rounded-full border border-white/20">{course.badge}</span>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white mt-3 mb-2">{course.title}</h2>
          <p className="text-white/75 text-sm md:text-base leading-relaxed mb-4">{course.shortDesc}</p>
          <div className="flex flex-wrap gap-4 text-xs text-white/70">
            <span><i className="fa-solid fa-users mr-1.5"/>{course.enrollmentCount}+ enrolled</span>
            <span><i className="fa-solid fa-star text-amber-400 mr-1.5"/>{course.rating} ({course.totalReviews} reviews)</span>
            <span><i className="fa-solid fa-book mr-1.5"/>{totalLessons} lessons</span>
            <span><i className="fa-solid fa-language mr-1.5"/>{course.language}</span>
            <span><i className="fa-solid fa-signal mr-1.5"/>{course.level}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 bg-gray-50 overflow-x-auto">
        {['Overview','Curriculum','Instructor'].map(t=>(
          <button key={t} onClick={()=>setTab(t.toLowerCase())}
            className={`px-5 py-3 text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer border-0
              ${tab===t.toLowerCase() ? 'text-teal-700 border-b-2 border-teal-600 bg-white' : 'text-gray-500 hover:text-gray-700 bg-transparent'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="p-6">
        {/* Overview */}
        {tab === 'overview' && (
          <div>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">{course.description}</p>
            {course.whatYouLearn?.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <i className="fa-solid fa-circle-check text-teal-600 text-sm"/>What you'll learn
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {course.whatYouLearn.map((w,i)=>(
                    <div key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <i className="fa-solid fa-check text-teal-600 mt-0.5 flex-shrink-0 text-xs"/>{w}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {course.requirements?.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <i className="fa-solid fa-list-check text-gray-400 text-sm"/>Requirements
                </h4>
                <ul className="space-y-1.5">
                  {course.requirements.map((r,i)=>(
                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-500">
                      <i className="fa-solid fa-circle text-gray-300 mt-1.5 text-[6px] flex-shrink-0"/>{r}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Curriculum */}
        {tab === 'curriculum' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-800">Course Curriculum</h4>
              <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">{totalLessons} total lessons</span>
            </div>
            {course.hasModules && course.modules?.length > 0
              ? <ModuleAccordion modules={course.modules}/>
              : <LessonList lessons={course.lessons||[]}/>
            }
          </div>
        )}

        {/* Instructor */}
        {tab === 'instructor' && (
          <div className="flex gap-5">
            <div className="w-16 h-16 rounded-2xl bg-teal-50 flex items-center justify-center font-display font-bold text-xl text-teal-700 flex-shrink-0 border border-teal-100">DM</div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1 text-lg">Dr. Mariam</h4>
              <p className="text-sm text-teal-600 font-semibold mb-3">FCPS (Obs & Gynae) · Senior Consultant</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Dr. Mariam is a highly qualified OB/GYN specialist with FCPS & MCPS from CPSP Pakistan, and 15+ years of clinical and academic experience. She has helped 500+ doctors clear FCPS, MCPS and TOACS examinations across Pakistan.
              </p>
              <div className="flex flex-wrap gap-3 mt-4">
                {[
                  {icon:'fa-trophy',  text:'FCPS Qualified'},
                  {icon:'fa-users',   text:'500+ Students'},
                  {icon:'fa-star',    text:'4.9 Rating'},
                ].map((b,i)=>(
                  <span key={i} className="flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50 px-3 py-1.5 rounded-full border border-teal-100">
                    <i className={`fa-solid ${b.icon} text-[10px]`}/>{b.text}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Enroll CTA */}
        <div className="mt-6 pt-5 border-t border-gray-100">
          {enrolled ? (
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-teal-500 rounded-full transition-all" style={{width:`${progress}%`}}/>
              </div>
              <span className="text-sm font-bold text-teal-600 flex-shrink-0">{progress}% complete</span>
              <span className="text-xs font-semibold text-green-600 flex items-center gap-1 flex-shrink-0">
                <i className="fa-solid fa-circle-check"/>Enrolled
              </span>
            </div>
          ) : (
            <button onClick={onEnroll} disabled={enrolling}
              className={`w-full py-4 rounded-xl text-white font-bold text-sm ${btnCls} transition-all flex items-center justify-center gap-2 shadow-md hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer border-0`}>
              {enrolling
                ? <><i className="fa-solid fa-spinner fa-spin text-sm"/>Enrolling...</>
                : <><i className="fa-solid fa-graduation-cap text-sm"/>Enroll in This Course — Free</>
              }
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

const CoursesPage = () => {
  const { user } = useAuth()
  const navigate  = useNavigate()
  const { slug }  = useParams()
  const [courses,     setCourses]     = useState([])
  const [enrollments, setEnrollments] = useState([])
  const [loading,     setLoading]     = useState(true)
  const [enrollingId, setEnrollingId] = useState(null)
  const [activeSlug,  setActiveSlug]  = useState(slug || null)

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/courses')
        setCourses(data.courses)
        if (!activeSlug && data.courses.length > 0) setActiveSlug(data.courses[0].slug)
        if (user) {
          const { data: ed } = await api.get('/enrollments/my')
          setEnrollments(ed.enrollments)
        }
      } catch { toast.error('Failed to load courses') }
      finally  { setLoading(false) }
    }
    load()
  }, [user])

  const handleEnroll = async (courseId) => {
    if (!user) { navigate('/register'); return }
    setEnrollingId(courseId)
    try {
      await api.post(`/enrollments/${courseId}`)
      toast.success('Successfully enrolled! 🎉')
      const { data } = await api.get('/enrollments/my')
      setEnrollments(data.enrollments)
    } catch (err) {
      const msg = err.response?.data?.message || 'Enrollment failed'
      if (msg === 'Already enrolled in this course') toast.success('You are already enrolled!')
      else toast.error(msg)
    } finally { setEnrollingId(null) }
  }

  const isEnrolled  = id => enrollments.some(e => e.course?._id === id)
  const getProgress = id => enrollments.find(e => e.course?._id === id)?.progressPercent || 0
  const activeCourse = courses.find(c => c.slug === activeSlug)

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-[68px]"><Spinner size="lg"/></div>
  )

  return (
    <div className="pt-[68px]">
      {/* Page hero */}
      <div className="py-14 text-center" style={{background:'linear-gradient(135deg,#fff 0%,#edfaf9 100%)'}}>
        <div className="max-w-xl mx-auto px-4">
          <div className="section-label justify-center mb-3"><span className="w-6 h-0.5 bg-teal-600 rounded"/>All Courses</div>
          <h1 className="font-display font-bold text-gray-900 mb-4" style={{fontSize:'clamp(2rem,4vw,2.8rem)'}}>
            3 Expert OB/GYN Courses
          </h1>
          <p className="text-gray-500 leading-relaxed">FCPS · MCPS · TOACS preparation by Dr. Mariam</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Course selector tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          {courses.map(c => (
            <button key={c.slug} onClick={() => setActiveSlug(c.slug)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border cursor-pointer ${
                activeSlug === c.slug
                  ? 'bg-teal-600 text-white border-teal-600 shadow-md'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-teal-300 hover:text-teal-700'
              }`}>
              <i className={`fa-solid ${c.iconClass} text-xs`}/>{c.title}
              {isEnrolled(c._id) && <i className="fa-solid fa-circle-check text-green-400 text-[10px]"/>}
            </button>
          ))}
        </div>

        {/* Active course */}
        {activeCourse && (
          <CourseDetail
            course={activeCourse}
            enrolled={isEnrolled(activeCourse._id)}
            progress={getProgress(activeCourse._id)}
            onEnroll={() => handleEnroll(activeCourse._id)}
            enrolling={enrollingId === activeCourse._id}
          />
        )}
      </div>
    </div>
  )
}

export default CoursesPage
