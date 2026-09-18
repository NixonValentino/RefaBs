/**
 * MnR Recommendation & Set Builder
 * ─────────────────────────────────────────────────────────────────────────────
 * 1. "Temukan Scrunchie Sesuai Budgetmu" (Budget Recommendation)
 * 2. "Buat Pilihanmu" (Build Your MnR Set)
 * 
 * Seluruh produk memiliki harga seragam: Rp6.000 / pcs.
 * Perhitungan: Rp6.000 × jumlah produk <= budget.
 * ─────────────────────────────────────────────────────────────────────────────
 */

document.addEventListener('DOMContentLoaded', () => {
    if (typeof MNR_PRODUCTS === 'undefined') {
        console.warn('[MnR Rec] products.js belum dimuat.');
        return;
    }

    initBudgetRecommendation();
    initSetBuilder();
});

/* ══════════════════════════════════════════════════════════
   1. TEMUKAN SCRUNCHIE SESUAI BUDGETMU
   ══════════════════════════════════════════════════════════ */

function initBudgetRecommendation() {
    const input  = document.getElementById('rec-budget-input');
    const btn    = document.getElementById('rec-submit');
    const result = document.getElementById('rec-results');

    if (!btn && !input) return;

    const submit = () => {
        const raw = (input?.value || '').replace(/[^0-9]/g, '');
        const budget = parseInt(raw, 10);

        if (!budget || budget <= 0) {
            shakeInput(input);
            return;
        }

        renderBudgetRecommendations(budget);

        if (result) {
            result.classList.add('active');
            result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    };

    if (btn) btn.addEventListener('click', submit);
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') submit();
        });

        input.addEventListener('input', () => {
            const raw = input.value.replace(/[^0-9]/g, '');
            input.value = raw;
        });

        input.addEventListener('blur', () => {
            const raw = input.value.replace(/[^0-9]/g, '');
            const num = parseInt(raw, 10);
            if (num > 0) {
                input.value = num.toLocaleString('id-ID');
            }
        });

        input.addEventListener('focus', () => {
            const raw = input.value.replace(/[^0-9]/g, '');
            input.value = raw;
        });
    }
}

function renderBudgetRecommendations(budget) {
    const container = document.getElementById('rec-results');
    if (!container) return;

    const itemPrice = MNR_CONFIG.itemPrice || 6000;
    const maxPieces = Math.floor(budget / itemPrice);

    if (maxPieces <= 0) {
        container.innerHTML = `
            <div class="rec-empty-state">
                <p class="rec-empty-state__title">Budget Belum Mencukupi</p>
                <p class="rec-empty-state__desc">
                    Semua scrunchie handmade MnR memiliki harga seragam <strong>${formatPrice(itemPrice)}</strong> / pcs.<br>
                    Coba masukkan nominal mulai dari <strong>${formatPrice(itemPrice)}</strong>.
                </p>
            </div>
        `;
        return;
    }

    const availableProducts = MNR_PRODUCTS.filter(p => p.stock > 0 && p.category !== 'Pouch');
    const totalStock = availableProducts.reduce((sum, p) => sum + p.stock, 0);
    const actualPieces = Math.min(maxPieces, totalStock);
    const totalSpend = actualPieces * itemPrice;
    const remainingBudget = budget - totalSpend;

    // Ambil produk rekomendasi teratas sesuai ketersediaan
    const recommendedProducts = availableProducts.slice(0, Math.min(actualPieces, 4));

    let html = `
        <div class="rec-summary-banner">
            <div class="rec-summary-banner__header">
                <div>
                    <span class="rec-badge-tag">Rekomendasi Terbaik</span>
                    <h3 class="rec-summary-banner__title">
                        Bisa Bawa Pulang ${actualPieces} Pcs Scrunchie
                    </h3>
                </div>
                <div class="rec-summary-banner__total">
                    <span class="rec-label">Total Pembelian</span>
                    <strong class="rec-amount">${formatPrice(totalSpend)}</strong>
                    ${remainingBudget > 0 
                        ? `<span class="rec-remaining">Sisa budget: ${formatPrice(remainingBudget)}</span>` 
                        : `<span class="rec-remaining rec-remaining--exact">Pas dengan budgetmu</span>`}
                </div>
            </div>
            <p class="rec-summary-banner__note">
                Dihitung dari harga resmi <strong>${formatPrice(itemPrice)} / pcs</strong>. Setiap helai dijahit tangan dari kain upcycled berkualitas.
            </p>
        </div>

        <div class="rec-cards-grid">
            ${recommendedProducts.map(p => buildRecProductCard(p)).join('')}
        </div>

        <div class="rec-actions">
            <a href="catalog.html" class="btn btn--primary">Lihat Seluruh Koleksi (${availableProducts.length} Varian)</a>
        </div>
    `;

    container.innerHTML = html;
}

