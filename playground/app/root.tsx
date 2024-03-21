import {
  logger,
  useSWEffect,
} from "@remix-pwa/sw";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
// import { msg } from "virtual:sw"
// import { routes } from 'virtual:pwa-entry-module';

import './tailwind.css';
import { useEffect, useState } from "react";

const usePWAHMR = () => {
  const [currentHash, setCurrentHash] = useState<string | null>(null);

  useEffect(() => {
    if (import.meta && import.meta.hot) {
      import.meta.hot.on('pwa:worker-reload', (data) => {
        if (data.newHash !== currentHash) setCurrentHash(data.newHash);
      })
    }

    return () => {
      if (import.meta && import.meta.hot) {
        import.meta.hot.off('pwa:worker-reload');
      }
    }
  }, []);

  useEffect(() => {
    if (!currentHash) return;

    console.log('New worker incomiong!')
    // Force reload, kill, massacre and murder whatever process
    // you want over here.
  }, [currentHash]);
}

export default function App() {
  // useSWEffect()

  // usePWAHMR()

  // logger.log("App rendered", msg);
  useEffect(() => {
    console.log(window.__remixManifest);
  }, []);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
