
// components/autoplay-slider.js
if (window.SCRIPTS_ENV === 'dev') {
  window.loadLocalScript('http://localhost:3000/components/autoplay-slider.js');
} else {
  (() => {
  // src/components/autoplay-slider.ts
  window.Webflow = window.Webflow || [];
  window.Webflow.push(() => {
    if (window.EXECUTED_SCRIPT.includes("autoplay-slider")) {
      console.debug("Autoplay slider script already executed");
      return;
    }
    let SLIDER_GAP = 80;
    const SECTION_SELECTOR = '[data-blog-slider-el="section"]';
    const NAV_PREV_BUTTON_SELECTOR = '[data-blog-slider-el="nav-prev"]';
    const NAV_NEXT_BUTTON_SELECTOR = '[data-blog-slider-el="nav-next"]';
    const AUTOPLAY_BUTTON_SELECTOR = '[data-blog-slider-el="autoplay"]';
    const PAGINATION_SELECTOR = '[data-blog-slider-el="pagination"]';
    const SLIDER_GAP_OVERRIDE_ATTR = "data-blog-slider-gap";
    document.querySelectorAll(SECTION_SELECTOR).forEach((sliderSectionEl) => {
      const swiperEl = sliderSectionEl.querySelector(".swiper");
      const navPrevButtonEl = sliderSectionEl.querySelector(NAV_PREV_BUTTON_SELECTOR);
      const navNextButtonEl = sliderSectionEl.querySelector(NAV_NEXT_BUTTON_SELECTOR);
      const autoplayButtonEl = sliderSectionEl.querySelector(AUTOPLAY_BUTTON_SELECTOR);
      const paginationEl = sliderSectionEl.querySelector(PAGINATION_SELECTOR);
      const sliderGapOverrideEl = sliderSectionEl.querySelector(`[${SLIDER_GAP_OVERRIDE_ATTR}]`);
      if (sliderGapOverrideEl) {
        SLIDER_GAP = parseInt(sliderGapOverrideEl.getAttribute(SLIDER_GAP_OVERRIDE_ATTR) || "80");
      }
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
      const navigationConfig = navPrevButtonEl && navNextButtonEl ? {
        nextEl: navNextButtonEl,
        prevEl: navPrevButtonEl,
        disabledClass: "is-disabled"
      } : false;
      const paginationConfig = paginationEl ? {
        el: paginationEl,
        clickable: true,
        bulletElement: "button",
        bulletClass: "autoplay-slider_nav-item",
        bulletActiveClass: "is-active",
        renderBullet: (index, className) => {
          return `<button class="${className}" type="button">
          <span class="visually-hidden">Go to slide ${index + 1}</span>
        </button>`;
        }
      } : false;
      try {
        const swiper = new Swiper(swiperEl, {
          loop: true,
          slidesPerView: 1,
          slidesPerGroup: 1,
          spaceBetween: SLIDER_GAP,
          centeredSlides: true,
          navigation: navigationConfig,
          pagination: paginationConfig,
          slideActiveClass: "is-active",
          slidePrevClass: "is-previous",
          slideNextClass: "is-next",
          autoplay: {
            delay: 5e3,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
          },
          observer: true,
          observeParents: true,
          a11y: {
            enabled: true
          },
          breakpoints: {
            480: {
              spaceBetween: SLIDER_GAP / 2
            },
            768: {
              spaceBetween: SLIDER_GAP / 1.5
            }
          }
        });
        console.debug("Swiper initialized", swiper);
        if (autoplayButtonEl) {
          let isPlaying = true;
          updateAutoplayButtonState(autoplayButtonEl, isPlaying);
          autoplayButtonEl.addEventListener("click", () => {
            if (isPlaying) {
              swiper.autoplay.stop();
            } else {
              swiper.autoplay.start();
            }
          });
          swiper.on("autoplayStart", () => {
            isPlaying = true;
            updateAutoplayButtonState(autoplayButtonEl, isPlaying);
          });
          swiper.on("autoplayStop", () => {
            isPlaying = false;
            updateAutoplayButtonState(autoplayButtonEl, isPlaying);
          });
        }
      } catch (error) {
        console.error("Error initializing Swiper", error);
      }
    });
    function updateAutoplayButtonState(button, isPlaying) {
      button.setAttribute("aria-pressed", (!isPlaying).toString());
      button.setAttribute("aria-label", `${isPlaying ? "Pause" : "Play"} slider autoplay`);
      button.classList.toggle("is-paused", !isPlaying);
    }
    window.EXECUTED_SCRIPT.push("autoplay-slider");
  });
})();
}
