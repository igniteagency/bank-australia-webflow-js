class DialogRouter {
  constructor() {
    this.handleHash();
    window.addEventListener('hashchange', () => this.handleHash());

    // Setup backdrop clicks and escape key for all dialogs
    document.querySelectorAll('dialog').forEach((dialog) => {
      dialog.addEventListener('click', (e) => {
        if (e.target === dialog) this.closeDialog(dialog);
      });
      dialog.addEventListener('close', () => {
        if (location.hash === `#${dialog.id}`) history.pushState(null, null, '#');
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.querySelector('dialog[open]')) {
        history.pushState(null, null, '#');
      }
    });
  }

  handleHash() {
    const hash = location.hash.slice(1);
    document.querySelectorAll('dialog[open]').forEach((d) => d.close());

    if (hash) {
      const dialog = document.getElementById(hash);
      if (dialog?.tagName === 'DIALOG') (dialog as HTMLDialogElement).showModal();
    }
  }

  closeDialog(dialog) {
    dialog.close();
    if (location.hash === `#${dialog.id}`) history.pushState(null, null, '#');
  }
}

new DialogRouter();
