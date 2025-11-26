import { useState, useCallback } from 'react'
import { useAccount } from 'wagmi'
import { readContract } from '@wagmi/core'
import { CONTRACT_ADDRESS, CHAIN_ID } from '../lib/constants'
import { ipfsService } from '../services/ipfs'
import { encryptionService } from '../services/encryption'
import { config } from '../config/web3'
import JournyLogABI from '../abis/JournyLog.json'

interface ExportedEntry {
    index: number
    date: string
    content: string
}

type ExportType = 'json' | 'markdown' | null

interface UseExportJournalReturn {
    exportingType: ExportType
    progress: number
    exportAsJSON: () => Promise<void>
    exportAsMarkdown: () => Promise<void>
}

export function useExportJournal(): UseExportJournalReturn {
    const { address } = useAccount()
    const [exportingType, setExportingType] = useState<ExportType>(null)
    const [progress, setProgress] = useState(0)

    const fetchAllEntries = useCallback(async (): Promise<ExportedEntry[]> => {
        if (!address) throw new Error('No wallet connected')

        const entryCount = await readContract(config, {
            address: CONTRACT_ADDRESS as `0x${string}`,
            abi: JournyLogABI.abi,
            functionName: 'getEntryCount',
            args: [address],
            chainId: CHAIN_ID,
        }) as bigint

        const total = Number(entryCount)
        const entries: ExportedEntry[] = []

        for (let i = 0; i < total; i++) {
            setProgress(Math.round((i / total) * 100))

            try {
                const cid = await readContract(config, {
                    address: CONTRACT_ADDRESS as `0x${string}`,
                    abi: JournyLogABI.abi,
                    functionName: 'getEntry',
                    args: [address, i],
                    chainId: CHAIN_ID,
                }) as string

                const payload = await ipfsService.fetchEncryptedEntry(cid)

                const content = await encryptionService.decrypt(
                    payload.encrypted,
                    payload.iv,
                    payload.salt,
                    address
                )

                entries.push({
                    index: i,
                    date: new Date(payload.timestamp * 1000).toISOString(),
                    content
                })
            } catch (err) {
                console.error(`Failed to export entry ${i}:`, err)
            }
        }

        return entries
    }, [address])

    const downloadFile = (content: string, filename: string, type: string) => {
        const blob = new Blob([content], { type })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    const exportAsJSON = useCallback(async () => {
        if (!address || exportingType) return

        setExportingType('json')
        setProgress(0)

        try {
            const entries = await fetchAllEntries()
            const data = {
                exportedAt: new Date().toISOString(),
                wallet: address,
                totalEntries: entries.length,
                entries
            }
            downloadFile(
                JSON.stringify(data, null, 2),
                `journy-export-${Date.now()}.json`,
                'application/json'
            )
        } finally {
            setExportingType(null)
            setProgress(100)
        }
    }, [address, fetchAllEntries, exportingType])

    const exportAsMarkdown = useCallback(async () => {
        if (!address || exportingType) return

        setExportingType('markdown')
        setProgress(0)

        try {
            const entries = await fetchAllEntries()
            
            let markdown = `# Journy Export\n\n`
            markdown += `**Wallet:** ${address}\n`
            markdown += `**Exported:** ${new Date().toLocaleString()}\n`
            markdown += `**Total Entries:** ${entries.length}\n\n---\n\n`

            for (const entry of entries) {
                const date = new Date(entry.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })
                markdown += `## Entry #${entry.index + 1}\n`
                markdown += `*${date}*\n\n`
                markdown += `${entry.content}\n\n---\n\n`
            }

            downloadFile(
                markdown,
                `journy-export-${Date.now()}.md`,
                'text/markdown'
            )
        } finally {
            setExportingType(null)
            setProgress(100)
        }
    }, [address, fetchAllEntries, exportingType])

    return {
        exportingType,
        progress,
        exportAsJSON,
        exportAsMarkdown
    }
}
