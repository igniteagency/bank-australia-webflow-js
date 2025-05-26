if (window.SCRIPTS_ENV === 'dev') {
  window.loadLocalScript('http://localhost:3000/components/blog/duplicates-remove.js');
} else {
  (() => {
  // src/components/blog/duplicates-remove.ts
  var ARTICLE_SLUG_ATTR = "data-duplicate-check-slug";
  var ARTICLE_PROCESSED_ATTR = "data-duplicate-checked";
  var DuplicateArticlesRemover = class {
    articleSlugSet = /* @__PURE__ */ new Set();
    constructor() {
      this.removeDuplicatesFromDOM();
      this.reassessOnFinsweetCMSLoad();
    }
    // Removes duplicates from the DOM using the ARTICLE_SLUG_ATTR
    removeDuplicatesFromDOM() {
      const articles = Array.from(
        document.querySelectorAll(`[${ARTICLE_SLUG_ATTR}]:not([${ARTICLE_PROCESSED_ATTR}])`)
      );
      articles.forEach((article) => {
        this.removeIfDuplicate(article);
      });
    }
    reassessOnFinsweetCMSLoad() {
      window.FinsweetAttributes ||= [];
      window.FinsweetAttributes.push([
        "list",
        (listInstances) => {
          const [listInstance] = listInstances;
          if (!listInstances.length) return;
          listInstance.addHook("beforeRender", (items) => {
            items.forEach((item) => {
              if (item.element?.hasAttribute(ARTICLE_PROCESSED_ATTR)) {
                return;
              }
              const isDuplicate = this.removeIfDuplicate(item.element);
              if (isDuplicate) {
                listInstance.items.value.splice(items.indexOf(item), 1);
              }
            });
          });
        }
      ]);
    }
    /**
     * @param article - The article element to check for duplicates
     * @returns true if the article is a duplicate and has been removed, false otherwise
     */
    removeIfDuplicate(article) {
      if (article.hasAttribute(ARTICLE_PROCESSED_ATTR)) {
        return false;
      }
      const articleSlug = article.getAttribute(ARTICLE_SLUG_ATTR);
      if (!articleSlug || articleSlug === "") {
        article.setAttribute(ARTICLE_PROCESSED_ATTR, "true");
        return false;
      }
      if (this.articleSlugSet.has(articleSlug)) {
        if (window.IS_DEBUG_MODE) {
          console.debug(`Removing duplicate article - %c${articleSlug}`, "color: #DC198B;");
        }
        article.remove();
        return true;
      } else {
        this.articleSlugSet.add(articleSlug);
        article.setAttribute(ARTICLE_PROCESSED_ATTR, "true");
        return false;
      }
    }
  };
  window.Webflow?.push(() => {
    new DuplicateArticlesRemover();
  });
})();
}