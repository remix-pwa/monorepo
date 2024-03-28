// This script is to update all the sandboxed `@remix-pwa/*` packages to the latest version

import { writeFile } from 'fs';

export {};

const sandboxPackageJson = await import('../playground/package.json', { assert: { type: 'json' } });
const deps = sandboxPackageJson.default.dependencies;
const devDeps = sandboxPackageJson.default.devDependencies;

/**
 * @type {string[]}
 */
const remixPwaPackages = [];

Object.keys(deps).forEach(dep => {
  if (dep.startsWith('@remix-pwa')) {
    remixPwaPackages.push(dep);
  }
});

Object.keys(devDeps).forEach(dep => {
  if (dep.startsWith('@remix-pwa')) {
    remixPwaPackages.push(dep);
  }
});

await Promise.allSettled(remixPwaPackages.map(async pkg => {
  const pkgPath = pkg.replace('@remix-pwa/', '');

  const pkgJson = await import(`../packages/${pkgPath}/package.json`, { assert: { type: 'json' } });

  // @ts-ignore
  if (deps[pkg]) {
    // @ts-ignore
    console.log(`Updating ${pkg} from ${deps[pkg]} to ${pkgJson.default.version}`);
    // @ts-ignore
    deps[pkg] = pkgJson.default.version;
  } else {
    // @ts-ignore
    console.log(`Updating ${pkg} from ${devDeps[pkg]} to ${pkgJson.default.version}`);
    // @ts-ignore
    devDeps[pkg] = pkgJson.default.version;
  }
}));

writeFile(
  './package.json',
  JSON.stringify(sandboxPackageJson.default, null, 2),
  { encoding: 'utf-8' },
  err => {
    if (err) 
      console.error('Error updating sandbox packages', err);
    else 
      console.log('Sandbox packages updated successfully');
  }
);
