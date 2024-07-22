import type { MouseEvent } from 'react'
import { useEffect } from 'react'
import { cn } from '~/utils'

// Useful for preventing AlgoliaSearch from indexing a heading
export default function Heading({
  children,
  className = '',
  hidden = false,
  id,
  ignore = false,
  level,
  nextElement,
  style = {},
  ...props
}: any) {
  const Component = `h${level}` as any

  useEffect(() => {
    if (typeof window === 'undefined') return

    // @ts-expect-error
    if (!window.registerHeading) return

    // @ts-expect-error
    window.registerHeading(id)

    return () => {
      // @ts-expect-error
      window.unregisterHeading(id)
    }
  }, [id])

  const scrollIntoView = (e: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>, id: string) => {
    if (e.currentTarget.parentNode?.nodeName.toUpperCase().includes('H')) {
      e.preventDefault()

      const scrollToTargetBounds = e.currentTarget.getBoundingClientRect()
      const offset = scrollToTargetBounds.top + window.scrollY - 106

      window.scrollTo({
        top: offset,
        behavior: 'smooth',
      })

      window.history.pushState(null, '', `${window.location.pathname}#${id}`)
    }
  }

  return (
    <Component
      className={cn(
        'text-2xl font-semibold group relative grid',
        className,
      )}
      id={id}
      style={{ ...(hidden ? { marginBottom: 0 } : {}), ...style }}
      data-docsearch-ignore={ignore ? '' : undefined}
      {...props}
    >
      <div className="grid grid-area-1-1 relative -ml-6 w-7 border-0 opacity-0 group-hover:opacity-[0] group-focus:opacity-[0] md:group-hover:md:opacity-[1] md:group-focus:md:opacity-[1] [margin-top:_0.75em]">
        <a href="#form-component-vs.-native-html-form" aria-label="Direct link to heading" className="inline-flex h-full items-start dark:text-light/3 dark:shadow-none dark:ring-0 leading-snug">
          <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" shapeRendering="geometricPrecision" viewBox="0 0 24 24" className="w-3.5 h-[1lh] transition-colors stroke-transparent group-hover:stroke-dark/6 dark:group-hover:stroke-light/5 lg:w-4 text-current" height="24" width="24">
            <path d="M4 9h16M4 15h16M10 3L8 21M16 3l-2 18"></path>
          </svg>
        </a>
      </div>
      <div className='mt-[0.75em]'>{children}</div>
    </Component>
  )
}