import { usePWAManager } from "@remix-pwa/client";
import type { LoaderFunction} from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const loader: LoaderFunction = () => {
  return json({ message: "Hello from the server!" });
}

export const meta = () => {
  return [
    { title: "📦 Remix PWA Sandbox" },
    { name: "description", content: "Progressive web apps proof of concept" },
  ];
};

const CustomLink = ({ href, children }: any) => {
  return (
    <Link to={href} className="underline text-red-500 pt-1.5 hover:text-red-700">{children} {'>>'}</Link>
  )
}

export default function Index() {
  const { promptInstall } = usePWAManager();

  return (
    <div className="w-full h-screen flex flex-col px-6 mx-auto max-w-3xl">
      <div className="py-8 flex justify-between">
        <h1 className="text-2xl font-bold">Remix PWA - Worker Actions & Loaders</h1>
        <button
          type="submit"
          onClick={async () => {
            // alert("You're logged in!\n\nActually nothing happened 😅. Yet.");
            const doSMthg = () => console.log('Hehehe')
            await promptInstall(doSMthg);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
        >
          Log In
        </button>
      </div>
      <div className="bg-amber-500/40 w-full flex-1 rounded-2xl mb-10 px-4 py-6 overflow-y-auto">
        <div>
          <h3 className="text-lg pb-2 font-medium">Basic Worker Loaders</h3>
          <article>
            Remix PWA evolution now includes loaders and actions that run solely on the worker thread. Utilizing esbuild
            in its new compiler, Remix PWA now seeks to provide a more robust and performant experience for developers.
          </article>
          <CustomLink href={'/basic-loader'}>Basic loaders route</CustomLink>
        </div>
        <div className="pt-4">
          <h3 className="text-lg pb-2 font-medium">Basic Worker Actions</h3>
          <article>
            Worker actions are much more wicked than their loader counterparts. That's also right, Remix PWA now intercepts 
            &nbsp;<b>everything</b>! Including <code>POST</code>, <code>PUT</code>, etc. requests. This means that you can now
            intercept all requests and do whatever you want with them. Click the link below to see it in <span className="underline">action</span>!
            &nbsp;(got it, eh?)
          </article>
          <CustomLink href={'/basic-action'}>Basic actions route</CustomLink>
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
          <h3 className="text-lg pb-2 font-medium">Syncing your app 💿</h3>
          <article>
            Normally when you have no network and something fails, if it isn't something cached like a page or data, you get 
            an error and that's it. What if I submitted something? Or requested something? The user had to manually retry again. 
            Good thing we used the word "<span className="underline">had</span>", click the link to find out what's changed.
          </article>
          <CustomLink href={'/sync-away'}>Break the internet</CustomLink>
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
        <div className="pt-4">
          <h3 className="text-lg pb-2 font-medium">Caching Strategies</h3>
          <article>
            Remix PWA has embraced the strategy approach since <code>remix-pwa@v2</code> and we haven't let go in the next major 
            version bump. Bringing back all four strategies (Cache Only, Cache First, Network Only, Network First) as well as a 
            new one - Stale While Revalidate, this version 
          </article>
          <CustomLink href={'/strategies'}>Explore caching strategies</CustomLink>
        </div>
        <div className="pt-4">
          <h3 className="text-lg pb-2 font-medium">Caching: A deeper dive 🤿</h3>
          <article>
            We have so far been using strategy wrappers to interact with the cache, a cache that seems super-charged thanks to its 
            new capabilities. How about we dive a bit deeper under the hood and tinker with stuffs by ourselves? Remix PWA is 
            against too much abstraction and we abstract only when deemed necessary, meaning you can say hello 
            to <code>@remix-pwa/cache</code>! The package that makes all of this possible.
          </article>
          <CustomLink href={'/basic-caching'}>Begin the dive 🏊‍♀️</CustomLink>
        </div>
        <div className="pt-4">
          <h3 className="text-lg pb-2 font-medium">Utilities: A lot of them too!</h3>
          <article>
            This update doesn't just bring new caching packages, it also includes the long-awaited 
            &nbsp;<code>@remix-pwa/client</code> package that enhances the feel of your app much further. Follow the link 
            to head into a no-rule zone showcasing some (we can't showcase all!) of the prominent features this update brings.
          </article>
          <CustomLink href={'/basic-caching'}>Begin the dive 🏊‍♀️</CustomLink>
        </div>
      </div>
    </div>
  );
}
