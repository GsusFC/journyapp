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
                            style={{
                                background: 'transparent',
                            }}
                            onFocus={(e) => {
                                e.target.style.background = 'linear-gradient(to bottom, var(--focus-bg) 0%, transparent 100%)'
                            }}
                            onBlur={(e) => {
                                e.target.style.background = 'transparent'
                            }}
                            className={cn(
                                "w-full min-h-[85vh] resize-none",
                                "text-text-primary placeholder:text-text-primary/20",
                                "transition-all duration-300 ease-out p-3",
                                "[--focus-bg:rgb(244,244,245)] dark:[--focus-bg:rgb(24,24,27)]",
                                "outline-none border-none ring-0 focus:outline-none focus:border-none focus:ring-0",
                                getTextareaClasses()
                            )}
                            spellCheck={false}
                        />

                        <div className="fixed bottom-8 left-0 right-0 mx-auto w-full max-w-md px-8 flex items-center justify-between z-20 pointer-events-none">
                            <div className="pointer-events-auto flex items-center gap-2">
                                {isWrongNetwork && (
                                    <div className="px-2 py-1 bg-red-500 text-white text-[10px] font-mono font-bold uppercase tracking-widest animate-pulse">
                                        WRONG NETWORK
                                    </div>
                                )}
                            </div>

                            <div className="pointer-events-auto flex items-center gap-6">
                                <div className="flex items-center gap-4 text-[10px] font-mono text-text-primary/30 uppercase tracking-widest">
                                    <span>{wordCount} WORDS</span>
                                    {statusMessage && (
                                        <span className="text-text-primary animate-pulse">
                                            [{statusMessage}]
                                        </span>
                                    )}
                                </div>

                                <button
                                    onClick={handleSave}
                                    disabled={!content.trim() || isSaving}
                                    className={cn(
                                        "px-8 py-3 bg-text-primary text-surface font-mono font-bold text-xs uppercase tracking-widest hover:bg-text-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                                        isSaving && "opacity-50 cursor-wait"
                                    )}
                                >
                                    {isSaving ? 'SAVING...' : 'SAVE ENTRY'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
        </ZenLayout>
    )
}
