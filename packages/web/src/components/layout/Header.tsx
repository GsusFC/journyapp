import { useNavigate, useLocation } from 'react-router-dom'

export function Header() {
    const navigate = useNavigate()
    const location = useLocation()
    const path = location.pathname

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
        if (path === '/history' || path === '/system') {
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
        if (path === '/write' || path === '/history') {
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
        return <div className="w-12" /> // Spacer to keep alignment if needed, or just null
    }

    return (
        <header className="border-b border-text-primary/5 bg-surface/80 backdrop-blur-md sticky top-0 z-10">
            <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                {renderLeftButton()}
                {renderRightButton()}
            </div>
        </header>
    )
}
