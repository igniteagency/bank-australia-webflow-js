window.Webflow = window.Webflow || [];
window.Webflow.push(() => {
  if (window.EXECUTED_SCRIPT.includes('global-nav')) {
    console.debug('Global nav script already executed');
    return;
  }

  const chevronIcon = `<svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true"><path fill="currentColor" d="M5.293 9.707l6 6c0.391 0.391 1.024 0.391 1.414 0l6-6c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-5.293 5.293-5.293-5.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414z"></path></svg>`;
  const arrowIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 26 12" width="1.5em" height="1em" aria-hidden="true"><path fill="currentColor" d="M25 6.75a.75.75 0 0 0 0-1.5v1.5ZM.47 5.47a.75.75 0 0 0 0 1.06l4.773 4.773a.75.75 0 1 0 1.06-1.06L2.061 6l4.242-4.243a.75.75 0 0 0-1.06-1.06L.47 5.47ZM25 5.25H1v1.5h24v-1.5Z"></path></svg>`;

  // Element selectors
  const nav = document.querySelector('#main-nav');
  const navButton = document.querySelector<HTMLButtonElement>('#nav-toggle');
  const navCloseButton = document.querySelector<HTMLButtonElement>('#nav-close-button');
  const navContent = document.querySelector('#nav-content');
  const searchLinkText = document.querySelector('#search-link > div');
  const mobileLogInLink = document.querySelector('#mobile-log-in-link');
  const mobileJoinLink = document.querySelector('#mobile-join-link');
  const desktopMediaQuery = window.matchMedia('(min-width: 992px)');
  const header = document.querySelector('#main-header');
  const headerSiblings = header?.parentElement
    ? Array.from(header.parentElement.children).filter((el) => el !== header)
    : [];
  const navSiblings = nav?.parentElement
    ? Array.from(nav.parentElement.children).filter((el) => el !== nav)
    : [];
  const levelOneListItems = document.querySelectorAll<HTMLLIElement>(`[data-level="one"] > li`);
  const navContentTopLevelElements = document.querySelectorAll(
    `.nav-content > *:not(ul, [data-has-nav-close-button])`
  );
  const listItemsWithChildren = document.querySelectorAll<HTMLLIElement>('li[data-has-children]');
  const disclosureWidgetPanels = document.querySelectorAll<HTMLUListElement>(
    'li[data-has-children] > ul'
  );

  let navIsShown = false;

  function focusIsInside(element: HTMLElement): boolean {
    return element.contains(document.activeElement);
  }

  function makePageInert(): void {
    headerSiblings.forEach((headerSibling) => {
      headerSibling.setAttribute('inert', '');
    });
    navSiblings.forEach((navSibling) => {
      navSibling.setAttribute('inert', '');

      if (!desktopMediaQuery.matches) {
        navSibling.setAttribute('hidden', '');
      }
    });
  }

  function removePageInert(): void {
    headerSiblings.forEach((headerSibling) => {
      headerSibling.removeAttribute('inert');
    });
    navSiblings.forEach((navSibling) => {
      navSibling.removeAttribute('inert');
      navSibling.removeAttribute('hidden');
    });
  }

  function makeNavContentInert(): void {
    navContent?.setAttribute('inert', '');
  }

  function removeNavContentInert(): void {
    navContent?.removeAttribute('inert');
  }

  function makeNavLevelOneItemsInert(): void {
    navContentTopLevelElements.forEach((topLevelNavContentItem) => {
      topLevelNavContentItem.setAttribute('inert', '');
    });

    levelOneListItems.forEach((levelOneItem) => {
      if (
        levelOneItem.children[0] instanceof HTMLElement &&
        levelOneItem.children[0].getAttribute('aria-expanded') !== 'true'
      ) {
        levelOneItem.setAttribute('inert', '');
      }
    });
  }

  function removeNavLevelOneItemsInert(): void {
    navContentTopLevelElements.forEach((topLevelNavContentItem) => {
      topLevelNavContentItem.removeAttribute('inert');
    });

    levelOneListItems.forEach((levelOneItem) => {
      if (
        levelOneItem.children[0] instanceof HTMLElement &&
        levelOneItem.children[0].getAttribute('aria-expanded') !== 'true'
      ) {
        levelOneItem.removeAttribute('inert');
      }
    });
  }

  function closeNavContentWhenFocusLeaves(navContentElement: HTMLElement): void {
    document.addEventListener('focusin', () => {
      if (
        navIsShown &&
        !focusIsInside(navContentElement) &&
        navButton &&
        !focusIsInside(navButton)
      ) {
        hideNavContent();
      }
    });

    navContentElement.addEventListener('keydown', (event: KeyboardEvent) => {
      if (navIsShown && event.key === 'Escape' && navButton) {
        hideNavContent();
        navButton.focus();
      }
    });
  }

  function toggleDisclosureWidget(
    disclosureWidgetButton: HTMLButtonElement,
    disclosureWidgetPanel: HTMLUListElement
  ): void {
    if (disclosureWidgetButton.getAttribute('aria-expanded') === 'true') {
      disclosureWidgetButton.setAttribute('aria-expanded', 'false');
      disclosureWidgetPanel.setAttribute('hidden', '');

      if (disclosureWidgetPanel.parentElement?.parentElement?.dataset.level === 'one') {
        if (desktopMediaQuery.matches) {
          removePageInert();
        } else {
          removeNavLevelOneItemsInert();
          disclosureWidgetButton.parentElement.dataset.hasChildAriaExpanded = 'false';
        }
      }
    } else {
      disclosureWidgetButton.setAttribute('aria-expanded', 'true');
      disclosureWidgetPanel.removeAttribute('hidden');

      if (disclosureWidgetPanel.parentElement?.parentElement?.dataset.level === 'one') {
        if (desktopMediaQuery.matches) {
          makePageInert();
        } else {
          makeNavLevelOneItemsInert();
          disclosureWidgetButton.parentElement.dataset.hasChildAriaExpanded = 'true';
        }
      }
    }
  }

  function collapseDisclosureWidgetsWhenClickingOutsideNav(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    // Close mobile menu when clicking outside nav
    if (
      !desktopMediaQuery.matches &&
      navContent &&
      !navContent.contains(target) &&
      !navButton?.contains(target)
    ) {
      hideNavContent();
    }

    disclosureWidgetPanels.forEach((disclosureWidgetPanel) => {
      const parentNode = disclosureWidgetPanel.parentElement;
      if (parentNode && !parentNode.contains(target)) {
        const disclosureWidgetButton = parentNode.querySelector<HTMLButtonElement>('button');

        if (
          disclosureWidgetButton &&
          disclosureWidgetButton.getAttribute('aria-expanded') === 'true'
        ) {
          toggleDisclosureWidget(disclosureWidgetButton, disclosureWidgetPanel);
        }
      }
    });
  }

  function collapseDisclosureWidgetsWhenPressingEscape(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      disclosureWidgetPanels.forEach((disclosureWidgetPanel) => {
        const parentNode = disclosureWidgetPanel.parentElement;
        if (parentNode) {
          const disclosureWidgetButton = parentNode.querySelector<HTMLButtonElement>('button');

          if (
            disclosureWidgetButton &&
            disclosureWidgetButton.getAttribute('aria-expanded') === 'true'
          ) {
            toggleDisclosureWidget(disclosureWidgetButton, disclosureWidgetPanel);
            disclosureWidgetButton.focus();
          }
        }
      });
    }
  }

  function collapseDisclosureWidgetsWhenTabbingOutside(): void {
    disclosureWidgetPanels.forEach((disclosureWidgetPanel) => {
      const parentNode = disclosureWidgetPanel.parentElement;
      if (parentNode && !focusIsInside(parentNode)) {
        const disclosureWidgetButton = parentNode.querySelector<HTMLButtonElement>('button');

        if (
          disclosureWidgetButton &&
          disclosureWidgetButton.getAttribute('aria-expanded') === 'true'
        ) {
          toggleDisclosureWidget(disclosureWidgetButton, disclosureWidgetPanel);
        }
      }
    });
  }

  function showNavContent(): void {
    if (!navButton || !navContent || !header || !navCloseButton) return;

    navButton.setAttribute('aria-expanded', 'true');
    navContent.setAttribute('data-open', 'true');
    header.style.position = 'sticky';
    navIsShown = true;
    removeNavContentInert();
    makePageInert();
    closeNavContentWhenFocusLeaves(navContent);
    navCloseButton.focus();
  }

  function hideNavContent(): void {
    if (!navButton || !navContent || !header) return;

    navButton.setAttribute('aria-expanded', 'false');
    navContent.setAttribute('data-open', 'false');
    header.style.position = '';

    disclosureWidgetPanels.forEach((disclosureWidgetPanel) => {
      const parentNode = disclosureWidgetPanel.parentElement;
      if (parentNode) {
        const disclosureWidgetButton = parentNode.querySelector<HTMLButtonElement>('button');

        if (
          disclosureWidgetButton &&
          disclosureWidgetButton.getAttribute('aria-expanded') === 'true'
        ) {
          toggleDisclosureWidget(disclosureWidgetButton, disclosureWidgetPanel);
        }
      }
    });

    navIsShown = false;
    makeNavContentInert();
    removePageInert();
  }

  function navButtonOnClick(): void {
    if (navIsShown) {
      hideNavContent();
    } else {
      showNavContent();
    }
  }

  function disclosureWidgetButtonOnClick(event: MouseEvent): void {
    const button = event.currentTarget as HTMLButtonElement;
    const panel = button.nextElementSibling as HTMLUListElement;
    if (button && panel) {
      toggleDisclosureWidget(button, panel);
    }
  }

  function initialiseDisclosureWidgets(): void {
    listItemsWithChildren.forEach((listItem, index) => {
      let disclosureWidgetDivOrLink = listItem.querySelector<HTMLElement>(
        ':scope > div:not(.nav-footer-line), :scope > a'
      );
      let disclosureWidgetButton = listItem.querySelector<HTMLButtonElement>(':scope > button');
      const disclosureWidgetPanel = listItem.querySelector<HTMLUListElement>(':scope > ul');

      if (!disclosureWidgetPanel) return;

      // If the button already exists this function has already been run so we want to remove the event listener so we don't double up
      if (disclosureWidgetButton) {
        disclosureWidgetButton.removeEventListener('click', disclosureWidgetButtonOnClick);
      }

      // If we're on desktop and it's a level two list item and it has the div or link then we don't want to turn it into a button
      if (
        desktopMediaQuery.matches &&
        listItem.parentElement?.dataset.level === 'two' &&
        disclosureWidgetDivOrLink
      ) {
        return;
      }

      // If we've made it to this point then we want to create the opposite of what we've already got (div/link or button)
      if (disclosureWidgetDivOrLink) {
        disclosureWidgetButton = document.createElement('button');
      } else {
        if (listItem.classList.contains('nav-footer')) {
          disclosureWidgetDivOrLink = document.createElement('div');
        } else {
          disclosureWidgetDivOrLink = document.createElement('a');
        }
      }

      const disclosureWidgetText =
        (disclosureWidgetDivOrLink?.innerText || disclosureWidgetButton?.innerText) ?? '';

      // On desktop just use the text
      if (desktopMediaQuery.matches) {
        if (listItem.parentElement?.dataset.level === 'one' && disclosureWidgetButton) {
          disclosureWidgetButton.innerHTML = disclosureWidgetText;
        }
        if (listItem.parentElement?.dataset.level === 'two' && disclosureWidgetDivOrLink) {
          disclosureWidgetDivOrLink.innerHTML = disclosureWidgetText;
        }
      } else {
        // On mobile use the text as well as the icons
        if (listItem.parentElement?.dataset.level === 'one' && disclosureWidgetButton) {
          disclosureWidgetButton.innerHTML = arrowIcon + disclosureWidgetText + arrowIcon;
        }
        if (listItem.parentElement?.dataset.level === 'two' && disclosureWidgetButton) {
          disclosureWidgetButton.innerHTML = disclosureWidgetText + chevronIcon;
        }
      }

      // If it's mobile or it's desktop and a level one list item setup disclosure widget
      if (
        !desktopMediaQuery.matches ||
        (desktopMediaQuery.matches && listItem.parentElement?.dataset.level === 'one')
      ) {
        if (disclosureWidgetButton) {
          disclosureWidgetButton.setAttribute('aria-expanded', 'false');
          if (disclosureWidgetButton.parentElement?.dataset) {
            disclosureWidgetButton.parentElement.dataset.hasChildAriaExpanded = 'false';
          }
          disclosureWidgetButton.setAttribute('aria-controls', `nav__ul-${index}`);
          disclosureWidgetPanel.setAttribute('id', `nav__ul-${index}`);
          disclosureWidgetPanel.setAttribute('hidden', '');
          if (disclosureWidgetDivOrLink) {
            disclosureWidgetDivOrLink.replaceWith(disclosureWidgetButton);
          }
          disclosureWidgetButton.addEventListener('click', disclosureWidgetButtonOnClick);
        }
      } else {
        // Otherwise remove the things that are needed to make the disclosure widget interactive
        disclosureWidgetPanel.removeAttribute('id');
        disclosureWidgetPanel.removeAttribute('hidden');
        if (disclosureWidgetButton && disclosureWidgetDivOrLink) {
          disclosureWidgetButton.replaceWith(disclosureWidgetDivOrLink);
        }
      }
    });
  }

  function handleMediaQueryChange(event: MediaQueryListEvent | MediaQueryList): void {
    initialiseDisclosureWidgets();

    if (event.matches) {
      navContent?.removeAttribute('hidden');
      navButton?.setAttribute('hidden', '');
      navCloseButton?.setAttribute('hidden', '');
      searchLinkText?.classList.add('visually-hidden');
      mobileLogInLink?.setAttribute('hidden', '');
      mobileJoinLink?.setAttribute('hidden', '');
      navContent?.removeAttribute('role');
      navContent?.removeAttribute('aria-labelledby');

      hideNavContent();
      removeNavLevelOneItemsInert();
      removeNavContentInert();
      removePageInert();

      navButton?.removeEventListener('click', navButtonOnClick);
    } else {
      navButton?.removeAttribute('hidden');
      navCloseButton?.removeAttribute('hidden');
      searchLinkText?.classList.remove('visually-hidden');
      mobileLogInLink?.removeAttribute('hidden');
      mobileJoinLink?.removeAttribute('hidden');
      navContent?.setAttribute('role', 'group');
      navContent?.setAttribute('aria-labelledby', 'nav-toggle');

      if (navIsShown) {
        removeNavContentInert();
      } else {
        makeNavContentInert();
      }

      navButton?.addEventListener('click', navButtonOnClick);
    }
  }

  // Initialize
  document.documentElement.style.setProperty(
    '--scrollbar-width',
    `${window.innerWidth - document.body.clientWidth}px`
  );

  if (navContent && nav) {
    navContent.style.transition = 'none';
    nav.classList.add('enhanced');
  }

  navCloseButton?.addEventListener('click', () => {
    hideNavContent();
    navButton?.focus();
  });

  document.addEventListener('keydown', collapseDisclosureWidgetsWhenPressingEscape);
  document.addEventListener('focusin', collapseDisclosureWidgetsWhenTabbingOutside);
  window.addEventListener('click', collapseDisclosureWidgetsWhenClickingOutsideNav);
  desktopMediaQuery.addEventListener('change', handleMediaQueryChange);
  handleMediaQueryChange(desktopMediaQuery);

  setTimeout(() => {
    navContent?.style.removeProperty('transition');
  }, 0); // The 0ms timeout stops the transitions from running on page load.

  window.EXECUTED_SCRIPT.push('global-nav');
});
