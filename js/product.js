/**
 * MnR Product Detail Logic
 * ─────────────────────────────────────────────────────────────────────────────
 * Menampilkan halaman detail produk berdasarkan parameter URL ?id=MNR-001.
 * Termasuk galeri interaktif (studio & lifestyle), penghitungan kuantitas dinamis,
 * cerita material kain upcycled, modal pembayaran QRIS, dan integrasi WhatsApp.
 * ─────────────────────────────────────────────────────────────────────────────
 */

document.addEventListener('DOMContentLoaded', () => {
    if (typeof MNR_PRODUCTS === 'undefined') {
        console.error('[MnR Product] products.js belum dimuat.');
        return;
    }

    const params  = new URLSearchParams(window.location.search);
    const id      = params.get('id') || 'MNR-001';
    const product = getProductById(id) || MNR_PRODUCTS[0];

    if (!product) {
        renderNotFound();
        return;
    }

    renderProductDetail(product);
    initGallery(product);
    initQuantitySelector(product);
    initActions(product);
    updatePageMeta(product);
});

let _selectedQuantity = 1;

/* ══════════════════════════════════════════════════════════
   RENDER PRODUCT DETAIL
   ══════════════════════════════════════════════════════════ */
function renderProductDetail(product) {
    const stockStatus = getStockStatus(product.stock);
    const isSoldOut   = product.stock === 0;

    // Breadcrumb
    const breadcrumb = document.getElementById('product-breadcrumb-name');
    if (breadcrumb) breadcrumb.textContent = product.name;

    // ID & Nama
    const idEl = document.getElementById('product-id');
    if (idEl) idEl.textContent = product.id;

    const nameEl = document.getElementById('product-name');
    if (nameEl) nameEl.textContent = product.name;

    // Kategori
    const catEl = document.getElementById('product-category');
    if (catEl) catEl.textContent = product.categoryLabel || product.category;

    // Harga
    const priceEl = document.getElementById('product-price');
    if (priceEl) priceEl.textContent = formatPrice(product.price);

    // Status Stok
    const stockEl = document.getElementById('product-stock');
    if (stockEl) {
        stockEl.textContent = stockStatus.label;
        stockEl.className = `product-info__stock-label ${stockStatus.class}`;
    }

    // Deskripsi
    const descEl = document.getElementById('product-description');
    if (descEl) descEl.textContent = product.description;

    // Cerita Kain (Fabric Story)
    const storyEl = document.getElementById('product-fabric-story');
    if (storyEl) storyEl.textContent = product.fabricStory || product.description;

    // Metadata
    const materialEl = document.getElementById('product-material');
    if (materialEl) materialEl.textContent = product.material;

    const colorEl = document.getElementById('product-color-name');
    if (colorEl) colorEl.textContent = product.color;

    const colorSwatchEl = document.getElementById('product-color-swatch');
    if (colorSwatchEl && product.colorHex) colorSwatchEl.style.background = product.colorHex;

    const stockNumEl = document.getElementById('product-stock-num');
    if (stockNumEl) stockNumEl.textContent = `${product.stock} pcs`;

    // Tombol Beli Sekarang
    const buyBtn = document.getElementById('btn-buy-now');
    if (buyBtn) {
        if (isSoldOut) {
            buyBtn.textContent = 'Stok Habis';
            buyBtn.disabled = true;
            buyBtn.classList.add('btn--disabled');
        } else {
            buyBtn.textContent = 'Beli Sekarang';
            buyBtn.disabled = false;
        }
    }
}

/* ══════════════════════════════════════════════════════════
   INTERACTIVE GALLERY (Studio + Lifestyle)
   ══════════════════════════════════════════════════════════ */
