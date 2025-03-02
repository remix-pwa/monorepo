import Page, { PageDetails } from "~/components/Page";
import { LayoutDashboard } from "lucide-react";
import { APIExplorerDemo, Demo, DemoDescription, DemoPlayground } from "~/components/Demo";

const PageContent = {
  title: "Layout Routes",
  gradient: "from-purple-500 via-violet-600 to-indigo-500",
  description: "Structure your PWA with nested layouts",
  details: "Understand how to use Remix's nested routing with PWA features. Learn to structure your app with shared layouts while maintaining optimal service worker caching and offline capabilities.",
  icon: <LayoutDashboard size={32} />
}

export default function Layouts() {
  return (
    <Page {...PageContent}>
      <PageDetails {...PageContent} />
      <Demo>
        <DemoDescription>
          Explore how nested layouts work with PWA features. See how different layout configurations
          affect caching and offline behavior.
        </DemoDescription>
        <DemoPlayground>
          <APIExplorerDemo
            invokeApi={() => {}}
            apiResponse={null}
            name="Nested Layout"
            btnText="Test Layout"
            isLoading={false}
            loadingText="Loading..."
          />
          <APIExplorerDemo
            invokeApi={() => {}}
            apiResponse={null}
            name="Layout Caching"
            btnText="Test Cache"
            isLoading={false}
            loadingText="Caching..."
          />
        </DemoPlayground>
      </Demo>
    </Page>
  )
} 