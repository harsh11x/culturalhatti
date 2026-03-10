const SibApiV3Sdk = require('sib-api-v3-sdk');
const logger = require('../utils/logger');

const apiKey = process.env.BREVO_API_KEY;
let apiInstance = null;

if (apiKey) {
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKeyAuth = defaultClient.authentications['api-key'];
    apiKeyAuth.apiKey = apiKey;
    apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
}

/**
 * Parse "Name <email@example.com>" or "email@example.com" into { name, email }
 */
const parseFrom = (fromStr) => {
    const match = fromStr && fromStr.match(/^(.+?)\s*<([^>]+)>$/);
    if (match) return { name: match[1].trim(), email: match[2].trim() };
    return { name: 'Cultural Hatti', email: fromStr || 'noreply@culturalhatti.in' };
};

/**
 * Send email via Brevo Transactional API
 * @param {Object} opts - { from, to, subject, html }
 */
const sendMail = async (opts) => {
    if (!apiInstance || !apiKey) {
        logger.warn('Brevo API key not set (BREVO_API_KEY). Email not sent.', { to: opts.to, subject: opts.subject });
        return;
    }
    const sender = parseFrom(opts.from);
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.sender = sender;
    sendSmtpEmail.to = [{ email: opts.to }];
    sendSmtpEmail.subject = opts.subject;
    sendSmtpEmail.htmlContent = opts.html;

    await apiInstance.sendTransacEmail(sendSmtpEmail);
};

module.exports = { sendMail };
