import { Markdown, Page, PageContent, PageFooter, PageTitle } from "~/components";
import { TableOfContents } from "~/types";
import { LazyLoadingDemo } from "./components/lazy-demo";

export const handle = {
  tableOfContents: [
    {
      title: 'Lazy Loading'
    },
    {
      title: 'Bookmarking Images'
    },
    {
      title: 'Fallbacks for Missing Images'
    },
    {
      title: 'Rounding Up'
    }
  ]
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
          In the world of web applications, efficient image handling is crucial. We all love images—they make the web more vibrant and engaging. But, they can also be heavy on bandwidth and slow to load, especially on slower networks. That is where smart image caching comes in.

          In the previous section, we handled text content, in this section, we'll explore some cool techniques to ensure that your images load quickly, even when your users are offline. We'll look at lazy loading, how to bookmark and download images for offline use, and how to handle missing or slow-loading images with fallbacks. Let's dive in!
        
          ### Lazy Loading

          Lazy loading is a technique that defers the loading of non-critical resources at page load time. Instead, these resources are loaded only when they are needed. This can help reduce the initial page load time and save bandwidth.

          Lazy loading is like waiting until you're almost at the checkout counter before grabbing that impulse-buy candy bar. Why load all the images on a page when the user might not even scroll that far? With lazy loading, we only load images as they come into view.

          But what happens when the user is offline or on a slow connection? That’s where service workers come to the rescue, ensuring that even lazily loaded images are available when needed.
        `}
        </Markdown>
        <LazyLoadingDemo />
        <Markdown>
          {`
            ### Bookmarking Images

            Imagine you're browsing an online gallery, and you find a picture you want to keep. What if you could bookmark it and have it available offline? Better yet, what if you could download it for offline viewing?

            In a PWA, we can use service workers to cache these bookmarked images locally. This not only makes them available offline but also allows you to download and save them permanently on your device.
          `}
        </Markdown>
        {/* Demo */}
        <Markdown>
          {`
            ### Fallbacks for Missing Images

            Ever had an image fail to load on a slow connection? It’s frustrating, right? Fallbacks are like the safety net that catches you when things go wrong. If an image fails to load or takes too long, we can display a placeholder image instead.

            In a web application, this is especially important. We can use service workers to detect when an image fails to load and automatically serve a cached placeholder instead.
          `}
        </Markdown>
        {/* Demo */}
        <Markdown>
          {`
            ### Rounding Up

            Efficient image caching is a game-changer for PWAs. From lazy loading to offline bookmarking and smart fallbacks, these strategies ensure that your images are always there when your users need them. Not only does this improve performance, but it also creates a smoother, more enjoyable user experience.

            Next time you're building a PWA, remember these techniques. They’ll keep your users happy, even when their network isn’t.
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
