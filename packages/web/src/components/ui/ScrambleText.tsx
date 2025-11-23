import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface ScrambleTextProps {
    text: string
    speed?: number
    scrambleSpeed?: number
    className?: string
}

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'

export function ScrambleText({
    text,
    speed = 0.5, // Segundos para revelar todo
    scrambleSpeed = 30, // ms entre cambios de caracter
    className
}: ScrambleTextProps) {
    const [displayedText, setDisplayedText] = useState('')
    const [isComplete, setIsComplete] = useState(false)

    useEffect(() => {
        let interval: NodeJS.Timeout
        let counter = 0
        const totalSteps = text.length
        const stepDuration = (speed * 1000) / totalSteps

        interval = setInterval(() => {
            if (counter >= totalSteps) {
                clearInterval(interval)
                setDisplayedText(text)
                setIsComplete(true)
                return
            }

            const revealed = text.slice(0, counter)
            const scrambled = Array.from({ length: text.length - counter })
                .map(() => CHARS[Math.floor(Math.random() * CHARS.length)])
                .join('')

            setDisplayedText(revealed + scrambled)
            counter++
        }, Math.max(stepDuration, scrambleSpeed))

        return () => clearInterval(interval)
    }, [text, speed, scrambleSpeed])

    return (
        <motion.div
            className={className}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {isComplete ? text : displayedText}
        </motion.div>
    )
}
