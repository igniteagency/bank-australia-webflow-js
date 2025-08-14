class DialogRouter {
  constructor() {
    this.handleHash();
    window.addEventListener('hashchange', () => this.handleHash());

    // Setup backdrop clicks and escape key for all dialogs
    document.querySelectorAll<HTMLDialogElement>('dialog').forEach((dialog) => {
      dialog.addEventListener('click', (e) => {
        if (e.target === dialog) this.closeDialog(dialog);
      });
      dialog.addEventListener('close', () => {
        if (dialog.id && location.hash === `#${dialog.id}`)
          history.pushState(null, '', location.pathname + location.search);
      });

      // Add hash to URL when dialog opens
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'open') {
            const target = mutation.target as HTMLDialogElement;
            if (target.tagName === 'DIALOG' && target.hasAttribute('open') && target.id) {
              history.pushState(null, '', `${location.pathname}${location.search}#${target.id}`);
            }
          }
        });
      });
      observer.observe(dialog, { attributes: true, attributeFilter: ['open'] });
    });

    document.addEventListener('keydown', (e) => {
      const openDialog = document.querySelector('dialog[open]') as HTMLDialogElement;
      if (e.key === 'Escape' && openDialog && openDialog.id) {
        history.pushState(null, '', location.pathname + location.search);
      }
    });
  }

  handleHash() {
    const hash = location.hash.slice(1);
    document.querySelectorAll<HTMLDialogElement>('dialog[open]').forEach((d) => d.close());

    if (hash) {
      const dialog = document.getElementById(hash);
      if (dialog?.tagName === 'DIALOG') {
        (dialog as HTMLDialogElement).showModal();
      }
    }
  }

  closeDialog(dialog: HTMLDialogElement) {
    dialog.close();
    if (dialog.id && location.hash === `#${dialog.id}`)
      history.pushState(null, '', location.pathname + location.search);
  }
}

new DialogRouter();
