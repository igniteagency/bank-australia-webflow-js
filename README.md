# Bank Australia Blog

This GitHub project provides a development workflow for JavaScript files in Bank Australia Blog site.

In essence, it uses bun to start a development server on [localhost:3000](http://localhost:3000), bundle, build and serve any working file (from the `/src` directory) in local mode.

The project generates production JS code that can be copied and used in the Webflow site.

Don't directly include any JSDelivr CDN links on the site as we don't have the IT team permission to do so.

## Install

### Prerequisites

- Have [bun](https://bun.sh/) installed locally. Installation guidelines [here](https://bun.sh/docs/installation) (recommended approach - homebrew / curl)
   - Alternatively, `pnpm` or `npm` will work too.

### Setup

- Run `bun install`

## Usage

On starting, update the repo name and URL in this README file, and the `./bin/build.js`.

### Output

The project will process and output the files mentioned in the `files` const of `./bin/build.js` file. The output minified files will be in the `./dist/prod` folder for production (pushed to github), and in the `./dist/dev` used for local file serving.

### Development

1. For localhost testing when developing, can either include the script on the staging site (remember to remove it later), or use browser devtools overrides to add it just for self. Script example:
   ```html
   <script src="http://localhost:3000/global.js"></script>
   ```

   **Do not include `/src` in the file path.**

3. Whilst working locally, run `bun run dev` to start a development server on [localhost:3000](http://localhost:3000)

4. Execute `window.setScriptsENV('dev')` in browser console to serve the file from localhost. If local server is not running, it will error out and serve from production instead. This preference is saved in the browser's localstorage.

   - To switch back to production mode, execute `window.setScriptsENV('prod')` from console.

5. As changes are made to the code locally and saved, the [localhost:3000](http://localhost:3000) will then serve those files

#### Code execution

To execute code after all the scripts have loaded, the script loader emits an event listener on the `window` object. This can come in handy when you want to ensure a certain imported library from another script file has loaded before executing it.

You can use that as following:

   ```html
   <script>
      import { SCRIPTS_LOADED_EVENT } from 'src/constants';
      window.addEventListener(SCRIPTS_LOADED_EVENT, () => {
         // code to execute after all scripts have loaded
      });
   </script>
   ```

#### Debugging

There is an opt-in debugging setup that turns on logs in the console. The preference can be toggled via browser console, and is stored in browser localStorage.

- Add any console logs in the code using the `console.debug` function.
- Execute `window.setDebugMode(true)` in the console to turn on Debug mode. With that, any conditional code wrapped with `window.DEBUG` can be run only for debugging purposes
- To turn it off, execute `window.setDebugMode(false)` in the console.

### Production

1. Run `bun run build` to generate the production files in `./dist` folder

2. To push code to production, merge the working branch into `main`. A Github Actions workflow will run tagging that version with an incremented [semver](https://semver.org/)) tag.
   - By default, the version bump is a patch (`x.y.{{patch number}}`). To bump the version by a higher amount, mention a tag in the commit message, like `#major` or `#minor`
