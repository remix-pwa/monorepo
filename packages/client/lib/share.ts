import { errorBlock } from './utils';

export const shareData = async (data: ShareData) => {
  try {
    if (data.files) {
      if (navigator.canShare && navigator.canShare(data)) {
        await navigator.share(data);
        return { ok: true, message: 'Shared successfully' };
      } else {
        return { ok: false, message: 'Share Files API not supported' };
      }
    } else {
      if (navigator.share) {
        await navigator.share(data);
        return { ok: true, message: 'Shared successfully' };
      } else {
        return { ok: false, message: 'Web Share API not supported' };
      }
    }
  } catch (error) {
    return errorBlock(error);
  }
};

export const shareSupported = () => {
  try {
    return 'share' in navigator;
  } catch (error) {
    return errorBlock(error);
  }
};

export const shareFilesSupported = () => {
  try {
    return 'canShare' in navigator;
  } catch (error) {
    return errorBlock(error);
  }
};
