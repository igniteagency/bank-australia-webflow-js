window.Webflow = window.Webflow || [];
window.Webflow.push(() => {
  if (window.EXECUTED_SCRIPT.includes('app-download-dialog')) {
    console.debug('App download dialog script already executed');
    return;
  }

  const DIALOG_COMPONENT_SELECTOR = '[data-el="app-download-dialog-component"]';

  // Function to handle dialog opening
  const handleDialogOpen = (component: Element) => {
    const dialog = component.querySelector<HTMLDialogElement>('dialog');
    if (!dialog) {
      console.error('No dialog element found in the component');
      return;
    }

    dialog.showModal();

    // Add click event listener to close dialog when clicking outside
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) {
        dialog.close();
      }
    });
  };

  // Find all dialog components
  const dialogComponents = document.querySelectorAll(DIALOG_COMPONENT_SELECTOR);

  // Add click listeners to each component's links
  dialogComponents.forEach((component) => {
    const links = component.querySelectorAll('a');

    links.forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        handleDialogOpen(component);
      });
    });
  });

  window.EXECUTED_SCRIPT.push('app-download-dialog');
});
