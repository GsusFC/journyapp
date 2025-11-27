import { useNavigate, useLocation } from 'react-router-dom'
import { useStreak } from '../../hooks'

export function Header() {
    const navigate = useNavigate()
    const location = useLocation()
    const path = location.pathname
    const { streak } = useStreak()

    // Logic for Left Button
    const renderLeftButton = () => {
        if (path === '/write') {
            return (
                <button
                    onClick={() => navigate('/history')}
                    className="text-xs uppercase tracking-widest text-text-primary/60 hover:text-brand-600 transition-colors font-bold flex items-center gap-2"
                >
                    <span>←</span> HISTORY
                </button>
            )
        }
        if (path === '/history' || path === '/system' || path === '/leaderboard') {
            return (
                <button
                    onClick={() => navigate('/write')}
                    className="text-xs uppercase tracking-widest text-text-primary/60 hover:text-brand-600 transition-colors font-bold flex items-center gap-2"
                >
                    <span>←</span> WRITE
                </button>
            )
        }
        return null
    }

    // Logic for Right Button
    const renderRightButton = () => {
        if (path === '/write') {
            return (
                <button
                    onClick={() => navigate('/leaderboard')}
                    className="text-xs uppercase tracking-widest text-text-primary/60 hover:text-brand-600 transition-colors font-bold flex items-center gap-2"
                >
                    RANK <span>→</span>
                </button>
            )
        }
        if (path === '/history' || path === '/leaderboard') {
            return (
                <button
                    onClick={() => navigate('/system')}
                    className="text-xs uppercase tracking-widest text-text-primary/60 hover:text-brand-600 transition-colors font-bold flex items-center gap-2"
                >
                    SYSTEM <span>→</span>
                </button>
            )
        }
        // In /system, right side is empty
        return <div className="w-12" />
    }

    return (
        <header className="fixed top-0 left-0 right-0 mx-auto w-full max-w-md z-50 border-b border-stroke bg-surface/80 backdrop-blur-md pt-[env(safe-area-inset-top)]">
            <div className="px-6 py-4 flex items-center justify-between relative">
                {renderLeftButton()}

                {/* Center Logo + Streak */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-2">
                    <div className="w-3 h-3 bg-text-primary shadow-[0_0_20px_rgba(0,0,0,0.3)]" />
                    {streak > 0 && (
                        <span className="font-mono text-[10px] text-text-primary/60 uppercase tracking-widest">
                            {streak}D
                        </span>
                    )}
                </div>

                {renderRightButton()}
            </div>
        </header>
    )
}
