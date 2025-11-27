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
            {/* SVG Filter for liquid distortion */}
            <svg style={{ display: 'none' }}>
                <filter id="liquid-glass" x="0%" y="0%" width="100%" height="100%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.005 0.005" numOctaves="1" seed="42" result="noise" />
                    <feGaussianBlur in="noise" stdDeviation="0.5" result="blurred" />
                    <feDisplacementMap in="SourceGraphic" in2="blurred" scale="3" xChannelSelector="R" yChannelSelector="G" />
                </filter>
            </svg>

            {/* Container for both nav and FAB */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4"
            >
                {/* Glass nav pill */}
                <nav className="relative rounded-full overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.1),0_0_12px_rgba(0,0,0,0.05)]">
                    {/* Glass filter layer */}
                    <div 
                        className="absolute inset-0 z-0 backdrop-blur-sm"
                        style={{ filter: 'url(#liquid-glass)' }}
                    />
                    
                    {/* Glass overlay */}
                    <div className="absolute inset-0 z-[1] bg-white/25 dark:bg-white/15" />
                    
                    {/* Glass specular highlight */}
                    <div 
                        className="absolute inset-0 z-[2] rounded-full overflow-hidden"
                        style={{ 
                            boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.75), inset 0 0 5px rgba(255,255,255,0.75)' 
                        }}
                    />

                    {/* Content */}
                    <div className="relative z-[3] flex items-center gap-1 px-2 py-2">
                        {NAV_ITEMS.map((item) => {
                            const isActive = currentPath === item.path

                            return (
                                <button
                                    key={item.path}
                                    onClick={() => navigate(item.path)}
                                    className={cn(
                                        "px-5 py-2 font-mono text-xs uppercase tracking-widest transition-all duration-300",
                                        isActive
                                            ? "text-black font-bold"
                                            : "text-black/40 hover:text-black/60"
                                    )}
                                >
                                    {item.label}
                                </button>
                            )
                        })}
                    </div>
                </nav>

                {/* Write FAB */}
                <button
                    onClick={() => navigate('/write')}
                    className={cn(
                        "w-[50px] h-[50px] rounded-full",
                        "flex items-center justify-center",
                        "bg-text-primary dark:bg-white",
                        "text-white dark:text-black",
                        "shadow-[0_2px_8px_rgba(0,0,0,0.15)]",
                        "hover:scale-105 active:scale-95 transition-transform"
                    )}
                    aria-label="Write new entry"
                >
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
                </button>
            </motion.div>
        </div>
    )
}
