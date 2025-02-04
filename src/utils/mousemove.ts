const MOUSE_X_PROPERTY = '--_mouse-x';
const MOUSE_Y_PROPERTY = '--_mouse-y';
const DEFAULT_X_POS = '0px';
const DEFAULT_Y_POS = '0px';

window.Webflow = window.Webflow || [];
window.Webflow.push(() => {
  if (window.EXECUTED_SCRIPT.includes('mousemove')) {
    console.debug('Mousemove script already executed');
    return;
  }

  const MOUSEMOVE_CONTAINER_SELECTOR = '[data-mousemove-el="container"]';
  const mousemoveContainerList = document.querySelectorAll(MOUSEMOVE_CONTAINER_SELECTOR);

  mousemoveContainerList.forEach((mousemoveContainerEl) => {
    const el = mousemoveContainerEl as HTMLElement;
    let defaultXPos = el.getAttribute('data-mousemove-default-x') || DEFAULT_X_POS;
    let defaultYPos = el.getAttribute('data-mousemove-default-y') || DEFAULT_Y_POS;

    // Calculate initial position once
    const rect = el.getBoundingClientRect();
    let initialLeft = rect.left + window.scrollX;
    let initialTop = rect.top + window.scrollY;

    let isMouseOver = false;
    let rafId: number | null = null;

    const updatePosition = (e: MouseEvent) => {
      if (!isMouseOver) return;

      // Cancel any pending frame
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }

      // Schedule update on next frame
      rafId = requestAnimationFrame(() => {
        // Calculate position relative to initial element position, accounting for scroll
        const relX = e.pageX - initialLeft;
        const relY = e.pageY - initialTop;

        gsap.to(el, {
          [MOUSE_X_PROPERTY]: `${relX}px`,
          [MOUSE_Y_PROPERTY]: `${relY}px`,
          duration: 0,
        });

        rafId = null;
      });
    };

    el.addEventListener('mouseenter', () => {
      isMouseOver = true;
    });

    el.addEventListener('mousemove', updatePosition);

    el.addEventListener('mouseleave', () => {
      isMouseOver = false;
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }

      const tl = gsap.timeline({
        onComplete: () => {
          el.style.removeProperty(MOUSE_X_PROPERTY);
          el.style.removeProperty(MOUSE_Y_PROPERTY);
        },
      });

      tl.to(el, {
        [MOUSE_X_PROPERTY]: defaultXPos,
        [MOUSE_Y_PROPERTY]: defaultYPos,
        duration: 0.3,
        ease: 'power2.out',
      });
    });

    // Clean up on resize since element position may have changed significantly
    const resizeObserver = new ResizeObserver(() => {
      const newRect = el.getBoundingClientRect();
      initialLeft = newRect.left + window.scrollX;
      initialTop = newRect.top + window.scrollY;
    });
    resizeObserver.observe(el);
  });

  window.EXECUTED_SCRIPT.push('mousemove');
});
