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
    const questionHeadings = Array.from(faqContent.querySelectorAll("h2, h3"));
    console.log({ questionHeadings });
    const faqEntities = [];
    let i = 0;
    while (i < questionHeadings.length) {
      const heading = questionHeadings[i];
      if (heading.textContent?.includes("?")) {
        let answerHTML = "";
        let next = heading.nextSibling;
        const stopTag = heading.tagName;
        while (next && !(next.nodeType === 1 && next.tagName === stopTag)) {
          if (next.nodeType === 1) {
            const html = next.outerHTML;
            if (html && html.trim() !== "" && html.replace(/<[^>]+>/g, "").trim() !== "") {
              answerHTML += html + "\n";
            }
          } else if (next.nodeType === 3) {
            if (next.nodeValue && next.nodeValue.trim() !== "") {
              answerHTML += next.nodeValue;
            }
          }
          next = next.nextSibling;
        }
        answerHTML = answerHTML.trim();
        if (answerHTML) {
          faqEntities.push({
            "@type": "Question",
            name: heading.textContent.trim(),
            acceptedAnswer: {
              "@type": "Answer",
              text: answerHTML
            }
          });
        }
      }
      i++;
    }
    console.log({ faqEntities });
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
  document.addEventListener("DOMContentLoaded", () => {
    processInlineFAQSchema();
  });
})();
}