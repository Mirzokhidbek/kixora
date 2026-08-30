/** =========================================================
 * BURAK ADMIN - ADVANCED INTERACTIVE SCRIPTS
 * ========================================================= */

$(document).ready(function () {
  console.log("Burak Admin Suite Initialized.");

  // 1. Multi-Image Upload Live Preview (Products)
  $("#productImagesInput").on("change", function () {
    const previewBox = $("#imagePreviewContainer");
    previewBox.empty();
    const files = this.files;

    if (files && files.length > 0) {
      if (files.length > 5) {
        alert("Maximum 5 images allowed!");
        this.value = "";
        return;
      }

      Array.from(files).forEach((file) => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = function (e) {
            const imgEl = $("<img>")
              .addClass("preview-img-item shadow-sm")
              .attr("src", e.target.result);
            previewBox.append(imgEl);
          };
          reader.readAsDataURL(file);
        }
      });
    }
  });

  // 2. Single Member Image Upload Preview (Signup)
  $("#memberImageInput").on("change", function () {
    const file = this.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = function (e) {
        $("#memberImagePreview")
          .attr("src", e.target.result)
          .removeClass("d-none");
      };
      reader.readAsDataURL(file);
    }
  });

  // 3. AJAX Product Status Change Handler
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
        
        // Flash animation
        badge.css("transform", "scale(1.15)");
        setTimeout(() => badge.css("transform", "scale(1)"), 200);
      })
      .catch((err) => {
        alert("Failed to update product status!");
        console.error(err);
      });
  });

  // 4. Password Reveal Toggle
  $(".btn-toggle-password").on("click", function () {
    const targetInput = $($(this).data("target"));
    const icon = $(this).find("i");
    if (targetInput.attr("type") === "password") {
      targetInput.attr("type", "text");
      icon.removeClass("fa-eye").addClass("fa-eye-slash");
    } else {
      targetInput.attr("type", "password");
      icon.removeClass("fa-eye-slash").addClass("fa-eye");
    }
  });
});
