import { Markdown, Page, PageContent, PageFooter, PageTitle } from "~/components";
import type { TableOfContents } from '~/types';
import { NetworkFirstDemo } from "./components/nf-demo";
import { StaleWhileRevalidateDemo } from "./components/swr-demo";
import { CacheOnlyDemo } from "./components/co-demo";
import { CacheFirstDemo } from "./components/cf-demo";
import { Disclaimer } from "~/components/layout/Disclaimer";

export const handle = {
  tableOfContents: [
    {
      title: 'Caching First',
      id: 'cache-first',
    },
    {
      title: 'Network First',
      id: 'network-first',
    },
    {
      title: 'Cache Only',
      id: 'cache-only',
    },
    {
      title: 'Stale While Revalidate',
      id: 'stale-while-revalidate',
    },
    {
      title: 'Conclusion',
      id: 'conclusion',
    }
  ]
} as { tableOfContents: TableOfContents };

export default function Component() {
  return (
    <Page>
      <PageTitle>
        Text Caching: Word Vault
      </PageTitle>
      <PageContent>
        <Markdown>
          {/* <!-- Think of caching as your app's personal assistant, always one step ahead, anticipating what you need before you even ask. It's not just about speed (though that's a big part of it); it's about creating smooth, responsive experiences for your users, even when the network decides to take a coffee break. --> */}
          {`
            Welcome to our first showcase on caching strategies with text! 🎉 Let's dive into the world of caching and see how it can make our web apps faster and more reliable.

            Caching is like having a secret stash of your favorite snacks. When you need a quick bite, you grab from your stash instead of running to the store. Similarly, caching stores data locally so that we can quickly access it without making a round trip to the server. This is super handy for improving performance and making our apps feel snappy. It's not just about speed (though that's a big part of it); it's about creating smooth, responsive experiences for your users, even when the network decides to take a coffee break.
          `}
        </Markdown>
        <Disclaimer>
          // Dumb this down.
          Remix PWA Showcase isn't necessarily a guide document, but rather a show-off of various possibilities.
        </Disclaimer>
        <Markdown>
          {`
            Caching can be summed up as storing data in a temporary location so that it can be retrieved quickly when needed. This can be anything from images and videos to JSON responses and HTML pages. The location could also be in a variety of places, such as the browser, a CDN, or a server.

            This showcase is all Remix PWA though 💫, so we'll be focusing on caching content in the browser with Remix PWA! Remix PWA provides four strategies for caching text content: *Cache First*, *Network First*, *Stale While Revalidate*, and *Cache Only*.

            A strategy is a set of rules that determine how the browser should cache and retrieve content. Each strategy has its own use case, and you can choose the one that best fits your app's needs. You can even use multiple strategies in one app!

            ### Cache First

            Imagine you get your morning coffee from your favorite cafe every day. One day, the barista sees you coming and already has your coffee ready before you even ask. That's cache-first for you! We check our local stash first, and if it's there, we use it.

            In web terms, this strategy checks the cache first and only goes to the network if it can't find what it needs locally. It's perfect for content that doesn't change often, like your app's logo or base CSS.
          `}
        </Markdown>
        <CacheFirstDemo />
        <Disclaimer>
          {`
            The demo window like the one above would be a regular occurence within Showcase. Meet the demo \`Iframe\`!

            The \`Iframe\` component allows us to show off live demos without the need to leave the page or alter the site's behaviour. It's a neat way to showcase interactive content, like the caching strategies above, without any hassle. It's like having a mini browser inside the page! 🚀
          `}
        </Disclaimer>
        <Markdown>
          {`
            Play around with the demo. Try going offline, clearing the cache, and changing the cache expiration time. See how it falls back to cache when offline? Or how it automatically goes back to the server when the content becomes stale (expires)? That's the magic of caching strategies! This is like grabbing your favorite coffee that's already made before deciding to brew a new one. If the coffee has gone weird or is not there, you brew a fresh one. ☕
          `}
        </Markdown>
        <Markdown>
          {`
            ### Network First

            Picture this: you want to hang out with a friend. You call them first before checking if they’re at home. If they don’t pick up, then you try to visit. That’s network-first! We try the network first, and if that fails, we fall back to the cache.
          
            This strategy tries to fetch fresh data from the network first, falling back to the cache if the network is unavailable. It's ideal for content that updates frequently but where having slightly outdated information is better than having none at all.
          `}
        </Markdown>
        <NetworkFirstDemo />
        <Markdown>
          {`
            With network first strategy, we always try to get the freshest content from the network. If the network is down, we fall back to the cache.

            This is one of the most common strategies for dynamic content like news articles, social media feeds, or weather updates. It ensures that users always get the latest information, with something to show even when the network has gone for a snooze. 🛰️
          `}
        </Markdown>
        <Disclaimer>
          {`
          Do you know you can use strategies as one-time wrappers for requests?

          Do you also know that you can use strategies in the browser as well (and not just Service Workers)?
          `}
        </Disclaimer>
        <Markdown>
          {`
            ### Cache Only

            Now, think about those times you rely solely on your grocery list at home. No internet, no new items, just what's on your list. Cache-only works the same way: it only looks at the local cache and doesn't even bother with the network.

            This strategy is perfect for content that doesn't change often and doesn't need to be updated frequently. It's like your app's grocery list: you know what's on it, and you don't need to check the store every time you need something.

            In our world, this means the app only looks at what's stored locally, never reaching out to the network. It's great for offline-first apps or when you want to guarantee lightning-fast responses. Just remember to actually store something in the cache first 💥!
            `}
        </Markdown>
        <CacheOnlyDemo />
        <Markdown>
          {`
            In this strategy, we relied solely on what's local. If the content isn't in the cache, boom! We get nothing, it simply won't be available. We also have the option to expire entries with this strategy, handy for ensuring periodic updates once in a while (like 365 days)

            This is a strategy that's great for offline-first apps or dormant (that should live forever) assets like favicon, other than that, tread carefully with this one 🤫.
          `}
        </Markdown>
        <Markdown>
          {`
            ### Stale While Revalidate

            Stale-while-revalidate is like eating leftovers while you wait for your delivery to arrive. You get quick access to something that might be a bit old, but you're also getting the freshest content in the background.

            In caching terms, this serves cached content immediately while fetching updates in the background. It's perfect for balancing speed and freshness. Your users get a quick response while the app ensures the content is up to date.
          `}
        </Markdown>
        <StaleWhileRevalidateDemo />
        <Markdown>
          {`
            ### Conclusion

            These strategies aren't just theoretical – they're the building blocks of smooth, responsive web applications. Whether you're building a news site that needs the latest updates, a documentation portal that prioritizes speed, or a progressive web app that works offline, understanding these caching strategies is key.

            If you liked the idea of these strategies, you can apply them to non-browser environments as well. Strategies are simply a set of rules that determine how you cache and retrieve content, not tied to any specific technology. You can have a redis cache that uses a cache-first strategy or a CDN that uses a network-first strategy. The possibilities are endless!

            Caching (in itself) isn't also just a neat trick; it's a game-changer. From improving page load times to making sure users can access content offline, the possibilities are endless. Whether you're building a blog, a news site, or a social media platform, smart caching and good strategy can make a huge difference.

            Next up, we'll see how we can apply similar principles to images. Ever wondered how some sites load images so fast you'd swear they were psychic? That's our next stop on this caching journey. Stay tuned, and keep your snack stash ready! 🥳
          `}
        </Markdown>
      </PageContent>
      <PageFooter next={{ title: 'Image Caching: Pic Preserver', url: '/cache/image' }} />
    </Page>
  )
}
