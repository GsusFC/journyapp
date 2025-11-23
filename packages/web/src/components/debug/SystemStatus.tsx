import { useAccount, useReadContract, useChainId } from 'wagmi'
import { CONTRACT_ADDRESS } from '../../lib/constants'
import JournyLogABI from '../../abis/JournyLog.json'

export function SystemStatus() {
    const { address, isConnected } = useAccount()
    const chainId = useChainId()

    // Intenta leer el conteo de entradas
    const { data: entryCount, isLoading, isError, error, refetch } = useReadContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: JournyLogABI.abi,
        functionName: 'getEntryCount',
        args: address ? [address] : undefined,
        chainId: 84532, // Forzamos Base Sepolia
        query: {
            enabled: !!address, // Solo ejecuta si hay address
        }
    })

    if (!isConnected) return null

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-black/90 text-green-400 p-4 font-mono text-[10px] border-t-2 border-red-500 z-[9999] max-h-[300px] overflow-y-auto">
            <h3 className="text-red-500 font-bold mb-2">🛑 SYSTEM DEBUG MONITOR</h3>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p><span className="text-white">WALLET:</span> {address}</p>
                    <p><span className="text-white">CURRENT CHAIN:</span> {chainId} {chainId === 84532 ? '✅' : '❌ (Must be 84532)'}</p>
                    <p><span className="text-white">CONTRACT ADDR:</span> {CONTRACT_ADDRESS}</p>
                </div>

                <div>
                    <p><span className="text-white">READ STATUS:</span> {isLoading ? '⏳ Loading...' : 'Done'}</p>
                    <p><span className="text-white">IS ERROR:</span> {isError ? '🚨 YES' : '✅ NO'}</p>
                    <p><span className="text-white">ENTRY COUNT:</span> {entryCount?.toString() ?? 'undefined'}</p>
                </div>
            </div>

            {isError && (
                <div className="mt-2 p-2 bg-red-900/50 text-red-200 border border-red-500">
                    <p className="font-bold">ERROR DETAILS:</p>
                    <pre className="whitespace-pre-wrap">{error?.message}</pre>
                </div>
            )}

            <button
                onClick={() => refetch()}
                className="mt-2 px-2 py-1 bg-white text-black font-bold hover:bg-gray-200"
            >
                FORCE REFRESH DATA
            </button>
        </div>
    )
}
