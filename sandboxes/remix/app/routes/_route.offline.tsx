import Page, { PageDetails } from "~/components/Page";
import { Wifi } from "lucide-react";
import { APIExplorerDemo, Demo, DemoDescription, DemoPlayground } from "~/components/Demo";

const PageContent = {
  title: "Offline",
  gradient: "from-blue-400 via-indigo-500 to-blue-400",
  description: "Build reliable offline experiences",
  details: "Create seamless offline experiences with custom offline pages, fallback content, and offline-first data strategies. Learn how to detect network status and adapt your app's behavior accordingly.",
  icon: <Wifi size={32} />
}

export default function Offline() {
  return (
    <Page {...PageContent}>
      <PageDetails {...PageContent} />
      <Demo>
        <DemoDescription>
          Test your app's offline capabilities. Toggle network connectivity to see how your app 
          behaves when offline and how it recovers when back online.
        </DemoDescription>
        <DemoPlayground>
          <APIExplorerDemo
            invokeApi={() => {}}
            apiResponse={null}
            name="Offline Page"
            btnText="Test Offline"
            isLoading={false}
            loadingText="Loading..."
          />
          <APIExplorerDemo
            invokeApi={() => {}}
            apiResponse={null}
            name="Network Status"
            btnText="Check Status"
            isLoading={false}
            loadingText="Checking..."
          />
        </DemoPlayground>
      </Demo>
    </Page>
  )
} 