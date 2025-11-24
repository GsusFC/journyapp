import { useAccount, useBalance } from 'wagmi'
import { formatEther } from 'viem'
import { Header } from '../components/layout/Header'
import { ConnectButton } from '../components/ConnectButton'
import { motion } from 'framer-motion'
import { cn } from '../lib/utils'

export function SystemPage() {
    const { address } = useAccount()
    const { data: balance } = useBalance({ address })

    const copyAddress = () => {
        if (address) {
            navigator.clipboard.writeText(address)
            // Could add a toast here
        }
    }

    return (
        <div className="min-h-screen bg-surface flex flex-col">
            <Header />

            <main className="flex-1 max-w-4xl mx-auto w-full p-6">
                <div className="space-y-8">
                    <div className="flex items-baseline justify-between border-b border-text-primary/10 pb-4">
                        <h1 className="text-2xl font-bold tracking-tight text-text-primary uppercase">
                            System Control
                        </h1>
                        <span className="font-mono text-xs text-text-primary/40">
                            V1.0.0 :: BASE SEPOLIA
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* CARD 1: IDENTITY */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white border border-text-primary/10 p-6 flex flex-col justify-between h-64"
                        >
                            <div>
                                <div className="font-mono text-[10px] text-text-primary/40 uppercase tracking-widest mb-4">
                                    // MODULE: IDENTITY
                                </div>
                                <div className="space-y-2">
                                    <div className="font-mono text-xs text-text-primary/60">LINKED ADDRESS</div>
                                    <button
                                        onClick={copyAddress}
                                        className="font-mono text-sm text-text-primary hover:text-brand-600 transition-colors break-all text-left"
                                    >
                                        {address}
                                    </button>
                                </div>
                                <div className="mt-4 space-y-2">
                                    <div className="font-mono text-xs text-text-primary/60">BALANCE</div>
                                    <div className="text-2xl font-bold text-text-primary">
                                        {balance ? `${Number(formatEther(balance.value)).toFixed(4)} ${balance.symbol}` : '...'}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-auto">
                                <ConnectButton />
                            </div>
                        </motion.div>

                        {/* CARD 2: INTERFACE */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white border border-text-primary/10 p-6 flex flex-col h-64"
                        >
                            <div className="font-mono text-[10px] text-text-primary/40 uppercase tracking-widest mb-6">
                                // MODULE: INTERFACE
                            </div>

                            <div className="flex-1 grid grid-cols-2 gap-4">
                                <button className={cn(
                                    "flex flex-col items-center justify-center gap-2 border-2 transition-all duration-300",
                                    "border-brand-600 bg-surface-dark text-brand-600" // Active state (Light Mode default)
                                )}>
                                    <div className="w-4 h-4 rounded-full border border-current bg-white" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">LIGHT MODE</span>
                                </button>

                                <button className={cn(
                                    "flex flex-col items-center justify-center gap-2 border border-text-primary/10 text-text-primary/40",
                                    "hover:border-text-primary/30 hover:text-text-primary"
                                )}>
                                    <div className="w-4 h-4 rounded-full border border-current bg-zinc-900" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">DARK MODE</span>
                                </button>
                            </div>
                        </motion.div>

                        {/* CARD 3: LEGACY (LOCKED) */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="md:col-span-2 bg-zinc-50 border border-text-primary/5 p-6 opacity-60 relative overflow-hidden"
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
                                <div className="flex items-center gap-2 px-3 py-1 bg-text-primary/5 border border-text-primary/10">
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
        </div>
    )
}
