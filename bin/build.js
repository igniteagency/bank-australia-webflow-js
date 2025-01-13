import esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';

const DEV_BUILD_PATH = './dist/dev';
const PROD_BUILD_PATH = './dist/prod';
const production = process.env.NODE_ENV === 'production';

const BUILD_DIRECTORY = !production ? DEV_BUILD_PATH : PROD_BUILD_PATH;

const files = [
  './src/*.ts',
  // './src/components/**/*.ts',
  './src/components/autoplay-slider.ts',
  './src/pages/**/*.ts',
];

const wrapScript = (code, filename) => `
// ${filename}
if (window.SCRIPTS_ENV === 'dev') {
  window.loadLocalScript('http://localhost:3000/${filename}');
} else {
  ${code.replace(/^"use strict";/, '').trim()}
}
`;

// Function to recursively get all files in a directory
const getAllFiles = (dirPath, arrayOfFiles = []) => {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else {
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
};

const wrapperPlugin = {
  name: 'wrapper',
  setup(build) {
    build.onEnd(async (result) => {
      if (production) {
        try {
          const allFiles = getAllFiles(BUILD_DIRECTORY);
          console.log('All files found:', allFiles);

          for (const filePath of allFiles) {
            if (filePath.endsWith('.js')) {
              // console.log('Processing file:', filePath);

              const code = fs.readFileSync(filePath, 'utf8');
              // console.log('Read file contents successfully');

              // Get relative path from build directory for the script URL
              const relativePath = path.relative(BUILD_DIRECTORY, filePath);

              // Wrap the code
              const wrappedCode = wrapScript(code, relativePath);

              // Write back to file
              fs.writeFileSync(filePath, wrappedCode);
              console.log(
                `Successfully wrapped ${relativePath} with environment conditional logic`
              );
            }
          }
        } catch (error) {
          console.error('Error in wrapper plugin:', error);
          throw error;
        }
      }
    });
  },
};

const buildSettings = {
  entryPoints: files,
  bundle: true,
  outdir: BUILD_DIRECTORY,
  minify: false,
  sourcemap: !production,
  treeShaking: true,
  target: production ? 'es2017' : 'esnext',
  plugins: [wrapperPlugin],
  // format: 'iife',
  external: ['swiper', 'swiper/modules'],
};

// Function to recursively delete directory contents
const deleteDirectoryContents = (dirPath) => {
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach((file) => {
      const currentPath = path.join(dirPath, file);
      if (fs.lstatSync(currentPath).isDirectory()) {
        // Recurse if the current path is a directory
        deleteDirectoryContents(currentPath);
      } else {
        // Delete file
        fs.unlinkSync(currentPath);
      }
    });
  }
};

// Clean the build directory before starting the build
deleteDirectoryContents(BUILD_DIRECTORY);

if (!production) {
  let ctx = await esbuild.context(buildSettings);

  let { port } = await ctx.serve({
    servedir: BUILD_DIRECTORY,
    port: 3000,
  });

  console.log(`Serving at http://localhost:${port}`);
} else {
  esbuild.build(buildSettings).catch(() => process.exit(1));
}
