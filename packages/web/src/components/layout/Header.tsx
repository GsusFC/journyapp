import { useNavigate, useLocation } from 'react-router-dom'
import { ConnectButton } from '../ConnectButton'
import { cn } from '../../lib/utils'

export function Header() {
    const navigate = useNavigate()
    const location = useLocation()
    const isSystem = location.pathname === '/system'

    return (
        <header className="border-b border-text-primary/5 bg-surface/80 backdrop-blur-md sticky top-0 z-10">
            <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* Left Action: Navigation */}
                {isSystem ? (
                    <button
                        onClick={() => navigate(-1)}
                        className="text-xs uppercase tracking-widest text-text-primary/60 hover:text-brand-600 transition-colors font-bold flex items-center gap-2"
                    >
                        <span>←</span> BACK
                    </button>
                ) : (
                    <div className="flex gap-6">
                        <button
                            onClick={() => navigate('/write')}
                            className={cn(
                                "text-xs uppercase tracking-widest transition-colors font-bold",
                                location.pathname === '/write' || location.pathname === '/'
                                    ? "text-brand-600"
                                    : "text-text-primary/40 hover:text-brand-600"
                            )}
                        >
                            WRITE
                        </button>
                        <button
                            onClick={() => navigate('/history')}
                            className={cn(
                                "text-xs uppercase tracking-widest transition-colors font-bold",
                                location.pathname === '/history'
                                    ? "text-brand-600"
                                    : "text-text-primary/40 hover:text-brand-600"
                            )}
                        >
                            HISTORY
                        </button>
                    </div>
                )}

                {/* Right Action: System & Wallet */}
                <div className="flex items-center gap-4">
                    {!isSystem && (
                        <button
                            onClick={() => navigate('/system')}
                            className="text-xs uppercase tracking-widest text-text-primary/40 hover:text-brand-600 transition-colors font-bold"
                        >
                            [ SYSTEM ]
                        </button>
                    )}
                    {/* En SystemPage, la wallet va dentro del grid, pero podemos dejarla aquí también o quitarla */}
                    {!isSystem && <ConnectButton />}
                </div>
            </div>
        </header>
    )
}
