import { Button, Carousel, Icon, IframeWrapper } from "~/components"
import { useRefresh } from "~/hooks/useRefresh"
import { Fragment, useEffect, useState } from "react";
import { cn } from "~/utils";
import { useCarouselState } from "~/hooks/useCarousel";

const DEMO_CODE = `
// in your service worker

import { EnhancedCache } from '@remix-pwa/sw';

// within the install event (using enhanced cache)
event.waitUntil(
  Promise.all([
    imgCache.preCacheUrls([PLACEHOLDER_IMG_URL]),
    // ...
  ])
);

// within default fetch handler
if (
  req.destination === 'image' &&
  url.pathname.includes(/* if applicable */)
) {
    return imgCache.handleRequest(event.request);
}

// in your component

`;

export const BookmarkingImagesDemo = () => {
  const { refreshCounter, refresh } = useRefresh();
  const { currentIndex, updateIndex } = useCarouselState(5);
  const [images, setImages] = useState<string[]>([]);
  const [config, setConfig] = useState({ isOffline: false })
  const [loadedImages, setLoadedImages] = useState<string[]>([]);
  // {
  //   index: objectURL,
  // }
  const [bookmarkedImages, setBookmarkedImages] = useState<any[]>([]);

  useEffect(() => {
    console.log('refreshing images')

    // Mock fetching image URLs
    const fetchImages = async () => {
      const imageUrls = [
        '/images/image-1.jpg',
        '/images/image-2.jpg',
        '/images/image-3.jpg',
        '/images/image-4.jpg',
        '/images/image-5.jpg',
      ];
      setImages(imageUrls);
    };

    fetchImages();

    // get bookmarked images (if any - from local storage)
    const bookmarkedImages = localStorage.getItem('bookmarked-images-demo');
    if (bookmarkedImages) {
      setBookmarkedImages(JSON.parse(bookmarkedImages));
    }
  }, [refreshCounter]);

  const handleImageLoad = async (url: string) => {
    if (config.isOffline) {
      const cache = await caches.open('image-cache');
      const cachedResponse = await cache.match(url);
      const bookmarkedIndex = bookmarkedImages.findIndex((img: any) => img.url === url);

      if (
        cachedResponse &&
        bookmarkedIndex !== -1
      ) {
        // const imageObjectURL = URL.createObjectURL(await cachedResponse.blob());
        setLoadedImages(prev => {
          prev[images.indexOf(url)] = bookmarkedImages[bookmarkedIndex]?.objectURL;
          return [...prev];
        });
        return;
      }

      return setLoadedImages(prev => {
        prev[images.indexOf(url)] = "/error.png"; // throws error
        return [...prev];
      });
    }

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.blob();
      })
      .then(blob => {
        const imageObjectURL = URL.createObjectURL(blob);
        setLoadedImages(prev => {
          prev[images.indexOf(url)] = imageObjectURL;
          return [...prev];
        });
      })
      .catch(() => {
        setLoadedImages(prev => {
          prev[images.indexOf(url)] = "/images/fallback.jpg";
          return [...prev];
        });
      });
  };

  const bookmarkImage = () => {
    const currentImage = images[currentIndex];
    const imageObjectURL = loadedImages[currentIndex];
    const isBookmarked = bookmarkedImages.findIndex((img: any) => img.url === currentImage) !== -1;

    if (isBookmarked) {
      setBookmarkedImages(prev => prev.filter((img: any) => img.url !== currentImage));
    } else {
      setBookmarkedImages(prev => [...prev, { url: currentImage, objectURL: imageObjectURL }]);
    }
  }

  const isBookmarked = () => {
    return bookmarkedImages.findIndex((img: any) => img.url === images[currentIndex]) !== -1;
  }

  const reset = () => {
    setLoadedImages([]);
  }

  return (
    <IframeWrapper
      title="Bookmarking Images"
      handleRefresh={() =>
        refresh(() => reset())
      }
      code={{
        content: DEMO_CODE,
        lang: 'ts',
      }}
    >
      <Fragment key={refreshCounter}>
        <div className="relative w-full mt-4">
          <Button variant="solid" color="secondary" className="absolute left-4">
            Clear Cache
          </Button>
          <div className="flex gap-x-2 h-7 mx-auto justify-center items-center pt-2">
            <div
              className={cn(
                "flex content-center gap-1 items-center cursor-pointer",
                isBookmarked() ? "text-c-green" : "text-c-gray"
              )}
              onClick={bookmarkImage}
            >
              <Icon name="bookmark" className="size-5 text-c-green" />
              <span>Bookmark</span>
            </div>
            <div className="flex">
              <Icon name="download" className="size-5 text-c-green" />
              <span>Download</span>
            </div>
          </div>
          <div
            onClick={() => setConfig(c => ({ ...c, isOffline: !c.isOffline }))}
            className={cn(
              "cursor-pointer flex content-center justify-center rounded-full bg-neon absolute right-4 text-white top-0 p-2",
              config.isOffline ? "bg-red-500 hover:bg-red-500/80" : "bg-c-green hover:bg-c-green/80"
            )}
          >
            <Icon name={config.isOffline ? "wifi-off" : "wifi"} className="size-5" />
          </div>
        </div>
        <div className="px-0 md:px-4 py-3 relative mt-3">
          <Carousel
            onSlideChange={updateIndex}
            autoplay={false}
            size="sm"
            images={
              images.map((url, index) => (
                <img
                  key={index}
                  className="object-cover size-full"
                  src={loadedImages[index] || "/images/placeholder.jpg"}
                  alt={`Sample ${index + 1}`}
                  onLoad={async () => await handleImageLoad(url)}
                  onError={e => e.currentTarget.src = '/images/fallback.jpg'}
                />
              ))
            }
          />
        </div>
      </Fragment>
    </IframeWrapper>
  )
}