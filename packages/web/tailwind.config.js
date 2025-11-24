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
                text: {
                    primary: 'var(--text-primary)',
                    muted: 'var(--text-muted)',
                },
                brand: {
                    DEFAULT: 'var(--color-brand)',
                    50: '#f5f3ff',
                    100: '#ede9fe',
                    200: '#ddd6fe',
                    300: '#c4b5fd',
                    400: '#a78bfa',
                    500: '#8b5cf6',
                    600: '#6716e9',
                    700: '#5b13c7',
                    800: '#4c1d95',
                    900: '#3b1a75',
                },
            },
            borderRadius: {
                'none': '0',
            },
        },
    },
    plugins: [],
}
