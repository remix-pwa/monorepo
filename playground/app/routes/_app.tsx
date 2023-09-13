import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { CacheFirst } from "@remix-pwa/sw";

const strategy = new CacheFirst({
  cacheName: "app-loader",
});

export function loader() {
  return json({
    user: {
      email: "email@provider.co",
      name: "Scandinavian",
    },
  });
}

export function workerLoader({ context }) {
  // The strategy needs the original untouch request.
  return strategy.handle(context.event.request);
}

export default function AppLayout() {
  const { user } = useLoaderData();
  return (
    <main>
      <header>
        <p>{user.email}</p>
        <p>{user.name}</p>
      </header>
      <Outlet />
    </main>
  );
}
