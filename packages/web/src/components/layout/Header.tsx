import { useStreak } from '../../hooks'

export function Header() {
    const { streak } = useStreak()

    return (
        <header className="fixed top-0 left-0 right-0 mx-auto w-full max-w-md z-50 border-b border-stroke bg-surface/80 backdrop-blur-md pt-[env(safe-area-inset-top)]">
            <div className="px-6 py-4 flex items-center justify-center">
                {/* Center Logo + Streak */}
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-text-primary shadow-[0_0_20px_rgba(0,0,0,0.3)]" />
                    {streak > 0 && (
                        <span className="font-mono text-[10px] text-text-primary/60 uppercase tracking-widest">
                            {streak}D
                        </span>
                    )}
                </div>
            </div>
        </header>
    )
}
