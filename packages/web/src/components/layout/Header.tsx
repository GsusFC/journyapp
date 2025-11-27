import { useNavigate, useLocation } from 'react-router-dom'
import { useStreak } from '../../hooks'

export function Header() {
    const navigate = useNavigate()
    const location = useLocation()
    const { streak } = useStreak()
    const isWritePage = location.pathname === '/write'

    return (
        <header className="fixed top-0 left-0 right-0 mx-auto w-full max-w-md z-50 border-b border-stroke bg-surface/80 backdrop-blur-md pt-[env(safe-area-inset-top)]">
            <div className="px-6 py-4 flex items-center justify-between">
                {/* Left: Back button (only on Write) */}
                <div className="w-8">
                    {isWritePage && (
                        <button
                            onClick={() => navigate('/history')}
                            className="text-text-primary/60 hover:text-text-primary transition-colors"
                            aria-label="Go back"
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
                                <path d="M19 12H5" />
                                <path d="M12 19l-7-7 7-7" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Center: Logo + Streak */}
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-text-primary shadow-[0_0_20px_rgba(0,0,0,0.3)]" />
                    {streak > 0 && (
                        <span className="font-mono text-[10px] text-text-primary/60 uppercase tracking-widest">
                            {streak}D
                        </span>
                    )}
                </div>

                {/* Right: Spacer for balance */}
                <div className="w-8" />
            </div>
        </header>
    )
}
