if (window.SCRIPTS_ENV === 'dev') {
  window.loadLocalScript('http://localhost:3000/pages/blog/blog-article.js');
} else {
  (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // src/pages/blog/blog-article.ts
  var import_swiper = __toESM(__require("swiper"), 1);
  var import_modules = __require("swiper/modules");
  var _a;
  (_a = window.Webflow) == null ? void 0 : _a.push(() => {
    initGallerySlider();
  });
  function initGallerySlider() {
    const SECTION_SELECTOR = '[data-gallery-layout="Image Slider"]';
    const NAV_PREV_BUTTON_SELECTOR = '[data-gallery-slider-el="nav-prev"]';
    const NAV_NEXT_BUTTON_SELECTOR = '[data-gallery-slider-el="nav-next"]';
    document.querySelectorAll(SECTION_SELECTOR).forEach((sliderSectionEl) => {
      const swiperEl = sliderSectionEl.querySelector(".swiper");
      const navPrevButtonEl = sliderSectionEl.querySelector(NAV_PREV_BUTTON_SELECTOR);
      const navNextButtonEl = sliderSectionEl.querySelector(NAV_NEXT_BUTTON_SELECTOR);
      if (!swiperEl) {
        console.debug("No swiper element found in the slider section", sliderSectionEl);
        return;
      }
      const slidesCount = swiperEl.querySelectorAll(".swiper-slide").length;
      if (!slidesCount) {
        console.debug("No slides found in the slider. Deleting the section", swiperEl);
        sliderSectionEl.remove();
        return;
      }
      new import_swiper.default(swiperEl, {
        modules: [import_modules.Navigation],
        loop: false,
        spaceBetween: 20,
        slidesPerView: "auto",
        navigation: {
          nextEl: navNextButtonEl,
          prevEl: navPrevButtonEl,
          disabledClass: "is-disabled"
        }
      });
    });
  }
})();
}