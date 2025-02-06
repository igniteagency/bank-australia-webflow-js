// components/nav.js
if (window.SCRIPTS_ENV === 'dev') {
  window.loadLocalScript('http://localhost:3000/components/nav.js');
} else {
  (() => {
  // src/components/nav.ts
  window.Webflow = window.Webflow || [];
  window.Webflow.push(() => {
    if (window.EXECUTED_SCRIPT.includes("global-nav")) {
      console.debug("Global nav script already executed");
      return;
    }
    const chevronIcon = `<svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true"><path fill="currentColor" d="M5.293 9.707l6 6c0.391 0.391 1.024 0.391 1.414 0l6-6c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-5.293 5.293-5.293-5.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414z"></path></svg>`;
    const arrowIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 26 12" width="1.5em" height="1em" aria-hidden="true"><path fill="currentColor" d="M25 6.75a.75.75 0 0 0 0-1.5v1.5ZM.47 5.47a.75.75 0 0 0 0 1.06l4.773 4.773a.75.75 0 1 0 1.06-1.06L2.061 6l4.242-4.243a.75.75 0 0 0-1.06-1.06L.47 5.47ZM25 5.25H1v1.5h24v-1.5Z"></path></svg>`;
    const nav = document.querySelector("#main-nav");
    const navButton = document.querySelector("#nav-toggle");
    const navCloseButton = document.querySelector("#nav-close-button");
    const navContent = document.querySelector("#nav-content");
    const searchLinkText = document.querySelector("#search-link > div");
    const mobileLogInLink = document.querySelector("#mobile-log-in-link");
    const mobileJoinLink = document.querySelector("#mobile-join-link");
    const desktopMediaQuery = window.matchMedia("(min-width: 992px)");
    const header = document.querySelector("#main-header");
    const headerSiblings = (header == null ? void 0 : header.parentElement) ? Array.from(header.parentElement.children).filter((el) => el !== header) : [];
    const navSiblings = (nav == null ? void 0 : nav.parentElement) ? Array.from(nav.parentElement.children).filter((el) => el !== nav) : [];
    const levelOneListItems = document.querySelectorAll(`[data-level="one"] > li`);
    const navContentTopLevelElements = document.querySelectorAll(
      `.nav-content > *:not(ul, [data-has-nav-close-button])`
    );
    const listItemsWithChildren = document.querySelectorAll("li[data-has-children]");
    const disclosureWidgetPanels = document.querySelectorAll(
      "li[data-has-children] > ul"
    );
    let navIsShown = false;
    function focusIsInside(element) {
      return element.contains(document.activeElement);
    }
    function makePageInert() {
      headerSiblings.forEach((headerSibling) => {
        headerSibling.setAttribute("inert", "");
      });
      navSiblings.forEach((navSibling) => {
        navSibling.setAttribute("inert", "");
        if (!desktopMediaQuery.matches) {
          navSibling.setAttribute("hidden", "");
        }
      });
    }
    function removePageInert() {
      headerSiblings.forEach((headerSibling) => {
        headerSibling.removeAttribute("inert");
      });
      navSiblings.forEach((navSibling) => {
        navSibling.removeAttribute("inert");
        navSibling.removeAttribute("hidden");
      });
    }
    function makeNavContentInert() {
      navContent == null ? void 0 : navContent.setAttribute("inert", "");
    }
    function removeNavContentInert() {
      navContent == null ? void 0 : navContent.removeAttribute("inert");
    }
    function makeNavLevelOneItemsInert() {
      navContentTopLevelElements.forEach((topLevelNavContentItem) => {
        topLevelNavContentItem.setAttribute("inert", "");
      });
      levelOneListItems.forEach((levelOneItem) => {
        if (levelOneItem.children[0] instanceof HTMLElement && levelOneItem.children[0].getAttribute("aria-expanded") !== "true") {
          levelOneItem.setAttribute("inert", "");
        }
      });
    }
    function removeNavLevelOneItemsInert() {
      navContentTopLevelElements.forEach((topLevelNavContentItem) => {
        topLevelNavContentItem.removeAttribute("inert");
      });
      levelOneListItems.forEach((levelOneItem) => {
        if (levelOneItem.children[0] instanceof HTMLElement && levelOneItem.children[0].getAttribute("aria-expanded") !== "true") {
          levelOneItem.removeAttribute("inert");
        }
      });
    }
    function closeNavContentWhenFocusLeaves(navContentElement) {
      document.addEventListener("focusin", () => {
        if (navIsShown && !focusIsInside(navContentElement) && navButton && !focusIsInside(navButton)) {
          hideNavContent();
        }
      });
      navContentElement.addEventListener("keydown", (event) => {
        if (navIsShown && event.key === "Escape" && navButton) {
          hideNavContent();
          navButton.focus();
        }
      });
    }
    function toggleDisclosureWidget(disclosureWidgetButton, disclosureWidgetPanel) {
      var _a, _b, _c, _d;
      if (disclosureWidgetButton.getAttribute("aria-expanded") === "true") {
        disclosureWidgetButton.setAttribute("aria-expanded", "false");
        disclosureWidgetPanel.setAttribute("hidden", "");
        if (((_b = (_a = disclosureWidgetPanel.parentElement) == null ? void 0 : _a.parentElement) == null ? void 0 : _b.dataset.level) === "one") {
          if (desktopMediaQuery.matches) {
            removePageInert();
          } else {
            removeNavLevelOneItemsInert();
            disclosureWidgetButton.parentElement.dataset.hasChildAriaExpanded = "false";
          }
        }
      } else {
        disclosureWidgetButton.setAttribute("aria-expanded", "true");
        disclosureWidgetPanel.removeAttribute("hidden");
        if (((_d = (_c = disclosureWidgetPanel.parentElement) == null ? void 0 : _c.parentElement) == null ? void 0 : _d.dataset.level) === "one") {
          if (desktopMediaQuery.matches) {
            makePageInert();
          } else {
            makeNavLevelOneItemsInert();
            disclosureWidgetButton.parentElement.dataset.hasChildAriaExpanded = "true";
          }
        }
      }
    }
    function collapseDisclosureWidgetsWhenClickingOutsideNav(event) {
      const target = event.target;
      if (!desktopMediaQuery.matches && navContent && !navContent.contains(target) && !(navButton == null ? void 0 : navButton.contains(target))) {
        hideNavContent();
      }
      disclosureWidgetPanels.forEach((disclosureWidgetPanel) => {
        const parentNode = disclosureWidgetPanel.parentElement;
        if (parentNode && !parentNode.contains(target)) {
          const disclosureWidgetButton = parentNode.querySelector("button");
          if (disclosureWidgetButton && disclosureWidgetButton.getAttribute("aria-expanded") === "true") {
            toggleDisclosureWidget(disclosureWidgetButton, disclosureWidgetPanel);
          }
        }
      });
    }
    function collapseDisclosureWidgetsWhenPressingEscape(event) {
      if (event.key === "Escape") {
        disclosureWidgetPanels.forEach((disclosureWidgetPanel) => {
          const parentNode = disclosureWidgetPanel.parentElement;
          if (parentNode) {
            const disclosureWidgetButton = parentNode.querySelector("button");
            if (disclosureWidgetButton && disclosureWidgetButton.getAttribute("aria-expanded") === "true") {
              toggleDisclosureWidget(disclosureWidgetButton, disclosureWidgetPanel);
              disclosureWidgetButton.focus();
            }
          }
        });
      }
    }
    function collapseDisclosureWidgetsWhenTabbingOutside() {
      disclosureWidgetPanels.forEach((disclosureWidgetPanel) => {
        const parentNode = disclosureWidgetPanel.parentElement;
        if (parentNode && !focusIsInside(parentNode)) {
          const disclosureWidgetButton = parentNode.querySelector("button");
          if (disclosureWidgetButton && disclosureWidgetButton.getAttribute("aria-expanded") === "true") {
            toggleDisclosureWidget(disclosureWidgetButton, disclosureWidgetPanel);
          }
        }
      });
    }
    function showNavContent() {
      if (!navButton || !navContent || !header || !navCloseButton) return;
      navButton.setAttribute("aria-expanded", "true");
      navContent.setAttribute("data-open", "true");
      header.style.position = "sticky";
      navIsShown = true;
      removeNavContentInert();
      makePageInert();
      closeNavContentWhenFocusLeaves(navContent);
      navCloseButton.focus();
    }
    function hideNavContent() {
      if (!navButton || !navContent || !header) return;
      navButton.setAttribute("aria-expanded", "false");
      navContent.setAttribute("data-open", "false");
      header.style.position = "";
      disclosureWidgetPanels.forEach((disclosureWidgetPanel) => {
        const parentNode = disclosureWidgetPanel.parentElement;
        if (parentNode) {
          const disclosureWidgetButton = parentNode.querySelector("button");
          if (disclosureWidgetButton && disclosureWidgetButton.getAttribute("aria-expanded") === "true") {
            toggleDisclosureWidget(disclosureWidgetButton, disclosureWidgetPanel);
          }
        }
      });
      navIsShown = false;
      makeNavContentInert();
      removePageInert();
    }
    function navButtonOnClick() {
      if (navIsShown) {
        hideNavContent();
      } else {
        showNavContent();
      }
    }
    function disclosureWidgetButtonOnClick(event) {
      const button = event.currentTarget;
      const panel = button.nextElementSibling;
      if (button && panel) {
        toggleDisclosureWidget(button, panel);
      }
    }
    function initialiseDisclosureWidgets() {
      listItemsWithChildren.forEach((listItem, index) => {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        let disclosureWidgetDivOrLink = listItem.querySelector(
          ":scope > div:not(.nav-footer-line), :scope > a"
        );
        let disclosureWidgetButton = listItem.querySelector(":scope > button");
        const disclosureWidgetPanel = listItem.querySelector(":scope > ul");
        if (!disclosureWidgetPanel) return;
        if (disclosureWidgetButton) {
          disclosureWidgetButton.removeEventListener("click", disclosureWidgetButtonOnClick);
        }
        if (desktopMediaQuery.matches && ((_a = listItem.parentElement) == null ? void 0 : _a.dataset.level) === "two" && disclosureWidgetDivOrLink) {
          return;
        }
        if (disclosureWidgetDivOrLink) {
          disclosureWidgetButton = document.createElement("button");
        } else {
          if (listItem.classList.contains("nav-footer")) {
            disclosureWidgetDivOrLink = document.createElement("div");
          } else {
            disclosureWidgetDivOrLink = document.createElement("a");
          }
        }
        const disclosureWidgetText = (_b = (disclosureWidgetDivOrLink == null ? void 0 : disclosureWidgetDivOrLink.innerText) || (disclosureWidgetButton == null ? void 0 : disclosureWidgetButton.innerText)) != null ? _b : "";
        if (desktopMediaQuery.matches) {
          if (((_c = listItem.parentElement) == null ? void 0 : _c.dataset.level) === "one" && disclosureWidgetButton) {
            disclosureWidgetButton.innerHTML = disclosureWidgetText;
          }
          if (((_d = listItem.parentElement) == null ? void 0 : _d.dataset.level) === "two" && disclosureWidgetDivOrLink) {
            disclosureWidgetDivOrLink.innerHTML = disclosureWidgetText;
          }
        } else {
          if (((_e = listItem.parentElement) == null ? void 0 : _e.dataset.level) === "one" && disclosureWidgetButton) {
            disclosureWidgetButton.innerHTML = arrowIcon + disclosureWidgetText + arrowIcon;
          }
          if (((_f = listItem.parentElement) == null ? void 0 : _f.dataset.level) === "two" && disclosureWidgetButton) {
            disclosureWidgetButton.innerHTML = disclosureWidgetText + chevronIcon;
          }
        }
        if (!desktopMediaQuery.matches || desktopMediaQuery.matches && ((_g = listItem.parentElement) == null ? void 0 : _g.dataset.level) === "one") {
          if (disclosureWidgetButton) {
            disclosureWidgetButton.setAttribute("aria-expanded", "false");
            if ((_h = disclosureWidgetButton.parentElement) == null ? void 0 : _h.dataset) {
              disclosureWidgetButton.parentElement.dataset.hasChildAriaExpanded = "false";
            }
            disclosureWidgetButton.setAttribute("aria-controls", `nav__ul-${index}`);
            disclosureWidgetPanel.setAttribute("id", `nav__ul-${index}`);
            disclosureWidgetPanel.setAttribute("hidden", "");
            if (disclosureWidgetDivOrLink) {
              disclosureWidgetDivOrLink.replaceWith(disclosureWidgetButton);
            }
            disclosureWidgetButton.addEventListener("click", disclosureWidgetButtonOnClick);
          }
        } else {
          disclosureWidgetPanel.removeAttribute("id");
          disclosureWidgetPanel.removeAttribute("hidden");
          if (disclosureWidgetButton && disclosureWidgetDivOrLink) {
            disclosureWidgetButton.replaceWith(disclosureWidgetDivOrLink);
          }
        }
      });
    }
    function handleMediaQueryChange(event) {
      initialiseDisclosureWidgets();
      if (event.matches) {
        navContent == null ? void 0 : navContent.removeAttribute("hidden");
        navButton == null ? void 0 : navButton.setAttribute("hidden", "");
        navCloseButton == null ? void 0 : navCloseButton.setAttribute("hidden", "");
        searchLinkText == null ? void 0 : searchLinkText.classList.add("visually-hidden");
        mobileLogInLink == null ? void 0 : mobileLogInLink.setAttribute("hidden", "");
        mobileJoinLink == null ? void 0 : mobileJoinLink.setAttribute("hidden", "");
        navContent == null ? void 0 : navContent.removeAttribute("role");
        navContent == null ? void 0 : navContent.removeAttribute("aria-labelledby");
        hideNavContent();
        removeNavLevelOneItemsInert();
        removeNavContentInert();
        removePageInert();
        navButton == null ? void 0 : navButton.removeEventListener("click", navButtonOnClick);
      } else {
        navButton == null ? void 0 : navButton.removeAttribute("hidden");
        navCloseButton == null ? void 0 : navCloseButton.removeAttribute("hidden");
        searchLinkText == null ? void 0 : searchLinkText.classList.remove("visually-hidden");
        mobileLogInLink == null ? void 0 : mobileLogInLink.removeAttribute("hidden");
        mobileJoinLink == null ? void 0 : mobileJoinLink.removeAttribute("hidden");
        navContent == null ? void 0 : navContent.setAttribute("role", "group");
        navContent == null ? void 0 : navContent.setAttribute("aria-labelledby", "nav-toggle");
        if (navIsShown) {
          removeNavContentInert();
        } else {
          makeNavContentInert();
        }
        navButton == null ? void 0 : navButton.addEventListener("click", navButtonOnClick);
      }
    }
    document.documentElement.style.setProperty(
      "--scrollbar-width",
      `${window.innerWidth - document.body.clientWidth}px`
    );
    if (navContent && nav) {
      navContent.style.transition = "none";
      nav.classList.add("enhanced");
    }
    navCloseButton == null ? void 0 : navCloseButton.addEventListener("click", () => {
      hideNavContent();
      navButton == null ? void 0 : navButton.focus();
    });
    document.addEventListener("keydown", collapseDisclosureWidgetsWhenPressingEscape);
    document.addEventListener("focusin", collapseDisclosureWidgetsWhenTabbingOutside);
    window.addEventListener("click", collapseDisclosureWidgetsWhenClickingOutsideNav);
    desktopMediaQuery.addEventListener("change", handleMediaQueryChange);
    handleMediaQueryChange(desktopMediaQuery);
    setTimeout(() => {
      navContent == null ? void 0 : navContent.style.removeProperty("transition");
    }, 0);
    window.EXECUTED_SCRIPT.push("global-nav");
  });
})();
}