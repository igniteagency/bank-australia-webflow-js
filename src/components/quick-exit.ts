class QuickExit {
  safeURL: string;
  private shiftCount = 0;
  private lastShiftTime = 0;
  private readonly SHIFT_TIMEOUT = 1000; // ms
  private shiftTimer: number | null = null;
  private liveRegionEl: HTMLElement | null;
  private shiftCounterEl: HTMLElement | null;

  constructor() {
    this.safeURL = 'https://www.bom.gov.au';
    this.liveRegionEl = document.getElementById('quick-exit-live-region');
    this.shiftCounterEl = document.getElementById('quick-exit-shift-press-count');
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

        // show counter
        this.shiftCounterEl?.removeAttribute('hidden');

        this.clearShiftTimer();

        this.shiftTimer = window.setTimeout(() => {
          this.shiftCount = 0;
          this.shiftCounterEl?.setAttribute('hidden', 'hidden');
          this.shiftCounterEl && (this.shiftCounterEl.textContent = '');
          this.shiftTimer = null;
        }, this.SHIFT_TIMEOUT);

        // Announce progress
        if (this.shiftCount === 1) {
          this.announce('Shift pressed once.');
        } else if (this.shiftCount === 2) {
          this.announce('Shift pressed twice.');
        } else if (this.shiftCount === 3) {
          this.announce('Exit shortcut activated.');
          // clear timer since sequence completed
          this.clearShiftTimer();
          this.triggerQuickExit();
        }
        this.shiftCounterEl && (this.shiftCounterEl.textContent = `.`.repeat(this.shiftCount));
      } else {
        // reset if other key pressed
        this.resetShiftSequence();
      }
    });
  }

  private triggerQuickExit() {
    // Fade current content instantly
    document.documentElement.style.opacity = '0';

    // Navigate replacing the current session history entry
    window.location.replace(this.safeURL);
  }

  private clearShiftTimer() {
    // ensure any existing timer is cleared, then start a new one to expire the sequence
    if (this.shiftTimer) {
      clearTimeout(this.shiftTimer);
      this.shiftTimer = null;
    }
  }

  private resetShiftSequence() {
    this.shiftCount = 0;
    this.shiftCounterEl?.setAttribute('hidden', 'hidden');
    this.shiftCounterEl && (this.shiftCounterEl.textContent = '');
    this.clearShiftTimer();
  }
}

window.Webflow = window.Webflow || [];
window.Webflow.push(() => {
  new QuickExit();
});
