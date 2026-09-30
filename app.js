/**
 * CarPlaza - Automotive Accessories & NHONE Catalog Application
 * Features:
 * - Dynamic API integration with /api/products and /api/brands
 * - Multi-faceted filtering (Brand, Category, Car Model, Search keyword, Sort)
 * - Brand Showcase interactive bar
 * - Product Specification Quick View Modal
 * - Direct WhatsApp ordering (+91 98963 33274)
 * - Cart System COMPLETELY REMOVED
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- Configuration ---
  const SHOP_PHONE = '9896333274'; // CarPlaza Father's direct line & WhatsApp
  const SHOP_WA_INTL = '919896333274';

  // Determine API base URL
  const isHttp = window.location.protocol === 'http:' || window.location.protocol === 'https:';
  const API_BASE = isHttp ? '/api' : null;

  // --- State Management ---
  const state = {
    brands: [],
    products: [],
    filteredProducts: [],
    activeCategory: 'all',
    activeBrand: 'all',
    activeCarModel: 'all',
    searchQuery: '',
    sortBy: 'featured',
    selectedProduct: null
  };

  // --- DOM Elements ---
  const brandsContainer = document.getElementById('brandsContainer');
  const productsGrid = document.getElementById('productsGrid');
  const categoryTabs = document.getElementById('categoryTabs');
  const brandFilterSelect = document.getElementById('brandFilterSelect');
  const carModelFilterSelect = document.getElementById('carModelFilterSelect');
  const sortFilterSelect = document.getElementById('sortFilterSelect');
  const catalogSearchInput = document.getElementById('catalogSearchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const heroSearchInput = document.getElementById('heroSearchInput');
  const heroSearchBtn = document.getElementById('heroSearchBtn');
  const activeFiltersBar = document.getElementById('activeFiltersBar');
  const activeFilterTags = document.getElementById('activeFilterTags');
  const resetFiltersBtn = document.getElementById('resetFiltersBtn');
  const resultsCountText = document.getElementById('resultsCountText');

  // Modal Elements
  const productModal = document.getElementById('productModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalProductImage = document.getElementById('modalProductImage');
  const modalDiscountTag = document.getElementById('modalDiscountTag');
  const modalBrandOrigin = document.getElementById('modalBrandOrigin');
  const modalCategory = document.getElementById('modalCategory');
  const modalTitle = document.getElementById('modalTitle');
  const modalStars = document.getElementById('modalStars');
  const modalRatingText = document.getElementById('modalRatingText');
  const modalPrice = document.getElementById('modalPrice');
  const modalOriginalPrice = document.getElementById('modalOriginalPrice');
  const modalSavings = document.getElementById('modalSavings');
  const modalCompatibility = document.getElementById('modalCompatibility');
  const modalDescription = document.getElementById('modalDescription');
  const modalSpecsTable = document.getElementById('modalSpecsTable');
  const modalWhatsAppBtn = document.getElementById('modalWhatsAppBtn');
  const modalBookSlotBtn = document.getElementById('modalBookSlotBtn');

  // Booking Form & General Elements
  const bookingForm = document.getElementById('bookingForm');
  const formStatus = document.getElementById('formStatus');
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  // --- Initialize Application ---
  async function init() {
    setupNavigation();
    setupEventListeners();
    setupIntersectionObservers();
    setupStatsCounter();

    // Fetch Brands and Products
    await Promise.all([
      fetchBrands(),
      fetchProducts()
    ]);
  }

  // --- API Fetch Functions ---

  async function fetchBrands() {
    try {
      let brandsData = [];
      if (API_BASE) {
        const res = await fetch(`${API_BASE}/brands`);
        if (res.ok) {
          const json = await res.json();
          brandsData = json.data || [];
        }
      }
      
      // Fallback to local data/brands.json if API call fails
      if (!brandsData.length) {
        const localRes = await fetch('data/brands.json');
        if (localRes.ok) {
          brandsData = await localRes.json();
        }
      }

      state.brands = brandsData;
      renderBrands(state.brands);
      populateBrandSelect(state.brands);
    } catch (err) {
      console.warn('Could not load brands via API, trying fallback:', err);
      try {
        const localRes = await fetch('data/brands.json');
        if (localRes.ok) {
          state.brands = await localRes.json();
          renderBrands(state.brands);
          populateBrandSelect(state.brands);
        }
      } catch (e) {
        brandsContainer.innerHTML = '<div class="empty-catalog">Unable to load brands. Please verify backend connection.</div>';
      }
    }
  }

  async function fetchProducts() {
    productsGrid.innerHTML = '<div class="loading-spinner">Loading NHONE catalog items...</div>';
    try {
      let productsData = [];

      if (API_BASE) {
        // Construct query parameters
        const params = new URLSearchParams();
        if (state.activeCategory !== 'all') params.append('category', state.activeCategory);
        if (state.activeBrand !== 'all') params.append('brand', state.activeBrand);
        if (state.activeCarModel !== 'all') params.append('carModel', state.activeCarModel);
        if (state.searchQuery.trim() !== '') params.append('search', state.searchQuery.trim());

        const url = `${API_BASE}/products?${params.toString()}`;
        const res = await fetch(url);
        if (res.ok) {
          const json = await res.json();
          productsData = json.data || [];
        }
      }

      // Fallback to local data/products.json if API is unavailable
      if (!productsData.length && state.products.length === 0) {
        const localRes = await fetch('data/products.json');
        if (localRes.ok) {
          productsData = await localRes.json();
        }
      }

      if (state.products.length === 0 && productsData.length > 0) {
        state.products = productsData;
      }

      // Apply client-side sorting & filters
      applyFilters();
    } catch (err) {
      console.warn('API error, falling back to local dataset:', err);
      try {
        const localRes = await fetch('data/products.json');
        if (localRes.ok) {
          state.products = await localRes.json();
          applyFilters();
        }
      } catch (e) {
        productsGrid.innerHTML = '<div class="empty-catalog">Unable to load catalog products.</div>';
      }
    }
  }

  // --- Rendering Functions ---

  function renderBrands(brands) {
    if (!brandsContainer) return;
    if (!brands.length) {
      brandsContainer.innerHTML = '<div class="empty-catalog">No brands found.</div>';
      return;
    }

    brandsContainer.innerHTML = brands.map(brand => {
      const isActive = state.activeBrand.toLowerCase() === brand.name.toLowerCase() ? 'active' : '';
      return `
        <div class="brand-card ${isActive}" data-brand="${escapeHtml(brand.name)}" title="Filter by ${escapeHtml(brand.name)}">
          <div class="brand-logo-wrap">
            ${brand.logoSvg || `<span style="font-weight:900;font-size:1.1rem;color:#ffffff;">${escapeHtml(brand.name)}</span>`}
          </div>
          <div class="brand-meta">
            <span class="brand-origin">${escapeHtml(brand.origin || 'Imported')}</span>
            <span class="brand-items-count">${brand.productCount || ''} Items</span>
          </div>
        </div>
      `;
    }).join('');

    // Attach click events to brand cards
    brandsContainer.querySelectorAll('.brand-card').forEach(card => {
      card.addEventListener('click', () => {
        const brandName = card.getAttribute('data-brand');
        if (state.activeBrand.toLowerCase() === brandName.toLowerCase()) {
          state.activeBrand = 'all';
        } else {
          state.activeBrand = brandName;
        }

        // Sync dropdown
        if (brandFilterSelect) {
          brandFilterSelect.value = state.activeBrand;
        }

        updateBrandCardsActiveState();
        applyFilters();

        // Smooth scroll to catalog section
        const catalogEl = document.getElementById('catalog');
        if (catalogEl) {
          catalogEl.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  function updateBrandCardsActiveState() {
    if (!brandsContainer) return;
    brandsContainer.querySelectorAll('.brand-card').forEach(card => {
      const bName = card.getAttribute('data-brand') || '';
      if (state.activeBrand !== 'all' && state.activeBrand.toLowerCase() === bName.toLowerCase()) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });
  }

  function populateBrandSelect(brands) {
    if (!brandFilterSelect) return;
    const existingOptions = '<option value="all">All Brands</option>';
    const brandOptions = brands.map(b => `<option value="${escapeHtml(b.name)}">${escapeHtml(b.name)}</option>`).join('');
    brandFilterSelect.innerHTML = existingOptions + brandOptions;
    brandFilterSelect.value = state.activeBrand;
  }

  function renderProducts(products) {
    if (!productsGrid) return;

    if (!products.length) {
      productsGrid.innerHTML = `
        <div class="empty-catalog">
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 1rem; color: var(--color-primary);"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <h3 style="margin-bottom: 0.5rem; color: var(--color-text-main);">No matching products found</h3>
          <p style="margin-bottom: 1.5rem;">Try adjusting your brand, category, or search filters to find what you need.</p>
          <button class="btn btn-secondary" onclick="window.resetCarPlazaFilters()">Reset Filters</button>
        </div>
      `;
      if (resultsCountText) resultsCountText.textContent = `Showing 0 products`;
      return;
    }

    if (resultsCountText) {
      resultsCountText.textContent = `Showing ${products.length} product${products.length > 1 ? 's' : ''}`;
    }

    productsGrid.innerHTML = products.map(product => {
      const savings = (product.originalPrice && product.originalPrice > product.price)
        ? product.originalPrice - product.price
        : 0;

      const waMessage = encodeURIComponent(
        `Hi CarPlaza! I want to order/enquire about:\n*${product.title}*\nBrand: ${product.brand}\nPrice: ₹${product.price.toLocaleString('en-IN')}\nFitment: ${product.carModelCompatibility || 'Universal'}\n\nPlease confirm availability and shipping/installation slot.`
      );
      const waUrl = `https://wa.me/${SHOP_WA_INTL}?text=${waMessage}`;

      return `
        <article class="product-card" data-id="${escapeHtml(product.id)}">
          <div class="prod-img-wrap">
            <img src="${escapeHtml(product.imageUrl)}" alt="${escapeHtml(product.title)}" loading="lazy" onerror="this.src='assets/hero-car.jpg'">
            ${product.discountPercentage ? `<span class="discount-badge">-${product.discountPercentage}% OFF</span>` : ''}
            <span class="category-badge-pill">${escapeHtml(product.category)}</span>
          </div>

          <div class="prod-content">
            <div class="prod-brand-row">
              <span class="prod-brand-name">${escapeHtml(product.brand)}</span>
              <div class="prod-rating">
                <span>★</span>
                <span>${product.rating || '4.8'}</span>
                <span class="prod-rating-count">(${product.ratingCount || 100}+)</span>
              </div>
            </div>

            <h3 class="prod-title" title="${escapeHtml(product.title)}">${escapeHtml(product.title)}</h3>

            <div class="prod-compat-pill">
              <span>🚗</span>
              <span>Fits: <strong>${escapeHtml(product.carModelCompatibility || 'Universal Fit')}</strong></span>
            </div>

            <div class="prod-price-row">
              <div class="price-current">₹${product.price.toLocaleString('en-IN')}</div>
              ${product.originalPrice ? `<div class="price-strike">₹${product.originalPrice.toLocaleString('en-IN')}</div>` : ''}
              ${savings > 0 ? `<div class="price-save">Save ₹${savings.toLocaleString('en-IN')}</div>` : ''}
            </div>

            <!-- No Cart! Explicit Quick View and WhatsApp Ordering -->
            <div class="prod-card-actions">
              <button class="btn-card-view" data-action="quickview" data-id="${escapeHtml(product.id)}">
                View Details
              </button>
              <a href="${waUrl}" target="_blank" rel="noopener" class="btn-card-wa" aria-label="Order on WhatsApp">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 20.15C10.57 20.15 9.12 19.75 7.85 19L7.55 18.82L4.44 19.64L5.27 16.6L5.07 16.29C4.24 14.98 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.68 12.05 3.68C14.25 3.68 16.31 4.54 17.87 6.1C19.42 7.66 20.28 9.72 20.28 11.92C20.28 16.46 16.59 20.15 12.05 20.15Z"/></svg>
                WhatsApp
              </a>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Attach quick view click listeners
    productsGrid.querySelectorAll('[data-action="quickview"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        openProductModal(id);
      });
    });
  }

  // --- Filtering & Sorting Logic ---

  function applyFilters() {
    let result = [...state.products];

    // Filter by Category
    if (state.activeCategory !== 'all') {
      const cat = state.activeCategory.toLowerCase();
      result = result.filter(p => p.category.toLowerCase() === cat);
    }

    // Filter by Brand
    if (state.activeBrand !== 'all') {
      const br = state.activeBrand.toLowerCase();
      result = result.filter(p => p.brand.toLowerCase() === br || (p.brandSlug && p.brandSlug.toLowerCase() === br));
    }

    // Filter by Car Model
    if (state.activeCarModel !== 'all') {
      const cm = state.activeCarModel.toLowerCase();
      result = result.filter(p => {
        const comp = (p.carModelCompatibility || '').toLowerCase();
        if (cm === 'universal') return comp.includes('universal');
        return comp.includes('universal') || comp.includes(cm);
      });
    }

    // Filter by Search Query
    if (state.searchQuery.trim() !== '') {
      const q = state.searchQuery.trim().toLowerCase();
      result = result.filter(p => {
        return (
          p.title.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.carModelCompatibility && p.carModelCompatibility.toLowerCase().includes(q))
        );
      });
    }

    // Sorting
    switch (state.sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'discount':
        result.sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0));
        break;
      default: // featured
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    state.filteredProducts = result;
    renderProducts(state.filteredProducts);
    renderActiveFilterBadges();
  }

  function renderActiveFilterBadges() {
    if (!activeFiltersBar || !activeFilterTags) return;

    const badges = [];

    if (state.activeCategory !== 'all') {
      badges.push({
        label: `Category: ${state.activeCategory}`,
        clear: () => {
          state.activeCategory = 'all';
          updateCategoryTabs();
          applyFilters();
        }
      });
    }

    if (state.activeBrand !== 'all') {
      badges.push({
        label: `Brand: ${state.activeBrand}`,
        clear: () => {
          state.activeBrand = 'all';
          if (brandFilterSelect) brandFilterSelect.value = 'all';
          updateBrandCardsActiveState();
          applyFilters();
        }
      });
    }

    if (state.activeCarModel !== 'all') {
      badges.push({
        label: `Vehicle: ${state.activeCarModel}`,
        clear: () => {
          state.activeCarModel = 'all';
          if (carModelFilterSelect) carModelFilterSelect.value = 'all';
          applyFilters();
        }
      });
    }

    if (state.searchQuery.trim() !== '') {
      badges.push({
        label: `Search: "${state.searchQuery}"`,
        clear: () => {
          state.searchQuery = '';
          if (catalogSearchInput) catalogSearchInput.value = '';
          if (heroSearchInput) heroSearchInput.value = '';
          if (clearSearchBtn) clearSearchBtn.style.display = 'none';
          applyFilters();
        }
      });
    }

    if (badges.length > 0) {
      activeFiltersBar.style.display = 'flex';
      activeFilterTags.innerHTML = badges.map((b, idx) => `
        <span class="active-tag">
          ${escapeHtml(b.label)}
          <button type="button" data-idx="${idx}" aria-label="Remove filter">✕</button>
        </span>
      `).join('');

      activeFilterTags.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.getAttribute('data-idx'), 10);
          if (badges[idx]) badges[idx].clear();
        });
      });
    } else {
      activeFiltersBar.style.display = 'none';
      activeFilterTags.innerHTML = '';
    }
  }

  function updateCategoryTabs() {
    if (!categoryTabs) return;
    categoryTabs.querySelectorAll('.cat-pill').forEach(btn => {
      const cat = btn.getAttribute('data-category');
      if (cat.toLowerCase() === state.activeCategory.toLowerCase()) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  window.resetCarPlazaFilters = function() {
    state.activeCategory = 'all';
    state.activeBrand = 'all';
    state.activeCarModel = 'all';
    state.searchQuery = '';
    state.sortBy = 'featured';

    if (catalogSearchInput) catalogSearchInput.value = '';
    if (heroSearchInput) heroSearchInput.value = '';
    if (clearSearchBtn) clearSearchBtn.style.display = 'none';
    if (brandFilterSelect) brandFilterSelect.value = 'all';
    if (carModelFilterSelect) carModelFilterSelect.value = 'all';
    if (sortFilterSelect) sortFilterSelect.value = 'featured';

    updateCategoryTabs();
    updateBrandCardsActiveState();
    applyFilters();
  };

  // --- Product Specification Quick View Modal ---

  async function openProductModal(productId) {
    if (!productModal) return;

    let product = state.products.find(p => p.id === productId);

    // If API is available, fetch latest details from /api/products/:id
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/products/${productId}`);
        if (res.ok) {
          const json = await res.json();
          if (json.data) product = json.data;
        }
      } catch (e) {
        console.warn('Modal fetch error, using cache:', e);
      }
    }

    if (!product) return;
    state.selectedProduct = product;

    // Fill Modal Data
    modalProductImage.src = product.imageUrl;
    modalProductImage.alt = product.title;
    modalDiscountTag.textContent = product.discountPercentage ? `-${product.discountPercentage}% OFF` : 'GENUINE';
    modalCategory.textContent = product.category;
    modalTitle.textContent = product.title;
    modalRatingText.textContent = `${product.rating || '4.8'} (${product.ratingCount || 100}+ reviews)`;
    modalPrice.textContent = `₹${product.price.toLocaleString('en-IN')}`;

    if (product.originalPrice) {
      modalOriginalPrice.textContent = `₹${product.originalPrice.toLocaleString('en-IN')}`;
      modalOriginalPrice.style.display = 'inline-block';
      const savings = product.originalPrice - product.price;
      modalSavings.textContent = `Save ₹${savings.toLocaleString('en-IN')}`;
      modalSavings.style.display = 'inline-block';
    } else {
      modalOriginalPrice.style.display = 'none';
      modalSavings.style.display = 'none';
    }

    modalCompatibility.textContent = product.carModelCompatibility || 'Universal Fit';
    modalDescription.textContent = product.description || 'Genuine NHONE automotive product with manufacturer warranty.';

    // Brand info
    const brandObj = state.brands.find(b => b.name.toLowerCase() === product.brand.toLowerCase());
    modalBrandOrigin.textContent = brandObj ? `${brandObj.origin || 'Imported'} • ${brandObj.tagline || ''}` : product.brand;

    // Render Key-Value Specifications Table
    if (product.specifications && Object.keys(product.specifications).length > 0) {
      modalSpecsTable.innerHTML = Object.entries(product.specifications).map(([key, val]) => `
        <div class="spec-row">
          <span class="spec-key">${escapeHtml(key)}</span>
          <span class="spec-val">${escapeHtml(String(val))}</span>
        </div>
      `).join('');
      document.querySelector('.modal-specs-wrap').style.display = 'block';
    } else {
      document.querySelector('.modal-specs-wrap').style.display = 'none';
    }

    // Prepare Direct WhatsApp link
    const waMessage = encodeURIComponent(
      `Hi CarPlaza! I would like to order this item:\n*${product.title}*\nBrand: ${product.brand}\nPrice: ₹${product.price.toLocaleString('en-IN')}\nFitment: ${product.carModelCompatibility || 'Universal'}\n\nPlease share delivery / studio installation details.`
    );
    modalWhatsAppBtn.href = `https://wa.me/${SHOP_WA_INTL}?text=${waMessage}`;

    // Show Modal
    productModal.classList.add('open');
    productModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeProductModal() {
    if (!productModal) return;
    productModal.classList.remove('open');
    productModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    state.selectedProduct = null;
  }

  // --- Event Listeners Setup ---

  function setupEventListeners() {
    // Category Tabs click
    if (categoryTabs) {
      categoryTabs.querySelectorAll('.cat-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          state.activeCategory = btn.getAttribute('data-category');
          updateCategoryTabs();
          applyFilters();
        });
      });
    }

    // Brand Select dropdown change
    if (brandFilterSelect) {
      brandFilterSelect.addEventListener('change', (e) => {
        state.activeBrand = e.target.value;
        updateBrandCardsActiveState();
        applyFilters();
      });
    }

    // Car Model filter dropdown change
    if (carModelFilterSelect) {
      carModelFilterSelect.addEventListener('change', (e) => {
        state.activeCarModel = e.target.value;
        applyFilters();
      });
    }

    // Sort dropdown change
    if (sortFilterSelect) {
      sortFilterSelect.addEventListener('change', (e) => {
        state.sortBy = e.target.value;
        applyFilters();
      });
    }

    // Catalog Search input (with debounce)
    let searchDebounce;
    if (catalogSearchInput) {
      catalogSearchInput.addEventListener('input', (e) => {
        clearTimeout(searchDebounce);
        const val = e.target.value;
        if (clearSearchBtn) {
          clearSearchBtn.style.display = val.length > 0 ? 'block' : 'none';
        }
        searchDebounce = setTimeout(() => {
          state.searchQuery = val;
          applyFilters();
        }, 250);
      });
    }

    // Clear search button
    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        catalogSearchInput.value = '';
        clearSearchBtn.style.display = 'none';
        state.searchQuery = '';
        applyFilters();
      });
    }

    // Hero search input
    if (heroSearchBtn && heroSearchInput) {
      const handleHeroSearch = () => {
        const val = heroSearchInput.value.trim();
        if (val) {
          state.searchQuery = val;
          if (catalogSearchInput) {
            catalogSearchInput.value = val;
            if (clearSearchBtn) clearSearchBtn.style.display = 'block';
          }
          applyFilters();
          const catalogEl = document.getElementById('catalog');
          if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
        }
      };

      heroSearchBtn.addEventListener('click', handleHeroSearch);
      heroSearchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleHeroSearch();
      });
    }

    // Reset All Filters button
    if (resetFiltersBtn) {
      resetFiltersBtn.addEventListener('click', window.resetCarPlazaFilters);
    }

    // Modal Close
    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', closeProductModal);
    }

    if (productModal) {
      productModal.addEventListener('click', (e) => {
        if (e.target === productModal) {
          closeProductModal();
        }
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && productModal && productModal.classList.contains('open')) {
        closeProductModal();
      }
    });

    // Modal "Book Fitting Slot" Action
    if (modalBookSlotBtn) {
      modalBookSlotBtn.addEventListener('click', () => {
        const product = state.selectedProduct;
        closeProductModal();

        const contactEl = document.getElementById('contact');
        if (contactEl) {
          contactEl.scrollIntoView({ behavior: 'smooth' });
        }

        if (product) {
          const notesEl = document.getElementById('notes');
          if (notesEl) {
            notesEl.value = `Installation request for: ${product.title} (Brand: ${product.brand}, ₹${product.price})`;
          }
          const serviceEl = document.getElementById('service');
          if (serviceEl) {
            if (product.category.includes('Interior')) {
              serviceEl.value = 'Interior Accessories';
            } else if (product.category.includes('Lighting')) {
              serviceEl.value = 'Lighting & Electronics';
            } else if (product.category.includes('Exterior')) {
              serviceEl.value = 'Exterior Detailing';
            }
          }
        }
      });
    }

    // Footer brand click filters
    document.querySelectorAll('#footerBrandsList a').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const brandName = link.getAttribute('data-brand');
        if (brandName) {
          state.activeBrand = brandName;
          if (brandFilterSelect) brandFilterSelect.value = brandName;
          updateBrandCardsActiveState();
          applyFilters();
          const catalogEl = document.getElementById('catalog');
          if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // Booking form submission
    if (bookingForm) {
      bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const vehicle = document.getElementById('vehicle').value.trim();
        const service = document.getElementById('service').value;
        const date = document.getElementById('date').value;
        const notes = document.getElementById('notes').value.trim();

        if (!name || !phone || !vehicle || !service || !date) {
          showFormStatus('Please complete all required fields.', 'error');
          return;
        }

        // WhatsApp direct notification link
        const bookingWaMsg = encodeURIComponent(
          `*New Fitting Slot Reservation - CarPlaza*\nName: ${name}\nPhone: ${phone}\nVehicle: ${vehicle}\nService: ${service}\nPreferred Date: ${date}\nNotes: ${notes || 'None'}`
        );

        const waUrl = `https://wa.me/${SHOP_WA_INTL}?text=${bookingWaMsg}`;

        showFormStatus(
          `Thank you, ${name}! Your slot request for ${vehicle} on ${date} has been recorded. <a href="${waUrl}" target="_blank" rel="noopener" style="color:#ffffff;text-decoration:underline;font-weight:700;display:inline-block;margin-top:0.4rem;">Click here to confirm directly on WhatsApp &raquo;</a>`,
          'success'
        );

        bookingForm.reset();
      });
    }
  }

  function showFormStatus(msg, type) {
    if (!formStatus) return;
    formStatus.innerHTML = msg;
    formStatus.className = `form-status ${type}`;
    formStatus.style.display = 'block';
  }

  // --- Mobile Navigation & Sticky Header ---

  function setupNavigation() {
    if (hamburger && navLinks) {
      hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
      });

      navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          hamburger.classList.remove('active');
          navLinks.classList.remove('active');
        });
      });
    }

    // Scroll Navbar Effect
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // --- Scroll Reveal Animations ---

  function setupIntersectionObservers() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  }

  // --- Stats Counter Animation ---

  function setupStatsCounter() {
    const statCards = document.querySelectorAll('.stat-number');
    if (!statCards.length) return;

    const counterObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-target'), 10) || 0;
          const suffix = el.getAttribute('data-suffix') || '';
          let count = 0;
          const duration = 1600;
          const stepTime = 25;
          const totalSteps = duration / stepTime;
          const increment = target / totalSteps;

          const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
              el.textContent = `${target}${suffix}`;
              clearInterval(timer);
            } else {
              el.textContent = `${Math.floor(count)}${suffix}`;
            }
          }, stepTime);

          obs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    statCards.forEach(card => counterObserver.observe(card));
  }

  // Helper utility
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Run app
  init();
});
