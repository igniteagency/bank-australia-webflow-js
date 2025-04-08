if (window.SCRIPTS_ENV === 'dev') {
  window.loadLocalScript('http://localhost:3000/global.js');
} else {
  (() => {
  // src/utils/bugherd-script.ts
  function initBugHerd() {
    const currentHostname = window.location.hostname;
    if (currentHostname.includes("webflow.io")) {
      window.loadExternalScript(
        "https://www.bugherd.com/sidebarv2.js?apikey=alf2xg3pewxzwvuoe7c00g",
        "body",
        false
      ).then(() => {
        console.log("BugHerd script loaded successfully");
      }).catch((error) => {
        console.error("Failed to load BugHerd script:", error);
      });
    }
  }

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

  // src/global.ts
  var _a;
  (_a = window.Webflow) == null ? void 0 : _a.push(() => {
    setImageCardAriaLabel();
    initBugHerd();
  });
})();
}