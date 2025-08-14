if (window.SCRIPTS_ENV === 'dev') {
  window.loadLocalScript('http://localhost:3000/link-external.js');
} else {
  (() => {
  // src/link-external.ts
  function linkExternal() {
    document.querySelectorAll("a[data-external]").forEach((link) => {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    });
  }
})();
}