/**
 * GET /api/products
 * Vercel Serverless Function / API Route
 * Supports query parameters: brand, category, search, carModel, id
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
  // Fallback to inline seed if file read fails in serverless bundle
  try {
    return require('../data/products.json');
  } catch (e) {
    return [];
  }
}

module.exports = function handler(req, res) {
  // Set CORS headers
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

  const query = req.query || {};
  const products = getProducts();

  // If specific ID is requested
  const id = query.id;
  if (id) {
    const product = products.find(p => p.id.toLowerCase() === String(id).toLowerCase());
    if (!product) {
      return res.status(404).json({ success: false, message: `Product not found with id: ${id}` });
    }
    return res.status(200).json({ success: true, data: product });
  }

  let filtered = [...products];

  // Filter by Category
  if (query.category && query.category.trim() !== '' && query.category.toLowerCase() !== 'all') {
    const cat = query.category.trim().toLowerCase();
    filtered = filtered.filter(p => p.category.toLowerCase() === cat);
  }

  // Filter by Brand
  if (query.brand && query.brand.trim() !== '' && query.brand.toLowerCase() !== 'all') {
    const brand = query.brand.trim().toLowerCase();
    filtered = filtered.filter(p => p.brand.toLowerCase() === brand || (p.brandSlug && p.brandSlug.toLowerCase() === brand));
  }

  // Filter by Car Model Compatibility
  if (query.carModel && query.carModel.trim() !== '' && query.carModel.toLowerCase() !== 'all') {
    const model = query.carModel.trim().toLowerCase();
    filtered = filtered.filter(p => {
      const comp = (p.carModelCompatibility || '').toLowerCase();
      if (model === 'universal') {
        return comp.includes('universal');
      }
      return comp.includes('universal') || comp.includes(model);
    });
  }

  // Filter by Search Query
  if (query.search && query.search.trim() !== '') {
    const q = query.search.trim().toLowerCase();
    filtered = filtered.filter(p => {
      return (
        p.title.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.carModelCompatibility && p.carModelCompatibility.toLowerCase().includes(q))
      );
    });
  }

  return res.status(200).json({
    success: true,
    count: filtered.length,
    total: products.length,
    data: filtered
  });
};
