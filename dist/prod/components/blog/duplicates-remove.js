// components/blog/duplicates-remove.js
if (window.SCRIPTS_ENV === 'dev') {
  window.loadLocalScript('http://localhost:3000/components/blog/duplicates-remove.js');
} else {
  (() => {
  // src/components/blog/duplicates-remove.ts
  var ARTICLE_SLUG_ATTR = "data-duplicate-check-slug";
  function initDuplicateArticlesRemoval() {
    const articleSlugList = [];
    document.querySelectorAll(`[${ARTICLE_SLUG_ATTR}]`).forEach((articleItemEl) => {
      const articleSlug = articleItemEl.getAttribute(ARTICLE_SLUG_ATTR);
      if (!articleSlug || "" === articleSlug) {
        return;
      }
      if (articleSlugList.includes(articleSlug)) {
        articleItemEl.remove();
      } else {
        articleSlugList.push(articleSlug);
      }
    });
  }
})();
}