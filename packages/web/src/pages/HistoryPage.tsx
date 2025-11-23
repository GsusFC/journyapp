import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAccount, useReadContract } from 'wagmi'
import { useNavigate } from 'react-router-dom'
import { ConnectButton } from '../components/ConnectButton'
import { CONTRACT_ADDRESS } from '../lib/constants'
import { formatDate, cn } from '../lib/utils'
import { ipfsService } from '../services/ipfs'
import { encryptionService } from '../services/encryption'
import { wagmiAdapter } from '../config/web3'
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

    const { data: entryCount, refetch } = useReadContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: JournyLogABI.abi,
        functionName: 'getEntryCount',
        args: [address],
        chainId: 84532, // Force Base Sepolia
    })

    useEffect(() => {
        if (address) {
            refetch()
        }
    }, [address, refetch])

    const handleViewEntry = async (index: number) => {
        if (!address) return

        try {
            setIsDecrypting(true)

            const { data: cid } = await useReadContract({
                address: CONTRACT_ADDRESS as `0x${string}`,
                abi: JournyLogABI.abi,
                functionName: 'getEntry',
                args: [address, index],
                chainId: 84532, // Force Base Sepolia
            }) as { data: string }

            const payload = await ipfsService.fetchEncryptedEntry(cid)

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
            alert('DECRYPTION FAILED')
        } finally {
            setIsDecrypting(false)
        }
    }

    const totalEntries = Number(entryCount || 0)

    return (
        <div className="min-h-screen bg-surface">
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
            <main className="max-w-4xl mx-auto px-6 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-4xl font-black text-text-primary mb-2">
                        YOUR JOURNEY
                    </h1>
                    <p className="text-sm text-text-primary/60 mb-12 uppercase tracking-wider">
                        {totalEntries === 0 ? 'NO ENTRIES YET' : `${totalEntries} ${totalEntries === 1 ? 'ENTRY' : 'ENTRIES'}`}
                    </p>

                    {/* Entries Grid */}
                    {totalEntries > 0 ? (
                        <div className="grid gap-3">
                            {Array.from({ length: totalEntries }, (_, i) => totalEntries - 1 - i).map((index) => (
                                <EntryCard
                                    key={index}
                                    index={index}
                                    onView={() => handleViewEntry(index)}
                                    isDecrypting={isDecrypting}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-24 border-2 border-dashed border-text-primary/10">
                            <p className="text-xs uppercase tracking-widest text-text-primary/40">
                                START WRITING TO SEE ENTRIES
                            </p>
                        </div>
                    )}
                </motion.div>

                {/* Entry Modal */}
                {selectedEntry && (
                    <EntryModal
                        entry={selectedEntry}
                        onClose={() => setSelectedEntry(null)}
                    />
                )}
            </main>
        </div>
    )
}

function EntryCard({
    index,
    onView,
    isDecrypting
}: {
    index: number
    onView: () => void
    isDecrypting: boolean
}) {
    return (
        <motion.button
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.99 }}
            onClick={onView}
            disabled={isDecrypting}
            className={cn(
                "w-full p-6 text-left",
                "bg-white border-2 border-text-primary/10",
                "hover:border-brand-600",
                "transition-all duration-200",
                "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-brand-600 mb-1">
                        ENTRY #{String(index + 1).padStart(3, '0')}
                    </p>
                    <p className="text-xs uppercase tracking-wider text-text-primary/60">
                        CLICK TO DECRYPT
                    </p>
                </div>
                <div className="text-2xl text-brand-600">→</div>
            </div>
        </motion.button>
    )
}

function EntryModal({
    entry,
    onClose
}: {
    entry: DecryptedEntry
    onClose: () => void
}) {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', handleEscape)
        return () => window.removeEventListener('keydown', handleEscape)
    }, [onClose])

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-text-primary/80 z-50 flex items-center justify-center p-6"
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-surface border-4 border-brand-600 p-8 max-w-3xl w-full max-h-[80vh] overflow-y-auto"
            >
                <div className="mb-8 pb-6 border-b-2 border-text-primary/10">
                    <p className="text-xs uppercase tracking-widest text-text-primary/60 mb-2">
                        {formatDate(Math.floor(entry.timestamp / 1000))}
                    </p>
                    <div className="text-xs font-mono text-brand-600 break-all">
                        {entry.cid.slice(0, 40)}...
                    </div>
                </div>

                <div className="mb-8">
                    <p className="text-text-primary leading-loose whitespace-pre-wrap">
                        {entry.content}
                    </p>
                </div>

                <button
                    onClick={onClose}
                    className="w-full py-4 bg-surface-dark border-2 border-brand-600 text-brand-600 hover:bg-brand-600 hover:text-white transition-all uppercase tracking-widest text-xs font-bold"
                >
                    Close
                </button>
            </motion.div>
        </motion.div>
    )
}
