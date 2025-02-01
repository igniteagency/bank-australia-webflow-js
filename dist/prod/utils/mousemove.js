// utils/mousemove.js
if (window.SCRIPTS_ENV === 'dev') {
  window.loadLocalScript('http://localhost:3000/utils/mousemove.js');
} else {
  (() => {
  // src/utils/mousemove.ts
  var MOUSE_X_PROPERTY = "--_mouse-x";
  var MOUSE_Y_PROPERTY = "--_mouse-y";
  var DEFAULT_X_POS = "0px";
  var DEFAULT_Y_POS = "0px";
  window.Webflow = window.Webflow || [];
  window.Webflow.push(() => {
    if (window.EXECUTED_SCRIPT.includes("mousemove")) {
      console.debug("Mousemove script already executed");
      return;
    }
    const MOUSEMOVE_CONTAINER_SELECTOR = '[data-mousemove-el="container"]';
    const mousemoveContainerList = document.querySelectorAll(MOUSEMOVE_CONTAINER_SELECTOR);
    mousemoveContainerList.forEach((mousemoveContainerEl) => {
      var _a;
      let rect = mousemoveContainerEl.getBoundingClientRect();
      let defaultXPos = mousemoveContainerEl.getAttribute("data-mousemove-default-x") || DEFAULT_X_POS;
      let defaultYPos = mousemoveContainerEl.getAttribute("data-mousemove-default-y") || DEFAULT_Y_POS;
      mousemoveContainerEl.addEventListener("mouseenter", () => {
        recalcRect();
      });
      mousemoveContainerEl.addEventListener("mousemove", (e) => {
        const relX = e.clientX - rect.left;
        const relY = e.clientY - rect.top;
        gsap.to(mousemoveContainerEl, {
          [MOUSE_X_PROPERTY]: `${relX}px`,
          [MOUSE_Y_PROPERTY]: `${relY}px`,
          duration: 0
        });
      });
      mousemoveContainerEl.addEventListener("mouseleave", () => {
        const tl = gsap.timeline({
          onComplete: () => {
            mousemoveContainerEl.style.removeProperty(MOUSE_X_PROPERTY);
            mousemoveContainerEl.style.removeProperty(MOUSE_Y_PROPERTY);
          }
        });
        tl.to(mousemoveContainerEl, {
          [MOUSE_X_PROPERTY]: defaultXPos,
          [MOUSE_Y_PROPERTY]: defaultYPos,
          duration: 0.3,
          ease: "power2.out"
        });
      });
      (_a = window.Webflow) == null ? void 0 : _a.resize.on(() => {
        recalcRect();
      });
      function recalcRect() {
        rect = mousemoveContainerEl.getBoundingClientRect();
      }
    });
    window.EXECUTED_SCRIPT.push("mousemove");
  });
})();
}