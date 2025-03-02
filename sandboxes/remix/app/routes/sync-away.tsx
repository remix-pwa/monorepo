import type { WorkerActionArgs } from "@remix-pwa/sw";
import {  } from "@remix-pwa/sync";
import { redirect } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";

export const action: ActionFunction = () => {
  const urgentToken = {
    key: 'Remix PWA',
    id: '9eU3n4_x55',
  }

  return redirect('/auth-success', {
    headers: {
      'Set-Cookie': `userToken=${urgentToken.id}; Path=/; HttpOnly; SameSite=Strict; Max-Age=3600`
    }
  });
}

export const workerAction = async ({ context }: WorkerActionArgs) => {
  const { fetchFromServer, event } = context;

  try {
    // We are now calling the actual Remix action here, but like you can see
    // we are doing nothing with it, so no redirect happens 😏
    //
    // But open up the 'Cookies' section in your devtools for a little surprise.
    await fetchFromServer() as unknown as Response;
  } catch (error) {
    console.error(error);
    // queueToServer({
    //   name: 'offline-action',
    //   request: event.request.clone(),
    // })
  }

  return new Response(JSON.stringify({
    message: 'Offline or Online. I shall always respond!'
  }), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    }
  });
}

export default function Sync() {
  const actionData = useActionData<typeof workerAction>();

  return (
    <div className="w-full h-screen px-6 flex flex-col mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold py-8">Breaking the App</h1>
      <div className="w-full flex-1 rounded-2xl mb-10 px-4 py-6 bg-red-500/50 overflow-y-auto">
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
            To fully understand what's happening here, you need to replicate the behaviour first. Head to the next step, when you
            are done, come back here and read on.
          </p>
          <p className="indent-5 px-1">
            First thing, what you just witnessed is called <a href="https://github.com/WICG/background-sync/blob/main/explainers/sync-explainer.md#background-synchronization-explained" className="font-medium underline">background Sync</a>.
            It's a new API that allows you to queue requests when you are offline and then send them when you are back online. What just happened was that when you went offline and submitted
            the form, the request attempted to go to the action but failed. The service worker then intercepted the request and queued it. When you came back online, the service worker
            automatically sent the request to the action and it succeeded. The cookie getting updated was as a result of a redirect in the action (check the network tab) with a <code>Set-Cookie</code> header.
          </p>
          <p className="indent-5 px-1">
            This is a simple example of how you can use background sync to make your app more robust and resilient. You can also use it to send analytics data, or even send a request to a third party API.
            talk about scheduling emails even when offline, requesting the latest news or just logging out 😁. You can take this a step further by returning a response from the service worker, so that the user
            UI automatically updates whenever the request is finally successful.
          </p>
          <p className="indent-5 px-1">
            Under the hood, it works with a queue system, IndexDB and a service worker. The service worker intercepts the request, saves it to the queue, then sends it when the network is back online.
          </p>
        </div>
        <div className="mt-6">
          <h3 className="font-medium text-lg">See the behaviour in action</h3>
          <p className="indent-5 px-1">
            First things first, clear your storage (in devtools) the go offline. You can head into the 'Service Worker', tab in devtools, 'Network' tab or
            'Network Conditions' tab and check the 'Offline' checkbox. Now, try to submit the form below. You should see
            a 'Failed to fetch' error in your console (forget about the failed to cache error). This is because we are offline
            and the service worker is unable to call the Remix action.
          </p>
          <p className="indent-5 px-1">
            We still get a response from the service worker though, and that's because we are calling the <code>workerAction</code>
            function and returning a response from it. Now, wait for 5-10 seconds, then go back online. Head over to the 'Cookies' tab and
            refresh the tab in there. You should see a new cookie with the name <code>userToken</code> and a value of <code>9eU3n4_x55</code>.
          </p>
          <p className="indent-0 px-1">
            What happened? Head back to the section above to find out what on earth just occured
          </p>
          <Form method="post" className="mt-4">
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">Submit</button>
          </Form>
        </div>
      </div>
    </div>
  )
}
