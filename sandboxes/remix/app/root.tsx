import {
  installPWAGlobals,
} from "@remix-pwa/sw/install-pwa-globals";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { usePWAManager } from "@remix-pwa/client";
import { ManifestLink } from "@remix-pwa/manifest";

import './tailwind.css';
import { useLocalStorage } from "usehooks-ts";
import { cn } from "./lib/utils";

// const usePWAHMR = () => {
//   const [currentHash, setCurrentHash] = useState<string | null>(null);

//   useEffect(() => {
//     if (import.meta && import.meta.hot) {
//       import.meta.hot.on('pwa:worker-reload', (data) => {
//         if (data.newHash !== currentHash) setCurrentHash(data.newHash);
//       })
//     }

//     return () => {
//       if (import.meta && import.meta.hot) {
//         import.meta.hot.off('pwa:worker-reload');
//       }
//     }
//   }, []);

//   useEffect(() => {
//     if (!currentHash) return;

//     console.log('New worker incomiong!')
//     // Force reload, kill, massacre and murder whatever process
//     // you want over here.
//   }, [currentHash]);
// }

export default function App() {
  installPWAGlobals()
  const [theme,] = useLocalStorage("theme", "light");

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <ManifestLink href="/manifest.json" />
        <Links />
        <script type="module" dangerouslySetInnerHTML={{
          __html: `
          (() => {
           if (typeof window !== 'undefined') {
            if (!('theme' in localStorage)) {
              localStorage.setItem('theme', window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
            }

            document.documentElement.classList.toggle(
              'dark',
              localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
            )
           }
          })();
          `
        }}
        />
      </head>
      <body className={cn("min-h-screen bg-background transition-colors duration-300", theme)}>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
