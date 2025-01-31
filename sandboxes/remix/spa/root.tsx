import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { installPWAGlobals } from "@remix-pwa/sw";

import './tailwind.css';

export function Layout({ children }: { children: React.ReactNode }) {
  installPWAGlobals()

  // useActivityMonitor()

  // useEffect(() => console.log(navigation), [navigation.location])

  // useEffect(() => {
  //   console.log('Something happened! in navigation', location, navigation, matches)
  // }, [navigation])

  // useEffect(() => {
  //   console.log('Something happened! in fetchers', fetchers)
  // }, [fetchers])

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function HydrateFallback() {
  return <p>Loading...</p>;
}
