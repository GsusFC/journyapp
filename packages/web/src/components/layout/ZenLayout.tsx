import { ReactNode } from 'react'
import { cn } from '../../lib/utils'

interface ZenLayoutProps {
    children: ReactNode
    className?: string
}

export function ZenLayout({ children, className }: ZenLayoutProps) {
    return (
        <div className="min-h-[100dvh] w-full bg-surface flex flex-col items-center justify-center overflow-x-hidden">
            {/* Mobile Container Constraint */}
            <div className={cn(
                "w-full max-w-md mx-auto min-h-[100dvh] relative flex flex-col bg-surface shadow-2xl shadow-black/5",
                "pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]",
                className
            )}>
                {children}
            </div>
        </div>
    )
}
