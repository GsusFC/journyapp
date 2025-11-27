import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useWriteEntry, useBalanceCheck, useToast, useWritePreferences } from '../hooks'
import { cn } from '../lib/utils'
import { Header } from '../components/layout/Header'
import { ZenLayout } from '../components/layout/ZenLayout'

const STATUS_MESSAGES: Record<string, string> = {
    idle: '',
    encrypting: 'ENCRYPTING...',
    uploading: 'UPLOADING TO IPFS...',
    confirming: 'CONFIRM IN WALLET...',
    success: 'SAVED ON-CHAIN',
    error: 'FAILED'
}

export function WritePage() {
    const [content, setContent] = useState('')
    const navigate = useNavigate()
    const hasRedirected = useRef(false)
    const toast = useToast()

    const { status, error, isWrongNetwork, save, reset } = useWriteEntry()
    const { hasEnoughBalance } = useBalanceCheck()
    const { getTextareaClasses } = useWritePreferences()

    const statusMessage = error ? `FAILED: ${error.message}` : STATUS_MESSAGES[status] || ''
    const isSaving = status === 'encrypting' || status === 'uploading' || status === 'confirming'

    // Redirigir al historial cuando se guarda exitosamente
    useEffect(() => {
        if (status === 'success' && !hasRedirected.current) {
            hasRedirected.current = true
            toast.success('Entry saved on-chain')
            const timeout = setTimeout(() => {
                reset()
                navigate('/history')
            }, 1000)
            return () => clearTimeout(timeout)
        }
        if (status === 'idle') {
            hasRedirected.current = false
        }
    }, [status, navigate, reset, toast])

    const handleSave = () => {
        // Validar balance antes de guardar
        if (!hasEnoughBalance) {
            toast.error('Insufficient ETH balance for transaction')
            return
        }
        
        if (status === 'success') {
            setContent('')
        }
        save(content)
    }

    const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0

    return (
        <ZenLayout>
            <Header />

            {/* Main Content */}
            <main className="flex-1 flex flex-col w-full px-3 pt-16 pb-20 relative">
                <div className="w-full mx-auto">
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
                                "w-full min-h-[85vh] resize-none bg-transparent",
                                "text-text-primary placeholder:text-text-primary/20",
                                "p-3 outline-none border-none shadow-none",
                                "focus:outline-none focus:border-none focus:ring-0 focus:shadow-none",
                                "appearance-none",
                                getTextareaClasses()
                            )}
                            spellCheck={false}
                        />

                        {/* Bottom bar - word count + save button */}
                        <div className="fixed bottom-6 right-4 z-20 pb-[env(safe-area-inset-bottom)]">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-4"
                            >
                                {/* Word count and status */}
                                <div className="flex items-center gap-3 h-[50px]">
                                    {isWrongNetwork && (
                                        <span className="text-red-500 text-[10px] font-mono font-bold uppercase tracking-widest animate-pulse">
                                            WRONG NETWORK
                                        </span>
                                    )}
                                    <span className="text-[10px] font-mono text-text-primary/30 uppercase tracking-widest">
                                        {wordCount} WORDS
                                    </span>
                                    {statusMessage && (
                                        <span className={cn(
                                            "text-[10px] font-mono font-bold uppercase tracking-widest",
                                            status === 'error' && "text-red-500",
                                            status === 'success' && "text-green-600",
                                            (status === 'encrypting' || status === 'uploading' || status === 'confirming') && "text-text-primary/60 animate-pulse"
                                        )}>
                                            {statusMessage}
                                        </span>
                                    )}
                                </div>

                                {/* Save button */}
                                <button
                                    onClick={handleSave}
                                    disabled={!content.trim() || isSaving}
                                    className={cn(
                                        "h-[50px] px-6 rounded-full",
                                        "flex items-center justify-center",
                                        "bg-text-primary dark:bg-white",
                                        "text-white dark:text-black",
                                        "font-mono font-bold text-xs uppercase tracking-widest",
                                        "shadow-[0_2px_8px_rgba(0,0,0,0.15)]",
                                        "hover:scale-105 active:scale-95 transition-transform",
                                        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
                                        isSaving && "opacity-50 cursor-wait"
                                    )}
                                >
                                    {isSaving ? 'SAVING...' : 'SAVE'}
                                </button>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </main>
        </ZenLayout>
    )
}
