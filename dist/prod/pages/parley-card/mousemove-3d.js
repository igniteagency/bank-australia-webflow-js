if (window.SCRIPTS_ENV === 'dev') {
  window.loadLocalScript('http://localhost:3000/pages/parley-card/mousemove-3d.js');
} else {
  (() => {
  // src/pages/parley-card/mousemove-3d.ts
  var ParleyCardMousemove3D = class {
    SECTION_SELECTOR = ".section-parley-account-types";
    CARDS_SELECTOR = ".parley-account-types_card-content-wrapper";
    MOVER_SELECTOR = ".parley-account-types_cursor_component";
    MAX_ROT_Y = 40;
    // max ±Y tilt in degrees
    MAX_ROT_X = 20;
    // max ±X tilt in degrees
    winW;
    winH;
    maxDist;
    sectionEl;
    cards;
    mover;
    cardRectBounds = [];
    moverSetX;
    moverSetY;
    cardSetRotY = [];
    cardSetRotX = [];
    mouseMoveHandler;
    constructor() {
      this.winW = window.innerWidth;
      this.winH = window.innerHeight;
      this.maxDist = Math.hypot(this.winW, this.winH);
      this.sectionEl = document.querySelector(this.SECTION_SELECTOR);
      this.cards = Array.from(document.querySelectorAll(this.CARDS_SELECTOR));
      this.mover = document.querySelector(this.MOVER_SELECTOR);
      if (this.mover) {
        gsap.set(this.mover, {
          position: "fixed",
          xPercent: -50,
          yPercent: -50
        });
        this.moverSetX = gsap.quickSetter(this.mover, "x", "px");
        this.moverSetY = gsap.quickSetter(this.mover, "y", "px");
      }
      this.cardSetRotY = this.cards.map(
        (card) => gsap.quickSetter(card, "rotationY", "deg")
      );
      this.cardSetRotX = this.cards.map(
        (card) => gsap.quickSetter(card, "rotationX", "deg")
      );
      this.mouseMoveHandler = this._mouseMoveHandler.bind(this);
      window.addEventListener("resize", () => {
        this.winW = window.innerWidth;
        this.winH = window.innerHeight;
        this.maxDist = Math.hypot(this.winW, this.winH);
        this.updateCardRectBounds();
      });
      this.updateCardRectBounds();
      if (this.sectionEl) {
        this.sectionEl.addEventListener("mouseenter", (e) => {
          this.updateCardRectBounds();
          this.cards.forEach((card, i) => {
            const { rotY, rotX } = this.getCardRotation(i, e);
            gsap.to(card, {
              rotationX: rotX,
              rotationY: rotY,
              duration: 0.3
            });
          });
          this.sectionEl?.addEventListener("mousemove", this.mouseMoveHandler);
        });
        this.sectionEl.addEventListener("mouseleave", () => {
          gsap.to(this.CARDS_SELECTOR, {
            rotationX: 0,
            rotationY: 0,
            duration: 0.3
          });
          this.sectionEl?.removeEventListener("mousemove", this.mouseMoveHandler);
        });
      }
    }
    updateCardRectBounds() {
      this.cardRectBounds.length = 0;
      this.cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        this.cardRectBounds.push({
          cx,
          cy,
          width: rect.width,
          height: rect.height
        });
      });
    }
    _mouseMoveHandler(e) {
      const mx = e.clientX;
      const my = e.clientY;
      if (this.moverSetX && this.moverSetY) {
        this.moverSetX(mx);
        this.moverSetY(my);
      }
      this.cards.forEach((card, i) => {
        const { rotY, rotX } = this.getCardRotation(i, e);
        this.cardSetRotY[i](rotY);
        this.cardSetRotX[i](rotX);
      });
    }
    getCardRotation(cardIndex, mouseEv) {
      const rect = this.cardRectBounds[cardIndex];
      const cx = rect.cx;
      const cy = rect.cy;
      const cardWidth = rect.width;
      const cardHeight = rect.height;
      const mx = mouseEv.clientX;
      const my = mouseEv.clientY;
      const dx = mx - cx;
      const dy = my - cy;
      const pctX = gsap.utils.clamp(-1, 1, dx / (cardWidth / 2));
      const pctY = gsap.utils.clamp(-1, 1, dy / (cardHeight / 2));
      const dist = Math.hypot(dx, dy);
      const prox = gsap.utils.clamp(0, 1, dist / this.maxDist);
      const rotY = gsap.utils.clamp(-this.MAX_ROT_Y, this.MAX_ROT_Y, this.MAX_ROT_Y * pctX * prox);
      const rotX = gsap.utils.clamp(-this.MAX_ROT_X, this.MAX_ROT_X, this.MAX_ROT_X * -pctY * prox);
      return { rotY, rotX };
    }
  };
  window.Webflow ||= [];
  window.Webflow.push(() => {
    new ParleyCardMousemove3D();
  });
})();
}