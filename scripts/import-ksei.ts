/**
 * Import KSEI ownership CSV into SQLite.
 * @description Parses CSV and upserts into ksei_ownership table.
 *
 * Usage: deno task ksei:import [path/to/ksei_saham.csv]
 * Default: data/ksei_saham.csv
 */
import { parse } from '@std/csv/parse'
import * as schemas from '@app/Backend/Schemas/index.ts'
import Database from '@app/Database.ts'

const csvPath = Deno.args[0] ?? 'data/ksei_saham.csv'

function parsePercent(val: string): number {
  const cleaned = String(val ?? '').replace(',', '.').trim()
  const num = parseFloat(cleaned)
  return Number.isNaN(num) ? 0 : num
}

function parseShares(val: string): number {
  const num = parseInt(String(val ?? '0').replace(/\D/g, ''), 10)
  return Number.isNaN(num) ? 0 : num
}

async function runImport() {
  console.log(`[KSEI] Reading ${csvPath}...`)
  const content = await Deno.readTextFile(csvPath)
  const rows = parse(content, { skipFirstRow: true }) as Record<string, string>[]

  if (!rows.length) {
    console.warn('[KSEI] No rows found.')
    return
  }

  const records = rows
    .filter((r) => r['Kode'] && r['Investor'])
    .map((r) => ({
      code: r['Kode']!.trim(),
      emiten: r['Emiten']?.trim() ?? '',
      investor: r['Investor']!.trim(),
      type: r['Tipe']?.trim() ?? 'Other',
      localForeign: r['Lokal/Asing']?.trim() ?? '',
      nationality: r['Nasionalitas']?.trim() || null,
      shares: parseShares(r['Lembar Saham'] ?? '0'),
      percent: parsePercent(r['Persentase'] ?? '0'),
      conglomerate: r['Conglomerate']?.trim() || null,
      publicFiguresFlag: r['Public Figures Flag']?.trim() || null
    }))

  console.log(`[KSEI] Clearing existing data...`)
  await Database.delete(schemas.kseiOwnership)

  console.log(`[KSEI] Importing ${records.length} records...`)
  const batchSize = 500
  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize)
    await Database.insert(schemas.kseiOwnership).values(batch)
    process.stdout.write(`\r[KSEI] ${Math.min(i + batchSize, records.length)}/${records.length}`)
  }

  console.log(`\n[KSEI] Done! Imported ${records.length} ownership records.`)
}

runImport().catch((err) => {
  console.error('[KSEI] Error:', err)
  Deno.exit(1)
})