function buildRecProductCard(product) {
    const stockStatus = getStockStatus(product.stock);
    const isLow = product.stock <= MNR_CONFIG.lowStockThreshold;

    return `
        <article class="rec-card" onclick="location.href='product.html?id=${product.id}'">
            <div class="rec-card__media">
                <img src="${product.image}" alt="${product.name} — MnR" loading="lazy">
                ${isLow ? `<span class="rec-card__stock-tag">${stockStatus.label}</span>` : ''}
            </div>
            <div class="rec-card__info">
                <div class="rec-card__top">
                    <span class="rec-card__id">${product.id}</span>
                    <span class="rec-card__category">${product.categoryLabel || product.category}</span>
                </div>
                <h4 class="rec-card__name">${product.name}</h4>
                <div class="rec-card__price">${formatPrice(product.price)}</div>
                <p class="rec-card__desc">${product.shortDescription || ''}</p>
                <div class="rec-card__cta">
                    <span>Lihat Produk →</span>
                </div>
            </div>
        </article>
    `;
}

/* ══════════════════════════════════════════════════════════
   2. BUAT PILIHANMU — Set Builder (Kombinasi Paket)
   ══════════════════════════════════════════════════════════ */

function initSetBuilder() {
    const input  = document.getElementById('build-budget-input');
    const btn    = document.getElementById('build-submit');
    const result = document.getElementById('build-results');

    if (!btn && !input) return;

    const submit = () => {
        const raw    = (input?.value || '').replace(/[^0-9]/g, '');
        const budget = parseInt(raw, 10);

        if (!budget || budget <= 0) {
            shakeInput(input);
            return;
        }

        renderSetBuilderResult(budget);

        if (result) {
            result.classList.add('active');
            result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    };

    if (btn) btn.addEventListener('click', submit);

    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') submit();
        });

        input.addEventListener('input', () => {
            const raw = input.value.replace(/[^0-9]/g, '');
            input.value = raw;
        });

        input.addEventListener('blur', () => {
            const raw = input.value.replace(/[^0-9]/g, '');
            const num = parseInt(raw, 10);
            if (num > 0) input.value = num.toLocaleString('id-ID');
        });

        input.addEventListener('focus', () => {
            const raw = input.value.replace(/[^0-9]/g, '');
            input.value = raw;
        });
    }
}

/**
 * Susun kombinasi produk terbaik sesuai budget tanpa melebihi stok aktual
 */
