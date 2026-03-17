import { useState } from 'react'
import { Link }      from 'react-router-dom'
import toast         from 'react-hot-toast'

/* ════════════════════════
   ABOUT PAGE
════════════════════════ */
const TIMELINE = [
  { year:'MBBS',  title:'Bachelor of Medicine & Surgery',      desc:'Graduated from a leading Pakistani medical college with distinction in OB/GYN.' },
  { year:'MCPS',  title:'MCPS — CPSP Pakistan',                desc:'Cleared MCPS (Obstetrics & Gynaecology) from the College of Physicians & Surgeons Pakistan.' },
  { year:'FCPS',  title:'FCPS — CPSP Pakistan',                desc:'Obtained FCPS (Obstetrics & Gynaecology) after intensive postgraduate training.' },
  { year:'2024',  title:'Founded OBGyne Simplified',           desc:'Launched a dedicated platform to make high-quality OB/GYN exam preparation accessible for every doctor in Pakistan.' },
]

export const AboutPage = () => (
  <div className="pt-[68px]">
    {/* Hero */}
    <div className="py-16 text-center" style={{background:'linear-gradient(135deg,#fff 0%,#edfaf9 100%)'}}>
      <div className="max-w-xl mx-auto px-4">
        <div className="section-label justify-center mb-3"><span className="w-6 h-0.5 bg-teal-600 rounded"/>About</div>
        <h1 className="font-display font-bold text-gray-900 mb-4" style={{fontSize:'clamp(2rem,4vw,2.8rem)'}}>Meet Dr. Mariam</h1>
        <p className="text-gray-500 leading-relaxed">Pakistan's trusted OB/GYN educator — 15+ years helping doctors clear FCPS, MCPS & TOACS.</p>
      </div>
    </div>

    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left visual */}
          <div>
            <div className="aspect-[4/5] max-w-sm rounded-3xl overflow-hidden relative flex items-center justify-center border border-teal-100 shadow-xl"
              style={{background:'linear-gradient(145deg,#edfaf9,#d1f4f2)'}}>
              <span className="font-display font-bold text-teal-600/15 select-none" style={{fontSize:'clamp(6rem,15vw,9rem)'}}>DM</span>
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-white rounded-2xl px-5 py-3 text-center shadow-lg border border-gray-100 whitespace-nowrap">
                <div className="font-display font-semibold text-gray-900">Dr. Mariam</div>
                <div className="text-xs text-gray-500 mt-0.5">FCPS (Obs & Gynae) · Medical Educator</div>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {[
                {icon:'fa-trophy',  val:'FCPS',   label:'Qualified'  },
                {icon:'fa-calendar',val:'15+',    label:'Years Exp.' },
                {icon:'fa-users',   val:'500+',   label:'Students'   },
              ].map((f,i) => (
                <div key={i} className="card p-3.5 text-center">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center mx-auto mb-2">
                    <i className={`fa-solid ${f.icon} text-teal-600`}/>
                  </div>
                  <div className="text-sm font-bold text-gray-900">{f.val}</div>
                  <div className="text-xs text-gray-500">{f.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right bio */}
          <div>
            <div className="section-label mb-4"><span className="w-6 h-0.5 bg-teal-600 rounded"/>Biography</div>
            <h2 className="font-display font-bold text-gray-900 mb-5 leading-tight" style={{fontSize:'clamp(1.7rem,3vw,2.3rem)'}}>
              Dedicated to making OB/GYN education accessible
            </h2>
            <div className="space-y-4 text-sm text-gray-600 leading-relaxed mb-8">
              <p>Dr. Mariam is a highly qualified Obstetrician and Gynaecologist with FCPS and MCPS from CPSP Pakistan. With over 15 years of clinical and academic experience, she has helped hundreds of postgraduate doctors clear their board examinations.</p>
              <p>Her teaching philosophy is simple — make complex topics clear, relatable, and exam-ready. She founded OBGyne Simplified to democratise high-quality OB/GYN exam preparation for every doctor in Pakistan.</p>
            </div>

            <ul className="space-y-2.5 mb-8">
              {[
                'FCPS (Obstetrics & Gynaecology) — CPSP Pakistan',
                'MCPS (Obstetrics & Gynaecology) — CPSP Pakistan',
                '15+ Years Clinical & Academic Practice',
                '500+ Students Mentored Successfully',
                'Theory Group · TOACS Group · Past Papers',
              ].map((q,i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                  <i className="fa-solid fa-circle-check text-teal-600 flex-shrink-0 mt-0.5"/>{q}
                </li>
              ))}
            </ul>

            <h3 className="font-semibold text-gray-900 mb-5">Academic Journey</h3>
            <div className="relative pl-7 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-teal-600 before:to-teal-100">
              {TIMELINE.map((t,i) => (
                <div key={i} className="relative mb-6 last:mb-0">
                  <div className="absolute -left-[19px] top-1 w-3 h-3 rounded-full bg-teal-600 ring-4 ring-teal-50 border-2 border-white"/>
                  <div className="text-[11px] font-bold text-teal-600 uppercase tracking-widest mb-0.5">{t.year}</div>
                  <div className="font-semibold text-gray-900 mb-1">{t.title}</div>
                  <div className="text-sm text-gray-500 leading-relaxed">{t.desc}</div>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Link to="/courses" className="btn-primary">
                <i className="fa-solid fa-graduation-cap text-sm"/>Explore Her Courses
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
)

/* ════════════════════════
   CONTACT PAGE
════════════════════════ */
const SOCIALS = [
  {icon:'fa-brands fa-whatsapp',   href:'https://wa.me/03172876305',                                          label:'WhatsApp',  val:'+92 317 2876305'  },
  {icon:'fa-brands fa-youtube',    href:'https://youtube.com/@obsgynesimplified?si=jyWT_X8A0WBEerty',         label:'YouTube',   val:'@obsgynesimplified'},
  {icon:'fa-brands fa-facebook-f', href:'https://www.facebook.com/share/16osYBK14h/',                         label:'Facebook',  val:'OBGyne Simplified' },
  {icon:'fa-brands fa-instagram',  href:'https://www.instagram.com/obsgynesimplified?igsh=N28wazRpc2ZsbG9m', label:'Instagram', val:'@obsgynesimplified'},
]

export const ContactPage = () => {
  const [form,    setForm]    = useState({ firstName:'', lastName:'', email:'', course:'', message:'' })
  const [loading, setLoading] = useState(false)
  const [sent,    setSent]    = useState(false)

const handle = async e => {
  e.preventDefault()
  setLoading(true)

  // WhatsApp pe message bhejo
  const msg = encodeURIComponent(
    `*New Message — OBGyne Simplified*\n\n` +
    `Name: ${form.firstName} ${form.lastName}\n` +
    `Email: ${form.email}\n` +
    `Course: ${form.course || 'Not specified'}\n` +
    `Message: ${form.message}`
  )

  window.open(`https://wa.me/923172876305?text=${msg}`, '_blank')

  setLoading(false)
  setSent(true)
  toast.success('Redirecting to WhatsApp!')
}

  return (
    <div className="pt-[68px]">
      <div className="py-16 text-center" style={{background:'linear-gradient(135deg,#fff 0%,#edfaf9 100%)'}}>
        <div className="max-w-xl mx-auto px-4">
          <div className="section-label justify-center mb-3"><span className="w-6 h-0.5 bg-teal-600 rounded"/>Contact</div>
          <h1 className="font-display font-bold text-gray-900 mb-4" style={{fontSize:'clamp(2rem,4vw,2.8rem)'}}>Get in Touch</h1>
          <p className="text-gray-500 leading-relaxed">Questions about courses or enrollment? We reply within 24 hours.</p>
        </div>
      </div>

      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">

            {/* Left info */}
            <div className="lg:col-span-2">
              <div className="section-label mb-3"><span className="w-6 h-0.5 bg-teal-600 rounded"/>Reach Out</div>
              <h3 className="font-display text-2xl font-bold text-gray-900 mb-3">We're here to help you succeed</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-7">
                Reach out for guidance on courses, enrollment, or exam preparation. Dr. Mariam and her team are happy to help.
              </p>
              <div className="space-y-3">
                {SOCIALS.map((s,i) => (
                  <a key={i} href={s.href} target="_blank" rel="noreferrer"
                    className="flex items-center gap-3 p-3.5 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-teal-200 hover:bg-teal-50 transition-all group">
                    <div className="w-9 h-9 rounded-xl bg-teal-50 group-hover:bg-teal-100 flex items-center justify-center flex-shrink-0 transition-colors">
                      <i className={`${s.icon} text-teal-600 text-sm`}/>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{s.label}</div>
                      <div className="text-sm font-medium text-gray-700">{s.val}</div>
                    </div>
                    <i className="fa-solid fa-arrow-up-right-from-square text-gray-300 ml-auto text-xs group-hover:text-teal-500 transition-colors"/>
                  </a>
                ))}
                <div className="flex items-center gap-3 p-3.5 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
                    <i className="fa-regular fa-envelope text-teal-600 text-sm"/>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email</div>
                    <div className="text-sm font-medium text-gray-700">gyneoobs@gmail.com</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right form */}
            <div className="lg:col-span-3 card p-7">
              <h3 className="font-display text-xl font-bold text-gray-900 mb-6">Send a Message</h3>
              {sent ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto">
                    <i className="fa-solid fa-circle-check text-green-500 text-3xl"/>
                  </div>
                  <h4 className="font-semibold text-gray-900">Message Sent!</h4>
                  <p className="text-sm text-gray-500">We'll get back to you within 24 hours.</p>
                  <button onClick={()=>{setSent(false);setForm({firstName:'',lastName:'',email:'',course:'',message:''})}}
                    className="btn-outline text-sm cursor-pointer">Send Another Message</button>
                </div>
              ) : (
                <form onSubmit={handle} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">First Name *</label>
                      <input type="text" value={form.firstName} onChange={e=>setForm(f=>({...f,firstName:e.target.value}))}
                        required className="input-field" placeholder="Dr. Sara"/>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Last Name *</label>
                      <input type="text" value={form.lastName} onChange={e=>setForm(f=>({...f,lastName:e.target.value}))}
                        required className="input-field" placeholder="Ahmed"/>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Email Address *</label>
                    <input type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}
                      required className="input-field" placeholder="you@example.com"/>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Interested In</label>
                    <select value={form.course} onChange={e=>setForm(f=>({...f,course:e.target.value}))} className="input-field">
                      <option value="">Select a course...</option>
                      <option>Theory Group</option>
                      <option>TOACS Preparatory Group</option>
                      <option>Past Papers 2019–2026</option>
                      <option>General Inquiry</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Message *</label>
                    <textarea value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))}
                      required rows={4} className="input-field resize-none" placeholder="Tell us about your exam goals..."/>
                  </div>
                  <button type="submit" disabled={loading}
                    className="btn-primary w-full justify-center disabled:opacity-60">
                    {loading
                      ? <><i className="fa-solid fa-spinner fa-spin text-sm"/>Sending...</>
                      : <><i className="fa-solid fa-paper-plane text-sm"/>Send Message</>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
