import { useState, useEffect, useRef } from "react";
import { IframeWrapper } from "~/components"
import { usePromise } from "~/hooks/usePromise"
import { useRefresh } from "~/hooks/useRefresh"

interface CarouselProps {
  images: string[];
  autoplayInterval?: number;
}

const Carousel: React.FC<CarouselProps> = ({ images, autoplayInterval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isDragging) {
        nextSlide();
      }
    }, autoplayInterval);

    return () => clearInterval(interval);
  }, [currentIndex, autoplayInterval, isDragging]);

  const nextSlide = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  const prevSlide = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  const getImageIndex = (offset: number) => {
    return (currentIndex + offset + images.length) % images.length;
  };

  const handleDragStart = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true);
    // @ts-ignore
    setStartX('touches' in e ? e.touches[0].clientX : e.clientX);
  };

  const handleDragEnd = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    // @ts-ignore
    const endX = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX;
    const diff = endX - startX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        prevSlide();
      } else {
        nextSlide();
      }
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div
        ref={carouselRef}
        className="flex w-full h-full transition-transform duration-500 ease-in-out"
        onMouseDown={handleDragStart}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchEnd={handleDragEnd}
      >
        <div className="flex w-full h-full justify-center items-center">
          <div className={'relative flex-shrink-0 flex w-full h-full justify-center transition-all duration-500 ease-in-out px-4 py-6 carousel-container'}>
            <img onClick={prevSlide} src={images[getImageIndex(-1)]} alt="Previous" className="h-72 w-80 object-cover rounded-lg rotate-left-img absolute left-0 top-0 bottom-0 mx-0 my-auto" />
            <div className="h-full rounded-lg z-30 mx-auto max-w-96">
              <img src={images[currentIndex]} alt="Current" className="max-w-full max-h-full object-cover rounded-lg" />
            </div>
            <img onClick={nextSlide} src={images[getImageIndex(1)]} alt="Next" className="h-72 w-80 object-cover rounded-lg rotate-right-img absolute right-0 top-0 bottom-0 mx-0 my-auto" />
          </div>
        </div>
      </div>
      <button className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full" onClick={prevSlide}>&lt;</button>
      <button className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full" onClick={nextSlide}>&gt;</button>
    </div>
  );
};

export const LazyLoadingDemo = () => {
  const { refreshCounter, refresh } = useRefresh()
  const { promise, reset, set } = usePromise<string>()

  const images = [
    'https://avatars.githubusercontent.com/u/69679506?v=4',
    'https://avatars.githubusercontent.com/u/1288694?v=4',
    'https://avatars.githubusercontent.com/u/69679506?v=4',
    'https://avatars.githubusercontent.com/u/1288694?v=4',
    'https://avatars.githubusercontent.com/u/69679506?v=4',
  ];

  return (
    <IframeWrapper
      title="Lazy Loading Images"
      handleRefresh={() =>
        refresh(() => reset())
      }
    >
      <Carousel images={images} autoplayInterval={1_000} />
    </IframeWrapper>
  )
}