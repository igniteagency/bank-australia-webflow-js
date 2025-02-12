/**
 * Helper function to load external scripts only once on a page and returns a promise
 * that resolves when the script has fully loaded and executed
 *
 * @param url URL of the script to load
 * @param placement 'head' or 'body'
 * @param defer boolean to indicate if the script should be deferred
 * @returns Promise that resolves when the script is loaded and executed
 */
export function loadExternalScript(
  url: string,
  placement: 'head' | 'body' = 'body',
  defer: boolean = true
): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if script already exists
    const existingScript = document.querySelector(`script[src="${url}"]`);
    if (existingScript) {
      // If script already exists, resolve immediately
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = url;
    if (defer) script.defer = true;

    // Set up load and error handlers
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${url}`));

    if (placement === 'head') {
      document.head.appendChild(script);
    } else if (placement === 'body') {
      document.body.appendChild(script);
    } else {
      reject(new Error('Invalid placement. Use "head" or "body".'));
    }
  });
}

// Assign the function to the window object
window.loadExternalScript = loadExternalScript;
