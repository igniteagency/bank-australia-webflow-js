const DATA_ATTR_SELECTORS = {
  CARD: 'image-card',
  LINK: 'image-card-link',
  TITLE: 'image-card-title',
};

export function setImageCardAriaLabel() {
  const imageCardEls = document.querySelectorAll(`[data-el="${DATA_ATTR_SELECTORS.CARD}"]`);
  imageCardEls.forEach((imageCardEl) => {
    const linkEl = imageCardEl.querySelector(`[data-el="${DATA_ATTR_SELECTORS.LINK}"]`);
    const titleEl = imageCardEl.querySelector(`[data-el="${DATA_ATTR_SELECTORS.TITLE}"]`);
    if (linkEl && titleEl) {
      linkEl.setAttribute('aria-label', titleEl.textContent || '');
    }
  });
}
