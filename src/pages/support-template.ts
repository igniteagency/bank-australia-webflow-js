// Standalone function to process FAQ schema markup
function processInlineFAQSchema() {
  const CONTENT_SELECTOR = '[data-el="support-content"]';
  const faqContent = document.querySelector(CONTENT_SELECTOR);

  if (!faqContent) {
    console.error('No content rich text found', CONTENT_SELECTOR);
    return;
  }

  // Select both H2 and H3 as questions
  const questionHeadings = Array.from(faqContent.querySelectorAll('h2, h3'));
  console.log({ questionHeadings });
  const faqEntities = [];
  let i = 0;
  while (i < questionHeadings.length) {
    const heading = questionHeadings[i];
    if (heading.textContent?.includes('?')) {
      // Collect all answer nodes (siblings after heading until next heading of the same level)
      let answerHTML = '';
      let next = heading.nextSibling as HTMLElement | null;
      const stopTag = heading.tagName; // 'H2' or 'H3'
      while (next && !(next.nodeType === 1 && (next as HTMLElement).tagName === stopTag)) {
        if (next.nodeType === 1) {
          // If it's an element, only add if outerHTML is not empty or whitespace
          const html = (next as HTMLElement).outerHTML;
          if (html && html.trim() !== '' && html.replace(/<[^>]+>/g, '').trim() !== '') {
            answerHTML += html + '\n';
          }
        } else if (next.nodeType === 3) {
          // if text node, get nodeValue
          if (next.nodeValue && next.nodeValue.trim() !== '') {
            answerHTML += next.nodeValue;
          }
        }
        next = next.nextSibling as HTMLElement | null;
      }
      // Clean up whitespace
      answerHTML = answerHTML.trim();
      // Add to FAQ entities if answer is not empty
      if (answerHTML) {
        faqEntities.push({
          '@type': 'Question',
          name: heading.textContent.trim(),
          acceptedAnswer: {
            '@type': 'Answer',
            text: answerHTML,
          },
        });
      }
    }
    i++;
  }

  console.log({ faqEntities });

  if (faqEntities.length > 0) {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqEntities,
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema, null, 2);
    document.head.appendChild(script);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  processInlineFAQSchema();
});
