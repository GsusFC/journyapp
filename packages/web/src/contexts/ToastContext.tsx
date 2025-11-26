import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../lib/utils'

type ToastType = 'info' | 'success' | 'error' | 'warning'

interface Toast {
    id: string
    message: string
    type: ToastType
}

interface ToastContextValue {
    toast: (message: string, type?: ToastType) => void
    success: (message: string) => void
    error: (message: string) => void
    warning: (message: string) => void
    info: (message: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast(): ToastContextValue {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider')
    }
    return context
}

interface ToastProviderProps {
    children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
    const [toasts, setToasts] = useState<Toast[]>([])

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }, [])

    const addToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
        setToasts(prev => [...prev, { id, message, type }])

        // Auto-remove after 4 seconds
        setTimeout(() => removeToast(id), 4000)
    }, [removeToast])

    const value: ToastContextValue = {
        toast: addToast,
        success: (message) => addToast(message, 'success'),
        error: (message) => addToast(message, 'error'),
        warning: (message) => addToast(message, 'warning'),
        info: (message) => addToast(message, 'info'),
    }

    return (
        <ToastContext.Provider value={value}>
            {children}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </ToastContext.Provider>
    )
}

interface ToastContainerProps {
    toasts: Toast[]
    onRemove: (id: string) => void
}

function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
    return (
        <div className="fixed bottom-24 left-0 right-0 mx-auto w-full max-w-md px-4 z-50 pointer-events-none">
            <AnimatePresence mode="popLayout">
                {toasts.map(toast => (
                    <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="pointer-events-auto mb-2"
                    >
                        <div
                            onClick={() => onRemove(toast.id)}
                            className={cn(
                                "px-4 py-3 font-mono text-xs uppercase tracking-widest cursor-pointer",
                                "border shadow-lg backdrop-blur-sm",
                                toast.type === 'success' && "bg-white dark:bg-zinc-900 border-text-primary text-text-primary",
                                toast.type === 'error' && "bg-red-50 dark:bg-red-950 border-red-500 text-red-600 dark:text-red-400",
                                toast.type === 'warning' && "bg-yellow-50 dark:bg-yellow-950 border-yellow-500 text-yellow-700 dark:text-yellow-400",
                                toast.type === 'info' && "bg-white dark:bg-zinc-900 border-stroke text-text-primary/80"
                            )}
                        >
                            {toast.message}
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    )
}
