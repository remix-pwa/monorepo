import { useFetchers } from '@remix-run/react'
import { z } from 'zod'
import { useRouteLoaderData } from '@remix-run/react'

import type { loader as rootLoader } from '../root'

export const THEME_COOKIE_KEY = 'theme'
export type Theme = 'light' | 'dark' | undefined

export const ThemeFormSchema = z.object({
  theme: z.enum(['system', 'light', 'dark']),
  redirectTo: z.string().optional(),
})

export function useRequestInfo() {
  const data = useRouteLoaderData<typeof rootLoader>('root')

  if (!data?.requestInfo) {
    throw new Error('No requestInfo found in root loader')
  }

  return data.requestInfo
}

export function useHints() {
  const requestInfo = useRequestInfo()
  return requestInfo.hints
}

/**
 * Returns the user's theme preference, or the Client Hint theme,
 * if the user has not set a preference.
 */
export function useTheme() {
  const hints = useHints()
  const requestInfo = useRequestInfo()
  const optimisticMode = useOptimisticThemeMode()

  if (optimisticMode) {
    return optimisticMode === 'system' ? hints.theme : optimisticMode
  }

  return requestInfo.userPrefs.theme ?? hints.theme
}

/**
 * If the user's changing their theme mode preference,
 * this will return the value it's being changed to.
 */
export function useOptimisticThemeMode() {
  const fetchers = useFetchers()
  const themeFetcher = fetchers.find(f => f.formAction?.startsWith('/theme'))

  if (themeFetcher && themeFetcher.formData) {
    const formData = Object.fromEntries(themeFetcher.formData)
    const { theme } = ThemeFormSchema.parse(formData)

    return theme
  }
}