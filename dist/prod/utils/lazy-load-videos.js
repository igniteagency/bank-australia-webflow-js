if (window.SCRIPTS_ENV === 'dev') {
  window.loadLocalScript('http://localhost:3000/utils/lazy-load-videos.js');
} else {
  (() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  // src/utils/lazy-load-videos.ts
  var LazyLoadVideoEmbeds = class {
    constructor() {
      __publicField(this, "observer");
      this.observer = new IntersectionObserver(this.handleIntersection.bind(this), {
        rootMargin: "0px 0px 200px 0px",
        // Load iframe 200px before it's fully in view
        threshold: 0
        // Trigger when any part of the iframe enters the viewport
      });
    }
    init() {
      const iframesToLoad = document.querySelectorAll("iframe.embedly-embed");
      iframesToLoad.forEach((iframe) => {
        const originalSrc = iframe.getAttribute("src");
        if (originalSrc) {
          iframe.removeAttribute("src");
          iframe.setAttribute("data-src", originalSrc);
        }
        this.observer.observe(iframe);
      });
    }
    loadIframe(iframe) {
      const src = iframe.dataset.src;
      if (src) {
        iframe.src = src;
        iframe.removeAttribute("data-src");
        this.observer.unobserve(iframe);
      }
    }
    handleIntersection(entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.target instanceof HTMLIFrameElement) {
          this.loadIframe(entry.target);
        }
      });
    }
  };
})();
}