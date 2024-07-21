import { Outlet } from "@remix-run/react"
import { Header } from "./__header"
import { ReactNode } from "react"
import { Sidebar } from "./__sidebar"

const MainWrapper = ({
  sidebar,
  children
}: {
  sidebar: ReactNode;
  children: ReactNode;
}) => {
  return (
    <div
      className={'relative top-12 mx-auto max-w-8xl px-4 sm:px-6 md:px-8 overflow-hidden flex'}
    >
      {sidebar}
      <div className="lg:pl-[19.5rem]">{children}</div>
    </div>
  )
}

export default function Component() {
  return (
    <div className="size-full showcase-background">
      <Header />
      <MainWrapper sidebar={<Sidebar />}>
        <Outlet />
      </MainWrapper>
    </div>
  )
}
