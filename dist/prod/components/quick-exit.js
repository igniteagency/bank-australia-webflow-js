if (window.SCRIPTS_ENV === 'dev') {
  window.loadLocalScript('http://localhost:3000/components/quick-exit.js');
} else {
  (() => {
  // src/components/quick-exit.ts
  var QuickExit = class {
    safeURL;
    shiftCount = 0;
    lastShiftTime = 0;
    SHIFT_TIMEOUT = 1e3;
    // ms
    shiftTimer = null;
    liveRegionEl;
    shiftCounterEl;
    constructor() {
      this.safeURL = "https://www.bom.gov.au";
      this.liveRegionEl = document.getElementById("quick-exit-live-region");
      this.shiftCounterEl = document.getElementById("quick-exit-shift-press-count");
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
          this.shiftCounterEl?.removeAttribute("hidden");
          this.clearShiftTimer();
          this.shiftTimer = window.setTimeout(() => {
            this.shiftCount = 0;
            this.shiftCounterEl?.setAttribute("hidden", "hidden");
            this.shiftCounterEl && (this.shiftCounterEl.textContent = "");
            this.shiftTimer = null;
          }, this.SHIFT_TIMEOUT);
          if (this.shiftCount === 1) {
            this.announce("Shift pressed once.");
          } else if (this.shiftCount === 2) {
            this.announce("Shift pressed twice.");
          } else if (this.shiftCount === 3) {
            this.announce("Exit shortcut activated.");
            this.clearShiftTimer();
            this.triggerQuickExit();
          }
          this.shiftCounterEl && (this.shiftCounterEl.textContent = `.`.repeat(this.shiftCount));
        } else {
          this.resetShiftSequence();
        }
      });
    }
    triggerQuickExit() {
      document.documentElement.style.opacity = "0";
      window.location.replace(this.safeURL);
    }
    clearShiftTimer() {
      if (this.shiftTimer) {
        clearTimeout(this.shiftTimer);
        this.shiftTimer = null;
      }
    }
    resetShiftSequence() {
      this.shiftCount = 0;
      this.shiftCounterEl?.setAttribute("hidden", "hidden");
      this.shiftCounterEl && (this.shiftCounterEl.textContent = "");
      this.clearShiftTimer();
    }
  };
  window.Webflow = window.Webflow || [];
  window.Webflow.push(() => {
    new QuickExit();
  });
})();
}