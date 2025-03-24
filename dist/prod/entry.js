if (window.SCRIPTS_ENV === 'dev') {
  window.loadLocalScript('http://localhost:3000/entry.js');
} else {
  (() => {
  // src/utils/external-script-embed.ts
  function loadExternalScript(url, placement = "body", defer = true) {
    return new Promise((resolve, reject) => {
      const existingScript = document.querySelector(`script[src="${url}"]`);
      if (existingScript) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = url;
      if (defer) script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
      if (placement === "head") {
        document.head.appendChild(script);
      } else if (placement === "body") {
        document.body.appendChild(script);
      } else {
        reject(new Error('Invalid placement. Use "head" or "body".'));
      }
    });
  }
  window.loadExternalScript = loadExternalScript;

  // src/constants.ts
  var SCRIPTS_LOADED_EVENT = "scriptsLoaded";

  // src/dev/debug.ts
  var DEBUG_MODE_LOCALSTORAGE_ID = "IS_DEBUG_MODE";
  window.IS_DEBUG_MODE = getDebugMode();
  console.debug = function(...args) {
    if (window.IS_DEBUG_MODE) {
      console.log(...args);
    }
  };
  window.setDebugMode = (mode) => {
    localStorage.setItem(DEBUG_MODE_LOCALSTORAGE_ID, mode.toString());
  };
  function getDebugMode() {
    const localStorageItem = localStorage.getItem(DEBUG_MODE_LOCALSTORAGE_ID);
    if (localStorageItem && localStorageItem === "true") {
      return true;
    }
    return false;
  }
  var status = window.IS_DEBUG_MODE ? "enabled" : "disabled";
  console.log(`Debug mode is ${status}`);
  if (!window.IS_DEBUG_MODE) {
    console.log(
      "To enable debug mode and show debug logs, run `window.setDebugMode(true)` in the console"
    );
  }

  // src/dev/env.ts
  var ENV_LOCALSTORAGE_ID = "jsEnv";
  var ENV_NAMES = {
    dev: "Development",
    prod: "Production"
  };
  window.SCRIPTS_ENV = getENV();
  window.setScriptsENV = (env) => {
    if (env !== "dev" && env !== "prod") {
      console.error("Invalid environment. Pass `dev` or `prod`");
      return;
    }
    localStorage.setItem(ENV_LOCALSTORAGE_ID, env);
    window.SCRIPTS_ENV = env;
    console.log(`Environment successfully set to ${ENV_NAMES[env]}`);
  };
  function getENV() {
    let localStorageItem = localStorage.getItem(ENV_LOCALSTORAGE_ID);
    if (localStorageItem === "dev") {
      fetch("http://localhost:3000", { method: "HEAD", cache: "no-store" }).catch(() => {
        console.log("Localhost server is not available, switching to production mode");
        localStorage.setItem(ENV_LOCALSTORAGE_ID, "prod");
        localStorageItem = "prod";
        window.SCRIPTS_ENV = "prod";
      });
    }
    return localStorageItem || "prod";
  }
  function outputEnvSwitchLog(env) {
    if ("prod" === env) {
      console.log(
        'To switch to dev mode and serve files from localhost, run `window.setScriptsENV("dev")` in the console'
      );
    } else {
      console.log(
        'To switch to production mode, either run `window.setScriptsENV("prod")` in the console or turn off localhost dev server'
      );
    }
  }

  // src/entry.ts
  console.log(`Current mode: ${window.SCRIPTS_ENV}`);
  outputEnvSwitchLog(window.SCRIPTS_ENV);
  window.EXECUTED_SCRIPT = [];
  var SCRIPT_LOAD_PROMISES = [];
  window.loadLocalScript = function(url) {
    const promise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = url;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
    SCRIPT_LOAD_PROMISES.push(promise);
  };
  Promise.allSettled(SCRIPT_LOAD_PROMISES).then(() => {
    console.debug("All scripts loaded");
    window.dispatchEvent(new CustomEvent(SCRIPTS_LOADED_EVENT));
  }).catch((error) => {
    console.error("Error loading local scripts", error);
  });
})();
}