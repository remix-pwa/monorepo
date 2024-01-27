export { badgingSupported, clearBadge, setBadge } from './lib/badge';
export {
  clipboardSupported,
  copyImageToClipboard,
  copyTextToClipboard,
  readFilesFromClipboard,
  readTextFromClipboard,
} from './lib/clipboard';
export { checkConnectivity } from './lib/connectivity';
export { shareData } from './lib/share';
export { checkVisibility, wakeLock, wakeLockSupported } from './lib/usage';
export {
  getBrowser,
  getPlatform,
  isAndroid,
  isAndroidChrome,
  isAndroidEdge,
  isAndroidFirefox,
  isAndroidOpera,
  isChrome,
  isEdge,
  isFirefox,
  isIOS,
  isIOSChrome,
  isIOSEdge,
  isIOSFirefox,
  isIOSOpera,
  isIOSSafari,
  isMacOS,
  isMacOSChrome,
  isMacOSEdge,
  isOpera,
  isSafari,
  isTouchScreen,
  isWindows,
  isWindowsChrome,
  isWindowsEdge,
} from './lib/user-agent';
