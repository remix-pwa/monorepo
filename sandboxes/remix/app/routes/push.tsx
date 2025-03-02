import { usePush } from "@remix-pwa/push/client";

export default function Basic() {
  const { canSendPush, isSubscribed, requestPermission, subscribeToPush, unsubscribeFromPush } = usePush()

  return (
    <div className="w-full h-screen px-6 flex flex-col mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold py-8">Basic Showcase - Push API 📱</h1>
      <div className="w-full flex-1 rounded-2xl mb-10 px-4 py-6 bg-blue-600/50 overflow-y-auto">
        <div className="grid col-span-2 grid-flow-col gap-2">
          <div className="w-full">
            <h3 className="text-xl font-medium">Browser can send notifications</h3>
            <blockquote className="p-3 my-3 border-l-4 border-gray-300 bg-gray-50 dark:border-gray-500 dark:bg-gray-800">
              <p className="text-lg font-medium leading-relaxed text-gray-900 dark:text-white">{canSendPush ? 'Yes, it can!' : 'Nope!'}</p>
            </blockquote>
          </div>
          <div className="w-full">
            <h3 className="text-xl font-medium">Subscribed to push?</h3>
            <blockquote className="p-3 my-3 border-l-4 border-gray-300 bg-gray-50 dark:border-gray-500 dark:bg-gray-800">
              <p className="text-lg font-medium leading-relaxed text-gray-900 dark:text-white">{isSubscribed ? 'Yep' : 'Nope'}</p>
            </blockquote>
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          <button
            className="inline-flex w-48 items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => {
              const permission = requestPermission()
              console.log(`The user's answer to your request was: ${permission}`)
            }}>
            Request Push Permission
          </button>
          {isSubscribed ? <button
            className="inline-flex w-48 items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => unsubscribeFromPush()}>
            Unsubscribe from Push
          </button> : <button
            className="inline-flex w-48 items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            // Private key: 8vXfjF-hDyvXEwLh1L8bEItMjon248yjpjMEJD3mPCQ
            onClick={() => subscribeToPush('BOdRhQunx1dsGYSVMuBkFquOdyVeknU4D7-LOMmzm8Jg4I-gA-K1BPGsSUic9L2ZJGJHtW3wMDRxzfdBYVKr5es', () => console.log('Subscribed to push!'))}>
            Subscribe to Push
          </button>}
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
