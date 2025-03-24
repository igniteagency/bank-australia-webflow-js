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
    const iconContainers = document.querySelectorAll(ICON_CONTAINER_SELECTOR);
    iconContainers.forEach((iconContainer) => {
      const duration = iconContainer.getAttribute("data-icon-animate-duration") || "1.5";
      const paths = iconContainer.querySelectorAll("path");
      const durationNum = parseFloat(duration);
      paths.forEach((path) => {
        const pathLength = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength
        });
      });
      gsap.to(paths, {
        scrollTrigger: {
          trigger: iconContainer,
          start: "top 90%",
          once: true
        },
        strokeDashoffset: 0,
        duration: durationNum,
        ease: "power1.inOut"
      });
    });
    window.EXECUTED_SCRIPT.push("icon-animate");
  });
})();
}