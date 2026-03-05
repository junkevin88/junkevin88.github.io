/**
 * Sync script - populate database from IDX API.
 * @description Run essential sync tasks to get started.
 *
 * Usage: deno task sync
 */
import * as sync from '@app/Backend/Sync/index.ts'

// Use previous month - IDX monthly stats often not ready for current month yet
const now = new Date()
const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
const year = prevMonth.getFullYear()
const month = prevMonth.getMonth() + 1

async function runSync() {
  console.log(`[Sync] Starting essential sync tasks (stats period: ${year}-${month})...\n`)

  // 1. Master list saham
  await sync.syncSecurityStock()

  // 2. Daftar indeks bursa
  await sync.syncIndexList()

  // 3. Ringkasan trading umum
  await sync.syncTradeSummary()

  // 4. Statistik aktif (frekuensi, value, volume)
  await sync.syncActiveFrequency(year, month)
  await sync.syncActiveValue(year, month)
  await sync.syncActiveVolume(year, month)

  console.log('\n[Sync] Done! Database updated.')
}

runSync().catch((err) => {
  console.error('[Sync] Error:', err)
  Deno.exit(1)
})
