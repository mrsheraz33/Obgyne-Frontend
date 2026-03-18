# OBGyne Simplified — Frontend

## Tech Stack
- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Notifications:** React Hot Toast

---

## Quick Start

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
App runs on: **http://localhost:5173**

### 3. Build for Production
```bash
npm run build
```

### 4. Preview Production Build
```bash
npm run preview
```

---

## Environment Variables

### Development
No `.env` needed — Vite proxy handles API calls automatically.
```js
// vite.config.js — already configured
server: { proxy: { '/api': 'http://localhost:5000' } }
```

### Production (Vercel)
Add this in Vercel Dashboard → Settings → Environment Variables:
```env
VITE_API_URL=https://obgyne-backend.onrender.com/api
```

Then update `src/api/index.js`:
```js
const api = axios.create({
  baseURL: 'https://obgyne-backend.onrender.com/api',
  withCredentials: true
})
```

---

## Project Structure
```
frontend/
├── public/
│   ├── logo.jpeg          # Site logo — replace with actual logo
│   ├── voice1.mp3         # Student voice testimonial 1
│   └── voice2.mp3         # Student voice testimonial 2
├── src/
│   ├── api/
│   │   └── index.js       # Axios instance + interceptors
│   ├── context/
│   │   └── AuthContext.jsx # Global auth state
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx  # Navigation bar
│   │   │   └── Footer.jsx  # Footer with social links
│   │   └── ui/
│   │       └── index.jsx   # Spinner, CourseCard, StatCard, ProtectedRoute
│   ├── pages/
│   │   ├── HomePage.jsx    # Landing page
│   │   ├── CoursesPage.jsx # Courses with module accordion
│   │   ├── DashboardPage.jsx # Student dashboard
│   │   ├── AdminPage.jsx   # Admin panel
│   │   ├── AuthPages.jsx   # Login, Register, Forgot/Reset Password
│   │   └── StaticPages.jsx # About, Contact
│   ├── App.jsx             # Router + all routes
│   ├── main.jsx            # React entry point
│   └── index.css           # Global styles + Tailwind
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## Pages & Routes

| Route | Page | Access |
|-------|------|--------|
| `/` | HomePage | Public |
| `/courses` | CoursesPage | Public |
| `/courses/:slug` | CoursesPage (specific) | Public |
| `/about` | AboutPage | Public |
| `/contact` | ContactPage | Public |
| `/login` | LoginPage | Public |
| `/register` | RegisterPage | Public |
| `/forgot-password` | ForgotPasswordPage | Public |
| `/reset-password/:token` | ResetPasswordPage | Public |
| `/dashboard` | DashboardPage | Students only |
| `/admin` | AdminPage | Admin only |

---

## Key Features

### Homepage
- Animated hero with counter stats
- Marquee tech strip
- 6 feature cards
- 3 course preview cards
- Stats banner
- How it works (4 steps)
- Testimonials with YouTube video + voice notes
- CTA section
- **Floating WhatsApp button** (bottom right)

### Courses Page
- Course selector tabs
- **Module accordion** for TOACS (expandable)
- Flat lesson list for Theory + Past Papers
- **PKR 1,000 fee** display
- **EasyPaisa payment** button
- 4-step enrollment guide
- WhatsApp payment screenshot button

### Dashboard (Students)
- Enrolled courses with progress bars
- Profile update form

### Admin Panel
- Overview stats
- **Full Course CRUD** — Add, Edit, Delete courses
- Users management — Toggle role, Delete
- Enrollments table
- Settings — Reset any account password

---

## Social Links (Already Configured)
| Platform | Link |
|----------|------|
| WhatsApp | https://wa.me/923172876305 |
| YouTube | https://youtube.com/@obsgynesimplified |
| Facebook | https://www.facebook.com/share/16osYBK14h/ |
| Instagram | https://www.instagram.com/obsgynesimplified |

---

## Files to Add in `public/` Folder
```
public/
├── logo.jpeg     ✅ Already added
├── voice1.mp3    ← Add WhatsApp voice note 1
└── voice2.mp3    ← Add WhatsApp voice note 2
```

---

## Color Scheme
| Element | Color |
|---------|-------|
| Primary buttons | Green `#16a34a` |
| Logo "OBS" text | Green `#15803d` |
| Logo "Simplified" | Purple `#9333ea` |
| Tagline | Gray italic |
| Background | White / Light gray |

---

## Deployment on Vercel

### Steps
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import repository
4. Set root directory: `frontend`
5. Framework preset: **Vite**
6. Add environment variable:
   ```
   VITE_API_URL = https://obgyne-backend.onrender.com/api
   ```
7. Deploy!

### After Deploy
Update backend `CLIENT_URL`:
```env
CLIENT_URL=https://your-app.vercel.app
```

---

## Common Issues & Fixes

### API not connecting in production
**Fix:** Make sure `VITE_API_URL` is set in Vercel environment variables and matches your Render backend URL exactly.

### Voice notes not playing
**Fix:** Make sure `voice1.mp3` and `voice2.mp3` are in `frontend/public/` folder.

### Logo not showing
**Fix:** Make sure `logo.jpeg` is in `frontend/public/` folder.

### Login not working after deploy
**Fix:** Check that `CLIENT_URL` in Render backend environment variables matches your Vercel frontend URL.

### Courses not loading
**Fix:** Backend on Render free tier sleeps after 15 min inactivity — first request takes 30-60 seconds to wake up. This is normal on free tier.
