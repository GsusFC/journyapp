import { useState, useCallback } from 'react'
import { useSignMessage, useAccount } from 'wagmi'

interface UseEncryptionKeyReturn {
    getEncryptionSignature: () => Promise<string | null>
    isLoading: boolean
    error: Error | null
}

// In-memory cache for the session to avoid signing on every action
// Map<userAddress, signature>
const signatureCache = new Map<string, string>()

export function useEncryptionKey(): UseEncryptionKeyReturn {
    const { address } = useAccount()
    const { signMessageAsync } = useSignMessage()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    const getEncryptionSignature = useCallback(async () => {
        if (!address) return null

        // 1. Check cache first
        if (signatureCache.has(address)) {
            return signatureCache.get(address)!
        }

        setIsLoading(true)
        setError(null)

        try {
            // 2. Request signature if not cached
            // The message should be static and constant so the same key is always derived
            const message = `Journy Secure Encryption Key\n\nSign this message to derive your encryption key.\nThis does not trigger a blockchain transaction.\n\nWallet: ${address}`

            const signature = await signMessageAsync({ message })

            // 3. Cache it
            signatureCache.set(address, signature)

            return signature
        } catch (err) {
            console.error('Failed to get encryption signature:', err)
            setError(err instanceof Error ? err : new Error('Failed to sign message'))
            return null
        } finally {
            setIsLoading(false)
        }
    }, [address, signMessageAsync])

    return {
        getEncryptionSignature,
        isLoading,
        error
    }
}
