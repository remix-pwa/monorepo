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
    setStartX('touches' in e ? e.touches[0].clientX : e.clientX);
  };

  const handleDragEnd = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
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
    <div className="relative size-full overflow-hidden">
      <div 
        ref={carouselRef}
        className="flex w-full h-full transition-transform duration-500 ease-in-out"
        onMouseDown={handleDragStart}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchEnd={handleDragEnd}
      >
        <div className={`absolute w-3/5 h-full transition-all duration-500 ease-in-out ${isTransitioning ? '-translate-x-full scale-90' : '-translate-x-1/2 scale-90'}`}>
          <img src={images[getImageIndex(-1)]} alt="Previous" className="w-full h-full object-cover rounded-lg" />
        </div>
        <div className={`absolute w-3/5 h-full left-1/2 transition-all duration-500 ease-in-out ${isTransitioning ? 'translate-x-full scale-90' : '-translate-x-1/2 scale-100'}`}>
          <img src={images[currentIndex]} alt="Current" className="w-full h-full object-cover rounded-lg" />
        </div>
        <div className={`absolute w-3/5 h-full transition-all duration-500 ease-in-out ${isTransitioning ? 'translate-x-0 scale-100' : 'translate-x-1/2 scale-90'}`}>
          <img src={images[getImageIndex(1)]} alt="Next" className="w-full h-full object-cover rounded-lg" />
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