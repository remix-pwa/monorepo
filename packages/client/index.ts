export { clearBadge, isBadgingSupported, setBadgeCount } from './lib/badge.js';
export { getBatteryStatus } from './lib/battery.js';
export {
  clipboardSupported,
  copyImageToClipboard,
  copyTextToClipboard,
  readFilesFromClipboard,
  readTextFromClipboard,
} from './lib/clipboard.js';
export { handleNetworkChange, isOffline, isOnline } from './lib/connectivity.js';
export { openContactPicker } from './lib/contacts.js';
export { displayMode, toggleFullScreen } from './lib/display.js';
export { shareSupported as isShareSupported, shareData } from './lib/share.js';
export { checkVisibility, wakeLock, wakeLockSupported } from './lib/usage.js';
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
} from './lib/user-agent.js';

export { useBadgeApi } from './hooks/useBadgeApi.js';
export { useBatteryManager } from './hooks/useBatteryManager.js';
export { useNetworkConnectivity } from './hooks/useNetworkConnectivity.js';
export { usePermission } from './hooks/usePermission.js';
export type { PermissionName, PermissionState, PermissionStatus } from './hooks/usePermission.js';
export { usePWAManager } from './hooks/usePWAManager.js';
