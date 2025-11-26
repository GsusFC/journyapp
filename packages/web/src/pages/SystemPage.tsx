import { useAccount, useBalance } from 'wagmi'
import { formatEther } from 'viem'
import { ConnectButton } from '../components/ConnectButton'
import { PageLayout } from '../components/layout/PageLayout'
import { motion } from 'framer-motion'
import { cn } from '../lib/utils'
import { useTheme } from 'next-themes'
import { useExportJournal, useToast, useWritePreferences } from '../hooks'

export function SystemPage() {
    const { address } = useAccount()
    const { data: balance } = useBalance({ address })
    const { theme, setTheme } = useTheme()
    const { exportingType, progress, exportAsJSON, exportAsMarkdown } = useExportJournal()
    const { preferences, setFontSize, setFontFamily, setLineHeight } = useWritePreferences()
    const toast = useToast()

    const copyAddress = () => {
        if (address) {
            navigator.clipboard.writeText(address)
            toast.success('Address copied')
        }
    }

    return (
        <PageLayout title="System Control" subtitle="V1.0.0 :: BASE SEPOLIA">
                    <div className="grid grid-cols-1 gap-4">
                        {/* CARD 1: IDENTITY */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-zinc-900 border border-stroke p-6 flex flex-col justify-between h-auto min-h-[160px]"
                        >
                            <div className="w-full">
                                <div className="font-mono text-[10px] text-text-primary/40 uppercase tracking-widest mb-4">
                                    // MODULE: IDENTITY
                                </div>
                                <div className="space-y-2 mb-6">
                                    <div className="font-mono text-xs text-text-primary/60">LINKED ADDRESS</div>
                                    <button
                                        onClick={copyAddress}
                                        className="font-mono text-sm text-text-primary hover:text-brand-600 transition-colors break-all text-left"
                                    >
                                        {address}
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 items-end border-t border-stroke pt-4">
                                <div className="space-y-1">
                                    <div className="font-mono text-[10px] text-text-primary/60 uppercase tracking-widest">BALANCE</div>
                                    <div className="text-xl font-bold text-text-primary truncate">
                                        {balance ? `${Number(formatEther(balance.value)).toFixed(4)} ${balance.symbol}` : '...'}
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <ConnectButton />
                                </div>
                            </div>
                        </motion.div>

                        {/* CARD 2: INTERFACE */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white dark:bg-zinc-900 border border-stroke p-6"
                        >
                            <div className="font-mono text-[10px] text-text-primary/40 uppercase tracking-widest mb-4">
                                // MODULE: INTERFACE
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setTheme('light')}
                                    className={cn(
                                        "flex-1 flex items-center justify-center gap-2 py-3 border transition-colors duration-300",
                                        theme === 'light'
                                            ? "border-zinc-400 dark:border-zinc-600 bg-zinc-100 dark:bg-zinc-800 text-text-primary"
                                            : "border-zinc-300 dark:border-zinc-700 text-text-primary/40 hover:border-zinc-400 dark:hover:border-zinc-600"
                                    )}
                                >
                                    <span className="text-sm">☀️</span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Light</span>
                                </button>

                                <button
                                    onClick={() => setTheme('dark')}
                                    className={cn(
                                        "flex-1 flex items-center justify-center gap-2 py-3 border transition-colors duration-300",
                                        theme === 'dark'
                                            ? "border-zinc-400 dark:border-zinc-600 bg-zinc-800 dark:bg-zinc-800 text-text-primary"
                                            : "border-zinc-300 dark:border-zinc-700 text-text-primary/40 hover:border-zinc-400 dark:hover:border-zinc-600"
                                    )}
                                >
                                    <span className="text-sm">🌙</span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Dark</span>
                                </button>
                            </div>
                        </motion.div>

                        {/* CARD 3: EDITOR */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white dark:bg-zinc-900 border border-stroke p-6"
                        >
                            <div className="font-mono text-[10px] text-text-primary/40 uppercase tracking-widest mb-4">
                                // MODULE: EDITOR
                            </div>

                            {/* Font Size */}
                            <div className="mb-4">
                                <span className="font-mono text-[10px] text-text-primary/60 uppercase tracking-widest block mb-2">
                                    Font Size
                                </span>
                                <div className="flex gap-2">
                                    {(['small', 'medium', 'large'] as const).map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setFontSize(size)}
                                            className={cn(
                                                "flex-1 py-2 border font-mono text-[10px] uppercase tracking-widest transition-colors",
                                                preferences.fontSize === size
                                                    ? "border-zinc-400 dark:border-zinc-600 bg-zinc-100 dark:bg-zinc-800 text-text-primary"
                                                    : "border-zinc-300 dark:border-zinc-700 text-text-primary/40 hover:border-zinc-400 dark:hover:border-zinc-600"
                                            )}
                                        >
                                            {size === 'small' ? 'S' : size === 'medium' ? 'M' : 'L'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Font Family */}
                            <div className="mb-4">
                                <span className="font-mono text-[10px] text-text-primary/60 uppercase tracking-widest block mb-2">
                                    Font
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setFontFamily('mono')}
                                        className={cn(
                                            "flex-1 py-2 border font-mono text-[10px] uppercase tracking-widest transition-colors",
                                            preferences.fontFamily === 'mono'
                                                ? "border-zinc-400 dark:border-zinc-600 bg-zinc-100 dark:bg-zinc-800 text-text-primary"
                                                : "border-zinc-300 dark:border-zinc-700 text-text-primary/40 hover:border-zinc-400 dark:hover:border-zinc-600"
                                        )}
                                    >
                                        Mono
                                    </button>
                                    <button
                                        onClick={() => setFontFamily('serif')}
                                        className={cn(
                                            "flex-1 py-2 border font-serif text-xs transition-colors",
                                            preferences.fontFamily === 'serif'
                                                ? "border-zinc-400 dark:border-zinc-600 bg-zinc-100 dark:bg-zinc-800 text-text-primary"
                                                : "border-zinc-300 dark:border-zinc-700 text-text-primary/40 hover:border-zinc-400 dark:hover:border-zinc-600"
                                        )}
                                    >
                                        Serif
                                    </button>
                                </div>
                            </div>

                            {/* Line Height */}
                            <div>
                                <span className="font-mono text-[10px] text-text-primary/60 uppercase tracking-widest block mb-2">
                                    Line Spacing
                                </span>
                                <div className="flex gap-2">
                                    {(['compact', 'normal', 'relaxed'] as const).map((height) => (
                                        <button
                                            key={height}
                                            onClick={() => setLineHeight(height)}
                                            className={cn(
                                                "flex-1 py-2 border font-mono text-[10px] uppercase tracking-widest transition-colors",
                                                preferences.lineHeight === height
                                                    ? "border-zinc-400 dark:border-zinc-600 bg-zinc-100 dark:bg-zinc-800 text-text-primary"
                                                    : "border-zinc-300 dark:border-zinc-700 text-text-primary/40 hover:border-zinc-400 dark:hover:border-zinc-600"
                                            )}
                                        >
                                            {height === 'compact' ? '≡' : height === 'normal' ? '☰' : '⋮'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* CARD 4: DATA EXPORT */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white dark:bg-zinc-900 border border-stroke p-6"
                        >
                            <div className="font-mono text-[10px] text-text-primary/40 uppercase tracking-widest mb-4">
                                // MODULE: DATA EXPORT
                            </div>
                            <p className="font-mono text-xs text-text-primary/60 mb-4">
                                Download all your journal entries. Your data, your ownership.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={exportAsJSON}
                                    disabled={exportingType !== null}
                                    className={cn(
                                        "flex-1 px-4 py-3 border border-zinc-300 dark:border-zinc-700 font-mono text-xs uppercase tracking-widest transition-colors",
                                        exportingType === 'json'
                                            ? "opacity-50 cursor-wait" 
                                            : exportingType === null 
                                                ? "hover:border-zinc-400 dark:hover:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                                : "opacity-30"
                                    )}
                                >
                                    {exportingType === 'json' ? `${progress}%` : 'Export JSON'}
                                </button>
                                <button
                                    onClick={exportAsMarkdown}
                                    disabled={exportingType !== null}
                                    className={cn(
                                        "flex-1 px-4 py-3 border border-zinc-300 dark:border-zinc-700 font-mono text-xs uppercase tracking-widest transition-colors",
                                        exportingType === 'markdown'
                                            ? "opacity-50 cursor-wait" 
                                            : exportingType === null 
                                                ? "hover:border-zinc-400 dark:hover:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                                : "opacity-30"
                                    )}
                                >
                                    {exportingType === 'markdown' ? `${progress}%` : 'Export MD'}
                                </button>
                            </div>
                        </motion.div>

                        {/* CARD 4: LEGACY (LOCKED) */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-zinc-50 dark:bg-zinc-900 border border-stroke p-6 opacity-60 relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

                            <div className="relative z-10 flex items-center justify-between">
                                <div>
                                    <div className="font-mono text-[10px] text-text-primary/40 uppercase tracking-widest mb-2">
                                        // MODULE: LEGACY
                                    </div>
                                    <h3 className="text-lg font-bold text-text-primary/60">
                                        CLANKER PROTOCOL
                                    </h3>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1 bg-text-primary/5 border border-stroke">
                                    <span className="text-xs">🔒</span>
                                    <span className="font-mono text-[10px] uppercase tracking-widest text-text-primary/60">
                                        LOCKED
                                    </span>
                                </div>
                            </div>

                            <div className="mt-4 font-mono text-xs text-text-primary/40">
                                REQUIRES 30 DAY STREAK TO UNLOCK TOKENIZATION FEATURES.
                            </div>
                        </motion.div>
                    </div>
        </PageLayout>
    )
}
