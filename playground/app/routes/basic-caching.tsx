import { Storage } from "@remix-pwa/cache";
import { cacheFirst, toJSON } from "@remix-pwa/strategy";
import { logger } from "@remix-pwa/sw";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Fragment, useEffect, useRef, useState } from "react";
import Page from "~/components/Page";

export const loader = async () => {
  const date = new Date();

  return json({
    data: `Some random data --- 0xb8000 ----. Time: ${date.getMinutes()}:${date.getSeconds()}`,
    message: `Starting up the server at ${date.getMinutes()}:${date.getSeconds()}...`
  });
}

export const workerLoader = async ({ context }: any) => {
  const customStrategy = cacheFirst({
    cache: 'basic-caching',
    cacheQueryOptions: {
      ignoreSearch: true
    },
    cacheOptions: {
      maxItems: 5,
      ttl: 30 * 1_000 // 30 seconds time-to-live (maxAge)
    },

    fetchDidFail: [
      () => console.log('Fetch failed!')
    ]
  });

  let response = await customStrategy(context.event.request);

  // Testing out caching binary data - images, fonts, etc.
  // Btw, look above, caching strategy has a ttl of 30 secs.
  // Either be fast, or increase the time to test this out.
  await customStrategy(new Request('https://images.unsplash.com/photo-1695570804246-a9470af7e197?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2903&q=80'))

  let data = await toJSON(response);

  const date = new Date();

  // We showcase caching by extracting the data from the response and returning it,
  // modifying one of its properties and returning it back to the client (which is only
  // possible if we have a cached value to modify.)
  return new Response(JSON.stringify({
    data: data.data,
    // Only this shows an updated time, the other one doesn't because it's cached.
    // Try deleting the cache and reloading the page to see the difference.
    message: `Server already up and running! Time: ${date.getMinutes()}:${date.getSeconds()}`
  }), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export default function BasicCaching() {
  const loaderData = useLoaderData();
  const imgRef = useRef<HTMLImageElement>(null);
  const [imageSrc, setImageSrc] = useState('https://images.unsplash.com/photo-1695606393084-9c4490ccf667?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80' as string);

  useEffect(() => {
    if (typeof window === undefined) return;

    (async () => {
      const cache = await Storage.get('basic-caching')!;

      cache!.match('https://images.unsplash.com/photo-1695570804246-a9470af7e197?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2903&q=80').then((response) => {
        if (response) {
          response.blob().then((blob) => {
            setImageSrc(URL.createObjectURL(blob));
            imgRef.current!.src = URL.createObjectURL(blob);
            logger.log('Image loaded from cache!');
          })
        } else {
          logger.error('No response found!', response);
        }
      })
    })();
  }, [loaderData])

  return (
    <Page
      title="Basic Caching"
      color="bg-indigo-600/50"
      loaderData={loaderData}
      loaderDataContent={
        <Fragment>
          <blockquote className="p-3 my-3 border-l-4 border-gray-300 bg-gray-50 dark:border-gray-500 dark:bg-gray-800">
            <p className="text-lg font-medium leading-relaxed text-gray-900 dark:text-white">Constant Data: "{loaderData.data}"</p>
            <p className="text-lg font-medium leading-relaxed text-gray-900 dark:text-white">Vary Message: "{loaderData.message}"</p>
            <img src={imageSrc} ref={imgRef} alt="cached-img" />
          </blockquote>
        </Fragment>
      }
      workSection={
        <Fragment>
          <p className="indent-6 px-1">
            This page makes use of a basic cache using the <code>CacheFirst</code> strategy, meaning when a fetch is made,
            the response is first attempted to be pulled out from the cache and if it is found, it returns it. Else it fetches from
            the network, updates the cache and returns the response.
          </p>
          <p className="indent-6 px-1">
            The cache is configured to only hold a maximum of 5 items and each item has a time-to-live of 30 seconds. That's right,
            caches in<code> remix-pwa</code> now supports time-to-live and size limit for caches (plus more)! This means
            that if you navigate back to the page within 30 seconds of the first visit, you'll see the same data (from the cache),
            but if you wait for more than 30 seconds, you'll see the data being updated - the time will be different (fetched from the network).
          </p>
        </Fragment>
      }
      replicateSection={
        <Fragment>
          <p className="indent-6 px-1">
            Firstly, open your browser's devtools and go to the <code>Application</code> tab. Then head over to the 'Storage' section
            and click on the clear storage button. This will clear all the caches and indexedDBs. Now, reload the page and you'll see
            the data being fetched from the network and the message being updated. Take note of the 'Vary Message' field in the loader
            data tab.
          </p>
          <p className="indent-6 px-1">
            Next, hit the back button to go back one step and come back to this page. You'll see that the data is still being fetched
            from the network (check the <code>Network</code> tab to confirm) but the 'Vary Message' field has changed. This is because
            the <code>workerLoader</code> is now intercepting the request and updating the message.
          </p>
          <p className="indent-6 px-1">
            Now, go back (make sure 30 seconds hasn'
            elapsed!) and come back to this page. You'll see that the data is now being fetched from the cache and the time in the 'Constant
            Data' field has not changed, but the 'Vary Message' field has changed. This is because the cache is still valid and using the time
            saved in the cache but the time in 'Vary Message' is being updated by the <code>workerLoader</code>.
          </p>
        </Fragment>
      }
    />
  );
}
