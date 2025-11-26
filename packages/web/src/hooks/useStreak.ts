import { useAccount, useReadContract } from 'wagmi'
import { CONTRACT_ADDRESS, CHAIN_ID } from '../lib/constants'
import JournyLogABI from '../abis/JournyLog.json'

interface UseStreakReturn {
    streak: number
    isEligibleForClanker: boolean
    isLoading: boolean
    error: string | null
}

export function useStreak(): UseStreakReturn {
    const { address } = useAccount()

    const { data: streakData, isLoading: isLoadingStreak, isError: isStreakError } = useReadContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: JournyLogABI.abi,
        functionName: 'currentStreak',
        args: [address],
        chainId: CHAIN_ID,
        query: {
            enabled: !!address,
        }
    })

    const { data: eligibleData, isLoading: isLoadingEligible } = useReadContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: JournyLogABI.abi,
        functionName: 'isEligibleForClanker',
        args: [address],
        chainId: CHAIN_ID,
        query: {
            enabled: !!address,
        }
    })

    const streak = Number(streakData || 0)
    const isEligibleForClanker = Boolean(eligibleData)
    const isLoading = isLoadingStreak || isLoadingEligible
    const error = isStreakError ? 'Failed to load streak' : null

    return {
        streak,
        isEligibleForClanker,
        isLoading,
        error
    }
}
