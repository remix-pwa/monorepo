import type { ReactNode } from "react";
import { Fragment } from "react";

type PageProps = {
  title: string;
  color: string;
  loaderData: any | null;
  loaderDataContent: JSX.Element | ReactNode;
  workSection: JSX.Element | ReactNode;
  replicateSection: JSX.Element | ReactNode;
}

export default function Page({ title, color, loaderData, loaderDataContent, workSection, replicateSection }: PageProps) {
  return (
    <div className="w-full h-screen px-6 flex flex-col mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold py-8">{title}</h1>
      <div className={`w-full flex-1 rounded-2xl mb-10 px-4 py-6 ${color} overflow-y-auto`}>
        <div>
          <h3 className="text-xl font-medium">Loader Data:</h3>
          {loaderData ? (
            <Fragment>
              {loaderDataContent}
            </Fragment>
          ) : (
            <p>Loading...</p>
          )}
        </div>
        <div className="mt-6">
          <h3 className="font-medium text-lg">How does it work?</h3>
          {workSection}
        </div>
        <div className="mt-6">
          <h3 className="font-medium text-lg">See the behaviour in action</h3>
          {replicateSection}
        </div>
      </div>
    </div>
  )
}