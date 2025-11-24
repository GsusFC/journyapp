import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useChainId } from 'wagmi'
import { useAppKit } from '@reown/appkit/react'
import { encryptionService } from '../services/encryption'
import { ipfsService } from '../services/ipfs'
import { CONTRACT_ADDRESS } from '../lib/constants'
import { cn } from '../lib/utils'
import JournyLogABI from '../abis/JournyLog.json'
import { Header } from '../components/layout/Header'
import { ZenLayout } from '../components/layout/ZenLayout'

export function WritePage() {
    const { address } = useAccount()
    const [content, setContent] = useState('')
    const [statusMessage, setStatusMessage] = useState<string | null>(null)
    const [isSaving, setIsSaving] = useState(false)

    const { writeContract, data: hash } = useWriteContract()

    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash,
    })

    const { open } = useAppKit()
    const chainId = useChainId()

    const handleSave = async () => {
        if (!content.trim() || !address) return

        // Guard: Check Network
        if (chainId !== 84532) {
            setStatusMessage('WRONG NETWORK')
            await open({ view: 'Networks' }) // Open AppKit Network Modal
            return
        }

        try {
            setIsSaving(true)
            setStatusMessage('ENCRYPTING...')

            // 1. Encrypt
            const { encrypted, iv, salt } = await encryptionService.encrypt(content, address)

            // 2. Upload to IPFS
            setStatusMessage('UPLOADING TO IPFS...')
            const cid = await ipfsService.uploadEncryptedEntry({
                encrypted,
                iv,
                salt,
                timestamp: Date.now()
            })

            // 3. Write to Contract
            setStatusMessage('CONFIRM IN WALLET...')
            writeContract({
                address: CONTRACT_ADDRESS as `0x${string}`,
                abi: JournyLogABI.abi,
                functionName: 'logEntry',
                args: [cid],
                chainId: 84532, // Force Base Sepolia
            })

        } catch (error) {
            console.error('Save failed:', error)
            setStatusMessage('FAILED')
            setIsSaving(false)
        }
    }

    // Reset status when confirmed
    if (isConfirmed && isSaving) {
        setIsSaving(false)
        setStatusMessage('SAVED ON-CHAIN')
        setContent('')
        setTimeout(() => setStatusMessage(null), 3000)
    }

    const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0

    return (
        <ZenLayout>
            <Header />

            {/* Main Content */}
            <main className="flex-1 flex flex-col w-full p-6 pt-24 relative">
                <div className="w-full space-y-8 mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative"
                    >
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="START WRITING..."
                            className={cn(
                                "w-full min-h-[60vh] bg-transparent resize-none outline-none",
                                "font-mono text-base leading-relaxed text-text-primary placeholder:text-text-primary/20", // text-base prevents iOS zoom
                                "transition-all duration-500 ease-out",
                                "border-b border-transparent focus:border-brand-600/30",
                                "focus:bg-white/50 dark:focus:bg-zinc-900/50 rounded-sm p-2" // Subtle background shift on focus
                            )}
                            spellCheck={false}
                        />

                        <div className="fixed bottom-8 left-0 right-0 mx-auto w-full max-w-md px-8 flex items-center justify-end z-20 pointer-events-none">
                            <div className="pointer-events-auto flex items-center gap-6">
                                <div className="flex items-center gap-4 text-[10px] font-mono text-text-primary/30 uppercase tracking-widest">
                                    <span>{wordCount} WORDS</span>
                                    {statusMessage && (
                                        <span className="text-brand-600 animate-pulse">
                                            [{statusMessage}]
                                        </span>
                                    )}
                                </div>

                                <button
                                    onClick={handleSave}
                                    disabled={!content.trim() || isSaving || isConfirming}
                                    className={cn(
                                        "px-8 py-3 bg-text-primary text-surface font-mono font-bold text-xs uppercase tracking-widest hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                                        (isSaving || isConfirming) && "opacity-50 cursor-wait"
                                    )}
                                >
                                    {isSaving || isConfirming ? 'SAVING...' : 'SAVE ENTRY'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
        </ZenLayout>
    )
}
