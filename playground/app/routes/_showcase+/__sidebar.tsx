import { NavLink } from "@remix-run/react"
import { cn } from "~/utils"

export const Sidebar = () => {
  const sections = ['Caching', 'Test']
  const nav = [
    {
      name: 'Caching (Text)',
      slug: '/cache/text',
      section: 'Caching'
    },
    {
      name: 'Caching (JSON)',
      slug: '/#',
      section: 'Caching'
    },
    {
      name: 'Caching (Media)',
      slug: '/##',
      section: 'Caching'
    },
    {
      name: 'New Page',
      slug: '/',
      section: 'Test'
    },
  ]
  return (
    <div className="fixed inset-0 left-[max(0px,calc(50%-45rem))] right-auto top-[48px] z-20 hidden w-[15rem] xl:w-[19rem] overflow-y-auto pb-10 pl-8 pr-6 lg:block">
      <div className="flex flex-col items-start justify-start w-full h-full py-8">
        {sections.map(section => (
          <div key={section} className="mb-6">
            <h2 className="text-sm font-semibold text-gray-900 uppercase">{section}</h2>
            <ul className="mt-2.5 space-y-2">
              {nav.filter(item => item.section === section).map(item => (
                <li key={item.slug}>
                  <NavLink to={item.slug} className="text-sm">
                    {({ isActive }) => (
                      <span className={cn('block', isActive ? 'text-blue-500 hover:text-blue-700 dark:hover:text-blue-600' : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-200')}>{item.name}</span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}