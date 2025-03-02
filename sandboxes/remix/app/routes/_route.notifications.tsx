import Page, { PageDetails } from "~/components/Page";
import { Bell } from "lucide-react";
import { APIExplorerDemo, Demo, DemoDescription, DemoPlayground } from "~/components/Demo";

const PageContent = {
  title: "Push Notifications",
  gradient: "from-amber-400 via-orange-500 to-red-500",
  description: "Implement push notifications",
  details: "Add push notifications to your PWA using the Push API and Notification API. Learn to handle notification permissions, send notifications, and respond to notification interactions.",
  icon: <Bell size={32} />
}

export default function Notifications() {
  return (
    <Page {...PageContent}>
      <PageDetails {...PageContent} />
      <Demo>
        <DemoDescription>
          Experiment with push notifications. Test permission requests, notification delivery,
          and interaction handling.
        </DemoDescription>
        <DemoPlayground>
          <APIExplorerDemo
            invokeApi={() => {}}
            apiResponse={null}
            name="Permission Request"
            btnText="Request Permission"
            isLoading={false}
            loadingText="Requesting..."
          />
          <APIExplorerDemo
            invokeApi={() => {}}
            apiResponse={null}
            name="Send Notification"
            btnText="Send Test"
            isLoading={false}
            loadingText="Sending..."
          />
        </DemoPlayground>
      </Demo>
    </Page>
  )
} 