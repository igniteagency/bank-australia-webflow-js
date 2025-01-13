
// pages/blog/blog-tags.js
if (window.SCRIPTS_ENV === 'dev') {
  window.loadLocalScript('http://localhost:3000/pages/blog/blog-tags.js');
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

  // src/pages/blog/blog-tags.ts
  var _a;
  (_a = window.Webflow) == null ? void 0 : _a.push(() => {
    initDuplicateArticlesRemoval();
  });
})();
}
