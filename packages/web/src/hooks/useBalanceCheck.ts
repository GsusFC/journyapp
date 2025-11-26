import { useAccount, useBalance } from 'wagmi'
import { parseEther, formatEther } from 'viem'

interface UseBalanceCheckReturn {
    hasEnoughBalance: boolean
    balance: string
    isLoading: boolean
}

// Mínimo recomendado para una transacción en Base Sepolia (~0.0001 ETH)
const MIN_BALANCE = parseEther('0.0001')

export function useBalanceCheck(): UseBalanceCheckReturn {
    const { address } = useAccount()
    
    const { data: balanceData, isLoading } = useBalance({
        address,
    })

    const hasEnoughBalance = balanceData ? balanceData.value >= MIN_BALANCE : false
    const balance = balanceData 
        ? `${Number(formatEther(balanceData.value)).toFixed(4)} ${balanceData.symbol}`
        : '0 ETH'

    return {
        hasEnoughBalance,
        balance,
        isLoading
    }
}
