import { bold, magenta, underline, whiteBright } from "colorette";
import arg from "arg";
import inquirer from "inquirer";

// Todo(ShafSpecs): Update this later
const helpText = `
${bold(
  magenta(`______               _       ______ _    _  ___  
| ___ \\             (_)      | ___ \\ |  | |/ _ \\ 
| |_/ /___ _ __ ___  ___  __ | |_/ / |  | / /_\\ \\
|    // _ \\ '_ \` _ \\| \\ \\/ / |  __/| |/\\| |  _  |
| |\\ \\  __/ | | | | | |>  <  | |   \\  /\\  / | | |
\\_| \\_\\___|_| |_| |_|_/_/\\_\\ \\_|    \\/  \\/\\_| |_/
`)
)}

Usage:  npx remix-pwa@latest [OPTIONS]

A stand-alone package for integrating PWA solutions into Remix application.
  
${underline(whiteBright("Options:"))}
--typescript, --ts              Create project with typescript template
--no-typescript, --no-ts, --js  Create project with javascript template
--workbox                       Integrate workbox into your project
--no-workbox                    Skip integrating workbox into your project  
--install                       Install dependencies after creating the project
--no-install                    Skip the installation process
--package-manager, --pm         Preferred package manager if your project is not using any
--cache                         Preferred \`Caching Strategy\` for the service worker. Either \`jit\` or \`pre\`
--features, --feat              \`Remix-Pwa\` features you want to include:
                                - 'sw' for Service Workers
                                - 'manifest' for Web Manifest
                                - 'push' for Push Notifications
                                - 'utils' for PWA Client Utilities
                                - 'icons' for Development Icons
--dir                           The location of your Remix \`app\` directory
--help, -h                      Print this help message and exit
--version, -v                   Print the CLI version and exit
--docs                          Print the link to the remix-pwa docs and exit`;

export async function run(argv: string[] = process.argv.slice(2)) {
  // todo: Allow passing configs via CLI like minify build, worker path, etc.
  const args = arg(
    {
      // create - init
      "--help": Boolean,
      "--version": Boolean,
      "--typescript": Boolean,
      "--no-typescript": Boolean,
      "--workbox": Boolean,
      "--no-workbox": Boolean,
      "--install": Boolean,
      "--no-install": Boolean,
      "--docs": Boolean,
      "--cache": String,
      "--features": String,
      "--dir": String,
      "--package-manager": String,
      // Aliases for aboves
      "-h": "--help",
      "-v": "--version",
      "--ts": "--typescript",
      "--feat": "--features",
      "--no-ts": "--no-typescript",
      "--js": "--no-typescript",
      "--pm": "--package-manager",

      // options for dev & build... (wip)
    },
    { argv }
  );

  let input = args._;

  if (args["--help"]) {
    console.log(helpText);
    process.exit(0);
  }

  // Handle other flags here later

  const cmd = input[0];

  switch (cmd) {
    case "init":
    case "new":
    case "create":
      break;
    case "dev":
      break;
    case "build":
      break;
    default:
      console.log(helpText); // Todo: switch this to `dev` later - remix-pwa dev == remix-pwa 
      process.exit(0);
  }
}
