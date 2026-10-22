/** Admin security page: 2FA on/off and admin accounts */
$(function () {
  const fail = (err) => alert(err.response?.data?.message || "Something went wrong.");

  $("#enable2faBtn").on("click", function () {
    axios
      .post("/admin/security/2fa/enable", { code: $("#enableCode").val().trim() })
      .then(() => {
        alert("Two-step verification is on. You will need a code at your next login.");
        window.location.reload();
      })
      .catch(fail);
  });

  $("#disable2faBtn").on("click", function () {
    if (!confirm("Turn off two-step verification?")) return;
    axios
      .post("/admin/security/2fa/disable", { code: $("#disableCode").val().trim() })
      .then(() => window.location.reload())
      .catch(fail);
  });

  $("#createAdminForm").on("submit", function (e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(this).entries());
    axios
      .post("/admin/security/admins", data)
      .then(() => window.location.reload())
      .catch(fail);
  });

  $(document).on("click", ".admin-status-btn", function () {
    const next = $(this).data("next");
    if (next === "BLOCK" && !confirm("Deactivate this admin? They will not be able to log in.")) return;
    axios
      .post(`/admin/security/admins/${$(this).data("id")}/status`, { memberStatus: next })
      .then(() => window.location.reload())
      .catch(fail);
  });
});
