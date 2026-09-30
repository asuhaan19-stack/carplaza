/**
 * CarPlaza - Local Development & API Server
 * Built with native Node.js (Zero external dependencies)
 * Serves /api/products, /api/brands, /api/products/:id and static frontend files
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;
const DATA_DIR = path.join(__dirname, 'data');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp'
};

function readJsonFile(filename) {
  try {
    const p = path.join(DATA_DIR, filename);
    if (fs.existsSync(p)) {
      return JSON.parse(fs.readFileSync(p, 'utf-8'));
    }
  } catch (err) {
    console.error(`Error reading ${filename}:`, err);
  }
  return [];
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data, null, 2));
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  let pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }

  // --- API Endpoints ---

  // GET /api/brands
  if (pathname === '/api/brands') {
    const brands = readJsonFile('brands.json');
    return sendJson(res, 200, {
      success: true,
      count: brands.length,
      data: brands
    });
  }

  // GET /api/products or /api/products/:id
  if (pathname.startsWith('/api/products')) {
    const products = readJsonFile('products.json');

    // Check if there is an ID in the path (e.g. /api/products/prod-autoform-7d-mats)
    const pathParts = pathname.split('/').filter(Boolean);
    if (pathParts.length >= 3 && pathParts[1] === 'products') {
      const prodId = pathParts[2];
      const product = products.find(p => p.id.toLowerCase() === prodId.toLowerCase());
      if (!product) {
        return sendJson(res, 404, { success: false, message: `Product not found: ${prodId}` });
      }
      return sendJson(res, 200, { success: true, data: product });
    }

    // Query parameter ID (e.g. /api/products?id=prod-...)
    if (query.id) {
      const product = products.find(p => p.id.toLowerCase() === query.id.toLowerCase());
      if (!product) {
        return sendJson(res, 404, { success: false, message: `Product not found: ${query.id}` });
      }
      return sendJson(res, 200, { success: true, data: product });
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

    // Filter by Car Model
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

    // Search query
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

    return sendJson(res, 200, {
      success: true,
      count: filtered.length,
      total: products.length,
      data: filtered
    });
  }

  // --- Static File Serving ---
  if (pathname === '/') {
    pathname = '/index.html';
  }

  const safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(PUBLIC_DIR, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end(`404 Not Found: ${pathname}`);
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*'
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`\n=================================================`);
  console.log(`🚀 CarPlaza Server running at http://localhost:${PORT}`);
  console.log(`📦 REST Endpoints:`);
  console.log(`   - GET http://localhost:${PORT}/api/products`);
  console.log(`   - GET http://localhost:${PORT}/api/brands`);
  console.log(`   - GET http://localhost:${PORT}/api/products/:id`);
  console.log(`=================================================\n`);
});

module.exports = server;
