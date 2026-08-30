/** =========================================================
 * BURAK ADMIN - SIGNUP VALIDATION & IMAGE PRELOADING
 * ========================================================= */

$(document).ready(function () {
  console.log("Signup Script Loaded.");

  // Image preloading preview
  $("#memberImageInput").on("change", function () {
    const file = this.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        alert("Please upload a valid image file (JPEG, PNG, WEBP)!");
        this.value = "";
        $("#memberImagePreview").addClass("d-none").attr("src", "");
        return false;
      }

      // 5MB maximum file size
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should not exceed 5MB!");
        this.value = "";
        $("#memberImagePreview").addClass("d-none").attr("src", "");
        return false;
      }

      const reader = new FileReader();
      reader.onload = function (e) {
        $("#memberImagePreview")
          .attr("src", e.target.result)
          .removeClass("d-none");
      };
      reader.readAsDataURL(file);
    }
  });

  // Frontend Form Validation before submission
  $("#signupForm").on("submit", function () {
    const memberNick = $("input[name=memberNick]").val().trim();
    const memberPhone = $("input[name=memberPhone]").val().trim();
    const memberPassword = $("input[name=memberPassword]").val().trim();
    const memberImage = $("#memberImageInput").get(0).files[0];

    if (memberNick === "") {
      alert("Please enter the restaurant nickname!");
      $("input[name=memberNick]").focus();
      return false;
    }

    if (memberNick.length < 3) {
      alert("Restaurant nickname must be at least 3 characters long!");
      $("input[name=memberNick]").focus();
      return false;
    }

    if (memberPhone === "") {
      alert("Please enter the official phone number!");
      $("input[name=memberPhone]").focus();
      return false;
    }

    if (memberPassword === "") {
      alert("Please enter your admin password!");
      $("input[name=memberPassword]").focus();
      return false;
    }

    if (memberPassword.length < 4) {
      alert("Password must be at least 4 characters long!");
      $("input[name=memberPassword]").focus();
      return false;
    }

    return true;
  });
});