function initGallery(product) {
    const mainImg    = document.getElementById('gallery-main-img');
    const thumbsWrap = document.getElementById('gallery-thumbs');

    if (!mainImg) return;

    // Susun daftar foto: Foto Produk + Foto Lifestyle
    const images = [
        { src: product.image, label: 'Tampilan Studio' },
        ...(product.lifestyleImage ? [{ src: product.lifestyleImage, label: 'Foto Pemakaian' }] : [])
    ];

    mainImg.src = images[0].src;
    mainImg.alt = `${product.name} — Scrunchie MnR`;

    if (thumbsWrap) {
        thumbsWrap.innerHTML = images.map((item, i) => `
            <button class="product-gallery__thumb${i === 0 ? ' active' : ''}"
                    data-img="${item.src}"
                    type="button"
                    aria-label="${item.label}">
                <img src="${item.src}" alt="${product.name} ${item.label}">
                <span class="product-gallery__thumb-label">${item.label}</span>
            </button>
        `).join('');

        thumbsWrap.querySelectorAll('.product-gallery__thumb').forEach(thumb => {
            thumb.addEventListener('click', () => {
                thumbsWrap.querySelectorAll('.product-gallery__thumb').forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');

                const src = thumb.dataset.img;
                mainImg.style.opacity = '0.3';
                setTimeout(() => {
                    mainImg.src = src;
                    mainImg.style.opacity = '1';
                }, 120);
            });
        });
    }
}

/* ══════════════════════════════════════════════════════════
   QUANTITY SELECTOR & DYNAMIC TOTAL
   ══════════════════════════════════════════════════════════ */
function initQuantitySelector(product) {
    const decBtn   = document.getElementById('qty-decrease');
    const incBtn   = document.getElementById('qty-increase');
    const qtyInput = document.getElementById('qty-input');
    const totalEl  = document.getElementById('qty-calc-total');

    if (!qtyInput) return;

    const maxStock = Math.max(1, product.stock);

    const updateCalc = () => {
        if (qtyInput) qtyInput.value = _selectedQuantity;
        if (totalEl) {
            const total = _selectedQuantity * product.price;
            totalEl.textContent = formatPrice(total);
        }
    };

    if (decBtn) {
        decBtn.addEventListener('click', () => {
            if (_selectedQuantity > 1) {
                _selectedQuantity--;
                updateCalc();
            }
        });
    }

    if (incBtn) {
        incBtn.addEventListener('click', () => {
            if (_selectedQuantity < maxStock) {
                _selectedQuantity++;
                updateCalc();
            }
        });
    }

    updateCalc();
}

/* ══════════════════════════════════════════════════════════
   BUY NOW & WHATSAPP CHAT ACTIONS
   ══════════════════════════════════════════════════════════ */
function initActions(product) {
    const buyBtn  = document.getElementById('btn-buy-now');
    const chatBtn = document.getElementById('btn-chat');

    if (buyBtn && product.stock > 0) {
        buyBtn.addEventListener('click', () => {
            openPaymentModal({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: _selectedQuantity,
                total: product.price * _selectedQuantity
            });
        });
    }

    if (chatBtn) {
        chatBtn.href = buildWhatsAppURL(buildInquiryMessage(product));
        chatBtn.target = '_blank';
        chatBtn.rel = 'noopener noreferrer';
    }
}

function updatePageMeta(product) {
    document.title = `${product.name} — MnR Official`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
        metaDesc.content = `${product.name} — Scrunchie upcycled handmade MnR. ${product.shortDescription} Harga ${formatPrice(product.price)}.`;
    }
}

function renderNotFound() {
    const main = document.querySelector('.product-page') || document.body;
    main.innerHTML = `
        <div class="container" style="padding: 120px 24px; text-align: center;">
            <h1 style="font-family: var(--font-heading); margin-bottom: 16px;">Produk Tidak Ditemukan</h1>
            <p style="color: var(--color-text-muted); margin-bottom: 32px;">Produk yang Anda cari tidak tersedia atau URL tidak sesuai.</p>
            <a href="catalog.html" class="btn btn--primary">Kembali ke Koleksi</a>
        </div>
    `;
}
