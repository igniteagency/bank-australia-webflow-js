interface AssetData {
  impactAssets: string;
  totalAssets: string;
}
type AssetDataArray = AssetData[];

class ImpactFinancePie {
  private readonly SELECTOR_SECTION_IMPACT_PIE = '[data-el="section-impact-pie"]';
  private readonly SELECTOR_TIMELINE_STAT = '[data-el="timeline-stat"]';
  private readonly SELECTOR_CIRCLE_PIE = '[data-el="circle-pie"]';

  private readonly SELECTOR_TOTAL_ASSETS = '[data-el="total-assets"]';
  private readonly SELECTOR_IMPACT_ASSETS = '[data-el="impact-assets"]';

  private readonly TOTAL_SECTIONS_PROPERTY = '--_data-total-stat-sections';
  private readonly ACTIVE_SECTION_PROPERTY = '--_data-active-stat-section';
  private readonly PIE_FILL_PROPERTY = '--_pie-fill-turn';

  private section: HTMLElement;
  private stats: HTMLElement[];
  private circlePie: HTMLElement;
  private currentIndex = 1;
  private totalStatsCount: number;
  private assetRatios: number[];

  constructor() {
    this.section = document.querySelector(this.SELECTOR_SECTION_IMPACT_PIE) as HTMLElement;
    this.stats = Array.from(this.section?.querySelectorAll(this.SELECTOR_TIMELINE_STAT) ?? []);
    this.circlePie = document.querySelector(this.SELECTOR_CIRCLE_PIE) as HTMLElement;
    this.totalStatsCount = this.stats.length;
    this.assetRatios = [];

    if (!this.section || !this.stats.length || !this.circlePie) {
      console.error('Required elements not found');
      return;
    }

    this.initTimelineScrollAnimation();
    this.initStatsPopulation();
  }

  private initStatsPopulation(): void {
    const impactAssetSampleSpanEl = document.querySelector(this.SELECTOR_IMPACT_ASSETS);
    const totalAssetSampleSpanEl = document.querySelector(this.SELECTOR_TOTAL_ASSETS);
    if (!impactAssetSampleSpanEl || !totalAssetSampleSpanEl) {
      console.error('Impact assets or total assets not found');
      return;
    }

    const impactAssetsParentEl = impactAssetSampleSpanEl.parentElement as HTMLElement;
    const totalAssetsParentEl = totalAssetSampleSpanEl.parentElement as HTMLElement;

    // Get all stat items and their data
    const assetData: AssetDataArray = this.stats.map((stat) => ({
      impactAssets: stat.getAttribute('data-impact-assets') || '',
      totalAssets: stat.getAttribute('data-total-assets') || '',
    }));

    // Calculate asset ratios for the pie
    this.calculateAssetRatios(assetData);

    // Remove the sample spans
    impactAssetSampleSpanEl.remove();
    totalAssetSampleSpanEl.remove();

    // Create new spans for each stat's data
    assetData.forEach((data) => {
      const impactSpan = impactAssetSampleSpanEl.cloneNode(true) as HTMLElement;
      const totalSpan = totalAssetSampleSpanEl.cloneNode(true) as HTMLElement;

      impactSpan.textContent = `$${data.impactAssets}`;
      totalSpan.textContent = `$${data.totalAssets}`;

      impactAssetsParentEl.appendChild(impactSpan);
      totalAssetsParentEl.appendChild(totalSpan);
    });

    // Set initial pie fill
    this.updatePieFill(this.currentIndex);
  }

  private initTimelineScrollAnimation(): void {
    // Set total sections count
    this.section.style.setProperty(this.TOTAL_SECTIONS_PROPERTY, this.totalStatsCount.toString());
    this.section.style.setProperty(this.ACTIVE_SECTION_PROPERTY, this.currentIndex.toString());

    // Create snap points array (normalized positions for each stat)
    const snapPoints = this.stats.map((_, index) => index / (this.totalStatsCount - 1));

    const end =
      this.stats[this.totalStatsCount - 1].offsetTop +
      this.stats[this.totalStatsCount - 1].offsetHeight;

    // Set up ScrollTrigger for the section
    ScrollTrigger.create({
      trigger: this.section,
      start: 'top top',
      end: `+=${end}`,
      snap: snapPoints,
      onUpdate: (self) => {
        const index = Math.round(self.progress * (this.totalStatsCount - 1)) + 1;
        if (this.currentIndex !== index) {
          this.currentIndex = index;
          this.section.style.setProperty(this.ACTIVE_SECTION_PROPERTY, index.toString());
          this.updatePieFill(index);
        }
      },
      invalidateOnRefresh: true,
      markers: window.IS_DEBUG_MODE,
    });
  }

  private updatePieFill(index: number): void {
    if (!this.circlePie || index < 1 || index > this.assetRatios.length) return;

    const ratio = this.assetRatios[index - 1];
    const fillTurn = 1 - ratio; // Inverse the ratio for the pie fill
    this.circlePie.style.setProperty(this.PIE_FILL_PROPERTY, `${fillTurn}turn`);
  }

  private calculateAssetRatios(assetData: AssetDataArray): void {
    this.assetRatios = assetData.map((data) => {
      const impactAssets = this.parseAssetValue(data.impactAssets);
      const totalAssets = this.parseAssetValue(data.totalAssets);
      return impactAssets / totalAssets;
    });
  }

  private parseAssetValue(value: string): number {
    const numStr = value.toLowerCase().replace(/[mb]/g, '');
    const num = parseFloat(numStr);

    // Convert to millions
    if (value.toLowerCase().endsWith('b')) {
      return num * 1000; // Convert billions to millions
    }
    return num;
  }
}

window.Webflow ||= [];
window.Webflow.push(() => {
  new ImpactFinancePie();
});
