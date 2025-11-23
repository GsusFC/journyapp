/**
 * ⛔ SECURITY CRITICAL: Client-Side Encryption Service
 * 
 * This module handles ALL encryption/decryption operations for Journy.
 * Uses Web Crypto API (AES-GCM) for browser compatibility.
 * 
 * WARNING: Never send unencrypted content to IPFS or any external service.
 */

class EncryptionService {
    private async deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
        const encoder = new TextEncoder()
        const passwordBuffer = encoder.encode(password)

        const importedKey = await window.crypto.subtle.importKey(
            'raw',
            passwordBuffer,
            { name: 'PBKDF2' },
            false,
            ['deriveBits', 'deriveKey']
        )

        return window.crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: salt.buffer as ArrayBuffer,
                iterations: 100000,
                hash: 'SHA-256'
            },
            importedKey,
            { name: 'AES-GCM', length: 256 },
            false,
            ['encrypt', 'decrypt']
        )
    }

    async encrypt(text: string, userAddress: string): Promise<{
        encrypted: string;
        iv: string;
        salt: string
    }> {
        try {
            const encoder = new TextEncoder()
            const data = encoder.encode(text)

            // Generate random salt and IV
            const salt = window.crypto.getRandomValues(new Uint8Array(16))
            const iv = window.crypto.getRandomValues(new Uint8Array(12))

            // Derive key from user's address (you could also use wallet signature)
            const key = await this.deriveKey(userAddress, salt)

            // Encrypt
            const encryptedBuffer = await window.crypto.subtle.encrypt(
                {
                    name: 'AES-GCM',
                    iv: iv
                },
                key,
                data
            )

            // Convert to base64 for storage
            const encryptedArray = new Uint8Array(encryptedBuffer)
            const encrypted = btoa(String.fromCharCode(...encryptedArray))
            const ivStr = btoa(String.fromCharCode(...iv))
            const saltStr = btoa(String.fromCharCode(...salt))

            return { encrypted, iv: ivStr, salt: saltStr }
        } catch (error) {
            console.error('Encryption failed:', error)
            throw new Error('Failed to encrypt content')
        }
    }

    async decrypt(
        encrypted: string,
        iv: string,
        salt: string,
        userAddress: string
    ): Promise<string> {
        try {
            // Decode from base64
            const encryptedArray = Uint8Array.from(atob(encrypted), c => c.charCodeAt(0))
            const ivArray = Uint8Array.from(atob(iv), c => c.charCodeAt(0))
            const saltArray = Uint8Array.from(atob(salt), c => c.charCodeAt(0))

            // Derive same key
            const key = await this.deriveKey(userAddress, saltArray)

            // Decrypt
            const decryptedBuffer = await window.crypto.subtle.decrypt(
                {
                    name: 'AES-GCM',
                    iv: ivArray
                },
                key,
                encryptedArray
            )

            const decoder = new TextDecoder()
            return decoder.decode(decryptedBuffer)
        } catch (error) {
            console.error('Decryption failed:', error)
            throw new Error('Failed to decrypt content')
        }
    }
}

export const encryptionService = new EncryptionService()
