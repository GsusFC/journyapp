import { useEffect } from 'react'
import { useTheme } from 'next-themes'
import { appKitModal } from '../config/web3'

export function ThemeSync() {
    const { theme } = useTheme()

    useEffect(() => {
        // AppKit might expose theme setting via the instance
        if (!appKitModal) return

        if (theme === 'dark' || theme === 'light') {
            appKitModal.setThemeMode(theme)
        } else if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            appKitModal.setThemeMode(systemTheme);
        }
    }, [theme])

    return null
}
