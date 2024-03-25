import { initDuplicateArticlesRemoval } from 'src/components/blog-category/duplicates-remove';
import { initArticlesSlider } from 'src/components/slider';

window.Webflow?.push(() => {
  initDuplicateArticlesRemoval();
  initArticlesSlider();
});
