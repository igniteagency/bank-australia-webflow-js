window.Webflow = window.Webflow || [];
window.Webflow.push(() => {
  if (window.EXECUTED_SCRIPT.includes('app-download-dialog')) {
    console.debug('App download dialog script already executed');
    return;
  }

  const DIALOG_COMPONENT_SELECTOR = '[data-el="app-download-dialog-component"]';
  const DIALOG_CLOSE_SELECTOR = '[data-el="app-download-dialog-close"]';

  // Find all dialog components
  const dialogComponents = document.querySelectorAll(DIALOG_COMPONENT_SELECTOR);

  // Add click listeners to each component's links
  dialogComponents.forEach((componentEl) => {
    const links = componentEl.querySelectorAll<HTMLAnchorElement>('a');

    links.forEach((link) => {
      // Check if we're on a mobile device
      if (isIOS() || isAndroid()) {
        const downloadLink = isIOS()
          ? componentEl.getAttribute('data-ios-download-link')
          : componentEl.getAttribute('data-android-download-link');

        if (downloadLink) {
          link.href = downloadLink;
          return; // Let the default link click behavior happen
        }
      } else {
        link.addEventListener('click', (event) => {
          handleDialogOpen(componentEl, event);
        });
      }
    });
  });

  // Function to handle dialog opening or direct link navigation
  const handleDialogOpen = (componentEl: Element, event: Event) => {
    // Prevent default only for non-mobile (when we want to show dialog)
    event.preventDefault();

    const dialog = componentEl.querySelector<HTMLDialogElement>('dialog');
    if (!dialog) {
      console.error('No dialog element found in the component');
      return;
    }

    const closeButton = componentEl.querySelector<HTMLButtonElement>(DIALOG_CLOSE_SELECTOR);

    dialog.showModal();

    // Handler for clicking outside dialog
    const handleOutsideClick = (event: Event) => {
      if (event.target === dialog) {
        closeDialog(dialog);
      }
    };

    // Handler for close button
    const handleCloseClick = () => {
      closeDialog(dialog);
    };

    // Handler for cleanup after close
    const handleDialogClose = () => {
      dialog.classList.remove('closing');
      // Clean up all event listeners
      dialog.removeEventListener('close', handleDialogClose);
      dialog.removeEventListener('click', handleOutsideClick);
      closeButton?.removeEventListener('click', handleCloseClick);
    };

    // Add dialog closing listeners
    dialog.addEventListener('close', handleDialogClose);
    dialog.addEventListener('click', handleOutsideClick);
    closeButton?.addEventListener('click', handleCloseClick);
  };

  function closeDialog(dialog: HTMLDialogElement) {
    dialog.classList.add('closing');
    // Wait for animation
    setTimeout(() => dialog.close(), 400);
  }

  // Function to detect iOS devices
  function isIOS() {
    return (
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    );
  }

  // Function to detect Android devices
  function isAndroid() {
    return /Android/.test(navigator.userAgent);
  }

  window.EXECUTED_SCRIPT.push('app-download-dialog');
});
