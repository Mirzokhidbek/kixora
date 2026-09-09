/** =========================================================
 * KIXORA BRAND ADMIN - USERS & VIP REWARDS SCRIPT
 * ========================================================= */

$(document).ready(function () {
  console.log("KIXORA Customer Management Script Loaded.");

  // 1. Live Search by Name, Email, or Phone
  $("#userSearchInput").on("keyup", function () {
    const searchVal = $(this).val().toLowerCase().trim();

    $(".user-row").each(function () {
      const name = $(this).data("name") || "";
      const email = $(this).data("email") || "";
      const phone = $(this).data("phone") || "";

      if (!searchVal || name.includes(searchVal) || email.includes(searchVal) || phone.includes(searchVal)) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  });

  // 2. AJAX User Status Toggle (ACTIVE / BLOCK / DELETE)
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

        badge.css("transform", "scale(1.15)");
        setTimeout(() => badge.css("transform", "scale(1)"), 200);
      })
      .catch((err) => {
        alert("Failed to update user authorization status!");
        console.error(err);
      });
  });

  // 3. Open Loyalty Points Adjuster Modal
  $(".adjust-points-trigger").on("click", function () {
    const id = $(this).data("id");
    const name = $(this).data("name");
    const points = $(this).data("points");

    $("#adjustPointsUserId").val(id);
    $("#adjustPointsUserName").text(name);
    $("#adjustPointsValue").val(points);

    const pointsModal = new bootstrap.Modal(document.getElementById("adjustPointsModal"));
    pointsModal.show();
  });

  // 4. Save Loyalty Points via AJAX
  $("#adjustPointsForm").on("submit", function (e) {
    e.preventDefault();
    const id = $("#adjustPointsUserId").val();
    const points = Number($("#adjustPointsValue").val());

    const saveBtn = $("#savePointsBtn");
    saveBtn.prop("disabled", true).html('<i class="fa-solid fa-spinner fa-spin me-1"></i> Saving...');

    axios
      .post(`/admin/user/${id}/points`, { points: points })
      .then((response) => {
        $(`#user-points-badge-${id}`).html(`<i class="fa-solid fa-coins text-warning me-1"></i> ${points} pts`);
        const pointsModal = bootstrap.Modal.getInstance(document.getElementById("adjustPointsModal"));
        if (pointsModal) pointsModal.hide();
        saveBtn.prop("disabled", false).html('<i class="fa-solid fa-check me-1"></i> Save Points');
      })
      .catch((err) => {
        saveBtn.prop("disabled", false).html('<i class="fa-solid fa-check me-1"></i> Save Points');
        alert("Failed to update loyalty points!");
        console.error(err);
      });
  });
});
