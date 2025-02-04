// components/app-download-dialog.js
if (window.SCRIPTS_ENV === 'dev') {
  window.loadLocalScript('http://localhost:3000/components/app-download-dialog.js');
} else {
  (() => {
  // src/components/app-download-dialog.ts
  window.Webflow = window.Webflow || [];
  window.Webflow.push(() => {
    if (window.EXECUTED_SCRIPT.includes("app-download-dialog")) {
      console.debug("App download dialog script already executed");
      return;
    }
    const DIALOG_COMPONENT_SELECTOR = '[data-el="app-download-dialog-component"]';
    const DIALOG_CLOSE_SELECTOR = '[data-el="app-download-dialog-close"]';
    const dialogComponents = document.querySelectorAll(DIALOG_COMPONENT_SELECTOR);
    dialogComponents.forEach((componentEl) => {
      const links = componentEl.querySelectorAll("a");
      links.forEach((link) => {
        if (isIOS() || isAndroid()) {
          const downloadLink = isIOS() ? componentEl.getAttribute("data-ios-download-link") : componentEl.getAttribute("data-android-download-link");
          if (downloadLink) {
            link.href = downloadLink;
            return;
          }
        } else {
          link.addEventListener("click", (event) => {
            handleDialogOpen(componentEl, event);
          });
        }
      });
    });
    const handleDialogOpen = (componentEl, event) => {
      event.preventDefault();
      const dialog = componentEl.querySelector("dialog");
      if (!dialog) {
        console.error("No dialog element found in the component");
        return;
      }
      const closeButton = componentEl.querySelector(DIALOG_CLOSE_SELECTOR);
      dialog.showModal();
      const handleOutsideClick = (event2) => {
        if (event2.target === dialog) {
          closeDialog(dialog);
        }
      };
      const handleCloseClick = () => {
        closeDialog(dialog);
      };
      const handleDialogClose = () => {
        dialog.classList.remove("closing");
        dialog.removeEventListener("close", handleDialogClose);
        dialog.removeEventListener("click", handleOutsideClick);
        closeButton == null ? void 0 : closeButton.removeEventListener("click", handleCloseClick);
      };
      dialog.addEventListener("close", handleDialogClose);
      dialog.addEventListener("click", handleOutsideClick);
      closeButton == null ? void 0 : closeButton.addEventListener("click", handleCloseClick);
    };
    function closeDialog(dialog) {
      dialog.classList.add("closing");
      setTimeout(() => dialog.close(), 400);
    }
    function isIOS() {
      return /iPad|iPhone|iPod/.test(navigator.userAgent) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
    }
    function isAndroid() {
      return /Android/.test(navigator.userAgent);
    }
    window.EXECUTED_SCRIPT.push("app-download-dialog");
  });
})();
}