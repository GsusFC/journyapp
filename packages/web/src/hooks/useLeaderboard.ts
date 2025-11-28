import { useState, useEffect } from 'react'

const INDEXER_URL = import.meta.env.VITE_INDEXER_URL || 'http://localhost:42069'

interface LeaderboardUser {
    address: string
    totalPoints: number
    currentStreak: number
    maxStreak: number
    totalEntries: number
}

interface UseLeaderboardReturn {
    leaderboard: LeaderboardUser[]
    isLoading: boolean
    error: string | null
    refetch: () => void
}

const LEADERBOARD_QUERY = `
    query GetLeaderboard {
        users(orderBy: "totalPoints", orderDirection: "desc", limit: 50) {
            items {
                address
                totalPoints
                currentStreak
                maxStreak
                totalEntries
            }
        }
    }
`

export function useLeaderboard(): UseLeaderboardReturn {
    const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchLeaderboard = async () => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch(`${INDEXER_URL}/graphql`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: LEADERBOARD_QUERY }),
            })

            if (!response.ok) {
                throw new Error('Failed to fetch leaderboard')
            }

            const data = await response.json()

            if (data.errors) {
                throw new Error(data.errors[0]?.message || 'GraphQL error')
            }

            setLeaderboard(data.data.users.items)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error')
            setLeaderboard([])
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchLeaderboard()
    }, [])

    return {
        leaderboard,
        isLoading,
        error,
        refetch: fetchLeaderboard,
    }
}
