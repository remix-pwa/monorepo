import { ReactNode } from "react";

export const Page = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex-1 relative py-8 lg:px-12 break-anywhere">
      {children}
    </div>
  )
}

export const PageTitle = ({ children }: { children: ReactNode }) => {
  return (
    <div className="text-4xl font-bold mb-6 space-y-3">
      {children}
    </div>
  )
}

export const PageContent = ({ children }: { children: ReactNode }) => {
  return (
    <main className="[&>*+*]:mt-5 grid whitespace-pre-wrap">
      {children}
    </main>
  )
}

export const PageFooter = () => {
  return (
    <div className="flex flex-col md:flex-row mt-6 gap-2">
      Page Footer
      {/* Edit page on Github */}
      {/* Prev/Next */}
    </div>
  )
}
