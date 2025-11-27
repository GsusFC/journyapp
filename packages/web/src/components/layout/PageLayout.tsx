import { Header } from './Header'
import { ZenLayout } from './ZenLayout'

interface PageLayoutProps {
    title: string
    subtitle?: string
    children: React.ReactNode
}

export function PageLayout({ title, subtitle, children }: PageLayoutProps) {
    return (
        <ZenLayout>
            <Header />

            <main className="flex-1 w-full px-4 pt-16 pb-24">
                <div className="space-y-4">
                    <div className="flex items-baseline justify-between border-b border-stroke pb-3">
                        <h1 className="text-lg font-bold tracking-tight text-text-primary uppercase">
                            {title}
                        </h1>
                        {subtitle && (
                            <span className="font-mono text-xs text-text-primary/40">
                                {subtitle}
                            </span>
                        )}
                    </div>

                    {children}
                </div>
            </main>
        </ZenLayout>
    )
}
