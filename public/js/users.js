/** =========================================================
 * BURAK ADMIN - USER MANAGEMENT SCRIPT
 * ========================================================= */

$(document).ready(function () {
  console.log("Users Management Script Loaded.");

  // AJAX User Status Update Handler
  $(".user-status-select").on("change", function () {
    const id = $(this).data("id");
    const memberStatus = $(this).val();

    axios
      .post("/admin/user/edit", {
        _id: id,
        memberStatus: memberStatus,
      })
      .then((response) => {
        const badge = $(`#user-badge-${id}`);
        badge
          .removeClass("active block delete")
          .addClass(memberStatus.toLowerCase())
          .text(memberStatus);

        // Micro-animation feedback
        badge.css("transform", "scale(1.15)");
        setTimeout(() => badge.css("transform", "scale(1)"), 200);
      })
      .catch((err) => {
        alert("Failed to update user status!");
        console.error(err);
      });
  });
});
