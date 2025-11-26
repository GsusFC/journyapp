import { useState, useEffect, useCallback, useRef } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { readContract } from '@wagmi/core'
import { CONTRACT_ADDRESS, CHAIN_ID } from '../lib/constants'
import { ipfsService } from '../services/ipfs'
import { encryptionService } from '../services/encryption'
import { config } from '../config/web3'
import JournyLogABI from '../abis/JournyLog.json'
import type { EntryPreview, DecryptedEntry } from '../types/journal'

const PAGE_SIZE = 5

interface UseEntriesReturn {
    totalEntries: number
    previews: Map<number, EntryPreview>
    isLoading: boolean
    isLoadingMore: boolean
    hasMore: boolean
    error: string | null
    refetch: () => void
    loadMore: () => void
    decryptEntry: (index: number) => Promise<DecryptedEntry>
}

export function useEntries(): UseEntriesReturn {
    const { address } = useAccount()
    const [previews, setPreviews] = useState<Map<number, EntryPreview>>(new Map())
    const [isLoadingPreviews, setIsLoadingPreviews] = useState(false)
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const [loadedCount, setLoadedCount] = useState(0)
    const isInitialLoad = useRef(true)

    const { data: entryCount, refetch, isError, error: contractError } = useReadContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: JournyLogABI.abi,
        functionName: 'getEntryCount',
        args: [address],
        chainId: CHAIN_ID,
    })

    const totalEntries = Number(entryCount || 0)
    const hasMore = loadedCount < totalEntries

    // Cargar un batch de previews (desde el más reciente)
    const loadBatch = useCallback(async (startFrom: number, count: number) => {
        if (!address || totalEntries === 0) return

        const newPreviews = new Map(previews)
        
        // Cargar desde el más reciente hacia atrás
        for (let i = 0; i < count && (startFrom - i) >= 0; i++) {
            const index = startFrom - i
            if (newPreviews.has(index)) continue

            try {
                const cid = await readContract(config, {
                    address: CONTRACT_ADDRESS as `0x${string}`,
                    abi: JournyLogABI.abi,
                    functionName: 'getEntry',
                    args: [address, index],
                    chainId: CHAIN_ID,
                }) as string

                const payload = await ipfsService.fetchEncryptedEntry(cid)

                newPreviews.set(index, {
                    index,
                    cid,
                    preview: payload.preview || 'No preview available',
                    timestamp: payload.timestamp
                })
            } catch (err) {
                console.error(`Failed to load preview for entry ${index}:`, err)
            }
        }

        setPreviews(newPreviews)
        setLoadedCount(prev => Math.min(prev + count, totalEntries))
    }, [address, totalEntries, previews])

    // Carga inicial
    useEffect(() => {
        if (!entryCount || !address) return
        if (!isInitialLoad.current) return
        
        isInitialLoad.current = false
        setIsLoadingPreviews(true)
        
        const total = Number(entryCount)
        loadBatch(total - 1, PAGE_SIZE).finally(() => {
            setIsLoadingPreviews(false)
        })
    }, [entryCount, address, loadBatch])

    // Reset cuando cambia address
    useEffect(() => {
        setPreviews(new Map())
        setLoadedCount(0)
        isInitialLoad.current = true
    }, [address])

    // Refetch cuando cambia el address
    useEffect(() => {
        if (address) refetch()
    }, [address, refetch])

    const decryptEntry = useCallback(async (index: number): Promise<DecryptedEntry> => {
        if (!address) {
            throw new Error('No wallet connected')
        }

        const cid = await readContract(config, {
            address: CONTRACT_ADDRESS as `0x${string}`,
            abi: JournyLogABI.abi,
            functionName: 'getEntry',
            args: [address, index],
            chainId: CHAIN_ID,
        }) as string

        const payload = await ipfsService.fetchEncryptedEntry(cid)

        if (!payload.encrypted || !payload.iv || !payload.salt) {
            throw new Error('Invalid payload structure')
        }

        const content = await encryptionService.decrypt(
            payload.encrypted,
            payload.iv,
            payload.salt,
            address
        )

        return {
            index,
            cid,
            content,
            timestamp: payload.timestamp
        }
    }, [address])

    // Cargar más entradas
    const loadMore = useCallback(() => {
        if (isLoadingMore || !hasMore) return
        
        setIsLoadingMore(true)
        const nextIndex = totalEntries - loadedCount - 1
        loadBatch(nextIndex, PAGE_SIZE).finally(() => {
            setIsLoadingMore(false)
        })
    }, [isLoadingMore, hasMore, totalEntries, loadedCount, loadBatch])

    return {
        totalEntries,
        previews,
        isLoading: isLoadingPreviews,
        isLoadingMore,
        hasMore,
        error: isError ? contractError?.message || 'Failed to load entries' : null,
        refetch,
        loadMore,
        decryptEntry
    }
}
