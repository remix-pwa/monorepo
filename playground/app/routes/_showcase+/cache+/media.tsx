import { Markdown, Page, PageContent, PageFooter, PageTitle } from "~/components";
import { TableOfContents } from "~/types";

export const handle = {
  tableOfContents: []
} as { tableOfContents: TableOfContents };

export default function Component() {
  return (
    <Page>
      <PageTitle>
        A/V Caching: Media Vault
      </PageTitle>
      <PageContent>
        <Markdown>
          {`
          
          `}
        </Markdown>
      </PageContent>
      <PageFooter
        prev={{ title: 'Image Caching: Pic Preserver', url: '/cache/image' }}
      />
    </Page>
  )
}
