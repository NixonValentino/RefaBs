/**
 * MnR Product Data — Single Source of Truth
 * ─────────────────────────────────────────────────────────────────────────────
 * Setiap produk MnR berharga Rp6.000 / pcs.
 * Dibuat handmade dari kain daur ulang pilihan.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const MNR_PRODUCTS = [
    {
        id: "MNR-001",
        name: "Golden Hour",
        category: "Satin",
        categoryLabel: "Satin",
        tags: ["satin", "gold", "available"],
        price: 6000,
        stock: 8,
        material: "Kain satin upcycled",
        color: "Emas Berkilau",
        colorHex: "#D4AF37",
        image: "assets/Katalog/GoldenHour.jpg",
        lifestyleImage: null,
        gallery: [
            "assets/Katalog/GoldenHour.jpg"
        ],
        shortDescription: "Karakter warna emas hangat dari kain satin yang dimanfaatkan kembali.",
        description: "Golden Hour lahir dari kain satin upcycled yang diberikan cerita baru. Kilau keemasan hangatnya menangkap nuansa cahaya senja yang tenang. Setiap scrunchie dijahit secara handmade dengan teliti, memastikan sentuhan personal pada setiap helainya. Nyaman di rambut, lembut, dan siap menemani hari-harimu.",
        fabricStory: "Dibuat dari sisa kain satin bernilai tinggi yang diselamatkan sebelum terbuang. Lembut di rambut tanpa membuat kusut."
    },
    {
        id: "MNR-002",
        name: "Midnight Soul",
        category: "Batik",
        categoryLabel: "Batik",
        tags: ["batik", "dark", "available"],
        price: 6000,
        stock: 8,
        material: "Kain batik upcycled",
        color: "Batik Hitam",
        colorHex: "#1a1a1a",
        image: "assets/Katalog/MidnightSoul.jpg",
        lifestyleImage: null,
        gallery: [
            "assets/Katalog/MidnightSoul.jpg"
        ],
        shortDescription: "Motif batik hitam klasik yang sarat karakter dan cerita tradisi.",
        description: "Midnight Soul memadukan kedalaman warna gelap dengan elegansi motif batik Nusantara. Dibuat dari potongan kain batik pilihan yang diselamatkan, motifnya menyimpan warisan budaya yang kini hadir dalam bentuk aksesori modern. Pilihan tepat untuk outfit monokrom maupun gaya harian yang berkarakter.",
        fabricStory: "Potongan motif batik tradisional nusantara dengan dasar kain katun berkualitas tinggi yang lembut dan berdaya tahan."
    },
    {
        id: "MNR-003",
        name: "Tropical Batik",
        category: "Batik",
        categoryLabel: "Batik",
        tags: ["batik", "color", "available"],
        price: 6000,
        stock: 7,
        material: "Kain batik katun upcycled",
        color: "Batik Ungu Tropis",
        colorHex: "#6B4C82",
        image: "assets/Katalog/TropicalBatik.jpg",
        lifestyleImage: null,
        gallery: [
            "assets/Katalog/TropicalBatik.jpg"
        ],
        shortDescription: "Perpaduan corak batik tropis yang hidup, ceria, dan penuh energi.",
        description: "Tropical Batik memancarkan kegembiraan lewat paduan warna dan motif batik tropis yang berani. Setiap potongan kain membawa keunikan tersendiri, menciptakan komposisi corak yang tidak akan pernah sama persis pada produk lainnya. Memberikan sentuhan segar dan playful untuk setiap gaya rambutmu.",
        fabricStory: "Kain sisa produksi busana batik bermotif flora tropis Indonesia dengan gradasi warna ungu dan magenta yang vibran."
    },
    {
        id: "MNR-004",
        name: "Lavender Batik",
        category: "Batik",
        categoryLabel: "Batik",
        tags: ["batik", "limited", "available"],
        price: 6000,
        stock: 4,
        material: "Kain batik halus upcycled",
        color: "Batik Lilac Lavender",
        colorHex: "#9D84B7",
        image: "assets/Katalog/LavenderBatik.jpg",
        lifestyleImage: null,
        gallery: [
            "assets/Katalog/LavenderBatik.jpg"
        ],
        shortDescription: "Nuansa ungu lavender lembut dengan motif batik anggun yang terbatas.",
        description: "Lavender Batik menghadirkan ketenangan lewat gradasi warna lilac pastel berpadu motif batik lembut. Diproduksi dalam jumlah sangat terbatas karena ketersediaan kain yang langka. Sentuhan manis yang understated untuk melengkapi penampilan feminin, clean, dan mindful.",
        fabricStory: "Kain batik sutra campuran berwarna pastel lavender yang langka dan sangat lembut saat disentuh."
    },
    {
        id: "MNR-005",
        name: "Midnight Plain",
        category: "Plain",
        categoryLabel: "Polos",
        tags: ["plain", "limited", "available"],
        price: 6000,
        stock: 3,
        material: "Kain katun hitam polos upcycled",
        color: "Hitam Pekat",
        colorHex: "#222222",
        image: "assets/Katalog/MidnightPlain.jpg",
        lifestyleImage: null,
        gallery: [
            "assets/Katalog/MidnightPlain.jpg"
        ],
        shortDescription: "Warna hitam polos esensial. Simpel, timeless, dan minim sampah.",
        description: "Midnight Plain membuktikan bahwa kesederhanaan punya daya tarik tersendiri. Menggunakan kain hitam polos daur ulang dengan tekstur rapi dan jahitan kokoh. Tanpa motif berlebih, murni mengutamakan fungsi, kenyamanan elastis, dan komitmen keberlanjutan.",
        fabricStory: "Kain katun tebal daur ulang sisa workshop garment lokal. Timeless, kokoh, dan selalu cocok untuk gaya apa pun."
    },
    {
        id: "MNR-006",
        name: "Batik Pouch",
        category: "Pouch",
        categoryLabel: "Pouch",
        tags: ["pouch", "batik", "new", "available"],
        price: 15000,
        stock: 6,
        material: "Kain batik upcycled & furing katun",
        color: "Batik Hitam Klasik",
        colorHex: "#2A231D",
        image: "assets/Katalog/pouch.jpg",
        lifestyleImage: null,
        gallery: [
            "assets/Katalog/pouch.jpg"
        ],
        shortDescription: "Pouch jinjing serbaguna elegan dari kain batik daur ulang pilihan.",
        description: "Batik Pouch MnR adalah perpaduan keindahan motif batik nusantara dengan kepraktisan modern. Dibuat secara handmade dari sisa kain batik katun berkualitas tinggi, pouch ini kokoh, berfuring rapi, dan dilengkapi pegangan pita satin hitam yang nyaman digenggam. Sangat pas untuk menyimpan perlengkapan esensial harian seperti kosmetik, ponsel, kartu, maupun scrunchie MnR koleksimu.",
        fabricStory: "Potongan kain batik cap nusantara bermotif sulur daun klasik yang diselamatkan dari sisa produksi busana lokal, dijahit kembali menjadi aksesori fungsional bernilai tinggi."
    }
];

/**
 * MnR Impact Data
 */
