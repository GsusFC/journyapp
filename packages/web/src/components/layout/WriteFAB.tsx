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
                "fixed bottom-6 left-1/2 z-50",
                // Offset to the right of center to balance with nav
                "translate-x-[calc(-50%+140px)]",
                // 50px to match BottomNav visual weight
                "w-[50px] h-[50px] rounded-full",
                "flex items-center justify-center",
                // Solid black button
                "bg-text-primary dark:bg-white",
                "text-white dark:text-black",
                // Shadow matching BottomNav
                "shadow-[0_8px_32px_rgba(0,0,0,0.3)]",
                // Safe area
                "pb-[env(safe-area-inset-bottom)]"
            )}
            aria-label="Write new entry"
        >
            {/* Pen/Write icon */}
            <svg
                width="20"
                height="20"
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
