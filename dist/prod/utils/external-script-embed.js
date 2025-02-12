// utils/external-script-embed.js
if (window.SCRIPTS_ENV === 'dev') {
  window.loadLocalScript('http://localhost:3000/utils/external-script-embed.js');
} else {
  (() => {
  // src/utils/external-script-embed.ts
  function loadExternalScript(url, placement = "body", defer = true) {
    return new Promise((resolve, reject) => {
      const existingScript = document.querySelector(`script[src="${url}"]`);
      if (existingScript) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = url;
      if (defer) script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
      if (placement === "head") {
        document.head.appendChild(script);
      } else if (placement === "body") {
        document.body.appendChild(script);
      } else {
        reject(new Error('Invalid placement. Use "head" or "body".'));
      }
    });
  }
  window.loadExternalScript = loadExternalScript;
})();
}