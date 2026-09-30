/**
 * GET /api/brands
 * Vercel Serverless Function
 * Returns list of top automotive brands with logos, origins, and product counts
 */

const fs = require('fs');
const path = require('path');

function getBrands() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'brands.json');
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
  } catch (err) {
    console.error('Error reading brands.json:', err);
  }
  try {
    return require('../data/brands.json');
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

  const brands = getBrands();

  return res.status(200).json({
    success: true,
    count: brands.length,
    data: brands
  });
};
