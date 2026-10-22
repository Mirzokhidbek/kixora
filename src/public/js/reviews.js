/** Admin review moderation (hide/show, reply, delete) */
$(function () {
  // 1. Hide / Show toggle (rating aggregates are recomputed on the server)
  $(document).on("click", ".review-toggle-btn", function () {
    const btn = $(this);
    const id = btn.data("id");
    const next = btn.data("status") === "VISIBLE" ? "HIDDEN" : "VISIBLE";
    btn.prop("disabled", true);

    axios
      .post(`/admin/review/${id}/status`, { reviewStatus: next })
      .then(() => {
        btn.data("status", next).text(next === "VISIBLE" ? "Hide" : "Show");
        $(`#review-badge-${id}`)
          .removeClass("active block")
          .addClass(next === "VISIBLE" ? "active" : "block")
          .text(next);
      })
      .catch((err) => {
        alert(err.response?.data?.message || "Failed to update review status!");
      })
      .finally(() => btn.prop("disabled", false));
  });

  // 2. Reply modal
  const replyModalEl = document.getElementById("reviewReplyModal");
  $(document).on("click", ".review-reply-btn", function () {
    $("#reviewReplyId").val($(this).data("id"));
    $("#reviewReplyText").val($(this).data("reply") || "");
    new bootstrap.Modal(replyModalEl).show();
  });

  $("#reviewReplyForm").on("submit", function (e) {
    e.preventDefault();
    const id = $("#reviewReplyId").val();
    const reply = $("#reviewReplyText").val().trim();
    const saveBtn = $("#reviewReplySaveBtn").prop("disabled", true);

    axios
      .post(`/admin/review/${id}/reply`, { adminReply: reply })
      .then(() => {
        const box = $(`#review-reply-${id}`);
        box.find(".reply-text").text(reply); // .text() keeps user content escaped
        box.toggleClass("d-none", !reply);
        $(`.review-reply-btn[data-id="${id}"]`).data("reply", reply);
        bootstrap.Modal.getInstance(replyModalEl)?.hide();
      })
      .catch((err) => {
        alert(err.response?.data?.message || "Failed to save reply!");
      })
      .finally(() => saveBtn.prop("disabled", false));
  });

  // 3. Delete
  $(document).on("click", ".review-delete-btn", function () {
    const id = $(this).data("id");
    if (!confirm("Delete this review permanently?")) return;

    axios
      .post(`/admin/review/${id}/delete`)
      .then(() => $(`#review-row-${id}`).fadeOut(200, function () { $(this).remove(); }))
      .catch((err) => {
        alert(err.response?.data?.message || "Failed to delete review!");
      });
  });
});
