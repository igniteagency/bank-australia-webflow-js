export function linkExternal() {
  // for all links having `data-external` attribute, add target="_blank" and rel="noopener noreferrer"
  document.querySelectorAll<HTMLAnchorElement>('a[data-external]').forEach((link) => {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  });
}
