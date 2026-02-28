const transporter = require('../config/mailer');
const logger = require('../utils/logger');

const FROM = process.env.EMAIL_FROM || 'Cultural Hatti <noreply@culturalhatti.in>';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@culturalhatti.in';

const baseStyle = `
  body { font-family: 'Arial', sans-serif; background: #F5F0E8; margin: 0; padding: 0; }
  .wrapper { max-width: 600px; margin: 0 auto; background: #0A0A0A; }
  .header { background: #0A0A0A; padding: 32px; border-bottom: 4px solid #FF9933; }
  .header h1 { color: #FF9933; font-size: 28px; margin: 0; letter-spacing: 2px; text-transform: uppercase; }
  .header p { color: #F5F0E8; margin: 4px 0 0; font-size: 12px; letter-spacing: 3px; }
  .body { padding: 32px; background: #F5F0E8; }
  .body h2 { color: #0A0A0A; font-size: 20px; border-left: 4px solid #FF9933; padding-left: 12px; margin-top: 0; }
  .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #ddd; font-size: 14px; }
  .label { color: #666; font-weight: bold; }
  .value { color: #0A0A0A; text-align: right; }
  .status-badge { display: inline-block; background: #FF9933; color: #0A0A0A; padding: 4px 12px; font-weight: bold; font-size: 12px; text-transform: uppercase; }
  .product-row { padding: 12px 0; border-bottom: 1px solid #ddd; display: flex; justify-content: space-between; align-items: center; }
  .product-name { font-weight: bold; color: #0A0A0A; }
  .product-qty { color: #666; font-size: 13px; }
  .total-row { padding: 16px 0; border-top: 3px solid #0A0A0A; display: flex; justify-content: space-between; font-size: 18px; font-weight: bold; }
  .footer { background: #0A0A0A; padding: 24px 32px; text-align: center; }
  .footer p { color: #666; font-size: 12px; margin: 4px 0; }
  .cta-btn { display: inline-block; background: #E8321A; color: #F5F0E8; padding: 14px 28px; font-weight: bold; text-decoration: none; font-size: 14px; margin-top: 16px; letter-spacing: 1px; text-transform: uppercase; }
`;

const buildHeader = (subtitle = '') => `
  <div class="header">
    <h1>Cultural Hatti</h1>
    <p>${subtitle}</p>
  </div>
`;

const buildFooter = () => `
  <div class="footer">
    <p>Cultural Hatti — Authentic Indian Culture & Craftsmanship</p>
    <p>This is an automated email. Do not reply.</p>
  </div>
`;

const formatAddress = (addr) => {
    if (typeof addr === 'string') return addr;
    return `${addr.name}, ${addr.line1}${addr.line2 ? ', ' + addr.line2 : ''}, ${addr.city}, ${addr.state} - ${addr.pincode}`;
};

const buildItemsTable = (items = []) =>
    items
        .map(
            (item) => `
    <div class="product-row">
      <div>
        <div class="product-name">${item.product_name || item.name}</div>
        <div class="product-qty">Qty: ${item.quantity}</div>
      </div>
      <div>₹${(parseFloat(item.price_at_purchase || item.price) * item.quantity).toFixed(2)}</div>
    </div>`
        )
        .join('');

const sendMail = async ({ to, subject, html }) => {
    try {
        await transporter.sendMail({ from: FROM, to, subject, html });
        logger.info(`Email sent to ${to}: ${subject}`);
    } catch (err) {
        logger.error(`Email failed to ${to}: ${err.message}`);
        throw err;
    }
};

// ─── Templates ──────────────────────────────────────

const sendOrderConfirmation = async (order) => {
    const addr = formatAddress(order.shipping_address);
    const items = order.items || [];
    const html = `<!DOCTYPE html><html><head><style>${baseStyle}</style></head><body>
  <div class="wrapper">
    ${buildHeader('ORDER CONFIRMED')}
    <div class="body">
      <h2>Your order is confirmed! 🎉</h2>
      <div class="info-row"><span class="label">Order Number</span><span class="value">#${order.order_number}</span></div>
      <div class="info-row"><span class="label">Payment ID</span><span class="value">${order.payment_id}</span></div>
      <div class="info-row"><span class="label">Status</span><span class="value"><span class="status-badge">Confirmed</span></span></div>
      <div class="info-row"><span class="label">Ship To</span><span class="value">${addr}</span></div>
      <h2>Items Ordered</h2>
      ${buildItemsTable(items)}
      <div class="total-row"><span>Total Paid</span><span>₹${parseFloat(order.total_amount).toFixed(2)}</span></div>
      <p style="color:#666;font-size:13px;">We'll notify you once your order is shipped with a tracking ID.</p>
    </div>
    ${buildFooter()}
  </div></body></html>`;
    await sendMail({ to: order.user?.email || order.email, subject: `Order Confirmed – #${order.order_number}`, html });
};

