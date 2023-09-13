import { json } from "@remix-run/router";
import { useLoaderData } from "@remix-run/react";

export async function loader() {
  return json({ selections: [] });
}

export async function workerLoader({ context }) {
  const { database } = context;
  const selections = await database.selections.toArray();
  return json({ selections });
}

export default function SelectionPage() {
  const { selections } = useLoaderData();
  return (
    <article>
      <h1>Here is your selection</h1>
      <code>{JSON.stringify(selections, 2, null)}</code>
    </article>
  );
}
