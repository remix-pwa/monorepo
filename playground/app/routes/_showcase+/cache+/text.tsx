import { Iframe } from "~/components/Iframe";
import Markdown from "~/components/Markdown";
import { Page, PageContent, PageTitle } from "~/components/Page";
import { CacheFirst, json, WorkerLoaderArgs } from '@remix-pwa/sw';
import { useLoaderData, useRevalidator, useRouteLoaderData, ClientLoaderFunctionArgs, useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";

export const loader = () => {
  console.log('Wut')
  return new Response(
    'Raw text sent by the server 🎉!\nCurrent time is: '
    + new Date().toLocaleTimeString().replace(/:\d+ /, ' '),
  )
}

export const workerLoader = async ({ context }: WorkerLoaderArgs) => {
  const { event } = context
  const request = event.request;

  const strategy = new URL(request.url).searchParams.get('strategy')
  console.log('Strategy:', strategy)
  const cookie = JSON.parse(request.headers.get('cookie') || '{}')
  console.log('Cookie:', cookie)
  return null
}

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

            A strategy is a set of rules that determine how the browser should cache and retrieve content. Each strategy has its own use case, and you can choose the one that best fits your app's needs. You can even use multiple strategies in one app!

            ### Cache First

            Imagine you get your morning coffee from your favorite cafe every day. One day, the barista sees you coming and already has your coffee ready before you even ask. That's cache-first for you! We check our local stash first, and if it's there, we use it.

            In web terms, this strategy checks the cache first and only goes to the network if it can't find what it needs locally. It's perfect for content that doesn't change often, like your app's logo or base CSS.
            `}
        </Markdown>
        <CacheFirstDemo />
        <Markdown>
          {`
            ### Network First

            Picture this: you want to hang out with a friend. You call them first before checking if they’re at home. If they don’t pick up, then you try to visit. That’s network-first! We try the network first, and if that fails, we fall back to the cache.
          
            This strategy tries to fetch fresh data from the network first, falling back to the cache if the network is unavailable. It's ideal for content that updates frequently but where having slightly outdated information is better than having none at all.
          `}
        </Markdown>
        <Iframe title="Caching Text Content">
          Network first demo with more markdown explanation below
          lorem*150
        </Iframe>
        <Markdown>
          {`
            ### Cache Only

            Now, think about those times you rely solely on your grocery list at home. No internet, no new items, just what's on your list. Cache-only works the same way: it only looks at the local cache and doesn't even bother with the network.

            This strategy is perfect for content that doesn't change often and doesn't need to be updated frequently. It's like your app's grocery list: you know what's on it, and you don't need to check the store every time you need something.

            In our world, this means the app only looks at what's stored locally, never reaching out to the network. It's great for offline-first apps or when you want to guarantee lightning-fast responses. Just remember to actually store something in the cache first 💥!
            `}
        </Markdown>
        <Iframe title="Caching Text Content">
          Cache only demo with more markdown explanation below
        </Iframe>
        <Markdown>
          {`
            ### Stale While Revalidate

            Stale-while-revalidate is like eating leftovers while you wait for your delivery to arrive. You get quick access to something that might be a bit old, but you're also getting the freshest content in the background.

            In caching terms, this serves cached content immediately while fetching updates in the background. It's perfect for balancing speed and freshness. Your users get a quick response while the app ensures the content is up to date.

          `}
        </Markdown>
        <Iframe title="Caching Text Content">
          Stale while revalidate demo with more markdown explanation below
        </Iframe>
        <Markdown>
          {`
            ### Conclusion

            These strategies aren't just theoretical – they're the building blocks of smooth, responsive web applications. Whether you're building a news site that needs the latest updates, a documentation portal that prioritizes speed, or a progressive web app that works offline, understanding these caching strategies is key.

            If you liked the idea of these strategies, you can apply them to non-browser environments as well. Strategies are simply a set of rules that determine how you cache and retrieve content, not tied to any specific technology. You can have a redis cache that uses a cache-first strategy or a CDN that uses a network-first strategy. The possibilities are endless!

            Caching (in itself) isn't also just a neat trick; it's a game-changer. From improving page load times to making sure users can access content offline, the possibilities are endless. Whether you're building a blog, a news site, or a social media platform, smart caching and good strategy can make a huge difference.

            Next up, we'll see how we can apply similar principles to images. Ever wondered how some sites load images so fast you'd swear they were psychic? That's our next stop on this caching journey. Stay tuned, and keep your snack stash ready! 🥳
          `}
        </Markdown>
        {/* Custom components */}
        {/* More markdown */}
      </PageContent>
      {/* Page Footer */}
    </Page>
  )
}

const CacheFirstDemo = () => {
  const fetcher = useFetcher()
  const loaderData = useRouteLoaderData('routes/_showcase+/cache+/text')
  const [data, setData] = useState<string | null>(null)
  const [config, setConfig] = useState({ isOffline: false, expiration: 60 })

  useEffect(() => {
    // fetch('/cache/text?_data=routes/_showcase+/cache+/text', {
    //   mode: 'cors',
    //   headers: {
    //     'cookie': JSON.stringify({ config }).replace(/"/g, ''),
    //   }
    // })
  }, [])
  console.log('Loader data:', loaderData)

  return (
    <Iframe>
      <div className="">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laboriosam tenetur vitae delectus vel perferendis. Cum autem, tempora ad temporibus facere eum quis laboriosam debitis quibusdam. Numquam inventore labore iure eveniet?
        Voluptate libero cupiditate aspernatur velit. Cum recusandae harum nostrum magnam praesentium! Natus dolor quia eius iusto accusantium, alias at voluptatum aliquid laudantium, dolore corporis animi quis minus autem, exercitationem ex.
        Accusantium inventore beatae corporis at perferendis aliquid quam quae doloribus pariatur porro laboriosam, distinctio repudiandae voluptates optio maxime aspernatur ratione id veniam? Ipsam provident ipsum et quam, quae dolore qui.
        Esse, neque magni reprehenderit sequi modi maiores optio molestias atque ab, illo quasi eum voluptates nulla vero suscipit voluptas? Magni dicta id soluta porro mollitia laboriosam at hic, laudantium animi.
        At cumque porro possimus assumenda, ut nihil dolores voluptates, est a eveniet tenetur sint quam numquam voluptatem quo iure fugiat aspernatur perferendis eum cupiditate ullam! Necessitatibus minima amet enim aspernatur?
        Corporis facilis, delectus quae labore, doloribus nihil maxime dicta, incidunt quibusdam corrupti ad saepe? Expedita officia culpa eligendi soluta ipsa mollitia assumenda numquam. Inventore adipisci dignissimos, sed ullam sit deserunt?
        Tempora molestiae voluptatem odio ab vel quis quam, quaerat officiis? Eius quis, placeat ad molestiae ex debitis itaque facere quia autem ipsa harum recusandae aliquid assumenda odit quos fuga excepturi.
        Ab, voluptatum? Corrupti temporibus, repellendus magni ratione voluptas omnis debitis quasi eius numquam fuga. Dolorem dicta minima eius temporibus, quaerat magni maiores ex totam eligendi nisi reprehenderit fugiat repellendus sit.
      </div>
    </Iframe>
  )
}