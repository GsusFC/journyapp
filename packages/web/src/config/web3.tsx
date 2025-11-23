import { createAppKit } from '@reown/appkit/react'
import { baseSepolia } from 'wagmi/chains'
import { QueryClient } from '@tanstack/react-query'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

// Project ID from Reown Cloud
const projectId = '349ee7a88d119a669be53f17c9449b78'

// Configure metadata
const metadata = {
    name: 'Journy',
    description: 'Encrypted Journal - Your thoughts, forever on-chain',
    url: 'https://journy.app',
    icons: ['https://avatars.githubusercontent.com/u/179229932']
}

// Create Wagmi Adapter
export const wagmiAdapter = new WagmiAdapter({
    networks: [baseSepolia],
    projectId
})

// Create modal
createAppKit({
    adapters: [wagmiAdapter],
    networks: [baseSepolia],
    projectId,
    metadata,
    features: {
        analytics: false
    },
    themeMode: 'light',
    themeVariables: {
        '--w3m-accent': '#6716e9',
        '--w3m-color-mix': '#f7f9fc',
        '--w3m-font-family': 'JetBrains Mono, monospace',
        '--w3m-border-radius-master': '0px'
    }
})

export const queryClient = new QueryClient()
export const config = wagmiAdapter.wagmiConfig
