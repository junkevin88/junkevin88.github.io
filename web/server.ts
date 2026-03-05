/**
 * Ownership web server.
 * @description API + static frontend for KSEI ownership data.
 *
 * Usage: deno task web
 */
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { fromFileUrl, join, dirname } from '@std/path'
import CompanyModule from '@app/Company/index.ts'
import OwnershipModule from '@app/Ownership/index.ts'

const ownership = new OwnershipModule()
const company = new CompanyModule()
const app = new Hono()
const webDir = fromFileUrl(new URL('./static', import.meta.url))
const portfolioDir = fromFileUrl(new URL('./portfolio', import.meta.url))
const projectRoot = dirname(dirname(fromFileUrl(import.meta.url)))

app.use('/*', cors())

// API: ownership by ticker
app.get('/api/ownership/ticker/:code', async (c) => {
  const code = c.req.param('code')
  const data = await ownership.getByTicker(code)
  return c.json(data)
})

// API: ownership by investor
app.get('/api/ownership/investor/:name', async (c) => {
  const name = decodeURIComponent(c.req.param('name'))
  const data = await ownership.getByInvestor(name)
  return c.json(data)
})

// API: search ticker
app.get('/api/ownership/search/ticker', async (c) => {
  const q = c.req.query('q') ?? ''
  const limit = parseInt(c.req.query('limit') ?? '20', 10)
  const data = await ownership.searchTicker(q, limit)
  return c.json(data)
})

// API: search investor
app.get('/api/ownership/search/investor', async (c) => {
  const q = c.req.query('q') ?? ''
  const limit = parseInt(c.req.query('limit') ?? '20', 10)
  const data = await ownership.searchInvestor(q, limit)
  return c.json(data)
})

// API: float screener
app.get('/api/ownership/float', async (c) => {
  const min = parseFloat(c.req.query('min') ?? '0')
  const max = parseFloat(c.req.query('max') ?? '100')
  const data = await ownership.getFloatScreener(min, max)
  return c.json(data)
})

// API: local/foreign split
app.get('/api/ownership/split/:code', async (c) => {
  const code = c.req.param('code')
  const data = await ownership.getLocalForeignSplit(code)
  return c.json(data)
})

// API: ownership relation graph (for profile page)
app.get('/api/ownership/graph/:code', async (c) => {
  const code = c.req.param('code')
  const maxInvestors = parseInt(c.req.query('maxInvestors') ?? '12', 10)
  const maxTickers = parseInt(c.req.query('maxTickersPerInvestor') ?? '8', 10)
  const data = await ownership.getOwnershipGraph(code, maxInvestors, maxTickers)
  return c.json(data)
})

// API: conglomerates
app.get('/api/ownership/conglomerates', async (c) => {
  const data = await ownership.getConglomerates()
  return c.json(data)
})

// API: top foreign investors
app.get('/api/ownership/top-foreign-investors', async (c) => {
  const limit = parseInt(c.req.query('limit') ?? '10', 10)
  const data = await ownership.getTopForeignInvestors(limit)
  return c.json(data)
})

// API: public figures
app.get('/api/ownership/public-figures', async (c) => {
  const limit = parseInt(c.req.query('limit') ?? '20', 10)
  const data = await ownership.getPublicFigures(limit)
  return c.json(data)
})

// API: company profile (profil emiten)
app.get('/api/company/profile/:code', async (c) => {
  const code = c.req.param('code')?.toUpperCase() ?? ''
  if (!code) return c.json({ error: 'Code required' }, 400)
  try {
    const data = await company.getCompanyProfilesDetail(code)
    if (!data) return c.json({ error: 'Not found' }, 404)
    return c.json(data)
  } catch (err) {
    console.error('[Company]', err)
    return c.json({ error: 'Failed to fetch profile' }, 500)
  }
})

// API: dashboard stats
app.get('/api/stats', async (c) => {
  const [stats, conglomerates, publicFigures, lowFloat] = await Promise.all([
    ownership.getStats(),
    ownership.getConglomerates(),
    ownership.getPublicFigures(100),
    ownership.getFloatScreener(0, 5)
  ])
  return c.json({
    ...stats,
    conglomerateCount: conglomerates.length,
    publicFigureCount: publicFigures.length,
    lowFloatCount: lowFloat.length
  })
})

// Serve company logos from sample/img
app.get('/api/img/:filename', async (c) => {
  const filename = c.req.param('filename') ?? ''
  const match = filename.match(/^([A-Z0-9]{2,5})\.svg$/i)
  if (!match) return c.notFound()
  const code = match[1].toUpperCase()
  try {
    const logoPath = join(projectRoot, 'sample', 'img', `${code}.svg`)
    const content = await Deno.readFile(logoPath)
    return new Response(content, {
      headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=86400' }
    })
  } catch {
    return c.notFound()
  }
})

// Serve Analisis Ordal ownership app under /analisis-ordal/*
app.get('/analisis-ordal/*', async (c) => {
  const rawPath = c.req.path.replace(/^\/analisis-ordal/, '')
  const requestPath = !rawPath || rawPath === '/' ? '/index.html' : rawPath
  const filePath = join(webDir, requestPath.replace(/^\//, ''))
  try {
    const content = await Deno.readFile(filePath)
    const ext = requestPath.split('.').pop()
    const types: Record<string, string> = {
      html: 'text/html',
      js: 'application/javascript',
      css: 'text/css',
      json: 'application/json'
    }
    return new Response(content, {
      headers: { 'Content-Type': types[ext ?? ''] ?? 'application/octet-stream' }
    })
  } catch {
    return c.notFound()
  }
})

// Serve portfolio as the main site (root and other static files)
app.get('/*', async (c) => {
  const path = c.req.path === '/' ? '/index.html' : c.req.path
  const filePath = join(portfolioDir, path.replace(/^\//, ''))
  try {
    const content = await Deno.readFile(filePath)
    const ext = path.split('.').pop()
    const types: Record<string, string> = {
      html: 'text/html',
      js: 'application/javascript',
      css: 'text/css',
      json: 'application/json',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      avif: 'image/avif',
      webp: 'image/webp',
      pdf: 'application/pdf',
      mp3: 'audio/mpeg',
      wav: 'audio/wav',
      ogg: 'audio/ogg'
    }
    return new Response(content, {
      headers: { 'Content-Type': types[ext ?? ''] ?? 'application/octet-stream' }
    })
  } catch {
    return c.notFound()
  }
})

const port = parseInt(Deno.env.get('PORT') ?? '3000', 10)
console.log(`[Web] Ownership app: http://localhost:${port}`)
Deno.serve({ port }, app.fetch)
