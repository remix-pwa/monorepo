import { type ReactNode, useState } from "react";
import { cn } from "~/utils";
import { Icon } from "../core/Icon";
import { ClientOnly } from "remix-utils/client-only";
import { Codeblock } from "./Codeblock";

interface IFrameProps {
  children: ReactNode;
  title?: string;
  handleRefresh?: (() => void) | null;
  codeSandboxUrl?: string | null;
  code?: {
    lang: 'js' | 'ts' | 'tsx';
    content: string;
  };
}

export const Iframe = ({
  children,
  title,
  code,
  handleRefresh = null,
  // codeSandboxUrl = null,
}: IFrameProps) => {
  const [isCodeVisible, setIsCodeVisible] = useState(false);

  return (
    <div className={cn(
      "relative h-[400px] overflow-hidden rounded-lg",
      isCodeVisible && 'dark:shadow-gray-900 shadow-lg'
    )}>
      <div className={cn(
        "border h-full flex flex-col transition-all duration-500 border-gray-200 dark:border-gray-800 dark:shadow-gray-900 rounded-lg shadow-lg bg-white text-dark dark:bg-dark dark:text-white",
        isCodeVisible
          ? '-translate-y-full opacity-0 invisible h-0'
          : 'translate-y-0 opacity-100 visible'
      )}>
        <div className={cn("px-3 py-2.5 flex items-center justify-between text-sm sm:text-base dark:bg-gray-800 bg-gray-100 rounded-t-lg", !title && 'py-3')}>
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          {title && <div className="hidden min-w-64 text-center relative md:block mx-auto px-12 py-1 bg-white cursor-default bg-opacity-80 dark:bg-opacity-10 rounded-md text-dark/50 dark:text-white/75">
            <Icon name="search" className="absolute left-2 size-4 top-1/2 -translate-y-1/2" />
            {title}
          </div>}
          <div className="space-x-3 flex items-center text-dark dark:text-white">
            {code && <Icon onClick={() => setIsCodeVisible(true)} name="code" className="size-4 md:size-5 cursor-pointer" />}
            {handleRefresh && <Icon onClick={handleRefresh} name="refresh" className="size-4 md:size-5 cursor-pointer" />}
          </div>
        </div>
        <div className="flex flex-col lg:flex-row relative w-full flex-1 overflow-hidden rounded-b-lg">
          <div className="flex-grow overflow-auto">{children}</div>
        </div>
      </div>
      {/* Code View */}
      {code && <Codeblock lang={code.lang} onCodeSwitch={() => setIsCodeVisible(false)} className={cn(
        'absolute bottom-0 left-0 right-0 h-full overflow-auto z-50 transition-all duration-500 ease-in-out',
        isCodeVisible
          ? 'translate-y-0 opacity-100 visible'
          : 'translate-y-full opacity-0 invisible'
      )
      }>
        {`
\`\`\`${code.lang}
${code.content.trim()}
\`\`\`
        `}
      </Codeblock>}
    </div>
  );
}

export const IframeWrapper = (props: IFrameProps) => {
  return (
    <ClientOnly fallback={<IframeFallback />}>
      {() => (
        <Iframe {...props} />
      )}
    </ClientOnly>
  )
}

export const IframeFallback = () => {
  return (
    <div className="border h-[400px] max-h-[400px] flex flex-col border-gray-200 dark:border-gray-800 dark:shadow-gray-900 rounded-lg shadow-lg bg-white text-dark dark:bg-dark dark:text-white">
      <div className={cn("px-3 py-2.5 flex items-center justify-between text-sm sm:text-base dark:bg-gray-800 bg-gray-100 rounded-t-lg")}>
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="hidden min-w-64 text-center relative md:block mx-auto px-12 py-1 bg-white cursor-default bg-opacity-80 dark:bg-opacity-10 rounded-md text-dark/50 dark:text-white/75">
          <Icon name="search" className="absolute left-2 size-4 top-1/2 -translate-y-1/2" />
          Loading Window...
        </div>
        <div className="space-x-3 flex items-center text-dark dark:text-white">
          <Icon name="refresh" className="size-4 md:size-5 cursor-pointer" />
        </div>
      </div>
      <div className="flex flex-col lg:flex-row relative w-full flex-1 overflow-hidden rounded-b-lg">
        <div className="flex-grow overflow-auto w-full h-full" />
      </div>
    </div>
  )
}
