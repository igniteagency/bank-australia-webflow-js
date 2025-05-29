if (window.SCRIPTS_ENV === 'dev') {
  window.loadLocalScript('http://localhost:3000/pages/support-template.js');
} else {
  (() => {
  // src/pages/support-template.ts
  function processInlineFAQSchema() {
    const CONTENT_SELECTOR = '[data-el="support-content"]';
    const faqContent = document.querySelector(CONTENT_SELECTOR);
    if (!faqContent) {
      console.error("No content rich text found", CONTENT_SELECTOR);
      return;
    }
    const h2s = Array.from(faqContent.querySelectorAll("h2"));
    const faqEntities = [];
    let i = 0;
    while (i < h2s.length) {
      const h2 = h2s[i];
      if (h2.textContent?.includes("?")) {
        let answerText = "";
        let next = h2.nextSibling;
        while (next && !(next.nodeType === 1 && next.tagName === "H2")) {
          if (next.nodeType === 1) {
            answerText += next.innerText + "\n";
          } else if (next.nodeType === 3) {
            answerText += next.nodeValue;
          }
          next = next.nextSibling;
        }
        answerText = answerText.trim();
        if (answerText) {
          faqEntities.push({
            "@type": "Question",
            name: h2.textContent.trim(),
            acceptedAnswer: {
              "@type": "Answer",
              text: answerText
            }
          });
        }
      }
      i++;
    }
    if (faqEntities.length > 0) {
      const schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqEntities
      };
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.text = JSON.stringify(schema, null, 2);
      document.head.appendChild(script);
    }
  }
  window.Webflow = window.Webflow || [];
  window.Webflow.push(() => {
    processInlineFAQSchema();
  });
})();
}