import { useState, useRef, useEffect, ReactElement, cloneElement, Fragment } from "react";
import { cn } from "~/utils";

export type Image = {
  src: string;
  alt?: string;
  loading?: 'lazy' | 'eager';
}

interface CarouselProps {
  images: Array<string | ReactElement<HTMLImageElement>>;
  size?: 'sm' | 'md' | 'lg';
  autoplay?: boolean;
  autoplayInterval?: number;
}

export const Carousel: React.FC<CarouselProps> = ({ images, autoplayInterval = 5000, autoplay = true, size = 'md' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!carouselRef.current || !autoplay) return;

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
    if (Math.abs(diff) > 10) {
      if (diff > 0) {
        prevSlide();
      } else {
        nextSlide();
      }
    }
  };

  return (
    <div className="relative select-none w-full h-full overflow-hidden">
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
          {typeof images === 'string' ? (
            <div className={'relative flex-shrink-0 flex w-full h-full justify-center transition-all duration-500 ease-in-out carousel-container'}>
              <img
                onClick={prevSlide}
                src={images[getImageIndex(-1)]}
                loading='lazy'
                alt='Previous'
                className={cn(
                  "object-cover rounded-lg rotate-left-img absolute left-0 top-0 bottom-0 mx-0 my-auto",
                  size === 'sm' && 'h-48 w-56 left-14 md:h-72 md:w-80 lg:h-48 lg:w-56',
                  size === 'md' && 'h-72 w-80',
                  size === 'lg' && 'h-96 w-96',
                )}
              />
              <div className={cn(
                "h-80 rounded-lg z-30 mx-auto max-w-96",
                size === 'sm' && 'h-64',
                size === 'md' && 'h-80',
                size === 'lg' && 'h-96',
              )}>
                <img
                  src={images[currentIndex]}
                  alt="Current"
                  className={cn("max-w-full max-h-full object-cover rounded-lg")}
                />
              </div>
              <img
                onClick={nextSlide}
                src={images[getImageIndex(1)]}
                alt='Next'
                loading='lazy'
                className={cn(
                  "object-cover rounded-lg rotate-right-img absolute right-0 top-0 bottom-0 mx-0 my-auto",
                  size === 'sm' && 'h-48 w-56 right-14 md:h-72 md:w-80 lg:h-48 lg:w-56',
                  size === 'md' && 'h-72 w-80',
                  size === 'lg' && 'h-96 w-96',
                )}
              />
            </div>
          ) : (
            (images as ReactElement<HTMLImageElement, string | React.JSXElementConstructor<any>>[])
              .map((image, index) => {
                console.log(currentIndex, 'current index')
                if (index === currentIndex) {
                  // console.log('current', index);
                  return (
                    <div
                      key={index}
                      className={cn(
                        "h-80 rounded-lg z-30 mx-auto max-w-96",
                        size === 'sm' && 'h-64',
                        size === 'md' && 'h-80',
                        size === 'lg' && 'h-96',
                      )}
                    >
                      {cloneElement(image, {
                        className: cn(image.props.className, "max-w-full max-h-full object-cover rounded-lg")
                      })}
                    </div>
                  )
                }

                if (index === getImageIndex(-1)) {
                  // console.log('prev', index, image);
                  return (
                    <Fragment key={index}>
                      {cloneElement(image, {
                        className: cn(
                          image.props.className,
                          "object-cover rounded-lg rotate-left-img absolute left-0 top-0 bottom-0 mx-0 my-auto",
                          size === 'sm' && 'h-48 w-56 left-14 md:h-72 md:w-80 lg:h-48 lg:w-56',
                          size === 'md' && 'h-72 w-80',
                          size === 'lg' && 'h-96 w-96',
                        ),
                        // @ts-ignore
                        onClick: prevSlide,
                      })}
                    </Fragment>
                  )
                }

                if (index === getImageIndex(1)) {
                  // console.log('next', index, image);
                  return (
                    <Fragment key={index}>
                      {cloneElement(image, {
                        className: cn(
                          image.props.className,
                          "object-cover rounded-lg rotate-right-img absolute right-0 top-0 bottom-0 mx-0 my-auto",
                          size === 'sm' && 'h-48 w-56 right-14 md:h-72 md:w-80 lg:h-48 lg:w-56',
                          size === 'md' && 'h-72 w-80',
                          size === 'lg' && 'h-96 w-96',
                        ),
                        // @ts-ignore
                        onClick: nextSlide
                      })}
                    </Fragment>
                  )
                }

                return null
              })
          )}
        </div>
      </div>
      <button className="absolute top-1/2 left-2 md:left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full" onClick={prevSlide}>Prev</button>
      <button className="absolute top-1/2 right-2 md:right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full" onClick={nextSlide}>Next</button>
    </div>
  );
};
