import { NavLink } from "@remix-run/react"
import { cn } from "~/utils"

export const Sidebar = () => {
  const sections = [
    'Caching Carnival',
    'Native PWA Toolbox',
    'Ping! Push Notifications',
    'Sync or Swim',
    'Offline Oasis',
    'App Lifecycle Magic'
  ]

  const nav = [
    {
      name: 'Text Caching: Word Vault',
      slug: '/cache/text',
      section: 'Caching Carnival'
    },
    {
      name: 'Image Caching: Pic Preserver',
      slug: '/cache/image',
      section: 'Caching Carnival'
    },
    {
      name: 'A/V Caching: Media Vault',
      slug: '/cache/media',
      section: 'Caching Carnival'
    },
    {
      name: 'Contacts: People Picker',
      slug: '/native-pwa/contacts',
      section: 'Native PWA Toolbox'
    },
    {
      name: 'Files',
      slug: '/',
      section: 'Native PWA Toolbox'
    },
    {
      name: 'Location',
      slug: '/',
      section: 'Native PWA Toolbox'
    },
    {
      name: 'Feat',
      slug: '/',
      section: 'Native PWA Toolbox'
    },
    {
      name: 'Basic Notifications',
      slug: '/push/basic',
      section: 'Ping! Push Notifications'
    },
    {
      name: 'Advanced Notifications',
      slug: '/push/advanced',
      section: 'Ping! Push Notifications'
    },
  ]
  return (
    <div className="fixed inset-0 left-[max(0px,calc(50%-45rem))] right-auto top-[48px] z-20 hidden w-[15rem] xl:w-[19rem] overflow-y-auto pb-10 pl-8 pr-6 lg:block">
      <div className="flex flex-col items-start justify-start w-full h-full py-8">
        {sections.map(section => (
          <div key={section} className="mb-6">
            <h2 className="text-sm font-semibold text-text uppercase select-none">{section}</h2>
            <ul className="mt-2.5 space-y-2">
              {nav.filter(item => item.section === section).map(item => (
                <li key={item.slug}>
                  <NavLink to={item.slug} className="text-sm">
                    {({ isActive }) => (
                      <span className={cn('block', isActive ? 'text-primary-500 hover:text-blue-700 dark:hover:text-blue-600' : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-200')}>{item.name}</span>
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