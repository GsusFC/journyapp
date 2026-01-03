import { useReadContract, useAccount } from 'wagmi'
import { CONTRACT_ADDRESS, CHAIN_ID } from '../lib/constants'
import JournyLogABI from '../abis/JournyLog.json'

export function useAllowlist() {
    const { address } = useAccount()

    const { data: isAllowed, isLoading, error } = useReadContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: JournyLogABI.abi,
        functionName: 'allowedUsers',
        args: [address],
        chainId: CHAIN_ID,
        query: {
            enabled: !!address
        }
    })

    return {
        isAllowed: !!isAllowed,
        isLoading,
        error
    }
}
