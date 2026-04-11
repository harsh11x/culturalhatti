const { sendMail: sendBrevoEmail } = require('../config/brevo');
const logger = require('../utils/logger');
const {
    buildCustomerOrderConfirmationTemplate,
    buildAdminNewOrderTemplate,
} = require('./email/order-email.templates');
const { formatCurrency, getCustomerEmail } = require('./email/template.utils');

const FROM = process.env.EMAIL_FROM || 'Cultural Hatti <noreply@culturalhatti.in>';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@culturalhatti.in';
/** Inbox for website contact form submissions */
const CONTACT_INBOX_EMAIL = process.env.CONTACT_INBOX_EMAIL || 'culturehatti@gmail.com';

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

const sendMail = async ({ to, subject, html }) => {
    try {
        await sendBrevoEmail({ from: FROM, to, subject, html });
        logger.info(`Email sent to ${to}: ${subject}`);
    } catch (err) {
        logger.error(`Email failed to ${to}: ${err.message}`);
        throw err;
    }
};

// ─── Templates ──────────────────────────────────────

const sendOrderConfirmation = async (order) => {
    const html = buildCustomerOrderConfirmationTemplate(order);
    const recipient = getCustomerEmail(order);
    if (!recipient) {
        logger.warn('Skipping customer order confirmation email: no recipient', { order_number: order.order_number });
        return;
    }
    await sendMail({ to: recipient, subject: `Order Confirmed – #${order.order_number}`, html });
};

const sendOrderShipped = async (order) => {
    const html = `<!DOCTYPE html><html><head><style>${baseStyle}</style></head><body>
  <div class="wrapper">
    ${buildHeader('TRACKING ID SHARED')}
    <div class="body">
      <h2>Your order has been shipped! 🚚</h2>
      <p style="color:#0A0A0A;margin-bottom:20px;">Your tracking ID has been shared. You can now track your package.</p>
      <div class="info-row"><span class="label">Order Number</span><span class="value">#${order.order_number}</span></div>
      <div class="info-row"><span class="label">Courier</span><span class="value">${order.courier_name || 'N/A'}</span></div>
      <div class="info-row"><span class="label">Tracking ID</span><span class="value"><strong>${order.tracking_id || 'N/A'}</strong></span></div>
      <div class="info-row"><span class="label">Status</span><span class="value"><span class="status-badge">Shipped</span></span></div>
      <p style="color:#666;font-size:13px;margin-top:24px;">Use your tracking ID on the courier website to track your package.</p>
    </div>
    ${buildFooter()}
  </div></body></html>`;
    const recipient = getCustomerEmail(order);
    if (!recipient) {
        logger.warn('Skipping customer shipped email: no recipient', { order_number: order.order_number });
        return;
    }
    await sendMail({ to: recipient, subject: `Order Shipped – #${order.order_number} | Tracking: ${order.tracking_id}`, html });
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
    const recipient = getCustomerEmail(order);
    if (!recipient) {
        logger.warn('Skipping customer cancelled email: no recipient', { order_number: order.order_number });
        return;
    }
    await sendMail({ to: recipient, subject: `Order Cancelled – #${order.order_number}`, html });
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
    const recipient = getCustomerEmail(order);
    if (!recipient) {
        logger.warn('Skipping customer refunded email: no recipient', { order_number: order.order_number });
        return;
    }
    await sendMail({ to: recipient, subject: `Refund Initiated – #${order.order_number}`, html });
};

const sendAdminNewOrder = async (order) => {
    const html = buildAdminNewOrderTemplate(order);
    await sendMail({ to: ADMIN_EMAIL, subject: `🛍️ New Order #${order.order_number} - ${formatCurrency(order.total_amount)}`, html });
};

const sendAdminOrderShipped = async (order) => {
    const html = `<!DOCTYPE html><html><head><style>${baseStyle}</style></head><body>
  <div class="wrapper">
    ${buildHeader('ORDER SHIPPED — ADMIN UPDATE')}
    <div class="body">
      <h2>Order Marked as Shipped</h2>
      <div class="info-row"><span class="label">Order #</span><span class="value">${order.order_number}</span></div>
      <div class="info-row"><span class="label">Customer</span><span class="value">${order.user?.name || 'N/A'} (${order.user?.email || 'N/A'})</span></div>
      <div class="info-row"><span class="label">Courier</span><span class="value">${order.courier_name || 'N/A'}</span></div>
      <div class="info-row"><span class="label">Tracking ID</span><span class="value">${order.tracking_id || 'N/A'}</span></div>
      <p style="color:#666;font-size:13px;">Customer has been notified with tracking details.</p>
    </div>
    ${buildFooter()}
  </div></body></html>`;
    await sendMail({ to: ADMIN_EMAIL, subject: `🚚 Shipped: Order #${order.order_number} | ${order.tracking_id || 'Tracking added'}`, html });
};

