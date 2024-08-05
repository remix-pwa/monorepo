import { useLocation, useMatches } from "@remix-run/react";
import { type MouseEvent, useEffect, useState } from "react";
import { useTableOfContents } from '~/hooks/useTableOfContents';
import type { TableOfContents } from "~/types";
import { cn } from "~/utils";

export const ToC = () => {
  const location = useLocation();
  const matches = useMatches();

  const [currentToC, setCurrentToC] = useState<TableOfContents | []>([])

  const { currentSection } = useTableOfContents(currentToC);

  useEffect(() => {
    // @ts-ignore
    setCurrentToC(matches.reverse()[0].handle.tableOfContents as unknown as TableOfContents)
  }, [location.pathname])

  function scrollIntoView(e: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>, id: string) {
    if (e.currentTarget.classList.contains('toc-anchor')) {
      e.preventDefault()

      const documentation = document.getElementById('page-document')
      const scrollToTarget = documentation?.querySelector(`#${id}`)

      if (!scrollToTarget) return

      const scrollToTargetBounds = scrollToTarget.getBoundingClientRect()
      const offset = scrollToTargetBounds.top + window.scrollY - 64

      window.scrollTo({
        top: offset,
        behavior: 'smooth',
      })

      window.history.pushState(null, '', `${location.pathname}#${id}`)
    }
  }

  return (
    <div className="fixed bottom-0 right-[max(0px,calc(50%-48rem))] top-[48px] z-20 hidden w-[19.5rem] overflow-y-auto py-8 xl:block">
      <nav aria-labelledby="table-of-contents" className="px-8 gap-4 flex flex-col overflow-auto [&::-webkit-scrollbar]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-transparent">
        <ul className="border-l-[1.5px] border-l-gray-400 text-sm">
          {/* @ts-ignore */}
          {currentToC.map((heading) => (
            <li key={heading.id} className="flex">
              <a
                href={`#${heading.id}`}
                onClick={(e) => scrollIntoView(e, heading.id)}
                className={cn(
                  "toc-anchor flex flex-row items-baseline left-[-1px] relative text-sm py-1 ps-3 transition-all border-l-2 border-transparent",
                  currentSection === heading.id ? 'border-l-current text-blue-500 hover:text-blue-700 dark:hover:text-blue-600' : 'hover:text-gray-500',
                )}
              >
                {heading.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}