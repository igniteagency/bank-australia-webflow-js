import type { Webflow } from '@finsweet/ts-utils';

import { loadExternalScript } from '$utils/external-script-embed';

export type SCRIPTS_ENV = 'dev' | 'prod';

declare global {
  interface Window {
    JS_SCRIPTS: Set<string> | undefined;
    Webflow: Webflow;

    SCRIPTS_ENV: SCRIPTS_ENV;
    setScriptsENV(env: SCRIPTS_ENV): void;

    /**
     * Loads script from localhost for the set production code file in dev mode
     * @param url URL of the script to load
     */
    loadLocalScript(url: string): void;

    IS_DEBUG_MODE: boolean;
    setDebugMode(mode: boolean): void;
    /**
     * A wrapper function to directly console log when debug mode is active
     */
    DEBUG: (...args: any[]) => void;

    /**
     * A list of all the module scripts that have been executed
     * This is used to prevent the same module script from being executed multiple times
     */
    EXECUTED_SCRIPT: string[];

    /**
     * A helper function to load external scripts only once on a page
     */
    loadExternalScript: typeof loadExternalScript;
  }

  // Extend `querySelector` and `querySelectorAll` function to stop the nagging of converting `Element` to `HTMLElement` all the time
  interface ParentNode {
    querySelector<E extends HTMLElement = HTMLElement>(selectors: string): E | null;
    querySelectorAll<E extends HTMLElement = HTMLElement>(selectors: string): NodeListOf<E>;
  }

  declare const Swiper: typeof import('swiper').default;
  type SwiperModule =
    | typeof import('swiper').Navigation
    | typeof import('swiper').Pagination
    | typeof import('swiper').Autoplay
    | typeof import('swiper').A11y;

  declare const Navigation: SwiperModule;
  declare const Pagination: SwiperModule;
  declare const Autoplay: SwiperModule;
  declare const A11y: SwiperModule;

  declare const gsap: typeof import('gsap');
  declare const ScrollTrigger: typeof import('gsap/ScrollTrigger');
}

export {};
