/**
 * IPFS Service for uploading encrypted content
 * Uses Pinata for pinning
 */

import { PINATA_JWT, IPFS_GATEWAY } from '../lib/constants'

const GATEWAYS = [
    IPFS_GATEWAY,
    'https://ipfs.io/ipfs/',
    'https://cloudflare-ipfs.com/ipfs/',
    'https://dweb.link/ipfs/'
]

interface EncryptedPayload {
    encrypted: string
    iv: string
    salt: string
    timestamp: number
}

class IPFSService {
    private pinataEndpoint = 'https://api.pinata.cloud/pinning/pinJSONToIPFS'

    async uploadEncryptedEntry(payload: EncryptedPayload): Promise<string> {
        if (!PINATA_JWT) {
            throw new Error('PINATA_JWT not configured')
        }

        try {
            const response = await fetch(this.pinataEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${PINATA_JWT}`
                },
                body: JSON.stringify({
                    pinataContent: payload,
                    pinataMetadata: {
                        name: `journy-entry-${payload.timestamp}`
                    }
                })
            })

            if (!response.ok) {
                throw new Error(`IPFS upload failed: ${response.statusText}`)
            }

            const result = await response.json()
            return result.IpfsHash // Returns CID
        } catch (error) {
            console.error('IPFS upload error:', error)
            throw new Error('Failed to upload to IPFS')
        }
    }

    async fetchEncryptedEntry(cid: string): Promise<EncryptedPayload> {
        let lastError: Error | null = null;

        for (const gateway of GATEWAYS) {
            try {
                // Ensure gateway ends with /
                const baseUrl = gateway.endsWith('/') ? gateway : `${gateway}/`
                const response = await fetch(`${baseUrl}${cid}`)

                if (!response.ok) {
                    throw new Error(`Failed to fetch from ${gateway}: ${response.statusText}`)
                }

                return await response.json()
            } catch (error) {
                console.warn(`Gateway ${gateway} failed for ${cid}:`, error)
                lastError = error instanceof Error ? error : new Error('Unknown error')
                continue
            }
        }

        throw new Error(`All gateways failed. Last error: ${lastError?.message}`)
    }
}

export const ipfsService = new IPFSService()