function renderSetBuilderResult(budget) {
    const container = document.getElementById('build-results');
    if (!container) return;

    const itemPrice = MNR_CONFIG.itemPrice || 6000;
    const targetCount = Math.floor(budget / itemPrice);

    if (targetCount <= 0) {
        container.innerHTML = `
            <div class="rec-empty-state">
                <p class="rec-empty-state__title">Budget di Bawah Harga Satuan</p>
                <p class="rec-empty-state__desc">
                    Harga setiap scrunchie MnR adalah <strong>${formatPrice(itemPrice)}</strong>.<br>
                    Silakan masukkan budget minimal <strong>${formatPrice(itemPrice)}</strong> untuk menyusun paket pilihanmu.
                </p>
            </div>
        `;
        return;
    }

    // Ambil varian scrunchie yang tersedia dengan stok
    const inStock = MNR_PRODUCTS.filter(p => p.stock > 0 && p.category !== 'Pouch');
    const totalAvailableStock = inStock.reduce((sum, p) => sum + p.stock, 0);

    const actualCount = Math.min(targetCount, totalAvailableStock);
    const selectedItems = [];

    // Pilih varian unik terlebih dahulu untuk variasi maksimal
    let pool = [...inStock];
    while (selectedItems.length < actualCount && pool.length > 0) {
        for (let i = 0; i < pool.length && selectedItems.length < actualCount; i++) {
            const p = pool[i];
            const currentSelectedCount = selectedItems.filter(item => item.id === p.id).length;
            if (currentSelectedCount < p.stock) {
                selectedItems.push(p);
            }
        }
        // Filter out yang stoknya sudah habis terpakai di selectedItems
        pool = pool.filter(p => {
            const count = selectedItems.filter(item => item.id === p.id).length;
            return count < p.stock;
        });
    }

    const total = selectedItems.length * itemPrice;
    const remaining = budget - total;

    // Siapkan bundle order data untuk pembayaran langsung
    window._currentBuiltSet = {
        name: `Paket Pilihan MnR (${selectedItems.length} pcs)`,
        id: 'SET-MNR-' + selectedItems.length,
        items: selectedItems,
        quantity: selectedItems.length,
        total: total,
        price: total
    };

    const itemsHTML = selectedItems.map((p, idx) => `
        <div class="build-item-row">
            <span class="build-item-num">0${idx + 1}</span>
            <img class="build-item-thumb" src="${p.image}" alt="${p.name}">
            <div class="build-item-details">
                <span class="build-item-name">${p.name}</span>
                <span class="build-item-spec">${p.material}</span>
            </div>
            <span class="build-item-price">${formatPrice(p.price)}</span>
        </div>
    `).join('');

    container.innerHTML = `
        <div class="build-bundle-card">
            <div class="build-bundle-card__header">
                <div>
                    <span class="rec-badge-tag">Kombinasi Terpilih</span>
                    <h3 class="build-bundle-card__title">Paket ${selectedItems.length} Varian MnR</h3>
                </div>
                <div class="build-bundle-card__calc">
                    <div class="build-calc-row">
                        <span>${selectedItems.length} pcs × ${formatPrice(itemPrice)}</span>
                        <strong>${formatPrice(total)}</strong>
                    </div>
                    ${remaining > 0 
                        ? `<div class="build-calc-remaining">Sisa Budget: <strong>${formatPrice(remaining)}</strong></div>`
                        : `<div class="build-calc-remaining build-calc-remaining--exact">Sesuai Budget Anda</div>`}
                </div>
            </div>

            <div class="build-items-list">
                ${itemsHTML}
            </div>

            <div class="build-bundle-footer">
                <button type="button" class="btn btn--primary btn--full" onclick="openPaymentModal(window._currentBuiltSet)">
                    Beli Paket Ini Sekarang (${formatPrice(total)})
                </button>
                <p class="build-bundle-hint">
                    Pembayaran aman via QRIS. Konfirmasi pesanan dan kirim bukti via WhatsApp.
                </p>
            </div>
        </div>
    `;
}

/* ── Utility: Shake animation on invalid input ────────────── */
function shakeInput(input) {
    if (!input) return;
    input.style.animation = 'none';
    input.offsetHeight; // reflow
    input.style.animation = 'shake 0.4s ease';
    input.focus();

    setTimeout(() => {
        input.style.animation = '';
    }, 500);

    if (!document.querySelector('#shake-keyframe')) {
        const style = document.createElement('style');
        style.id = 'shake-keyframe';
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                20% { transform: translateX(-6px); }
                40% { transform: translateX(6px); }
                60% { transform: translateX(-4px); }
                80% { transform: translateX(4px); }
            }
        `;
        document.head.appendChild(style);
    }
}
