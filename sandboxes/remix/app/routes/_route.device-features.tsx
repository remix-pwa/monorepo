import Page, { PageDetails } from "~/components/Page";
import { Smartphone } from "lucide-react";
import { APIExplorerDemo, Demo, DemoDescription, DemoPlayground } from "~/components/Demo";

const PageContent = {
  title: "Device Features",
  gradient: "from-lime-500 via-amber-500 to-lime-500",
  description: "Access native device capabilities",
  details: "Integrate native device features like camera, geolocation, and sensors into your PWA. Learn how to request permissions and provide fallbacks for unsupported features.",
  icon: <Smartphone size={32} />
}

export default function DeviceFeatures() {
  return (
    <Page {...PageContent}>
      <PageDetails {...PageContent} />
      <Demo>
        <DemoDescription>
          Try out different device APIs and see how to integrate native features into your PWA.
          Test permission handling and feature detection.
        </DemoDescription>
        <DemoPlayground>
          <APIExplorerDemo
            invokeApi={() => {}}
            apiResponse={null}
            name="Camera Access"
            btnText="Test Camera"
            isLoading={false}
            loadingText="Accessing..."
          />
          <APIExplorerDemo
            invokeApi={() => {}}
            apiResponse={null}
            name="Geolocation"
            btnText="Get Location"
            isLoading={false}
            loadingText="Locating..."
          />
        </DemoPlayground>
      </Demo>
    </Page>
  )
} 