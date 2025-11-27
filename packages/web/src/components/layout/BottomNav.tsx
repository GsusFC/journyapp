import { useNavigate, useLocation } from 'react-router-dom'
import { cn } from '../../lib/utils'
import { motion } from 'framer-motion'

const NAV_ITEMS = [
    { path: '/history', label: 'History' },
    { path: '/leaderboard', label: 'Rank' },
    { path: '/system', label: 'System' },
] as const

export function BottomNav() {
    const navigate = useNavigate()
    const location = useLocation()
    const currentPath = location.pathname

    // No mostrar en landing o write
    if (currentPath === '/' || currentPath === '/write') {
        return null
    }

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pb-[env(safe-area-inset-bottom)]">
            {/* Glass pill container */}
            <motion.nav
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                    "flex items-center gap-1 px-2 py-2 rounded-full",
                    // Liquid glass effect
                    "bg-black/80 dark:bg-white/10",
                    "backdrop-blur-xl backdrop-saturate-150",
                    "border border-white/10 dark:border-white/20",
                    "shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
                )}
            >
                {NAV_ITEMS.map((item) => {
                    const isActive = currentPath === item.path

                    return (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={cn(
                                "relative px-5 py-2 rounded-full font-mono text-xs uppercase tracking-widest transition-all duration-300",
                                isActive
                                    ? "text-black dark:text-black"
                                    : "text-white/60 dark:text-white/40 hover:text-white/90 dark:hover:text-white/70"
                            )}
                        >
                            {/* Active indicator background */}
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-white dark:bg-white rounded-full"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10">{item.label}</span>
                        </button>
                    )
                })}
            </motion.nav>
        </div>
    )
}
