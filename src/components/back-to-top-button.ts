export default function backToTopButton(): void {
  const componentEl = document.querySelector('.back-to-top_component');
  const HIDE_CLASSNAME = 'hide';
  if (!componentEl) return;

  const threshold = parseInt(componentEl.getAttribute('data-threshold') || '700', 700);

  function scrollToTop(): void {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
  }

  ScrollTrigger.create({
    trigger: document.body,
    start: `${threshold}px top`,
    end: 'bottom bottom',
    onToggle: (self) => {
      componentEl.classList.toggle(HIDE_CLASSNAME, !self.isActive);
    },
    onRefresh: (self) => {
      componentEl.classList.toggle(HIDE_CLASSNAME, !self.isActive);
    },
  });

  componentEl.addEventListener('click', function (e: Event): void {
    e.preventDefault();
    scrollToTop();
  });
}
