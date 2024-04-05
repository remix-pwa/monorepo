import { WorkerLoaderArgs } from "@remix-pwa/sw";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";

export function loader() {
  return json({
    user: {
      email: "email@provider.co",
      name: "Sandboxxxy",
    },
  });
}

export async function workerLoader({ context }: WorkerLoaderArgs) {
  const { fetchFromServer } = context;

  const data = await fetchFromServer().then((response: Response) => response.json());

  console.log(data);

  // This also works here!
  // This is a bit useless, ik. But it's just to show that you can use
  // worker loader and actions in pathless routes too!
  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
    },
  });
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