const sendOrderShipped = async (order) => {
    const html = `<!DOCTYPE html><html><head><style>${baseStyle}</style></head><body>
  <div class="wrapper">
    ${buildHeader('YOUR ORDER IS ON THE WAY')}
    <div class="body">
      <h2>Your order has been shipped! 🚚</h2>
      <div class="info-row"><span class="label">Order Number</span><span class="value">#${order.order_number}</span></div>
      <div class="info-row"><span class="label">Courier</span><span class="value">${order.courier_name || 'N/A'}</span></div>
      <div class="info-row"><span class="label">Tracking ID</span><span class="value">${order.tracking_id || 'N/A'}</span></div>
      <div class="info-row"><span class="label">Status</span><span class="value"><span class="status-badge">Shipped</span></span></div>
      <p style="color:#0A0A0A;margin-top:24px;">Use your tracking ID on the courier website to track your package.</p>
    </div>
    ${buildFooter()}
  </div></body></html>`;
    await sendMail({ to: order.user?.email || order.email, subject: `Order Shipped – #${order.order_number} | Tracking: ${order.tracking_id}`, html });
};

const sendOrderCancelled = async (order) => {
    const html = `<!DOCTYPE html><html><head><style>${baseStyle}</style></head><body>
  <div class="wrapper">
    ${buildHeader('ORDER CANCELLED')}
    <div class="body">
      <h2>Your order has been cancelled</h2>
      <div class="info-row"><span class="label">Order Number</span><span class="value">#${order.order_number}</span></div>
      <div class="info-row"><span class="label">Reason</span><span class="value">${order.cancelled_reason || 'Requested'}</span></div>
      <p style="color:#666;font-size:13px;">If you paid online, a refund will be processed within 5–7 business days.</p>
    </div>
    ${buildFooter()}
  </div></body></html>`;
    await sendMail({ to: order.user?.email || order.email, subject: `Order Cancelled – #${order.order_number}`, html });
};

const sendOrderRefunded = async (order) => {
    const html = `<!DOCTYPE html><html><head><style>${baseStyle}</style></head><body>
  <div class="wrapper">
    ${buildHeader('REFUND PROCESSED')}
    <div class="body">
      <h2>Your refund has been initiated</h2>
      <div class="info-row"><span class="label">Order Number</span><span class="value">#${order.order_number}</span></div>
      <div class="info-row"><span class="label">Refund ID</span><span class="value">${order.refund_id || 'N/A'}</span></div>
      <div class="info-row"><span class="label">Amount</span><span class="value">₹${parseFloat(order.total_amount).toFixed(2)}</span></div>
      <p style="color:#666;font-size:13px;">Refunds typically appear within 5–7 business days depending on your bank.</p>
    </div>
    ${buildFooter()}
  </div></body></html>`;
    await sendMail({ to: order.user?.email || order.email, subject: `Refund Initiated – #${order.order_number}`, html });
};

const sendAdminNewOrder = async (order) => {
    const items = order.items || [];
    const addr = formatAddress(order.shipping_address);
    const html = `<!DOCTYPE html><html><head><style>${baseStyle}</style></head><body>
  <div class="wrapper">
    ${buildHeader('NEW ORDER RECEIVED — ADMIN ALERT')}
    <div class="body">
      <h2>New Order Received</h2>
      <div class="info-row"><span class="label">Order #</span><span class="value">${order.order_number}</span></div>
      <div class="info-row"><span class="label">Customer</span><span class="value">${order.user?.name || 'N/A'}</span></div>
      <div class="info-row"><span class="label">Customer Email</span><span class="value">${order.user?.email || 'N/A'}</span></div>
      <div class="info-row"><span class="label">Razorpay Payment ID</span><span class="value">${order.payment_id || 'Pending'}</span></div>
      <div class="info-row"><span class="label">Total Amount</span><span class="value">₹${parseFloat(order.total_amount).toFixed(2)}</span></div>
      <div class="info-row"><span class="label">Shipping To</span><span class="value">${addr}</span></div>
      <h2>Items</h2>
      ${buildItemsTable(items)}
      <div class="total-row"><span>Total</span><span>₹${parseFloat(order.total_amount).toFixed(2)}</span></div>
    </div>
    ${buildFooter()}
  </div></body></html>`;
    await sendMail({ to: ADMIN_EMAIL, subject: `New Order Received – Order #${order.order_number}`, html });
};

module.exports = {
    sendOrderConfirmation,
    sendOrderShipped,
    sendOrderCancelled,
    sendOrderRefunded,
    sendAdminNewOrder,
};
