if (window.SCRIPTS_ENV === 'dev') {
  window.loadLocalScript('http://localhost:3000/utils/schema-markup.js');
} else {
  (() => {
  // src/utils/schema-markup.ts
  /*! Dynamic Schema Generator
   * This script finds all elements with data-el="schema-markup"
   * and creates complete schema markup including the script tag
   */
  document.addEventListener("alpine:initialized", () => {
    if (window.EXECUTED_SCRIPT.includes("schema-markup")) {
      console.debug("Schema markup script already executed");
      return;
    }
    const schemaElements = document.querySelectorAll('[data-el="schema-markup-slot"] > .w-embed');
    schemaElements.forEach((element) => {
      const schemaTemplate = element.innerHTML.trim();
      if (!schemaTemplate) {
        console.error("Schema template is empty", { element });
        return;
      }
      const dataAttributes = {};
      Array.from(element.attributes).filter((attr) => attr.name.startsWith("data-schema-")).forEach((attr) => {
        const name = attr.name.replace("data-schema-", "").toLowerCase();
        dataAttributes[name] = attr.value;
      });
      let schemaContent = schemaTemplate;
      const placeholders = schemaTemplate.match(/\{\{([^}]+)\}\}/g) || [];
      placeholders.forEach((placeholder) => {
        const placeholderName = placeholder.replace(/\{\{|\}\}/g, "").toLowerCase();
        if (dataAttributes[placeholderName]) {
          schemaContent = schemaContent.replace(placeholder, dataAttributes[placeholderName]);
        }
      });
      const scriptTag = document.createElement("script");
      scriptTag.type = "application/ld+json";
      scriptTag.textContent = schemaContent;
      document.head.appendChild(scriptTag);
      element.remove();
    });
    window.EXECUTED_SCRIPT.push("schema-markup");
  });
})();
}