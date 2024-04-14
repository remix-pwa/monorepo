import { errorBlock } from './utils.js';

export const copyTextToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator && navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const readTextFromClipboard = async (): Promise<{
  ok: boolean;
  message?: string;
  text: string | null;
}> => {
  try {
    if (navigator && navigator.clipboard) {
      const text = await navigator.clipboard.readText();
      return { ok: true, message: 'Read text successfully', text };
    } else {
      return { ok: false, message: 'Read Text API not supported', text: null };
    }
  } catch (error) {
    return { ok: false, text: null };
  }
};

export const copyImageToClipboard = async (imgURL: string): Promise<boolean> => {
  try {
    if (navigator && navigator.clipboard) {
      const data = await fetch(imgURL);
      const blob = await data.blob();

      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);

      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

export const readFilesFromClipboard = async (): Promise<{ ok: boolean; message: string; files: File[] | null }> => {
  try {
    if (navigator && navigator.clipboard) {
      const files = [] as File[];
      const items = await navigator.clipboard.read();

      for (const item of items) {
        for (const type of item.types) {
          const blob = await item.getType(type);
          const file = new File([blob], 'clipboard-file', { type });
          files.push(file);
        }
      }

      return { ok: true, message: 'Read files from clipboard successfully', files };
    } else {
      return { ok: false, message: "Clipboard API not supported! Can't read files", files: null };
    }
  } catch (error) {
    return { ...errorBlock(error), files: null };
  }
};

export const clipboardSupported = async () => {
  return navigator && 'clipboard' in navigator;
};
