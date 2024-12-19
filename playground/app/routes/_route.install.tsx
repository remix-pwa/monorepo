import Page, { PageDetails } from "~/components/Page";
import { Download } from "lucide-react";
import { APIExplorerDemo, Demo, DemoDescription, DemoPlayground } from "~/components/Demo";
import { usePWAManager } from "@remix-pwa/client";

const PageContent = {
  title: "Installability",
  gradient: "from-sky-400 via-indigo-600 to-sky-400",
  description: "Make your app installable",
  details: "Configure your PWA for installation with proper manifests, icons, and installation prompts. Learn how to customize the installation experience and track installation metrics.",
  icon: <Download size={32} />
}

export default function Install() {
  const { promptInstall } = usePWAManager();

  return (
    <Page {...PageContent}>
      <PageDetails {...PageContent} />
      <Demo>
        <DemoDescription>
          Test your app's installability features. See how installation prompts work and how
          to handle the installation lifecycle.
        </DemoDescription>
        <DemoPlayground>
          <APIExplorerDemo
            invokeApi={promptInstall}
            apiResponse={null}
            name="Install Prompt"
            btnText="Install App"
            isLoading={false}
            loadingText="Installing..."
          />
          <APIExplorerDemo
            invokeApi={() => {}}
            apiResponse={null}
            name="Installation Status"
            btnText="Check Status"
            isLoading={false}
            loadingText="Checking..."
          />
        </DemoPlayground>
      </Demo>
    </Page>
  )
} 