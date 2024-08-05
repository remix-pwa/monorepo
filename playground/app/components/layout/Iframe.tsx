import { Fragment, type ReactNode, useState } from "react";
import { ResizableBox } from "react-resizable";
import { cn } from "~/utils";
import { Icon } from "../core/Icon";

export const Iframe = ({
  children,
  title,
  config = null,
  handleRefresh = null,
  // codeSandboxUrl = null,
}: {
  children: ReactNode;
  title?: string;
  config?: ReactNode | null;
  handleRefresh?: (() => void) | null;
  codeSandboxUrl?: string | null;
}) => {
  const [isConfigVisible, setIsConfigVisible] = useState(false);
  const [isCodeVisible, setIsCodeVisible] = useState(false);
  const [configWidth, setConfigWidth] = useState(0);

  return (
    <Fragment>
      <div className="border h-[400px] max-h-[400px] flex flex-col border-gray-200 dark:border-gray-800 dark:shadow-gray-900 rounded-lg shadow-lg bg-white text-dark dark:bg-dark dark:text-white">
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
            <Icon name="code" className="size-4 md:size-5 cursor-pointer" />
            {handleRefresh && <Icon onClick={handleRefresh} name="refresh" className="size-4 md:size-5 cursor-pointer" />}
            {config && <button
              onClick={() => setIsConfigVisible(!isConfigVisible)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Config Icon
            </button>}
          </div>
        </div>
        <div className="flex flex-col lg:flex-row relative w-full flex-1 overflow-hidden rounded-b-lg">
          {isConfigVisible && <div className="block lg:hidden lg:w-60 lg:bg-gray-50 dark:bg-gray-900">
            <div className="lg:hidden px-4 py-2.5 bg-gray-50 dark:bg-gray-900">
              <h2 className="text-lg font-semibold">Configuration</h2>
              {/* Add your config options here */}
            </div>
          </div>}
          <div className="flex-grow overflow-auto">{children}</div>
          {config && <div className={'hidden lg:block relative'}>
            <ResizableBox
              width={configWidth}
              height={Infinity}
              minConstraints={[14, Infinity]}
              maxConstraints={[500, Infinity]}
              axis="x"
              resizeHandles={['w']}
              handle={
                <div className="px-1 bg-gray-300 dark:bg-gray-700 cursor-ew-resize absolute left-0 top-0 bottom-0 flex items-center inset-y-0">
                  <div className="h-8 w-1.5 rounded-full bg-slate-400" />
                </div>
              }
              onResize={(e, { size }) => setConfigWidth(size.width)}
              className="h-full min-w-[14px]"
            >
              {configWidth > 0 && (
                // <div className="px-4 h-full bg-gray-50 dark:bg-gray-900">
                //   <h2 className="text-lg font-semibold">Configuration</h2>
                //   {/* Add your config options here */}
                // </div>
                <Fragment>
                  {config}
                </Fragment>
              )}
            </ResizableBox>
          </div>}
        </div>
      </div>
      {/* Code View */}
      {isCodeVisible &&
        <div className="border h-[400px] max-h-[400px] flex flex-col border-gray-200 dark:border-gray-800 dark:shadow-gray-900 rounded-lg shadow-lg bg-white text-dark dark:bg-dark dark:text-white"></div>
      }
    </Fragment>
  );
}
