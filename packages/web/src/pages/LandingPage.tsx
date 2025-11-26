import { motion } from 'framer-motion'
import { ConnectButton } from '../components/ConnectButton'

export function LandingPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-surface">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-3xl w-full space-y-12"
            >
                {/* Logo + Title - Horizontal */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center justify-center gap-3"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-text-primary shadow-[0_0_20px_rgba(0,0,0,0.3)]" />
                    </motion.div>

                    <h1 className="text-5xl md:text-6xl font-black text-text-primary tracking-tight">
                        JOURNY
                    </h1>
                </motion.div>

                {/* Description */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-center space-y-8"
                >
                    <p className="text-lg md:text-xl text-text-primary/60 font-light max-w-2xl mx-auto">
                        Your thoughts. Encrypted.<br />
                        Owned by you. Forever on-chain.
                    </p>

                    {/* Connect Button - Moved here */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <ConnectButton />
                    </motion.div>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="grid md:grid-cols-3 gap-4"
                >
                    <FeatureCard
                        number="01"
                        title="PRIVACY"
                        description="Client-side AES-GCM encryption. Zero knowledge."
                    />
                    <FeatureCard
                        number="02"
                        title="STREAKS"
                        description="Build reputation through consistent writing."
                    />
                    <FeatureCard
                        number="03"
                        title="OWNERSHIP"
                        description="IPFS + Base. Your data, your keys."
                    />
                </motion.div>

                {/* Footer Tech Stack */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="flex justify-center"
                >
                    <p className="text-xs uppercase tracking-widest text-text-primary/40 font-medium">
                        Base • IPFS • Web3
                    </p>
                </motion.div>
            </motion.div>
        </div>
    )
}

function FeatureCard({
    number,
    title,
    description
}: {
    number: string
    title: string
    description: string
}) {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="p-5 bg-white dark:bg-zinc-900 border border-stroke hover:border-brand-600 transition-all duration-200"
        >
            <div className="space-y-2">
                <div className="flex items-baseline gap-3">
                    <div className="text-xs font-bold text-brand-600 tracking-widest">{number}</div>
                    <h3 className="text-sm font-bold text-text-primary">{title}</h3>
                </div>
                <p className="text-xs text-text-primary/60 leading-relaxed">{description}</p>
            </div>
        </motion.div>
    )
}
