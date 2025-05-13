if (window.SCRIPTS_ENV === 'dev') {
  window.loadLocalScript('http://localhost:3000/pages/blog-article.js');
} else {
  (() => {
  // src/pages/blog-article.ts
  function setGallerySliderDataAttribute() {
    const gallerySliderElList = document.querySelectorAll('[data-gallery-layout="Image Slider"]');
    gallerySliderElList.forEach((gallerySliderEl) => {
      gallerySliderEl.setAttribute("data-slider-el", "section");
    });
  }
  document.addEventListener("DOMContentLoaded", () => {
    setGallerySliderDataAttribute();
  });
})();
}