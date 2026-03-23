import { Link } from 'react-router-dom'

const SOCIALS = [
  { icon:'fa-brands fa-whatsapp',   href:'https://wa.me/03172876305',                                           label:'WhatsApp'  },
  { icon:'fa-brands fa-youtube',    href:'https://youtube.com/@obsgynesimplified?si=jyWT_X8A0WBEerty',          label:'YouTube'   },
  { icon:'fa-brands fa-facebook-f', href:'https://www.facebook.com/share/16osYBK14h/',                          label:'Facebook'  },
  { icon:'fa-brands fa-instagram',  href:'https://www.instagram.com/obsgynesimplified?igsh=N28wazRpc2ZsbG9m',   label:'Instagram' },
]

const Footer = () => (
  <footer className="bg-gray-900 text-gray-400">
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      {/* Top */}
      <div className="py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 border-b border-white/10">

        {/* Brand */}
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-600 to-teal-500 flex items-center justify-center">
              <i className="fa-solid fa-stethoscope text-white text-sm"/>
            </div>
            <div>
              <div className="font-display font-semibold text-[1.05rem] text-white leading-none">OBSGyne</div>
              <div className="text-[9px] font-bold text-teal-400 uppercase tracking-widest">Simplified</div>
            </div>
          </div>
          <p className="text-sm leading-relaxed mb-5 text-gray-500 max-w-xs">
            Pakistan's trusted OBS/Gyne exam prep for FCPS, MCPS & TOACS by Dr. Mariam.
          </p>
          <div className="flex gap-2">
            {SOCIALS.map((s,i) => (
              <a key={i} href={s.href} target="_blank" rel="noreferrer" title={s.label}
                className="w-9 h-9 rounded-lg bg-white/6 border border-white/10 flex items-center justify-center text-sm text-gray-500 hover:bg-teal-600 hover:text-white hover:border-teal-600 transition-all">
                <i className={s.icon}/>
              </a>
            ))}
          </div>
        </div>

        {/* Courses */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-5">Courses</h4>
          <ul className="space-y-3">
            {[
              { label:'Theory Group',           to:'/courses/theory-group'  },
              { label:'TOACS Preparatory Group', to:'/courses/toacs-group'   },
              { label:'Past Papers 2019–2026',  to:'/courses/past-papers'   },
            ].map((l,i) => (
              <li key={i}>
                <Link to={l.to} className="text-sm text-gray-500 hover:text-teal-400 transition-colors">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Platform */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-5">Platform</h4>
          <ul className="space-y-3">
            {[
              { label:'Home',             to:'/'          },
              { label:'About Dr. Mariam', to:'/about'     },
              { label:'Contact Us',       to:'/contact'   },
              { label:'My Dashboard',     to:'/dashboard' },
            ].map((l,i) => (
              <li key={i}>
                <Link to={l.to} className="text-sm text-gray-500 hover:text-teal-400 transition-colors">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-5">Contact</h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-2.5">
              <i className="fa-brands fa-whatsapp text-teal-500 mt-0.5 flex-shrink-0 text-sm"/>
              <a href="https://wa.me/03172876305" target="_blank" rel="noreferrer"
                className="text-sm text-gray-500 hover:text-teal-400 transition-colors">+92 317 2876305</a>
            </li>
            <li className="flex items-start gap-2.5">
              <i className="fa-regular fa-envelope text-teal-500 mt-0.5 flex-shrink-0 text-sm"/>
              <a href="mailto:gyneoobs@gmail.com"
                className="text-sm text-gray-500 hover:text-teal-400 transition-colors">gyneoobs@gmail.com</a>
            </li>
            <li className="flex items-start gap-2.5">
              <i className="fa-solid fa-location-dot text-teal-500 mt-0.5 flex-shrink-0 text-sm"/>
              <span className="text-sm text-gray-500">Pakistan</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="py-5 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-600">
        <span>© {new Date().getFullYear()} OBSGyne Simplified. All rights reserved.</span>
        <span>Made with for Pakistan's medical community</span>
      </div>
    </div>
  </footer>
)

export default Footer
