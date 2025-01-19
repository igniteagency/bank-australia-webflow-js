/**
 * Entry point for the build system.
 * Fetches scripts from localhost or production site depending on the setup
 * Polls `localhost` on page load, else falls back to deriving code from production URL
 */
import { SCRIPTS_LOADED_EVENT } from './constants';
import './dev/debug';
import './dev/env';

console.log(`Current mode: ${window.SCRIPTS_ENV}`);

window.EXECUTED_SCRIPT = [];

const SCRIPT_LOAD_PROMISES: Array<Promise<unknown>> = [];

window.loadLocalScript = function (url) {
  const promise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });

  SCRIPT_LOAD_PROMISES.push(promise);

  Promise.allSettled(SCRIPT_LOAD_PROMISES)
    .then(() => {
      window.DEBUG('All scripts loaded');
      window.dispatchEvent(new CustomEvent(SCRIPTS_LOADED_EVENT));
    })
    .catch((error) => {
      console.error('Error loading local scripts', error);
    });
};
