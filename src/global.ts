import '$utils/alpine-webflow';
import { initBugHerd } from '$utils/bugherd-script';
import { LazyLoadVideoEmbeds } from '$utils/lazy-load-videos';

import { setImageCardAriaLabel } from './components/image-card';

document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);
  new LazyLoadVideoEmbeds().init();
});

window.Webflow = window.Webflow || [];
window.Webflow.push(() => {
  disableWebflowScroll();
  setImageCardAriaLabel();
  initBugHerd();
});

/**
 * remove Webflow script-based smooth scroll
 * in favour of CSS-native smooth scroll on `html`
 */
function disableWebflowScroll() {
  jQuery(document).off('click.wf-scroll');
}
