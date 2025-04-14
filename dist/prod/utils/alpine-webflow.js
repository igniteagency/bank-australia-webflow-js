if (window.SCRIPTS_ENV === 'dev') {
  window.loadLocalScript('http://localhost:3000/utils/alpine-webflow.js');
} else {
  (() => {
  // src/utils/alpine-webflow.ts
  var AlpineJSWebflow = class {
    constructor() {
      this.init();
      window.loadExternalScript(
        "https://cdn.jsdelivr.net/npm/alpinejs@3.14.9/dist/cdn.min.js",
        "head",
        true
      ).then(() => {
        console.debug("AlpineJS init");
      });
    }
    init() {
      document.querySelectorAll("[x-data],[x-data] *").forEach((el) => {
        this.replaceDotAttributes(el);
        this.removeUnnecessaryAttributeValues(el);
      });
      document.querySelectorAll("[x-data] [x-for]:not(template), [x-data] [x-if]:not(template)").forEach((el) => this.wrapInTemplate(el));
    }
    getAlpineAttributes(el) {
      const alpineAttributes = [];
      for (let i = 0; i < el.attributes.length; ++i) {
        const a = el.attributes[i];
        if (a.name.startsWith("x-")) {
          alpineAttributes.push(a);
        }
      }
      return alpineAttributes;
    }
    wrapInTemplate(el) {
      var _a;
      const template = document.createElement("template");
      const attributes = this.getAlpineAttributes(el);
      attributes.forEach((a) => {
        template.setAttribute(a.name, a.value);
        el.removeAttribute(a.name);
      });
      (_a = el.parentNode) == null ? void 0 : _a.insertBefore(template, el);
      template.content.appendChild(el);
    }
    replaceDotAttributes(el) {
      const attributes = this.getAlpineAttributes(el);
      attributes.forEach((a) => {
        const m = a.name.match(/^(x-[^:]+)(:.+)$/);
        if (m) {
          let newA = null;
          if (["x-bind", "x-on"].includes(m[1])) {
            let prefix = m[1];
            let suffix = m[2].substring(1);
            if (prefix === "x-on" && suffix.startsWith("update:")) {
              prefix += ":update";
              suffix = suffix.substring(7);
            }
            if (suffix.includes(":")) {
              newA = prefix + ":" + suffix.replace(/:/g, ".");
            }
          } else {
            newA = m[1] + m[2].replace(/:/g, ".");
          }
          if (newA) {
            el.setAttribute(newA, a.value);
            el.removeAttribute(a.name);
          }
        }
      });
    }
    removeUnnecessaryAttributeValues(el) {
      const attributes = this.getAlpineAttributes(el);
      attributes.forEach((a) => {
        if (a.name.match(/^x-transition.*(?!(enter|leave))/)) {
          el.setAttribute(a.name, "");
        }
      });
    }
  };
  new AlpineJSWebflow();
})();
}