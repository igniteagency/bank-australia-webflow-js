window.Webflow = window.Webflow || [];
window.Webflow.push(() => {
  if (window.EXECUTED_SCRIPT.includes('icon-animate')) {
    console.debug('Icon animation script already executed');
    return;
  }

  const ICON_CONTAINER_SELECTOR = '[data-icon-animate]';

  // Create Intersection Observer options
  const observerOptions = {
    root: null, // use viewport as root
    threshold: 0.2, // trigger when 20% visible
    rootMargin: '0px',
  };

  // Function to animate the icon
  const animateIcon = (iconContainer: Element) => {
    const duration = iconContainer.getAttribute('data-icon-animate-duration') || '1.5';
    const paths = iconContainer.querySelectorAll('path');

    // Set initial state for all paths
    gsap.set(paths, {
      drawSVG: '0%',
    });

    // Animate all paths at once
    gsap.to(paths, {
      drawSVG: '100%',
      duration: parseFloat(duration),
      ease: 'power1.inOut',
      onComplete: () => {
        observer.unobserve(iconContainer);
      },
    });
  };

  // Create Intersection Observer callback
  const observerCallback: IntersectionObserverCallback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Add a data attribute to track if animation has played
        const hasAnimated = entry.target.getAttribute('data-has-animated');
        if (!hasAnimated) {
          entry.target.setAttribute('data-has-animated', 'true');
          animateIcon(entry.target);
        }
      }
    });
  };

  // Create observer
  const observer = new IntersectionObserver(observerCallback, observerOptions);

  // Get all icon containers and observe them
  const iconList = document.querySelectorAll(ICON_CONTAINER_SELECTOR);
  iconList.forEach((iconEl) => {
    observer.observe(iconEl);
  });

  window.EXECUTED_SCRIPT.push('icon-animate');
});
