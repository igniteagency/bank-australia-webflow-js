/**
 * Class to set lazy loading attribute to native Webflow video embed iframes
 */
export class LazyLoadVideoEmbeds {
  private observer: IntersectionObserver;

  constructor() {
    this.observer = new IntersectionObserver(this.handleIntersection.bind(this), {
      rootMargin: '0px 0px 200px 0px', // Load iframe 200px before it's fully in view
      threshold: 0, // Trigger when any part of the iframe enters the viewport
    });
  }

  public init(): void {
    const iframesToLoad = document.querySelectorAll<HTMLIFrameElement>('iframe.embedly-embed');
    iframesToLoad.forEach((iframe) => {
      const originalSrc = iframe.getAttribute('src');
      if (originalSrc) {
        iframe.removeAttribute('src'); // Prevent immediate loading
        iframe.setAttribute('data-src', originalSrc);
      }
      this.observer.observe(iframe);
    });
  }

  private loadIframe(iframe: HTMLIFrameElement): void {
    const src = iframe.dataset.src;
    if (src) {
      iframe.src = src;
      iframe.removeAttribute('data-src');
      this.observer.unobserve(iframe);
    }
  }

  private handleIntersection(entries: IntersectionObserverEntry[]): void {
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.target instanceof HTMLIFrameElement) {
        this.loadIframe(entry.target);
      }
    });
  }
}
