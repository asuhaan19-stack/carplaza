/**
 * CarPlaza - Seed Script for NHONE.in Catalog Structure
 * Generates data/brands.json and data/products.json
 */

const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 8 Top Automotive Brands from NHONE
const brands = [
  {
    id: "brand-blaupunkt",
    name: "Blaupunkt",
    slug: "blaupunkt",
    tagline: "German In-Car Entertainment, Dashcams & Fog Projectors",
    origin: "Germany",
    logoText: "BLAUPUNKT",
    logoSvg: '<svg viewBox="0 0 160 36" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="18" cy="18" r="14" fill="#0066B2"/><text x="40" y="24" fill="#ffffff" font-family="Plus Jakarta Sans, sans-serif" font-weight="800" font-size="16" letter-spacing="1.5">BLAUPUNKT</text></svg>',
    productCount: 3
  },
  {
    id: "brand-3m",
    name: "3M",
    slug: "3m",
    tagline: "Automotive Detailing, Shampoos & Surface Protection",
    origin: "USA",
    logoText: "3M Auto",
    logoSvg: '<svg viewBox="0 0 120 36" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="36" rx="4" fill="#E60000"/><text x="7" y="25" fill="#ffffff" font-family="Arial, sans-serif" font-weight="900" font-size="20">3M</text><text x="48" y="24" fill="#f3f4f6" font-family="Plus Jakarta Sans, sans-serif" font-weight="700" font-size="14">AUTO</text></svg>',
    productCount: 1
  },
  {
    id: "brand-involve",
    name: "Involve",
    slug: "involve",
    tagline: "India's #1 Luxury Organic Gel & Spray Fragrances",
    origin: "India",
    logoText: "INVOLVE",
    logoSvg: '<svg viewBox="0 0 140 36" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="18" r="12" fill="#10B981"/><path d="M16 10 C18 14 22 17 22 20 C22 23 19 25 16 25 C13 25 10 23 10 20 C10 17 14 14 16 10 Z" fill="#ffffff"/><text x="36" y="24" fill="#ffffff" font-family="Plus Jakarta Sans, sans-serif" font-weight="800" font-size="15" letter-spacing="2">INVOLVE</text></svg>',
    productCount: 2
  },
  {
    id: "brand-motul",
    name: "Motul",
    slug: "motul",
    tagline: "French High-Performance Lubricants & Brake Fluids",
    origin: "France",
    logoText: "MOTUL",
    logoSvg: '<svg viewBox="0 0 130 36" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="130" height="36" rx="6" fill="#DC2626"/><text x="16" y="25" fill="#ffffff" font-family="Impact, Arial Black, sans-serif" font-size="22" letter-spacing="3">MOTUL</text></svg>',
    productCount: 1
  },
  {
    id: "brand-turtle-wax",
    name: "Turtle Wax",
    slug: "turtle-wax",
    tagline: "Ceramic Sealants, Hybrid Solutions & Paint Care",
    origin: "USA",
    logoText: "Turtle Wax",
    logoSvg: '<svg viewBox="0 0 160 36" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="18" cy="18" r="14" fill="#047857"/><path d="M12 18 C12 14 24 14 24 18 C24 22 12 22 12 18 Z" fill="#A7F3D0"/><text x="38" y="24" fill="#ffffff" font-family="Plus Jakarta Sans, sans-serif" font-weight="800" font-size="15">TURTLE WAX</text></svg>',
    productCount: 1
  },
  {
    id: "brand-autoform",
    name: "Autoform",
    slug: "autoform",
    tagline: "Custom-Fit 7D Mats, Leatherette Seat Covers & Body Covers",
    origin: "India",
    logoText: "AUTOFORM",
    logoSvg: '<svg viewBox="0 0 150 36" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="6" width="24" height="24" rx="4" fill="#F59E0B"/><path d="M16 10 L22 22 L10 22 Z" fill="#000000"/><text x="36" y="24" fill="#ffffff" font-family="Plus Jakarta Sans, sans-serif" font-weight="800" font-size="15" letter-spacing="1">AUTOFORM</text></svg>',
    productCount: 3
  },
  {
    id: "brand-qubo",
    name: "Qubo",
    slug: "qubo",
    tagline: "Hero Electronix Smart GPS Dashcams & Tyre Inflators",
    origin: "India",
    logoText: "QUBO",
    logoSvg: '<svg viewBox="0 0 120 36" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="6" width="24" height="24" rx="6" fill="#3B82F6"/><text x="10" y="24" fill="#ffffff" font-family="Plus Jakarta Sans, sans-serif" font-weight="900" font-size="16">Q</text><text x="36" y="24" fill="#ffffff" font-family="Plus Jakarta Sans, sans-serif" font-weight="800" font-size="16" letter-spacing="2">QUBO</text></svg>',
    productCount: 2
  },
  {
    id: "brand-autobahn",
    name: "Autobahn",
    slug: "autobahn",
    tagline: "Precision LED Headlights & 800 GSM Detailing Towels",
    origin: "Germany/India",
    logoText: "AUTOBAHN",
    logoSvg: '<svg viewBox="0 0 150 36" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 26 L16 8 L26 26 Z" fill="#E11D48"/><text x="36" y="24" fill="#ffffff" font-family="Plus Jakarta Sans, sans-serif" font-weight="800" font-size="15" letter-spacing="1">AUTOBAHN</text></svg>',
    productCount: 2
  }
];

