import { PageLayout } from '../components/layout/PageLayout'
import { motion } from 'framer-motion'
import { cn } from '../lib/utils'
import { useAccount } from 'wagmi'
import { useState } from 'react'
import { useLeaderboard } from '../hooks/useLeaderboard'

type LeaderboardPeriod = 'weekly' | 'monthly' | 'allTime'

function formatAddress(address: string): string {
    if (address.length <= 13) return address
    return `${address.slice(0, 6)}...${address.slice(-4)}`
}

function getRankEmoji(rank: number): string {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return `#${rank}`
}

export function LeaderboardPage() {
    const { address: userAddress } = useAccount()
    const [period, setPeriod] = useState<LeaderboardPeriod>('allTime')
    const { leaderboard, isLoading } = useLeaderboard()

    // Encontrar stats del usuario actual
    const currentUserStats = userAddress 
        ? leaderboard.find(u => u.address.toLowerCase() === userAddress.toLowerCase())
        : null
    const currentUserRank = currentUserStats
        ? leaderboard.findIndex(u => u.address.toLowerCase() === userAddress?.toLowerCase()) + 1
        : null

    return (
        <PageLayout title="Leaderboard" subtitle={period.toUpperCase()}>
            <div className="grid grid-cols-1 gap-4">
                {/* Period Selector */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-zinc-900 border border-stroke p-4"
                >
                    <div className="flex gap-2">
                        {(['weekly', 'monthly', 'allTime'] as const).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={cn(
                                    "flex-1 py-2 border font-mono text-[10px] uppercase tracking-widest transition-colors",
                                    period === p
                                        ? "border-brand-600 bg-brand-600/10 text-brand-600"
                                        : "border-zinc-300 dark:border-zinc-700 text-text-primary/40 hover:border-zinc-400 dark:hover:border-zinc-600"
                                )}
                            >
                                {p === 'allTime' ? 'All Time' : p}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Leaderboard Table */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-zinc-900 border border-stroke"
                >
                    <div className="font-mono text-[10px] text-text-primary/40 uppercase tracking-widest p-4 border-b border-stroke">
                        // TOP WRITERS
                    </div>

                    {isLoading ? (
                        <div className="p-8 text-center">
                            <span className="font-mono text-xs text-text-primary/40">
                                Loading...
                            </span>
                        </div>
                    ) : leaderboard.length === 0 ? (
                        <div className="p-8 text-center">
                            <span className="font-mono text-xs text-text-primary/40">
                                No entries yet. Be the first!
                            </span>
                        </div>
                    ) : (
                        <div className="divide-y divide-stroke">
                            {leaderboard.map((user, index) => {
                                const isCurrentUser = userAddress?.toLowerCase() === user.address.toLowerCase()
                                const rank = index + 1

                                return (
                                    <div
                                        key={user.address}
                                        className={cn(
                                            "flex items-center justify-between p-4 transition-colors",
                                            isCurrentUser && "bg-brand-600/5"
                                        )}
                                    >
                                        <div className="flex items-center gap-4">
                                            {/* Rank */}
                                            <div className="w-8 text-center font-mono text-sm">
                                                {getRankEmoji(rank)}
                                            </div>

                                            {/* Address */}
                                            <div className="flex flex-col">
                                                <span className={cn(
                                                    "font-mono text-sm",
                                                    isCurrentUser ? "text-brand-600 font-bold" : "text-text-primary"
                                                )}>
                                                    {formatAddress(user.address)}
                                                    {isCurrentUser && " (you)"}
                                                </span>
                                                <span className="font-mono text-[10px] text-text-primary/40">
                                                    {user.currentStreak} day streak • {user.totalEntries} entries
                                                </span>
                                            </div>
                                        </div>

                                        {/* Points */}
                                        <div className="text-right">
                                            <span className="font-mono text-lg font-bold text-text-primary">
                                                {user.totalPoints.toLocaleString()}
                                            </span>
                                            <span className="font-mono text-[10px] text-text-primary/40 ml-1">
                                                pts
                                            </span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </motion.div>

                {/* User Stats Card (if connected) */}
                {userAddress && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white dark:bg-zinc-900 border border-stroke p-4"
                    >
                        <div className="font-mono text-[10px] text-text-primary/40 uppercase tracking-widest mb-3">
                            // YOUR STATS
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <div className="font-mono text-2xl font-bold text-text-primary">
                                    {currentUserRank ?? '--'}
                                </div>
                                <div className="font-mono text-[10px] text-text-primary/40 uppercase">Rank</div>
                            </div>
                            <div>
                                <div className="font-mono text-2xl font-bold text-text-primary">
                                    {currentUserStats?.totalPoints ?? '--'}
                                </div>
                                <div className="font-mono text-[10px] text-text-primary/40 uppercase">Points</div>
                            </div>
                            <div>
                                <div className="font-mono text-2xl font-bold text-text-primary">
                                    {currentUserStats?.currentStreak ?? '--'}
                                </div>
                                <div className="font-mono text-[10px] text-text-primary/40 uppercase">Streak</div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Opt-in Notice */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-zinc-50 dark:bg-zinc-900/50 border border-dashed border-stroke p-4"
                >
                    <p className="font-mono text-[10px] text-text-primary/40 text-center">
                        Leaderboard participation is opt-in. Your journal content remains private and encrypted.
                    </p>
                </motion.div>
            </div>
        </PageLayout>
    )
}
