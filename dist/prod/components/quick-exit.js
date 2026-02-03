if (window.SCRIPTS_ENV === 'dev') {
  window.loadLocalScript('http://localhost:3000/components/quick-exit.js');
} else {
  (() => {
  // src/components/quick-exit.ts
  var QuickExit = class {
    safeURL;
    shiftCount = 0;
    lastShiftTime = 0;
    SHIFT_TIMEOUT = 1200;
    // ms
    liveRegionEl;
    constructor() {
      this.safeURL = "https://www.bom.gov.au";
      this.liveRegionEl = this.getLiveRegion();
      this.init();
      this.initKeyboardShortcut();
    }
    init() {
      const quickExitButton = document.querySelector('[data-el="quick-exit"]');
      if (quickExitButton) {
        quickExitButton.addEventListener("click", () => {
          this.triggerQuickExit();
        });
      }
    }
    /**
     * Creates an aria-live region in the DOM
     * It's inserted into document.body at start and kept empty until needed.
     */
    getLiveRegion() {
      const existing = document.getElementById("quick-exit-live-region");
      if (existing) return existing;
    }
    /**
     * Announce a message in the live region for screen readers
     */
    announce(message) {
      if (!this.liveRegionEl) return;
      this.liveRegionEl.textContent = "";
      setTimeout(() => {
        this.liveRegionEl.textContent = message;
      }, 50);
    }
    /**
     * Set up listener for triple Shift detection
     */
    initKeyboardShortcut() {
      document.addEventListener("keydown", (e) => {
        if (e.key === "Shift") {
          const now = Date.now();
          if (now - this.lastShiftTime > this.SHIFT_TIMEOUT) {
            this.shiftCount = 1;
          } else {
            this.shiftCount++;
          }
          this.lastShiftTime = now;
          if (this.shiftCount === 1) {
            this.announce("Shift pressed once.");
          } else if (this.shiftCount === 2) {
            this.announce("Shift pressed twice.");
          } else if (this.shiftCount === 3) {
            this.announce("Exit shortcut activated.");
            this.triggerQuickExit();
          }
        } else {
          this.shiftCount = 0;
        }
      });
    }
    triggerQuickExit() {
      document.documentElement.style.opacity = "0";
      window.location.replace(this.safeURL);
    }
  };
  window.Webflow = window.Webflow || [];
  window.Webflow.push(() => {
    new QuickExit();
  });
})();
}