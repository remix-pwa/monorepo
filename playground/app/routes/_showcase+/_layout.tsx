import { Outlet } from "@remix-run/react"

export default function Component() {
  return (
    <div className="bg-green-50">
      <Outlet />
    </div>
  )
}
