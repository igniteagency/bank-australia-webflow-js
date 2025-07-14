class ParleyCardMousemove3D {
  private readonly SECTION_SELECTOR = '.section-parley-account-types';
  private readonly CARDS_SELECTOR = '.parley-account-types_card-content-wrapper';
  private readonly MOVER_SELECTOR = '.parley-account-types_cursor_component';
  private readonly MAX_ROT_Y = 40; // max ±Y tilt in degrees
  private readonly MAX_ROT_X = 20; // max ±X tilt in degrees

  private winW: number;
  private winH: number;
  private maxDist: number;
  private sectionEl: HTMLElement | null;
  private cards: HTMLElement[];
  private mover: HTMLElement | null;
  private cardRectBounds: Array<{ cx: number; cy: number; width: number; height: number }> = [];
  private moverSetX?: (v: number) => void;
  private moverSetY?: (v: number) => void;
  private cardSetRotY: Array<(v: number) => void> = [];
  private cardSetRotX: Array<(v: number) => void> = [];
  private mouseMoveHandler: (e: MouseEvent) => void;

  constructor() {
    this.winW = window.innerWidth;
    this.winH = window.innerHeight;
    this.maxDist = Math.hypot(this.winW, this.winH);
    this.sectionEl = document.querySelector(this.SECTION_SELECTOR) as HTMLElement | null;
    this.cards = Array.from(document.querySelectorAll(this.CARDS_SELECTOR)) as HTMLElement[];
    this.mover = document.querySelector(this.MOVER_SELECTOR) as HTMLElement | null;

    // GSAP quickSetters for mover
    if (this.mover) {
      gsap.set(this.mover, {
        position: 'fixed',
        xPercent: -50,
        yPercent: -50,
      });
      this.moverSetX = gsap.quickSetter(this.mover, 'x', 'px') as (v: number) => void;
      this.moverSetY = gsap.quickSetter(this.mover, 'y', 'px') as (v: number) => void;
    }

    // GSAP quickSetters for cards
    this.cardSetRotY = this.cards.map(
      (card) => gsap.quickSetter(card, 'rotationY', 'deg') as (v: number) => void
    );
    this.cardSetRotX = this.cards.map(
      (card) => gsap.quickSetter(card, 'rotationX', 'deg') as (v: number) => void
    );

    // Bind handler so we can add/remove it
    this.mouseMoveHandler = this._mouseMoveHandler.bind(this);

    // Update maxDist on resize
    window.addEventListener('resize', () => {
      this.winW = window.innerWidth;
      this.winH = window.innerHeight;
      this.maxDist = Math.hypot(this.winW, this.winH);
      this.updateCardRectBounds();
    });

    // Initial calculation
    this.updateCardRectBounds();

    // Event listeners
    if (this.sectionEl) {
      this.sectionEl.addEventListener('mouseenter', (e) => {
        this.updateCardRectBounds();
        this.cards.forEach((card, i) => {
          const { rotY, rotX } = this.getCardRotation(i, e as MouseEvent);
          gsap.to(card, {
            rotationX: rotX,
            rotationY: rotY,
            duration: 0.3,
          });
        });
        this.sectionEl?.addEventListener('mousemove', this.mouseMoveHandler);
      });

      this.sectionEl.addEventListener('mouseleave', () => {
        gsap.to(this.CARDS_SELECTOR, {
          rotationX: 0,
          rotationY: 0,
          duration: 0.3,
        });
        this.sectionEl?.removeEventListener('mousemove', this.mouseMoveHandler);
      });
    }
  }

  private updateCardRectBounds() {
    this.cardRectBounds.length = 0;
    this.cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      this.cardRectBounds.push({
        cx,
        cy,
        width: rect.width,
        height: rect.height,
      });
    });
  }

  private _mouseMoveHandler(e: MouseEvent) {
    const mx = e.clientX;
    const my = e.clientY;
    // Move the fixed cursor component
    if (this.moverSetX && this.moverSetY) {
      this.moverSetX(mx);
      this.moverSetY(my);
    }
    // "look-at" rotation for each card
    this.cards.forEach((card, i) => {
      const { rotY, rotX } = this.getCardRotation(i, e);
      this.cardSetRotY[i](rotY);
      this.cardSetRotX[i](rotX);
    });
  }

  private getCardRotation(cardIndex: number, mouseEv: MouseEvent) {
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
}

window.Webflow ||= [];
window.Webflow.push(() => {
  new ParleyCardMousemove3D();
});
