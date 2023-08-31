import { redirect } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { useActionData, useFetcher } from "@remix-run/react";
import { useEffect } from "react";

export const action: ActionFunction = async () => {
  const actionData = {
    message: 'This is from a simple action. Nothing more to see here.'
  }

  return redirect('/error-would-happen', {
    headers: {
      'Set-Cookie': `actionData=${JSON.stringify(actionData)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=31536000`
    }
  });
}

export const workerAction = async ({ context }) => {
  const { fetchFromServer } = context;

  try {
    // We are now calling the actual Remix action here, but like you can see 
    // we are doing nothing with it, so no redirect happens 😏
    //
    // But open up the 'Cookies' section in your devtools.
    await fetchFromServer() as unknown as Response;
  } catch (error) {
    console.error(error);
  }

  console.log('worker action called');

  return new Response(JSON.stringify({
    message: 'Modified action response, Remix Actions are quite out of the picture here'
  }), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    }
  });
}

export const shouldRevalidate: ShouldRevalidateFunction = ({
  defaultShouldRevalidate,
  actionResult
}) => {
  if (actionResult) {
    return false;
  }

  return defaultShouldRevalidate;
}

export default function BasicAction() {
  const fetcher = useFetcher();
  const actionData = useActionData<typeof workerAction>();

  useEffect(() => {
    console.log(actionData)
  }, [actionData])

  const submit = () => {
    fetcher.submit({ 'text': 'test script' }, { method: 'POST' })
  }

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
            <p>Submit to see weird stuff</p>
          )}
        </div>
        <div className="mt-6">
          <h3 className="font-medium text-lg">How does it work?</h3>
          <p className="indent-6 px-1">
            ...
          </p>
        </div>
        <div className="mt-6">
          <h3 className="font-medium text-lg">See the behaviour in action</h3>
          <p className="indent-6 px-1">
            ...
          </p>
          <button onClick={submit}>Submit</button>
        </div>
      </div>
    </div>
  )
}