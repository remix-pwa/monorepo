import { Outlet } from "@remix-run/react"
import { Header } from "./__header"
import { ReactNode } from "react"
import { Sidebar } from "./__sidebar"
import { ToC } from "~/components/ToC"

const MainWrapper = ({
  sidebar,
  children,
  toc
}: {
  sidebar: ReactNode;
  children: ReactNode;
  toc: ReactNode
}) => {
  return (
    <div
      className={'relative top-12 mx-auto max-w-8xl px-4 sm:px-6 md:px-8 overflow-hidden flex'}
    >
      {sidebar}
      <div className="lg:pl-[19.5rem]">
        <div className="mx-auto max-w-5xl xl:max-w-none xl:ml-0 xl:mr-[15.5rem]">
          {children}
          {toc}
        </div>
      </div>
    </div>
  )
}

export default function Component() {
  return (
    <div className="size-full showcase-background">
      <Header />
      <MainWrapper
        sidebar={<Sidebar />}
        toc={
          <ToC
            headings={[
              { id: '1', title: 'Heading 1' },
              { id: '2', title: 'Heading 2' },
              { id: '3', title: 'Heading 3' },
              { id: '4', title: 'Heading 4' },
              { id: '5', title: 'Heading 5' },
            ]}
          />
        }
      >
        <Outlet />
      </MainWrapper>
    </div>
  )
}
