/**
 * MnR Catalog Page Logic
 * ─────────────────────────────────────────────────────────────────────────────
 * Menampilkan katalog produk dengan tata letak editorial fashion,
 * pencarian real-time, filter kategori, status ketersediaan stok,
 * dan interaksi visual produk & lifestyle.
 * ─────────────────────────────────────────────────────────────────────────────
 */

document.addEventListener('DOMContentLoaded', () => {
    if (typeof MNR_PRODUCTS === 'undefined') {
        console.error('[MnR Catalog] products.js belum dimuat.');
        return;
    }

    initCatalog();
});

let _catalogActiveFilter = 'all';
let _catalogSearchQuery = '';

function initCatalog() {
    renderCatalogGrid(MNR_PRODUCTS);
    initSearch();
    initFilters();
}

/* ══════════════════════════════════════════════════════════
   RENDER EDITORIAL CATALOG GRID
   ══════════════════════════════════════════════════════════ */
function renderCatalogGrid(products) {
    const grid = document.getElementById('catalog-grid');
    const countEl = document.getElementById('catalog-count');
    if (!grid) return;

    if (countEl) {
        countEl.textContent = `${products.length} produk ditemukan`;
    }

    if (products.length === 0) {
        grid.innerHTML = `
            <div class="catalog-empty">
                <div class="catalog-empty__icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </div>
                <h3 class="catalog-empty__title">Produk Tidak Ditemukan</h3>
                <p class="catalog-empty__desc">Coba gunakan kata kunci pencarian atau filter kategori lainnya.</p>
                <button type="button" class="btn btn--outline" onclick="resetCatalogFilters()">Reset Filter</button>
            </div>
        `;
        return;
    }

    // Bangun grid editorial dengan variasi visual
    grid.innerHTML = products.map((product, index) => buildEditorialCard(product, index)).join('');

    // Trigger visual entry animation
    requestAnimationFrame(() => {
        grid.querySelectorAll('.editorial-card').forEach((card, i) => {
            setTimeout(() => {
                card.classList.add('is-ready');
            }, i * 60);
        });
    });
}

/**
 * Membangun card produk berkarakter editorial fashion
 */
function buildEditorialCard(product, index) {
    const stockStatus = getStockStatus(product.stock);
    const isSoldOut   = product.stock === 0;
    const isLimited   = product.tags?.includes('limited') && product.stock > 0;
    const isFeatured  = index === 0; // Item pertama tampil dengan proporsi editorial utama

    const cardClass = [
        'editorial-card',
        isFeatured ? 'editorial-card--featured' : '',
        isSoldOut ? 'editorial-card--soldout' : ''
    ].filter(Boolean).join(' ');

    const lifestyleImage = product.lifestyleImage || product.image;

    return `
        <article class="${cardClass}"
                 data-product-id="${product.id}"
                 data-category="${product.category.toLowerCase()}"
                 data-tags="${(product.tags || []).join(',')}">
            
            <a href="product.html?id=${product.id}" class="editorial-card__gallery-link" aria-label="Lihat detail ${product.name}">
                <div class="editorial-card__img-container">
                    <!-- Foto Produk Studio -->
                    <img class="editorial-card__img editorial-card__img--primary"
                         src="${product.image}"
                         alt="${product.name} — Scrunchie MnR"
                         loading="lazy">
                    
                    <!-- Foto Lifestyle saat Hover -->
                    <img class="editorial-card__img editorial-card__img--hover"
                         src="${lifestyleImage}"
                         alt="${product.name} — Gaya Pemakaian"
                         loading="lazy">

                    <!-- Badges Minimalis -->
                    <div class="editorial-card__badges">
                        ${isLimited ? `<span class="badge badge--limited">Koleksi Terbatas</span>` : ''}
                        ${isSoldOut ? `<span class="badge badge--soldout">Habis</span>` : ''}
                        ${isFeatured ? `<span class="badge badge--featured">Koleksi Pilihan</span>` : ''}
                    </div>

                    <div class="editorial-card__quick-view">
                        <span>Lihat Detail & Cerita</span>
                    </div>
                </div>
            </a>

            <div class="editorial-card__body">
                <div class="editorial-card__meta">
                    <span class="editorial-card__id">${product.id}</span>
                    <span class="editorial-card__category">${product.categoryLabel || product.category}</span>
                </div>

                <div class="editorial-card__title-row">
                    <h3 class="editorial-card__name">
                        <a href="product.html?id=${product.id}">${product.name}</a>
                    </h3>
                    <div class="editorial-card__price">${formatPrice(product.price)}</div>
                </div>

                <p class="editorial-card__desc">${product.shortDescription}</p>

                <div class="editorial-card__footer">
                    <span class="editorial-card__stock ${stockStatus.class}">${stockStatus.label}</span>
                    <a href="product.html?id=${product.id}" class="editorial-card__action">
                        Lihat Produk →
                    </a>
                </div>
            </div>
        </article>
    `;
}

/* ══════════════════════════════════════════════════════════
   SEARCH LOGIC
   ══════════════════════════════════════════════════════════ */
function initSearch() {
    const searchInput = document.getElementById('catalog-search');
    const clearBtn    = document.getElementById('search-clear');
    if (!searchInput) return;

    let debounceTimer;

    searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            _catalogSearchQuery = searchInput.value.trim().toLowerCase();
            applyFiltersAndSearch();
        }, 200);

        if (clearBtn) {
            clearBtn.style.display = searchInput.value ? 'inline-flex' : 'none';
        }
    });

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            _catalogSearchQuery = '';
            clearBtn.style.display = 'none';
            applyFiltersAndSearch();
            searchInput.focus();
        });
    }
}

/* ══════════════════════════════════════════════════════════
   FILTER TABS LOGIC
   ══════════════════════════════════════════════════════════ */
function initFilters() {
    const tabs = document.querySelectorAll('.filter-tab');
    if (!tabs.length) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            _catalogActiveFilter = (tab.dataset.filter || 'all').toLowerCase();
            applyFiltersAndSearch();
        });
    });
}

function applyFiltersAndSearch() {
    let filtered = MNR_PRODUCTS.filter(product => {
        // Filter kategori/tag
        if (_catalogActiveFilter !== 'all') {
            const matchesCat = product.category.toLowerCase() === _catalogActiveFilter;
            const matchesTag = (product.tags || []).some(t => t.toLowerCase() === _catalogActiveFilter);
            if (!matchesCat && !matchesTag) return false;
        }

        // Pencarian teks
        if (_catalogSearchQuery) {
            const query = _catalogSearchQuery;
            const inName = product.name.toLowerCase().includes(query);
            const inId   = product.id.toLowerCase().includes(query);
            const inCat  = product.category.toLowerCase().includes(query);
            const inMat  = (product.material || '').toLowerCase().includes(query);
            const inDesc = (product.description || '').toLowerCase().includes(query);
            if (!inName && !inId && !inCat && !inMat && !inDesc) return false;
        }

        return true;
    });

    renderCatalogGrid(filtered);
}

function resetCatalogFilters() {
    const searchInput = document.getElementById('catalog-search');
    if (searchInput) searchInput.value = '';
    _catalogSearchQuery = '';

    const tabs = document.querySelectorAll('.filter-tab');
    tabs.forEach((tab, i) => {
        tab.classList.toggle('active', i === 0);
    });
    _catalogActiveFilter = 'all';

    applyFiltersAndSearch();
}
