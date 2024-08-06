import { Page, PageContent, PageFooter, PageTitle } from "~/components";
import { TableOfContents } from "~/types";

export const handle = {
  tableOfContents: []
} as { tableOfContents: TableOfContents };

export default function Component() {
  return (
    <Page>
      <PageTitle>
        Caching Images
      </PageTitle>
      <PageContent>
        {''}
      </PageContent>
      <PageFooter
        prev={{ title: 'Caching Text Content', url: '/cache/text' }}
        next={{ title: 'Media stuffs', url: '/cache/media' }}
      />
    </Page>
  )
}
