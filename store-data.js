(() => {
  const storageKey = "rahmanflower-store-data-v1";

  function defaults() {
    return {
      config: JSON.parse(JSON.stringify(window.STORE_CONFIG || {})),
      products: JSON.parse(JSON.stringify(window.PRODUCTS || [])),
    };
  }

  function validate(data) {
    if (!data || typeof data !== "object" || !data.config || typeof data.config !== "object" || !Array.isArray(data.products)) {
      throw new Error("Format data toko tidak valid.");
    }

    const heroSlides = data.config.hero?.slides;
    if (heroSlides !== undefined) {
      if (typeof heroSlides !== "string") {
        throw new Error("Daftar foto slider beranda harus berupa URL satu per baris.");
      }
      const slideUrls = heroSlides.split(/\r?\n/).map((url) => url.trim()).filter(Boolean);
      if (slideUrls.length > 6) {
        throw new Error("Foto slider beranda maksimal 6 gambar.");
      }
      if (slideUrls.some((url) => {
        if (url.startsWith("data:image/jpeg;base64,")) {
          return url.length > 420 * 1024 || !/^data:image\/jpeg;base64,[A-Za-z0-9+/]+={0,2}$/.test(url);
        }
        try {
          const parsedUrl = new URL(url, "https://rahmanflower.invalid/");
          return parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:";
        } catch {
          return true;
        }
      })) {
        throw new Error("URL foto slider harus menggunakan HTTPS, HTTP, atau path relatif.");
      }
    }

    const ids = new Set();
    for (const product of data.products) {
      if (
        !product ||
        typeof product.id !== "string" ||
        !product.id.trim() ||
        typeof product.name !== "string" ||
        !product.name.trim() ||
        typeof product.category !== "string" ||
        !product.category.trim() ||
        typeof product.description !== "string" ||
        typeof product.image !== "string" ||
        !product.image.trim() ||
        !Number.isFinite(Number(product.price)) ||
        Number(product.price) < 0 ||
        (product.stock !== undefined && product.stock !== null && (!Number.isInteger(Number(product.stock)) || Number(product.stock) < 0)) ||
        (product.minPurchase !== undefined && (!Number.isInteger(Number(product.minPurchase)) || Number(product.minPurchase) < 1))
      ) {
        throw new Error("Setiap produk harus memiliki ID, nama, kategori, deskripsi, gambar, dan harga yang valid.");
      }
      if (ids.has(product.id)) {
        throw new Error(`ID produk "${product.id}" digunakan lebih dari sekali.`);
      }
      ids.add(product.id);
    }
    return data;
  }

  function load() {
    try {
      const saved = window.localStorage.getItem(storageKey);
      return saved ? validate(JSON.parse(saved)) : defaults();
    } catch (error) {
      console.error("Data toko tersimpan tidak dapat dibaca; menggunakan data bawaan.", error);
      return defaults();
    }
  }

  function save(data) {
    const validated = validate(data);
    window.localStorage.setItem(storageKey, JSON.stringify(validated));
  }

  function reset() {
    window.localStorage.removeItem(storageKey);
  }

  window.StoreData = { load, save, reset, validate };
})();
