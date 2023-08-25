/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');
// Automatically exclude all node_modules from the bundled version
const { nodeExternalsPlugin } = require('esbuild-node-externals');

function readJsFiles(folderPath) {
  const jsFiles = [];

  function readFilesRecursive(folder) {
    const entries = fs.readdirSync(folder, { withFileTypes: true });

    entries.forEach(entry => {
      const entryPath = path.join(folder, entry.name);

      if (entry.isDirectory()) {
        if (entry.name === 'templates') return;

        readFilesRecursive(entryPath);
      } else if (entry.isFile() && entry.name.endsWith('.js')) {
        jsFiles.push(entryPath);
      }
    });
  }

  readFilesRecursive(folderPath);
  return jsFiles;
}

esbuild
  .build({
    entryPoints: [...readJsFiles('./dist')],
    outdir: 'dist',
    allowOverwrite: true,
    minify: true,
    platform: 'node',
    sourcemap: false,
    target: 'node18',
    plugins: [nodeExternalsPlugin()],
  })
  .catch(() => process.exit(1));
