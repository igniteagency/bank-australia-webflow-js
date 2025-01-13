import { initDuplicateArticlesRemoval } from 'src/components/blog/duplicates-remove';

window.Webflow?.push(() => {
  initDuplicateArticlesRemoval();
});
