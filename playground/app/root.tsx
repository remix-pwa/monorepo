import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import './tailwind.css';

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
