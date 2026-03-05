/**
 * KSEI Ownership module.
 * @description Query shareholder ownership data from local database.
 */
import { parse } from '@std/csv/parse'
import { and, desc, eq, like, or } from 'drizzle-orm'
import * as schemas from '@app/Backend/Schemas/index.ts'
import Database from '@app/Database.ts'
import type * as Types from '@app/Ownership/Types.ts'

const CONGLO_MAPPING_PATH = new URL('../../data/ticker_conglomerate_mapping.csv', import.meta.url)

export default class OwnershipModule {
  /**
   * Get ownership breakdown for a ticker.
   * @param code - Ticker code (e.g. BBCA, ADRO)
   * @returns List of shareholders ordered by percent descending
   */
  async getByTicker(code: string): Promise<Types.OwnershipRecord[]> {
    const rows = await Database.select()
      .from(schemas.kseiOwnership)
      .where(eq(schemas.kseiOwnership.code, code.toUpperCase()))
      .orderBy(desc(schemas.kseiOwnership.percent))
    return rows as Types.OwnershipRecord[]
  }

  /**
   * Get all holdings for an investor.
   * @param investor - Investor name (partial match supported)
   * @returns List of positions ordered by percent descending
   */
  async getByInvestor(investor: string): Promise<Types.OwnershipRecord[]> {
    const rows = await Database.select()
      .from(schemas.kseiOwnership)
      .where(like(schemas.kseiOwnership.investor, `%${investor}%`))
      .orderBy(desc(schemas.kseiOwnership.percent))
    return rows as Types.OwnershipRecord[]
  }

  /**
   * Search tickers by code or emiten name.
   * @param query - Search string
   * @param limit - Max results
   * @returns Matching tickers with distinct code/emiten
   */
  async searchTicker(query: string, limit = 20): Promise<{ code: string; emiten: string }[]> {
    const pattern = `%${query}%`
    const rows = await Database.selectDistinct({
      code: schemas.kseiOwnership.code,
      emiten: schemas.kseiOwnership.emiten
    })
      .from(schemas.kseiOwnership)
      .where(
        or(
          like(schemas.kseiOwnership.code, pattern),
          like(schemas.kseiOwnership.emiten, pattern)
        )
      )
      .limit(limit)
    return rows
  }

  /**
   * Search investors by name.
   * @param query - Search string
   * @param limit - Max results
   * @returns Distinct investor names
   */
  async searchInvestor(query: string, limit = 20): Promise<string[]> {
    const rows = await Database.selectDistinct({ investor: schemas.kseiOwnership.investor })
      .from(schemas.kseiOwnership)
      .where(like(schemas.kseiOwnership.investor, `%${query}%`))
      .limit(limit)
    return rows.map((r) => r.investor)
  }

  /**
   * Float screener - estimate free float from KSEI >1% holder data.
   * @param minFloat - Minimum free float % (default 0)
   * @param maxFloat - Maximum free float % (default 100)
   * @returns Tickers with estimated free float in range
   */
  async getFloatScreener(
    minFloat = 0,
    maxFloat = 100
  ): Promise<Types.FloatScreenerRow[]> {
    const rows = await Database.select().from(schemas.kseiOwnership)
    const byCode = new Map<
      string,
      { emiten: string; holders: { investor: string; percent: number }[]; total: number }
    >()
    for (const r of rows) {
      const existing = byCode.get(r.code)
      if (!existing) {
        byCode.set(r.code, {
          emiten: r.emiten,
          holders: [{ investor: r.investor, percent: r.percent }],
          total: r.percent
        })
      } else {
        existing.holders.push({ investor: r.investor, percent: r.percent })
        existing.total += r.percent
      }
    }
    const result: Types.FloatScreenerRow[] = []
    for (const [code, data] of byCode) {
      const freeFloat = 100 - data.total
      if (freeFloat >= minFloat && freeFloat <= maxFloat) {
        const topHolder = data.holders.sort((a, b) => b.percent - a.percent)[0]
        result.push({
          code,
          emiten: data.emiten,
          topHolder: topHolder?.investor ?? '',
          totalHeldPercent: data.total,
          freeFloatPercent: freeFloat,
          holderCount: data.holders.length
        })
      }
    }
    result.sort((a, b) => (a.freeFloatPercent ?? 0) - (b.freeFloatPercent ?? 0))
    return result
  }

  /**
   * Get ownership relation graph for a ticker.
   * Nodes: ticker (center), investors (holders), other tickers held by those investors.
   * Links: ticker-investor, investor-ticker.
   * @param code - Ticker code
   * @param maxInvestors - Max investors to include (default 12)
   * @param maxTickersPerInvestor - Max other tickers per investor (default 8)
   */
  async getOwnershipGraph(
    code: string,
    maxInvestors = 12,
    maxTickersPerInvestor = 8
  ): Promise<Types.OwnershipGraph> {
    const tickerCode = code.toUpperCase()
    const ownership = await this.getByTicker(tickerCode)
    const nodes: Types.OwnershipGraphNode[] = []
    const links: Types.OwnershipGraphLink[] = []
    const seenNodes = new Set<string>()

    const addNode = (id: string, label: string, type: 'ticker' | 'investor', percent?: number) => {
      if (seenNodes.has(id)) {
        if (type === 'ticker' && percent != null) {
          const existing = nodes.find((n) => n.id === id)
          if (existing && (existing.percent ?? 0) < percent) existing.percent = percent
        }
        return
      }
      seenNodes.add(id)
      nodes.push({ id, label, type, percent })
    }

    addNode(tickerCode, tickerCode, 'ticker')

    const topInvestors = ownership.slice(0, maxInvestors)
    for (const inv of topInvestors) {
      const invId = `inv:${inv.investor}`
      addNode(invId, inv.investor, 'investor', inv.percent)
      links.push({ source: tickerCode, target: invId, percent: inv.percent })

      const invHoldings = await this.getByInvestor(inv.investor)
      const otherTickers = invHoldings
        .filter((r) => r.code !== tickerCode)
        .slice(0, maxTickersPerInvestor)
      for (const pos of otherTickers) {
        addNode(pos.code, pos.code, 'ticker', pos.percent)
        links.push({ source: invId, target: pos.code, percent: pos.percent })
      }
    }

    return { nodes, links }
  }

