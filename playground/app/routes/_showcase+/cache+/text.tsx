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
        <Markdown>
          {`
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea, debitis illo minima aspernatur perferendis harum eaque id facere iure cum!

            ## Start

            ### Another section

            Lorem ipsum dolor sit, amet consectetur adipisicing elit. [Asperiores](https://example.com), id.

            - List item 1
            - List item 2
            - List item 3

            *Italics*, **bold** and ~~strikethrough~~.

            Wut?

            ### Last section

            Lorem ipsum dolor sit amet \`inline\` consectetur adipisicing elit. N

            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ad amet ipsam consequatur? Cupiditate, possimus? Accusantium.

            Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic, adipisci perferendis velit dicta amet, voluptates quisquam rerum placeat provident repellat ut id porro vero! Iste, ex vero. Fugiat, consequuntur modi.

            ## Final Chapter

            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Omnis unde delectus laudantium, aliquam, numquam nemo neque explicabo voluptatibus laboriosam, est deserunt fuga ipsa magni fugit magnam vitae eveniet!
            Quo, perspiciatis incidunt laboriosam hic assumenda quisquam odio consequatur eos nobis mollitia doloremque minus cum dolores ut sequi nemo nesciunt quod illum quasi voluptatibus velit tenetur at. Dolorum, delectus eius. Magnam doloribus consectetur officiis aliquam, dolorum iusto?
          `}
        </Markdown>
        {/* Custom components */}
        {/* More markdown */}
      </PageContent>
      {/* Page Footer */}
    </Page>
  )
}
