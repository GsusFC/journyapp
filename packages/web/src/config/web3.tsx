import { createAppKit } from '@reown/appkit/react'
import { baseSepolia, base } from 'wagmi/chains'
import { QueryClient } from '@tanstack/react-query'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { http } from 'wagmi'

// 1. Defensive Logging & Env Var Retrieval
// 1. Defensive Logging & Env Var Retrieval
const projectId = import.meta.env.VITE_WALLET_PROJECT_ID

if (!projectId) {
    console.error("CRITICAL: VITE_WALLET_PROJECT_ID is not defined in .env")
} else {
    console.log("Iniciando AppKit. ProjectID definido.")
}

// Configure metadata
const metadata = {
    name: 'Journy',
    description: 'Encrypted Journal - Your thoughts, forever on-chain',
    url: typeof window !== 'undefined' ? window.location.origin : 'https://journy.app',
    icons: ['https://avatars.githubusercontent.com/u/179229932']
}

// Create Wagmi Adapter (ONLY Base Sepolia - Contract Chain)
export const wagmiAdapter = new WagmiAdapter({
    networks: [baseSepolia, base],
    projectId,
    ssr: false,
    transports: {
        [baseSepolia.id]: http('https://sepolia.base.org'), // Explicit Base Sepolia RPC
        [base.id]: http(),
    }
})

// Export the modal instance so we can control it (e.g. trigger theme changes)
export let appKitModal: any = null;

// 2. Try-Catch Block for Safety
try {
    appKitModal = createAppKit({
        adapters: [wagmiAdapter],
        networks: [baseSepolia, base],
        defaultNetwork: baseSepolia,
        projectId,
        metadata,
        features: {
            analytics: false,
            email: false, // Disable email to prioritize Wallets + Socials
        },
        enableWallets: true,
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
