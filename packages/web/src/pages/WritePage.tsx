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
        <div className="min-h-screen bg-surface flex flex-col relative">
            <Header />

            {/* Main Content */}
            <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-6 relative">
                <div className="w-full max-w-3xl space-y-8 mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative"
                    >
                        <div className="absolute -top-6 left-0 flex items-center gap-2">
                            <div className={cn(
                                "w-2 h-2 rounded-full transition-colors duration-500",
                                isSaving || isConfirming ? "bg-brand-600 animate-pulse" : "bg-green-500"
                            )} />
                            <span className="text-[10px] font-mono text-text-primary/40 uppercase tracking-widest">
                                {statusMessage || (isSaving || isConfirming ? 'PROCESSING...' : 'READY')}
                            </span>
                        </div>

                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="START WRITING..."
                            className="w-full min-h-[60vh] bg-transparent resize-none outline-none font-serif text-lg leading-relaxed text-text-primary placeholder:text-text-primary/20"
                            spellCheck={false}
                        />

                        <div className="fixed bottom-8 right-8 flex items-center gap-4">
                            <span className="font-mono text-xs text-text-primary/30">
                                {wordCount} WORDS
                            </span>
                            <button
                                onClick={handleSave}
                                disabled={!content.trim() || isSaving || isConfirming}
                                className={cn(
                                    "px-8 py-3 bg-text-primary text-surface font-bold text-xs uppercase tracking-widest hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                                    (isSaving || isConfirming) && "opacity-50 cursor-wait"
                                )}
                            >
                                {isSaving || isConfirming ? 'SAVING...' : 'SAVE ENTRY'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    )
}
