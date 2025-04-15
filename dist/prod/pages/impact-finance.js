if (window.SCRIPTS_ENV === 'dev') {
  window.loadLocalScript('http://localhost:3000/pages/impact-finance.js');
} else {
  (() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  // src/pages/impact-finance.ts
  var ImpactFinancePie = class {
    constructor() {
      __publicField(this, "SELECTOR_SECTION_IMPACT_PIE", '[data-el="section-impact-pie"]');
      __publicField(this, "SELECTOR_TIMELINE_STAT", '[data-el="timeline-stat"]');
      __publicField(this, "SELECTOR_CIRCLE_PIE", '[data-el="circle-pie"]');
      __publicField(this, "SELECTOR_TOTAL_ASSETS", '[data-el="total-assets"]');
      __publicField(this, "SELECTOR_IMPACT_ASSETS", '[data-el="impact-assets"]');
      __publicField(this, "TOTAL_SECTIONS_PROPERTY", "--_data-total-stat-sections");
      __publicField(this, "ACTIVE_SECTION_PROPERTY", "--_data-active-stat-section");
      __publicField(this, "PIE_FILL_PROPERTY", "--_pie-fill-turn");
      __publicField(this, "section");
      __publicField(this, "stats");
      __publicField(this, "circlePie");
      __publicField(this, "currentIndex", 1);
      __publicField(this, "totalStatsCount");
      __publicField(this, "assetRatios");
      var _a, _b;
      this.section = document.querySelector(this.SELECTOR_SECTION_IMPACT_PIE);
      this.stats = Array.from((_b = (_a = this.section) == null ? void 0 : _a.querySelectorAll(this.SELECTOR_TIMELINE_STAT)) != null ? _b : []);
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
  window.Webflow || (window.Webflow = []);
  window.Webflow.push(() => {
    new ImpactFinancePie();
  });
})();
}