const sendAdminOrderCancelled = async (order) => {
    const html = `<!DOCTYPE html><html><head><style>${baseStyle}</style></head><body>
  <div class="wrapper">
    ${buildHeader('ORDER CANCELLED — ADMIN UPDATE')}
    <div class="body">
      <h2>Order Cancelled</h2>
      <div class="info-row"><span class="label">Order #</span><span class="value">${order.order_number}</span></div>
      <div class="info-row"><span class="label">Customer</span><span class="value">${order.user?.name || 'N/A'} (${order.user?.email || 'N/A'})</span></div>
      <div class="info-row"><span class="label">Reason</span><span class="value">${order.cancelled_reason || 'N/A'}</span></div>
      <div class="info-row"><span class="label">Amount</span><span class="value">₹${parseFloat(order.total_amount).toFixed(2)}</span></div>
    </div>
    ${buildFooter()}
  </div></body></html>`;
    await sendMail({ to: ADMIN_EMAIL, subject: `❌ Cancelled: Order #${order.order_number}`, html });
};

const sendAdminPaymentFailed = async (order) => {
    const html = `<!DOCTYPE html><html><head><style>${baseStyle}</style></head><body>
  <div class="wrapper">
    ${buildHeader('PAYMENT FAILED — ADMIN ALERT')}
    <div class="body">
      <h2>Payment Failed</h2>
      <div class="info-row"><span class="label">Order #</span><span class="value">${order.order_number}</span></div>
      <div class="info-row"><span class="label">Customer</span><span class="value">${order.user?.name || 'N/A'} (${order.user?.email || 'N/A'})</span></div>
      <div class="info-row"><span class="label">Amount</span><span class="value">₹${parseFloat(order.total_amount).toFixed(2)}</span></div>
      <p style="color:#666;font-size:13px;">Customer may retry or contact support.</p>
    </div>
    ${buildFooter()}
  </div></body></html>`;
    await sendMail({ to: ADMIN_EMAIL, subject: `⚠️ Payment Failed: Order #${order.order_number}`, html });
};

const sendAdminOrderRefunded = async (order) => {
    const html = `<!DOCTYPE html><html><head><style>${baseStyle}</style></head><body>
  <div class="wrapper">
    ${buildHeader('REFUND PROCESSED — ADMIN UPDATE')}
    <div class="body">
      <h2>Refund Initiated</h2>
      <div class="info-row"><span class="label">Order #</span><span class="value">${order.order_number}</span></div>
      <div class="info-row"><span class="label">Customer</span><span class="value">${order.user?.name || 'N/A'} (${order.user?.email || 'N/A'})</span></div>
      <div class="info-row"><span class="label">Refund ID</span><span class="value">${order.refund_id || 'N/A'}</span></div>
      <div class="info-row"><span class="label">Amount</span><span class="value">₹${parseFloat(order.total_amount).toFixed(2)}</span></div>
    </div>
    ${buildFooter()}
  </div></body></html>`;
    await sendMail({ to: ADMIN_EMAIL, subject: `💸 Refund: Order #${order.order_number} - ₹${parseFloat(order.total_amount).toFixed(2)}`, html });
};

const escapeHtml = (s) =>
    String(s || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

/**
 * Notify inbox when someone submits the public contact form.
 */
const sendContactFormSubmission = async ({ name, email, phone, message }) => {
    const html = `
<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;line-height:1.5;color:#111;">
  <h2 style="margin:0 0 12px;">New message — Cultural Hatti website</h2>
  <p style="margin:8px 0;"><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
  ${phone ? `<p style="margin:8px 0;"><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ''}
  <p style="margin:16px 0 8px;"><strong>Message</strong></p>
  <div style="white-space:pre-wrap;border:1px solid #ddd;padding:16px;background:#fafafa;">${escapeHtml(message)}</div>
  <p style="margin-top:24px;font-size:12px;color:#666;">Reply directly to this customer at ${escapeHtml(email)}</p>
</body></html>`;
    await sendMail({
        to: CONTACT_INBOX_EMAIL,
        subject: `Contact form: ${name.slice(0, 60)}`,
        html,
    });
};

module.exports = {
    sendOrderConfirmation,
    sendOrderShipped,
    sendOrderCancelled,
    sendOrderRefunded,
    sendAdminNewOrder,
    sendAdminOrderShipped,
    sendAdminOrderCancelled,
    sendAdminOrderRefunded,
    sendAdminPaymentFailed,
    sendContactFormSubmission,
};
