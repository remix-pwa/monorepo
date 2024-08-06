import { Icon } from "../core/Icon"

export const Disclaimer = ({
  children
}: {
  children: string
}) => {
  return (
    // <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
    //   <p className="text-yellow-800">{children}</p>
    // </div>
    <div className="px-4 py-4 transition-colors rounded-md straight-corners:rounded-none bg-gradient-to-b from-cyan/6 to-cyan/5 ring-1 ring-inset ring-dark/1 dark:ring-cyan/1 dark:from-cyan/2 dark:to-cyan/[0.1] decoration-primary/6">
      <div className="flex flex-row">
        <div className="flex items-start justify-center pr-3 mt-0.5 leading-normal text-cyan-700 dark:text-cyan-400">
          {/* <svg className="gb-icon size-4" style="mask-image: url(&quot;https://ka-p.fontawesome.com/releases/v6.6.0/svgs/regular/circle-info.svg?v=1&amp;token=a463935e93&quot;); mask-repeat: no-repeat; mask-position: center center;">
          </svg> */}
          <Icon name="info" className="size-4" />
        </div>
        <div className="flex-1 space-y-4 [&amp;>p]:text-sm [&amp;>p]:leading-relaxed">
          <p className="[&amp;>a]:text-cyan-700 [&amp;>a:hover]:text-cyan-800 [&amp;>code]:bg-cyan-700/4 [&amp;>code]:text-inherit [&amp;>code]:shadow-none text-cyan-900 dark:text-cyan-200 dark:[&amp;>a]:text-cyan dark:[&amp;>a:hover]:text-cyan-600 dark:[&amp;>code]:bg-cyan-200/2 dark:[&amp;>code]:text-inherit decoration-cyan-700/6 dark:decoration-cyan/6 flip-heading-hash">Exactly when these adjustments happen, and in what ways, is something that may change over time. </p>
          <p className="[&amp;>a]:text-cyan-700 [&amp;>a:hover]:text-cyan-800 [&amp;>code]:bg-cyan-700/4 [&amp;>code]:text-inherit [&amp;>code]:shadow-none text-cyan-900 dark:text-cyan-200 dark:[&amp;>a]:text-cyan dark:[&amp;>a:hover]:text-cyan-600 dark:[&amp;>code]:bg-cyan-200/2 dark:[&amp;>code]:text-inherit decoration-cyan-700/6 dark:decoration-cyan/6 flip-heading-hash">There can also be periods where the tuning feature is off or under maintenance, but eventually all your feedback will contribute to improving responses you receive.</p>
        </div>
      </div>
    </div>
  )
}