import { ReactNode, useState } from "react";
import { ResizableBox } from "react-resizable";

export const Iframe = ({
  children,
  title
}: {
  children: ReactNode;
  title: string;
}) => {
  const [isConfigVisible, setIsConfigVisible] = useState(false);
  const [configWidth, setConfigWidth] = useState(0);

  return (
    <div className="border h-96 max-h-96 flex flex-col border-gray-200 dark:border-gray-800 dark:shadow-gray-900 rounded-lg shadow-lg overflow-hidden bg-white text-gray-900 dark:bg-dark dark:text-white">
      <div className="px-3 py-2.5 flex items-center text-sm sm:text-base dark:bg-gray-800 bg-gray-100">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="hidden md:block mx-auto px-4 py-1 bg-white bg-opacity-80 dark:bg-opacity-10 rounded-md text-gray-900/50 dark:text-white/75">
          {title}
        </div>
        <div className="ml-auto space-x-3 flex items-center lg:hidden">
          <button
            onClick={() => setIsConfigVisible(!isConfigVisible)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Config Icon
          </button>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row relative w-full flex-1">
        <div className="flex-grow p-4">{children}</div>
        <div className={`lg:absolute lg:top-0 lg:right-0 lg:h-full ${isConfigVisible ? 'block' : 'hidden lg:block'}`}>
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
              <div className="px-4 h-full bg-gray-50 dark:bg-gray-900">
                <h2 className="text-lg font-semibold">Configuration</h2>
                {/* Add your config options here */}
              </div>
            )}
          </ResizableBox>
        </div>
      </div>
    </div>
  );
}