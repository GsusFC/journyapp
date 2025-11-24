import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAccount, useReadContract } from 'wagmi'
import { readContract } from '@wagmi/core'
import { CONTRACT_ADDRESS } from '../lib/constants'
import { formatDate } from '../lib/utils'
import { ipfsService } from '../services/ipfs'
import { encryptionService } from '../services/encryption'
import { config } from '../config/web3'
import { ScrambleText } from '../components/ui/ScrambleText'
import JournyLogABI from '../abis/JournyLog.json'
import { Header } from '../components/layout/Header'
import { ZenLayout } from '../components/layout/ZenLayout'

interface DecryptedEntry {
    index: number
    cid: string
    content: string
    timestamp: number
}

export function HistoryPage() {
    const { address } = useAccount()
    const [selectedId, setSelectedId] = useState<number | null>(null)
    const [decryptedEntry, setDecryptedEntry] = useState<DecryptedEntry | null>(null)
    const [isDecrypting, setIsDecrypting] = useState(false)
    const [errorMsg, setErrorMsg] = useState<string | null>(null)

    const { data: entryCount, refetch, isError, error } = useReadContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: JournyLogABI.abi,
        functionName: 'getEntryCount',
        args: [address],
        chainId: 84532,
    })

    useEffect(() => {
        if (address) refetch()
    }, [address, refetch])

    const handleCardClick = async (index: number) => {
        setSelectedId(index)
        setDecryptedEntry(null)
        setErrorMsg(null)

        if (!address) return

        try {
            setIsDecrypting(true)

            const cid = await readContract(config, {
                address: CONTRACT_ADDRESS as `0x${string}`,
                abi: JournyLogABI.abi,
                functionName: 'getEntry',
                args: [address, index],
                chainId: 84532,
            }) as string

            const payload = await ipfsService.fetchEncryptedEntry(cid)

            if (!payload.encrypted || !payload.iv || !payload.salt) {
                throw new Error("Invalid payload structure")
            }

            const decrypted = await encryptionService.decrypt(
                payload.encrypted,
                payload.iv,
                payload.salt,
                address
            )

            setDecryptedEntry({
                index,
                cid,
                content: decrypted,
                timestamp: payload.timestamp
            })
        } catch (error) {
            console.error('Decryption failed:', error)
            setErrorMsg((error as Error).message)
        } finally {
            setIsDecrypting(false)
        }
    }

    const handleClose = () => {
        setSelectedId(null)
        setDecryptedEntry(null)
        setErrorMsg(null)
    }

    const totalEntries = entryCount ? Number(entryCount) : 0

    return (
        <ZenLayout>
            <Header />

            {/* Main Content */}
            <main className="flex-1 w-full p-6 pt-20">
                <div className="space-y-12">
                    <div className="flex items-baseline justify-between border-b border-text-primary/10 pb-4">
                        <h1 className="text-lg font-bold tracking-tight text-text-primary uppercase">
                            Journal History
                        </h1>
                        <span className="font-mono text-xs text-text-primary/40">
                            {totalEntries} {totalEntries === 1 ? 'MEMORY' : 'MEMORIES'}
                        </span>
                    </div>

                    {isError && (
                        <div className="p-4 bg-red-50 border border-red-200 text-red-600 font-mono text-xs">
                            SYNC ERROR: {error?.message}
                        </div>
                    )}

                    {/* List View */}
                    <div className="flex flex-col space-y-3">
                        {Array.from({ length: totalEntries }).map((_, i) => {
                            const index = totalEntries - 1 - i
                            return (
                                <motion.div
                                    layoutId={`card-${index}`}
                                    key={index}
                                    onClick={() => handleCardClick(index)}
                                    className="group cursor-pointer bg-white dark:bg-zinc-900 border border-stroke hover:border-brand-600/30 hover:shadow-sm transition-colors duration-300 p-4 relative overflow-hidden flex items-center justify-between"
                                >
                                    <div className="absolute top-0 left-0 w-1 h-full bg-brand-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    <div className="flex items-center gap-4 pl-2">
                                        <span className="font-mono text-xs text-text-primary/30">
                                            #{String(index + 1).padStart(3, '0')}
                                        </span>
                                        <div className="w-1.5 h-1.5 rounded-full bg-text-primary/10 group-hover:bg-brand-600 transition-colors" />
                                    </div>

                                    <div className="flex items-center">
                                        <span className="text-[10px] uppercase tracking-widest text-text-primary/40 font-bold group-hover:text-brand-600 transition-colors">
                                            View Memory →
                                        </span>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
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
                            className="fixed inset-0 bg-surface/90 backdrop-blur-sm z-40"
                        />
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                            <motion.div
                                layoutId={`card-${selectedId}`}
                                className="bg-white w-full max-w-2xl h-[80vh] shadow-2xl border border-text-primary/10 overflow-hidden flex flex-col pointer-events-auto relative"
                            >
                                {/* Modal Header */}
                                <div className="p-6 border-b border-text-primary/5 flex justify-between items-center bg-surface">
                                    <div className="flex items-center gap-4">
                                        <span className="font-mono text-xs text-text-primary/40">
                                            #{String(selectedId + 1).padStart(3, '0')}
                                        </span>
                                        {decryptedEntry && (
                                            <span className="font-mono text-xs text-brand-600">
                                                {formatDate(decryptedEntry.timestamp)}
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        onClick={handleClose}
                                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-text-primary/5 transition-colors"
                                    >
                                        ✕
                                    </button>
                                </div>

                                {/* Modal Content */}
                                <div className="flex-1 p-8 overflow-y-auto font-serif text-lg leading-relaxed text-text-primary">
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
                                                speed={1.5}
                                                className="whitespace-pre-wrap"
                                            />

                                            <div className="mt-12 pt-8 border-t border-text-primary/5 flex justify-between items-center">
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
