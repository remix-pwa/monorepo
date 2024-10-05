import type { HTMLProps } from 'react';
import React from 'react';

interface SafeHtml {
  __html: string;
}

function createHtml(html: string): SafeHtml {
  return { __html: html };
}

export type ScriptProps = Omit<
  HTMLProps<HTMLScriptElement>,
  'children' | 'async' | 'defer' | 'src' | 'type' | 'noModule' | 'dangerouslySetInnerHTML' | 'suppressHydrationWarning'
> & {
  /**
   * A string representing a URL that defines a service worker's registration scope; that is, what
   * range of URLs a service worker can control.
   */
  registrationScope?: string;
  /**
   * A string specifying the type of worker to create.
   */
  serviceWorkerType?: 'module' | 'classic';
  /**
   * The name of the worker file.
   *
   * **NOTE:** Without the extension (.js|.mjs).
   * @default
   * 'entry.worker'
   */
  workerName?: string;
};

export const PWAScripts = (props: ScriptProps) => {
  const registerSwHtml = `
  async function register() {
   const reg = await navigator.serviceWorker.register('/${props.workerName ?? 'entry.worker'}.js', {
    scope: ${JSON.stringify(props.scope) ?? '/'},
    type: ${JSON.stringify(props.serviceWorkerType) ?? 'classic'},
    updateViaCache: 'none',
   });
   window.$ServiceWorkerHMRHandler$ = async () => {
    await reg.update();
   }
  }
  if ('serviceWorker' in navigator) {,
   if (document.readyState === 'complete' || document.readyState === 'interactive') {,
    register();,
   } else {,
    window.addEventListener('load', register);,
   },
  }
  `
    .trim()
    .split('\n')
    .map(line => line.trim)
    .join('\n');

  return (
    <>
      <script
        id="sw-registration-script"
        type="module"
        suppressHydrationWarning
        dangerouslySetInnerHTML={createHtml(registerSwHtml)}
        {...props}
      />
    </>
  );
};
