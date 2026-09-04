//backend running here

const BASE_URL = import.meta.env.VITE_API_URL

async function request(path) {
  const res = await fetch(`${BASE_URL}${path}`)
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  return res.json()
}


const MOCK_ORDERS = [
  { id: 10309, quantity: 1, total_price: 165.0, status: 'confirmed', created_at: '2026-09-01T10:20:00', updated_at: '2026-09-01T10:20:00', customer: { id: 41, name: 'Dean R.', email: 'dean.r@example.com' }, product: { id: 5, name: 'Custom nameplate', category: 'Signage' }, material: { id: 1, name: 'PLA', color: 'Charcoal' } },
  { id: 10308, quantity: 2, total_price: 230.0, status: 'printing', created_at: '2026-09-01T09:58:00', updated_at: '2026-09-01T11:02:00', customer: { id: 38, name: 'Priya N.', email: 'priya.n@example.com' }, product: { id: 8, name: 'Bracket set', category: 'Hardware' }, material: { id: 3, name: 'PETG', color: 'Natural' } },
  { id: 10306, quantity: 1, total_price: 245.0, status: 'printing', created_at: '2026-09-01T09:41:00', updated_at: '2026-09-01T10:15:00', customer: { id: 35, name: 'Lindiwe M.', email: 'lindiwe.m@example.com' }, product: { id: 12, name: 'Mini planter, textured', category: 'Home' }, material: { id: 4, name: 'PETG', color: 'Forest Green' } },
  { id: 10305, quantity: 4, total_price: 180.0, status: 'quality_check', created_at: '2026-09-01T08:55:00', updated_at: '2026-09-01T10:40:00', customer: { id: 33, name: 'Werner S.', email: 'werner.s@example.com' }, product: { id: 9, name: 'Cable clip set', category: 'Hardware' }, material: { id: 1, name: 'PLA', color: 'Charcoal' } },
  { id: 10303, quantity: 5, total_price: 320.0, status: 'confirmed', created_at: '2026-09-01T08:12:00', updated_at: '2026-09-01T08:12:00', customer: { id: 29, name: 'Fatima A.', email: 'fatima.a@example.com' }, product: { id: 3, name: 'Personalized keychain', category: 'Accessories' }, material: { id: 2, name: 'PLA', color: 'Ocean Blue' } },
  { id: 10301, quantity: 1, total_price: 410.0, status: 'pending', created_at: '2026-08-31T17:20:00', updated_at: '2026-08-31T17:20:00', customer: { id: 27, name: 'Craig P.', email: 'craig.p@example.com' }, product: { id: 15, name: 'Desk organizer, 3-slot', category: 'Home' }, material: { id: 3, name: 'PETG', color: 'Natural' } },
  { id: 10298, quantity: 1, total_price: 195.0, status: 'pending', created_at: '2026-08-31T15:03:00', updated_at: '2026-08-31T15:03:00', customer: { id: 24, name: 'Nomvula K.', email: 'nomvula.k@example.com' }, product: { id: 7, name: 'Phone stand (custom logo)', category: 'Accessories' }, material: { id: 2, name: 'PLA', color: 'Ocean Blue' } },
  { id: 10291, quantity: 1, total_price: 275.0, status: 'shipped', created_at: '2026-08-31T11:47:00', updated_at: '2026-08-31T16:00:00', customer: { id: 19, name: 'Bongani T.', email: 'bongani.t@example.com' }, product: { id: 11, name: 'Vase, spiral pattern', category: 'Home' }, material: { id: 1, name: 'PLA', color: 'Charcoal' } },
  { id: 10287, quantity: 3, total_price: 150.0, status: 'delivered', created_at: '2026-08-30T09:00:00', updated_at: '2026-08-30T18:00:00', customer: { id: 14, name: 'Zanele P.', email: 'zanele.p@example.com' }, product: { id: 6, name: 'Desk hooks', category: 'Hardware' }, material: { id: 4, name: 'PETG', color: 'Forest Green' } },
  { id: 10280, quantity: 1, total_price: 390.0, status: 'cancelled', created_at: '2026-08-29T09:00:00', updated_at: '2026-08-29T12:00:00', customer: { id: 12, name: 'Kyle B.', email: 'kyle.b@example.com' }, product: { id: 18, name: 'Miniature figurine set', category: 'Collectibles' }, material: { id: 1, name: 'PLA', color: 'Charcoal' } },
]

