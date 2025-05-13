if (window.SCRIPTS_ENV === 'dev') {
  window.loadLocalScript('http://localhost:3000/global.js');
} else {
  (() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  // src/utils/alpine-webflow.ts
  var AlpineJSWebflow = class {
    constructor() {
      this.init();
      window.loadExternalScript(
        "https://cdn.jsdelivr.net/npm/alpinejs@3.14.9/dist/cdn.min.js",
        "head",
        true
      ).then(() => {
        console.debug("AlpineJS init");
      });
    }
    init() {
      document.querySelectorAll("[x-data],[x-data] *").forEach((el) => {
        this.replaceDotAttributes(el);
        this.removeUnnecessaryAttributeValues(el);
      });
      document.querySelectorAll("[x-data] [x-for]:not(template), [x-data] [x-if]:not(template)").forEach((el) => this.wrapInTemplate(el));
    }
    getAlpineAttributes(el) {
      const alpineAttributes = [];
      for (let i = 0; i < el.attributes.length; ++i) {
        const a = el.attributes[i];
        if (a.name.startsWith("x-")) {
          alpineAttributes.push(a);
        }
      }
      return alpineAttributes;
    }
    wrapInTemplate(el) {
      var _a;
      const template = document.createElement("template");
      const attributes = this.getAlpineAttributes(el);
      attributes.forEach((a) => {
        template.setAttribute(a.name, a.value);
        el.removeAttribute(a.name);
      });
      (_a = el.parentNode) == null ? void 0 : _a.insertBefore(template, el);
      template.content.appendChild(el);
    }
    replaceDotAttributes(el) {
      const attributes = this.getAlpineAttributes(el);
      attributes.forEach((a) => {
        const m = a.name.match(/^(x-[^:]+)(:.+)$/);
        if (m) {
          let newA = null;
          if (["x-bind", "x-on"].includes(m[1])) {
            let prefix = m[1];
            let suffix = m[2].substring(1);
            if (prefix === "x-on" && suffix.startsWith("update:")) {
              prefix += ":update";
              suffix = suffix.substring(7);
            }
            if (suffix.includes(":")) {
              newA = prefix + ":" + suffix.replace(/:/g, ".");
            }
          } else {
            newA = m[1] + m[2].replace(/:/g, ".");
          }
          if (newA) {
            el.setAttribute(newA, a.value);
            el.removeAttribute(a.name);
          }
        }
      });
    }
    removeUnnecessaryAttributeValues(el) {
      const attributes = this.getAlpineAttributes(el);
      attributes.forEach((a) => {
        if (a.name.match(/^x-transition.*(?!(enter|leave))/)) {
          el.setAttribute(a.name, "");
        }
      });
    }
  };
  new AlpineJSWebflow();

  // src/utils/bugherd-script.ts
  function initBugHerd() {
    const currentHostname = window.location.hostname;
    if (currentHostname.includes("webflow.io")) {
      window.loadExternalScript(
        "https://www.bugherd.com/sidebarv2.js?apikey=alf2xg3pewxzwvuoe7c00g",
        "body",
        false
      ).then(() => {
        console.log("BugHerd script loaded successfully");
      }).catch((error) => {
        console.error("Failed to load BugHerd script:", error);
      });
    }
  }

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

  // src/components/image-card.ts
  var DATA_ATTR_SELECTORS = {
    CARD: "image-card",
    LINK: "image-card-link",
    TITLE: "image-card-title"
  };
  function setImageCardAriaLabel() {
    const imageCardEls = document.querySelectorAll(`[data-el="${DATA_ATTR_SELECTORS.CARD}"]`);
    imageCardEls.forEach((imageCardEl) => {
      const linkEl = imageCardEl.querySelector(`[data-el="${DATA_ATTR_SELECTORS.LINK}"]`);
      const titleEl = imageCardEl.querySelector(`[data-el="${DATA_ATTR_SELECTORS.TITLE}"]`);
      if (linkEl && titleEl) {
        linkEl.setAttribute("aria-label", titleEl.textContent || "");
      }
    });
  }

  // src/global.ts
  document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);
    new LazyLoadVideoEmbeds().init();
  });
  window.Webflow = window.Webflow || [];
  window.Webflow.push(() => {
    disableWebflowScroll();
    setImageCardAriaLabel();
    initBugHerd();
  });
  function disableWebflowScroll() {
    jQuery(document).off("click.wf-scroll");
  }
})();
}