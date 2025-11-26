/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                mono: ['JetBrains Mono', 'monospace'],
            },
            colors: {
                surface: 'var(--bg-surface)',
                stroke: 'var(--color-stroke)',
                text: {
                    primary: 'var(--text-primary)',
                    muted: 'var(--text-muted)',
                },
                brand: {
                    DEFAULT: 'var(--color-brand)',
                    50: '#fafafa',
                    100: '#f5f5f5',
                    200: '#e5e5e5',
                    300: '#d4d4d4',
                    400: '#a3a3a3',
                    500: '#737373',
                    600: '#525252',
                    700: '#404040',
                    800: '#262626',
                    900: '#171717',
                },
            },
            borderRadius: {
                'none': '0',
            },
        },
    },
    plugins: [],
}
