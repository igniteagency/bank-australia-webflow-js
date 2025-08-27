if (window.SCRIPTS_ENV === 'dev') {
  window.loadLocalScript('http://localhost:3000/pages/evo-card/scroll-stagger.js');
} else {
  (() => {
  // src/pages/evo-card/scroll-stagger.ts
  var EvoCardStagger = class {
    FROM_CARDS_SELECTOR = ".evo-card-showcase_cards-start .evo-card-showcase_start-card";
    TO_SLOTS_SELECTOR = ".evo-card-showcase_cards-end .evo-card-showcase_end-card";
    SHADOW_WRAP_SELECTOR = ".evo-card_shadow-wrap";
    CARDS_TO_TRIGGER_SELECTOR = ".evo-card-showcase_cards-end";
    CARD_DURATION = 0.6;
    STAGGER = 0.15;
    SHADOW_START_AT = 0.8;
    fromCards;
    toSlots;
    constructor() {
      this.fromCards = gsap.utils.toArray(this.FROM_CARDS_SELECTOR);
      this.toSlots = gsap.utils.toArray(this.TO_SLOTS_SELECTOR);
      this.setupCardAnimation();
      this.setupScrollTriggerRefresh();
      window.IS_DEBUG_MODE && console.debug("Initial script execution finished.");
    }
    setupCardAnimation() {
      window.IS_DEBUG_MODE && console.debug("Setting up First Animation (Cards to Slots)...");
      if (this.fromCards.length > 0 && this.toSlots.length > 0 && this.fromCards.length <= this.toSlots.length) {
        if (window.IS_DEBUG_MODE) {
          console.debug("Conditions met for First Animation setup.");
        }
        const tl = gsap.timeline({ paused: true });
        const last = this.fromCards.length - 1;
        this.fromCards.forEach((card, i) => {
          const slotIndex = last - i;
          const slot = this.toSlots[slotIndex];
          if (!slot) {
            console.warn(
              `First Animation: Slot with index ${slotIndex} not found for card ${i}. Skipping.`
            );
            return;
          }
          const state = Flip.getState(card, { props: "filter,opacity,transform" });
          const shadowEl = slot.querySelector(this.SHADOW_WRAP_SELECTOR);
          const labelTime = slotIndex * this.STAGGER;
          slot.appendChild(card);
          const flipTween = Flip.from(state, {
            targets: card,
            duration: this.CARD_DURATION,
            ease: "power1.inOut",
            scale: true,
            absolute: true,
            props: "filter,opacity,transform"
          });
          tl.addLabel(`card_${i}`, labelTime);
          tl.add(flipTween, `card_${i}`);
          tl.fromTo(
            card,
            { rotateY: 0, transformOrigin: "center center" },
            { rotateY: -50, duration: this.CARD_DURATION, ease: "power1.inOut" },
            `card_${i}`
          );
          if (shadowEl) {
            gsap.set(shadowEl, { opacity: 0, filter: "blur(100px)" });
            flipTween.eventCallback("onUpdate", () => {
              const p = flipTween.progress();
              if (p >= this.SHADOW_START_AT) {
                gsap.set(slot, { zIndex: "auto" });
              } else {
                gsap.set(slot, { clearProps: "zIndex" });
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
        const cardsToTrigger = document.querySelector(this.CARDS_TO_TRIGGER_SELECTOR);
        if (cardsToTrigger) {
          window.IS_DEBUG_MODE && console.debug(
            `First Animation: Creating ScrollTrigger for '${this.CARDS_TO_TRIGGER_SELECTOR}'`
          );
          ScrollTrigger.create({
            animation: tl,
            trigger: cardsToTrigger,
            start: "top+=15% bottom",
            end: "bottom 60%",
            scrub: true,
            markers: window.IS_DEBUG_MODE,
            id: `card-section-scrolltrigger`,
            invalidateOnRefresh: true
          });
        } else {
          console.warn(
            `First Animation: '${this.CARDS_TO_TRIGGER_SELECTOR}' trigger not found for ScrollTrigger.`
          );
        }
      } else {
        console.debug(
          "Conditions NOT met for First Animation setup. fromCards.length:",
          this.fromCards.length,
          "toSlots.length:",
          this.toSlots.length
        );
      }
    }
    setupScrollTriggerRefresh() {
      window.addEventListener("load", () => {
        ScrollTrigger.refresh();
      });
      window.addEventListener("resize", () => {
        ScrollTrigger.refresh();
      });
    }
  };
  window.Webflow ||= [];
  window.Webflow.push(() => {
    new EvoCardStagger();
  });
})();
}