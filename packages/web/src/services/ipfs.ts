/**
 * IPFS Service for uploading encrypted content
 * Uses Pinata for pinning
 */

import { PINATA_JWT } from '../lib/constants'

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
        try {
            const response = await fetch(`https://gateway.pinata.cloud/ipfs/${cid}`)

            if (!response.ok) {
                throw new Error('Failed to fetch from IPFS')
            }

            return await response.json()
        } catch (error) {
            console.error('IPFS fetch error:', error)
            throw new Error('Failed to fetch from IPFS')
        }
    }
}

export const ipfsService = new IPFSService()
