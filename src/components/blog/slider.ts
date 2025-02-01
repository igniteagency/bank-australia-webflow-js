import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';

const SECTION_SELECTOR = '[data-blog-slider-el="section"]';
const NAV_PREV_BUTTON_SELECTOR = '[data-blog-slider-el="nav-prev"]';
const NAV_NEXT_BUTTON_SELECTOR = '[data-blog-slider-el="nav-next"]';

export function initArticlesSlider() {
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
      slidesPerView: 1,
      slidesPerGroup: 1,
      spaceBetween: 20,
      navigation: {
        nextEl: navNextButtonEl,
        prevEl: navPrevButtonEl,
        disabledClass: 'is-disabled',
      },
      breakpoints: {
        481: {
          slidesPerView: 2,
        },
        768: {
          slidesPerView: 3,
        },
      },
    });
  });
}
