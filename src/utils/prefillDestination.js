// ============================================================
//  prefillDestination — navigate to Contact + prefill cascading
//  destination dropdowns in the EnquiryForm.
//
//  Dispatches a CustomEvent('prefillDestination') that the
//  EnquiryForm listens for, then smooth-scrolls to #contact
//  (accounting for the 80px sticky navbar).
// ============================================================

/**
 * @param {string} country     — e.g. 'India'
 * @param {string} region      — e.g. 'Bengal' or 'Rajasthan'
 * @param {string} destination — e.g. 'Barhanti'
 */
export function prefillDestination(country, region, destination) {
  window.dispatchEvent(new CustomEvent('prefillDestination', {
    detail: { country, region, destination },
  }));

  const contact = document.getElementById('contact');
  if (contact) {
    const top = contact.getBoundingClientRect().top + window.pageYOffset - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}
