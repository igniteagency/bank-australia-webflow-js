import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';

window.Webflow?.push(() => {
  initGallerySlider();
});

function initGallerySlider() {
  const SECTION_SELECTOR = '[data-gallery-layout="Image Slider"]';
  const NAV_PREV_BUTTON_SELECTOR = '[data-gallery-slider-el="nav-prev"]';
  const NAV_NEXT_BUTTON_SELECTOR = '[data-gallery-slider-el="nav-next"]';

  document.querySelectorAll(SECTION_SELECTOR).forEach((sliderSectionEl) => {
    const swiperEl = sliderSectionEl.querySelector('.swiper');
    const navPrevButtonEl = sliderSectionEl.querySelector(NAV_PREV_BUTTON_SELECTOR);
    const navNextButtonEl = sliderSectionEl.querySelector(NAV_NEXT_BUTTON_SELECTOR);

    if (!swiperEl) {
      console.debug('No swiper element found in the slider section', sliderSectionEl);
      return;
    }

    const slidesCount = swiperEl.querySelectorAll('.swiper-slide').length;

    if (!slidesCount) {
      console.debug('No slides found in the slider. Deleting the section', swiperEl);
      sliderSectionEl.remove();
      return;
    }

    new Swiper(swiperEl, {
      modules: [Navigation],
      loop: false,
      spaceBetween: 20,
      slidesPerView: 'auto',
      navigation: {
        nextEl: navNextButtonEl,
        prevEl: navPrevButtonEl,
        disabledClass: 'is-disabled',
      },
    });
  });
}
