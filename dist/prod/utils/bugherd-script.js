if (window.SCRIPTS_ENV === 'dev') {
  window.loadLocalScript('http://localhost:3000/utils/bugherd-script.js');
} else {
  (() => {
  // src/utils/bugherd-script.ts
  function initBugHerd() {
    const currentHostname = window.location.hostname;
    if (currentHostname.includes("webflow.io")) {
      window.loadExternalScript(
        "https://www.bugherd.com/sidebarv2.js?apikey=alf2xg3pewxzwvuoe7c00g",
        "body",
        false
      ).then(() => {
        console.log("BugHerd script loaded successfully");
      }).catch((error) => {
        console.error("Failed to load BugHerd script:", error);
      });
    }
  }
})();
}