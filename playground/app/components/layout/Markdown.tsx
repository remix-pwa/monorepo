import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import slug from 'rehype-slug';
import slugify from '@sindresorhus/slugify'
import { cn } from '~/utils';
import { type MouseEvent, useCallback, useEffect } from 'react';

export const Markdown = ({ children }: { children: string }) => {
  const formatted = children
    .split('\n')
    .map(line => line.trim())
    .join('\n')
    .trim();

    const scrollIntoView = useCallback((e: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>, id: string) => {
      if (e.currentTarget.parentNode?.nodeName.toUpperCase().includes('H')) {
        e.preventDefault()
  
        const scrollToTargetBounds = e.currentTarget.getBoundingClientRect()
        const offset = scrollToTargetBounds.top + window.scrollY - 64
  
        window.scrollTo({
          top: offset,
          behavior: 'smooth',
        })
  
        window.history.pushState(null, '', `${window.location.pathname}#${id}`)
      }
    }, [])

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[slug]}
      components={{
        p: ({ node, ...props }) => <p style={{ whiteSpace: 'pre-line' }} {...props} />,
        h2: ({ node, children, ...props }) => {
          const id = slugify(children?.toString() || '');

          useEffect(() => {
            const x = setTimeout(() => {
              // @ts-ignore
              if (typeof window !== 'undefined' && window.registerHeading) window.registerHeading(id);
            }, 200)

            return () => {
              clearTimeout(x);
              // @ts-ignore
              if (typeof window !== 'undefined' && window.unregisterHeading) window.unregisterHeading(id);
            }
          }, []);

          return (
            <h2 id={id} className='text-3xl font-semibold group relative flex items-center' {...props}>
              <a
                onClick={(e) => scrollIntoView(e, id)}
                href={`#${id}`}
                className="absolute -left-6 flex items-center justify-center size-6 opacity-0 group-hover:opacity-100 transition-opacity mt-[.875em]"
                // aria-hidden="true"
              >
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  shapeRendering="geometricPrecision"
                  viewBox="0 0 24 24"
                  className="size-4 transition-colors stroke-slate-400 group-hover:stroke-slate-600 dark:group-hover:stroke-slate-300"
                >
                  <path d="M4 9h16M4 15h16M10 3L8 21M16 3l-2 18"></path>
                </svg>
              </a>
              <div className='mt-[.875em]'>
                {children}
              </div>
            </h2>
          )
        },
        h3: ({ node, children, ...props }) => {
          const id = slugify(children?.toString() || '');

          useEffect(() => {
            const x = setTimeout(() => {
              // @ts-ignore
              if (typeof window !== 'undefined' && window.registerHeading) window.registerHeading(id);
            }, 200)

            return () => {
              clearTimeout(x);
              // @ts-ignore
              if (typeof window !== 'undefined' && window.unregisterHeading) window.unregisterHeading(id);
            }
          }, []);

          return (
            <h3 id={id} className='text-2xl font-semibold group relative flex items-center' {...props}>
              <a
                onClick={(e) => scrollIntoView(e, id)}
                href={`#${id}`}
                className="absolute -left-6 flex items-center justify-center size-6 opacity-0 group-hover:opacity-100 transition-opacity mt-[0.625em]"
                // aria-hidden="true"
                inertia-hidden="true"
              >
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.75"
                  shapeRendering="geometricPrecision"
                  viewBox="0 0 24 24"
                  className="size-3.5 md:size-4 transition-colors stroke-slate-400 group-hover:stroke-slate-600 dark:group-hover:stroke-slate-300"
                >
                  <path d="M4 9h16M4 15h16M10 3L8 21M16 3l-2 18"></path>
                </svg>
              </a>
              <div className='mt-[0.625em]'>
                {children}
              </div>
            </h3>
          )
        },
        a: ({ node, ...props }) => {
          return (
            <a
              {...props}
              className={cn(
                'text-blue-600 dark:text-blue-400 underline underline-offset-2 underline-thickness-2 transition-colors decoration-blue-600 dark:decoration-blue-400',
                'hover:text-blue-700 dark:hover:text-blue-300',
                props.className
              )}
            />
          )
        },
        ul: ({ node, ...props }) => {
          return (
            <ul className='list-none pl-0 my-0' {...props} role='list' />
          )
        },
        li: ({ node, ...props }) => {
          return (
            <li className='relative my-0 pl-5 before:content-[""] before:absolute before:left-0 before:top-[0.6em] before:size-1.5 before:bg-slate-400 before:rounded-full dark:before:bg-slate-600' {...props} />
          )
        },
        code: ({ node, className, children, ...props }) => {
          if (true) {
            return (
              <code className="px-1.5 py-[1px] rounded leading-[calc(max(1.20em,1.25rem))] bg-slate-100 min-w-[1.625rem] inline-flex justify-center items-center text-slate-800 text-[.875em] font-mono dark:bg-slate-700 dark:text-slate-200" {...props}>
                {children}
              </code>
            )
          }
          // If not inline, it's a code block, so you might want to handle it differently
          // return (
          //   <code className={className} {...props}>
          //     {children}
          //   </code>
          // )
        },
      }}
    >
      {formatted}
    </ReactMarkdown>
  );
};
