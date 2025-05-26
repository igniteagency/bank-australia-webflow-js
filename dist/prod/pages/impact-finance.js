if (window.SCRIPTS_ENV === 'dev') {
  window.loadLocalScript('http://localhost:3000/pages/impact-finance.js');
} else {
  (() => {
  // src/pages/impact-finance.ts
  var ImpactFinancePie = class {
    SELECTOR_SECTION_IMPACT_PIE = '[data-el="section-impact-pie"]';
    SELECTOR_TIMELINE_STAT = '[data-el="timeline-stat"]';
    SELECTOR_CIRCLE_PIE = '[data-el="circle-pie"]';
    SELECTOR_TOTAL_ASSETS = '[data-el="total-assets"]';
    SELECTOR_IMPACT_ASSETS = '[data-el="impact-assets"]';
    TOTAL_SECTIONS_PROPERTY = "--_data-total-stat-sections";
    ACTIVE_SECTION_PROPERTY = "--_data-active-stat-section";
    PIE_FILL_PROPERTY = "--_pie-fill-turn";
    section;
    stats;
    circlePie;
    currentIndex = 1;
    totalStatsCount;
    assetRatios;
    constructor() {
      this.section = document.querySelector(this.SELECTOR_SECTION_IMPACT_PIE);
      this.stats = Array.from(this.section?.querySelectorAll(this.SELECTOR_TIMELINE_STAT) ?? []);
      this.circlePie = document.querySelector(this.SELECTOR_CIRCLE_PIE);
      this.totalStatsCount = this.stats.length;
      this.assetRatios = [];
      if (!this.section || !this.stats.length || !this.circlePie) {
        console.error("Required elements not found");
        return;
      }
      this.initTimelineScrollAnimation();
      this.initStatsPopulation();
    }
    initStatsPopulation() {
      const impactAssetSampleSpanEl = document.querySelector(this.SELECTOR_IMPACT_ASSETS);
      const totalAssetSampleSpanEl = document.querySelector(this.SELECTOR_TOTAL_ASSETS);
      if (!impactAssetSampleSpanEl || !totalAssetSampleSpanEl) {
        console.error("Impact assets or total assets not found");
        return;
      }
      const impactAssetsParentEl = impactAssetSampleSpanEl.parentElement;
      const totalAssetsParentEl = totalAssetSampleSpanEl.parentElement;
      const assetData = this.stats.map((stat) => ({
        impactAssets: stat.getAttribute("data-impact-assets") || "",
        totalAssets: stat.getAttribute("data-total-assets") || ""
      }));
      this.calculateAssetRatios(assetData);
      impactAssetSampleSpanEl.remove();
      totalAssetSampleSpanEl.remove();
      assetData.forEach((data) => {
        const impactSpan = impactAssetSampleSpanEl.cloneNode(true);
        const totalSpan = totalAssetSampleSpanEl.cloneNode(true);
        impactSpan.textContent = `$${data.impactAssets}`;
        totalSpan.textContent = `$${data.totalAssets}`;
        impactAssetsParentEl.appendChild(impactSpan);
        totalAssetsParentEl.appendChild(totalSpan);
      });
      this.updatePieFill(this.currentIndex);
    }
    initTimelineScrollAnimation() {
      this.section.style.setProperty(this.TOTAL_SECTIONS_PROPERTY, this.totalStatsCount.toString());
      this.section.style.setProperty(this.ACTIVE_SECTION_PROPERTY, this.currentIndex.toString());
      const end = this.stats[this.totalStatsCount - 1].offsetTop;
      ScrollTrigger.create({
        trigger: this.section,
        start: "top top",
        end: `+=${end}`,
        // snap: snapPoints,
        onUpdate: (self) => {
          const index = Math.round(self.progress * (this.totalStatsCount - 1)) + 1;
          if (this.currentIndex !== index) {
            this.currentIndex = index;
            this.section.style.setProperty(this.ACTIVE_SECTION_PROPERTY, index.toString());
            this.updatePieFill(index);
          }
        },
        invalidateOnRefresh: true,
        markers: window.IS_DEBUG_MODE
      });
    }
    updatePieFill(index) {
      if (!this.circlePie || index < 1 || index > this.assetRatios.length) return;
      const ratio = this.assetRatios[index - 1];
      const fillTurn = 1 - ratio;
      this.circlePie.style.setProperty(this.PIE_FILL_PROPERTY, `${fillTurn}turn`);
    }
    calculateAssetRatios(assetData) {
      this.assetRatios = assetData.map((data) => {
        const impactAssets = this.parseAssetValue(data.impactAssets);
        const totalAssets = this.parseAssetValue(data.totalAssets);
        return impactAssets / totalAssets;
      });
    }
    parseAssetValue(value) {
      const numStr = value.toLowerCase().replace(/[mb]/g, "");
      const num = parseFloat(numStr);
      if (value.toLowerCase().endsWith("b")) {
        return num * 1e3;
      }
      return num;
    }
  };
  window.Webflow ||= [];
  window.Webflow.push(() => {
    new ImpactFinancePie();
  });
})();
}