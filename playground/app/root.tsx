import {
  useSWEffect,
  // LiveReload,
  logger
} from "@remix-pwa/sw";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "@remix-run/react";
// import { routes } from 'virtual:pwa-entry-module';

import './tailwind.css';
import { useEffect } from "react";

export default function App() {

  // logger.log("App rendered", routes);

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
