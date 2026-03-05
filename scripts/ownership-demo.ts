/**
 * Ownership module demo.
 * @description Quick test of KSEI ownership queries.
 *
 * Usage: deno task ownership:demo
 */
import IDXClient from '@app/index.ts'

async function run() {
  const client = new IDXClient()

  console.log('=== Ownership by Ticker (BBCA) ===')
  const bca = await client.ownership.getByTicker('BBCA')
  for (const r of bca.slice(0, 5)) {
    console.log(`  ${r.investor}: ${r.percent}% (${r.localForeign})`)
  }

  console.log('\n=== Lo Kheng Hong Holdings ===')
  const lkh = await client.ownership.getByInvestor('LO KHENG')
  for (const r of lkh.slice(0, 8)) {
    console.log(`  ${r.code} ${r.emiten}: ${r.percent}%`)
  }

  console.log('\n=== Local vs Foreign (BBRI) ===')
  const split = await client.ownership.getLocalForeignSplit('BBRI')
  console.log(`  Local: ${split.local.toFixed(1)}% | Foreign: ${split.foreign.toFixed(1)}%`)

  console.log('\n=== Float Screener (low float <5%) ===')
  const lowFloat = await client.ownership.getFloatScreener(0, 5)
  for (const r of lowFloat.slice(0, 5)) {
    console.log(`  ${r.code}: ${r.freeFloatPercent?.toFixed(1)}% free float | Top: ${r.topHolder}`)
  }

  console.log('\nDone!')
}

run().catch(console.error)
