import { Link } from "@remix-run/react";

export const meta = () => {
  return [
    { title: "📦 Remix PWA Sandbox" },
    { name: "description", content: "Progressive web apps proof of concept" },
  ];
};

const CustomLink = ({ href, children }: any) => {
  return (
    <Link to={href} className="underline text-red-400 pt-1.5 hover:text-red-500">{children} {'>>'}</Link>
  )
}

export default function Index() {
  return (
    <div className="w-full h-screen flex flex-col px-6 mx-auto max-w-3xl">
      <div className="py-8 flex justify-between">
        <h1 className="text-2xl font-bold">Remix PWA - Worker Actions & Loaders</h1>
        <button
          type="submit"
          onClick={() => {
            alert("You're logged in!\n\nActually nothing happened 😅. Yet.");
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
        >
          Log In
        </button>
      </div>
      <div className="bg-amber-700/40 w-full flex-1 rounded-2xl mb-10 px-4 py-6">
        <div>
          <h3 className="text-lg pb-2 font-medium">Basic Worker Loaders and Actions</h3>
          <article>
            Remix PWA evolution now includes loaders and actions that run solely on the worker thread. Utilizing esbuild
            in its new compiler, Remix PWA now seeks to provide a more robust and performant experience for developers.
          </article>
          <CustomLink href={'/basic'}>Basic loaders and actions</CustomLink>
        </div>
        <div className="pt-4">
          <h3 className="text-lg pb-2 font-medium">Pathless routes</h3>
          <article>
            Worker loaders & actions aren't just restricted to your normal routes, they also work in pathless routes!
            And yes, they have the same behaviour as Remix normal loaders and actions in that they are nested and exhibit
            a waterfall effect. Make sure to 'Log in' else unknown horrors awaits!
          </article>
          <CustomLink href={'/flights'}>Pathless Route</CustomLink>
        </div>
        <div className="pt-4">
          <h3 className="text-lg pb-2 font-medium">Basic Caching</h3>
          <article>
            Remix PWA now allows you to cache directly in your routes. Talk about finetuning your app's performance!
            In this demo, we would be caching the response from the server and returning it if it's available. If not,
            we would be returning the client's response instead. This is a very powerful feature that allows you to
            cache your responses directly in your routes. See you on the other side of the link 🚀!
          </article>
          <CustomLink href={'/basic-caching'}>Getting started with caching</CustomLink>
        </div>
      </div>
    </div>
  );
}
