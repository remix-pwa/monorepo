import type { ReactNode } from "react";
import { Icon } from "../core/Icon";
import { Link } from "@remix-run/react";

export const Page = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex-1 relative py-8 xl:px-12 break-anywhere" id="page-document">
      {children}
    </div>
  )
}

export const PageTitle = ({ children }: { children: ReactNode }) => {
  return (
    <div className="text-4xl font-bold mb-7 space-y-3">
      {children}
    </div>
  )
}

export const PageContent = ({ children }: { children: ReactNode }) => {
  return (
    <main className="flex flex-col space-y-5 whitespace-pre-wrap text-text">
      {children}
    </main>
  )
}

type FooterLink = {
  title: string;
  url: string;
}

export const PageFooter = ({
  githubUrl,
  next = null,
  prev = null,
}: {
  prev?: FooterLink | null,
  next?: FooterLink | null,
  githubUrl?: string
}) => {
  return (
    <div className="flex flex-col mt-6 gap-4 mb-4">
      <a href={githubUrl || '#'} target="_blank" className="self-end text-end content-center text-sm/4 flex justify-end hover:text-primary-500 dark:hover:text-primary-400">
        <Icon name="pencil" className="size-4 mr-1.5" />
        Edit this page on Github
      </a>
      <div className="flex flex-col md:flex-row gap-2.5 w-full">
        {prev && <Link to={prev.url} className="group text-sm p-2.5 flex gap-4 w-full items-center border md:p-4 md:text-base rounded flex-row-reverse pl-4 hover:border-primary-500">
          <span className="flex flex-col flex-1 text-right">
            <span className="text-xs">Previous</span>
            <span className="text-dark dark:text-white group-hover:text-primary-500 line-clamp-2">{prev.title}</span>
          </span>
          <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" shapeRendering="geometricPrecision" viewBox="0 0 24 24" className="hidden w-5 h-5 stroke-dark group-hover:stroke-primary dark:stroke-white md:block text-current" height="24" width="24">
            <path d="M15 18l-6-6 6-6"></path>
          </svg>
        </Link>}
        {next && <Link to={next.url} className="group text-sm p-2.5 flex gap-4 w-full items-center border md:p-4 md:text-base rounded flex-row pr-4 hover:border-primary-500">
          <span className="flex flex-col flex-1">
            <span className="text-xs">Next</span>
            <span className="text-dark dark:text-white group-hover:text-primary-500 line-clamp-2">{next.title}</span>
          </span>
          <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" shapeRendering="geometricPrecision" viewBox="0 0 24 24" className="hidden w-5 h-5 stroke-dark group-hover:stroke-primary dark:stroke-white md:block text-current" height="24" width="24">
            <path d="M9 18l6-6-6-6"></path>
          </svg>
        </Link>}
      </div>
    </div>
  )
}
