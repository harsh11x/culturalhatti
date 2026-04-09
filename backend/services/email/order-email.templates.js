const {
    escapeHtml,
    formatCurrency,
    formatAddressMultiline,
    calculateLineTotal,
    getCustomerPhone,
} = require('./template.utils');

const baseStyles = `
body { font-family: Arial, sans-serif; margin: 0; padding: 0; background: #f6f8fb; color: #111827; }
.container { max-width: 680px; margin: 0 auto; background: #ffffff; }
.header { background: #111827; padding: 24px; color: #ffffff; }
.header h1 { margin: 0; font-size: 22px; }
.header p { margin: 6px 0 0; color: #d1d5db; font-size: 13px; }
.content { padding: 24px; }
.section-title { margin: 0 0 12px; font-size: 16px; color: #111827; }
.meta-grid { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
.meta-grid td { padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-size: 14px; vertical-align: top; }
.meta-label { color: #6b7280; width: 40%; }
.meta-value { color: #111827; font-weight: 600; text-align: right; }
.address-block { padding: 12px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; margin: 12px 0 20px; font-size: 14px; line-height: 1.5; }
.items-table { width: 100%; border-collapse: collapse; margin: 4px 0 16px; }
.items-table th, .items-table td { border: 1px solid #e5e7eb; padding: 10px; font-size: 13px; text-align: left; }
.items-table th { background: #f3f4f6; color: #111827; }
.items-table .num { text-align: right; white-space: nowrap; }
.total-line { text-align: right; font-size: 18px; font-weight: 700; margin-top: 12px; }
.footer { padding: 20px 24px; background: #f9fafb; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; text-align: center; }
`;

const renderLayout = ({ preheader, title, subtitle, bodyHtml }) => `
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <style>${baseStyles}</style>
</head>
<body>
  <span style="display:none!important;visibility:hidden;opacity:0;height:0;width:0;overflow:hidden;">${escapeHtml(preheader)}</span>
  <div class="container">
    <div class="header">
      <h1>${escapeHtml(title)}</h1>
      <p>${escapeHtml(subtitle)}</p>
    </div>
    <div class="content">
      ${bodyHtml}
    </div>
    <div class="footer">
      Cultural Hatti | Automated order notification
    </div>
  </div>
</body>
</html>
`;

const renderAddress = (address = {}) => {
    const lines = formatAddressMultiline(address).map((line) => escapeHtml(line)).join('<br/>');
    return `<div class="address-block">${lines}</div>`;
};

const renderItemsTable = (items = []) => {
    const rows = items.map((item) => `
      <tr>
        <td>${escapeHtml(item.product_name || item.name || 'Product')}</td>
        <td class="num">${parseInt(item.quantity || 0, 10)}</td>
        <td class="num">${formatCurrency(item.price_at_purchase || item.price || 0)}</td>
        <td class="num">${formatCurrency(calculateLineTotal(item))}</td>
      </tr>
    `).join('');

    return `
      <table class="items-table" role="presentation">
        <thead>
          <tr>
            <th>Product</th>
            <th class="num">Qty</th>
            <th class="num">Unit Price</th>
            <th class="num">Line Total</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    `;
};

const buildCustomerOrderConfirmationTemplate = (order) => {
    const bodyHtml = `
      <h2 class="section-title">Thank you for your order.</h2>
      <table class="meta-grid" role="presentation">
        <tr><td class="meta-label">Order Number</td><td class="meta-value">#${escapeHtml(order.order_number)}</td></tr>
        <tr><td class="meta-label">Payment ID</td><td class="meta-value">${escapeHtml(order.payment_id || 'Pending')}</td></tr>
        <tr><td class="meta-label">Order Status</td><td class="meta-value">Confirmed</td></tr>
      </table>
      <h2 class="section-title">Shipping Address</h2>
      ${renderAddress(order.shipping_address)}
      <h2 class="section-title">Items in your order</h2>
      ${renderItemsTable(order.items || [])}
      <div class="total-line">Order Total: ${formatCurrency(order.total_amount)}</div>
    `;

    return renderLayout({
        preheader: `Order #${order.order_number} confirmed`,
        title: 'Order Confirmation',
        subtitle: 'Your order has been successfully placed',
        bodyHtml,
    });
};

const buildAdminNewOrderTemplate = (order) => {
    const user = order.user || {};
    const phone = getCustomerPhone(order) || 'N/A';
    const customerEmail = order.shipping_address?.email || user.email || 'N/A';
    const bodyHtml = `
      <h2 class="section-title">A new order was placed.</h2>
      <table class="meta-grid" role="presentation">
        <tr><td class="meta-label">Order Number</td><td class="meta-value">#${escapeHtml(order.order_number)}</td></tr>
        <tr><td class="meta-label">Total Amount</td><td class="meta-value">${formatCurrency(order.total_amount)}</td></tr>
        <tr><td class="meta-label">Payment ID</td><td class="meta-value">${escapeHtml(order.payment_id || 'Pending')}</td></tr>
        <tr><td class="meta-label">Customer Name</td><td class="meta-value">${escapeHtml(user.name || 'N/A')}</td></tr>
        <tr><td class="meta-label">Customer Email</td><td class="meta-value">${escapeHtml(customerEmail)}</td></tr>
        <tr><td class="meta-label">Customer Phone</td><td class="meta-value">${escapeHtml(phone)}</td></tr>
      </table>
      <h2 class="section-title">Shipping Address</h2>
      ${renderAddress(order.shipping_address)}
      <h2 class="section-title">Ordered Items</h2>
      ${renderItemsTable(order.items || [])}
      <div class="total-line">Grand Total: ${formatCurrency(order.total_amount)}</div>
    `;

    return renderLayout({
        preheader: `New order #${order.order_number} received`,
        title: 'New Order Alert',
        subtitle: 'Admin notification',
        bodyHtml,
    });
};

module.exports = {
    buildCustomerOrderConfirmationTemplate,
    buildAdminNewOrderTemplate,
};
