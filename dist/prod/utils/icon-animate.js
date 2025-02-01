// utils/icon-animate.js
if (window.SCRIPTS_ENV === 'dev') {
  window.loadLocalScript('http://localhost:3000/utils/icon-animate.js');
} else {
  (() => {
  // src/utils/icon-animate.ts
  window.Webflow = window.Webflow || [];
  window.Webflow.push(() => {
    if (window.EXECUTED_SCRIPT.includes("icon-animate")) {
      console.debug("Icon animation script already executed");
      return;
    }
    const ICON_CONTAINER_SELECTOR = "[data-icon-animate]";
    const observerOptions = {
      root: null,
      // use viewport as root
      threshold: 0.2,
      // trigger when 20% visible
      rootMargin: "0px"
    };
    const animateIcon = (iconContainer) => {
      const duration = iconContainer.getAttribute("data-icon-animate-duration") || "1.5";
      const paths = iconContainer.querySelectorAll("path");
      gsap.set(paths, {
        drawSVG: "0%"
      });
      gsap.to(paths, {
        drawSVG: "100%",
        duration: parseFloat(duration),
        ease: "power1.inOut",
        onComplete: () => {
          observer.unobserve(iconContainer);
        }
      });
    };
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const hasAnimated = entry.target.getAttribute("data-has-animated");
          if (!hasAnimated) {
            entry.target.setAttribute("data-has-animated", "true");
            animateIcon(entry.target);
          }
        }
      });
    };
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const iconList = document.querySelectorAll(ICON_CONTAINER_SELECTOR);
    iconList.forEach((iconEl) => {
      observer.observe(iconEl);
    });
    window.EXECUTED_SCRIPT.push("icon-animate");
  });
})();
}