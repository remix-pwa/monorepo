import { Link } from "@remix-run/react";

export const meta = () => {
  return [
    { title: "Worker actions & loaders" },
    { name: "description", content: "Progressive web apps proof of concept" },
  ];
};

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Remix PWA - Worker actions & loaders</h1>
      <ul>
        <Link to="/flights">Route loader and action</Link>
      </ul>
    </div>
  );
}
