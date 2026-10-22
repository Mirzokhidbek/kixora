/** =========================================================
 * KIXORA BRAND ADMIN - FOOTWEAR PRODUCTS SCRIPT
 * ========================================================= */

$(document).ready(function () {
  console.log("KIXORA Footwear Management Script Loaded.");

  // 1. Live Search by Model Name / Description
  $("#productSearchInput").on("keyup", function () {
    const value = $(this).val().toLowerCase().trim();
    filterProductsTable();
  });

  // 2. Collection Filter Pills
  $(".collection-filter-btn").on("click", function () {
    $(".collection-filter-btn").removeClass("active");
    $(this).addClass("active");
    filterProductsTable();
  });

  function filterProductsTable() {
    const searchVal = $("#productSearchInput").val().toLowerCase().trim();
    const activeCollection = $(".collection-filter-btn.active").data("collection");

    $(".product-row").each(function () {
      const name = $(this).data("name") || "";
      const desc = $(this).data("desc") || "";
      const collection = $(this).data("collection") || "";

      const matchesSearch = !searchVal || name.includes(searchVal) || desc.includes(searchVal);
      const matchesCollection = activeCollection === "ALL" || collection === activeCollection;

      if (matchesSearch && matchesCollection) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  }

  // 3. Multi-Image Preloading & File Validation
  $("#productImagesInput").on("change", function () {
    const previewBox = $("#imagePreviewContainer");
    previewBox.empty();
    const files = this.files;

    if (!files || files.length === 0) return;

    if (files.length > 5) {
      alert("Maximum 5 photos allowed per product!");
      this.value = "";
      return false;
    }

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    Array.from(files).forEach((file) => {
      if (!validTypes.includes(file.type)) {
        alert(`File "${file.name}" is not a supported image format!`);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert(`File "${file.name}" exceeds 5MB size limit!`);
        return;
      }

      const reader = new FileReader();
      reader.onload = function (e) {
        const imgEl = $("<img>")
          .addClass("preview-img-item shadow-sm rounded border")
          .attr("src", e.target.result)
          .attr("alt", file.name)
          .css({ width: "60px", height: "60px", objectFit: "contain", background: "#f9fafb", padding: "4px" });
        previewBox.append(imgEl);
      };
      reader.readAsDataURL(file);
    });
  });

  // 4. AJAX Product Status Toggle (PROCESS / PAUSE / DELETE)
  $(".product-status-select").on("change", function () {
    const id = $(this).data("id");
    const productStatus = $(this).val();

    axios
      .post(`/admin/product/${id}`, { productStatus: productStatus })
      .then((response) => {
        const badge = $(`#status-badge-${id}`);
        badge
          .removeClass("process pause delete")
          .addClass(productStatus.toLowerCase())
          .text(productStatus);

        badge.css("transform", "scale(1.15)");
        setTimeout(() => badge.css("transform", "scale(1)"), 200);
      })
      .catch((err) => {
        alert("Failed to update product status!");
        console.error(err);
      });
  });

  // 5. Open Edit Product Modal & Populate Values
  $(".edit-product-trigger").on("click", function () {
    const id = $(this).data("id");
    const name = $(this).data("name");
    const price = $(this).data("price");
    const stock = $(this).data("stock");
    const collection = $(this).data("collection");
    const size = $(this).data("size");
    const desc = $(this).data("desc");

    $("#editProductId").val(id);
    $("#editProductName").val(name);
    $("#editProductPrice").val(price);
    $("#editProductLeftCount").val(stock);
    $("#editProductCollection").val(collection);
    $("#editProductSize").val(size);
    $("#editProductDesc").val(desc);
    $("#editProductSizeStock").val($(this).data("sizestock") || "");
    $("#editProductMaterial").val($(this).data("material") || "");
    $("#editProductMidsole").val($(this).data("midsole") || "");
    $("#editProductOutsole").val($(this).data("outsole") || "");
    $("#editProductWeight").val($(this).data("weight") || "");

    // Current images (a missing file shows a placeholder so the admin can see it needs replacing)
    const images = $(this).data("images") || [];
    const current = $("#editCurrentImages").empty();
    if (!images.length) current.append('<span class="text-muted small">No images</span>');
    images.forEach((src) => {
      $("<img>")
        .attr({ src, alt: "" })
        .addClass("rounded border")
        .css({ width: 64, height: 64, objectFit: "cover" })
        .on("error", function () {
          $(this).replaceWith(
            '<div class="rounded border d-flex align-items-center justify-content-center text-danger small" style="width:64px;height:64px;font-size:0.65rem;">Missing</div>'
          );
        })
        .appendTo(current);
    });
    $("#editProductImages").val("");
    $("#editNewImagesPreview").empty();

    const editModal = new bootstrap.Modal(document.getElementById("editProductModal"));
    editModal.show();
  });

  // Preview newly chosen replacement images
  $("#editProductImages").on("change", function () {
    const preview = $("#editNewImagesPreview").empty();
    const files = Array.from(this.files || []);
    if (files.length > 5) {
      alert("You can upload up to 5 images.");
      this.value = "";
      return;
    }
    files.forEach((file) => {
      $("<img>")
        .attr({ src: URL.createObjectURL(file), alt: "" })
        .addClass("rounded border border-dark")
        .css({ width: 64, height: 64, objectFit: "cover" })
        .appendTo(preview);
    });
  });

  // 6. Submit Product Edit via AJAX
  $("#editProductForm").on("submit", function (e) {
    e.preventDefault();
    const id = $("#editProductId").val();
    const payload = {
      productName: $("#editProductName").val().trim(),
      productPrice: Number($("#editProductPrice").val()),
      productLeftCount: Number($("#editProductLeftCount").val()),
      // empty selects are omitted (undefined is dropped by JSON) so a value the
      // dropdown doesn't list is kept instead of being sent as null
      productCollection: $("#editProductCollection").val() || undefined,
      productSize: $("#editProductSize").val() || undefined,
      productDesc: $("#editProductDesc").val().trim(),
      // empty = keep the current per-size stock
      productSizeStock: $("#editProductSizeStock").val().trim() || undefined,
      productMaterial: $("#editProductMaterial").val().trim(),
      productMidsole: $("#editProductMidsole").val().trim(),
      productOutsole: $("#editProductOutsole").val().trim(),
      productWeight: $("#editProductWeight").val().trim(),
    };

    const saveBtn = $("#saveEditProductBtn");
    saveBtn.prop("disabled", true).html('<i class="fa-solid fa-spinner fa-spin me-1"></i> Saving...');

    // Details first, then (optionally) the new images
    const files = Array.from($("#editProductImages")[0].files || []);
    axios
      .post(`/admin/product/${id}/update`, payload)
      .then(() => {
        if (!files.length) return;
        const formData = new FormData();
        files.forEach((file) => formData.append("productImages", file));
        return axios.post(`/admin/product/${id}/images`, formData);
      })
      .then(() => {
        window.location.reload();
      })
      .catch((err) => {
        saveBtn.prop("disabled", false).html('<i class="fa-solid fa-check me-1"></i> Save Changes');
        alert(err.response?.data?.message || "Failed to update product. Please try again.");
        console.error(err);
      });
  });
});
