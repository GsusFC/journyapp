import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

export function WriteFAB() {
    const navigate = useNavigate()
    const location = useLocation()
    const currentPath = location.pathname

    // No mostrar en landing o write
    if (currentPath === '/' || currentPath === '/write') {
        return null
    }

    return (
        <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/write')}
            className={cn(
                "fixed bottom-6 right-4 z-50",
                "w-14 h-14 rounded-full",
                "flex items-center justify-center",
                // Solid black button
                "bg-text-primary dark:bg-white",
                "text-white dark:text-black",
                // Shadow
                "shadow-[0_4px_20px_rgba(0,0,0,0.3)]",
                // Safe area
                "mb-[env(safe-area-inset-bottom)]"
            )}
            aria-label="Write new entry"
        >
            {/* Pen/Write icon */}
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
        </motion.button>
    )
}
