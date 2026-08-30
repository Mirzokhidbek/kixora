/** =========================================================
 * BURAK ADMIN - PRODUCTS MANAGEMENT SCRIPT
 * ========================================================= */

$(document).ready(function () {
  console.log("Products Script Loaded.");

  // 1. Dynamic Toggle between Portion Size & Bottle Volume based on Collection
  $("#productCollectionSelect").on("change", function () {
    const selectedCollection = $(this).val();

    if (selectedCollection === "DRINK") {
      $("#productSizeBox").addClass("d-none");
      $("#productVolumeBox").removeClass("d-none");
    } else {
      $("#productVolumeBox").addClass("d-none");
      $("#productSizeBox").removeClass("d-none");
    }
  });

  // 2. Multi-Image Preloading & File Validation
  $("#productImagesInput").on("change", function () {
    const previewBox = $("#imagePreviewContainer");
    previewBox.empty();
    const files = this.files;

    if (!files || files.length === 0) return;

    if (files.length > 5) {
      alert("Maximum 5 images allowed per product!");
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
          .addClass("preview-img-item shadow-sm")
          .attr("src", e.target.result)
          .attr("alt", file.name);
        previewBox.append(imgEl);
      };
      reader.readAsDataURL(file);
    });
  });

  // 3. Frontend Validation before Product Creation
  $("#addProductForm").on("submit", function () {
    const productName = $("input[name=productName]").val().trim();
    const productPrice = $("input[name=productPrice]").val();
    const productLeftCount = $("input[name=productLeftCount]").val();
    const productCollection = $("#productCollectionSelect").val();
    const files = $("#productImagesInput").get(0).files;

    if (productName === "") {
      alert("Please enter product name!");
      $("input[name=productName]").focus();
      return false;
    }

    if (!productPrice || Number(productPrice) <= 0) {
      alert("Please enter a valid product price!");
      $("input[name=productPrice]").focus();
      return false;
    }

    if (!productLeftCount || Number(productLeftCount) < 0) {
      alert("Please enter a valid stock count!");
      $("input[name=productLeftCount]").focus();
      return false;
    }

    if (!files || files.length === 0) {
      alert("Please select at least one product photo!");
      return false;
    }

    return true;
  });

  // 4. AJAX Product Status Update
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
});
