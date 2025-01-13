
// components/autoplay-slider.js
if (window.SCRIPTS_ENV === 'dev') {
  window.loadLocalScript('http://localhost:3000/components/autoplay-slider.js');
} else {
  (() => {
  // src/components/autoplay-slider.ts
  var _a;
  (_a = window.Webflow) == null ? void 0 : _a.push(() => {
    if (!window.EXECUTED_SCRIPT.includes("autoplay-slider")) {
      return;
    }
    const SECTION_SELECTOR = '[data-blog-slider-el="section"]';
    const NAV_PREV_BUTTON_SELECTOR = '[data-blog-slider-el="nav-prev"]';
    const NAV_NEXT_BUTTON_SELECTOR = '[data-blog-slider-el="nav-next"]';
    const AUTOPLAY_BUTTON_SELECTOR = '[data-blog-slider-el="autoplay"]';
    const PAGINATION_SELECTOR = '[data-blog-slider-el="pagination"]';
    document.querySelectorAll(SECTION_SELECTOR).forEach((sliderSectionEl) => {
      const swiperEl = sliderSectionEl.querySelector(".swiper");
      const navPrevButtonEl = sliderSectionEl.querySelector(NAV_PREV_BUTTON_SELECTOR);
      const navNextButtonEl = sliderSectionEl.querySelector(NAV_NEXT_BUTTON_SELECTOR);
      const autoplayButtonEl = sliderSectionEl.querySelector(AUTOPLAY_BUTTON_SELECTOR);
      const paginationEl = sliderSectionEl.querySelector(PAGINATION_SELECTOR);
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
        bulletClass: "reviews-slider_nav-item",
        bulletActiveClass: "is-active",
        renderBullet: (index, className) => {
          return `<button class="${className}" type="button">
          <span class="visually-hidden">Go to slide ${index + 1}</span>
        </button>`;
        }
      } : false;
      const swiper = new Swiper(swiperEl, {
        modules: [Navigation, Autoplay, A11y, Pagination],
        loop: false,
        slidesPerView: 1,
        slidesPerGroup: 1,
        spaceBetween: 40,
        navigation: navigationConfig,
        pagination: paginationConfig,
        autoplay: {
          delay: 5e3,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        },
        a11y: {
          enabled: true
        },
        breakpoints: {
          481: {
            slidesPerView: 2
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 20
          }
        }
      });
      if (autoplayButtonEl) {
        let isPlaying = true;
        updateAutoplayButtonState(autoplayButtonEl, isPlaying);
        autoplayButtonEl.addEventListener("click", () => {
          isPlaying = !isPlaying;
          if (isPlaying) {
            swiper.autoplay.start();
          } else {
            swiper.autoplay.pause();
          }
          updateAutoplayButtonState(autoplayButtonEl, isPlaying);
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
