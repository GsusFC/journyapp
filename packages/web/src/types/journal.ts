/**
 * Tipos compartidos para el sistema de journal
 */

export interface EncryptedPayload {
    encrypted: string
    iv: string
    salt: string
    timestamp: number
    preview?: string
}

export interface EntryPreview {
    index: number
    cid: string
    preview: string
    timestamp: number
}

export interface DecryptedEntry {
    index: number
    cid: string
    content: string
    timestamp: number
}

export type WriteStatus = 
    | 'idle'
    | 'encrypting'
    | 'uploading'
    | 'confirming'
    | 'success'
    | 'error'

export interface WriteError {
    stage: 'encryption' | 'ipfs' | 'contract' | 'network'
    message: string
}
