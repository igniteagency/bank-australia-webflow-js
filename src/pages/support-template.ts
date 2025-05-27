// Standalone function to process FAQ schema markup
function processInlineFAQSchema() {
  const CONTENT_SELECTOR = '[data-el="support-content"]';
  const faqContent = document.querySelector(CONTENT_SELECTOR);

  if (!faqContent) {
    console.error('No content rich text found', CONTENT_SELECTOR);
    return;
  }

  const h2s = Array.from(faqContent.querySelectorAll('h2'));
  const faqEntities = [];
  let i = 0;
  while (i < h2s.length) {
    const h2 = h2s[i];
    if (h2.textContent?.includes('?')) {
      // Collect all answer nodes (siblings after H2 until next H2)
      let answerText = '';
      let next = h2.nextSibling as HTMLElement | null;
      while (next && !(next.nodeType === 1 && next.tagName === 'H2')) {
        // If it's an element, get its textContent; if text node, get nodeValue
        if (next.nodeType === 1) {
          answerText += (next as HTMLElement).innerText + '\n';
        } else if (next.nodeType === 3) {
          answerText += next.nodeValue;
        }
        next = next.nextSibling as HTMLElement | null;
      }
      // Clean up whitespace
      answerText = answerText.trim();
      // Add to FAQ entities if answer is not empty
      if (answerText) {
        faqEntities.push({
          '@type': 'Question',
          name: h2.textContent.trim(),
          acceptedAnswer: {
            '@type': 'Answer',
            text: answerText,
          },
        });
      }
    }
    i++;
  }

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

document.addEventListener('DOMContentLoaded', processInlineFAQSchema);
