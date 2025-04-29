const ARTICLE_SLUG_ATTR = 'data-duplicate-check-slug';

window.Webflow?.push(() => {
  initDuplicateArticlesRemoval();
});

export function initDuplicateArticlesRemoval() {
  const articleSlugList: string[] = [];

  document.querySelectorAll(`[${ARTICLE_SLUG_ATTR}]`).forEach((articleItemEl) => {
    const articleSlug = articleItemEl.getAttribute(ARTICLE_SLUG_ATTR);
    if (!articleSlug || '' === articleSlug) {
      return;
    }

    if (articleSlugList.includes(articleSlug)) {
      articleItemEl.remove();
    } else {
      articleSlugList.push(articleSlug);
    }
  });
}
