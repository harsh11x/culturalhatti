const currencyFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
});

const escapeHtml = (value) =>
    String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

const formatCurrency = (amount) => currencyFormatter.format(parseFloat(amount || 0));

const formatAddressMultiline = (address = {}) => {
    if (!address || typeof address !== 'object') return ['N/A'];
    const lines = [];
    const fullName = [address.name, address.phone].filter(Boolean).join(' - ');
    if (fullName) lines.push(fullName);
    if (address.line1) lines.push(address.line1);
    if (address.line2) lines.push(address.line2);
    const cityLine = [address.city, address.state, address.pincode].filter(Boolean).join(', ');
    if (cityLine) lines.push(cityLine);
    if (address.country) lines.push(address.country);
    return lines.length ? lines : ['N/A'];
};

const calculateLineTotal = (item = {}) =>
    (parseFloat(item.price_at_purchase || item.price || 0) * parseInt(item.quantity || 0, 10));

const getCustomerEmail = (order = {}) =>
    order.shipping_address?.email || order.user?.email || order.email || null;

const getCustomerPhone = (order = {}) =>
    order.shipping_address?.phone || order.user?.phone || null;

module.exports = {
    escapeHtml,
    formatCurrency,
    formatAddressMultiline,
    calculateLineTotal,
    getCustomerEmail,
    getCustomerPhone,
};
