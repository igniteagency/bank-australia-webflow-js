if (window.SCRIPTS_ENV === 'dev') {
  window.loadLocalScript('http://localhost:3000/components/image-card.js');
} else {
  (() => {
  // src/components/image-card.ts
  var DATA_ATTR_SELECTORS = {
    CARD: "image-card",
    LINK: "image-card-link",
    TITLE: "image-card-title"
  };
  function setImageCardAriaLabel() {
    const imageCardEls = document.querySelectorAll(`[data-el="${DATA_ATTR_SELECTORS.CARD}"]`);
    imageCardEls.forEach((imageCardEl) => {
      const linkEl = imageCardEl.querySelector(`[data-el="${DATA_ATTR_SELECTORS.LINK}"]`);
      const titleEl = imageCardEl.querySelector(`[data-el="${DATA_ATTR_SELECTORS.TITLE}"]`);
      if (linkEl && titleEl) {
        linkEl.setAttribute("aria-label", titleEl.textContent || "");
      }
    });
  }
})();
}