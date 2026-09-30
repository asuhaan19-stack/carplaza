#!/usr/bin/env python3
"""
CarPlaza - Python 3 Local Development & REST API Server
Zero external dependencies (uses standard library http.server)
"""

import http.server
import socketserver
import json
import os
import urllib.parse
import mimetypes

PORT = int(os.environ.get("PORT", 3000))
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")

def read_json_file(filename):
    file_path = os.path.join(DATA_DIR, filename)
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

class CarPlazaHandler(http.server.BaseHTTPRequestHandler):
    def send_json_response(self, status_code, data):
        body = json.dumps(data, indent=2).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        query = urllib.parse.parse_qs(parsed.query)

        # Helper to get first query param
        def q(key):
            val = query.get(key, [""])[0].strip()
            return val

        # GET /api/brands
        if path == "/api/brands":
            brands = read_json_file("brands.json")
            return self.send_json_response(200, {
                "success": True,
                "count": len(brands),
                "data": brands
            })

        # GET /api/products or /api/products/:id
        if path.startswith("/api/products"):
            products = read_json_file("products.json")
            parts = [p for p in path.split("/") if p]
            
            # Direct ID in path: /api/products/prod-...
            if len(parts) >= 3 and parts[1] == "products":
                prod_id = parts[2].lower()
                prod = next((p for p in products if p.get("id", "").lower() == prod_id), None)
                if not prod:
                    return self.send_json_response(404, {"success": False, "message": f"Product not found: {prod_id}"})
                return self.send_json_response(200, {"success": True, "data": prod})

            # Query ID: /api/products?id=prod-...
            param_id = q("id")
            if param_id:
                prod = next((p for p in products if p.get("id", "").lower() == param_id.lower()), None)
                if not prod:
                    return self.send_json_response(404, {"success": False, "message": f"Product not found: {param_id}"})
                return self.send_json_response(200, {"success": True, "data": prod})

            filtered = list(products)

            # Category filter
            cat = q("category").lower()
            if cat and cat != "all":
                filtered = [p for p in filtered if p.get("category", "").lower() == cat]

            # Brand filter
            brand = q("brand").lower()
            if brand and brand != "all":
                filtered = [p for p in filtered if p.get("brand", "").lower() == brand or p.get("brandSlug", "").lower() == brand]

            # Car Model filter
            car_model = q("carModel").lower()
            if car_model and car_model != "all":
                if car_model == "universal":
                    filtered = [p for p in filtered if "universal" in p.get("carModelCompatibility", "").lower()]
                else:
                    filtered = [p for p in filtered if "universal" in p.get("carModelCompatibility", "").lower() or car_model in p.get("carModelCompatibility", "").lower()]

            # Search filter
            search = q("search").lower()
            if search:
                filtered = [
                    p for p in filtered if (
                        search in p.get("title", "").lower() or
                        search in p.get("brand", "").lower() or
                        search in p.get("category", "").lower() or
                        search in p.get("description", "").lower() or
                        search in p.get("carModelCompatibility", "").lower()
                    )
                ]

            return self.send_json_response(200, {
                "success": True,
                "count": len(filtered),
                "total": len(products),
                "data": filtered
            })

        # Static file serving
        if path == "/":
            path = "/index.html"

        rel_path = path.lstrip("/")
        full_path = os.path.normpath(os.path.join(BASE_DIR, rel_path))

        if not full_path.startswith(BASE_DIR) or not os.path.isfile(full_path):
            self.send_response(404)
            self.send_header("Content-Type", "text/plain; charset=utf-8")
            self.end_headers()
            self.wfile.write(f"404 Not Found: {path}".encode("utf-8"))
            return

        mime_type, _ = mimetypes.guess_type(full_path)
        if not mime_type:
            mime_type = "application/octet-stream"

        try:
            with open(full_path, "rb") as f:
                content = f.read()
            self.send_response(200)
            self.send_header("Content-Type", mime_type)
            self.send_header("Content-Length", str(len(content)))
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(content)
        except Exception as e:
            self.send_response(500)
            self.end_headers()
            self.wfile.write(str(e).encode("utf-8"))

def run():
    with socketserver.TCPServer(("", PORT), CarPlazaHandler) as httpd:
        print(f"🚀 CarPlaza Python Server running at http://localhost:{PORT}")
        httpd.serve_forever()

if __name__ == "__main__":
    run()
