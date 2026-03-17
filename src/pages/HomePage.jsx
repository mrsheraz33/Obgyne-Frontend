import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'

const useReveal = () => {
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('show') })
    }, { threshold: 0.1 })
    document.querySelectorAll('.fade-up').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}

const Counter = ({ target, suffix = '' }) => {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      let v = 0
      const t = setInterval(() => {
        v = Math.min(v + target / 60, target)
        if (el) el.textContent = Math.round(v) + suffix
        if (v >= target) clearInterval(t)
      }, 22)
      obs.disconnect()
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [target, suffix])
  return <span ref={ref}>0{suffix}</span>
}

const FEATURES = [
  { icon:'fa-video',          title:'HD Video Lectures',      desc:'Structured video lectures covering every exam topic clearly and systematically.' },
  { icon:'fa-clipboard-list', title:'Exam-Focused Content',   desc:'Every lecture built around real FCPS, MCPS & TOACS exam patterns — zero fluff.' },
  { icon:'fa-user-doctor',    title:'Expert Instructor',      desc:'Dr. Mariam — OB/GYN specialist with 15+ years of clinical & teaching experience.' },
  { icon:'fa-layer-group',    title:'Module-Based Learning',  desc:'TOACS prep organised into clear clinical modules for systematic revision.' },
  { icon:'fa-file-lines',     title:'Past Papers 2019–2026',  desc:'All past papers fully solved with model answers and detailed explanations.' },
  { icon:'fa-mobile-screen',  title:'Learn Anywhere',         desc:'Mobile, tablet or desktop — study at hospital, home, or on the go.' },
]

const STEPS = [
  { n:'01', icon:'fa-user-plus',      title:'Create Account',  desc:'Register free in under 60 seconds.' },
  { n:'02', icon:'fa-graduation-cap', title:'Choose a Course', desc:'Theory, TOACS, or Past Papers.' },
  { n:'03', icon:'fa-play-circle',    title:'Watch & Learn',   desc:'HD videos, notes, MCQs — at your pace.' },
  { n:'04', icon:'fa-trophy',         title:'Pass Your Exam',  desc:'Apply your knowledge, clear your boards.' },
]

const TESTIMONIALS = [
  { text:'"Dr. Mariam\'s TOACS course changed everything. I cleared on my first attempt. Her clinical explanations are unmatched."', name:'Dr. Ayesha K.', role:'FCPS Resident, Islamabad',  bg:'bg-teal-100   text-teal-800',   initials:'AK' },
  { text:'"The Theory Group is perfectly structured. Every lecture covers exactly what comes in the exam. Best investment I made."', name:'Dr. Nadia R.', role:'MCPS Candidate, Rawalpindi', bg:'bg-purple-100 text-purple-800', initials:'NR' },
  { text:'"Past Papers course is essential. Solved papers with Dr. Mariam\'s explanations made the exam pattern so clear."',       name:'Dr. Sana M.', role:'TOACS Candidate, Lahore',    bg:'bg-amber-100  text-amber-800',  initials:'SM' },
]

