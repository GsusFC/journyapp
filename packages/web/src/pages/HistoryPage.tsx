import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatDate, cn } from '../lib/utils'
import { useEntries, useIntersectionObserver, useWritePreferences, useToast } from '../hooks'
import { ScrambleText } from '../components/ui/ScrambleText'
import { ZenLayout } from '../components/layout/ZenLayout'
import { Header } from '../components/layout/Header'
import type { DecryptedEntry } from '../types/journal'

export function HistoryPage() {
    const [selectedId, setSelectedId] = useState<number | null>(null)
    const [decryptedEntry, setDecryptedEntry] = useState<DecryptedEntry | null>(null)
    const [isDecrypting, setIsDecrypting] = useState(false)
    const [errorMsg, setErrorMsg] = useState<string | null>(null)

    const { totalEntries, previews, error, isLoadingMore, hasMore, loadMore, decryptEntry } = useEntries()
    const [loadMoreRef, isIntersecting] = useIntersectionObserver<HTMLDivElement>()
    const { getTextareaClasses } = useWritePreferences()
    const toast = useToast()

    const copyContent = () => {
        if (decryptedEntry) {
            navigator.clipboard.writeText(decryptedEntry.content)
            toast.success('Content copied')
        }
    }

    // Cargar más cuando el sentinel es visible
    useEffect(() => {
        if (isIntersecting && hasMore && !isLoadingMore) {
            loadMore()
        }
    }, [isIntersecting, hasMore, isLoadingMore, loadMore])

    const handleCardClick = async (index: number) => {
        setSelectedId(index)
        setDecryptedEntry(null)
        setErrorMsg(null)

        try {
            setIsDecrypting(true)
            const entry = await decryptEntry(index)
            setDecryptedEntry(entry)
        } catch (err) {
            console.error('Decryption failed:', err)
            setErrorMsg((err as Error).message)
        } finally {
            setIsDecrypting(false)
        }
    }

    const handleClose = () => {
        setSelectedId(null)
        setDecryptedEntry(null)
        setErrorMsg(null)
    }

    return (
        <ZenLayout>
            <Header />

            {/* Main Content */}
            <main className="flex-1 w-full px-4 pt-16 pb-6">
                <div className="space-y-4">
                    <div className="flex items-baseline justify-between border-b border-stroke pb-3">
                        <h1 className="text-lg font-bold tracking-tight text-text-primary uppercase">
                            Journal History
                        </h1>
                        <span className="font-mono text-xs text-text-primary/40">
                            {totalEntries} {totalEntries === 1 ? 'ENTRY' : 'ENTRIES'}
                        </span>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 text-red-600 font-mono text-xs">
                            SYNC ERROR: {error}
                        </div>
                    )}

                    {/* Empty State */}
                    {totalEntries === 0 && !error && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center justify-center py-20 text-center"
                        >
                            <div className="w-16 h-16 border-2 border-dashed border-text-primary/20 flex items-center justify-center mb-6">
                                <span className="text-2xl text-text-primary/20">∅</span>
                            </div>
                            <h2 className="font-mono text-sm uppercase tracking-widest text-text-primary/60 mb-2">
                                No entries yet
                            </h2>
                            <p className="font-mono text-xs text-text-primary/40 max-w-xs mb-6">
                                Start your journey by writing your first memory.
                            </p>
                            <a
                                href="/write"
                                className="px-6 py-3 bg-text-primary text-surface font-mono text-xs uppercase tracking-widest hover:bg-text-primary/80 transition-colors"
                            >
                                Write First Entry
                            </a>
                        </motion.div>
                    )}

                    {/* List View */}
                    {previews.size > 0 && (
                    <div className="flex flex-col space-y-3">
                        {Array.from(previews.entries())
                            .sort(([a], [b]) => b - a) // Ordenar por índice descendente (más reciente primero)
                            .map(([index, preview], i) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    onClick={() => handleCardClick(index)}
                                    className="group cursor-pointer bg-white dark:bg-zinc-900 border border-stroke hover:border-brand-600/30 hover:shadow-sm transition-colors duration-300 p-5 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 left-0 w-1 h-full bg-brand-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    <div className="flex flex-col gap-2 pl-3">
                                        {/* Header: Date (principal) */}
                                        <div className="flex items-center justify-between">
                                            <span className="font-mono text-sm font-medium text-zinc-800 dark:text-zinc-200">
                                                {formatDate(preview.timestamp)}
                                            </span>
                                            <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-600">
                                                #{String(index + 1).padStart(3, '0')}
                                            </span>
                                        </div>

                                        {/* Preview (contenido principal) */}
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                                            {preview.preview}
                                        </p>

                                        {/* Action (secundario) */}
                                        <span className="text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-600 group-hover:text-brand-600 transition-colors">
                                            View Memory →
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        
                        {/* Load More */}
                        {hasMore && (
                            <div 
                                ref={loadMoreRef}
                                className="py-6 flex items-center justify-center"
                            >
                                <button
                                    onClick={loadMore}
                                    disabled={isLoadingMore}
                                    className="px-6 py-3 border border-text-primary/20 text-text-primary/60 font-mono text-xs uppercase tracking-widest hover:border-text-primary hover:text-text-primary hover:bg-text-primary/5 transition-colors disabled:opacity-50"
                                >
                                    {isLoadingMore ? 'Loading...' : 'Load More'}
                                </button>
                            </div>
                        )}
                    </div>
                    )}
                </div>
            </main>

            {/* Expanded View (Modal) */}
            <AnimatePresence>
                {selectedId !== null && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={handleClose}
                            className="fixed inset-0 bg-surface/90 dark:bg-black/90 backdrop-blur-sm z-40"
                        />
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="bg-white dark:bg-zinc-900 w-full max-w-2xl h-[80vh] shadow-2xl border border-stroke overflow-hidden flex flex-col pointer-events-auto relative"
                            >
                                {/* Modal Header */}
                                <div className="p-4 border-b border-stroke flex justify-between items-center bg-surface dark:bg-zinc-800/50">
                                    <div className="flex items-center gap-3">
                                        {decryptedEntry && (
                                            <span className="font-mono text-sm font-medium text-zinc-800 dark:text-zinc-200">
                                                {formatDate(decryptedEntry.timestamp)}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {decryptedEntry && (
                                            <button
                                                onClick={copyContent}
                                                className="px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
                                            >
                                                Copy
                                            </button>
                                        )}
                                        <button
                                            onClick={handleClose}
                                            className="w-8 h-8 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-400"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>

                                {/* Modal Content */}
                                <div className={cn(
                                    "flex-1 p-6 overflow-y-auto text-text-primary",
                                    getTextareaClasses()
                                )}>
                                    {isDecrypting ? (
                                        <div className="h-full flex flex-col items-center justify-center gap-4">
                                            <div className="w-12 h-12 border-2 border-brand-600/20 border-t-brand-600 rounded-full animate-spin" />
                                            <span className="font-mono text-xs animate-pulse text-brand-600 uppercase tracking-widest">
                                                Decrypting Secure Content...
                                            </span>
                                        </div>
                                    ) : errorMsg ? (
                                        <div className="h-full flex flex-col items-center justify-center text-red-500 gap-4">
                                            <span className="text-4xl">🔒</span>
                                            <p className="font-mono text-xs uppercase tracking-widest text-center max-w-xs">
                                                {errorMsg}
                                            </p>
                                            <button
                                                onClick={() => handleCardClick(selectedId)}
                                                className="text-xs underline hover:text-red-700"
                                            >
                                                Try Again
                                            </button>
                                        </div>
                                    ) : decryptedEntry ? (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            <ScrambleText
                                                text={decryptedEntry.content}
                                                duration={1.5}
                                                className="whitespace-pre-wrap"
                                            />

                                            <div className="mt-12 pt-8 border-t border-stroke flex justify-between items-center">
                                                <a
                                                    href={`https://ipfs.io/ipfs/${decryptedEntry.cid}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="font-mono text-[10px] text-text-primary/30 hover:text-brand-600 transition-colors uppercase tracking-wider"
                                                >
                                                    IPFS: {decryptedEntry.cid.slice(0, 8)}...
                                                </a>
                                                <div className="font-mono text-[10px] text-text-primary/30 uppercase tracking-wider">
                                                    End of Entry
                                                </div>
                                            </div>
                                        </motion.div>
                                    ) : null}
                                </div>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </ZenLayout>
    )
}
