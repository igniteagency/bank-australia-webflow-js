class QuickExit {
  safeURL: string;
  private shiftCount = 0;
  private lastShiftTime = 0;
  private readonly SHIFT_TIMEOUT = 1200; // ms
  private liveRegionEl?: HTMLElement;

  constructor() {
    this.safeURL = 'https://www.bom.gov.au';
    this.liveRegionEl = this.getLiveRegion();
    this.init();
    this.initKeyboardShortcut();
  }

  init() {
    const quickExitButton = document.querySelector('[data-el="quick-exit"]');
    if (quickExitButton) {
      quickExitButton.addEventListener('click', () => {
        this.triggerQuickExit();
      });
    }
  }

  /**
   * Creates an aria-live region in the DOM
   * It's inserted into document.body at start and kept empty until needed.
   */
  private getLiveRegion() {
    const existing = document.getElementById('quick-exit-live-region');
    if (existing) return existing;
  }

  /**
   * Announce a message in the live region for screen readers
   */
  private announce(message: string) {
    if (!this.liveRegionEl) return;

    // clear first to ensure repeated announcements work
    this.liveRegionEl.textContent = '';
    setTimeout(() => {
      this.liveRegionEl.textContent = message;
    }, 50);
  }

  /**
   * Set up listener for triple Shift detection
   */
  private initKeyboardShortcut() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Shift') {
        const now = Date.now();
        if (now - this.lastShiftTime > this.SHIFT_TIMEOUT) {
          this.shiftCount = 1;
        } else {
          this.shiftCount++;
        }
        this.lastShiftTime = now;

        // Announce progress
        if (this.shiftCount === 1) {
          this.announce('Shift pressed once.');
        } else if (this.shiftCount === 2) {
          this.announce('Shift pressed twice.');
        } else if (this.shiftCount === 3) {
          this.announce('Exit shortcut activated.');
          this.triggerQuickExit();
        }
      } else {
        // reset if other key pressed
        this.shiftCount = 0;
      }
    });
  }

  private triggerQuickExit() {
    // Fade current content instantly
    document.documentElement.style.opacity = '0';

    // Navigate replacing the current session history entry
    window.location.replace(this.safeURL);
  }
}

window.Webflow = window.Webflow || [];
window.Webflow.push(() => {
  new QuickExit();
});
