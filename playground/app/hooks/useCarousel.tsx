import { useCallback, useState } from "react";

export type CarouselState = {
  currentIndex: number;
  totalSlides: number;
  updateIndex: (index: number) => void;
};

export function useCarouselState(totalSlides: number) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const updateIndex = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  return {
    currentIndex,
    totalSlides,
    updateIndex
  };
}