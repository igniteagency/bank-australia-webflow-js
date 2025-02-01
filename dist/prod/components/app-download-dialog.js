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
    const handleDialogOpen = (component) => {
      const dialog = component.querySelector("dialog");
      if (!dialog) {
        console.error("No dialog element found in the component");
        return;
      }
      dialog.showModal();
      dialog.addEventListener("click", (event) => {
        const rect = dialog.getBoundingClientRect();
        const isInDialog = rect.top <= event.clientY && event.clientY <= rect.top + rect.height && rect.left <= event.clientX && event.clientX <= rect.left + rect.width;
        if (!isInDialog) {
          dialog.close();
        }
      });
    };
    const dialogComponents = document.querySelectorAll(DIALOG_COMPONENT_SELECTOR);
    dialogComponents.forEach((component) => {
      const links = component.querySelectorAll("a");
      links.forEach((link) => {
        link.addEventListener("click", (event) => {
          event.preventDefault();
          handleDialogOpen(component);
        });
      });
    });
    window.EXECUTED_SCRIPT.push("app-download-dialog");
  });
})();
}