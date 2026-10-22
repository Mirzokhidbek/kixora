/** Admin inbox: mark contact messages resolved / reopen */
$(function () {
  $(document).on("click", ".message-status-btn", function () {
    const btn = $(this);
    const id = btn.data("id");
    const next = btn.data("next");
    btn.prop("disabled", true);

    axios
      .post(`/admin/inbox/${id}/status`, { status: next })
      .then(() => {
        $(`#msg-badge-${id}`)
          .removeClass("pause active")
          .addClass(next === "NEW" ? "pause" : "active")
          .text(next);
        btn.data("next", next === "NEW" ? "RESOLVED" : "NEW").text(next === "NEW" ? "Mark resolved" : "Reopen");
      })
      .catch((err) => alert(err.response?.data?.message || "Failed to update the message."))
      .finally(() => btn.prop("disabled", false));
  });
});
