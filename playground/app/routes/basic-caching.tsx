import { cacheFirst } from "@remix-pwa/strategy";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Fragment } from "react";

export const loader = async () => {
  const date = new Date();

  return json({
    data: `Some random data --- 0xb8000. Time: ${date.getMinutes()}:${date.getSeconds()}`,
    message: `Starting up the server at ${date.getMinutes()}:${date.getSeconds()}...`
  });
}

export const workerLoader = async ({ context }: any) => {
  const customStrategy = await cacheFirst({
    cache: 'basic-caching',
    cacheOptions: {
      maxItems: 5,
      ttl: 10 * 1_000 // 10 seconds
    },
    fetchDidFail: [
      () => console.log('Fetch failed!')
    ]
  });

  const response = await customStrategy(context.event.request);

  const data = await response.json();

  const date = new Date();

  // We showcase caching by extracting the data from the response and returning it,
  // modifying one of its properties and returning it back to the client (which is only
  // possible if we have a cached value to modify.)
  return new Response(JSON.stringify({
    data: data.data,
    // Only this shows an updated time, the other one doesn't because it's cached.
    // Try deleting the cache and reloading the page to see the difference.
    message: `Server already up and running! Time: ${date.getMinutes()}:${date.getSeconds()}`
  }), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export default function BasicCaching() {
  const loaderData = useLoaderData();

  return (
    <div className="w-full h-screen px-6 flex flex-col">
      <h1 className="text-2xl font-bold py-8">Basic Showcase</h1>
      <div className="w-full flex-1 rounded-2xl mb-10 px-4 py-6 bg-indigo-600/50">
        <div>
          <h3 className="text-xl font-medium">Loader Data:</h3>
          {loaderData ? (
            <Fragment>
              <blockquote className="p-3 my-3 border-l-4 border-gray-300 bg-gray-50 dark:border-gray-500 dark:bg-gray-800">
                <p className="text-lg font-medium leading-relaxed text-gray-900 dark:text-white">Constant Data: "{loaderData.data}"</p>
                <p className="text-lg font-medium leading-relaxed text-gray-900 dark:text-white">Vary Message: "{loaderData.message}"</p>
              </blockquote>
            </Fragment>
          ) : (
            <p>Loading...</p>
          )}
        </div>
        <div className="mt-6">
          <h3 className="font-medium text-lg">How does it work?</h3>
          <p>...</p>
        </div>
      </div>
    </div>
  );
}