import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { products as seedProducts, users as seedUsers, employees as seedEmployees, shifts as seedShifts } from './data.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5000
const JWT_SECRET = process.env.JWT_SECRET || 'reprint-dev-secret-change-in-production'

app.use(cors())
app.use(express.json())

const users = seedUsers.map(({ password, ...rest }) => ({ ...rest, password: bcrypt.hashSync(password, 10) }))
const employees = [...seedEmployees]
const shifts = [...seedShifts]
let nextUserId = users.length + 1

function authMiddleware(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' })
  }
  try {
    const token = header.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

function adminMiddleware(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' })
  }
  next()
}

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.post('/auth/register', (req, res) => {
  const { name, email, password } = req.body
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required' })
  }
  if (users.find((u) => u.email === email)) {
    return res.status(409).json({ error: 'Email already registered' })
  }
  const hashed = bcrypt.hashSync(password, 10)
  const user = { id: nextUserId++, email, name, password: hashed, role: 'user' }
  users.push(user)
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' })
  res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } })
})

app.post('/auth/login', (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }
  const user = users.find((u) => u.email === email)
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }
  const valid = bcrypt.compareSync(password, user.password)
  if (!valid) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' })
  res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } })
})

app.get('/products', (_req, res) => {
  res.json(seedProducts)
})

app.get('/hr/reports/overview', authMiddleware, adminMiddleware, (_req, res) => {
  const activeEmployees = employees.filter((e) => e.status === 'active')
  const today = new Date().toISOString().slice(0, 10)
  const shiftsToday = shifts.filter((s) => s.shift_date === today)
  const totalPayroll = activeEmployees.reduce((sum, e) => sum + e.salary, 0)

  const deptMap = {}
  activeEmployees.forEach((e) => {
    deptMap[e.department] = (deptMap[e.department] || 0) + 1
  })
  const byDepartment = Object.entries(deptMap).map(([department, count]) => ({ department, count }))

  const recentHires = [...activeEmployees]
    .sort((a, b) => new Date(b.hire_date) - new Date(a.hire_date))
    .slice(0, 5)
    .map((e) => ({ id: e.id, name: e.name, position: e.position, department: e.department, hire_date: e.hire_date }))

  res.json({
    totalEmployees: activeEmployees.length,
    shiftsToday: shiftsToday.length,
    totalPayroll,
    byDepartment,
    recentHires,
  })
})

app.get('/hr/employees', authMiddleware, adminMiddleware, (_req, res) => {
  res.json(employees)
})

app.get('/hr/shifts', authMiddleware, adminMiddleware, (_req, res) => {
  res.json(shifts)
})

app.use('/images', express.static(join(__dirname, '..', 'src', 'assets')))
app.use('/images', express.static(join(__dirname, '..', 'public')))

app.listen(PORT, () => {
  console.log(`RePrint API running on http://localhost:${PORT}`)
})
