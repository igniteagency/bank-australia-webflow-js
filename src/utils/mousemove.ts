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
    let rect = (mousemoveContainerEl as HTMLElement).getBoundingClientRect();
    let defaultXPos =
      mousemoveContainerEl.getAttribute('data-mousemove-default-x') || DEFAULT_X_POS;
    let defaultYPos =
      mousemoveContainerEl.getAttribute('data-mousemove-default-y') || DEFAULT_Y_POS;

    mousemoveContainerEl.addEventListener('mouseenter', () => {
      recalcRect();
    });

    mousemoveContainerEl.addEventListener('mousemove', (e) => {
      const relX = e.clientX - rect.left;
      const relY = e.clientY - rect.top;

      gsap.to(mousemoveContainerEl, {
        [MOUSE_X_PROPERTY]: `${relX}px`,
        [MOUSE_Y_PROPERTY]: `${relY}px`,
        duration: 0,
      });
    });

    mousemoveContainerEl.addEventListener('mouseleave', () => {
      const tl = gsap.timeline({
        onComplete: () => {
          mousemoveContainerEl.style.removeProperty(MOUSE_X_PROPERTY);
          mousemoveContainerEl.style.removeProperty(MOUSE_Y_PROPERTY);
        },
      });
      tl.to(mousemoveContainerEl, {
        [MOUSE_X_PROPERTY]: defaultXPos,
        [MOUSE_Y_PROPERTY]: defaultYPos,
        duration: 0.3,
        ease: 'power2.out',
      });
    });

    // recalc rect dimensions on resize
    window.Webflow?.resize.on(() => {
      recalcRect();
    });

    function recalcRect() {
      rect = (mousemoveContainerEl as HTMLElement).getBoundingClientRect();
    }
  });

  window.EXECUTED_SCRIPT.push('mousemove');
});
