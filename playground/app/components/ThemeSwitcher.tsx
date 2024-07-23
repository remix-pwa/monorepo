import { Icon } from './Icon';
import { useFetcher } from '@remix-run/react';
import { useTheme } from '~/hooks/useTheme';

export const ThemeSwitcher = () => {
  const fetcher = useFetcher()
  const theme = useTheme()

  const themeSwitcher = () => {
    if (theme === 'light') {
      fetcher.submit({ theme: 'dark' }, { method: 'post', action: '/theme' })
    } else if (theme === 'dark') {
      fetcher.submit({ theme: 'light' }, { method: 'post', action: '/theme' })
    }
  }

  const toggleTheme = () => {
    themeSwitcher()
  }

  return (
    <div 
      className="relative size-8 cursor-pointer bg-gray-200 dark:bg-gray-700 rounded-full"
      onClick={toggleTheme}
    >
      <div className="absolute top-1/2 left-1/2 transform w-full h-full -translate-x-1/2 -translate-y-1/2">
        <Icon name={theme === 'dark' ? 'moon' : 'sun'} className="size-4 text-gray-800 dark:text-white" />
      </div>
    </div>
  );
};
