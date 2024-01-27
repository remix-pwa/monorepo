/**
 * Wether the user agent is iOS or not
 */
// @ts-ignore
export const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

/**
 * Detect whether the user agent is Android or not
 */
export const isAndroid = () => /android/i.test(navigator.userAgent);

/**
 * Detect whether the user agent is Mac
 */
export const isMacOS = () => /Macintosh|Mac|Mac OS|MacIntel|MacPPC|Mac68K/gi.test(navigator.userAgent);

/**
 * Detect whether the user agent is Windows
 */
export const isWindows = () => /Win32|Win64|Windows|Windows NT|WinCE/gi.test(navigator.userAgent);

/**
 * Get the user browser
 */
export const getBrowser = () => {
  const { userAgent } = navigator;

  return userAgent.match(/chrome|chromium|crios/i)
    ? 'chrome'
    : userAgent.match(/firefox|fxios/i)
      ? 'firefox'
      : userAgent.match(/edg/i)
        ? 'edge'
        : userAgent.match(/safari/i)
          ? 'safari'
          : userAgent.match(/opr\//i)
            ? 'opera'
            : userAgent.match(/android/i)
              ? 'android'
              : userAgent.match(/iphone/i)
                ? 'iphone'
                : 'unknown';
};

export const getPlatform = () => {
  return isIOS() ? 'ios' : isAndroid() ? 'android' : isMacOS() ? 'macos' : isWindows() ? 'windows' : 'unknown';
};

/**
 * Wether user's device is touch screen or not
 */
export const isTouchScreen = () => {
  return (
    (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) ||
    (window.matchMedia && window.matchMedia('(any-pointer:coarse)').matches)
  );
};

export const isChrome = () => getBrowser() === 'chrome';

export const isFirefox = () => getBrowser() === 'firefox';

export const isSafari = () => getBrowser() === 'safari';

export const isOpera = () => getBrowser() === 'opera';

export const isEdge = () => getBrowser() === 'edge';

export const isIOSSafari = () => getBrowser() === 'safari' && isIOS();

export const isIOSChrome = () => getBrowser() === 'chrome' && isIOS();

export const isAndroidChrome = () => getBrowser() === 'chrome' && isAndroid();

export const isMacOSChrome = () => getBrowser() === 'chrome' && isMacOS();

export const isWindowsChrome = () => getBrowser() === 'chrome' && isWindows();

export const isIOSFirefox = () => getBrowser() === 'firefox' && isIOS();

export const isAndroidFirefox = () => getBrowser() === 'firefox' && isAndroid();

export const isIOSEdge = () => getBrowser() === 'edge' && isIOS();

export const isAndroidEdge = () => getBrowser() === 'edge' && isAndroid();

export const isMacOSEdge = () => getBrowser() === 'edge' && isMacOS();

export const isWindowsEdge = () => getBrowser() === 'edge' && isWindows();

export const isIOSOpera = () => getBrowser() === 'opera' && isIOS();

export const isAndroidOpera = () => getBrowser() === 'opera' && isAndroid();
