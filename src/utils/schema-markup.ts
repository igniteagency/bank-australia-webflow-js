/*! Dynamic Schema Generator
 * This script finds all elements with data-el="schema-markup"
 * and creates complete schema markup including the script tag
 */
document.addEventListener('alpine:initialized', () => {
  if (window.EXECUTED_SCRIPT.includes('schema-markup')) {
    console.debug('Schema markup script already executed');
    return;
  }

  // Find all schema placeholder elements
  const schemaElements = document.querySelectorAll('[data-el="schema-markup-slot"] > .w-embed');

  // Process each schema element
  schemaElements.forEach((element) => {
    // Get the schema template from the element's content
    const schemaTemplate = element.innerHTML.trim();

    // If empty, don't proceed
    if (!schemaTemplate) {
      console.error('Schema template is empty', { element });
      return;
    }

    // Create a new object to hold all data attributes
    const dataAttributes: Record<string, string> = {};

    // Collect all data attributes from the element
    Array.from(element.attributes)
      .filter((attr) => attr.name.startsWith('data-schema-'))
      .forEach((attr) => {
        // Extract name without the "data-schema-" prefix and store in lowercase
        const name = attr.name.replace('data-schema-', '').toLowerCase();
        dataAttributes[name] = attr.value;
      });

    // Replace placeholders in the template
    let schemaContent = schemaTemplate;

    // Find all placeholders in the format {{name}}
    const placeholders = schemaTemplate.match(/\{\{([^}]+)\}\}/g) || [];

    // Replace only placeholders that have matching data attributes, leaving others unchanged
    placeholders.forEach((placeholder) => {
      // Extract name without braces (e.g., "name" from "{{name}}") and convert to lowercase
      const placeholderName = placeholder.replace(/\{\{|\}\}/g, '').toLowerCase();

      // Replace only if a corresponding data attribute exists, otherwise leave placeholder as is
      if (dataAttributes[placeholderName]) {
        schemaContent = schemaContent.replace(placeholder, dataAttributes[placeholderName]);
      }
    });

    // Create a complete script element with the processed content
    const scriptTag = document.createElement('script');
    scriptTag.type = 'application/ld+json';
    scriptTag.textContent = schemaContent;

    // Insert the script tag into the document
    document.head.appendChild(scriptTag);

    // remove the original element after processing
    element.remove();
  });
  window.EXECUTED_SCRIPT.push('schema-markup');
});
