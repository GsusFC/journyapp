import { db } from "ponder:api";
import schema from "ponder:schema";
import { Hono } from "hono";
import { graphql } from "ponder";

/**
 * API GraphQL para el indexer de Journy.
 * 
 * Ponder expone automáticamente queries para todas las tablas del schema:
 * - user / users
 * - entry / entries
 * - leaderboardSnapshot / leaderboardSnapshots
 * 
 * Ejemplo de query:
 * ```graphql
 * query {
 *   users(orderBy: "totalPoints", orderDirection: "desc", limit: 10) {
 *     items {
 *       address
 *       totalPoints
 *       currentStreak
 *       totalEntries
 *     }
 *   }
 * }
 * ```
 */

const app = new Hono();

// Habilitar el endpoint GraphQL
app.use("/graphql", graphql({ db, schema }));

export default app;
