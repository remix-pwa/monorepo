import Page, { PageDetails } from "~/components/Page";
import { Route as RouteIcon } from "lucide-react";
import { APIExplorerDemo, Demo, DemoDescription, DemoPlayground } from "~/components/Demo";

const PageContent = {
  title: "Route Worker Modules",
  gradient: "from-pink-500 via-purple-500 to-pink-500",
  description: "Handle specific routes in your service worker",
  details: "Route Worker Modules provide a powerful way to handle specific routes in your service worker. Learn how to implement different caching strategies, handle offline fallbacks, and manage network requests on a per-route basis.",
  icon: <RouteIcon size={32} />
}

export default function WorkerModules() {
  return (
    <Page {...PageContent}>
      <PageDetails {...PageContent} />
      <Demo>
        <DemoDescription>
          Explore how Route Worker Modules work in practice. Try out different caching strategies
          and see how they affect your application's behavior under various network conditions.
        </DemoDescription>
        <DemoPlayground>
          <APIExplorerDemo
            invokeApi={() => {}}
            apiResponse={null}
            name="Worker Loader"
            btnText="Test Loader"
            isLoading={false}
            loadingText="Loading..."
          />
          <APIExplorerDemo
            invokeApi={() => {}}
            apiResponse={null}
            name="Worker Action"
            btnText="Test Action"
            isLoading={false}
            loadingText="Loading..."
          />
        </DemoPlayground>
      </Demo>
    </Page>
  )
}
