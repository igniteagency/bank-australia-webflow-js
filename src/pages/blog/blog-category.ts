import { initDuplicateArticlesRemoval } from 'src/components/blog/duplicates-remove';
import { initArticlesSlider } from 'src/components/blog/slider';

window.Webflow?.push(() => {
  initDuplicateArticlesRemoval();
  initArticlesSlider();
});
