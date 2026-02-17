import backToTopButton from '$components/back-to-top-button';
import '$components/dialog-modal';
import IconImage from '$components/icon-image';
import '$utils/alpine-webflow';
import { initBugHerd } from '$utils/bugherd-script';
import { LazyLoadVideoEmbeds } from '$utils/lazy-load-video-embeds';

import { setImageCardAriaLabel } from './components/image-card';
import { linkExternal } from './link-external';

document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);
  new IconImage();
  new LazyLoadVideoEmbeds().init();
});

window.Webflow = window.Webflow || [];
window.Webflow.push(() => {
  disableWebflowScroll();
  setImageCardAriaLabel();
  initBugHerd();
  linkExternal();
  backToTopButton();
});

/**
 * remove Webflow script-based smooth scroll
 * in favour of CSS-native smooth scroll on `html`
 */
function disableWebflowScroll() {
  jQuery(document).off('click.wf-scroll');
}
