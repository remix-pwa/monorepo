import { Button, Carousel, IframeWrapper, Image } from "~/components"
import { usePromise } from "~/hooks/usePromise"
import { useRefresh } from "~/hooks/useRefresh"
import { useEffect, useState } from "react";

export const LazyLoadingDemo = () => {
  const { refreshCounter, refresh } = useRefresh()
  const { promise, reset, set } = usePromise<string>()
  const [config, setConfig] = useState({
    cacheHit: false,
    isOffline: false,
  })
  const [images, setImages] = useState<string[]>([]);
  const [loadedImages, setLoadedImages] = useState<string[]>([]);

  useEffect(() => {
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
  }, []);

  const handleLazyLoad = (url: string) => {
    // Simulate lazy loading
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

    console.log("Loaded images", loadedImages, url);
  };

  return (
    <IframeWrapper
      title="Lazy Loading Images"
      handleRefresh={() =>
        refresh(() => reset())
      }
    >
      {/* <div className="relative w-full justify-center hidden items-center mt-0">
        <Button variant="solid" color="secondary" className="mx-auto">
          Clear Cache
        </Button> */}
        {/* <div
          onClick={() => setConfig(c => ({ ...c, isOffline: !c.isOffline }))}
          className={cn(
            "p-2 cursor-pointer flex content-center justify-center rounded-full bg-neon absolute right-4 text-white",
            config.isOffline ? "bg-red-500 hover:bg-red-500/80" : "bg-c-green hover:bg-c-green/80"
          )}
        >
          <Icon name={config.isOffline ? "wifi-off" : "wifi"} className="size-5" />
        </div> */}
      {/* </div> */}
      <div className="px-0 md:px-4 py-6 relative">
        <Carousel
          images={
            images.map((url, index) => (
              <img
                key={index}
                src={loadedImages[index] || "/images/placeholder.jpg"}
                alt={`Sample ${index}`}
                onLoad={() => handleLazyLoad(url)}
                loading="lazy"
              />
            ))
          }
          autoplay={false}
          size="md"
        />
      </div>
    </IframeWrapper>
  )
}