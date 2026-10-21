// ============================================================
//  365 WANDERLUST — Contact Link Helpers
//  Single place for all contact URL generation
// ============================================================

import { contact } from '../data/siteData';

/**
 * Generate a WhatsApp click-to-chat link with pre-filled message
 * @param {string} message - Custom message. Defaults to the siteData default.
 * @returns {string} Full api.whatsapp.com URL with encoded message
 */
export function getWhatsAppLink(message) {
  const msg = message || contact.whatsappDefaultMessage;
  // Use api.whatsapp.com/send directly instead of wa.me.
  // wa.me redirects to this endpoint and corrupts emoji percent-encoding
  // (replaces emojis with U+FFFD replacement characters during the redirect).
  return `https://api.whatsapp.com/send?phone=${contact.whatsappNumber}&text=${encodeURIComponent(msg)}`;
}

/**
 * Generate a mailto: link with optional subject and body
 * @param {string} subject - Email subject line (optional)
 * @param {string} body    - Email body text (optional)
 * @returns {string} mailto URL
 */
export function getMailtoLink(subject = '', body = '') {
  let href = `mailto:${contact.email}`;
  const params = [];
  if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
  if (body)    params.push(`body=${encodeURIComponent(body)}`);
  if (params.length) href += `?${params.join('&')}`;
  return href;
}

/**
 * Generate a tel: link for a phone number string
 * @param {string} number - Phone number with country code, e.g. '+917425010750'
 * @returns {string} tel: URL
 */
export function getTelLink(number) {
  return `tel:${number}`;
}
