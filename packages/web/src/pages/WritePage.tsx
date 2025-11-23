import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract, useSwitchChain, useChainId } from 'wagmi'
import { ConnectButton } from '../components/ConnectButton'
import { encryptionService } from '../services/encryption'
import { ipfsService } from '../services/ipfs'
import { CONTRACT_ADDRESS } from '../lib/constants'
import { cn, formatStreak } from '../lib/utils'
import { useNavigate } from 'react-router-dom'
import JournyLogABI from '../abis/JournyLog.json'

export function WritePage() {
    const navigate = useNavigate()
    const { address } = useAccount()
    const [content, setContent] = useState('')
    const [isProcessing, setIsProcessing] = useState(false)
    const [statusMessage, setStatusMessage] = useState('')

    const { writeContract, data: hash } = useWriteContract()
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

    const { data: currentStreak } = useReadContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: JournyLogABI.abi,
        functionName: 'currentStreak',
        args: [address],
    })

    const { switchChain } = useSwitchChain()
    const chainId = useChainId()

    const handleSave = async () => {
        if (!content.trim() || !address) return

        // Guard: Check Network
        if (chainId !== 84532) {
            try {
                setStatusMessage('SWITCHING NETWORK...')
                switchChain({ chainId: 84532 })
                return // Stop here, user needs to switch first
            } catch (error) {
                console.error('Failed to switch network:', error)
                setStatusMessage('WRONG NETWORK')
                return
            }
        }

        try {
            setIsProcessing(true)

            setStatusMessage('ENCRYPTING...')
            const encrypted = await encryptionService.encrypt(content, address)

            setStatusMessage('UPLOADING TO IPFS...')
            const cid = await ipfsService.uploadEncryptedEntry({
                ...encrypted,
                timestamp: Date.now()
            })

            setStatusMessage('SIGNING TRANSACTION...')
            writeContract({
                address: CONTRACT_ADDRESS as `0x${string}`,
                abi: JournyLogABI.abi,
                functionName: 'logEntry',
                args: [cid],
            })

            setStatusMessage('CONFIRMING...')
        } catch (error) {
            console.error('Save failed:', error)
            setStatusMessage('FAILED')
            setIsProcessing(false)
        }
    }

    if (isSuccess && isProcessing) {
        setContent('')
        setIsProcessing(false)
        setStatusMessage('SAVED')
        setTimeout(() => setStatusMessage(''), 3000)
    }

    const charCount = content.length
    const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0

    return (
        <div className="min-h-screen bg-surface flex flex-col">
            {/* Header */}
            <header className="border-b-2 border-text-primary/10 bg-surface sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/history')}
                        className="text-xs uppercase tracking-widest text-text-primary/60 hover:text-brand-600 transition-colors font-bold"
                    >
                        ← History
                    </button>

                    <div className="flex items-center gap-4">
                        {currentStreak !== undefined && (
                            <div className="px-4 py-2 bg-surface-dark border border-brand-600/20">
                                <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                                    {formatStreak(Number(currentStreak))}
                                </span>
                            </div>
                        )}
                        <ConnectButton />
                    </div>
                </div>
            </header>

            {/* Main Editor */}
            <main className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-3xl space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="START WRITING..."
                            disabled={isProcessing || isConfirming}
                            className={cn(
                                "w-full min-h-[500px] px-8 py-8",
                                "bg-white border-2 border-text-primary/10",
                                "text-text-primary placeholder:text-text-primary/30",
                                "text-base leading-loose",
                                "focus:outline-none focus:border-brand-600",
                                "resize-none transition-all duration-200",
                                "disabled:opacity-50 disabled:cursor-not-allowed"
                            )}
                        />
                    </motion.div>

                    {/* Footer Controls */}
                    <div className="flex items-center justify-between">
                        <div className="text-xs uppercase tracking-widest text-text-primary/40 space-x-6 font-mono">
                            <span>{wordCount} WORDS</span>
                            <span>•</span>
                            <span>{charCount} CHARS</span>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSave}
                            disabled={!content.trim() || isProcessing || isConfirming}
                            className={cn(
                                "px-8 py-4 font-bold text-sm uppercase tracking-wider",
                                "bg-surface-dark text-text-secondary",
                                "border-2 border-brand-600",
                                "hover:bg-brand-600 hover:text-white",
                                "transition-all duration-300",
                                "disabled:opacity-50 disabled:cursor-not-allowed"
                            )}
                        >
                            {(isProcessing || isConfirming) ? 'SAVING...' : 'SAVE ENTRY'}
                        </motion.button>
                    </div>

                    {/* Status Message */}
                    <AnimatePresence>
                        {statusMessage && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-center text-xs uppercase tracking-widest text-brand-600 bg-surface-dark border border-brand-600/20 py-4 px-6 font-bold"
                            >
                                {statusMessage}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    )
}
