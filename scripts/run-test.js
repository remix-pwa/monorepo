import { exec } from 'child_process';
import { readFileSync } from 'fs';

/**
 * @fileoverview 
 * Run tests in all workspaces or select ones. 
 * 
 * How to use:
 * ```sh 
 * npm run test // runs all possible workspaces 
 * ```
 * or run select workspaces only 
 * ```sh 
 * # --workspaces or -w (alias)
 * npm run test -- -w dev worker-runtime # utilise only the folder name 
 * ```
 * This example runs the test in the `dev` and `worker-runtime` workspaces **only**.
 */
export { };
const packages = await import('../tsconfig.json', { assert: { type: 'json' } });

/**
 * @type {string[]}
 */
// @ts-ignore
const workspaces = packages.default.references.map((ref) => ref.path.split('/').pop());

const options = parseFlags();

if (options.w) {
  options.workspaces = options.w;
}

let command = "npm run test";

if (options.workspaces) {
  // @ts-ignore workspaces is always an array if it exists 
  let selectedWorkspaces = workspaces.filter((workspace) => options.workspaces.includes(workspace));

  if (selectedWorkspaces.length === 0) {
    throw new Error(`No workspaces selected. Please check your input.`);
  }

  let packageNames = selectedWorkspaces.map((workspace) => {
    const packageName = readFileSync(`packages/${workspace}/package.json`, 'utf-8');

    return JSON.parse(packageName).name;
  });

  if (Array.isArray(packageNames)) {
    command = `${command} -w ${packageNames.join(' ')}`;
  }
} else {
  command = `${command} --workspaces --if-present`;
}

console.log(`Running command: ${command}`);

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`error: ${error.message}`);
    return;
  }

  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }

  console.log(`stdout:\n${stdout}`);
});

function parseFlags(args = process.argv.slice(2)) {
  /**
   * @type {Record<string, string | boolean | string[]>}
   */
  const flags = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg.startsWith('-') || arg.startsWith('--')) {
      const flag = arg.replace(/^-+/, '');
      const nextArg = args[i + 1];

      if (nextArg && !nextArg.startsWith('-')) {
        flags[flag] = nextArg;
        i++;
        continue;
      } else {
        flags[flag] = true;
      }
    } else {
      const lastFlag = Object.keys(flags).pop();

      if (lastFlag === undefined) {
        throw new Error(`Invalid flag ${arg}`);
      }

      if (typeof flags[lastFlag] === 'boolean') {
        throw new Error(`Invalid flag ${arg}`);
      }

      // @ts-ignore
      flags[lastFlag] = [...(flags[lastFlag] || []), arg];
    }
  }

  return flags;
}