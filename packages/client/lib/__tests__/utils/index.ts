import { ElementHandle } from "puppeteer";
import { copyTextToClipboard } from "../../clipboard";

export function addEventListener(el: ElementHandle<Element>) {
  return async (eventName: string, callback: () => void) => {
    await el.evaluate((el, eventName, callback) => {
      el.addEventListener(eventName, callback);
    }, eventName, callback);
  };
}

export function copy() {
  copyTextToClipboard("Hello")
}