// 14 Real-world Products across 4 NHONE Categories
const products = [
  // --- Category: Interior Accessories ---
  {
    id: "prod-autoform-7d-mats",
    title: "Autoform 7D Custom Luxury Floor Mats - Double Layer Diamond Stitch",
    brand: "Autoform",
    brandSlug: "autoform",
    brandLogoUrl: "assets/logo.jpg",
    price: 3499,
    originalPrice: 4999,
    discountPercentage: 30,
    rating: 4.9,
    ratingCount: 218,
    category: "Interior Accessories",
    imageUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
    carModelCompatibility: "Hyundai Creta",
    specifications: {
      "Material": "Multi-Layer High-Density EVA + Synthetic Leatherette",
      "Fit Type": "Laser Digitized 7D Custom Snug Fit",
      "Waterproof": "100% Spill, Mud & Dirt Proof",
      "Heel Pad": "Reinforced Anti-Slip Carbon Pattern Pad",
      "Cleaning": "Detachable Curly Coil Mat Layer for Quick Wash",
      "Warranty": "1 Year Manufacturer Guarantee"
    },
    description: "Custom-tailored 7D luxury mats designed specifically for the Hyundai Creta cabin floor contours. Features double-layer protection with heavy-duty curly mats for easy cleaning.",
    inStock: true,
    isFeatured: true
  },
  {
    id: "prod-qubo-dashcam-pro",
    title: "Qubo Smart Dashcam Pro GPS by Hero Electronix (Full HD 1080p)",
    brand: "Qubo",
    brandSlug: "qubo",
    brandLogoUrl: "assets/logo.jpg",
    price: 3990,
    originalPrice: 5990,
    discountPercentage: 33,
    rating: 4.8,
    ratingCount: 340,
    category: "Interior Accessories",
    imageUrl: "https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=800&q=80",
    carModelCompatibility: "Universal",
    specifications: {
      "Resolution": "1080p Full HD @ 30 FPS with Sony Starvis Sensor",
      "Lens Angle": "140° Ultra-Wide Angle Distortion-Free Lens",
      "Connectivity": "Built-in Wi-Fi & Live Mobile App Playback",
      "GPS Logging": "Embedded Real-Time Speed & Route Tracker",
      "Sensors": "G-Sensor for Automatic Collision Emergency Lock",
      "Storage": "Supports up to 1TB MicroSD (Class 10+)"
    },
    description: "Engineered by Hero Group, Qubo Smart Dashcam Pro GPS records critical road footage in crisp 1080p Full HD with night vision and automatic accident loop recording.",
    inStock: true,
    isFeatured: true
  },
  {
    id: "prod-blaupunkt-ambient-rgb",
    title: "Blaupunkt Symphony App-Controlled Fiber Optic Ambient RGB Lights",
    brand: "Blaupunkt",
    brandSlug: "blaupunkt",
    brandLogoUrl: "assets/logo.jpg",
    price: 1899,
    originalPrice: 2999,
    discountPercentage: 36,
    rating: 4.7,
    ratingCount: 165,
    category: "Interior Accessories",
    imageUrl: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80",
    carModelCompatibility: "Universal",
    specifications: {
      "Color Spectrum": "16 Million Colors with Dynamic Sound & Music Sync",
      "Optics": "High-Uniformity Optical Acrylic Light Guides",
      "Control": "iOS/Android Mobile App + Wireless RF Remote",
      "Voltage": "12V DC Low-Heat Safety Fuse Circuit",
      "Mounting": "Concealed Dash & Door Trim Gap Slot Fitment"
    },
    description: "Transform your cabin atmosphere with Blaupunkt's ambient optical fiber lighting kit. Features fluid color fades, strobe modes, and rhythm beat synchronization.",
    inStock: true,
    isFeatured: false
  },
  {
    id: "prod-autoform-seat-covers-thar",
    title: "Autoform Diamond Quilted Leatherette Custom Seat Covers (Mahindra Thar)",
    brand: "Autoform",
    brandSlug: "autoform",
    brandLogoUrl: "assets/logo.jpg",
    price: 7850,
    originalPrice: 11500,
    discountPercentage: 31,
    rating: 4.9,
    ratingCount: 89,
    category: "Interior Accessories",
    imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
    carModelCompatibility: "Mahindra Thar",
    specifications: {
      "Material": "Automotive Ultra-Soft Breathable Nappa Leatherette",
      "Padding": "14mm High-Resilience High-Density Foam",
      "Safety": "Side Airbag Certified Tear-Away Seam Stitching",
      "Colorway": "Matte Charcoal Black with Ruby Red Accent Piping",
      "Fitment": "Bucket Seat Glove Fit for Thar 2-Door & 4-Door",
      "Warranty": "2 Years Against Peeling & Cracking"
    },
    description: "Hand-stitched custom seat covers designed specifically for the rugged Mahindra Thar cabin. High-density memory foam padding provides lumbar support on tough terrain.",
    inStock: true,
    isFeatured: true
  },

  // --- Category: Exterior & Care ---
  {
    id: "prod-turtle-wax-ceramic-spray",
    title: "Turtle Wax Hybrid Solutions Ceramic 3-in-1 Detailer Spray (500ml)",
    brand: "Turtle Wax",
    brandSlug: "turtle-wax",
    brandLogoUrl: "assets/logo.jpg",
    price: 899,
    originalPrice: 1299,
    discountPercentage: 30,
    rating: 4.8,
    ratingCount: 412,
    category: "Exterior & Care",
    imageUrl: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=800&q=80",
    carModelCompatibility: "Universal",
    specifications: {
      "Formula": "Hydro-Glide SiO2 Ceramic Quartz Polymers",
      "Application": "Waterless Wash, Clay Lube & Shine Shield",
      "Hydrophobic": "Intense Water Beading & Self-Cleaning Effect",
      "Durability": "Up to 6 Months Long-Lasting Barrier",
      "Safe On": "Paint, Glass, Chrome, Plastic Trims & Alloy Wheels"
    },
    description: "The iconic Turtle Wax Hybrid Solutions Ceramic Detailer gently removes road dust while depositing a slick, hydrophobic SiO2 layer that repels water, mud, and contaminants.",
    inStock: true,
    isFeatured: true
  },
  {
    id: "prod-3m-car-shampoo",
    title: "3M Concentrated Snow Foam Car Wash Shampoo (1 Litre)",
    brand: "3M",
    brandSlug: "3m",
    brandLogoUrl: "assets/logo.jpg",
    price: 425,
    originalPrice: 599,
    discountPercentage: 29,
    rating: 4.9,
    ratingCount: 620,
    category: "Exterior & Care",
    imageUrl: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80",
    carModelCompatibility: "Universal",
    specifications: {
      "pH Level": "Strictly pH Neutral (7.0) Coating Safe",
      "Foam Density": "Ultra-Rich Snow Foam for Hand Bucket & Pressure Washer",
      "Protection": "Will Not Strip Existing Waxes, Sealants or Ceramic Coats",
      "Scent": "Invigorating Natural Citrus Aroma",
      "Volume": "1000ml (Yields up to 40 washes)"
    },
    description: "Trusted by professional detailers worldwide, 3M Concentrated Car Shampoo creates thick, lubricated suds that lift dirt and grime without scratching your car's clear coat.",
    inStock: true,
    isFeatured: false
  },
  {
    id: "prod-autobahn-800gsm-microfiber",
    title: "Autobahn Ultra-Plush 800 GSM Edgeless Microfiber Drying Towels (Pack of 2)",
    brand: "Autobahn",
    brandSlug: "autobahn",
    brandLogoUrl: "assets/logo.jpg",
    price: 599,
    originalPrice: 899,
    discountPercentage: 33,
    rating: 4.7,
    ratingCount: 275,
    category: "Exterior & Care",
    imageUrl: "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=800&q=80",
    carModelCompatibility: "Universal",
    specifications: {
      "GSM Rating": "800 GSM High-Density Dual-Pile Twisted Loop",
      "Dimensions": "40 cm x 40 cm Professional Size",
      "Border": "Laser-Cut Edgeless Scratch-Free Perimeter",
      "Absorption": "Absorbs over 8x Its Dry Weight in Water in a Single Pass",
      "Lint": "100% Zero-Lint, Streak-Free Drying Guarantee"
    },
    description: "Eliminate swirl marks and water spots completely with Autobahn 800 GSM edgeless microfiber drying towels. The dense twisted loop fibers wick water away instantaneously.",
    inStock: true,
    isFeatured: false
  },
  {
    id: "prod-autoform-5layer-cover-swift",
    title: "Autoform All-Weather 5-Layer Heavy Duty Custom Car Cover (Maruti Swift)",
    brand: "Autoform",
    brandSlug: "autoform",
    brandLogoUrl: "assets/logo.jpg",
    price: 2199,
    originalPrice: 3299,
    discountPercentage: 33,
    rating: 4.8,
    ratingCount: 145,
    category: "Exterior & Care",
    imageUrl: "https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?auto=format&fit=crop&w=800&q=80",
    carModelCompatibility: "Maruti Swift",
    specifications: {
      "Fabric Construction": "5-Ply Bonded Polypropylene with Soft Cotton Fleece Interior",
      "Protection": "100% UV Sun Reflective & Heavy Monsoon Rain Proof",
      "Wind Security": "Dual Heavy-Duty Buckle Clamps & Elasticized Hem",
      "Design": "Form-Fit Mirror Pockets & Antenna Port",
      "Carry Case": "Includes Breathable Zippered Storage Bag"
    },
    description: "Custom-contoured car cover for the Maruti Suzuki Swift. The soft cotton fleece interior guards against scratches while the outer shield repels rain, bird droppings, and intense UV rays.",
    inStock: true,
    isFeatured: false
  },
  {
    id: "prod-motul-engine-flush",
    title: "Motul Engine Clean Auto Flush & Lubricant Conditioner (300ml)",
    brand: "Motul",
    brandSlug: "motul",
    brandLogoUrl: "assets/logo.jpg",
    price: 499,
    originalPrice: 650,
    discountPercentage: 23,
    rating: 4.8,
    ratingCount: 310,
    category: "Exterior & Care",
    imageUrl: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80",
    carModelCompatibility: "Universal",
    specifications: {
      "Origin": "Engineered & Blended in France",
      "Action": "Dissolves Carbon Sludge & Unclogs VVT Oil Passages",
      "Compatibility": "Safe for Turbocharged Petrol & Diesel Engines",
      "Application": "Add to Old Oil Prior to Oil Change (15 Min Idle)"
    },
    description: "Professional high-potency engine flush from Motul France. Cleans internal engine galleries and valve trains, restoring smooth compression and power.",
    inStock: true,
    isFeatured: false
  },

  // --- Category: Lighting & Electronics ---
  {
    id: "prod-autobahn-f100-led",
    title: "Autobahn F100 Ultra 130W 26,000LM LED Headlight Conversion Kit",
    brand: "Autobahn",
    brandSlug: "autobahn",
    brandLogoUrl: "assets/logo.jpg",
    price: 4499,
    originalPrice: 6999,
    discountPercentage: 35,
    rating: 4.9,
    ratingCount: 388,
    category: "Lighting & Electronics",
    imageUrl: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80",
    carModelCompatibility: "Universal",
    specifications: {
      "Power Output": "130W Set (65W per bulb) CANBUS Error-Free",
      "Luminous Flux": "26,000 Lumens Focused Beam Output",
      "Color Temperature": "6000K Crisp Diamond White",
      "Thermal Management": "Dual Copper Heat Pipes + 12,000 RPM Magnetic Turbo Fan",
      "Available Sockets": "H4 (Hi/Low), H7, H11/H8, 9005 (HB3), 9006 (HB4)",
      "Lifespan": "50,000+ Continuous Operating Hours"
    },
    description: "Upgrade your night driving with Autobahn F100 LED headlight bulbs. Precision diode alignment mimics OEM halogen focal points to deliver massive reach without blinding oncoming drivers.",
    inStock: true,
    isFeatured: true
  },
  {
    id: "prod-qubo-tyre-inflator",
    title: "Qubo Smart Portable Cordless Car Tyre Inflator (2600mAh)",
    brand: "Qubo",
    brandSlug: "qubo",
    brandLogoUrl: "assets/logo.jpg",
    price: 2490,
    originalPrice: 3990,
    discountPercentage: 37,
    rating: 4.8,
    ratingCount: 295,
    category: "Lighting & Electronics",
    imageUrl: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80",
    carModelCompatibility: "Universal",
    specifications: {
      "Pressure Range": "Up to 150 PSI with Automatic Auto-Stop Sensor",
      "Display": "High-Visibility Digital LED Barometer Display",
      "Battery Capacity": "2600mAh Li-ion with USB Type-C Fast Charging",
      "Speed": "Inflates 0 to 35 PSI Car Tyre in under 6 minutes",
      "Auxiliary Features": "High-Output Emergency LED Flashlight & SOS Strobe",
      "Attachments": "Includes Schrader, Presta & Sports Ball Needles"
    },
    description: "Never get stranded with low tyre pressure. The compact Qubo Cordless Tyre Inflator lets you set your desired PSI, and automatically shuts off when the exact pressure is reached.",
    inStock: true,
    isFeatured: true
  },
  {
    id: "prod-blaupunkt-fog-projectors",
    title: "Blaupunkt 3-Inch Bi-LED High/Low Projector Fog Lamps (Waterproof IP67)",
    brand: "Blaupunkt",
    brandSlug: "blaupunkt",
    brandLogoUrl: "assets/logo.jpg",
    price: 5999,
    originalPrice: 8999,
    discountPercentage: 33,
    rating: 4.9,
    ratingCount: 134,
    category: "Lighting & Electronics",
    imageUrl: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80",
    carModelCompatibility: "Mahindra Thar",
    specifications: {
      "Lens Size": "3.0 Inch Optical Grade HD Curved Glass Convex Lens",
      "Beam Functionality": "Dual Bi-LED High Beam & Low Beam Solenoid Shutter",
      "Waterproof Rating": "IP67 Submersible Shock & Weather Proof",
      "Color Output": "Dual 3000K Golden Amber (Fog/Rain) & 6000K Pure White",
      "Housing": "Aviation Grade 6063 Aluminum Heat Sink"
    },
    description: "Conquer dense fog, monsoon rains, and unlit highways. Blaupunkt 3-inch Bi-LED projectors produce razor-sharp cutoff lines with zero stray glare.",
    inStock: true,
    isFeatured: true
  },
  {
    id: "prod-blaupunkt-bt01-receiver",
    title: "Blaupunkt BT01 Qualcomm aptX Lossless Bluetooth 5.3 Car Adapter",
    brand: "Blaupunkt",
    brandSlug: "blaupunkt",
    brandLogoUrl: "assets/logo.jpg",
    price: 1249,
    originalPrice: 1799,
    discountPercentage: 30,
    rating: 4.6,
    ratingCount: 178,
    category: "Lighting & Electronics",
    imageUrl: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80",
    carModelCompatibility: "Universal",
    specifications: {
      "Bluetooth Version": "Bluetooth 5.3 with Qualcomm aptX Low Latency Audio",
      "Outputs": "Gold-Plated 3.5mm Aux Jack + USB Power Plug",
      "Microphone": "Built-in Dual ENC Noise-Canceling Microphone for Crystal Calls",
      "Auto-Connect": "Instantly Reconnects Upon Engine Ignition",
      "Cable": "Tangle-Free Flexible Heavy-Duty Coiled Cable"
    },
    description: "Instantly add wireless music streaming and hands-free calling to any car factory stereo system with Blaupunkt's low-latency lossless audio receiver.",
    inStock: true,
    isFeatured: false
  },

  // --- Category: Perfumes & Fragrances ---
  {
    id: "prod-involve-one-french-wood",
    title: "Involve Your Senses ONE Organic Gel Car Perfume - French Wood",
    brand: "Involve",
    brandSlug: "involve",
    brandLogoUrl: "assets/logo.jpg",
    price: 349,
    originalPrice: 449,
    discountPercentage: 22,
    rating: 4.9,
    ratingCount: 850,
    category: "Perfumes & Fragrances",
    imageUrl: "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=800&q=80",
    carModelCompatibility: "Universal",
    specifications: {
      "Aroma Profile": "Warm French Cedarwood, Tobacco Leaf & Golden Amber",
      "Form Factor": "100% Organic Solid Spill-Proof Gel Cake",
      "Lifespan": "60+ Days Continuous Cabin Fragrance in Indian Climate",
      "Safety": "0% Alcohol, Non-Toxic & VOC Compliant Formula",
      "Mount": "Fits Snugly in Dashboard Cupholders or Door Pockets"
    },
    description: "India's highest rated car fragrance. Involve ONE French Wood delivers an understated, masculine woody aroma that neutralizes odors without overpowering the cabin.",
    inStock: true,
    isFeatured: true
  },
  {
    id: "prod-involve-aura-spray",
    title: "Involve Elements Aura Fine Mist Spray Perfume with Fragrance Card (100ml)",
    brand: "Involve",
    brandSlug: "involve",
    brandLogoUrl: "assets/logo.jpg",
    price: 449,
    originalPrice: 599,
    discountPercentage: 25,
    rating: 4.8,
    ratingCount: 510,
    category: "Perfumes & Fragrances",
    imageUrl: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80",
    carModelCompatibility: "Universal",
    specifications: {
      "Scent Family": "Fresh Marine Aqua with Bergamot & White Musk",
      "Dispenser": "Ultra-Fine Precision Mist Pump (Aerosol Free)",
      "Sprays": "Delivers over 200+ Rich Sprays",
      "Bonus Item": "Includes Premium Hanging Cellulose Diffuser Card",
      "Usage": "Spray directly onto hanging card, carpets or footwell vents"
    },
    description: "Experience ocean freshness inside your car. Involve Elements Aura features an aerosol-free fine mist pump that instantly refreshes AC vents and car interiors.",
    inStock: true,
    isFeatured: false
  }
];

function seed() {
  const brandsFile = path.join(dataDir, 'brands.json');
  const productsFile = path.join(dataDir, 'products.json');

  fs.writeFileSync(brandsFile, JSON.stringify(brands, null, 2), 'utf-8');
  fs.writeFileSync(productsFile, JSON.stringify(products, null, 2), 'utf-8');

  console.log(`[CarPlaza Seed] Successfully wrote ${brands.length} brands to ${brandsFile}`);
  console.log(`[CarPlaza Seed] Successfully wrote ${products.length} products to ${productsFile}`);
}

if (require.main === module) {
  seed();
}

module.exports = { brands, products, seed };
