import Heading from "~/components/Heading";
import Markdown from "~/components/Markdown";
import { Page, PageContent, PageTitle } from "~/components/Page";

export default function Component() {
  return (
    <Page>
      <PageTitle>
        {/* Text in a Flash: Content Caching */}
        Caching Text Content
      </PageTitle>
      <PageContent>
        <Markdown>
        {/* <!-- Think of caching as your app's personal assistant, always one step ahead, anticipating what you need before you even ask. It's not just about speed (though that's a big part of it); it's about creating smooth, responsive experiences for your users, even when the network decides to take a coffee break. --> */}
          {`
            Welcome to our first showcase on caching strategies with text! 🎉 Let's dive into the world of caching and see how it can make our web apps faster and more reliable.

            Caching is like having a secret stash of your favorite snacks. When you need a quick bite, you grab from your stash instead of running to the store. Similarly, caching stores data locally so that we can quickly access it without making a round trip to the server. This is super handy for improving performance and making our apps feel snappy. It's not just about speed (though that's a big part of it); it's about creating smooth, responsive experiences for your users, even when the network decides to take a coffee break.

            // Disclamer: This showcase site isn't a guide but rather a showy way to demonstrate the concept of caching.

            Caching can be summed up as storing data in a temporary location so that it can be retrieved quickly when needed. This can be anything from images and videos to JSON responses and HTML pages. The location could also be in a variety of places, such as the browser, a CDN, or a server.

            This showcase is all Remix PWA though 💫, so we'll be focusing on caching content in the browser with Remix PWA! Remix PWA provides four strategies for caching text content: *Cache First*, *Network First*, *Stale While Revalidate*, and *Cache Only*.

            A strategy is a set of rules that determine how the browser should cache and retrieve content. Each strategy has its own use case, and you can choose the one that best fits your app's needs. You can even use multiple in one app!

            ### Cache First

            Imagine you get your morning coffee from your favorite cafe every day. One day, the barista sees you coming and already has your coffee ready before you even ask. That's cache-first for you! We check our local stash first, and if it's there, we use it.

            In web terms, this strategy checks the cache first and only goes to the network if it can't find what it needs locally. It's perfect for content that doesn't change often, like your app's logo or base CSS.

            // Demo here and explain below

            ### Network First

            ### Cache Only
            
            ### Stale While Revalidate

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
