import Page, { PageDetails } from "~/components/Page";
import { RotateCw } from "lucide-react";
import { APIExplorerDemo, Demo, DemoDescription, DemoPlayground } from "~/components/Demo";

const PageContent = {
  title: "Background Sync",
  gradient: "from-green-400 via-cyan-500 to-green-400",
  description: "Handle offline data synchronization",
  details: "Learn how to implement background synchronization for offline-first applications. Handle offline form submissions, data updates, and ensure smooth data consistency when users go offline and reconnect.",
  icon: <RotateCw size={32} />
}

export default function BackgroundSync() {
  return (
    <Page {...PageContent}>
      <PageDetails {...PageContent} />
      <Demo>
        <DemoDescription>
          Experience background sync in action. Try submitting data while offline and see how 
          it synchronizes when connection is restored.
        </DemoDescription>
        <DemoPlayground>
          <APIExplorerDemo
            invokeApi={() => {}}
            apiResponse={null}
            name="Sync Demo"
            btnText="Test Sync"
            isLoading={false}
            loadingText="Syncing..."
          />
          <APIExplorerDemo
            invokeApi={() => {}}
            apiResponse={null}
            name="Queue Demo"
            btnText="Test Queue"
            isLoading={false}
            loadingText="Processing..."
          />
        </DemoPlayground>
      </Demo>
    </Page>
  )
} 