const MNR_IMPACT = {
    fabricRepurposed: "16+", // meter kain diselamatkan
    scrunchiesCreated: 36,  // Total stok awal
    uniquePieces: 6          // Desain unik
};

/**
 * MnR Config
 */
const MNR_CONFIG = {
    whatsapp: "6285211385618",
    whatsappDisplay: "0852-1138-5618",
    instagram: "@mnr.official",
    currency: "Rp",
    itemPrice: 6000,
    lowStockThreshold: 3
};

/**
 * Utility: Format price to Indonesian Rupiah (Contoh: "Rp6.000")
 */
function formatPrice(price) {
    if (price === undefined || price === null || isNaN(price)) return "Rp6.000";
    return "Rp" + Number(price).toLocaleString("id-ID");
}

/**
 * Utility: Get product by ID
 */
function getProductById(id) {
    return MNR_PRODUCTS.find(p => p.id === id) || null;
}

/**
 * Utility: Get stock status label sesuai panduan revisi:
 * - stock === 0: "Habis"
 * - stock <= 3: "Tersisa X pcs"
 * - stock > 3: "Tersedia X pcs"
 */
function getStockStatus(stock, threshold = MNR_CONFIG.lowStockThreshold) {
    if (stock === 0) {
        return { label: "Habis", class: "sold-out" };
    }
    if (stock <= threshold) {
        return { label: `Tersisa ${stock} pcs`, class: "low-stock" };
    }
    return { label: `Tersedia ${stock} pcs`, class: "in-stock" };
}
