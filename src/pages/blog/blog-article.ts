window.Webflow?.push(() => {
  setSocialShareLinks();
});

function setSocialShareLinks() {
  const socialLinks = document.querySelectorAll('.social-share-icon');
  const pageUrl = window.location.href;

  socialLinks.forEach((socialLink) => {
    socialLink.setAttribute('href', socialLink.dataset.url + pageUrl);
  });
}
