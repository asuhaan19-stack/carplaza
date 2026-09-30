/**
 * GET /api/products/:id
 * Vercel Serverless Dynamic Route
 * Returns single product specifications by ID
 */

const fs = require('fs');
const path = require('path');

function getProducts() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'products.json');
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
  } catch (err) {
    console.error('Error reading products.json:', err);
  }
  try {
    return require('../../data/products.json');
  } catch (e) {
    return [];
  }
}

module.exports = function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ success: false, message: 'Product ID is required' });
  }

  const products = getProducts();
  const product = products.find(p => p.id.toLowerCase() === String(id).toLowerCase());

  if (!product) {
    return res.status(404).json({ success: false, message: `Product not found with id: ${id}` });
  }

  return res.status(200).json({
    success: true,
    data: product
  });
};
