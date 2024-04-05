import { WorkerLoaderArgs } from "@remix-pwa/sw";
import type { LoaderFunction } from "@remix-run/node";
import { defer } from "@remix-run/node"
import { Await, useLoaderData } from "@remix-run/react";
import { Fragment, Suspense } from "react";

export const loader: LoaderFunction = async () => {
  const promise = new Promise((resolve) => setTimeout(() => resolve('Hello World!\n\n• This message is sent to you from the server 💻!'), 3000));

  return defer({
    message: promise
  });
}

export async function workerLoader ({ context }: WorkerLoaderArgs) {
  // `fetchFromServer` is a utility function provided to 
  // allow you to make requests to the server directly from the worker.
  const { fetchFromServer } = context;

  // In here, we are racing between the server and client to see who can
  // return the data first. By default, client resolves first, but if the server
  // is faster, then the server's data will be returned instead. We can also use 
  // Promise.allSettled to get both results and return the server data if it's
  // available. 
  const message = await Promise.race([
    fetchFromServer()
      .then((response: any) => response.json())
      .then(({ message }: any) => message)
      .catch(() => new Promise((resolve) => setTimeout(() => resolve(null), 5_000))), // utilizing a slower one even when cached
    new Promise((resolve) => setTimeout(resolve, 500, 'Hello World!\n\n• This message is sent to you from the client 😜 (Edited, again ---)!'))
  ]);

  return new Response(JSON.stringify({
    message
  }),
    {
      headers: {
        'Content-Type': 'application/json'
      }
    })
}

export default function Basic() {
  const loaderData = useLoaderData<typeof workerLoader>();

  return (
    <div className="w-full h-screen px-6 flex flex-col mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold py-8">Basic Showcase - <code>workerLoader</code></h1>
      <div className="w-full flex-1 rounded-2xl mb-10 px-4 py-6 bg-blue-600/50 overflow-y-auto">
        <div>
          <Suspense fallback={<p>Loading...</p>}>
            <Await resolve={loaderData.message} errorElement={<p>Unfortunately, unfortunate occured!</p>}>
              {(data) => (
                <Fragment>
                  <h3 className="text-xl font-medium">Loader Data:</h3>
                  <blockquote className="p-3 my-3 border-l-4 border-gray-300 bg-gray-50 dark:border-gray-500 dark:bg-gray-800">
                    <p className="text-lg font-medium leading-relaxed text-gray-900 dark:text-white">"{data}"</p>
                  </blockquote>
                </Fragment>
              )}
            </Await>
          </Suspense>
        </div>
        <div className="mt-6">
          <h3 className="font-medium text-lg">How does it work?</h3>
          <p className="indent-5 px-1">Since Remix utilises both SSR and client-side navigation, there are two ways data end up in your component:</p>
          <ul className="">
            <li className="indent-4 py-1">- Embeded in the initial HTML for document requests (hard refresh)</li>
            <li className="indent-4 py-1">
              - <code>fetch()</code> from the network for client side navigations
            </li>
          </ul>
          <p className="indent-5 px-1">
            Skipping the whole explanation for how Remix PWA handles the first case (check the docs), we'll focus on the second case.
            And that's where <code>workerLoader</code> comes in. It's a function that runs in the worker thread and is responsible for
            handling all the fetch requests made by the client (which conveniently happens on client-side navigation).
          </p>
          <p className="indent-5 px-1">
            One thing to note from this: <b><code>workerLoader</code> never runs on a document request. That behaviour is defaulted back to Remix
            &nbsp;<code>loader</code>.</b>
          </p>
          <p className="indent-5 px-1">
            On first load, it takes a while to load (we are running a slow promise in the server - 3s) and the loader data sections renders a message from the server.
            But if you navigate to another page and come back, the loader data section will render a message from the client instead. This is because the server
            is slow and the client is faster.
          </p>
          <p className="indent-5 px-1">
            In this example, we're racing between the server and client to see who can return the data first. By default, client resolves first, but if the server
            is faster, then the server's data will be returned instead. We can also use Promise.allSettled to get both results and return the server data if it's
            available.
          </p>
        </div>
        <div className="mt-6">
          <h3 className="font-medium text-lg">See the behaviour in action</h3>
          <p className="indent-6 px-1">
            Refresh the page (<code>Cmd + R</code>), it would take a while to load (we are running a slow promise in the server) and the loader data sections renders a message from the server.
            Then navigate back, and come back to this page. It takes much faster to load and the message has changed. That's the <code>workerLoader</code> in action. Feel free to play with the code!
          </p>
        </div>
      </div>
    </div>
  )
}
