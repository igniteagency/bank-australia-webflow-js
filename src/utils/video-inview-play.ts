// Selector constants
const VIDEO_CONTAINER_SELECTOR = '[data-el="video-inview-play"]';
const VIDEO_SELECTOR = 'video';
const EXECUTED_SCRIPT_NAME = 'video-inview-play';

window.Webflow = window.Webflow || [];
window.Webflow.push(() => {
  if (window.EXECUTED_SCRIPT.includes(EXECUTED_SCRIPT_NAME)) {
    console.debug('Video inview play script already executed');
    return;
  }

  // IntersectionObserver options
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px 200px 0px', // Start a bit before fully in view
    threshold: 0.1, // Play when at least 10% is visible
  };

  // Callback for IntersectionObserver
  function handleIntersection(
    entries: IntersectionObserverEntry[],
    observer: IntersectionObserver
  ) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const container = entry.target as HTMLElement;
        const video = container.querySelector(VIDEO_SELECTOR) as HTMLVideoElement | null;
        if (video && video.paused) {
          video.play().catch((err: unknown) => {
            // Autoplay might be blocked; ignore
            console.debug('Video play failed:', err);
          });
        }
      } else {
        // Optionally pause when out of view
        const container = entry.target as HTMLElement;
        const video = container.querySelector(VIDEO_SELECTOR) as HTMLVideoElement | null;
        if (video && !video.paused) {
          video.pause();
        }
      }
    });
  }

  // Set up observer
  const observer = new IntersectionObserver(handleIntersection, observerOptions);

  // Observe all containers
  const containers = document.querySelectorAll(VIDEO_CONTAINER_SELECTOR);
  containers.forEach((container) => {
    const video = container.querySelector(VIDEO_SELECTOR);
    if (video) {
      observer.observe(container);
    }
  });

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    observer.disconnect();
  });

  window.EXECUTED_SCRIPT.push(EXECUTED_SCRIPT_NAME);
});
