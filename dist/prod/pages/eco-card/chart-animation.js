if (window.SCRIPTS_ENV === 'dev') {
  window.loadLocalScript('http://localhost:3000/pages/eco-card/chart-animation.js');
} else {
  (() => {
  // src/pages/eco-card/chart-animation.ts
  function animateChartOnScroll() {
    const chart = document.querySelector(".eco-card-change_chart");
    const fillPercentVar = "--_chart-fill-percent";
    const fillPercent = chart?.style.getPropertyValue(fillPercentVar) || "64%";
    const pointerLines = document.querySelectorAll(".eco-card-change_stat-pointer-line");
    const statItems = document.querySelectorAll(".eco-card-change_stat-item");
    if (!chart || pointerLines.length === 0 || statItems.length === 0) return;
    gsap.set(chart, {
      [fillPercentVar]: "0%"
    });
    gsap.set(pointerLines, {
      scaleX: 0,
      transformOrigin: "left"
    });
    gsap.set(statItems, {
      opacity: 0
    });
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: chart,
        start: "top 50%",
        toggleActions: "play none none none"
      }
    });
    tl.to(chart, {
      [fillPercentVar]: fillPercent,
      duration: 1.5,
      ease: "power2.out"
    }).to(
      statItems,
      {
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.12
      },
      ">"
      // after chart fill
    ).to(
      pointerLines,
      {
        scaleX: 1,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.15
      },
      "<+=0.3"
      // after stat items
    );
  }
  window.Webflow = window.Webflow || [];
  window.Webflow.push(() => {
    animateChartOnScroll();
  });
})();
}