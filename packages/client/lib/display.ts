import { isWindowAvailable } from './user-agent';
import { errorBlock } from './utils';

/**
 * Get the display mode of your progressive web app.
 *
 * @param callback
 */
export const displayMode = async (
  callback: (mode: 'standalone' | 'minimal-ui' | 'fullscreen' | 'broswer-tab') => void
) => {
  try {
    if (!isWindowAvailable()) return;

    window.addEventListener('DOMContentLoaded', () => {
      const displayMode = window.matchMedia('(display-mode: standalone)').matches
        ? 'standalone'
        : window.matchMedia('(display-mode: minimal-ui)').matches
          ? 'minimal-ui'
          : window.matchMedia('(display-mode: fullscreen)').matches
            ? 'fullscreen'
            : 'broswer-tab';

      callback(displayMode);
    });
  } catch (error) {
    return errorBlock(error);
  }
};

export const toggleFullScreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  }
};
