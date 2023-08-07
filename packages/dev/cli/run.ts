import { bold, magenta, red, underline, whiteBright } from "colorette";
import arg from "arg";
import inquirer from "inquirer";
import { pathExists } from "fs-extra";
import { resolve } from "path";
import { detectPackageManager } from "./detectPkgManager.js";

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
--precache                      Wether you would like to utilise the precache feature
--dir                           The location of your Remix \`app\` directory
--help, -h                      Print this help message and exit
--version, -v                   Print the CLI version and exit
--docs                          Print the link to the remix-pwa docs and exit`;

type PWAFeatures = "sw" | "manifest" | "push" | "utils" | "icons";

export async function run(
  argv: string[] = process.argv.slice(2),
  projectDir: string = process.cwd()
) {
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
      "--precache": Boolean,
      // "--features": String,
      "--dir": String,
      "--package-manager": String,
      // Aliases for aboves
      "-h": "--help",
      "-v": "--version",
      "--ts": "--typescript",
      // "--feat": "--features",
      "--no-ts": "--no-typescript",
      "--js": "--no-typescript",
      "--pm": "--package-manager",

      // options for dev & build... (wip)
    },
    { argv }
  );

  let input = args._;
  let packageManager = (await detectPackageManager(projectDir)) ?? "npm";

  let flags: any = Object.entries(args).reduce((acc, [key, value]) => {
    key = key.replace(/^--/, "");
    acc[key] = value;
    return acc;
  }, {} as any);

  if (flags.help) {
    console.log(helpText);
    return;
  }

  if (flags.version) {
    // Todo: Get the version from package.json - for remix-pwa
    return;
  }

  if (flags.docs) {
    console.log("https://remix-pwa-docs.vercel.app");
    return;
  }

  if (args["--ts"]) {
    flags.typescript = true;
  }

  if (args["--no-typescript"] || args["--js"] || args["--no-ts"]) {
    flags.typescript = false;
  }

  if (args["--no-workbox"]) {
    flags.workbox = false;
  }

  if (args["--no-install"]) {
    flags.install = false;
  }

  if (args["--pm"]) {
    packageManager = args["--pm"];
  }

  if (args["--package-manager"]) {
    //@ts-ignore
    packageManager = args["--package-manager"];
  }

  const cmd = input[0];

  switch (cmd) {
    case "dev":
      break;
    case "build":
      break;
    case "init":
    case "new":
    case "create":
    default: // Todo: Add a better error message - Deprecating this. For now tho, it would be the same as create
      if (cmd !== "create" && cmd !== "init" && cmd !== "new") {
        console.warn(
          red(
            "This command is getting deprecated soon. Please use `create` instead."
          )
        );
      }

      const inquiry = await inquirer
        .prompt<{
          lang: "Typescript" | "JavaScript";
          workbox: boolean;
          install: boolean;
          precache: boolean;
          features: PWAFeatures[];
          dir: string;
          packageManager: string;
        }>([
          {
            type: "list",
            name: "lang",
            message:
              "Is this a TypeScript or JavaScript project? Pick the opposite for chaos!",
            when: !args["--typescript"] && !args["--no-typescript"],
            choices: ["Typescript", "JavaScript"],
          },
          {
            type: "confirm",
            name: "workbox",
            message: "Do you want to integrate workbox into your project?",
            default: false,
            when: !args["--workbox"] && !args["--no-workbox"],
          },
          {
            type: "confirm",
            name: "precache",
            message: "Do you want to utilise precaching in this project?",
            default: false,
            when: !args["--precache"],
          },
          {
            type: "checkbox",
            name: "features",
            message: "What features do you want to include?",
            choices: [
              {
                name: "Service Workers",
                value: "sw",
              },
              {
                name: "Web Manifest",
                value: "manifest",
              },
              {
                name: "Push Notifications",
                value: "push",
              },
              {
                name: "PWA Client Utilities",
                value: "utils",
              },
              {
                name: "Development Icons",
                value: "icons",
              },
            ],
            default: ["sw", "manifest"],
            // when: !args["--features"],
          },
          {
            type: "input",
            name: "dir",
            message: "Where is your Remix `app` directory located?",
            default: "app",
            when: !args["--dir"],
            validate(input: string, answers) {
              if (input === "") {
                return "Please enter a valid directory";
              }

              pathExists(resolve(projectDir, input)).then((exists) => {
                if (!exists) {
                  return "Please enter a valid directory";
                }
              });

              if (input.startsWith("/") || input.endsWith("/")) {
                answers!.dir = input.replace(/^\/|\/$/g, "");
              }

              return true;
            },
          },
          {
            type: "list",
            name: "packageManager",
            message: "What package manager do you use?",
            choices: ["npm", "yarn", "pnpm"],
            default: "npm",
            when:
              !args["--package-manager"] &&
              (await detectPackageManager(projectDir)) === undefined,
          },
          {
            type: "confirm",
            name: "install",
            message: `Do you want to run ${packageManager} install?`,
            default: true,
            when: !args["--install"] && !args["--no-install"],
          },
        ])
        .catch((err) => {
          if (err.isTtyError) {
            console.error(
              red(
                "💥 Your terminal doesn't support interactivity! Prompt couldn't be rendered in the current environment"
              )
            );

            return {
              lang: "Typescript",
              workbox: false,
              install: true,
              precache: false,
              features: ["sw", "manifest"],
              dir: "app",
              packageManager,
            };
          }

          throw err;
        });

      const lang =
        flags.typescript === false
          ? "JavaScript"
          : flags.typescript === true
          ? "Typescript"
          : null;

      const workbox =
        flags.workbox === false ? false : flags.workbox === true ? true : null;

      const install =
        flags.install === false ? false : flags.install === true ? true : null;

      const precache = 
        flags.precache === false ? false : flags.precache === true ? true : null;

      const dir: string | null = flags.dir || null;

      const initialChoices = {
        ...(lang ? { lang } : {}),
        ...(workbox ? { workbox } : {}),
        ...(install ? { install } : {}),
        ...(precache ? { precache } : {}),
        ...(dir ? { dir } : {})
      };

      const answer = { ...inquiry, ...initialChoices };
  }
}
