import { useEffect, useRef, useState, type RefObject } from 'react'

interface UseIntersectionObserverOptions {
    threshold?: number
    rootMargin?: string
}

export function useIntersectionObserver<T extends HTMLElement>(
    options: UseIntersectionObserverOptions = {}
): [RefObject<T | null>, boolean] {
    const { threshold = 0.1, rootMargin = '100px' } = options
    const ref = useRef<T | null>(null)
    const [isIntersecting, setIsIntersecting] = useState(false)

    useEffect(() => {
        const element = ref.current
        if (!element) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsIntersecting(entry.isIntersecting)
            },
            { threshold, rootMargin }
        )

        observer.observe(element)

        return () => observer.disconnect()
    }, [threshold, rootMargin])

    return [ref, isIntersecting]
}
