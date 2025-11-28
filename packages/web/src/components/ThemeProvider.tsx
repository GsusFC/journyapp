import { ThemeProvider as NextThemesProvider, type ThemeProviderProps as NextThemeProviderProps } from 'next-themes'

type ThemeProviderProps = {
    children: React.ReactNode
    attribute?: string
    defaultTheme?: string
    enableSystem?: boolean
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    return (
        <NextThemesProvider {...(props as NextThemeProviderProps)}>
            {children}
        </NextThemesProvider>
    )
}
