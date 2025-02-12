// utils/external-script-embed.js
if (window.SCRIPTS_ENV === 'dev') {
  window.loadLocalScript('http://localhost:3000/utils/external-script-embed.js');
} else {
  (() => {
  // src/utils/external-script-embed.ts
  function loadExternalScript(url, placement = "body", defer = true) {
    if (document.querySelector(`script[src="${url}"]`)) {
      return;
    }
    const script = document.createElement("script");
    script.src = url;
    if (defer) script.defer = true;
    if (placement === "head") {
      document.head.appendChild(script);
    } else if (placement === "body") {
      document.body.appendChild(script);
    } else {
      console.error('Invalid placement. Use "head" or "body".');
      return;
    }
  }
  window.loadExternalScript = loadExternalScript;
})();
}