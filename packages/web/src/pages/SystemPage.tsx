import { useAccount, useBalance } from 'wagmi'
import { formatEther } from 'viem'
import { Header } from '../components/layout/Header'
import { ConnectButton } from '../components/ConnectButton'
import { ZenLayout } from '../components/layout/ZenLayout'
import { motion } from 'framer-motion'
import { cn } from '../lib/utils'
import { useTheme } from 'next-themes'

export function SystemPage() {
    const { address } = useAccount()
    const { data: balance } = useBalance({ address })
    const { theme, setTheme } = useTheme()

    const copyAddress = () => {
        if (address) {
            navigator.clipboard.writeText(address)
            // Could add a toast here
        }
    }

    return (
        <ZenLayout>
            <Header />

            <main className="flex-1 w-full p-6 pt-20">
                <div className="space-y-8">
                    <div className="flex items-baseline justify-between border-b border-stroke pb-4">
                        <h1 className="text-lg font-bold tracking-tight text-text-primary uppercase">
                            System Control
                        </h1>
                        <span className="font-mono text-xs text-text-primary/40">
                            V1.0.0 :: BASE SEPOLIA
                        </span>
                    </div>

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
                            className="bg-white dark:bg-zinc-900 border border-stroke p-6 flex flex-col h-64"
                        >
                            <div className="font-mono text-[10px] text-text-primary/40 uppercase tracking-widest mb-6">
                                // MODULE: INTERFACE
                            </div>

                            <div className="flex-1 grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setTheme('light')}
                                    className={cn(
                                        "flex flex-col items-center justify-center gap-2 border transition-colors duration-300",
                                        theme === 'light'
                                            ? "border-brand-600 bg-brand-50/50 text-brand-600"
                                            : "border-stroke text-text-primary/40 hover:border-text-primary/30 hover:text-text-primary"
                                    )}
                                >
                                    <div className={cn(
                                        "w-4 h-4 rounded-full border border-current",
                                        theme === 'light' ? "bg-white" : "bg-transparent"
                                    )} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">LIGHT MODE</span>
                                </button>

                                <button
                                    onClick={() => setTheme('dark')}
                                    className={cn(
                                        "flex flex-col items-center justify-center gap-2 border transition-colors duration-300",
                                        theme === 'dark'
                                            ? "border-brand-600 bg-brand-900/20 text-brand-600"
                                            : "border-stroke text-text-primary/40 hover:border-text-primary/30 hover:text-text-primary"
                                    )}
                                >
                                    <div className={cn(
                                        "w-4 h-4 rounded-full border border-current",
                                        theme === 'dark' ? "bg-zinc-900" : "bg-transparent"
                                    )} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">DARK MODE</span>
                                </button>
                            </div>
                        </motion.div>

                        {/* CARD 3: LEGACY (LOCKED) */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
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
                </div>
            </main>
        </ZenLayout>
    )
}
