import { errorBlock } from './utils';

// Experimental!!! Why did I even implement this?!
// export const idleDetection = async (
//   action = 'start',
//   callback = () => {
//     // Idle.
//   },
//   threshold = 60000
// ) => {
//   try {
//     if ('IdleDetector' in window) {
//       const state = await IdleDetector.requestPermission();
//       if (state === 'granted') {
//         const controller = new AbortController();
//         const signal = controller.signal;
//         const idleDetector = new IdleDetector();
//         idleDetector.addEventListener('change', () => {
//           const userState = idleDetector.userState;
//           if (userState === 'idle') callback();
//         });
//         if (action === 'start') {
//           await idleDetector.start({
//             threshold: threshold > 60000 ? threshold : 60000,
//             signal,
//           });
//           return { ok: true, message: 'Started' };
//         } else {
//           controller.abort();
//           return { ok: true, message: 'Aborted' };
//         }
//       } else {
//         return { ok: false, message: 'Need to request permission first' };
//       }
//     } else {
//       return { ok: false, message: 'Idle Detection API not supported' };
//     }
//   } catch (error) {
//     return errorBlock(error);
//   }
// };

export const wakeLock = async () => {
  try {
    if ('wakeLock' in navigator) {
      const wakeLock = await navigator.wakeLock.request('screen');

      if (wakeLock) {
        return { ok: true, message: 'WakeLock Active' };
      } else {
        return { ok: false, message: 'WakeLock Failed' };
      }
    } else {
      return { ok: false, message: 'WakeLock API not supported' };
    }
  } catch (error) {
    return errorBlock(error);
  }
};

export const checkVisibility = async (isVisible: () => void, notAvailable: () => void) => {
  try {
    if (document.visibilityState) {
      const state = document.visibilityState;
      if (state === 'visible') {
        isVisible();
        return { ok: true, message: 'Visible' };
      }
    } else {
      notAvailable();
      return {
        ok: false,
        message: 'Visibility API not supported',
      };
    }
  } catch (error) {
    return errorBlock(error);
  }
};
