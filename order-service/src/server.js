const express = require('express')
const axios   = require('axios')
const app     = express()
app.use(express.json())

// These env vars are set in the K8s manifest
// Inside Minikube, K8s DNS resolves service names automatically
const USER_SERVICE_URL    = process.env.USER_SERVICE_URL    || 'http://user-service:3001'
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://product-service:3002'

const orders = []

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'order-service' })
})

app.get('/api/orders', (req, res) => {
  res.json(orders)
})

// POST /api/orders
// Body: { userId: "1", productId: "2", quantity: 1 }
app.post('/api/orders', async (req, res) => {
  const { userId, productId, quantity } = req.body

  try {
    // Step 1: Verify user exists (calls user-service)
    const userRes = await axios.get(`${USER_SERVICE_URL}/api/users/${userId}`)
    const user    = userRes.data

    // Step 2: Verify product exists and get price (calls product-service)
    const productRes = await axios.get(`${PRODUCT_SERVICE_URL}/api/products/${productId}`)
    const product    = productRes.data

    // Step 3: Create order
    const order = {
      id:          String(orders.length + 1),
      user:        user,
      product:     product,
      quantity:    quantity,
      totalAmount: product.price * quantity,
      status:      'confirmed',
      createdAt:   new Date().toISOString()
    }

    orders.push(order)
    res.status(201).json(order)

  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

app.listen(3003, () => console.log('order-service running on port 3003'))
