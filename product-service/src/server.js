const express = require('express')
const app = express()
app.use(express.json())

const products = [
  { id: '1', name: 'Laptop',     price: 55000, stock: 10 },
  { id: '2', name: 'Headphones', price: 2500,  stock: 50 },
  { id: '3', name: 'Mouse',      price: 800,   stock: 100 },
]

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'product-service' })
})

app.get('/api/products', (req, res) => {
  res.json(products)
})

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id)
  if (!product) return res.status(404).json({ error: 'Product not found' })
  res.json(product)
})

app.listen(3002, () => console.log('product-service running on port 3002'))