const HomePage = () => {
  useReveal()

  return (
    <div>
      {/* ═══ HERO ═══ */}
      <section className="pt-[68px] min-h-screen flex items-center relative overflow-hidden"
        style={{background:'linear-gradient(150deg,#fff 0%,#edfaf9 55%,#e4f4f2 100%)'}}>
        {/* Orbs */}
        <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full opacity-25 pointer-events-none"
          style={{background:'radial-gradient(circle,rgba(10,110,104,0.22),transparent 70%)',filter:'blur(80px)',transform:'translate(20%,-20%)'}}/>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-15 pointer-events-none"
          style={{background:'radial-gradient(circle,rgba(10,110,104,0.15),transparent 70%)',filter:'blur(60px)',transform:'translate(-30%,30%)'}}/>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left */}
            <div style={{animation:'slideUp 0.7s ease'}}>
              <div className="inline-flex items-center gap-2 bg-white border border-teal-100 rounded-full px-3 py-1.5 text-xs font-semibold text-teal-700 shadow-sm mb-6">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/>
                Now Enrolling — Theory · TOACS · Past Papers
              </div>
              <h1 className="font-display text-gray-900 leading-[1.1] mb-5"
                style={{fontSize:'clamp(2.4rem,5vw,3.8rem)',fontWeight:700}}>
                Master <em className="text-teal-600 not-italic">OB/GYN</em><br/>
                Exams with<br/>
                <em className="text-teal-600 not-italic">Confidence</em>
              </h1>
              <p className="text-[1.05rem] text-gray-500 leading-relaxed mb-8 max-w-lg">
                Expert FCPS, MCPS & TOACS preparation by <strong className="text-gray-700">Dr. Mariam</strong> — Pakistan's most trusted OB/GYN educator with 15+ years of experience.
              </p>
              <div className="flex flex-wrap gap-3 mb-10">
                <Link to="/courses"  className="btn-primary"><i className="fa-solid fa-graduation-cap text-sm"/>View All Courses</Link>
                <Link to="/about"    className="btn-outline"><i className="fa-solid fa-user-doctor text-sm"/>About Dr. Mariam</Link>
              </div>
              <div className="flex flex-wrap gap-8 pt-8 border-t border-gray-200">
                {[{t:500,s:'+',l:'Students Enrolled'},{t:98,s:'%',l:'Pass Rate'},{t:15,s:'+',l:'Years Experience'}].map((s,i)=>(
                  <div key={i}>
                    <div className="font-display text-3xl font-bold text-teal-600 leading-tight">
                      <Counter target={s.t} suffix={s.s}/>
                    </div>
                    <div className="text-xs text-gray-500 font-medium mt-0.5">{s.l}</div>
                  </div>
                ))}
                <div>
                  <div className="font-display text-3xl font-bold text-teal-600 leading-tight">4.9★</div>
                  <div className="text-xs text-gray-500 font-medium mt-0.5">Student Rating</div>
                </div>
              </div>
            </div>

            {/* Right card */}
            <div className="hidden lg:block" style={{animation:'slideUp 0.9s ease'}}>
              <div className="bg-white rounded-3xl p-6 shadow-2xl border border-gray-100">
                <div className="flex items-center gap-2 mb-5">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/>
                  <span className="text-xs font-bold text-teal-700 uppercase tracking-wide">3 Courses Available</span>
                </div>
                {[
                  {icon:'fa-book-medical', title:'Theory Group',            sub:'FCPS · MCPS · Written Exam', color:'bg-teal-50 text-teal-700',    to:'/courses/theory-group'},
                  {icon:'fa-stethoscope',  title:'TOACS Preparatory Group', sub:'All Modules — OSCE Stations', color:'bg-purple-50 text-purple-700', to:'/courses/toacs-group'},
                  {icon:'fa-file-lines',   title:'Past Papers 2019–2026',   sub:'Fully Solved with Answers',   color:'bg-emerald-50 text-emerald-700',to:'/courses/past-papers'},
                ].map((c,i)=>(
                  <Link to={c.to} key={i} className="flex items-center gap-3 p-3.5 rounded-xl bg-gray-50 hover:bg-teal-50 border border-gray-100 hover:border-teal-200 transition-all mb-2 last:mb-0 group">
                    <div className={`w-10 h-10 rounded-xl ${c.color} flex items-center justify-center flex-shrink-0`}>
                      <i className={`fa-solid ${c.icon} text-sm`}/>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-800">{c.title}</div>
                      <div className="text-xs text-gray-500">{c.sub}</div>
                    </div>
                    <i className="fa-solid fa-arrow-right text-[10px] text-gray-400 ml-auto group-hover:text-teal-600 transition-colors"/>
                  </Link>
                ))}
                <div className="mt-4 flex items-center justify-between bg-teal-50 rounded-xl p-3.5 border border-teal-100">
                  <div>
                    <div className="text-xs font-bold text-teal-700 mb-0.5">By Dr. Mariam</div>
                    <div className="text-[11px] text-teal-600">FCPS (Obs & Gynae) · 15+ Years</div>
                  </div>
                  <div className="flex gap-0.5">{[1,2,3,4,5].map(s=><i key={s} className="fa-solid fa-star text-amber-400 text-xs"/>)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ MARQUEE ═══ */}
      <div className="bg-teal-700 overflow-hidden py-3.5">
        <div className="flex gap-12 w-max animate-marquee">
          {Array(2).fill(['FCPS Part 1','MCPS Obstetrics','TOACS Preparation','Theory Group','Past Papers 2026','OSCE Practice','MCQ Bank','Expert Guidance','Dr. Mariam']).flat()
            .map((t,i)=>(
              <span key={i} className="flex items-center gap-3 text-sm font-medium text-white/80 whitespace-nowrap">
                <i className="fa-solid fa-circle text-white/30 text-[7px]"/>{t}
              </span>
            ))}
        </div>
      </div>

      {/* ═══ FEATURES ═══ */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-14 fade-up">
            <div className="section-label justify-center"><span className="w-6 h-0.5 bg-teal-600 rounded"/>Why Choose Us</div>
            <h2 className="font-display text-gray-900 leading-tight mb-4" style={{fontSize:'clamp(1.9rem,3.5vw,2.6rem)',fontWeight:700}}>
              Everything you need to pass with excellence
            </h2>
            <p className="text-gray-500 text-base leading-relaxed">Structured, exam-focused learning built for Pakistani postgraduate medical exams.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f,i)=>(
              <div key={i} className="fade-up p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-teal-200 hover:bg-teal-50/40 hover:-translate-y-1 transition-all group cursor-default"
                style={{transitionDelay:`${i*0.06}s`}}>
                <div className="w-12 h-12 rounded-xl bg-white border border-teal-100 flex items-center justify-center mb-4 shadow-sm group-hover:bg-teal-600 group-hover:border-teal-600 transition-all">
                  <i className={`fa-solid ${f.icon} text-teal-600 group-hover:text-white transition-colors text-lg`}/>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ COURSES PREVIEW ═══ */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 fade-up">
            <div>
              <div className="section-label"><span className="w-6 h-0.5 bg-teal-600 rounded"/>Our Courses</div>
              <h2 className="font-display text-gray-900 leading-tight" style={{fontSize:'clamp(1.9rem,3.5vw,2.5rem)',fontWeight:700}}>3 Expert Courses</h2>
            </div>
            <Link to="/courses" className="btn-outline text-sm px-5 py-2.5 self-start sm:self-auto">
              View All <i className="fa-solid fa-arrow-right text-xs"/>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {icon:'fa-book-medical', title:'Theory Group',            sub:'FCPS, MCPS & written exam preparation', tags:['FCPS','MCPS','Theory'],  grad:'from-teal-700 to-teal-500',     to:'/courses/theory-group',   badge:'Most Popular',  enrolled:'520+', btnCls:'btn-primary'                                    },
              {icon:'fa-stethoscope',  title:'TOACS Preparatory Group', sub:'All OSCE modules covered systematically', tags:['TOACS','OSCE','Modules'],grad:'from-purple-700 to-purple-500', to:'/courses/toacs-group',    badge:'Enrolling Now', enrolled:'380+', btnCls:'bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2 rounded-xl inline-flex items-center gap-1.5 transition-all border-0 cursor-pointer' },
              {icon:'fa-file-lines',   title:'Past Papers 2019–2026',   sub:'Fully solved papers with model answers',  tags:['2019–2026','MCQs','SAQs'],grad:'from-emerald-700 to-emerald-500',to:'/courses/past-papers', badge:'Updated 2026',  enrolled:'295+', btnCls:'bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl inline-flex items-center gap-1.5 transition-all border-0 cursor-pointer' },
            ].map((c,i)=>(
              <div key={i} className="card overflow-hidden hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300 fade-up flex flex-col"
                style={{transitionDelay:`${i*0.08}s`}}>
                <div className={`h-40 relative overflow-hidden bg-gradient-to-br ${c.grad} flex items-center justify-center`}>
                  <div className="absolute inset-0 opacity-[0.07]" style={{backgroundImage:'radial-gradient(circle,white 1px,transparent 1px)',backgroundSize:'20px 20px'}}/>
                  <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center border border-white/20 z-10">
                    <i className={`fa-solid ${c.icon} text-white text-2xl`}/>
                  </div>
                  <span className="absolute top-3 right-3 text-[11px] font-semibold text-white bg-white/20 backdrop-blur px-2.5 py-1 rounded-full border border-white/20">{c.badge}</span>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex flex-wrap gap-1.5 mb-3">{c.tags.map(t=><span key={t} className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-100">{t}</span>)}</div>
                  <h3 className="font-display font-semibold text-gray-900 mb-1.5">{c.title}</h3>
                  <p className="text-sm text-gray-500 mb-4 flex-1">{c.sub}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-500 flex items-center gap-1.5"><i className="fa-solid fa-users text-teal-500 text-[10px]"/>{c.enrolled} enrolled</span>
                    <Link to={c.to} className={c.btnCls === 'btn-primary' ? 'btn-primary text-xs px-4 py-2' : c.btnCls}>
                      <i className="fa-solid fa-arrow-right text-[10px]"/>View Course
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section className="py-16" style={{background:'linear-gradient(135deg,#074d48,#0a6e68,#1aada6)'}}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[{v:'500+',l:'Students Enrolled'},{v:'98%',l:'Pass Rate'},{v:'3',l:'Expert Courses'},{v:'4.9★',l:'Average Rating'}].map((s,i)=>(
              <div key={i} className="fade-up" style={{transitionDelay:`${i*0.08}s`}}>
                <div className="font-display font-bold text-white leading-tight mb-1" style={{fontSize:'clamp(2rem,4vw,2.8rem)'}}>{s.v}</div>
                <div className="text-sm text-white/70">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-14 fade-up">
            <div className="section-label justify-center"><span className="w-6 h-0.5 bg-teal-600 rounded"/>How It Works</div>
            <h2 className="font-display text-gray-900 leading-tight" style={{fontSize:'clamp(1.9rem,3.5vw,2.5rem)',fontWeight:700}}>
              Start learning in 4 simple steps
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((s,i)=>(
              <div key={i} className="text-center fade-up" style={{transitionDelay:`${i*0.08}s`}}>
                <div className="w-16 h-16 rounded-2xl bg-teal-50 border-2 border-teal-100 flex items-center justify-center mx-auto mb-4">
                  <i className={`fa-solid ${s.icon} text-teal-600 text-xl`}/>
                </div>
                <div className="text-xs font-bold text-teal-500 uppercase tracking-widest mb-1">{s.n}</div>
                <h4 className="font-semibold text-gray-900 mb-2">{s.title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-14 fade-up">
            <div className="section-label justify-center"><span className="w-6 h-0.5 bg-teal-600 rounded"/>Student Reviews</div>
            <h2 className="font-display text-gray-900 leading-tight mb-3" style={{fontSize:'clamp(1.9rem,3.5vw,2.5rem)',fontWeight:700}}>
              Hear from our students
            </h2>
            <p className="text-gray-500">Real feedback from doctors who cleared their exams with Dr. Mariam.</p>
          </div>

          {/* YouTube Video */}
          <div className="fade-up mb-10 max-w-2xl mx-auto">
            <div className="card overflow-hidden">
              <div className="bg-gray-900 flex items-center gap-2 px-4 py-3 border-b border-gray-800">
                <span className="w-3 h-3 rounded-full bg-red-500"/>
                <span className="w-3 h-3 rounded-full bg-yellow-500"/>
                <span className="w-3 h-3 rounded-full bg-green-500"/>
                <span className="text-xs text-gray-500 ml-2">Student Review — OBGyne Simplified</span>
              </div>
              <div className="aspect-video">
                <iframe
                  src="https://www.youtube.com/embed/DkD2TdFI7Mg"
                  title="Student Review"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>

          {/* Voice Notes */}
          <div className="fade-up mb-12">
            <div className="text-center mb-6">
              <span className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-widest">
                <i className="fa-solid fa-microphone text-teal-600"/>Voice Compliments from Students
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl mx-auto">
              {[
                {file:'/voice1.mp3', name:'Dr. Fatima',  role:'FCPS Candidate, Lahore',   initials:'DF', bg:'bg-teal-100 text-teal-800'  },
                {file:'/voice2.mp3', name:'Dr. Sara',    role:'TOACS Candidate, Karachi',  initials:'DS', bg:'bg-purple-100 text-purple-800'},
              ].map((v,i)=>(
                <div key={i} className="card p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-full ${v.bg} flex items-center justify-center font-bold text-sm flex-shrink-0`}>{v.initials}</div>
                    <div>
                      <div className="text-sm font-semibold text-gray-800">{v.name}</div>
                      <div className="text-xs text-gray-500">{v.role}</div>
                    </div>
                    <div className="ml-auto flex gap-0.5">{[1,2,3,4,5].map(s=><i key={s} className="fa-solid fa-star text-amber-400 text-[10px]"/>)}</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                      <i className="fa-solid fa-volume-high text-teal-600 text-xs"/>
                      <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Voice Message</span>
                    </div>
                    <audio controls className="w-full" style={{height:'36px'}}>
                      <source src={v.file} type="audio/mpeg"/>
                    </audio>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Text Reviews */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t,i)=>(
              <div key={i} className="card p-6 hover:-translate-y-1 transition-all fade-up" style={{transitionDelay:`${i*0.08}s`}}>
                <div className="flex gap-0.5 mb-4">{[1,2,3,4,5].map(s=><i key={s} className="fa-solid fa-star text-amber-400 text-xs"/>)}</div>
                <p className="text-sm text-gray-600 leading-relaxed italic mb-5">{t.text}</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${t.bg} flex items-center justify-center font-bold text-sm flex-shrink-0`}>{t.initials}</div>
                  <div>
                    <div className="text-sm font-semibold text-gray-800">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-24 relative overflow-hidden" style={{background:'linear-gradient(145deg,#074d48,#0a6e68)'}}>
        <div className="absolute inset-0 opacity-[0.05]" style={{backgroundImage:'radial-gradient(circle,white 1px,transparent 1px)',backgroundSize:'28px 28px'}}/>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <h2 className="font-display font-bold text-white leading-tight mb-5" style={{fontSize:'clamp(1.9rem,4vw,2.8rem)'}}>
            Ready to ace your OB/GYN exam?
          </h2>
          <p className="text-white/75 text-base leading-relaxed mb-9">
            Join 500+ doctors who have already started. Enroll in Dr. Mariam's courses today.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/courses"  className="btn-white"><i className="fa-solid fa-graduation-cap text-sm"/>Browse Courses</Link>
            <Link to="/register" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white border-2 border-white/30 hover:bg-white/10 transition-all">
              <i className="fa-solid fa-user-plus text-sm"/>Register Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
