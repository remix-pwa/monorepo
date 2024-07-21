import {
  json,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { getTheme } from './.server/theme';
import { LoaderFunctionArgs } from "@remix-run/node";
import { ClientHints, getHints } from "./components/ClientHint";

import './tailwind.css';
import { useTheme } from './useTheme';
import { cn } from './utils';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({
    requestInfo: {
      hints: getHints(request),
      userPrefs: { theme: getTheme(request) },
    },
  })
}

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

// In app?
// usePWAHMR()

// logger.log("App rendered", msg);
// useEffect(() => {
//   console.log(updateAvailable);
// }, [updateAvailable]);


export function Layout({ children }: { children: React.ReactNode }) {
  const theme = useTheme()

  return (
    <html lang="en" className={cn('h-full overflow-x-hidden antialiased', theme)} data-theme={theme}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <ClientHints />
        <Links />
      </head>
      <body className="size-full scroll-smooth background">
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
