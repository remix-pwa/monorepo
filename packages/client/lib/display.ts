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
