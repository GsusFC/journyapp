import { motion } from 'framer-motion'
import { useAppKit } from '@reown/appkit/react'
import { useAccount, useDisconnect } from 'wagmi'
import { cn } from '../lib/utils'

export function ConnectButton() {
    const { open } = useAppKit()
    const { address, isConnected } = useAccount()
    const { disconnect } = useDisconnect()

    if (isConnected && address) {
        return (
            <motion.button
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => disconnect()}
                className={cn(
                    "px-4 py-3 font-mono text-sm uppercase tracking-wider",
                    "bg-surface-dark border-2 border-brand-600",
                    "text-text-secondary hover:bg-brand-600 hover:text-white",
                    "transition-all duration-200"
                )}
            >
                {address.slice(0, 6)}...{address.slice(-4)}
            </motion.button>
        )
    }

    return (
        <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => open()}
            className={cn(
                "px-8 py-4 font-mono text-sm uppercase tracking-wider font-bold",
                "bg-surface-dark text-text-secondary",
                "border-2 border-brand-600",
                "hover:bg-brand-600 hover:text-white",
                "transition-all duration-300"
            )}
        >
            Connect Journy
        </motion.button>
    )
}
