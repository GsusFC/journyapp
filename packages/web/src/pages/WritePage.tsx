import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useChainId } from 'wagmi'
import { useAppKit } from '@reown/appkit/react'
import { useNavigate } from 'react-router-dom'
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
    const navigate = useNavigate()

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

            // Extract preview (first 2 lines, max 150 chars)
            const lines = content.split('\n')
            const preview = lines.slice(0, 2).join('\n').slice(0, 150)

            // 1. Encrypt
            const { encrypted, iv, salt } = await encryptionService.encrypt(content, address)

            // 2. Upload to IPFS
            setStatusMessage('UPLOADING TO IPFS...')
            const cid = await ipfsService.uploadEncryptedEntry({
                encrypted,
                iv,
                salt,
                timestamp: Math.floor(Date.now() / 1000), // Fix: Use seconds, not milliseconds
                preview
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

    // Reset status when confirmed and redirect
    if (isConfirmed && isSaving) {
        setIsSaving(false)
        setStatusMessage('SAVED ON-CHAIN')
        setContent('')
        setTimeout(() => {
            setStatusMessage(null)
            navigate('/history')
        }, 1000)
    }

    const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0

    return (
        <ZenLayout>
            <Header />

            {/* Main Content */}
            <main className="flex-1 flex flex-col w-full p-6 pt-20 relative">
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
                                "w-full min-h-[70vh] bg-transparent resize-none outline-none",
                                "font-mono text-base leading-relaxed text-text-primary placeholder:text-text-primary/20",
                                "transition-colors duration-300 ease-out",
                                "focus:bg-white dark:focus:bg-zinc-900 rounded-sm p-4"
                            )}
                            spellCheck={false}
                        />

                        <div className="fixed bottom-8 left-0 right-0 mx-auto w-full max-w-md px-8 flex items-center justify-between z-20 pointer-events-none">
                            <div className="pointer-events-auto flex items-center gap-2">
                                <div className="text-[10px] font-mono text-text-primary/40 uppercase tracking-widest">
                                    Target: 84532
                                </div>
                                {chainId !== 84532 && (
                                    <div className="px-2 py-1 bg-red-500 text-white text-[10px] font-mono font-bold uppercase tracking-widest animate-pulse">
                                        WRONG NETWORK
                                    </div>
                                )}
                            </div>

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
