import { useState, useEffect, useRef } from "react";
import { IframeWrapper } from "~/components"
import { Carousel } from "~/components/layout/Carousel";
import { usePromise } from "~/hooks/usePromise"
import { useRefresh } from "~/hooks/useRefresh"

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
      <Carousel images={images} autoplayInterval={10_000} />
    </IframeWrapper>
  )
}