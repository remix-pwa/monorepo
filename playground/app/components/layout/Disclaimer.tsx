import remarkGfm from "remark-gfm";
import { Icon } from "../core/Icon"
import ReactMarkdown from 'react-markdown';

export const Disclaimer = ({
  children
}: {
  children: string
}) => {
  const formatted = children
    .split('\n')
    .map(line => line.trim())
    .join('\n')
    .trim();

  return (
    // <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
    //   <p className="text-yellow-800">{children}</p>
    // </div>
    <div className="px-4 py-4 transition-colors rounded-md straight-corners:rounded-none bg-gradient-to-b from-cyan/6 to-cyan/5 ring-1 ring-inset ring-dark/1 dark:ring-cyan/1 dark:from-cyan/2 dark:to-cyan/[0.1] decoration-primary/6">
      <div className="flex flex-row">
        <div className="flex items-start justify-center pr-3 mt-0.5 leading-normal text-cyan-800 dark:text-cyan-400">
          <Icon name="info" className="size-4" />
        </div>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          className="flex-1 flex flex-col space-y-4 [&amp;>code]:font-mono [&amp;>p]:text-sm [&amp;>p]:leading-snug [&amp;>a]:text-cyan-700 [&amp;>a:hover]:text-cyan-800 dark:[&amp;>a]:text-cyan-400 dark:[&amp;>a:hover]:text-cyan-600"
          components={{
            p: ({ node, ...props }) => (
              <p
                className="[&amp;>a]:text-cyan-700 [&amp;>a:hover]:text-cyan-800 [&amp;>code]:bg-cyan-700/50 [&amp;>code]:text-inherit [&amp;>code]:shadow-none text-cyan-900 dark:text-cyan-400 dark:[&amp;>a]:text-cyan-400 dark:[&amp;>a:hover]:text-cyan-600 dark:[&amp;>code]:bg-cyan-200/75 dark:[&amp;>code]:text-inherit decoration-cyan-700/60 dark:decoration-cyan-400/60"
                {...props}
              />
            )
          }}
        >
          {formatted}
        </ReactMarkdown>
        {/* <div className="flex-1 space-y-4 [&amp;>p]:text-sm [&amp;>p]:leading-relaxed [&amp;>a]:text-cyan-700 [&amp;>a:hover]:text-cyan-800 dark:[&amp;>a]:text-cyan-400 dark:[&amp;>a:hover]:text-cyan-600">
          <p className="[&amp;>a]:text-cyan-700 [&amp;>a:hover]:text-cyan-800 [&amp;>code]:bg-cyan-700/50 [&amp;>code]:text-inherit [&amp;>code]:shadow-none text-cyan-900 dark:text-cyan-400 dark:[&amp;>a]:text-cyan-400 dark:[&amp;>a:hover]:text-cyan-600 dark:[&amp;>code]:bg-cyan-200/75 dark:[&amp;>code]:text-inherit decoration-cyan-700/60 dark:decoration-cyan-400/60">Exactly when these adjustments happen, and in what ways, is something that may change over time. </p>
          <p className="[&amp;>a]:text-cyan-700 [&amp;>a:hover]:text-cyan-800 [&amp;>code]:bg-cyan-700/50 [&amp;>code]:text-inherit [&amp;>code]:shadow-none text-cyan-900 dark:text-cyan-400 dark:[&amp;>a]:text-cyan-400 dark:[&amp;>a:hover]:text-cyan-600 dark:[&amp;>code]:bg-cyan-200/75 dark:[&amp;>code]:text-inherit decoration-cyan-700/60 dark:decoration-cyan-400/60">There can also be periods where the tuning feature is off or under maintenance, but eventually all your feedback will contribute to improving responses you receive.</p>
        </div> */}
      </div>
    </div>
  )
}