function setGallerySliderDataAttribute() {
  const gallerySliderElList = document.querySelectorAll('[data-gallery-layout="Image Slider"]');
  gallerySliderElList.forEach((gallerySliderEl) => {
    gallerySliderEl.setAttribute('data-slider-el', 'section');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Add slider data attributes before autoplay slider script is executed
  setGallerySliderDataAttribute();
});
