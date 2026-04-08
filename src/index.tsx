import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { renderer } from './renderer'
import type { HonoEnv } from './types'
import casesRoutes from './routes/cases'
import blogsRoutes from './routes/blogs'
import noticesRoutes from './routes/notices'
import uploadRoutes from './routes/upload'
import authRoutes, { requireAdmin } from './routes/auth'
import usersRoutes from './routes/users'
import { mainPage } from './pages/main'
import { casesPage, caseDetailPage } from './pages/cases'
import { blogsPage, blogDetailPage } from './pages/blogs'
import { noticesPage, noticeDetailPage } from './pages/notices'
import { adminPage } from './pages/admin'
import { faqPage } from './pages/faq'
import { signupPage } from './pages/signup'
import { loginPage } from './pages/login'
import faqRoutes from './routes/faq'

const app = new Hono<HonoEnv>()

app.use(renderer)
app.use('/api/*', cors())

// === Auth routes (login/logout/check - no auth required) ===
app.route('', authRoutes)

// === User routes (register/login/logout/check) ===
app.route('', usersRoutes)

// === Upload routes (auth handled per-route) ===
app.route('', uploadRoutes)

// === Admin auth middleware for admin API routes ===
app.use('/api/admin/cases/*', requireAdmin())
app.use('/api/admin/cases', requireAdmin())
app.use('/api/admin/blogs/*', requireAdmin())
app.use('/api/admin/blogs', requireAdmin())
app.use('/api/admin/notices/*', requireAdmin())
app.use('/api/admin/notices', requireAdmin())
app.use('/api/admin/faq/*', requireAdmin())
app.use('/api/admin/faq', requireAdmin())
app.use('/api/admin/users', requireAdmin())
app.use('/api/admin/users/*', requireAdmin())
app.use('/api/admin/stats', requireAdmin())

// === API routes ===
app.route('', casesRoutes)
app.route('', blogsRoutes)
app.route('', noticesRoutes)
app.route('', faqRoutes)

// === Public Pages ===
app.get('/', (c) => c.render(mainPage()))
app.get('/cases', (c) => c.render(casesPage()))
app.get('/cases/:id', (c) => c.render(caseDetailPage(c.req.param('id'))))
app.get('/blogs', (c) => c.render(blogsPage()))
app.get('/blogs/:id', (c) => c.render(blogDetailPage(c.req.param('id'))))
app.get('/notices', (c) => c.render(noticesPage()))
app.get('/notices/:id', (c) => c.render(noticeDetailPage(c.req.param('id'))))
app.get('/faq', (c) => c.render(faqPage()))
app.get('/signup', (c) => c.render(signupPage()))
app.get('/login', (c) => c.render(loginPage()))

// === Admin Page (bypasses main renderer - has its own HTML) ===
app.get('/admin', (c) => c.html(adminPage()))

export default app
