(() => {
  const form = document.querySelector("#store-form");
  const productList = document.querySelector("#product-list");
  const statusMessage = document.querySelector("#status-message");
  const importFile = document.querySelector("#import-file");
  const heroImageUpload = document.querySelector("#hero-image-upload");
  const heroImageList = document.querySelector("#hero-image-list");
  const heroImageUrls = document.querySelector("#hero-image-urls");
  const sidebarLinks = [...document.querySelectorAll(".sidebar-link")];
  const searchInput = document.querySelector("#product-search");
  const categoryFilter = document.querySelector("#category-filter");
  let data = window.StoreData.load();

  function showStatus(message, isError = false) {
    statusMessage.textContent = message;
    statusMessage.classList.toggle("notice-error", isError);
    statusMessage.classList.toggle("notice-success", !isError);
    statusMessage.hidden = false;
  }

  function readPath(object, path) {
    return path.split(".").reduce((value, key) => value?.[key], object) ?? "";
  }

  function writePath(object, path, value) {
    const keys = path.split(".");
    const leaf = keys.pop();
    const parent = keys.reduce((current, key) => {
      current[key] ??= {};
      return current[key];
    }, object);
    parent[leaf] = value;
  }

  function loadForm() {
    form.querySelectorAll("[data-setting]").forEach((input) => {
      input.value = readPath(data.config, input.dataset.setting);
    });
    renderHeroImages();
    renderProducts();
  }

  function readHeroImageUrls() {
    return heroImageUrls.value.split(/\r?\n/).map((url) => url.trim()).filter(Boolean);
  }

  function heroImageUrlsForEditor() {
    const urls = readHeroImageUrls();
    if (urls.length) return urls;
    const defaultSlides = window.STORE_CONFIG?.hero?.slides;
    return typeof defaultSlides === "string"
      ? defaultSlides.split(/\r?\n/).map((url) => url.trim()).filter(Boolean)
      : [];
  }

  function renderHeroImages() {
    heroImageList.replaceChildren();
    const urls = heroImageUrlsForEditor();
    urls.forEach((url, index) => {
      const card = document.createElement("div");
      card.className = "hero-image-card";

      const image = document.createElement("img");
      image.src = url;
      image.alt = `Pratinjau foto beranda ${index + 1}`;
      image.loading = "lazy";
      image.addEventListener("error", () => {
        image.hidden = true;
      });

      const caption = document.createElement("span");
      caption.textContent = `Foto ${index + 1}`;

      const actions = document.createElement("div");
      actions.className = "hero-image-actions";

      const moveButton = (direction, text, offset) => {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = text;
        button.setAttribute("aria-label", `Pindahkan foto beranda ${index + 1} ke ${direction}`);
        button.disabled = index + offset < 0 || index + offset >= urls.length;
        button.addEventListener("click", () => {
          const nextIndex = index + offset;
          [urls[index], urls[nextIndex]] = [urls[nextIndex], urls[index]];
          heroImageUrls.value = urls.join("\n");
          renderHeroImages();
        });
        return button;
      };

      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.className = "hero-image-remove";
      removeButton.textContent = "Hapus";
      removeButton.setAttribute("aria-label", `Hapus foto beranda ${index + 1}`);
      removeButton.addEventListener("click", () => {
        const nextUrls = heroImageUrlsForEditor();
        nextUrls.splice(index, 1);
        heroImageUrls.value = nextUrls.length ? nextUrls.join("\n") : "";
        renderHeroImages();
      });

      actions.append(moveButton("kiri", "←", -1), moveButton("kanan", "→", 1), removeButton);
      card.append(image, caption, actions);
      heroImageList.append(card);
    });

    heroImageUpload.disabled = urls.length >= 6;
  }

  function addField(card, labelText, fieldName, value, options = {}) {
    const label = document.createElement("label");
    label.textContent = labelText;
    const input = options.multiline ? document.createElement("textarea") : document.createElement("input");
    input.name = fieldName;
    input.dataset.productField = fieldName;
    input.value = value ?? "";
    if (options.type) input.type = options.type;
    if (options.required) input.required = true;
    if (options.min !== undefined) input.min = String(options.min);
    if (options.step) input.step = options.step;
    if (options.readonly) input.readOnly = true;
    if (options.wide) label.classList.add("field-wide");
    label.append(input);
    card.append(label);
  }

  function addImageUpload(fields, product) {
    const label = document.createElement("label");
    label.className = "field-wide image-upload-field";
    label.textContent = "Unggah foto produk";

    const input = document.createElement("input");
    input.type = "file";
    input.accept = [
      "image/*",
      ".raw", ".dng", ".cr2", ".cr3", ".nef", ".nrw", ".arw", ".srf", ".sr2",
      ".orf", ".rw2", ".raf", ".pef", ".3fr", ".fff", ".iiq", ".kdc", ".mos",
      ".mef", ".mrw", ".rwl", ".x3f",
    ].join(",");
    input.dataset.imageUpload = product.id;

    const help = document.createElement("span");
    help.className = "upload-help";
    help.textContent = "JPG, PNG, WebP, GIF, SVG, AVIF, dan format gambar lain yang didukung browser. RAW kamera perlu dikonversi ke JPG/PNG terlebih dahulu.";
    label.append(input, help);

    const preview = document.createElement("img");
    preview.className = "upload-preview";
    preview.alt = product.name ? `Pratinjau ${product.name}` : "Pratinjau foto produk";
    preview.hidden = !product.image;
    if (product.image) preview.src = product.image;
    preview.addEventListener("error", () => {
      preview.hidden = true;
    });

    const previewWrap = document.createElement("div");
    previewWrap.className = "upload-preview-wrap field-wide";
    const previewLabel = document.createElement("span");
    previewLabel.className = "upload-help";
    previewLabel.textContent = "Pratinjau foto saat ini";
    previewWrap.append(previewLabel, preview);
    fields.append(label, previewWrap);
  }

  function renderProducts() {
    productList.replaceChildren();
    const categories = [...new Set(data.products.map((product) => product.category).filter(Boolean))];
    categoryFilter.replaceChildren(new Option("Semua Kategori", ""));
    categories.forEach((category) => categoryFilter.add(new Option(category, category)));

    if (!data.products.length) {
      const row = document.createElement("tr");
      const cell = document.createElement("td");
      cell.colSpan = 7;
      cell.className = "empty-list";
      cell.textContent = "Belum ada produk. Tambahkan produk untuk mulai mengisi etalase.";
      row.append(cell);
      productList.append(row);
      return;
    }

    data.products.forEach((product, index) => {
      const row = document.createElement("tr");
      row.className = "product-row";
      row.dataset.category = product.category;
      row.dataset.search = `${product.name} ${product.category} ${product.description} ${product.details || ""} ${product.tag}`.toLocaleLowerCase();

      const photoCell = document.createElement("td");
      const thumbnail = document.createElement("img");
      thumbnail.className = "product-thumbnail";
      thumbnail.alt = product.name ? `Foto ${product.name}` : "Foto produk";
      thumbnail.loading = "lazy";
      if (product.image) thumbnail.src = product.image;
      thumbnail.addEventListener("error", () => {
        thumbnail.hidden = true;
        photoCell.classList.add("thumbnail-empty");
        photoCell.textContent = "▧";
      });
      photoCell.append(thumbnail);

      const nameCell = document.createElement("td");
      const productName = document.createElement("strong");
      productName.className = "table-product-name";
      productName.textContent = product.name || `Produk ${index + 1}`;
      const description = document.createElement("span");
      description.className = "table-product-description";
      description.textContent = product.description;
      nameCell.append(productName, description);

      const categoryCell = document.createElement("td");
      const categoryBadge = document.createElement("span");
      categoryBadge.className = "category-badge";
      categoryBadge.textContent = product.category;
      categoryCell.append(categoryBadge);

      const priceCell = document.createElement("td");
      priceCell.className = "price-cell";
      priceCell.textContent = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: data.config.currency || "IDR",
        maximumFractionDigits: 0,
      }).format(Number(product.price) || 0);

      const stockCell = document.createElement("td");
      stockCell.className = "stock-cell";
      if (product.stock === null || product.stock === undefined || product.stock === "") {
        stockCell.textContent = "Belum diatur";
        stockCell.classList.add("muted-cell");
      } else {
        stockCell.textContent = Number(product.stock) === 0 ? "Habis" : String(product.stock);
        if (Number(product.stock) === 0) stockCell.classList.add("stock-empty");
      }

      const tagCell = document.createElement("td");
      if (product.tag) {
        const tagBadge = document.createElement("span");
        tagBadge.className = "tag-badge";
        tagBadge.textContent = product.tag;
        tagCell.append(tagBadge);
      } else {
        tagCell.textContent = "—";
        tagCell.className = "muted-cell";
      }

      const actionsCell = document.createElement("td");
      actionsCell.className = "actions-cell";
      const editButton = document.createElement("button");
      editButton.className = "table-action edit-action";
      editButton.type = "button";
      editButton.textContent = "✎ Edit";
      editButton.addEventListener("click", () => {
        editorRow.hidden = !editorRow.hidden;
        editButton.textContent = editorRow.hidden ? "✎ Edit" : "Tutup";
      });
      const removeButton = document.createElement("button");
      removeButton.className = "table-action delete-action";
      removeButton.type = "button";
      removeButton.textContent = "▣ Hapus";
      removeButton.addEventListener("click", () => {
        if (!window.confirm(`Hapus "${product.name || "produk ini"}" dari etalase?`)) return;
        data.products.splice(index, 1);
        renderProducts();
        showStatus("Produk dihapus dari formulir. Tekan Simpan perubahan untuk menerapkan.");
      });
      actionsCell.append(editButton, removeButton);
      row.append(photoCell, nameCell, categoryCell, priceCell, stockCell, tagCell, actionsCell);

      const editorRow = document.createElement("tr");
      editorRow.className = "product-editor-row";
      editorRow.hidden = true;
      const editorCell = document.createElement("td");
      editorCell.colSpan = 7;
      const card = document.createElement("article");
      card.className = "product-editor";
      const heading = document.createElement("div");
      heading.className = "product-editor-heading";
      const title = document.createElement("h3");
      title.textContent = product.name || `Produk ${index + 1}`;
      heading.append(title);
      card.append(heading);
      const fields = document.createElement("div");
      fields.className = "form-grid product-fields";
      addField(fields, "ID produk", "id", product.id, { required: true, readonly: true });
      addField(fields, "Nama produk", "name", product.name, { required: true });
      addField(fields, "Kategori", "category", product.category, { required: true });
      addField(fields, "Harga (rupiah)", "price", product.price, { type: "number", min: 0, step: "1", required: true });
      addField(fields, "Stok (kosongkan jika belum diketahui)", "stock", product.stock ?? "", { type: "number", min: 0, step: "1" });
      addField(fields, "Minimal pembelian (buah)", "minPurchase", product.minPurchase ?? 1, { type: "number", min: 1, step: "1", required: true });
      addField(fields, "Satuan minimal pembelian", "minPurchaseUnit", product.minPurchaseUnit ?? "buah", {});
      addField(fields, "Kondisi barang", "condition", product.condition ?? "Baru", {});
      addField(fields, "Berat satuan (contoh: 300 g)", "unitWeight", product.unitWeight ?? "", {});
      addField(fields, "URL gambar", "image", product.image, { required: true, wide: true });
      addImageUpload(fields, product);
      addField(fields, "Label (opsional)", "tag", product.tag, {});
      addField(fields, "Deskripsi", "description", product.description, { multiline: true, wide: true, required: true });
      addField(fields, "Detail produk", "details", product.details ?? "", { multiline: true, wide: true });
      card.append(fields);
      editorCell.append(card);
      editorRow.append(editorCell);
      productList.append(row, editorRow);
    });
    filterProducts();
  }

  function filterProducts() {
    const query = searchInput.value.trim().toLocaleLowerCase();
    const selectedCategory = categoryFilter.value;
    [...productList.querySelectorAll(".product-row")].forEach((row) => {
      const matchesSearch = row.dataset.search.includes(query);
      const matchesCategory = !selectedCategory || row.dataset.category === selectedCategory;
      const visible = matchesSearch && matchesCategory;
      row.hidden = !visible;
      row.nextElementSibling.hidden = !visible || row.nextElementSibling.hidden;
    });
  }

  function readProducts() {
    return [...productList.querySelectorAll(".product-editor")].map((card) => {
      const product = {};
      card.querySelectorAll("[data-product-field]").forEach((input) => {
        const field = input.dataset.productField;
        if (field === "price" || field === "minPurchase") product[field] = Number(input.value);
        else if (field === "stock") product[field] = input.value.trim() === "" ? null : Number(input.value);
        else product[field] = input.value.trim();
      });
      return product;
    });
  }

  function readSettings() {
    const config = JSON.parse(JSON.stringify(data.config));
    form.querySelectorAll("[data-setting]").forEach((input) => {
      writePath(config, input.dataset.setting, input.value.trim());
    });
    config.payment ??= {};
    config.socialUrls ??= {};
    return config;
  }

  function optimizeImage(file, options = {}) {
    if (file.size > 25 * 1024 * 1024) {
      throw new Error("Ukuran file maksimal 25 MB.");
    }

    return createImageBitmap(file).then((bitmap) => {
      const maxDimension = options.maxDimension || 1200;
      const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      const context = canvas.getContext("2d");
      if (!context) {
        bitmap.close();
        throw new Error("Browser tidak dapat memproses foto ini.");
      }

      context.fillStyle = "#fff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      bitmap.close();

      return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error("Foto tidak dapat dikonversi. Coba file JPG atau PNG."));
            return;
          }
          if (blob.size > (options.maxBytes || 700 * 1024)) {
            reject(new Error("Foto terlalu besar setelah dioptimalkan. Pilih foto yang lebih kecil."));
            return;
          }
          const reader = new FileReader();
          reader.addEventListener("load", () => resolve(reader.result), { once: true });
          reader.addEventListener("error", () => reject(new Error("Foto tidak dapat dibaca.")), { once: true });
          reader.readAsDataURL(blob);
        }, "image/jpeg", 0.78);
      });
    });
  }

  heroImageUrls.addEventListener("input", renderHeroImages);
  heroImageUpload.addEventListener("change", async () => {
    const files = [...heroImageUpload.files];
    if (!files.length) return;

    const currentUrls = heroImageUrlsForEditor();
    if (files.length + currentUrls.length > 6) {
      showStatus("Maksimal enam foto beranda. Hapus foto yang ada atau pilih lebih sedikit foto.", true);
      heroImageUpload.value = "";
      return;
    }

    heroImageUpload.disabled = true;
    try {
      const uploadedUrls = [];
      for (const file of files) {
        uploadedUrls.push(await optimizeImage(file, { maxDimension: 1000, maxBytes: 300 * 1024 }));
      }
      heroImageUrls.value = [...currentUrls, ...uploadedUrls].join("\n");
      renderHeroImages();
      showStatus(`${uploadedUrls.length} foto beranda siap digunakan. Simpan perubahan untuk menerapkannya.`);
    } catch (error) {
      showStatus(
        `${error.message || "Foto tidak dapat diproses."} Foto RAW kamera perlu dikonversi ke JPG atau PNG terlebih dahulu.`,
        true,
      );
    } finally {
      heroImageUpload.disabled = false;
      heroImageUpload.value = "";
      renderHeroImages();
    }
  });

  productList.addEventListener("change", async (event) => {
    const input = event.target.closest("[data-image-upload]");
    const file = input?.files?.[0];
    if (!input || !file) return;

    const product = data.products.find((item) => item.id === input.dataset.imageUpload);
    const card = input.closest(".product-editor");
    if (!product || !card) return;

    try {
      const image = await optimizeImage(file);
      product.image = image;
      card.querySelector('[data-product-field="image"]').value = image;
      const preview = card.querySelector(".upload-preview");
      preview.src = image;
      preview.alt = product.name ? `Pratinjau ${product.name}` : "Pratinjau foto produk";
      preview.hidden = false;
      showStatus(`Foto "${file.name}" berhasil ditambahkan. Simpan perubahan untuk menerapkannya.`);
    } catch (error) {
      showStatus(
        `${error.message || "Foto tidak dapat diproses."} File RAW kamera biasanya perlu dikonversi ke JPG atau PNG terlebih dahulu.`,
        true,
      );
    } finally {
      input.value = "";
    }
  });

  sidebarLinks.forEach((link) => {
    link.addEventListener("click", () => {
      sidebarLinks.forEach((item) => {
        const active = item === link;
        item.classList.toggle("active", active);
        if (active) item.setAttribute("aria-current", "location");
        else item.removeAttribute("aria-current");
      });

    });
  });

  searchInput.addEventListener("input", filterProducts);
  categoryFilter.addEventListener("change", filterProducts);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    try {
      const nextData = { config: readSettings(), products: readProducts() };
      nextData.config.whatsappPhone = nextData.config.whatsappPhone.replace(/\D/g, "");
      window.StoreData.save(nextData);
      data = nextData;
      loadForm();
      showStatus("Perubahan berhasil disimpan di browser ini.");
    } catch (error) {
      showStatus(error.message || "Perubahan tidak dapat disimpan.", true);
    }
  });

  document.querySelector("#add-product").addEventListener("click", () => {
    searchInput.value = "";
    categoryFilter.value = "";
    const id = `produk-baru-${Date.now().toString(36)}`;
    data.products.push({
      id,
      name: "",
      category: "Bunga",
      description: "",
      price: 0,
      stock: null,
      minPurchase: 1,
      minPurchaseUnit: "buah",
      condition: "Baru",
      unitWeight: "",
      details: "",
      image: "",
      tag: "",
    });
    renderProducts();
    const newRow = [...productList.querySelectorAll(".product-row")].pop();
    const editorRow = newRow?.nextElementSibling;
    if (editorRow) editorRow.hidden = false;
    newRow?.scrollIntoView({ behavior: "smooth", block: "center" });
    editorRow?.querySelector('[data-product-field="name"]')?.focus();
  });

  document.querySelector("#export-data").addEventListener("click", () => {
    try {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "rahmanflower-data.json";
      link.click();
      URL.revokeObjectURL(url);
      showStatus("Salinan data toko berhasil diekspor.");
    } catch (error) {
      showStatus(error.message || "Data tidak dapat diekspor.", true);
    }
  });

  document.querySelector("#import-data").addEventListener("click", () => importFile.click());
  importFile.addEventListener("change", async () => {
    const file = importFile.files?.[0];
    if (!file) return;
    try {
      const imported = window.StoreData.validate(JSON.parse(await file.text()));
      data = imported;
      window.StoreData.save(data);
      loadForm();
      showStatus("Data berhasil diimpor dan disimpan di browser ini.");
    } catch (error) {
      showStatus(error.message || "File tidak dapat diimpor. Periksa format JSON-nya.", true);
    } finally {
      importFile.value = "";
    }
  });

  document.querySelector("#reset-data").addEventListener("click", () => {
    if (!window.confirm("Hapus semua perubahan tersimpan dan kembalikan data bawaan?")) return;
    try {
      window.StoreData.reset();
      data = window.StoreData.load();
      loadForm();
      showStatus("Data toko dikembalikan ke data awal.");
    } catch (error) {
      showStatus(error.message || "Data tidak dapat direset.", true);
    }
  });

  loadForm();
})();
