if (window.SCRIPTS_ENV === 'dev') {
  window.loadLocalScript('http://localhost:3000/components/dialog-modal.js');
} else {
  (() => {
  // src/components/dialog-modal.ts
  var DialogRouter = class {
    constructor() {
      this.handleHash();
      window.addEventListener("hashchange", () => this.handleHash());
      document.querySelectorAll("dialog").forEach((dialog) => {
        dialog.addEventListener("click", (e) => {
          if (e.target === dialog) this.closeDialog(dialog);
        });
        dialog.addEventListener("close", () => {
          if (dialog.id && location.hash === `#${dialog.id}`)
            history.pushState(null, "", location.pathname + location.search);
        });
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === "attributes" && mutation.attributeName === "open") {
              const target = mutation.target;
              if (target.tagName === "DIALOG" && target.hasAttribute("open") && target.id) {
                history.pushState(null, "", `${location.pathname}${location.search}#${target.id}`);
              }
            }
          });
        });
        observer.observe(dialog, { attributes: true, attributeFilter: ["open"] });
      });
      document.addEventListener("keydown", (e) => {
        const openDialog = document.querySelector("dialog[open]");
        if (e.key === "Escape" && openDialog && openDialog.id) {
          history.pushState(null, "", location.pathname + location.search);
        }
      });
    }
    handleHash() {
      const hash = location.hash.slice(1);
      document.querySelectorAll("dialog[open]").forEach((d) => d.close());
      if (hash) {
        const dialog = document.getElementById(hash);
        if (dialog?.tagName === "DIALOG") {
          dialog.showModal();
        }
      }
    }
    closeDialog(dialog) {
      dialog.close();
      if (dialog.id && location.hash === `#${dialog.id}`)
        history.pushState(null, "", location.pathname + location.search);
    }
  };
  new DialogRouter();
})();
}