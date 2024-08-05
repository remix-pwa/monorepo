import { Disclosure } from '@headlessui/react'
import { ThemeSwitcher } from '~/components'
import { cn } from '~/utils'

export const Header = () => {
  return (
    <Disclosure as="header" className={cn(
      'fixed top-0 z-40 w-full flex-none backdrop-blur bg-transparent border-0 px-4 py-3 md:pl-6 flex justify-between',
      ''
    )}>
      <h3>Showcase</h3>
      {/* Theme Switcher, etc. */}
      {/* Disclosure Button */}
      {/* Disclosure Panel - Mobile Menu */}
      <ThemeSwitcher />
    </Disclosure>
  )
}