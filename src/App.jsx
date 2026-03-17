import { Routes, Route } from 'react-router-dom'
import { useEffect }     from 'react'
import { useLocation }   from 'react-router-dom'
import { AuthProvider }  from './context/AuthContext'
import { ProtectedRoute, PageLoader } from './components/ui'

import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

import HomePage      from './pages/HomePage'
import CoursesPage   from './pages/CoursesPage'
import DashboardPage from './pages/DashboardPage'
import AdminPage     from './pages/AdminPage'

import { AboutPage, ContactPage }                                from './pages/StaticPages'
import { LoginPage, RegisterPage, ForgotPasswordPage, ResetPasswordPage } from './pages/AuthPages'

/* Scroll to top on route change */
const ScrollTop = () => {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top:0, behavior:'instant' }) }, [pathname])
  return null
}

/* Standard layout — navbar + main + footer */
const Layout = ({ children, noFooter = false }) => (
  <>
    <Navbar/>
    <main>{children}</main>
    {!noFooter && <Footer/>}
  </>
)

/* Auth layout — navbar only */
const AuthLayout = ({ children }) => (
  <><Navbar/>{children}</>
)

const App = () => (
  <AuthProvider>
    <ScrollTop/>
    <Routes>
      {/* Public */}
      <Route path="/"        element={<Layout><HomePage/></Layout>}    />
      <Route path="/courses" element={<Layout><CoursesPage/></Layout>} />
      <Route path="/courses/:slug" element={<Layout><CoursesPage/></Layout>} />
      <Route path="/about"   element={<Layout><AboutPage/></Layout>}   />
      <Route path="/contact" element={<Layout><ContactPage/></Layout>} />

      {/* Auth */}
      <Route path="/login"           element={<AuthLayout><LoginPage/></AuthLayout>}          />
      <Route path="/register"        element={<AuthLayout><RegisterPage/></AuthLayout>}        />
      <Route path="/forgot-password" element={<AuthLayout><ForgotPasswordPage/></AuthLayout>}  />
      <Route path="/reset-password/:token" element={<AuthLayout><ResetPasswordPage/></AuthLayout>} />

      {/* Protected — student */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout><DashboardPage/></Layout>
        </ProtectedRoute>
      }/>

      {/* Protected — admin */}
      <Route path="/admin" element={
        <ProtectedRoute adminOnly>
          <Layout noFooter><AdminPage/></Layout>
        </ProtectedRoute>
      }/>

      {/* 404 */}
      <Route path="*" element={
        <Layout>
          <div className="min-h-screen flex flex-col items-center justify-center pt-[68px] gap-5 text-center px-4">
            <div className="w-20 h-20 rounded-2xl bg-teal-50 flex items-center justify-center">
              <i className="fa-solid fa-compass text-teal-400 text-3xl"/>
            </div>
            <h1 className="font-display text-4xl font-bold text-gray-900">Page Not Found</h1>
            <p className="text-gray-500 max-w-md">The page you're looking for doesn't exist or has been moved.</p>
            <a href="/" className="btn-primary"><i className="fa-solid fa-house text-sm"/>Back to Home</a>
          </div>
        </Layout>
      }/>
    </Routes>
  </AuthProvider>
)

export default App
