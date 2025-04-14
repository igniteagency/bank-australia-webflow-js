if (window.SCRIPTS_ENV === 'dev') {
  window.loadLocalScript('http://localhost:3000/utils/external-script-embed.js');
} else {
  (() => {
  // src/utils/external-script-embed.ts
  function loadExternalScript(url, placement = "body", defer = true, scriptName = void 0) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${url}"]`)) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = url;
      if (defer) script.defer = true;
      script.addEventListener("load", () => {
        if (scriptName) {
          const event = new CustomEvent(`scriptLoaded:${scriptName}`, {
            detail: { url, scriptName }
          });
          document.dispatchEvent(event);
        }
        resolve();
      });
      script.addEventListener("error", (error) => {
        reject(new Error(`Failed to load script: ${url}`));
      });
      if (placement === "head") {
        document.head.appendChild(script);
      } else if (placement === "body") {
        document.body.appendChild(script);
      } else {
        reject(new Error('Invalid script placement. Use "head" or "body".'));
      }
    });
  }
  window.loadExternalScript = loadExternalScript;
})();
}