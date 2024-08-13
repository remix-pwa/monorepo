import { Carousel, IframeWrapper } from "~/components"
import { useRefresh } from "~/hooks/useRefresh"
import { useEffect, useState } from "react";

export const ImageFallbackDemo = () => {
  const { refreshCounter, refresh } = useRefresh()
  const [images, setImages] = useState<string[]>([]);

  const IMAGE_URLS = [
    '/images/image-1.jpg',
    '/images/invalid.jpg',  // intentionaly broken URL — fails
    '/images/image-3.jpg',
    '/images/image-4.jpg',
  ];

  const DEMO_CODE = `
// in your service worker

import { EnhancedCache } from '@remix-pwa/sw';

// within the install event (using enhanced cache)
event.waitUntil(
  Promise.all([
    imgCache.preCacheUrls([FALLBACK_URL]),
    // ...
  ])
);

// within default fetch handler
if (
  req.destination === 'image' &&
  url.pathname.includes(/* if applicable */)
) {
    try {
      return imgCache.handleRequest(event.request);
    } catch (error) {
      return cache.match(FALLBACK_URL);
    }
}

// in your component

const FallbackImage = ({ src }) => (
  <img
    src={src}
    alt="Image with Fallback"
    // Fallback if the image fails to load
    onError={e => e.target.src = '/images/fallback.png'}
  />
);
`;

  useEffect(() => {
    // Mock fetching image URLs
    const fetchImages = async () => {
      setImages(IMAGE_URLS);
    };

    fetchImages();
  }, []);

  const handleImageError = (index: number) => {
    const fallbackImages = [...images];
    fallbackImages[index] = "/images/fallback.jpg";
    setImages(fallbackImages);
  };

  const reset = () => {
    // reset images
    setImages(IMAGE_URLS);
  }

  return (
    <IframeWrapper
      title="Images with Fallbacks"
      handleRefresh={() =>
        refresh(() => reset())
      }
      code={{
        content: DEMO_CODE,
        lang: 'ts',
      }}
    >
      <div className="px-0 md:px-4 py-3 relative" key={refreshCounter}>
        <Carousel
          images={
            images.map((url, index) => {
              return (
                <img
                  key={index}
                  className="object-cover size-full"
                  src={url}
                  alt={`Sample ${index + 1}`}
                  onError={() => handleImageError(index)}
                />
              )
            })
          }
          autoplay={false}
          size="md"
        />
      </div>
    </IframeWrapper>
  )
}