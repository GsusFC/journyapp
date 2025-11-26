import { useEffect, useState, useRef } from 'react'

interface ScrambleTextProps {
    text: string
    duration?: number
    className?: string
}

const CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`'

// Generador de números pseudo-aleatorios con seed
const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000
    return x - Math.floor(x)
}

export function ScrambleText({
    text,
    duration = 1.5,
    className
}: ScrambleTextProps) {
    const [displayedText, setDisplayedText] = useState(text)
    const revealOrderRef = useRef<number[]>([])
    const scrambleCharsRef = useRef<number[]>([])

    // Inicializar orden de revelación y caracteres scramble una sola vez
    useEffect(() => {
        revealOrderRef.current = text.split('').map((_, i) => seededRandom(i + 1))
        scrambleCharsRef.current = text.split('').map((_, i) => Math.floor(seededRandom(i + 100) * CHARS.length))
    }, [text])

    useEffect(() => {
        const startTime = Date.now()
        const totalDuration = duration * 1000
        let frameId: number

        const animate = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / totalDuration, 1)

            const newText = text.split('').map((char, i) => {
                if (char === ' ' || char === '\n') return char
                
                const threshold = revealOrderRef.current[i] ?? 0.5
                if (progress >= threshold) {
                    return char
                }
                
                // Usar índice fijo para scramble, rotando con el tiempo
                const charIndex = (scrambleCharsRef.current[i] + Math.floor(elapsed / 50)) % CHARS.length
                return CHARS[charIndex]
            }).join('')

            setDisplayedText(newText)

            if (progress < 1) {
                frameId = requestAnimationFrame(animate)
            }
        }

        frameId = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(frameId)
    }, [duration, text])

    return (
        <div className={className}>
            {displayedText}
        </div>
    )
}
