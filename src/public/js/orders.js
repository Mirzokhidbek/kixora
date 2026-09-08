/** =========================================================
 * KIXORA BRAND ADMIN - ORDER FULFILLMENT SCRIPT
 * ========================================================= */

$(document).ready(function () {
  console.log("KIXORA Orders Management Script Loaded.");

  // Function to update order status via AJAX
  function updateOrderStatus(id, orderStatus, callback) {
    axios
      .post("/admin/order/edit", {
        orderId: id,
        orderStatus: orderStatus,
      })
      .then((response) => {
        const badge = $(`#order-badge-${id}`);
        
        let statusClass = "bg-warning text-dark";
        let statusLabel = "PENDING (PAUSE)";
        if (orderStatus === "PROCESS") {
          statusClass = "bg-primary text-white";
          statusLabel = "IN TRANSIT (PROCESS)";
        } else if (orderStatus === "FINISH") {
          statusClass = "bg-success text-white";
          statusLabel = "DELIVERED (FINISH)";
        } else if (orderStatus === "DELETE") {
          statusClass = "bg-danger text-white";
          statusLabel = "CANCELLED";
        }

        badge
          .removeClass("bg-warning text-dark bg-primary text-white bg-success bg-danger")
          .addClass(`badge ${statusClass}`)
          .text(statusLabel);

        // Micro-animation feedback
        badge.css("transform", "scale(1.15)");
        setTimeout(() => badge.css("transform", "scale(1)"), 250);

        if (callback) callback(null, response.data);
      })
      .catch((err) => {
        alert("Failed to update order status. Please check your admin privileges.");
        console.error("Order status update error:", err);
        if (callback) callback(err);
      });
  }

  // 1. Dropdown Select Status Change Handler
  $(".order-status-select").on("change", function () {
    const id = $(this).data("id");
    const orderStatus = $(this).val();
    updateOrderStatus(id, orderStatus);
  });

  // 2. 1-Click Quick Action Button Handler (Dispatch / Deliver)
  $(".quick-status-btn").on("click", function () {
    const btn = $(this);
    const id = btn.data("id");
    const targetStatus = btn.data("status");

    btn.prop("disabled", true).html('<i class="fa-solid fa-spinner fa-spin"></i> Updating...');

    updateOrderStatus(id, targetStatus, (err) => {
      if (!err) {
        // Sync the select dropdown
        $(`.order-status-select[data-id="${id}"]`).val(targetStatus);
        
        // Transform button to next step or hide if finished
        if (targetStatus === "PROCESS") {
          btn
            .removeClass("btn-dark")
            .addClass("btn-success")
            .data("status", "FINISH")
            .prop("disabled", false)
            .html('<i class="fa-solid fa-check me-1"></i> Deliver');
        } else if (targetStatus === "FINISH") {
          btn.fadeOut(300);
        }
      } else {
        btn.prop("disabled", false).text("Retry");
      }
    });
  });
});