  /**
   * Get conglomerates with ticker count from ticker_conglomerate_mapping.csv.
   * Supports emitens with multiple conglomerates (one row per ticker-conglomerate pair).
   * @returns List of conglomerates sorted by ticker count descending
   */
  async getConglomerates(): Promise<Types.ConglomerateRow[]> {
    const content = await Deno.readTextFile(CONGLO_MAPPING_PATH)
    const rows = parse(content, { skipFirstRow: true }) as Record<string, string>[]
    const byName = new Map<string, Set<string>>()
    for (const r of rows) {
      const kode = r['Kode']?.trim()
      const conglo = r['Conglomerate']?.trim()
      if (!kode || !conglo) continue
      const set = byName.get(conglo) ?? new Set()
      set.add(kode)
      byName.set(conglo, set)
    }
    return Array.from(byName.entries())
      .map(([name, codes]) => ({ name, tickerCount: codes.size }))
      .sort((a, b) => b.tickerCount - a.tickerCount)
  }

  /**
   * Get public figures with their holdings.
   * @param limit - Max results
   * @returns List of public figures with position count and top holding
   */
  async getPublicFigures(limit = 20): Promise<Types.PublicFigureRow[]> {
    const rows = await Database.select()
      .from(schemas.kseiOwnership)
      .where(eq(schemas.kseiOwnership.publicFiguresFlag, 'Y'))
      .orderBy(desc(schemas.kseiOwnership.percent))
    const byInvestor = new Map<
      string,
      { conglomerate: string | null; positions: { code: string; percent: number }[] }
    >()
    for (const r of rows) {
      const existing = byInvestor.get(r.investor)
      if (!existing) {
        byInvestor.set(r.investor, {
          conglomerate: r.conglomerate ?? null,
          positions: [{ code: r.code, percent: r.percent }]
        })
      } else {
        existing.positions.push({ code: r.code, percent: r.percent })
      }
    }
    return Array.from(byInvestor.entries())
      .map(([investor, data]) => {
        const top = data.positions.sort((a, b) => b.percent - a.percent)[0]
        return {
          investor,
          conglomerate: data.conglomerate,
          positionCount: data.positions.length,
          topTicker: top?.code ?? '',
          topPercent: top?.percent ?? 0
        }
      })
      .sort((a, b) => b.positionCount - a.positionCount)
      .slice(0, limit)
  }

  /**
   * Get top foreign investors by stock count.
   * @param limit - Max results
   * @returns List of foreign investors with stock count
   */
  async getTopForeignInvestors(limit = 10): Promise<Types.TopForeignInvestorRow[]> {
    const rows = await Database.select({
      investor: schemas.kseiOwnership.investor,
      code: schemas.kseiOwnership.code
    })
      .from(schemas.kseiOwnership)
      .where(eq(schemas.kseiOwnership.localForeign, 'Asing'))
    const byInvestor = new Map<string, Set<string>>()
    for (const r of rows) {
      const set = byInvestor.get(r.investor) ?? new Set()
      set.add(r.code)
      byInvestor.set(r.investor, set)
    }
    return Array.from(byInvestor.entries())
      .map(([investor, codes]) => ({ investor, stockCount: codes.size }))
      .sort((a, b) => b.stockCount - a.stockCount)
      .slice(0, limit)
  }

  /**
   * Get dashboard stats (ticker count, investor count, local/foreign split).
   */
  async getStats(): Promise<{
    tickerCount: number
    investorCount: number
    positionCount: number
    localPercent: number
    foreignPercent: number
  }> {
    const rows = await Database.select({
      code: schemas.kseiOwnership.code,
      investor: schemas.kseiOwnership.investor,
      localForeign: schemas.kseiOwnership.localForeign,
      percent: schemas.kseiOwnership.percent
    }).from(schemas.kseiOwnership)
    const tickers = new Set(rows.map((r) => r.code))
    const investors = new Set(rows.map((r) => r.investor))
    let local = 0
    let foreign = 0
    for (const r of rows) {
      if (r.localForeign === 'Lokal') local += r.percent
      else if (r.localForeign === 'Asing') foreign += r.percent
    }
    const total = local + foreign || 1
    return {
      tickerCount: tickers.size,
      investorCount: investors.size,
      positionCount: rows.length,
      localPercent: (local / total) * 100,
      foreignPercent: (foreign / total) * 100
    }
  }

  /**
   * Get local vs foreign ownership split for a ticker.
   * @param code - Ticker code
   * @returns { local: number, foreign: number }
   */
  async getLocalForeignSplit(code: string): Promise<{ local: number; foreign: number }> {
    const rows = await Database.select({
      localForeign: schemas.kseiOwnership.localForeign,
      percent: schemas.kseiOwnership.percent
    })
      .from(schemas.kseiOwnership)
      .where(eq(schemas.kseiOwnership.code, code.toUpperCase()))
    const local = rows.filter((r) => r.localForeign === 'Lokal').reduce((s, r) => s + r.percent, 0)
    const foreign = rows.filter((r) => r.localForeign === 'Asing').reduce((s, r) => s + r.percent, 0)
    return { local, foreign }
  }
}
