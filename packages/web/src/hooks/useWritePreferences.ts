import { useState, useCallback } from 'react'

type FontSize = 'small' | 'medium' | 'large'
type FontFamily = 'mono' | 'sans' | 'serif'
type LineHeight = 'compact' | 'normal' | 'relaxed'

interface WritePreferences {
    fontSize: FontSize
    fontFamily: FontFamily
    lineHeight: LineHeight
}

const STORAGE_KEY = 'journy-write-preferences'

const DEFAULT_PREFERENCES: WritePreferences = {
    fontSize: 'medium',
    fontFamily: 'mono',
    lineHeight: 'normal'
}

const FONT_SIZE_MAP: Record<FontSize, string> = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
}

const FONT_FAMILY_MAP: Record<FontFamily, string> = {
    mono: 'font-mono',
    sans: 'font-sans',
    serif: 'font-serif'
}

const LINE_HEIGHT_MAP: Record<LineHeight, string> = {
    compact: 'leading-snug',
    normal: 'leading-relaxed',
    relaxed: 'leading-loose'
}

interface UseWritePreferencesReturn {
    preferences: WritePreferences
    setFontSize: (size: FontSize) => void
    setFontFamily: (family: FontFamily) => void
    setLineHeight: (height: LineHeight) => void
    getTextareaClasses: () => string
}

const getInitialPreferences = (): WritePreferences => {
    if (typeof window === 'undefined') return DEFAULT_PREFERENCES
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
        try {
            return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) }
        } catch {
            return DEFAULT_PREFERENCES
        }
    }
    return DEFAULT_PREFERENCES
}

export function useWritePreferences(): UseWritePreferencesReturn {
    const [preferences, setPreferences] = useState<WritePreferences>(getInitialPreferences)

    // Guardar preferencias en localStorage
    const savePreferences = useCallback((newPrefs: WritePreferences) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newPrefs))
        setPreferences(newPrefs)
    }, [])

    const setFontSize = useCallback((size: FontSize) => {
        savePreferences({ ...preferences, fontSize: size })
    }, [preferences, savePreferences])

    const setFontFamily = useCallback((family: FontFamily) => {
        savePreferences({ ...preferences, fontFamily: family })
    }, [preferences, savePreferences])

    const setLineHeight = useCallback((height: LineHeight) => {
        savePreferences({ ...preferences, lineHeight: height })
    }, [preferences, savePreferences])

    const getTextareaClasses = useCallback(() => {
        return [
            FONT_SIZE_MAP[preferences.fontSize],
            FONT_FAMILY_MAP[preferences.fontFamily],
            LINE_HEIGHT_MAP[preferences.lineHeight]
        ].join(' ')
    }, [preferences])

    return {
        preferences,
        setFontSize,
        setFontFamily,
        setLineHeight,
        getTextareaClasses
    }
}

export type { FontSize, FontFamily, LineHeight, WritePreferences }
