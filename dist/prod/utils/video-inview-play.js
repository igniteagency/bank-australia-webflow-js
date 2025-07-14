if (window.SCRIPTS_ENV === 'dev') {
  window.loadLocalScript('http://localhost:3000/utils/video-inview-play.js');
} else {
  (() => {
  // src/utils/video-inview-play.ts
  var VIDEO_CONTAINER_SELECTOR = '[data-el="video-inview-play"]';
  var VIDEO_SELECTOR = "video";
  var EXECUTED_SCRIPT_NAME = "video-inview-play";
  window.Webflow = window.Webflow || [];
  window.Webflow.push(() => {
    if (window.EXECUTED_SCRIPT.includes(EXECUTED_SCRIPT_NAME)) {
      console.debug("Video inview play script already executed");
      return;
    }
    const observerOptions = {
      root: null,
      rootMargin: "0px 0px 200px 0px",
      // Start a bit before fully in view
      threshold: 0.1
      // Play when at least 10% is visible
    };
    function handleIntersection(entries, observer2) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const container = entry.target;
          const video = container.querySelector(VIDEO_SELECTOR);
          if (video && video.paused) {
            video.play().catch((err) => {
              console.debug("Video play failed:", err);
            });
          }
        } else {
          const container = entry.target;
          const video = container.querySelector(VIDEO_SELECTOR);
          if (video && !video.paused) {
            video.pause();
          }
        }
      });
    }
    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    const containers = document.querySelectorAll(VIDEO_CONTAINER_SELECTOR);
    containers.forEach((container) => {
      const video = container.querySelector(VIDEO_SELECTOR);
      if (video) {
        observer.observe(container);
      }
    });
    window.addEventListener("beforeunload", () => {
      observer.disconnect();
    });
    window.EXECUTED_SCRIPT.push(EXECUTED_SCRIPT_NAME);
  });
})();
}