/**
 * MnR WhatsApp & Payment System
 * ─────────────────────────────────────────────────────────────────────────────
 * Pengaturan terpusat untuk integrasi WhatsApp dan modal pembayaran QRIS.
 * Nomor resmi admin: 6285211385618 (0852-1138-5618).
 * ─────────────────────────────────────────────────────────────────────────────
 */

const adminWhatsApp = "6285211385618";

/* ── WhatsApp URL Builder ────────────────────────────────── */

/**
 * Membangun URL WhatsApp dengan pesan yang sudah di-encode
 * @param {string} message
 * @returns {string}
 */
function buildWhatsAppURL(message) {
    const encoded = encodeURIComponent(message);
    return `https://wa.me/${adminWhatsApp}?text=${encoded}`;
}

/**
 * Membuka WhatsApp di tab baru
 * @param {string} message
 */
function openWhatsApp(message) {
    window.open(buildWhatsAppURL(message), '_blank', 'noopener,noreferrer');
}

/* ── Template Pesan Sesuai Panduan MnR ────────────────────── */

/**
 * Format pesan checkout sesuai instruksi:
 * 
 * "Halo MnR, saya ingin melakukan pembelian.
 * 
 * Produk:
 * [PRODUCT NAME]
 * 
 * Jumlah:
 * [QUANTITY]
 * 
 * Total:
 * Rp[TOTAL]
 * 
 * Saya sudah melakukan pembayaran melalui QRIS.
 * 
 * Saya akan mengirimkan screenshot bukti pembayaran melalui chat ini.
 * 
 * Terima kasih."
 */
function buildCheckoutMessage(orderData) {
    const productName = orderData.name || (orderData.items ? orderData.items.map(i => i.name).join(', ') : 'Scrunchie MnR');
    const quantity = orderData.quantity ? `${orderData.quantity} pcs` : (orderData.items ? `${orderData.items.length} pcs` : '1 pcs');
    const totalPrice = orderData.total ? formatPrice(orderData.total) : (orderData.price ? formatPrice(orderData.price) : 'Rp6.000');

    return `Halo MnR, saya ingin melakukan pembelian.

Produk:
${productName}

Jumlah:
${quantity}

Total:
${totalPrice}

Saya sudah melakukan pembayaran melalui QRIS.

Saya akan mengirimkan screenshot bukti pembayaran melalui chat ini.

Terima kasih.`;
}

/**
 * Pesan pertanyaan umum / ketersediaan produk
 */
function buildInquiryMessage(product = null) {
    if (product) {
        return `Halo MnR, saya ingin bertanya mengenai ketersediaan produk ${product.name} (${product.id}). Apakah masih bisa dipesan?`;
    }
    return `Halo MnR, saya tertarik dengan koleksi scrunchie upcycled MnR. Boleh info lebih lanjut?`;
}

/**
 * Pesan donasi kain (Give Fabric a Second Life)
 */
function buildFabricDonationMessage() {
    return `Halo MnR, saya memiliki kain yang sudah tidak terpakai dan ingin saya berikan kepada MnR untuk didaur ulang menjadi aksesori upcycled. Bagaimana alur dan ketentuannya?`;
}

/* ── Modal Pembayaran QRIS ───────────────────────────────── */

let _currentModalOrder = null;

/**
 * Buka modal pembayaran QRIS
 * @param {Object} orderData - bisa berupa object produk atau bundle
 */
function openPaymentModal(orderData) {
    // Normalisasi orderData
    if (orderData.items && Array.isArray(orderData.items)) {
        // Bundle
        _currentModalOrder = {
            name: orderData.name || orderData.items.map(i => i.name).join(' + '),
            id: orderData.id || 'BUNDLE-MNR',
            quantity: orderData.items.length,
            total: orderData.total || (orderData.items.length * (MNR_CONFIG.itemPrice || 6000)),
            price: orderData.total || (orderData.items.length * (MNR_CONFIG.itemPrice || 6000))
        };
    } else {
        // Single product
        const qty = orderData.quantity || 1;
        const price = orderData.price || 6000;
        _currentModalOrder = {
            name: orderData.name,
            id: orderData.id,
            quantity: qty,
            price: price,
            total: price * qty
        };
    }

    const overlay = document.getElementById('payment-modal');
    if (!overlay) {
        console.warn('[MnR] payment-modal element tidak ditemukan.');
        return;
    }

    // Update elemen-elemen modal
    const productNameEl   = document.getElementById('modal-product-name');
    const productIdEl     = document.getElementById('modal-product-id');
    const productPriceEl  = document.getElementById('modal-product-price');
    const productQtyEl    = document.getElementById('modal-product-qty');
    const totalPriceEl    = document.getElementById('modal-total-price');
    const qrisImg         = document.getElementById('modal-qris-img');

    if (productNameEl)  productNameEl.textContent  = _currentModalOrder.name;
    if (productIdEl)    productIdEl.textContent    = _currentModalOrder.id;
    if (productPriceEl) productPriceEl.textContent = formatPrice(_currentModalOrder.price);
    if (productQtyEl)   productQtyEl.textContent   = `${_currentModalOrder.quantity} pcs`;
    if (totalPriceEl)   totalPriceEl.textContent   = formatPrice(_currentModalOrder.total);

    // QRIS image asli
    if (qrisImg) {
        qrisImg.src = 'assets/QRIS.jpeg';
        qrisImg.alt = 'QRIS MnR — Scan untuk Pembayaran';
    }

    // Tampilkan modal
    overlay.classList.add('open');
    document.body.classList.add('modal-open');
}

/**
 * Tutup modal pembayaran
 */
function closePaymentModal() {
    const overlay = document.getElementById('payment-modal');
    if (overlay) {
        overlay.classList.remove('open');
    }
    document.body.classList.remove('modal-open');
    _currentModalOrder = null;
}

/**
 * Konfirmasi pembayaran — buka WhatsApp dengan pesan template
 */
function confirmPaymentViaWhatsApp() {
    if (!_currentModalOrder) return;
    const message = buildCheckoutMessage(_currentModalOrder);
    openWhatsApp(message);
}

/* ── Event Listener Modal & Link WhatsApp ────────────────── */

function initPaymentModal() {
    const overlay = document.getElementById('payment-modal');
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closePaymentModal();
        });
    }

    const closeBtn = document.getElementById('modal-close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', closePaymentModal);
    }

    const cancelBtn = document.getElementById('modal-cancel-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closePaymentModal);
    }

    const confirmBtn = document.getElementById('modal-confirm-btn');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', confirmPaymentViaWhatsApp);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closePaymentModal();
    });
}

/**
 * Inisialisasi link dengan atribut data-wa
 */
function initWhatsAppLinks() {
    document.querySelectorAll('[data-wa]').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            const type = el.dataset.wa;
            let message = '';

            if (type === 'fabric') {
                message = buildFabricDonationMessage();
            } else if (type === 'general') {
                message = buildInquiryMessage();
            } else {
                message = 'Halo MnR, saya ingin bertanya tentang produk Anda.';
            }

            openWhatsApp(message);
        });

        if (el.tagName === 'A') {
            const type = el.dataset.wa;
            let msg = type === 'fabric' ? buildFabricDonationMessage() : buildInquiryMessage();
            el.href = buildWhatsAppURL(msg);
            el.target = '_blank';
            el.rel = 'noopener noreferrer';
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initPaymentModal();
    initWhatsAppLinks();
});
