if (window.SCRIPTS_ENV === 'dev') {
  window.loadLocalScript('http://localhost:3000/components/icon-image.js');
} else {
  (() => {
  // src/components/icon-image.ts
  var IconImage = class {
    selector = "[data-icon-image]";
    constructor() {
      this.applyMask();
    }
    applyMask() {
      const els = Array.from(document.querySelectorAll(this.selector));
      els.forEach((el) => {
        const image = el.querySelector("img");
        if (!image) {
          console.warn("[Icon Image Mask] No image found within element:", el);
          return;
        }
        const src = image.getAttribute("src");
        const alt = image.getAttribute("alt") || "Icon";
        const url = `url("${src}")`;
        el.style.backgroundColor = "currentColor";
        el.style.maskImage = url;
        el.style.maskRepeat = "no-repeat";
        el.style.maskSize = "contain";
        el.setAttribute("aria-label", alt);
        image.style.visibility = "hidden";
      });
    }
  };
})();
}