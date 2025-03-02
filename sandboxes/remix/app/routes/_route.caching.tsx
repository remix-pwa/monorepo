import Page, { PageDetails } from "~/components/Page";
import { Database } from "lucide-react";
import { APIExplorerDemo, Demo, DemoDescription, DemoPlayground } from "~/components/Demo";

const PageContent = {
  title: "Caching Strategies",
  gradient: "from-orange-400 via-pink-600 to-orange-400",
  description: "Implement strategic caching for your PWA",
  details: "Learn how to implement various caching strategies like Cache-First, Network-First, and Stale-While-Revalidate. See how to cache assets, API responses, and dynamic content effectively.",
  icon: <Database size={32} />
}

export default function Caching() {
  return (
    <Page {...PageContent}>
      <PageDetails {...PageContent} />
      <Demo>
        <DemoDescription>
          Test different caching strategies in real-time. See how your app behaves with various 
          caching configurations and network conditions.
        </DemoDescription>
        <DemoPlayground>
          <APIExplorerDemo
            invokeApi={() => {}}
            apiResponse={null}
            name="Cache First"
            btnText="Test Cache-First"
            isLoading={false}
            loadingText="Loading..."
          />
          <APIExplorerDemo
            invokeApi={() => {}}
            apiResponse={null}
            name="Network First"
            btnText="Test Network-First"
            isLoading={false}
            loadingText="Loading..."
          />
        </DemoPlayground>
      </Demo>
    </Page>
  )
} 