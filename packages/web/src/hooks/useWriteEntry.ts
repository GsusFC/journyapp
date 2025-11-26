import { useState, useCallback, useMemo } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useChainId } from 'wagmi'
import { useAppKit } from '@reown/appkit/react'
import { encryptionService } from '../services/encryption'
import { ipfsService } from '../services/ipfs'
import { CONTRACT_ADDRESS, CHAIN_ID } from '../lib/constants'
import JournyLogABI from '../abis/JournyLog.json'
import type { WriteStatus, WriteError } from '../types/journal'

type InternalStatus = 'idle' | 'encrypting' | 'uploading' | 'waiting_wallet' | 'error'

interface UseWriteEntryReturn {
    status: WriteStatus
    error: WriteError | null
    isWrongNetwork: boolean
    save: (content: string) => Promise<void>
    reset: () => void
}

export function useWriteEntry(): UseWriteEntryReturn {
    const { address } = useAccount()
    const chainId = useChainId()
    const { open } = useAppKit()
    
    const [internalStatus, setInternalStatus] = useState<InternalStatus>('idle')
    const [error, setError] = useState<WriteError | null>(null)

    const { writeContract, data: hash, reset: resetWrite } = useWriteContract()

    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash,
    })

    const isWrongNetwork = chainId !== CHAIN_ID

    // Derivar status final combinando estado interno + estado de transacción
    const status: WriteStatus = useMemo(() => {
        if (error) return 'error'
        if (isConfirmed) return 'success'
        if (isConfirming || internalStatus === 'waiting_wallet') return 'confirming'
        if (internalStatus === 'encrypting') return 'encrypting'
        if (internalStatus === 'uploading') return 'uploading'
        return 'idle'
    }, [internalStatus, isConfirming, isConfirmed, error])

    const save = useCallback(async (content: string) => {
        if (!content.trim() || !address) return

        // Verificar red
        if (isWrongNetwork) {
            setError({ stage: 'network', message: 'Wrong network. Please switch to Base Sepolia.' })
            await open({ view: 'Networks' })
            return
        }

        let currentStage: WriteError['stage'] = 'encryption'

        try {
            setInternalStatus('encrypting')
            setError(null)

            // Extraer preview (primeras 2 líneas, max 150 chars)
            const lines = content.split('\n')
            const preview = lines.slice(0, 2).join('\n').slice(0, 150)

            // 1. Encriptar
            const { encrypted, iv, salt } = await encryptionService.encrypt(content, address)

            // 2. Subir a IPFS
            currentStage = 'ipfs'
            setInternalStatus('uploading')
            const cid = await ipfsService.uploadEncryptedEntry({
                encrypted,
                iv,
                salt,
                timestamp: Math.floor(Date.now() / 1000),
                preview
            })

            // 3. Escribir en contrato
            currentStage = 'contract'
            setInternalStatus('waiting_wallet')
            writeContract({
                address: CONTRACT_ADDRESS as `0x${string}`,
                abi: JournyLogABI.abi,
                functionName: 'logEntry',
                args: [cid],
                chainId: CHAIN_ID,
            })

        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown error'
            setError({ stage: currentStage, message })
            setInternalStatus('error')
        }
    }, [address, isWrongNetwork, open, writeContract])

    const reset = useCallback(() => {
        setInternalStatus('idle')
        setError(null)
        resetWrite()
    }, [resetWrite])

    return {
        status,
        error,
        isWrongNetwork,
        save,
        reset
    }
}
