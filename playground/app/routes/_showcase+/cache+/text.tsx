import Heading from "~/components/Heading";
import Markdown from "~/components/Markdown";
import { Page, PageContent, PageTitle } from "~/components/Page";

export default function Component() {
  return (
    <Page>
      <PageTitle>
        Cache + Text
      </PageTitle>
      <PageContent>
        <Heading level={2}>
          Markdown
        </Heading>
        <Markdown>
          {`
            ### Hello, world!

            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea, debitis illo minima aspernatur perferendis harum eaque id facere iure cum!

            ### Another section

            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Asperiores, id.

            ### Last section

            Lorem ipsum dolor sit amet consectetur adipisicing elit. N
          `}
        </Markdown>
        {/* Custom components */}
        {/* More markdown */}
      </PageContent>
      {/* Page Footer */}
    </Page>
  )
}
