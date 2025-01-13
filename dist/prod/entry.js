
if (window.SCRIPTS_ENV === 'dev') {
  window.loadScript('http://localhost:3000/entry.js');
} else {
  // entry.js
  (() => {
  // src/constants.ts
  var SCRIPTS_LOADED_EVENT = "scriptsLoaded";

  // src/dev/debug.ts
  var DEBUG_MODE_LOCALSTORAGE_ID = "IS_DEBUG_MODE";
  window.IS_DEBUG_MODE = getDebugMode();
  window.DEBUG = function(...args) {
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
    const localStorageItem = localStorage.getItem(ENV_LOCALSTORAGE_ID);
    return localStorageItem || "prod";
  }

  // src/entry.ts
  console.log(`Current mode: ${window.SCRIPTS_ENV}`);
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
    Promise.allSettled(SCRIPT_LOAD_PROMISES).then(() => {
      window.DEBUG("All scripts loaded");
      window.dispatchEvent(new CustomEvent(SCRIPTS_LOADED_EVENT));
    });
  };
})();
}
