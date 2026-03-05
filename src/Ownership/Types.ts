/**
 * Ownership module types.
 */

export interface OwnershipRecord {
  code: string
  emiten: string
  investor: string
  type: string
  localForeign: string
  nationality: string | null
  shares: number
  percent: number
}

export interface FloatScreenerRow {
  code: string
  emiten: string
  topHolder: string
  totalHeldPercent: number
  freeFloatPercent: number
  holderCount: number
}

export interface ConglomerateRow {
  name: string
  tickerCount: number
}

export interface PublicFigureRow {
  investor: string
  conglomerate: string | null
  positionCount: number
  topTicker: string
  topPercent: number
}

export interface TopForeignInvestorRow {
  investor: string
  stockCount: number
}

export interface OwnershipGraphNode {
  id: string
  label: string
  type: 'ticker' | 'investor'
  /** Ownership % for sizing (investor: % in center ticker; ticker: max % from connecting investors) */
  percent?: number
}

export interface OwnershipGraphLink {
  source: string
  target: string
  /** Ownership % for this link */
  percent?: number
}

export interface OwnershipGraph {
  nodes: OwnershipGraphNode[]
  links: OwnershipGraphLink[]
}
