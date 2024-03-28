export const shareData = async (data: ShareData): Promise<boolean> => {
  try {
    if (data.files) {
      if (navigator && navigator.canShare && navigator.canShare(data)) {
        await navigator.share(data);
        return true;
      } else {
        return false;
      }
    } else {
      if (navigator.share) {
        await navigator.share(data);
        return true;
      } else {
        return false;
      }
    }
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const shareSupported = () => {
  return navigator && 'share' in navigator;
};

export const shareFilesSupported = () => {
  return navigator && 'canShare' in navigator;
};
