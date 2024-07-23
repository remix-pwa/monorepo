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
import { useTheme } from './hooks/useTheme';
import { cn } from './utils';
import { useEffect } from "react";
import { useSWEffect } from "@remix-pwa/sw";

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
  useSWEffect()
  const theme = useTheme()

  useEffect(() => {
    const storeScrollValue = (window: Window) => {
      window.document.documentElement.dataset.scroll = window.screenY.toString()
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => {
        storeScrollValue(window)
      })
    }

    return () => {
      if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', () => {
        storeScrollValue(window)
      })
    }
    }
  }, [])

  return (
    <html lang="en" className={cn('h-full overflow-x-hidden antialiased', theme)} data-theme={theme}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <ClientHints />
        <Links />
      </head>
      <body className="size-full scroll-smooth text-slate-950 dark:text-white dark:bg-dark">
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
