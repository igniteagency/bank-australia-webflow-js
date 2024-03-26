import { initDuplicateArticlesRemoval } from 'src/components/duplicates-remove';

window.Webflow?.push(() => {
  initDuplicateArticlesRemoval();
});
