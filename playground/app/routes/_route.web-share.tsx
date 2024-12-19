import Page, { PageDetails } from "~/components/Page";
import { Share2 } from "lucide-react";
import { APIExplorerDemo, Demo, DemoDescription, DemoPlayground } from "~/components/Demo";

const PageContent = {
  title: "Web Share",
  gradient: "from-cyan-400 via-sky-500 to-blue-500",
  description: "Enable native sharing features",
  details: "Implement the Web Share API to allow users to share content using their device's native sharing capabilities. Learn how to share text, links, files, and handle sharing targets.",
  icon: <Share2 size={32} />
}

export default function WebShare() {
  return (
    <Page {...PageContent}>
      <PageDetails {...PageContent} />
      <Demo>
        <DemoDescription>
          Try out the Web Share API features. Test sharing different types of content and
          handling various sharing scenarios.
        </DemoDescription>
        <DemoPlayground>
          <APIExplorerDemo
            invokeApi={() => {}}
            apiResponse={null}
            name="Share Text"
            btnText="Share Message"
            isLoading={false}
            loadingText="Sharing..."
          />
          <APIExplorerDemo
            invokeApi={() => {}}
            apiResponse={null}
            name="Share File"
            btnText="Share File"
            isLoading={false}
            loadingText="Preparing..."
          />
        </DemoPlayground>
      </Demo>
    </Page>
  )
} 