export async function getOrders() {
  try {
    return await request('/orders')
  } catch {
    return MOCK_ORDERS
  }
}

const MOCK_MATERIALS = [
  { id: 1, name: 'PLA', description: 'Standard PLA filament', color: 'Charcoal', price_per_gram: 0.18, properties: { type: 'virgin' }, in_stock: true },
  { id: 2, name: 'PLA', description: 'Recycled PLA filament', color: 'Ocean Blue', price_per_gram: 0.15, properties: { type: 'recycled' }, in_stock: true },
  { id: 3, name: 'PETG', description: 'Recycled PETG filament', color: 'Natural', price_per_gram: 0.22, properties: { type: 'recycled' }, in_stock: false },
  { id: 4, name: 'PETG', description: 'Standard PETG filament', color: 'Forest Green', price_per_gram: 0.24, properties: { type: 'virgin' }, in_stock: true },
  { id: 5, name: 'TPU', description: 'Flexible TPU filament', color: 'Black', price_per_gram: 0.32, properties: { type: 'virgin' }, in_stock: false },
  { id: 6, name: 'ABS', description: 'Standard ABS filament', color: 'White', price_per_gram: 0.2, properties: { type: 'virgin' }, in_stock: true },
]

export async function getMaterials() {
  try {
    return await request('/materials')
  } catch {
    return MOCK_MATERIALS
  }
}

const MOCK_EMPLOYEES = [
  { id: 1, employee_id: 'RP-0142', position: 'Production Coordinator', department: 'production', employment_type: 'full_time', status: 'active', hire_date: '2025-11-03', user: { id: 101, name: 'Aisha Daniels', email: 'aisha.d@reprint.co.za' }, todays_shift: { start_time: '08:00', end_time: '16:00' } },
  { id: 2, employee_id: 'RP-0118', position: 'Print Technician', department: 'production', employment_type: 'full_time', status: 'active', hire_date: '2025-06-14', user: { id: 102, name: 'Thabo Mokoena', email: 'thabo.m@reprint.co.za' }, todays_shift: { start_time: '08:00', end_time: '16:00' } },
  { id: 3, employee_id: 'RP-0127', position: 'Print Technician', department: 'production', employment_type: 'part_time', status: 'active', hire_date: '2025-08-01', user: { id: 103, name: 'Sipho Ndlovu', email: 'sipho.n@reprint.co.za' }, todays_shift: { start_time: '08:00', end_time: '13:00' } },
  { id: 4, employee_id: 'RP-0134', position: 'Quality Control', department: 'production', employment_type: 'full_time', status: 'active', hire_date: '2025-09-20', user: { id: 104, name: 'Chantelle Adams', email: 'chantelle.a@reprint.co.za' }, todays_shift: { start_time: '08:00', end_time: '16:00' } },
  { id: 5, employee_id: 'RP-0109', position: 'Order Fulfilment', department: 'sales', employment_type: 'full_time', status: 'on_leave', hire_date: '2025-03-11', user: { id: 105, name: 'Riaan Botha', email: 'riaan.b@reprint.co.za' }, todays_shift: null },
  { id: 6, employee_id: 'RP-0151', position: 'Customer Support', department: 'support', employment_type: 'full_time', status: 'active', hire_date: '2026-01-15', user: { id: 106, name: 'Naledi Sithole', email: 'naledi.s@reprint.co.za' }, todays_shift: { start_time: '08:00', end_time: '16:00' } },
]

export async function getEmployees() {
  try {
    return await request('/employees')
  } catch {
    return MOCK_EMPLOYEES
  }
}


const MOCK_NOTIFICATIONS = [
  { id: 1, title: 'Order status changed', message: 'Order #10305 moved to quality check', type: 'order', read: false, created_at: '2026-09-01T10:48:00' },
  { id: 2, title: 'Material low', message: 'PETG (Recycled, Natural) is marked out of stock', type: 'system', read: false, created_at: '2026-09-01T09:30:00' },
  { id: 3, title: 'Payment received', message: 'Payment confirmed for order #10303', type: 'payment', read: true, created_at: '2026-09-01T08:15:00' },
  { id: 4, title: 'New consultation request', message: 'Fatima A. requested a design consultation', type: 'consultation', read: true, created_at: '2026-08-31T16:20:00' },
]

export async function getNotifications() {
  try {
    return await request('/notifications')
  } catch {
    return MOCK_NOTIFICATIONS
  }
}