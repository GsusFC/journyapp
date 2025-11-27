import { index, onchainTable } from "ponder";

/**
 * User - Datos agregados por usuario para leaderboards
 */
export const user = onchainTable(
  "user",
  (t) => ({
    // Address como primary key (hex lowercase)
    address: t.hex().primaryKey(),

    // Contadores
    totalEntries: t.integer().notNull().default(0),
    currentStreak: t.integer().notNull().default(0),
    maxStreak: t.integer().notNull().default(0),

    // Puntos calculados
    totalPoints: t.integer().notNull().default(0),
    weeklyPoints: t.integer().notNull().default(0),
    monthlyPoints: t.integer().notNull().default(0),

    // Timestamps
    firstEntryAt: t.integer(), // Unix timestamp
    lastEntryAt: t.integer(), // Unix timestamp

    // Gamificación
    isOptedIn: t.boolean().notNull().default(false),
  }),
  (table) => ({
    // Índices para queries de leaderboard
    totalPointsIdx: index().on(table.totalPoints),
    weeklyPointsIdx: index().on(table.weeklyPoints),
    monthlyPointsIdx: index().on(table.monthlyPoints),
    currentStreakIdx: index().on(table.currentStreak),
  })
);

/**
 * Entry - Cada entrada individual (para historial y analytics)
 */
export const entry = onchainTable(
  "entry",
  (t) => ({
    // ID único: txHash-logIndex
    id: t.text().primaryKey(),

    // Referencia al usuario
    userAddress: t.hex().notNull(),

    // Datos del evento
    cid: t.text().notNull(),
    timestamp: t.integer().notNull(),
    streak: t.integer().notNull(),

    // Puntos ganados con esta entrada
    pointsEarned: t.integer().notNull(),

    // Metadata del bloque
    blockNumber: t.bigint().notNull(),
    transactionHash: t.hex().notNull(),
  }),
  (table) => ({
    userIdx: index().on(table.userAddress),
    timestampIdx: index().on(table.timestamp),
  })
);

/**
 * LeaderboardSnapshot - Snapshots históricos para rankings semanales/mensuales
 */
export const leaderboardSnapshot = onchainTable(
  "leaderboard_snapshot",
  (t) => ({
    // ID: type-period (e.g., "weekly-2025-W48", "monthly-2025-11")
    id: t.text().primaryKey(),

    // Tipo de leaderboard
    type: t.text().notNull(), // "weekly" | "monthly"

    // Período (ISO week o month)
    period: t.text().notNull(),

    // Top 10 como JSON string (address -> points)
    rankings: t.text().notNull(),

    // Timestamp de creación del snapshot
    createdAt: t.integer().notNull(),
  }),
  (table) => ({
    typeIdx: index().on(table.type),
    periodIdx: index().on(table.period),
  })
);
