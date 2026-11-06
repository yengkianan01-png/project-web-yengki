(() => {
  const storeData = window.StoreData ? window.StoreData.load() : {
    products: window.PRODUCTS ?? [],
    config: window.STORE_CONFIG ?? {},
  };
  const products = storeData.products;
  const config = storeData.config;
  const storeName = config.name || "rahmanflower";
  const cart = new Map();
  let activeCategory = "Semua";
  let toastTimer;
  let contactFallbackBound = false;
  const languageSelect = document.querySelector("#language-select");
  let currentLanguage = "id";

  const translations = {
    id: {
      "nav.label": "Navigasi utama", "nav.collection": "Koleksi", "nav.story": "Cerita kami", "nav.contact": "Kontak", "nav.location": "Lokasi",
      "cart.open": "Buka keranjang", "cart.close": "Tutup keranjang", "cart.button": "Keranjang", "cart.eyebrow": "PILIHANMU", "cart.title": "Keranjang",
      "cart.empty": "Keranjangmu masih kosong.", "cart.continue": "Lihat koleksi", "cart.subtotal": "Subtotal produk", "cart.shippingEstimate": "Ongkir",
      "cart.packingCost": "Biaya packing", "cart.total": "Total sementara (belum termasuk ongkir)", "cart.checkout": "Pesan via WhatsApp", "cart.checkoutNote": "Ongkir dan total akhir akan dikonfirmasi admin sebelum pembayaran.",
      "payment.title": "Metode pembayaran", "payment.bank": "Transfer bank", "payment.qris": "QRIS", "payment.bankPending": "Detail rekening akan dikirim admin melalui WhatsApp setelah pesanan dikonfirmasi.",
      "payment.bankDetails": "{bank} · a.n. {account} · {number}", "payment.qrisPending": "Kode QRIS akan dikirim admin melalui WhatsApp setelah pesanan dikonfirmasi.",
      "payment.qrisAlt": "Kode pembayaran QRIS", "payment.confirmNote": "Bayar hanya setelah admin mengonfirmasi pesanan dan total akhir.",
      "delivery.eyebrow": "SESUAIKAN PESANAN", "delivery.title": "Pengiriman & packing", "delivery.address": "Alamat tujuan",
      "delivery.addressPlaceholder": "Alamat lengkap termasuk kota dan kode pos",
      "delivery.shipping": "Pilih kurir", "delivery.packing": "Pilihan packing", "delivery.free": "Gratis", "delivery.unconfigured": "tarif belum diatur",
      "delivery.unavailable": "Belum tersedia", "delivery.estimateIncomplete": "Lengkapi pilihan",
      "delivery.addressRequired": "Isi alamat tujuan lengkap agar admin dapat memeriksa ongkir.",
      "delivery.adminNote": "Ongkir belum dihitung otomatis. Admin akan mengecek alamat dan mengonfirmasi ongkir serta total akhir melalui WhatsApp.",
      "delivery.adminConfirm": "Dikonfirmasi admin",
      "delivery.courierWebsite": "Buka situs {name}", "delivery.trackCekresi": "Lacak resi di Cekresi.com",
      "delivery.checkoutIncomplete": "Isi alamat tujuan, pilih kurir, dan lengkapi pilihan packing.",
      "hero.eyebrow": "DIPETIK DENGAN HATI, DIKIRIM DENGAN CINTA", "hero.titleFirst": "Dari kebun,", "hero.titleSecond": "untuk hal", "hero.titleEmphasis": "indah.",
      "hero.description": "Kenali suasana kebun kami dan temukan pilihan bunga, termasuk bougenvil dalam pot, untuk mempercantik ruang dan momen istimewa.",
      "hero.cta": "Jelajahi koleksi", "hero.note": "Dirawat alami · Dipilih satu per satu",
      "ticker.label": "Keunggulan rahmanflower", "ticker.fresh": "SEGAR SETIAP HARI", "ticker.grown": "DITUMBUHKAN DENGAN CINTA", "ticker.gifts": "HADIAH YANG BERKESAN",
      "catalog.eyebrow": "DIPILIH UNTUKMU", "catalog.title": "Temukan favoritmu", "catalog.intro": "Kebaikan dari kebun, untuk membuat setiap momen terasa lebih istimewa.",
      "catalog.filters": "Filter kategori", "catalog.search": "Cari produk...", "catalog.empty": "Belum ada produk yang cocok. Coba kata kunci lain, ya.",
      "story.eyebrow": "DARI KEBUN KECIL KAMI", "story.titleFirst": "Yang sederhana,", "story.titleSecond": "selalu punya", "story.titleEmphasis": "cara.",
      "story.description": "Kami percaya keindahan tak perlu berlebihan. Setiap bunga dirangkai dengan teliti, setiap anggur dipilih saat matang. Dari kebun kami, langsung untuk momen berhargamu.",
      "story.cta": "Kenali rahmanflower", "story.imageLabel": "TUMBUH DENGAN TENANG",
      "order.eyebrow": "PESAN DENGAN MUDAH", "order.title": "Cara memesan", "order.intro": "Pilih tanaman atau bunga, lalu kami bantu konfirmasi pesanan sampai siap dikirim.",
      "order.step1Title": "Pilih produk", "order.step1Text": "Tambahkan produk dan jumlah yang diinginkan ke keranjang.",
      "order.step2Title": "Atur pengiriman", "order.step2Text": "Isi alamat tujuan, pilih kurir dan packing. Admin akan mengonfirmasi ongkir.",
      "order.step3Title": "Kirim pesanan", "order.step3Text": "Pilih transfer bank atau QRIS, lalu kirim rincian pesanan melalui WhatsApp.",
      "order.step4Title": "Konfirmasi & bayar", "order.step4Text": "Tunggu konfirmasi ketersediaan dan total akhir. Kami kirim detail rekening atau kode QRIS sebelum pembayaran.",
      "order.paymentNote": "Pembayaran dilakukan setelah detail pesanan dan ongkir dikonfirmasi oleh admin. Situs ini tidak memproses pembayaran otomatis.",
      "testimonials.eyebrow": "CERITA DARI PELANGGAN", "testimonials.title": "Pengalaman mereka",
      "testimonials.intro": "Kami senang mendengar cerita setelah tanaman atau bunga sampai di rumah.",
      "testimonials.empty": "Testimoni pelanggan akan ditampilkan di sini setelah mendapat izin.", "testimonials.cta": "Bagikan pengalaman Anda",
      "contact.eyebrow": "MOMEN BAIK DIMULAI DARI SINI", "contact.title": "Ada yang ingin kamu rayakan?", "contact.description": "Kami bantu pilihkan bunga dan buah terbaik untuknya.", "contact.cta": "Hubungi kami",
      "contact.emailLabel": "Email: {email}",
      "location.eyebrow": "KUNJUNGI KAMI", "location.title": "Temukan kebun kami", "location.intro": "Lihat lokasi kebun dan toko kami di Google Maps sebelum berkunjung.",
      "location.mapTitle": "Peta lokasi kebun dan toko", "location.unset": "Lokasi kebun belum diatur.",
      "location.configure": "Tambahkan alamat atau nama tempat di STORE_CONFIG.mapLocation pada products.js.",
      "location.openMaps": "Buka di Google Maps", "footer.tagline": "Hal-hal indah, tumbuh dari sini.", "footer.social": "Media sosial",
      "social.instagram": "Instagram", "social.tiktok": "TikTok", "social.facebook": "Facebook",
      "social.invalid": "Tautan {name} tidak valid. Gunakan URL yang diawali http:// atau https://.",
      "social.missing": "Tambahkan tautan {name} di products.js untuk mengaktifkannya.", "brand.home": "beranda",
      "hero.imageAlt": "Rangkaian bunga berwarna lembut", "hero.caption": "KEBUN YANG TENANG",
      "hero.stickerMade": "dibuat dengan", "hero.stickerCare": "sepenuh hati", "story.imageAlt": "Bunga segar di kebun",
      "whatsapp.aria": "Hubungi layanan pelanggan melalui WhatsApp", "whatsapp.label": "Chat kami", "whatsapp.missing": "Tambahkan nomor WhatsApp di products.js untuk mengaktifkan layanan pelanggan.",
      "checkout.whatsappMissing": "Tambahkan nomor WhatsApp di products.js untuk menerima pesanan.",
      "checkout.message": "Halo {store}, saya ingin memesan:\n{items}\n\nAlamat tujuan: {address}\nKurir pilihan: {shipping}\nOngkir: dikonfirmasi admin\nPacking: {packing} — {packingCost}\nSubtotal produk: {subtotal}\nTotal sementara (belum termasuk ongkir): {total}\nMetode pembayaran pilihan: {payment}\n\nMohon konfirmasi ketersediaan, ongkir, total akhir, dan detail pembayaran sebelum saya membayar.",
      "checkout.inquiry": "Halo {store}, saya ingin bertanya tentang koleksi.", "category.all": "Semua", "category.flowers": "Bunga", "category.grapes": "Anggur",
      "tag.favorite": "FAVORIT", "tag.bestSeller": "BEST SELLER", "tag.potted": "TANAMAN POT", "tag.newHarvest": "PANEN BARU",
      "product.add": "Tambah {name} ke keranjang", "product.decrease": "Kurangi {name}", "product.increase": "Tambah {name}",
      "added": "{name} ditambahkan ke keranjang"
    },
    en: {
      "nav.label": "Main navigation", "nav.collection": "Collection", "nav.story": "Our story", "nav.contact": "Contact", "nav.location": "Location",
      "cart.open": "Open cart", "cart.close": "Close cart", "cart.button": "Cart", "cart.eyebrow": "YOUR SELECTION", "cart.title": "Your cart",
      "cart.empty": "Your cart is empty.", "cart.continue": "Browse collection", "cart.subtotal": "Product subtotal", "cart.shippingEstimate": "Shipping",
      "cart.packingCost": "Packaging", "cart.total": "Provisional total (shipping not included)", "cart.checkout": "Order via WhatsApp", "cart.checkoutNote": "The admin will confirm shipping and the final total before payment.",
      "payment.title": "Payment method", "payment.bank": "Bank transfer", "payment.qris": "QRIS",
      "payment.bankPending": "The admin will send bank account details via WhatsApp after confirming your order.",
      "payment.bankDetails": "{bank} · account name: {account} · {number}", "payment.qrisPending": "The admin will send the QRIS code via WhatsApp after confirming your order.",
      "payment.qrisAlt": "QRIS payment code", "payment.confirmNote": "Pay only after the admin confirms your order and final total.",
      "delivery.eyebrow": "CUSTOMIZE YOUR ORDER", "delivery.title": "Delivery & packaging", "delivery.address": "Delivery address",
      "delivery.addressPlaceholder": "Full address including city and postal code",
      "delivery.shipping": "Choose a courier", "delivery.packing": "Packaging option", "delivery.free": "Free", "delivery.unconfigured": "rate not set",
      "delivery.unavailable": "Unavailable", "delivery.estimateIncomplete": "Complete selections",
      "delivery.addressRequired": "Enter the full destination address so the admin can check shipping.",
      "delivery.adminNote": "Shipping is not calculated automatically. The admin will check the address and confirm shipping and the final total via WhatsApp.",
      "delivery.adminConfirm": "Confirmed by admin",
      "delivery.courierWebsite": "Open {name} website", "delivery.trackCekresi": "Track a parcel on Cekresi.com",
      "delivery.checkoutIncomplete": "Enter a destination address, choose a courier, and select packaging.",
      "hero.eyebrow": "PICKED WITH CARE, DELIVERED WITH LOVE", "hero.titleFirst": "From our garden,", "hero.titleSecond": "for life's", "hero.titleEmphasis": "beautiful moments.",
      "hero.description": "Discover our garden and flowers, including potted bougainvillea, to brighten your space and special moments.",
      "hero.cta": "Explore collection", "hero.note": "Naturally cared for · Handpicked",
      "ticker.label": "Why rahmanflower", "ticker.fresh": "FRESH EVERY DAY", "ticker.grown": "GROWN WITH LOVE", "ticker.gifts": "GIFTS TO REMEMBER",
      "catalog.eyebrow": "PICKED FOR YOU", "catalog.title": "Find your favorite", "catalog.intro": "Garden-grown goodness to make every moment feel a little more special.",
      "catalog.filters": "Filter by category", "catalog.search": "Search products...", "catalog.empty": "No matching products. Try another search.",
      "story.eyebrow": "FROM OUR LITTLE GARDEN", "story.titleFirst": "Simple things", "story.titleSecond": "always find", "story.titleEmphasis": "a way.",
      "story.description": "We believe beauty doesn't need excess. Every flower is arranged with care, and every grape is picked when ripe. From our garden, straight to your special moments.",
      "story.cta": "Discover rahmanflower", "story.imageLabel": "GROWN WITH CARE",
      "order.eyebrow": "ORDER WITH EASE", "order.title": "How to order", "order.intro": "Choose a plant or flowers, and we will confirm your order before it is sent.",
      "order.step1Title": "Choose products", "order.step1Text": "Add the products and quantities you want to your cart.",
      "order.step2Title": "Set delivery", "order.step2Text": "Enter your destination address and choose a courier and packaging. The admin will confirm shipping.",
      "order.step3Title": "Send your order", "order.step3Text": "Choose bank transfer or QRIS, then send your order details via WhatsApp.",
      "order.step4Title": "Confirm & pay", "order.step4Text": "Wait for availability and final-total confirmation. We will send the bank details or QRIS code before payment.",
      "order.paymentNote": "Payment is made after the admin confirms your order and shipping. This website does not process payments automatically.",
      "testimonials.eyebrow": "CUSTOMER STORIES", "testimonials.title": "Their experiences",
      "testimonials.intro": "We love hearing how your plants or flowers look when they arrive.",
      "testimonials.empty": "Customer testimonials will appear here once permission has been granted.", "testimonials.cta": "Share your experience",
      "contact.eyebrow": "A LOVELY MOMENT STARTS HERE", "contact.title": "Something worth celebrating?", "contact.description": "We'll help you choose the perfect flowers and fruit.", "contact.cta": "Get in touch",
      "contact.emailLabel": "Email: {email}",
      "location.eyebrow": "COME VISIT", "location.title": "Find our garden", "location.intro": "See our garden and shop on Google Maps before your visit.",
      "location.mapTitle": "Map to our garden and shop", "location.unset": "Garden location has not been set.",
      "location.configure": "Add the address or place name to STORE_CONFIG.mapLocation in products.js.",
      "location.openMaps": "Open in Google Maps", "footer.tagline": "Beautiful things grow from here.", "footer.social": "Social media",
      "social.instagram": "Instagram", "social.tiktok": "TikTok", "social.facebook": "Facebook",
      "social.invalid": "The {name} link is invalid. Use a URL starting with http:// or https://.",
      "social.missing": "Add a {name} link in products.js to enable it.", "brand.home": "home",
      "hero.imageAlt": "A soft-colored flower arrangement", "hero.caption": "THE QUIET GARDEN",
      "hero.stickerMade": "made with", "hero.stickerCare": "care", "story.imageAlt": "Fresh flowers in the garden",
      "whatsapp.aria": "Contact customer service on WhatsApp", "whatsapp.label": "Chat with us", "whatsapp.missing": "Add a WhatsApp number in products.js to enable customer support.",
      "checkout.whatsappMissing": "Add a WhatsApp number in products.js to receive orders.",
      "checkout.message": "Hello {store}, I would like to place an order:\n{items}\n\nDestination address: {address}\nPreferred courier: {shipping}\nShipping: to be confirmed by admin\nPackaging: {packing} — {packingCost}\nProduct subtotal: {subtotal}\nProvisional total (shipping not included): {total}\nPreferred payment method: {payment}\n\nPlease confirm availability, shipping, final total, and payment details before I pay.",
      "checkout.inquiry": "Hello {store}, I have a question about your collection.", "category.all": "All", "category.flowers": "Flowers", "category.grapes": "Grapes",
      "tag.favorite": "FAVORITE", "tag.bestSeller": "BEST SELLER", "tag.potted": "POTTED PLANT", "tag.newHarvest": "NEW HARVEST",
      "product.add": "Add {name} to cart", "product.decrease": "Decrease {name}", "product.increase": "Increase {name}",
      "added": "{name} added to cart"
    },
    ar: {
      "nav.label": "التنقل الرئيسي", "nav.collection": "المجموعة", "nav.story": "قصتنا", "nav.contact": "اتصل بنا", "nav.location": "الموقع",
      "cart.open": "افتح السلة", "cart.close": "أغلق السلة", "cart.button": "السلة", "cart.eyebrow": "اختياراتك", "cart.title": "سلة التسوق",
      "cart.empty": "سلتك فارغة حاليًا.", "cart.continue": "تصفح المجموعة", "cart.subtotal": "المجموع الفرعي للمنتجات", "cart.shippingEstimate": "الشحن",
      "cart.packingCost": "التغليف", "cart.total": "الإجمالي المؤقت (لا يشمل الشحن)", "cart.checkout": "اطلب عبر واتساب", "cart.checkoutNote": "سيؤكد المسؤول تكلفة الشحن والإجمالي النهائي قبل الدفع.",
      "payment.title": "طريقة الدفع", "payment.bank": "تحويل بنكي", "payment.qris": "QRIS",
      "payment.bankPending": "سيرسل المسؤول بيانات الحساب البنكي عبر واتساب بعد تأكيد الطلب.",
      "payment.bankDetails": "{bank} · اسم الحساب: {account} · {number}", "payment.qrisPending": "سيرسل المسؤول رمز QRIS عبر واتساب بعد تأكيد الطلب.",
      "payment.qrisAlt": "رمز دفع QRIS", "payment.confirmNote": "يرجى الدفع فقط بعد تأكيد المسؤول للطلب والإجمالي النهائي.",
      "delivery.eyebrow": "خصص طلبك", "delivery.title": "التوصيل والتغليف", "delivery.address": "عنوان التوصيل",
      "delivery.addressPlaceholder": "العنوان الكامل مع المدينة والرمز البريدي",
      "delivery.shipping": "اختر شركة الشحن", "delivery.packing": "خيار التغليف", "delivery.free": "مجاني", "delivery.unconfigured": "السعر غير محدد",
      "delivery.unavailable": "غير متاح", "delivery.estimateIncomplete": "أكمل الخيارات",
      "delivery.addressRequired": "أدخل العنوان الكامل ليتمكن المسؤول من التحقق من تكلفة الشحن.",
      "delivery.adminNote": "لا يتم حساب الشحن تلقائيًا. سيتحقق المسؤول من العنوان ويؤكد تكلفة الشحن والإجمالي النهائي عبر واتساب.",
      "delivery.adminConfirm": "يؤكده المسؤول",
      "delivery.courierWebsite": "افتح موقع {name}", "delivery.trackCekresi": "تتبع الشحنة عبر Cekresi.com",
      "delivery.checkoutIncomplete": "أدخل عنوان التوصيل واختر شركة الشحن والتغليف.",
      "hero.eyebrow": "نقطفها بعناية ونوصلها بمحبة", "hero.titleFirst": "من حديقتنا،", "hero.titleSecond": "لأجمل", "hero.titleEmphasis": "لحظاتك.",
      "hero.description": "اكتشف أجواء حديقتنا ونبات الجهنمية في أصص، إلى جانب الزهور التي تضفي جمالًا على منزلك ومناسباتك.",
      "hero.cta": "اكتشف المجموعة", "hero.note": "عناية طبيعية · اختيار يدوي",
      "ticker.label": "ما يميز rahmanflower", "ticker.fresh": "طازج كل يوم", "ticker.grown": "نزرعه بمحبة", "ticker.gifts": "هدايا لا تُنسى",
      "catalog.eyebrow": "اخترناها لك", "catalog.title": "اكتشف ما تحب", "catalog.intro": "خيرات الحديقة لتجعل كل لحظة أكثر تميزًا.",
      "catalog.filters": "تصفية حسب الفئة", "catalog.search": "ابحث عن المنتجات...", "catalog.empty": "لا توجد منتجات مطابقة. جرّب كلمة أخرى.",
      "story.eyebrow": "من حديقتنا الصغيرة", "story.titleFirst": "للأشياء البسيطة", "story.titleSecond": "دائمًا", "story.titleEmphasis": "طريقتها.",
      "story.description": "نؤمن أن الجمال لا يحتاج إلى مبالغة. ننسق كل زهرة بعناية ونختار العنب عند نضجه. من حديقتنا مباشرةً إلى لحظاتك الثمينة.",
      "story.cta": "تعرّف على rahmanflower", "story.imageLabel": "تنمو بعناية",
      "order.eyebrow": "اطلب بسهولة", "order.title": "طريقة الطلب", "order.intro": "اختر نباتًا أو زهورًا وسنؤكد تفاصيل طلبك قبل الإرسال.",
      "order.step1Title": "اختر المنتجات", "order.step1Text": "أضف المنتجات والكميات التي تريدها إلى السلة.",
      "order.step2Title": "حدد التوصيل", "order.step2Text": "أدخل عنوان الوجهة واختر شركة الشحن والتغليف. سيؤكد المسؤول تكلفة الشحن.",
      "order.step3Title": "أرسل الطلب", "order.step3Text": "اختر التحويل البنكي أو QRIS ثم أرسل تفاصيل الطلب عبر واتساب.",
      "order.step4Title": "أكد وادفع", "order.step4Text": "انتظر تأكيد التوفر والإجمالي النهائي. سنرسل بيانات الحساب أو رمز QRIS قبل الدفع.",
      "order.paymentNote": "يتم الدفع بعد تأكيد المسؤول للطلب والشحن. لا يعالج هذا الموقع المدفوعات تلقائيًا.",
      "testimonials.eyebrow": "قصص العملاء", "testimonials.title": "تجاربهم",
      "testimonials.intro": "يسعدنا معرفة رأيكم بعد وصول النباتات أو الزهور إلى منازلكم.",
      "testimonials.empty": "ستظهر آراء العملاء هنا بعد الحصول على موافقتهم.", "testimonials.cta": "شاركنا تجربتك",
      "contact.eyebrow": "لحظة جميلة تبدأ من هنا", "contact.title": "هل لديك مناسبة للاحتفال؟", "contact.description": "نساعدك في اختيار أجمل الزهور والفواكه.", "contact.cta": "تواصل معنا",
      "contact.emailLabel": "البريد الإلكتروني: {email}",
      "location.eyebrow": "تفضل بزيارتنا", "location.title": "اعثر على حديقتنا", "location.intro": "اعرض موقع حديقتنا ومتجرنا على خرائط Google قبل الزيارة.",
      "location.mapTitle": "خريطة موقع الحديقة والمتجر", "location.unset": "لم يتم تحديد موقع الحديقة.",
      "location.configure": "أضف العنوان أو اسم المكان في STORE_CONFIG.mapLocation داخل products.js.",
      "location.openMaps": "افتح في خرائط Google", "footer.tagline": "من هنا تنمو الأشياء الجميلة.", "footer.social": "وسائل التواصل الاجتماعي",
      "social.instagram": "إنستغرام", "social.tiktok": "تيك توك", "social.facebook": "فيسبوك",
      "social.invalid": "رابط {name} غير صالح. استخدم رابطًا يبدأ بـ http:// أو https://.",
      "social.missing": "أضف رابط {name} في products.js لتفعيله.", "brand.home": "الرئيسية",
      "hero.imageAlt": "تنسيق زهور بألوان هادئة", "hero.caption": "حديقة هادئة",
      "hero.stickerMade": "صُنع بكل", "hero.stickerCare": "عناية", "story.imageAlt": "زهور نضرة في الحديقة",
      "whatsapp.aria": "تواصل مع خدمة العملاء عبر واتساب", "whatsapp.label": "راسلنا", "whatsapp.missing": "أضف رقم واتساب في products.js لتفعيل خدمة العملاء.",
      "checkout.whatsappMissing": "أضف رقم واتساب في products.js لاستقبال الطلبات.",
      "checkout.message": "مرحبًا {store}، أود تقديم طلب:\n{items}\n\nعنوان التوصيل: {address}\nشركة الشحن المفضلة: {shipping}\nالشحن: يؤكده المسؤول\nالتغليف: {packing} — {packingCost}\nالمجموع الفرعي للمنتجات: {subtotal}\nالإجمالي المؤقت (لا يشمل الشحن): {total}\nطريقة الدفع المفضلة: {payment}\n\nيرجى تأكيد التوفر والشحن والإجمالي النهائي وبيانات الدفع قبل أن أدفع.",
      "checkout.inquiry": "مرحبًا {store}، لدي سؤال عن مجموعتكم.", "category.all": "الكل", "category.flowers": "زهور", "category.grapes": "عنب",
      "tag.favorite": "مفضل", "tag.bestSeller": "الأكثر مبيعًا", "tag.potted": "نبات في أصيص", "tag.newHarvest": "حصاد جديد",
      "product.add": "أضف {name} إلى السلة", "product.decrease": "قلل {name}", "product.increase": "أضف {name}",
      "added": "تمت إضافة {name} إلى السلة"
    }
  };
  const productTranslations = {
    en: {
      "mawar-pastel": ["Pastel Roses", "Flowers", "A bouquet of 12 pastel-toned roses. A lovely choice for birthdays, thank-you gifts, or special moments.", "FAVORITE"],
      "bouquet-senja": ["Sunset Bouquet", "Flowers", "A seasonal arrangement in warm colors and natural wrapping. A thoughtful way to brighten an ordinary day.", "BEST SELLER"],
      "tulip-putih": ["White Tulips", "Flowers", "A bouquet of 10 elegant white tulips. A graceful gift that conveys sincerity and calm.", ""],
      "bougenvil-pink": ["Pink Bougainvillea", "Flowers", "A potted bougainvillea with bright pink bracts for a patio or balcony. Place in a sunny spot and adjust watering to the soil.", "POTTED PLANT"],
      "bougenvil-putih": ["White Bougainvillea", "Flowers", "A potted white bougainvillea for a light, graceful garden or patio. Ask us about pot size and current plant condition.", "POTTED PLANT"],
      "bougenvil-ungu": ["Purple Bougainvillea", "Flowers", "A purple bougainvillea to add a bold accent outdoors. Choose a sunny spot and confirm color availability before ordering.", "POTTED PLANT"],
      "bougenvil-merah": ["Red Bougainvillea", "Flowers", "A potted red bougainvillea for a garden, yard, or patio. Ask us for the current plant photos and pot size.", "POTTED PLANT"],
      "anggur-hitam": ["Black Seedless Grapes", "Grapes", "Sweet, refreshing, seedless dark grapes. Enjoy as a snack, dessert, or a fruit to share.", "NEW HARVEST"],
      "anggur-hijau": ["Green Muscat Grapes", "Grapes", "Crisp green grapes with a fragrant aroma and balanced sweetness. Delicious chilled or served with fresh fruit.", ""],
      "anggur-merah": ["Red Globe Grapes", "Grapes", "Large, juicy red grapes for a fruit platter at home or a family gathering. Please confirm harvest availability before ordering.", "NEW HARVEST"]
    },
    ar: {
      "mawar-pastel": ["ورود بألوان هادئة", "زهور", "باقة من 12 وردة بألوان هادئة. هدية جميلة لأعياد الميلاد أو الشكر أو المناسبات الخاصة.", "مفضل"],
      "bouquet-senja": ["باقة الغروب", "زهور", "تنسيق موسمي بألوان دافئة وتغليف طبيعي. لمسة لطيفة لإضفاء البهجة على يوم عادي.", "الأكثر مبيعًا"],
      "tulip-putih": ["توليب أبيض", "زهور", "باقة من 10 زهور توليب بيضاء أنيقة. هدية رقيقة تعبّر عن الصدق والهدوء.", ""],
      "bougenvil-pink": ["جهنمية وردية", "زهور", "نبات جهنمية في أصيص بأزهار وردية زاهية للشرفة أو الفناء. ضعه في مكان مشمس واضبط الري حسب التربة.", "نبات في أصيص"],
      "bougenvil-putih": ["جهنمية بيضاء", "زهور", "جهنمية بيضاء في أصيص لإضفاء لمسة رقيقة على الحديقة أو الفناء. اسألنا عن حجم الأصيص وحالة النبات الحالية.", "نبات في أصيص"],
      "bougenvil-ungu": ["جهنمية بنفسجية", "زهور", "جهنمية بنفسجية لإضافة لون مميز إلى المساحات الخارجية. اختر مكانًا مشمسًا وتأكد من توفر اللون قبل الطلب.", "نبات في أصيص"],
      "bougenvil-merah": ["جهنمية حمراء", "زهور", "جهنمية حمراء في أصيص لتزيين الحديقة أو الفناء أو الشرفة. اسألنا عن صور النبات الحالية وحجم الأصيص.", "نبات في أصيص"],
      "anggur-hitam": ["عنب أسود بدون بذور", "عنب", "عنب داكن حلو ومنعش بدون بذور. استمتع به كوجبة خفيفة أو حلوى أو شاركه مع الآخرين.", "حصاد جديد"],
      "anggur-hijau": ["عنب مسقط أخضر", "عنب", "عنب أخضر مقرمش برائحة عطرة وحلاوة متوازنة. لذيذ باردًا أو مع الفواكه الطازجة.", ""],
      "anggur-merah": ["عنب ريد غلوب", "عنب", "حبات عنب حمراء كبيرة وعصيرية لطبق فواكه منزلي أو تجمع عائلي. يرجى التأكد من توفر المحصول قبل الطلب.", "حصاد جديد"]
    }
  };

  const productGrid = document.querySelector("#product-grid");
  const filters = document.querySelector("#category-filters");
  const searchInput = document.querySelector("#search-input");
  const cartOverlay = document.querySelector("#cart-overlay");
  const deliveryAddressInput = document.querySelector("#delivery-address");
  const shippingSelect = document.querySelector("#shipping-select");
  const packingSelect = document.querySelector("#packing-select");
  const paymentOptions = document.querySelector(".payment-options");
  document.querySelector("#qris-code").addEventListener("error", () => {
    const qrisCode = document.querySelector("#qris-code");
    qrisCode.hidden = true;
    if (paymentOptions.querySelector('input[name="payment-method"]:checked').value === "qris") {
      document.querySelector("#payment-info-text").textContent = t("payment.qrisPending");
    }
    console.error("Could not load the configured QRIS image.");
  });
  let formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: config.currency || "IDR",
    maximumFractionDigits: 0,
  });

  const formatPrice = (price) => formatter.format(price);
  const t = (key, values = {}) =>
    (translations[currentLanguage][key] || translations.id[key] || key).replace(
      /\{(\w+)\}/g,
      (match, name) => values[name] ?? match,
    );

  function localizeProduct(product) {
    const translated = productTranslations[currentLanguage]?.[product.id];
    if (!translated) return product;
    return {
      ...product,
      name: translated[0],
      category: translated[1],
      description: translated[2],
      tag: translated[3],
    };
  }

  function localizeOption(option) {
    const names = {
      jne: { en: "JNE", ar: "JNE" },
      jnt: { en: "J&T Express", ar: "J&T Express" },
      sicepat: { en: "SiCepat", ar: "SiCepat" },
      "pos-indonesia": { en: "POS Indonesia", ar: "بريد إندونيسيا" },
      standard: { en: "Standard packaging", ar: "تغليف عادي" },
      secure: { en: "Secure packaging", ar: "تغليف آمن" },
      gift: { en: "Gift packaging", ar: "تغليف هدايا" },
    };
    return names[option.id]?.[currentLanguage] || option.name;
  }

  function renderPaymentInfo() {
    const method = paymentOptions.querySelector('input[name="payment-method"]:checked').value;
    const payment = config.payment ?? {};
    const info = document.querySelector("#payment-info-text");
    const qrisCode = document.querySelector("#qris-code");
    qrisCode.hidden = true;
    qrisCode.removeAttribute("src");

    if (method === "bank") {
      const bankName = String(payment.bankName || "").trim();
      const accountName = String(payment.bankAccountName || "").trim();
      const accountNumber = String(payment.bankAccountNumber || "").trim();
      info.textContent = bankName && accountName && accountNumber
        ? `${t("payment.bankDetails", { bank: bankName, account: accountName, number: accountNumber })}\n${t("payment.confirmNote")}`
        : t("payment.bankPending");
      return;
    }

    const imageUrl = String(payment.qrisImageUrl || "").trim();
    if (imageUrl) {
      try {
        const parsedUrl = new URL(imageUrl);
        if (parsedUrl.protocol !== "https:" && parsedUrl.protocol !== "http:") {
          throw new Error("QRIS image URLs must use http or https.");
        }
        qrisCode.src = parsedUrl.href;
        qrisCode.hidden = false;
        info.textContent = t("payment.confirmNote");
        return;
      } catch (error) {
        console.error("Invalid QRIS image URL in products.js.", error);
      }
    }
    info.textContent = t("payment.qrisPending");
  }

  function populateDeliveryOptions() {
    const shippingOptions = config.shippingOptions ?? [];
    const packingOptions = config.packingOptions ?? [];
    const selectedShipping = shippingSelect.value;
    const selectedPacking = packingSelect.value;

    shippingSelect.innerHTML = shippingOptions
      .map((option) => `<option value="${escapeHtml(option.id)}">${escapeHtml(localizeOption(option))}</option>`)
      .join("");
    packingSelect.innerHTML = packingOptions
      .map((option) => {
        const priceLabel = Number.isFinite(option.price)
          ? ` — ${option.price === 0 ? t("delivery.free") : formatPrice(option.price)}`
          : ` — ${t("delivery.unconfigured")}`;
        return `<option value="${escapeHtml(option.id)}">${escapeHtml(localizeOption(option))}${priceLabel}</option>`;
      })
      .join("");
    if (shippingOptions.some((option) => option.id === selectedShipping)) shippingSelect.value = selectedShipping;
    if (packingOptions.some((option) => option.id === selectedPacking)) packingSelect.value = selectedPacking;

    document.querySelector("#delivery-options").hidden = shippingOptions.length === 0 || packingOptions.length === 0;
    updateCourierTrackingLink();
  }

  function updateCourierTrackingLink() {
    const trackingLink = document.querySelector("#courier-tracking-link");
    const shipping = (config.shippingOptions ?? []).find((option) => option.id === shippingSelect.value);
    if (!shipping?.websiteUrl) {
      trackingLink.hidden = true;
      trackingLink.removeAttribute("href");
      return;
    }

    try {
      const url = new URL(shipping.websiteUrl);
      if (url.protocol !== "https:") throw new Error("Courier website URLs must use https.");
      trackingLink.href = url.href;
      trackingLink.textContent = t("delivery.courierWebsite", { name: localizeOption(shipping) });
      trackingLink.hidden = false;
    } catch (error) {
      trackingLink.hidden = true;
      trackingLink.removeAttribute("href");
      console.error(`Invalid courier website URL for ${shipping.name} in products.js.`, error);
    }
  }

  function getDeliveryEstimate() {
    const address = deliveryAddressInput.value.trim();
    const shipping = (config.shippingOptions ?? []).find((option) => option.id === shippingSelect.value);
    const packing = (config.packingOptions ?? []).find((option) => option.id === packingSelect.value);
    const shippingConfigured = Boolean(shipping);
    const packingConfigured = packing && Number.isFinite(packing.price) && packing.price >= 0;

    return {
      address,
      shipping,
      packing,

      packingCost: packingConfigured ? packing.price : null,
      configured: Boolean(address && shippingConfigured && packingConfigured),
    };
  }

  function updateDeliverySummary(subtotal) {
    const estimate = getDeliveryEstimate();
    const shippingCost = document.querySelector("#shipping-cost");
    const packingCost = document.querySelector("#packing-cost");
    const note = document.querySelector("#delivery-note");
    const checkoutButton = document.querySelector("#checkout-button");

    document.querySelector("#cart-subtotal").textContent = formatPrice(subtotal);
    shippingCost.textContent = t("delivery.adminConfirm");
    packingCost.textContent =
      estimate.packingCost === null ? t("delivery.unconfigured") : estimate.packingCost === 0 ? t("delivery.free") : formatPrice(estimate.packingCost);
    document.querySelector("#cart-total").textContent = estimate.packingCost !== null
      ? formatPrice(subtotal + estimate.packingCost)
      : t("delivery.estimateIncomplete");

    note.textContent = estimate.address ? t("delivery.adminNote") : t("delivery.addressRequired");

    checkoutButton.disabled = !estimate.configured;
  }

  function renderFilters() {
    const categories = [...new Set(products.map((product) => product.category))];
    filters.innerHTML =
      `<button class="filter-chip${activeCategory === "Semua" ? " active" : ""}" type="button" data-category="Semua" aria-pressed="${activeCategory === "Semua"}">${escapeHtml(t("category.all"))}</button>` +
      categories
        .map(
          (category) =>
            `<button class="filter-chip${category === activeCategory ? " active" : ""}" type="button" data-category="${escapeHtml(category)}" aria-pressed="${category === activeCategory}">${escapeHtml(categoryLabel(category))}</button>`,
        )
        .join("");
  }

  function categoryLabel(category) {
    const categoryKeys = { Bunga: "category.flowers", Anggur: "category.grapes" };
    return t(categoryKeys[category] || category);
  }

  function renderProducts() {
    const query = searchInput.value.trim().toLocaleLowerCase();
    const visibleProducts = products.filter((product) => {
      const matchesCategory = activeCategory === "Semua" || product.category === activeCategory;
      const localizedProduct = localizeProduct(product);
      const matchesQuery = `${product.name} ${product.category} ${product.description} ${localizedProduct.name} ${localizedProduct.category} ${localizedProduct.description}`
        .toLocaleLowerCase()
        .includes(query);
      return matchesCategory && matchesQuery;
    });

    productGrid.innerHTML = visibleProducts
      .map((rawProduct, index) => {
        const product = localizeProduct(rawProduct);
        const tagKeys = { FAVORIT: "tag.favorite", "BEST SELLER": "tag.bestSeller", "TANAMAN POT": "tag.potted", "PANEN BARU": "tag.newHarvest" };
        return `
          <article class="product-card" style="--card-order:${index}">
            <div class="product-image-wrap">
              <img class="product-image" src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" loading="lazy" />
              ${product.tag ? `<span class="product-tag">${escapeHtml(tagKeys[product.tag] ? t(tagKeys[product.tag]) : product.tag)}</span>` : ""}
              <button class="quick-add" type="button" data-add="${escapeHtml(product.id)}" aria-label="${escapeHtml(t("product.add", { name: product.name }))}">+</button>
            </div>
            <div class="product-info">
              <div><p class="product-category">${escapeHtml(product.category)}</p><h3>${escapeHtml(product.name)}</h3></div>
              <p class="product-price">${formatPrice(product.price)}</p>
            </div>
            <p class="product-description">${escapeHtml(product.description)}</p>
          </article>`;
      })
      .join("");
    document.querySelector("#empty-state").hidden = visibleProducts.length > 0;
  }

  function renderCart() {
    const cartItems = [...cart.values()];
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    document.querySelector("#cart-count").textContent = itemCount;
    document.querySelector("#cart-item-label").textContent = `(${itemCount})`;
    document.querySelector("#cart-empty").hidden = cartItems.length > 0;
    document.querySelector("#cart-footer").hidden = cartItems.length === 0;
    document.querySelector("#delivery-options").hidden =
      cartItems.length === 0 || !config.shippingOptions?.length || !config.packingOptions?.length;
    document.querySelector("#cart-items").innerHTML = cartItems
      .map(
        ({ product, quantity }) => `
          <article class="cart-item">
            <img src="${escapeHtml(product.image)}" alt="" />
            <div class="cart-item-info">
              <h3>${escapeHtml(localizeProduct(product).name)}</h3>
              <p>${formatPrice(product.price)}</p>
              <div class="quantity-control">
                <button type="button" data-quantity="${escapeHtml(product.id)}" data-change="-1" aria-label="${escapeHtml(t("product.decrease", { name: localizeProduct(product).name }))}">−</button>
                <span>${quantity}</span>
                <button type="button" data-quantity="${escapeHtml(product.id)}" data-change="1" aria-label="${escapeHtml(t("product.increase", { name: localizeProduct(product).name }))}">+</button>
              </div>
            </div>
            <strong class="cart-item-subtotal">${formatPrice(product.price * quantity)}</strong>
          </article>`,
      )
      .join("");
    updateDeliverySummary(subtotal);
  }

  function addToCart(productId) {
    const product = products.find((item) => item.id === productId);
    if (!product) return;
    const currentItem = cart.get(productId);
    cart.set(productId, { product, quantity: (currentItem?.quantity || 0) + 1 });
    renderCart();
    showToast(t("added", { name: localizeProduct(product).name }));
  }

  function showToast(message) {
    const toast = document.querySelector("#toast");
    toast.textContent = message;
    toast.classList.add("visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("visible"), 2400);
  }

  function setCartOpen(isOpen) {
    cartOverlay.hidden = !isOpen;
    document.body.classList.toggle("cart-open", isOpen);
    if (isOpen) document.querySelector("#close-cart").focus();
    else document.querySelector("#open-cart").focus();
  }

  function checkout() {
    const cartItems = [...cart.values()];
    if (!cartItems.length) return;
    if (!config.whatsappPhone) {
      showToast(t("checkout.whatsappMissing"));
      return;
    }

    const delivery = getDeliveryEstimate();
    if (!delivery.configured) {
      showToast(t("delivery.checkoutIncomplete"));
      return;
    }

    const itemLines = cartItems.map(
      ({ product, quantity }) => `• ${localizeProduct(product).name} x${quantity} — ${formatPrice(product.price * quantity)}`,
    );
    const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const total = subtotal + delivery.packingCost;
    const message = t("checkout.message", {
      store: storeName,
      items: itemLines.join("\n"),
      address: delivery.address,
      shipping: localizeOption(delivery.shipping),
      packing: localizeOption(delivery.packing),
      packingCost: delivery.packingCost === 0 ? t("delivery.free") : formatPrice(delivery.packingCost),
      subtotal: formatPrice(subtotal),
      total: formatPrice(total),
      payment: t(`payment.${paymentOptions.querySelector('input[name="payment-method"]:checked').value}`),
    });
    const phone = config.whatsappPhone.replace(/\D/g, "");
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => {
      const entities = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
      return entities[character];
    });
  }

  function applyLanguage() {
    const locale = { id: "id-ID", en: "en-US", ar: "ar" }[currentLanguage];
    const languageFlags = { id: "🇮🇩", en: "🇬🇧", ar: "🇸🇦" };
    const languageFlag = document.querySelector("#language-flag");
    languageFlag.textContent = languageFlags[currentLanguage];
    languageFlag.title = languageSelect.selectedOptions[0].textContent;
    formatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: config.currency || "IDR",
      maximumFractionDigits: 0,
    });
    document.documentElement.lang = currentLanguage;
    document.documentElement.dir = currentLanguage === "ar" ? "rtl" : "ltr";
    document.title = currentLanguage === "id"
      ? `${storeName} — Bunga & Anggur Pilihan`
      : currentLanguage === "en"
        ? `${storeName} — Flowers & Garden`
        : `${storeName} — الزهور والحديقة`;
    document.querySelector("#page-description").content = currentLanguage === "id"
      ? `Temukan bunga pilihan dan bougenvil dari ${storeName}.`
      : currentLanguage === "en"
        ? `Discover flowers and bougainvillea from ${storeName}.`
        : `اكتشف الزهور والجهنمية من ${storeName}.`;

    document.querySelectorAll("[data-i18n]").forEach((element) => {
      element.textContent = t(element.dataset.i18n);
    });
    document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
      element.setAttribute("aria-label", t(element.dataset.i18nAria));
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
      element.placeholder = t(element.dataset.i18nPlaceholder);
    });
    document.querySelectorAll("[data-i18n-title]").forEach((element) => {
      element.title = t(element.dataset.i18nTitle);
    });
    document.querySelectorAll("[data-i18n-alt]").forEach((element) => {
      element.alt = t(element.dataset.i18nAlt);
    });
    document.querySelectorAll(".brand").forEach((brand) => {
      brand.setAttribute("aria-label", `${storeName} — ${t("brand.home")}`);
    });
    document.querySelectorAll("[data-social]").forEach((link) => {
      const socialName = t(`social.${link.dataset.social}`);
      link.setAttribute("aria-label", `${socialName} ${storeName}`);
      link.title = socialName;
    });

    renderFilters();
    renderProducts();
    populateDeliveryOptions();
    renderCart();
    renderPaymentInfo();
    updateContactLinks();
  }

  function updateContactLinks() {
    const contactLink = document.querySelector("#contact-link");
    const testimonialContact = document.querySelector("#testimonial-contact");
    const whatsappSupport = document.querySelector("#whatsapp-support");
    const emailLink = document.querySelector("#store-email");
    const phone = (config.whatsappPhone || "").replace(/\D/g, "");
    const email = String(config.email || "").trim();
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (email && validEmail) {
      emailLink.href = `mailto:${email}`;
      emailLink.textContent = t("contact.emailLabel", { email });
      emailLink.hidden = false;
    } else {
      emailLink.hidden = true;
      emailLink.removeAttribute("href");
      if (email) console.error("Invalid store email in products.js.");
    }

    if (phone) {
      const message = encodeURIComponent(t("checkout.inquiry", { store: storeName }));
      const whatsappUrl = `https://wa.me/${phone}?text=${message}`;
      for (const link of [contactLink, testimonialContact, whatsappSupport]) {
        link.href = whatsappUrl;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }
    } else {
      if (!contactFallbackBound) {
        for (const link of [contactLink, testimonialContact, whatsappSupport]) {
          link.addEventListener("click", (event) => {
            if (config.whatsappPhone) return;
            event.preventDefault();
            showToast(t("whatsapp.missing"));
          });
        }
        contactFallbackBound = true;
      }
    }
  }

  languageSelect.addEventListener("change", () => {
    currentLanguage = languageSelect.value;
    applyLanguage();
  });

  filters.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    activeCategory = button.dataset.category;
    renderFilters();
    renderProducts();
  });

  searchInput.addEventListener("input", renderProducts);
  deliveryAddressInput.addEventListener("input", () => {
    const subtotal = [...cart.values()].reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );
    updateDeliverySummary(subtotal);
  });
  paymentOptions.addEventListener("change", renderPaymentInfo);
  shippingSelect.addEventListener("change", () => {
    updateCourierTrackingLink();
    const subtotal = [...cart.values()].reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );
    updateDeliverySummary(subtotal);
  });
  packingSelect.addEventListener("change", () => {
    const subtotal = [...cart.values()].reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );
    updateDeliverySummary(subtotal);
  });
  productGrid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-add]");
    if (button) addToCart(button.dataset.add);
  });

  document.querySelector("#cart-items").addEventListener("click", (event) => {
    const button = event.target.closest("[data-quantity]");
    if (!button) return;
    const productId = button.dataset.quantity;
    const item = cart.get(productId);
    if (!item) return;
    const quantity = item.quantity + Number(button.dataset.change);
    if (quantity <= 0) cart.delete(productId);
    else cart.set(productId, { ...item, quantity });
    renderCart();
  });

  document.querySelector("#open-cart").addEventListener("click", () => setCartOpen(true));
  document.querySelector("#close-cart").addEventListener("click", () => setCartOpen(false));
  document.querySelector("#close-cart-backdrop").addEventListener("click", () => setCartOpen(false));
  document.querySelector("#continue-shopping").addEventListener("click", () => setCartOpen(false));
  document.querySelector("#checkout-button").addEventListener("click", checkout);
  document.querySelector("#current-year").textContent = new Date().getFullYear();
  document.querySelectorAll("[data-store-name]").forEach((element) => {
    element.textContent = storeName;
  });
  document.querySelectorAll(".brand").forEach((brand) => {
    brand.setAttribute("aria-label", `${storeName}, beranda`);
  });
  const mapLocation = String(config.mapLocation || "").trim();
  const storeMap = document.querySelector("#store-map");
  const mapPlaceholder = document.querySelector("#map-placeholder");
  const mapLink = document.querySelector("#map-link");
  if (mapLocation) {
    const encodedLocation = encodeURIComponent(mapLocation);
    storeMap.src = `https://www.google.com/maps?q=${encodedLocation}&output=embed`;
    storeMap.hidden = false;
    mapPlaceholder.hidden = true;
    mapLink.href = `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
    mapLink.hidden = false;
  }

  updateContactLinks();

  document.querySelectorAll("[data-social]").forEach((link) => {
    const socialName = link.dataset.social;
    const url = config.socialUrls?.[socialName];
    link.setAttribute("aria-label", `${t(`social.${socialName}`)} ${storeName}`);
    if (url) {
      try {
        const parsedUrl = new URL(url);
        if (parsedUrl.protocol !== "https:" && parsedUrl.protocol !== "http:") {
          throw new Error("Social profile links must use http or https.");
        }
        link.href = parsedUrl.href;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      } catch (error) {
        console.error(`Invalid ${socialName} profile URL in products.js.`, error);
        link.setAttribute("aria-disabled", "true");
        link.addEventListener("click", (event) => {
          event.preventDefault();
          showToast(t("social.invalid", { name: t(`social.${socialName}`) }));
        });
      }
    } else {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        showToast(t("social.missing", { name: t(`social.${socialName}`) }));
      });
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !cartOverlay.hidden) setCartOpen(false);
  });

  applyLanguage();
})();
