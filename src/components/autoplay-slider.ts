const AUTOPLAY_DELAY_MS = 5000;
const SLIDER_TRANSITION_SPEED_MS = 750;
const SWIPER_CDN_URL = 'https://cdn.jsdelivr.net/npm/swiper@11.2.1/swiper-bundle.min.js';

window.Webflow = window.Webflow || [];
window.Webflow.push(async () => {
  if (window.EXECUTED_SCRIPT.includes('autoplay-slider')) {
    console.debug('Autoplay slider script already executed');
    return;
  }

  try {
    // Load Swiper JS first
    await window.loadExternalScript(SWIPER_CDN_URL);

    let DEFAULT_SLIDER_GAP = 40;

    const SECTION_SELECTOR = '[data-slider-el="section"]';
    const NAV_PREV_BUTTON_SELECTOR = '[data-slider-el="nav-prev"]';
    const NAV_NEXT_BUTTON_SELECTOR = '[data-slider-el="nav-next"]';
    const AUTOPLAY_BUTTON_SELECTOR = '[data-slider-el="autoplay"]';
    const PAGINATION_SELECTOR = '[data-slider-el="pagination"]';

    const LOOP_ATTRIBUTE = 'data-slider-loop';
    const SLIDER_GAP_OVERRIDE_ATTR = 'data-slider-gap';
    const CENTERED_SLIDES_ATTRIBUTE = 'data-slider-centered';

    document.querySelectorAll(SECTION_SELECTOR).forEach((sliderSectionEl) => {
      const swiperEl = sliderSectionEl.querySelector('.swiper');
      const navPrevButtonEl = sliderSectionEl.querySelector(NAV_PREV_BUTTON_SELECTOR);
      const navNextButtonEl = sliderSectionEl.querySelector(NAV_NEXT_BUTTON_SELECTOR);
      const autoplayButtonEl = sliderSectionEl.querySelector(AUTOPLAY_BUTTON_SELECTOR);
      const paginationEl = sliderSectionEl.querySelector(PAGINATION_SELECTOR);

      const shouldLoop = sliderSectionEl.getAttribute(LOOP_ATTRIBUTE) === 'true' ? true : false;
      const sliderGap =
        sliderSectionEl.getAttribute(SLIDER_GAP_OVERRIDE_ATTR) || DEFAULT_SLIDER_GAP;
      const shouldCenterSlides =
        sliderSectionEl.getAttribute(CENTERED_SLIDES_ATTRIBUTE) === 'true' ? true : false;

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

      // Configure navigation only if both buttons exist
      const navigationConfig =
        navPrevButtonEl && navNextButtonEl
          ? {
              nextEl: navNextButtonEl,
              prevEl: navPrevButtonEl,
              disabledClass: 'is-disabled',
            }
          : false;

      // Configure pagination if element exists
      const paginationConfig = paginationEl
        ? {
            el: paginationEl,
            clickable: true,
            bulletElement: 'button',
            bulletClass: 'autoplay-slider_nav-item',
            bulletActiveClass: 'is-active',
            renderBullet: (index: number, className: string) => {
              return `<button class="${className}" type="button">
            <span class="visually-hidden">Go to slide ${index + 1}</span>
          </button>`;
            },
          }
        : false;

      const autoplayConfig = autoplayButtonEl
        ? {
            delay: AUTOPLAY_DELAY_MS,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }
        : false;

      console.debug({ shouldLoop, shouldCenterSlides, autoplayConfig });

      // Initialize Swiper with autoplay
      try {
        const swiper = new Swiper(swiperEl, {
          loop: shouldLoop,
          slidesPerView: 'auto',
          slidesPerGroup: 1,
          speed: SLIDER_TRANSITION_SPEED_MS,
          spaceBetween: sliderGap,
          centeredSlides: shouldCenterSlides,
          watchSlidesProgress: true,
          navigation: navigationConfig,
          pagination: paginationConfig,
          slideActiveClass: 'is-active',
          slidePrevClass: 'is-previous',
          slideNextClass: 'is-next',
          autoplay: autoplayConfig,
          on: {
            init: function (swiperInstance) {
              if (paginationEl) {
                paginationEl.style.setProperty('--autoplay-delay', `${AUTOPLAY_DELAY_MS}ms`);
                paginationEl.style.setProperty(
                  '--slider-transition-speed',
                  `${SLIDER_TRANSITION_SPEED_MS}ms`
                );
              }

              // Add click handler for inactive slides
              const slides = swiperEl.querySelectorAll('.swiper-slide');
              slides.forEach((slide) => {
                slide.addEventListener('click', () => {
                  if (!slide.classList.contains('is-active')) {
                    const clickedSlide = slide as HTMLElement;
                    if (clickedSlide.classList.contains('is-previous')) {
                      swiperInstance.slidePrev();
                    } else if (clickedSlide.classList.contains('is-next')) {
                      swiperInstance.slideNext();
                    }
                  }
                });
              });
            },
          },
          observer: true,
          observeParents: true,
          a11y: {
            enabled: true,
          },
          breakpoints: {
            480: {
              spaceBetween: parseInt(sliderGap) / 2,
            },
            768: {
              spaceBetween: parseInt(sliderGap) / 1.5,
            },
          },
        });

        // Handle autoplay button functionality
        if (autoplayButtonEl) {
          let isPlaying = true;

          // Set initial button state
          updateAutoplayButtonState(autoplayButtonEl, isPlaying);

          autoplayButtonEl.addEventListener('click', () => {
            if (isPlaying) {
              swiper.autoplay.stop();
            } else {
              swiper.autoplay.start();
            }
          });

          // Update button state when autoplay starts/stops
          swiper.on('autoplayStart', () => {
            isPlaying = true;
            updateAutoplayButtonState(autoplayButtonEl, isPlaying);
          });

          swiper.on('autoplayStop', () => {
            isPlaying = false;
            updateAutoplayButtonState(autoplayButtonEl, isPlaying);
          });
        }
      } catch (error) {
        console.error('Error initializing Swiper', error);
      }
    });

    function updateAutoplayButtonState(button: Element, isPlaying: boolean) {
      // Update button attributes and content
      button.setAttribute('aria-pressed', (!isPlaying).toString());
      button.setAttribute('aria-label', `${isPlaying ? 'Pause' : 'Play'} slider autoplay`);

      // Toggle class for visual state
      button.classList.toggle('is-paused', !isPlaying);
    }

    window.EXECUTED_SCRIPT.push('autoplay-slider');
  } catch (error) {
    console.error('Error loading Swiper', error);
  }
});
