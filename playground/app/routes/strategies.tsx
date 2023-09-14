import { cacheFirst, cacheOnly, networkFirst, staleWhileRevalidate } from "@remix-pwa/strategy";
import type { StrategyResponse } from "@remix-pwa/strategy";
import type { WorkerActionFunction } from "@remix-pwa/sw";
import type { ActionArgs } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();

  console.log(Object.fromEntries(formData));

  return null;
}

export const workerAction: WorkerActionFunction = async ({ context }) => {
  const { event } = context;

  const formData = await event.request.clone().formData(); // We cloned it so we can use the request later

  const strategy = formData.get("strategy");
  // const message = formData.get("message");

  let customStrategy: StrategyResponse | undefined = undefined;

  switch (strategy) {
    case 'cache-only':
      customStrategy = await cacheOnly({
        cache: 'strategies-cache-only',
      });
      break;
    case 'cache-first':
      customStrategy = await cacheFirst({
        cache: 'strategies-cache-first',
      })
      break;
    case 'network-first':
      customStrategy = await networkFirst({
        cache: 'strategies-network-first',
      })
      break;
    case 'swr':
      customStrategy = await staleWhileRevalidate({
        cache: 'strategies-swr',
      })
      break;
    default:
      break;
  }

  // if (customStrategy !== undefined) customStrategy(event.request)

  return null;
}

export default function Strategies() {
  const actionData = useActionData<typeof workerAction>();

  return (
    <div className="w-full h-screen px-6 flex flex-col mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold py-8">Exploring Strategies</h1>
      <div className="w-full flex-1 rounded-2xl mb-10 px-4 py-6 bg-lime-400/50 overflow-y-auto">
        <div>
          <h3 className="text-xl font-medium">Result:</h3>
          {actionData ? (
            <blockquote className="p-3 my-3 border-l-4 border-gray-300 bg-gray-50 dark:border-gray-500 dark:bg-gray-800">
              <p className="text-lg font-medium leading-relaxed text-gray-900 dark:text-white">"{actionData.message}"</p>
            </blockquote>
          ) : (
            <p className="text-lg">Nothing to see here</p>
          )}
        </div>
        <div className="mt-5">
          <Form method="post">
            <div className="mb-6">
              <label htmlFor="default-input" className="block mb-2 text-sm font-medium text-gray-900">Message</label>
              <input type="text" id="default-input" name="message" placeholder="Type a message to cache" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
            </div>
            <h3 className="mb-4 font-semibold text-gray-900 ">Strategy</h3>
            <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex ">
              <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r">
                <div className="flex items-center pl-3">
                  <input id="cache-only" type="radio" defaultChecked value="cache-only" name="strategy" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2" />
                  <label htmlFor="cache-only" className="w-full py-3 ml-2 text-sm font-medium text-gray-900">Cache Only </label>
                </div>
              </li>
              <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r">
                <div className="flex items-center pl-3">
                  <input id="cache-first" type="radio" value="cache-first" name="strategy" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2" />
                  <label htmlFor="cache-first" className="w-full py-3 ml-2 text-sm font-medium text-gray-900">Cache First</label>
                </div>
              </li>
              <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r">
                <div className="flex items-center pl-3">
                  <input id="network-first" type="radio" value="network-first" name="strategy" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2" />
                  <label htmlFor="network-first" className="w-full py-3 ml-2 text-sm font-medium text-gray-900">Network First</label>
                </div>
              </li>
              <li className="w-full">
                <div className="flex items-center pl-3">
                  <input id="swr" type="radio" value="swr" name="strategy" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2" />
                  <label htmlFor="swr" className="w-full py-3 ml-2 text-xs font-medium text-gray-900">Stale While Revalidate</label>
                </div>
              </li>
            </ul>
            <button className="inline-flex mt-6 items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-lime-600 hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500">Submit</button>
          </Form>
        </div>
        <div className="mt-6">
          <h3 className="font-medium text-lg">How does it work?</h3>
          <p className="indent-5 px-1">
            ...
          </p>
        </div>
        <div className="mt-6">
          <h3 className="font-medium text-lg">See the behaviour in action</h3>
          <p className="indent-5 px-1">
            Click the 'Submit' button below to trigger the action.
          </p>
        </div>
      </div>
    </div>
  )
}
