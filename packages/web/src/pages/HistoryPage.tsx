import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAccount, useReadContract } from 'wagmi'
import { readContract } from '@wagmi/core'
import { useNavigate } from 'react-router-dom'
import { ConnectButton } from '../components/ConnectButton'
import { CONTRACT_ADDRESS } from '../lib/constants'
import { formatDate, cn } from '../lib/utils'
import { ipfsService } from '../services/ipfs'
import { encryptionService } from '../services/encryption'
import { wagmiAdapter, config } from '../config/web3'
import JournyLogABI from '../abis/JournyLog.json'

interface DecryptedEntry {
    cid: string
    content: string
    timestamp: number
}

export function HistoryPage() {
    const navigate = useNavigate()
    const { address } = useAccount()
    const [selectedEntry, setSelectedEntry] = useState<DecryptedEntry | null>(null)
    const [isDecrypting, setIsDecrypting] = useState(false)

    const { data: entryCount, refetch, isLoading, isError, error } = useReadContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: JournyLogABI.abi,
        functionName: 'getEntryCount',
        args: [address],
        chainId: 84532, // Force Base Sepolia
    })

    // DEBUGGING LOGS
    console.log("DEBUG: HistoryPage Render")
    console.log("DEBUG: Address:", address)
    console.log("DEBUG: Contract Address:", CONTRACT_ADDRESS)
    console.log("DEBUG: Entry Count Data:", entryCount)
    console.log("DEBUG: Is Loading:", isLoading)
    console.log("DEBUG: Is Error:", isError)
    if (error) console.error("DEBUG: Read Error:", error)

    useEffect(() => {
        if (address) {
            console.log("DEBUG: Triggering Refetch")
            refetch()
        }
    }, [address, refetch])

    const handleViewEntry = async (index: number) => {
        if (!address) return

        try {
            setIsDecrypting(true)

            // FIX: Use imperative readContract action instead of hook
            const cid = await readContract(config, {
                address: CONTRACT_ADDRESS as `0x${string}`,
                abi: JournyLogABI.abi,
                functionName: 'getEntry',
                args: [address, index],
                chainId: 84532, // Force Base Sepolia
            }) as string

            const payload = await ipfsService.fetchEncryptedEntry(cid)
            console.log("DEBUG: IPFS Payload:", payload)

            if (!payload.encrypted || !payload.iv || !payload.salt) {
                throw new Error("Invalid payload structure from IPFS")
            }

            console.log("DEBUG: Attempting decryption with address:", address)
            const decrypted = await encryptionService.decrypt(
                payload.encrypted,
                payload.iv,
                payload.salt,
                address
            )

            setSelectedEntry({
                cid,
                content: decrypted,
                timestamp: payload.timestamp
            })
        } catch (error) {
            console.error('Failed to decrypt entry:', error)
            alert(`DECRYPTION FAILED: ${(error as Error).message}`)
        } finally {
            setIsDecrypting(false)
        }
    }

    const totalEntries = entryCount ? Number(entryCount) : 0

    return (
        <div className="min-h-screen bg-surface flex flex-col">
            {/* Header */}
            <header className="border-b-2 border-text-primary/10 bg-surface sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/write')}
                        className="text-xs uppercase tracking-widest text-text-primary/60 hover:text-brand-600 transition-colors font-bold"
                    >
                        ← Write
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="text-[10px] font-mono text-text-primary/40">
                            CHAIN: {wagmiAdapter.wagmiConfig.state.chainId}
                        </div>
                        <ConnectButton />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-4xl mx-auto w-full p-6">
                <div className="space-y-8">
                    <h1 className="text-4xl font-bold tracking-tighter text-text-primary uppercase">
                        Your History
                    </h1>

                    <p className="text-sm text-text-primary/60 mb-12 uppercase tracking-wider">
                        {totalEntries === 0 ? 'NO ENTRIES YET' : `${totalEntries} ${totalEntries === 1 ? 'ENTRY' : 'ENTRIES'}`}
                    </p>

                    {/* DEBUG ERROR DISPLAY */}
                    {isError && (
                        <div className="p-4 mb-8 bg-red-100 border border-red-400 text-red-700 font-mono text-xs break-all">
                            ERROR READING CONTRACT: {error?.message}
                        </div>
                    )}

                    {/* Entries Grid */}
                    {totalEntries > 0 ? (
                        <div className="grid gap-3">
                            {Array.from({ length: totalEntries }).map((_, i) => {
                                const index = totalEntries - 1 - i // Reverse order
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        onClick={() => handleViewEntry(index)}
                                        className={cn(
                                            "p-6 border-2 border-text-primary/10 cursor-pointer group",
                                            "hover:border-brand-600 hover:bg-surface-dark transition-all duration-300"
                                        )}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-mono text-xs text-text-primary/40 group-hover:text-brand-600 transition-colors">
                                                #{index + 1}
                                            </span>
                                            <span className="text-xs uppercase tracking-widest font-bold text-text-primary/60">
                                                {isDecrypting ? 'DECRYPTING...' : 'CLICK TO VIEW'}
                                            </span>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-20 border-2 border-dashed border-text-primary/10">
                            <p className="text-text-primary/40 font-mono text-sm">
                                NOTHING HERE YET
                            </p>
                        </div>
                    )}
                </div>
            </main>

            {/* Entry Modal */}
            {selectedEntry && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface/90 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white w-full max-w-2xl max-h-[80vh] overflow-y-auto border-2 border-text-primary shadow-2xl p-8 relative"
                    >
                        <button
                            onClick={() => setSelectedEntry(null)}
                            className="absolute top-4 right-4 text-text-primary/40 hover:text-brand-600 transition-colors"
                        >
                            CLOSE [X]
                        </button>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between border-b border-text-primary/10 pb-4">
                                <span className="font-mono text-xs text-text-primary/40">
                                    {formatDate(selectedEntry.timestamp)}
                                </span>
                                <a
                                    href={`https://ipfs.io/ipfs/${selectedEntry.cid}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[10px] uppercase tracking-widest text-brand-600 hover:underline"
                                >
                                    View on IPFS
                                </a>
                            </div>

                            <div className="prose prose-sm max-w-none font-serif leading-relaxed whitespace-pre-wrap">
                                {selectedEntry.content}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    )
}
