import { initBugHerd } from '$utils/bugherd-script';

import { setImageCardAriaLabel } from './components/image-card';

window.Webflow?.push(() => {
  setImageCardAriaLabel();
  initBugHerd();
});
