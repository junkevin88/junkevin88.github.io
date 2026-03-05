import { integer, primaryKey, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'

/**
 * KSEI ownership schema.
 * @description Shareholder ownership data from KSEI (Kustodian Sentral Efek Indonesia).
 */
export const kseiOwnership = sqliteTable(
  'ksei_ownership',
  {
    /** Ticker code */
    code: text('code').notNull(),
    /** Company/emiten name */
    emiten: text('emiten').notNull(),
    /** Investor name */
    investor: text('investor').notNull(),
    /** Investor type: Corporate, Individual, Bank, Securities, Insurance, Other, Pension Fund */
    type: text('type').notNull(),
    /** Local or Foreign */
    localForeign: text('local_foreign').notNull(),
    /** Nationality */
    nationality: text('nationality'),
    /** Share count (lembar saham) */
    shares: integer('shares').notNull(),
    /** Ownership percentage */
    percent: real('percent').notNull(),
    /** Conglomerate / business group name */
    conglomerate: text('conglomerate'),
    /** Public figure flag: Y or N */
    publicFiguresFlag: text('public_figures_flag')
  },
  (table) => [primaryKey({ columns: [table.code, table.investor] })]
)
