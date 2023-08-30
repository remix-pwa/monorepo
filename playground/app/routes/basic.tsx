import type { LoaderFunction } from "@remix-run/node";
import { defer } from "@remix-run/node"
import { Await, useLoaderData } from "@remix-run/react";
import { Fragment, Suspense } from "react";

export const action = async () => {
  return null
}

export const loader: LoaderFunction = async () => {
  const promise = new Promise((resolve) => setTimeout(() => resolve('Hello World!\n\n• This message is sent to you from the server 💻!'), 5000));
  
  return defer({
    message: promise
  });
}

export const workerLoader = async ({ context }: any) => {
  // `fetchFromServer` is a utility function provided to 
  // allow you to make requests to the server directly from the worker.
  const { fetchFromServer } = context;

  // In here, we are racing between the server and client to see who can
  // return the data first. By default, client resolves first, but if the server
  // is faster, then the server's data will be returned instead. We can also use 
  // Promise.allSettled to get both results and return the server data if it's
  // available. 
  //
  // Check --- 'Basic Caching' for more info.
  const message = await Promise.race([
    fetchFromServer()
      .then((response: any) => response.json())
      .then(({ message }: any) => message),
    new Promise((resolve) => setTimeout(resolve, 500, 'Hello World!\n\n• This message is sent to you from the client 😜!'))
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
  const loaderData = useLoaderData();

  return (
    <div className="w-full h-screen px-6 flex flex-col mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold py-8">Basic Showcase</h1>
      <div className="w-full flex-1 rounded-2xl mb-10 px-4 py-6 bg-blue-600/50">
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
          <p>...</p>
        </div>
      </div>
    </div>
  )
}
