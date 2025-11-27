import { ponder } from "ponder:registry";
import { user, entry } from "ponder:schema";

/**
 * Calcula los puntos para una entrada basándose en el streak actual.
 *
 * Fórmula: BASE × MULT_STREAK
 * - BASE = 10 puntos por entrada
 * - MULT_STREAK = 1 + (streak / 10) → Lineal, recompensa rachas largas
 *
 * Ejemplos:
 * - Streak 1: 10 × 1.1 = 11 puntos
 * - Streak 7: 10 × 1.7 = 17 puntos
 * - Streak 30: 10 × 4.0 = 40 puntos
 * - Streak 100: 10 × 11.0 = 110 puntos
 *
 * TODO: Considerar curva logarítmica si los veteranos dominan demasiado
 */
function calculatePoints(streak: number): number {
  const BASE_POINTS = 10;
  const streakMultiplier = 1 + streak / 10;
  return Math.floor(BASE_POINTS * streakMultiplier);
}

/**
 * Handler para el evento EntryLogged del contrato JournyLog.
 *
 * Este evento se emite cada vez que un usuario guarda una entrada en su diario.
 * Actualiza las estadísticas del usuario y registra la entrada individual.
 */
ponder.on("JournyLog:EntryLogged", async ({ event, context }) => {
  const { user: userAddress, cid, timestamp, streak } = event.args;

  // Convertir timestamp de BigInt a number (segundos Unix)
  const timestampNum = Number(timestamp);
  const streakNum = Number(streak);

  // Calcular puntos para esta entrada
  const pointsEarned = calculatePoints(streakNum);

  // ID único para la entrada: txHash-logIndex
  const entryId = `${event.transaction.hash}-${event.log.logIndex}`;

  // 1. Insertar o actualizar el usuario
  await context.db
    .insert(user)
    .values({
      address: userAddress,
      totalEntries: 1,
      currentStreak: streakNum,
      maxStreak: streakNum,
      totalPoints: pointsEarned,
      weeklyPoints: pointsEarned,
      monthlyPoints: pointsEarned,
      firstEntryAt: timestampNum,
      lastEntryAt: timestampNum,
      isOptedIn: false, // Por defecto no participa en leaderboard
    })
    .onConflictDoUpdate((row) => ({
      totalEntries: row.totalEntries + 1,
      currentStreak: streakNum,
      maxStreak: streakNum > row.maxStreak ? streakNum : row.maxStreak,
      totalPoints: row.totalPoints + pointsEarned,
      weeklyPoints: row.weeklyPoints + pointsEarned,
      monthlyPoints: row.monthlyPoints + pointsEarned,
      lastEntryAt: timestampNum,
    }));

  // 2. Insertar la entrada individual
  await context.db.insert(entry).values({
    id: entryId,
    userAddress: userAddress,
    cid: cid,
    timestamp: timestampNum,
    streak: streakNum,
    pointsEarned: pointsEarned,
    blockNumber: event.block.number,
    transactionHash: event.transaction.hash,
  });
});
