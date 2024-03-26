import type { WorkerActionArgs } from "@remix-pwa/sw";
import { redirect } from "@remix-run/node";
import { Form, useActionData, useFetcher } from "@remix-run/react";
import { useEffect } from "react";

export function action () {
  const actionData = {
    message: 'This is from a simple action. Nothing more to see here.'
  }

  return redirect('/error-would-happen', {
    headers: {
      'Set-Cookie': `actionData=${JSON.stringify(actionData)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=31536000`
    }
  });
}

export const workerAction = async ({ context }: WorkerActionArgs) => {
  const { fetchFromServer } = context;

  console.log('Worker action called');

  try {
    // We are now calling the actual Remix action here, but like you can see 
    // we are doing nothing with it, so no redirect happens 😏
    //
    // But open up the 'Cookies' section in your devtools for a little surprise.
    const response = await fetchFromServer() as unknown as Response;

    console.log(Object.fromEntries(response.headers.entries()));
  } catch (error) {
    console.error(error);
  }

  return new Response(JSON.stringify({
    message: 'Modified action response, Remix Actions are quite out of the picture here'
  }), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    }
  });
}

export const loader = () => {
  return null;
}

export default function BasicAction() {
  const fetcher = useFetcher();
  const actionData = useActionData<typeof workerAction>();

  const submit = () => {
    fetcher.submit({
      message: "Payload"
    }, {
      method: 'POST'
    })
  }

  useEffect(() => {
    if (fetcher.data) {
      console.log(fetcher.data);
    }
  }, [fetcher.data])

  return (
    <div className="w-full h-screen px-6 flex flex-col mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold py-8">Basic Action in action - <code>workerAction</code></h1>
      <div className="w-full flex-1 rounded-2xl mb-10 px-4 py-6 bg-fuchsia-500/50 overflow-y-auto">
        <div>
          <h3 className="text-xl font-medium">Action Data:</h3>
          {actionData ? (
            <blockquote className="p-3 my-3 border-l-4 border-gray-300 bg-gray-50 dark:border-gray-500 dark:bg-gray-800">
              <p className="text-lg font-medium leading-relaxed text-gray-900 dark:text-white">"{actionData.message}"</p>
            </blockquote>
          ) : (
            <p className="text-lg">Submit to see interesting stuff happen</p>
          )}
        </div>
        <div className="mt-6">
          <h3 className="font-medium text-lg">How does it work?</h3>
          <p className="indent-5 px-1">
            Remix PWA service workers intercept <b>all</b> fetch requests made, previously we were only dealing
            with GET requests and if they weren't, we would just let them pass through. That behaviour is still
            the default, but now we are introducing the ability to intentionally intercept them and do whatever you want to.
          </p>
          <p className="indent-5 px-1">
            Whenever a non-GET fetch request is made to a route that has an action, the service worker 
            will call the <code>workerAction</code> function if it exists. If it doesn't exist, it will just let the request 
            pass through like normal. If it does however, it will invoke the <code>workerAction</code> function
            which can now call the actual Remix action, modify the response, or do whatever you want to do.
          </p>
        </div>
        <div className="mt-6">
          <h3 className="font-medium text-lg">See the behaviour in action</h3>
          <p className="indent-5 px-1">
            Click the 'Submit' button below to trigger the action.
          </p>
          <p className="indent-5 px-1">
            By default, the <code>action</code> in this route returns a redirect response to a route that doesn't exist.
            Don't believe me? Comment out the worker action and re-submit. You'll see the redirect happen.
            Instead of redirecting though, we now see a message from the worker action instead.
          </p>
          <p className="indent-5 px-1">
            Open up the 'Cookies' section in your devtools and you'll see that the <code>actionData</code> cookie
            set by the <code>action</code> redirect. Actions still run like normal, but we are now able to modify
            the response and extend the functionality of Remix Actions like never before.
          </p>
          <p className="indent-5 px-1">
            The <code>useFetcher</code> response won't show up though. Check the console to see that one in action.
          </p>
          <Form method="post" className="mt-4">
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-fuchsia-600 hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500">Submit via&nbsp;<code>Form</code></button>
          </Form>
          <button onClick={submit} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-fuchsia-600 hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 mt-4">Submit via&nbsp;<code>useFetcher</code></button>
        </div>
      </div>
    </div>
  )
}