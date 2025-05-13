import '$utils/alpine-webflow';
import { initBugHerd } from '$utils/bugherd-script';
import { LazyLoadVideoEmbeds } from '$utils/lazy-load-videos';

import { setImageCardAriaLabel } from './components/image-card';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  new LazyLoadVideoEmbeds().init();
});

window.Webflow = window.Webflow || [];
window.Webflow.push(() => {
  setImageCardAriaLabel();
  initBugHerd();
});
