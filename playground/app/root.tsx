import {
  useSWEffect,
} from "@remix-pwa/sw";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
// import { routes } from 'virtual:pwa-entry-module';

import './tailwind.css';
import { useEffect } from "react";

export default function App() {
  useSWEffect()

  // logger.log("App rendered", routes);
  useEffect(() => {
    console.log(window.__remixManifest)
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
        <LiveReload />
      </body>
    </html>
  );
}
