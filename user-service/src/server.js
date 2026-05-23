const express = require('express')
const app = express()
app.use(express.json())

// In-memory "database" — no MongoDB needed
const users = [
  { id: '1', name: 'Rahul Sharma', email: 'rahul@example.com' },
  { id: '2', name: 'Priya Patel',  email: 'priya@example.com' },
]

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'user-service' })
})

app.get('/api/users', (req, res) => {
  res.json(users)
})

app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id)
  if (!user) return res.status(404).json({ error: 'User not found' })
  res.json(user)
})

app.post('/api/users', (req, res) => {
  const user = { id: String(users.length + 1), ...req.body }
  users.push(user)
  res.status(201).json(user)
})

app.listen(3001, () => console.log('user-service running on port 3001'))
