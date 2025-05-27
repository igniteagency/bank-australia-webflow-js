// Standalone function to process FAQ schema markup
function processInlineFAQSchema() {
  const CONTENT_SELECTOR = '[data-el="support-content"]';
  const faqContent = document.querySelector(CONTENT_SELECTOR);

  if (!faqContent) {
    console.error('No content rich text found', CONTENT_SELECTOR);
    return;
  }

  const h2s = Array.from(faqContent.querySelectorAll('h2'));
  let i = 0;
  while (i < h2s.length) {
    const h2 = h2s[i];
    if (h2.textContent?.includes('?')) {
      // This is a question H2
      // Create the schema wrapper for Question
      const questionWrapper = document.createElement('div');
      questionWrapper.setAttribute('itemscope', '');
      questionWrapper.setAttribute('itemprop', 'mainEntity');
      questionWrapper.setAttribute('itemtype', 'https://schema.org/Question');

      // Set schema on H2
      h2.setAttribute('itemprop', 'name');

      // Create the Answer wrapper
      const answerWrapper = document.createElement('div');
      answerWrapper.setAttribute('itemscope', '');
      answerWrapper.setAttribute('itemprop', 'acceptedAnswer');
      answerWrapper.setAttribute('itemtype', 'https://schema.org/Answer');

      // Create the text wrapper for the answer
      const answerText = document.createElement('div');
      answerText.setAttribute('itemprop', 'text');

      // Collect all answer nodes (siblings after H2 until next heading)
      let answerNodes: Node[] = [];
      let next = h2.nextSibling as HTMLElement;
      while (next && !(next.nodeType === 1 && next.tagName === 'H2')) {
        const current = next;
        next = next.nextSibling as HTMLElement;
        answerNodes.push(current);
      }

      // Insert the questionWrapper before moving nodes
      faqContent.insertBefore(questionWrapper, h2);

      // Move h2 into questionWrapper
      questionWrapper.appendChild(h2);

      // Move answer nodes into answerText
      answerNodes.forEach((node) => {
        answerText.appendChild(node);
      });

      // Assemble the wrappers
      answerWrapper.appendChild(answerText);
      questionWrapper.appendChild(answerWrapper);
    }
    i++;
  }
}

document.addEventListener('DOMContentLoaded', processInlineFAQSchema);
