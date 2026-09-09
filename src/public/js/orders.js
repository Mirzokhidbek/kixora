/** =========================================================
 * KIXORA BRAND ADMIN - ORDERS & LOGISTICS SCRIPT
 * ========================================================= */

$(document).ready(function () {
  console.log("KIXORA Orders & Logistics Script Loaded.");

  // 1. Live Search by Customer, Phone, or Order ID
  $("#orderSearchInput").on("keyup", function () {
    filterOrdersTable();
  });

  // 2. Status Filter Tabs (ALL, PAUSE, PROCESS, FINISH)
  $(".order-status-filter-btn").on("click", function () {
    $(".order-status-filter-btn").removeClass("btn-dark active").addClass("btn-outline-secondary");
    $(this).removeClass("btn-outline-secondary").addClass("btn-dark active");
    filterOrdersTable();
  });

  function filterOrdersTable() {
    const searchVal = $("#orderSearchInput").val().toLowerCase().trim();
    const activeStatus = $(".order-status-filter-btn.active").data("status");

    $(".order-row").each(function () {
      const displayId = $(this).data("display-id") || "";
      const customer = $(this).data("customer") || "";
      const phone = $(this).data("phone") || "";
      const email = $(this).data("email") || "";
      const status = $(this).data("status") || "";

      const matchesSearch =
        !searchVal ||
        displayId.includes(searchVal) ||
        customer.includes(searchVal) ||
        phone.includes(searchVal) ||
        email.includes(searchVal);

      const matchesStatus = activeStatus === "ALL" || status === activeStatus;

      if (matchesSearch && matchesStatus) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  }

  // 3. 1-Click Status Transitions (PAUSE -> PROCESS -> FINISH)
  $(document).on("click", ".status-step-btn", function () {
    const btn = $(this);
    const orderId = btn.data("id");
    const nextStatus = btn.data("next");

    btn.prop("disabled", true).html('<i class="fa-solid fa-spinner fa-spin"></i> Updating...');

    axios
      .post("/admin/order/edit", {
        orderId: orderId,
        orderStatus: nextStatus,
      })
      .then((response) => {
        window.location.reload();
      })
      .catch((err) => {
        alert("Failed to update order fulfillment status!");
        console.error(err);
        btn.prop("disabled", false);
      });
  });

  // 4. View Printable Packing Slip / Invoice Modal
  $(".view-invoice-trigger").on("click", function () {
    const displayId = $(this).data("display-id");
    const date = $(this).data("date");
    const status = $(this).data("status");
    const customer = $(this).data("customer");
    const phone = $(this).data("phone");
    const email = $(this).data("email");
    const address = $(this).data("address");
    const total = $(this).data("total");

    $("#invoiceOrderNumber").text(displayId);
    $("#invoiceOrderDate").text(date);
    $("#invoiceOrderStatus").text(status);
    $("#invoiceCustomerName").text(customer);
    $("#invoiceCustomerPhone").text(phone);
    $("#invoiceCustomerEmail").text(email);
    $("#invoiceCustomerAddress").text(address);
    $("#invoiceTotalAmount").text("$" + total);

    const invoiceModal = new bootstrap.Modal(document.getElementById("invoiceModal"));
    invoiceModal.show();
  });

  // 5. Print Invoice
  $("#printInvoiceBtn").on("click", function () {
    const printContent = document.getElementById("printableInvoiceArea").innerHTML;
    const printWindow = window.open("", "_blank", "width=800,height=600");
    printWindow.document.write(`
      <html>
        <head>
          <title>KIXORA Packing Slip</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
          <style>
            body { font-family: sans-serif; padding: 20px; }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 400);
  });
});
