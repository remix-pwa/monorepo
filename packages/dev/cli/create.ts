import { resolve } from "path";
import { PWAFeatures } from "./run.js";
import { pathExists, pathExistsSync, readFileSync, writeFile } from "fs-extra";
import { red } from "colorette";

export type FlagOptionType = {
  dir: string;
  precache: boolean;
  install: boolean;
  workbox: boolean;
  lang: "ts" | "js";
  features: PWAFeatures[];
  packageManager: string;
};

async function integrateServiceWorker(projectDir: string, precache: boolean, workbox: boolean, lang: "ts" | "js" = "ts") {
  const templateDir = resolve(__dirname, "../../../templates");

  if (!pathExistsSync(templateDir)) {
    throw new Error("Template directory not found");
  }

  console.log("Integrating service worker..."); // todo: ora spinners 
  console.log(projectDir)

  if (precache) {
    // if (workbox) { return; }
    const workerDir = resolve(projectDir, `entry.worker.${lang}`)

    if (pathExistsSync(workerDir)) {
      console.log(red("Service worker already exists"));
    } else {
      const workerContent = readFileSync(resolve(templateDir, "app", `precache.worker.${lang}`), "utf-8");

      await writeFile(workerDir, workerContent, "utf-8")
    }
  } else {
    // if (workbox) { return; }

    const workerDir = resolve(projectDir, `entry.worker.${lang}`)

    if (pathExistsSync(workerDir)) {
      console.log(red("Service worker already exists"));
    } else {
      const workerContent = readFileSync(resolve(templateDir, "app", `entry.worker.${lang}`), "utf-8");

      await writeFile(workerDir, workerContent, "utf-8")
    }
  }
}

export async function createPWA(
  projectDir: string = process.cwd(), 
  options: FlagOptionType = {
  dir: projectDir,
  precache: false,
  install: true,
  workbox: false,
  lang: "ts",
  features: ['sw', 'manifest'],
  packageManager: "npm"
}) {
  let { dir, precache, install, workbox, lang, features, packageManager } = options;

  if (workbox) {
    workbox = false;
  }

  const templateDir = resolve(__dirname, "../../../templates");

  if (!pathExistsSync(templateDir)) {
    throw new Error("Template directory not found");
  }

  features.map(async (feature) => {
    switch (feature) {
      case "sw":
        try {
          await integrateServiceWorker(dir, precache, workbox, lang);
        } catch (err) {
          console.log(typeof err == "string" ? red(err) : err);
        }
        break;
      case "manifest":
        console.log("manifest");
        break;
      case "icons":
        console.log("workbox");
        break;
      case "push":
        console.log("install");
        break;
      case "utils":
        console.log("precache");
        break;
      default:
        break;
    }
  })

  if (install) {
    console.log("installing deps with", packageManager);
  } else {
    console.log(red(`Skipping ${packageManager} install...\n`));
    console.log(red(`Don't forget to run ${packageManager} install`));
  }
}
