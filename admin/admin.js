(() => {
  const form = document.querySelector("#store-form");
  const productList = document.querySelector("#product-list");
  const statusMessage = document.querySelector("#status-message");
  const importFile = document.querySelector("#import-file");
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
    renderProducts();
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
      cell.colSpan = 6;
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
      row.dataset.search = `${product.name} ${product.category} ${product.description} ${product.tag}`.toLocaleLowerCase();

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
      row.append(photoCell, nameCell, categoryCell, priceCell, tagCell, actionsCell);

      const editorRow = document.createElement("tr");
      editorRow.className = "product-editor-row";
      editorRow.hidden = true;
      const editorCell = document.createElement("td");
      editorCell.colSpan = 6;
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
      addField(fields, "URL gambar", "image", product.image, { required: true, wide: true });
      addImageUpload(fields, product);
      addField(fields, "Label (opsional)", "tag", product.tag, {});
      addField(fields, "Deskripsi", "description", product.description, { multiline: true, wide: true, required: true });
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
        product[input.dataset.productField] = input.dataset.productField === "price" ? Number(input.value) : input.value.trim();
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

  function optimizeImage(file) {
    if (file.size > 25 * 1024 * 1024) {
      throw new Error("Ukuran file maksimal 25 MB.");
    }

    return createImageBitmap(file).then((bitmap) => {
      const maxDimension = 1200;
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
          if (blob.size > 700 * 1024) {
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
