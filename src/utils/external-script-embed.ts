/**
 * Helper function to load external scripts only once on a page
 *
 * @param url URL of the script to load
 * @param placement 'head' or 'body'
 * @param defer boolean to indicate if the script should be deferred
 */
export function loadExternalScript(
  url: string,
  placement: 'head' | 'body' = 'body',
  defer: boolean = true
): void {
  if (document.querySelector(`script[src="${url}"]`)) {
    return;
  }

  const script = document.createElement('script');
  script.src = url;
  if (defer) script.defer = true;

  if (placement === 'head') {
    document.head.appendChild(script);
  } else if (placement === 'body') {
    document.body.appendChild(script);
  } else {
    console.error('Invalid placement. Use "head" or "body".');
    return;
  }
}

// Assign the function to the window object
window.loadExternalScript = loadExternalScript;
