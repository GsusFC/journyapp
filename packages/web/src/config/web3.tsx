import { createAppKit } from '@reown/appkit/react'
import { baseSepolia } from 'wagmi/chains'
import { QueryClient } from '@tanstack/react-query'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { http } from 'wagmi'

// 1. Defensive Logging & Env Var Retrieval
const projectId = import.meta.env.VITE_WALLET_PROJECT_ID || '349ee7a88d119a669be53f17c9449b78' // Fallback for dev if needed, but prefer env
console.log("Iniciando AppKit. ProjectID definido: ", !!projectId, projectId?.slice(0, 4) + '...')

// Configure metadata
const metadata = {
    name: 'Journy',
    description: 'Encrypted Journal - Your thoughts, forever on-chain',
    url: typeof window !== 'undefined' ? window.location.origin : 'https://journy.app',
    icons: ['https://avatars.githubusercontent.com/u/179229932']
}

// Create Wagmi Adapter (ONLY Base Sepolia - Contract Chain)
export const wagmiAdapter = new WagmiAdapter({
    networks: [baseSepolia],
    projectId,
    ssr: false,
    transports: {
        [baseSepolia.id]: http('https://sepolia.base.org'), // Explicit Base Sepolia RPC
    }
})

// 2. Try-Catch Block for Safety
try {
    createAppKit({
        adapters: [wagmiAdapter],
        networks: [baseSepolia],
        defaultNetwork: baseSepolia,
        projectId,
        metadata,
        features: {
            analytics: false
        },
        themeMode: 'light',
        themeVariables: {
            '--w3m-accent': '#000000',
            '--w3m-color-mix': '#ffffff',
            '--w3m-font-family': 'JetBrains Mono, monospace',
            '--w3m-border-radius-master': '0px'
        }
    })
} catch (error) {
    console.error("CRITICAL: Failed to initialize AppKit", error)
}

export const queryClient = new QueryClient()
export const config = wagmiAdapter.wagmiConfig
