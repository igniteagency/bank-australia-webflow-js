class EcoCardStagger {
  private readonly FROM_CARDS_SELECTOR =
    '.eco-card-showcase_cards-start .eco-card-showcase_start-card';
  private readonly START_CARDS_WRAPPER_SELECTOR = '.eco-card-showcase_start-card-wrapper';
  private readonly TO_SLOTS_SELECTOR = '.eco-card-showcase_cards-end .eco-card-showcase_end-card';
  private readonly SHADOW_WRAP_SELECTOR = '.eco-card_shadow-wrap';
  private readonly CARDS_TO_TRIGGER_SELECTOR = '.eco-card-showcase_cards-end';
  private readonly CARD_DURATION = 0.6;
  private readonly STAGGER = 0.15;
  private readonly SHADOW_START_AT = 0.8;

  private fromCards: HTMLElement[];
  private toSlots: HTMLElement[];

  private flipCtx: gsap.Context | null = null;
  private lastWindowWidth = window.innerWidth;

  constructor() {
    this.fromCards = gsap.utils.toArray(this.FROM_CARDS_SELECTOR);
    this.toSlots = gsap.utils.toArray(this.TO_SLOTS_SELECTOR);
    this.setupCardAnimation();
    this.setupScrollTriggerRefresh();

    window.IS_DEBUG_MODE && console.debug('Initial script execution finished.');
  }

  private setupCardAnimation() {
    window.IS_DEBUG_MODE && console.debug('Setting up eco card stagger animation');

    this.flipCtx && this.flipCtx.revert();

    // Reset DOM positions before re-initializing
    const originalContainerList = document.querySelectorAll(this.START_CARDS_WRAPPER_SELECTOR);
    if (originalContainerList.length > 0) {
      this.fromCards.forEach((card, i) => {
        gsap.set(card, { clearProps: 'all' });
        originalContainerList[i].appendChild(card);
      });
    }

    const cardsToTrigger = document.querySelector(this.CARDS_TO_TRIGGER_SELECTOR);

    if (
      this.fromCards.length <= 0 ||
      this.toSlots.length <= 0 ||
      this.fromCards.length > this.toSlots.length ||
      !cardsToTrigger
    ) {
      console.debug(
        'Conditions NOT met for First Animation setup. fromCards.length:',
        this.fromCards.length,
        'toSlots.length:',
        this.toSlots.length
      );
      return;
    }

    this.flipCtx = gsap.context(() => {
      gsap.matchMedia().add('(min-width: 480px)', () => {
        const tl = gsap.timeline({ paused: true });
        const last = this.fromCards.length - 1;

        this.fromCards.forEach((card, i) => {
          gsap.set(card, { rotateY: 0, clearProps: 'all' });

          const slotIndex = last - i;
          const slot = this.toSlots[slotIndex];
          if (!slot) {
            console.warn(
              `First Animation: Slot with index ${slotIndex} not found for card ${i}. Skipping.`
            );
            return;
          }
          const state = Flip.getState(card, { props: 'filter,opacity,transform' });
          const shadowEl = slot.querySelector(this.SHADOW_WRAP_SELECTOR);
          const labelTime = slotIndex * this.STAGGER;

          slot.appendChild(card);

          const flipTween = Flip.from(state, {
            targets: card,
            duration: this.CARD_DURATION,
            ease: 'power1.inOut',
            scale: true,
            absolute: true,
            props: 'filter,opacity,transform',
          });

          tl.addLabel(`card_${i}`, labelTime);

          tl.add(flipTween, `card_${i}`);

          tl.fromTo(
            card,
            { rotateY: 0 },
            { rotateY: -50, duration: this.CARD_DURATION, ease: 'power1.inOut' },
            `card_${i}`
          );

          if (shadowEl) {
            gsap.set(shadowEl, { opacity: 0, filter: 'blur(100px)' });
            flipTween.eventCallback('onUpdate', () => {
              const p = flipTween.progress();
              // MODIFIED Z-INDEX LOGIC:
              // Sets zIndex to 'auto' when scrolling down past SHADOW_START_AT
              // Clears inline zIndex (reverting to CSS) when scrolling up past SHADOW_START_AT
              if (p >= this.SHADOW_START_AT) {
                gsap.set(slot, { zIndex: 'auto' });
              } else {
                gsap.set(slot, { clearProps: 'zIndex' }); // Reverts to CSS defined z-index
              }
              const alpha = gsap.utils.clamp(
                0,
                1,
                (p - this.SHADOW_START_AT) / (1 - this.SHADOW_START_AT)
              );
              const blurValue = 100 * (1 - alpha);
              gsap.set(shadowEl, { opacity: alpha, filter: `blur(${blurValue}px)` });
            });
          }
        });

        ScrollTrigger.create({
          animation: tl,
          trigger: cardsToTrigger,
          start: 'top+=15% bottom',
          end: 'bottom 60%',
          scrub: 1, // Add smoothing
          markers: window.IS_DEBUG_MODE,
          id: `card-section-scrolltrigger`,
        });
      });
    });
  }

  private setupScrollTriggerRefresh() {
    window.addEventListener('load', () => {
      this.setupCardAnimation();
    });

    let resizeTimeout: number;
    window.addEventListener('resize', () => {
      const currentWidth = window.innerWidth;
      if (currentWidth !== this.lastWindowWidth) {
        this.lastWindowWidth = currentWidth;
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => this.setupCardAnimation(), 200);
      }
    });
  }
}

window.Webflow ||= [];
window.Webflow.push(() => {
  new EcoCardStagger();
});
