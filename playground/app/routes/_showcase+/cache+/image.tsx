import { Markdown, Page, PageContent, PageFooter, PageTitle } from "~/components";
import { TableOfContents } from "~/types";

export const handle = {
  tableOfContents: []
} as { tableOfContents: TableOfContents };

export default function Component() {
  return (
    <Page>
      <PageTitle>
      Image Caching: Pic Preserver
      </PageTitle>
      <PageContent>
        <Markdown>
        {`
          
        `}
        </Markdown>
      </PageContent>
      <PageFooter
        prev={{ title: 'Text Caching: Word Vault', url: '/cache/text' }}
        next={{ title: 'A/V Caching: Media Vault', url: '/cache/media' }}
      />
    </Page>
  )
}
