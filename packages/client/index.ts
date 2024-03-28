export { clearBadge, isBadgingSupported, setBadgeCount } from './lib/badge';
export { getBatteryStatus } from './lib/battery';
export {
  clipboardSupported,
  copyImageToClipboard,
  copyTextToClipboard,
  readFilesFromClipboard,
  readTextFromClipboard,
} from './lib/clipboard';
export { handleNetworkChange, isOffline, isOnline } from './lib/connectivity';
export { openContactPicker } from './lib/contacts';
export { displayMode, toggleFullScreen } from './lib/display';
export { shareSupported as isShareSupported, shareData } from './lib/share';
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
  isTouchAvailable,
  isTouchScreen,
  isWindowAvailable,
  isWindows,
  isWindowsChrome,
  isWindowsEdge,
} from './lib/user-agent';

export { useBadgeApi } from './hooks/useBadgeApi';
export { useBatteryManager } from './hooks/useBatteryManager';
export { useNetworkConnectivity } from './hooks/useNetworkConnectivity';
export { usePWAManager } from './hooks/usePWAManager';
