const API = ''
const PAGE_SIZE = 15
const FLOAT_PAGE_SIZE = 25

let resultData = []
let resultType = ''
let floatData = []
let resultSort = { col: 3, dir: 'desc' }
let floatSort = { col: 4, dir: 'asc' }
let resultPage = 1
let floatPage = 1
const RESULT_PAGE_SIZE = 20

const appView = document.getElementById('appView')
const profilePage = document.getElementById('profilePage')
const profilePageContent = document.getElementById('profilePageContent')
const profileBackBtn = document.getElementById('profileBackBtn')

document.addEventListener('DOMContentLoaded', () => {
  loadStats()
  loadFloatPreview()
  loadConglomerates()
  loadTopForeignInvestors()
  loadPublicFigures()
  initSearch()
  initFloatScreener()
  initNav()
  initProfileRouting()
  initThemeToggle()
})

function initThemeToggle() {
  const btn = document.getElementById('themeToggle')
  const icon = document.getElementById('themeIcon')
  const updateIcon = () => {
    if (icon) icon.textContent = document.documentElement.classList.contains('dark') ? '☀️' : '🌙'
  }
  updateIcon()
  btn?.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark')
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
    updateIcon()
  })
}

async function loadStats() {
  try {
    const r = await fetch(`${API}/api/stats`)
    const d = await r.json()
    document.getElementById('statTickers').textContent = d.tickerCount?.toLocaleString() ?? '-'
    document.getElementById('statInvestors').textContent = d.investorCount?.toLocaleString() ?? '-'
    document.getElementById('statPositions').textContent = d.positionCount?.toLocaleString() ?? '-'
    document.getElementById('statLocal').textContent = `${d.localPercent?.toFixed(1) ?? '-'}%`
    document.getElementById('statForeign').textContent = `${d.foreignPercent?.toFixed(1) ?? '-'}%`
    document.getElementById('statConglomerates').textContent = d.conglomerateCount ?? '-'
  } catch (e) {
    console.error(e)
  }
}

async function loadFloatPreview() {
  try {
    const r = await fetch(`${API}/api/ownership/float?min=0&max=15`)
    const data = await r.json()
    const html = data.slice(0, 8).map(row => {
      const ff = row.freeFloatPercent ?? (100 - (row.totalHeldPercent ?? 0))
      const warn = ff < 5 ? ' text-amber-400' : ''
      return `<div class="flex justify-between py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700/30 rounded-lg px-2 -mx-2 transition-colors duration-150"><span class="mono font-medium">${tickerLink(row.code)}</span><span class="text-slate-500 dark:text-slate-400 truncate max-w-[140px]" title="${escapeHtml(row.topHolder)}">${escapeHtml((row.topHolder || '').slice(0, 25))}...</span><span class="${warn}">${ff.toFixed(1)}%</span></div>`
    }).join('')
    document.getElementById('floatPreview').innerHTML = html || '<p class="text-slate-500">No data</p>'
  } catch (e) {
    document.getElementById('floatPreview').innerHTML = '<p class="text-slate-500">Error loading</p>'
  }
}

async function loadConglomerates() {
  try {
    const r = await fetch(`${API}/api/ownership/conglomerates`)
    const data = await r.json()
    renderPaginatedList('conglomeratesList', data, PAGE_SIZE, (c) =>
      `<div class="flex justify-between py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700/30 rounded-lg px-2 -mx-2 transition-colors duration-150"><span>${escapeHtml(c.name)}</span><span class="text-slate-500 dark:text-slate-400">${c.tickerCount} tickers</span></div>`
    )
  } catch (e) {
    document.getElementById('conglomeratesList').innerHTML = '<p class="text-slate-500">Error loading</p>'
  }
}

async function loadTopForeignInvestors() {
  try {
    const r = await fetch(`${API}/api/ownership/top-foreign-investors?limit=50`)
    const data = await r.json()
    renderPaginatedList('topForeignList', data, PAGE_SIZE, (item) => `
      <div class="flex items-center justify-between py-2 hover:bg-slate-100 dark:hover:bg-slate-700/40 rounded-xl px-3 -mx-1 cursor-pointer transition-all duration-200" data-investor="${escapeHtml(item.investor)}">
        <div class="flex items-center gap-2 min-w-0">
          <span class="flex-shrink-0 w-6 h-6 rounded-lg bg-blue-500/30 text-blue-400 text-xs font-medium flex items-center justify-center">F</span>
          <span class="truncate" title="${escapeHtml(item.investor)}">${escapeHtml(item.investor)}</span>
        </div>
        <span class="text-blue-400 text-sm flex-shrink-0 ml-2">${item.stockCount} stocks</span>
      </div>
    `, (container) => {
      container?.querySelectorAll('[data-investor]').forEach(el => {
        el.addEventListener('click', () => runSearch(el.dataset.investor, 'investor'))
      })
    })
  } catch (e) {
    document.getElementById('topForeignList').innerHTML = '<p class="text-slate-500">Error loading</p>'
  }
}

async function loadPublicFigures() {
  try {
    const r = await fetch(`${API}/api/ownership/public-figures?limit=50`)
    const data = await r.json()
    renderPaginatedGrid('publicFiguresGrid', data, 8, (pf, i) => `
      <div class="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-4 border border-slate-200 dark:border-slate-600/40 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:border-slate-400 dark:hover:border-slate-500/50 hover:shadow-lg hover:bg-slate-100 dark:hover:bg-slate-800/60" data-investor="${escapeHtml(pf.investor)}" style="animation: fadeInUp 0.4s ease-out ${i * 0.03}s forwards; opacity: 0">
        <div class="font-medium text-slate-900 dark:text-white truncate" title="${escapeHtml(pf.investor)}">${escapeHtml(pf.investor)}</div>
        <div class="text-slate-500 text-xs mt-1">${pf.positionCount} pos</div>
        <div class="text-emerald-400 text-sm mt-1 mono">${pf.topTicker ? tickerLink(pf.topTicker) : '-'} ${pf.topPercent?.toFixed(2) ?? ''}%</div>
      </div>
    `)
  } catch (e) {
    document.getElementById('publicFiguresGrid').innerHTML = '<p class="text-slate-500">Error loading</p>'
  }
}

function renderPaginatedList(containerId, data, pageSize, itemRenderer, onRender) {
  const container = document.getElementById(containerId)
  if (!container) return
  if (!data.length) {
    container.innerHTML = '<p class="text-slate-500">No data</p>'
    return
  }
  let page = 1
  const totalPages = Math.ceil(data.length / pageSize)
  const render = () => {
    const start = (page - 1) * pageSize
    const chunk = data.slice(start, start + pageSize)
    const html = chunk.map(itemRenderer).join('')
    const paginationHtml = totalPages > 1 ? `
      <div class="flex items-center justify-between mt-3 pt-3 border-t border-slate-200 dark:border-slate-600/40">
        <span class="text-slate-500 text-xs">${start + 1}-${start + chunk.length} of ${data.length}</span>
        <div class="flex gap-1">
          <button class="page-prev px-2 py-1 rounded text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700/50 text-xs disabled:opacity-40" ${page <= 1 ? 'disabled' : ''}>←</button>
          <span class="px-2 py-1 text-slate-500 text-xs">${page}/${totalPages}</span>
          <button class="page-next px-2 py-1 rounded text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700/50 text-xs disabled:opacity-40" ${page >= totalPages ? 'disabled' : ''}>→</button>
        </div>
      </div>
    ` : ''
    container.innerHTML = html + paginationHtml
    container.querySelector('.page-prev')?.addEventListener('click', () => { page = Math.max(1, page - 1); render() })
    container.querySelector('.page-next')?.addEventListener('click', () => { page = Math.min(totalPages, page + 1); render() })
    onRender?.(container)
  }
  render()
}

function renderPaginatedGrid(containerId, data, pageSize, itemRenderer) {
  const container = document.getElementById(containerId)
  if (!container) return
  if (!data.length) {
    container.innerHTML = '<p class="text-slate-500">No data</p>'
    return
  }
  let page = 1
  let isAnimating = false
  const totalPages = Math.ceil(data.length / pageSize)
  const gridClasses = 'grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 slide-wrapper'

  const buildContent = () => {
    const start = (page - 1) * pageSize
    const chunk = data.slice(start, start + pageSize)
    const html = chunk.map((item, i) => itemRenderer(item, i)).join('')
    const paginationHtml = totalPages > 1 ? `
      <div class="flex items-center justify-between mt-4 pt-4 border-t border-slate-200 dark:border-slate-600/40 col-span-full">
        <span class="text-slate-500 text-xs">${start + 1}-${start + chunk.length} of ${data.length}</span>
        <div class="flex gap-1">
          <button class="page-prev px-2 py-1 rounded text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700/50 text-xs disabled:opacity-40" ${page <= 1 ? 'disabled' : ''}>←</button>
          <span class="px-2 py-1 text-slate-500 text-xs">${page}/${totalPages}</span>
          <button class="page-next px-2 py-1 rounded text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700/50 text-xs disabled:opacity-40" ${page >= totalPages ? 'disabled' : ''}>→</button>
        </div>
      </div>
    ` : ''
    return html + paginationHtml
  }

  const render = (animate = false, direction = 0) => {
    const wrapper = container.querySelector('.slide-wrapper')
    const isInitial = !wrapper

    if (isInitial) {
      container.innerHTML = `<div class="${gridClasses}">${buildContent()}</div>`
    } else if (animate && direction !== 0 && !isAnimating) {
      isAnimating = true
      const outClass = direction > 0 ? 'slide-out-left' : 'slide-out-right'
      const inClass = direction > 0 ? 'slide-in-from-right' : 'slide-in-from-left'
      wrapper.classList.add(outClass)
      wrapper.addEventListener('transitionend', function onEnd() {
        wrapper.removeEventListener('transitionend', onEnd)
        wrapper.classList.remove(outClass)
        wrapper.innerHTML = buildContent()
        wrapper.classList.add(inClass)
        wrapper.addEventListener('animationend', function onAnimEnd() {
          wrapper.removeEventListener('animationend', onAnimEnd)
          wrapper.classList.remove(inClass)
          isAnimating = false
        }, { once: true })
        bindEvents()
      }, { once: true })
      return
    } else {
      wrapper.innerHTML = buildContent()
    }

    bindEvents()
  }

  const bindEvents = () => {
    container.querySelector('.page-prev')?.addEventListener('click', () => {
      if (isAnimating) return
      const nextPage = Math.max(1, page - 1)
      if (nextPage !== page) { page = nextPage; render(true, -1) }
    })
    container.querySelector('.page-next')?.addEventListener('click', () => {
      if (isAnimating) return
      const nextPage = Math.min(totalPages, page + 1)
      if (nextPage !== page) { page = nextPage; render(true, 1) }
    })
    container.querySelectorAll('[data-investor]').forEach(el => {
      el.addEventListener('click', () => runSearch(el.dataset.investor, 'investor'))
    })
  }

  render()
}

function initProfileRouting() {
  const route = () => {
    const hash = window.location.hash.slice(1) || '/'
    const match = hash.match(/^\/profile\/([A-Z0-9]{2,5})$/i)
    if (match) {
      appView?.classList.add('hidden')
      profilePage?.classList.remove('hidden')
      loadProfilePage(match[1].toUpperCase())
    } else {
      appView?.classList.remove('hidden')
      profilePage?.classList.add('hidden')
      document.title = 'Analisis Ordal — KSEI Data'
    }
  }
  window.addEventListener('hashchange', route)
  route()
  profileBackBtn?.addEventListener('click', (e) => {
    e.preventDefault()
    window.location.hash = ''
  })
}

async function loadProfilePage(code) {
  if (!profilePageContent) return
  profilePageContent.innerHTML = '<p class="text-slate-400 text-center py-16">Memuat profil...</p>'
  try {
    const r = await fetch(`${API}/api/company/profile/${encodeURIComponent(code.toUpperCase())}`)
    if (!r.ok) {
      profilePageContent.innerHTML = `<p class="text-red-400 text-center py-16">${r.status === 404 ? 'Profil tidak ditemukan' : 'Gagal memuat profil'}</p>`
      return
    }
    const data = await r.json()
    document.title = `${data.profile?.code ?? code} — ${data.profile?.name ?? 'Profil'} | Analisis Ordal`
    profilePageContent.innerHTML = renderProfileContent(data, code)
    loadProfileRelationGraph(code.toUpperCase())
  } catch (err) {
    profilePageContent.innerHTML = '<p class="text-red-400 text-center py-16">Error memuat profil</p>'
  }
}

function renderProfileContent(data, code) {
  const p = data.profile ?? {}
  const ticker = (p.code ?? code ?? '').toUpperCase()
  const logoUrl = `${API}/api/img/${ticker}.svg`
  const section = (title, content) =>
    content ? `<div class="mb-6"><h4 class="text-slate-400 font-semibold uppercase text-xs mb-2">${title}</h4><div class="text-slate-200">${content}</div></div>` : ''
  const formatDate = (s) => {
    if (!s) return '-'
    try {
      const d = new Date(s)
      return isNaN(d.getTime()) ? s : d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    } catch {
      return s
    }
  }

  let html = `
    <div class="flex items-start gap-6 mb-6 pb-6 border-b border-slate-200 dark:border-slate-600/50">
      <div class="flex-shrink-0 w-24 h-24 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-600/40 flex items-center justify-center overflow-hidden">
        <img src="${escapeHtml(logoUrl)}" alt="${escapeHtml(ticker)}" class="w-16 h-16 object-contain" onerror="this.style.display='none'; this.nextElementSibling?.classList.remove('hidden')" />
        <span class="hidden text-2xl font-bold text-slate-500 mono">${escapeHtml(ticker)}</span>
      </div>
      <div class="min-w-0 flex-1">
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white">${escapeHtml(p.name ?? ticker)}</h1>
        <p class="text-slate-500 dark:text-slate-400 mono mt-1">${escapeHtml(ticker)}</p>
      </div>
    </div>
  `
  const field = (label, value, preWrap = false) =>
    `<div class="py-1"><span class="text-slate-500 text-xs block">${escapeHtml(label)}</span><span class="text-slate-700 dark:text-slate-200 ${preWrap ? 'whitespace-pre-wrap' : ''}">${escapeHtml(String(value ?? '-'))}</span></div>`
  html += `
    <div class="mb-4">
      <h4 class="text-slate-600 dark:text-slate-300 font-semibold uppercase text-sm mb-2">Profil</h4>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-0">
        <div>${field('Sektor', p.sector)}</div>
        <div>${field('Industri', p.industry)}</div>
        <div>${field('Papan', p.board)}</div>
        <div>${field('Tanggal Pencatatan', formatDate(p.listingDate))}</div>
        <div class="col-span-2 lg:col-span-4">${field('Kegiatan Usaha', p.businessActivity, true)}</div>
        <div class="col-span-2 lg:col-span-4">${field('Alamat', p.address, true)}</div>
      </div>
    </div>
  `

  const tableSection = (title, headers, rows) => {
    if (!rows.length) return ''
    const th = headers.map((h) => `<th class="px-3 py-1.5 text-left text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase">${h}</th>`).join('')
    const trs = rows.map((r, i) => {
      const bg = i % 2 ? 'bg-slate-50 dark:bg-slate-800/20' : ''
      return `<tr class="border-b border-slate-200 dark:border-slate-700/40 ${bg}"><td class="px-3 py-1.5 text-slate-700 dark:text-slate-200">${r[0]}</td><td class="px-3 py-1.5 text-slate-700 dark:text-slate-200">${r[1]}</td></tr>`
    }).join('')
    return `<div><h4 class="text-slate-600 dark:text-slate-300 font-semibold uppercase text-sm mb-2">${title}</h4><div class="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-600/40"><table class="w-full"><thead><tr class="border-b border-slate-200 dark:border-slate-600/50">${th}</tr></thead><tbody>${trs}</tbody></table></div></div>`
  }

  const dirs = (data.directors ?? []).map((d) => [escapeHtml(d.name), escapeHtml(d.position)])
  const comms = (data.commissioners ?? []).map((c) => [escapeHtml(c.name), escapeHtml(c.position)])
  const shareholders = (data.shareholders ?? []).slice(0, 10).map((s) => [escapeHtml(s.name), `${s.percentage?.toFixed(2) ?? '-'}%`])
  if (dirs.length || comms.length || shareholders.length) {
    html += `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">`
    if (dirs.length) html += tableSection('Direksi', ['Nama', 'Jabatan'], dirs)
    if (comms.length) html += tableSection('Komisaris', ['Nama', 'Jabatan'], comms)
    if (shareholders.length) html += tableSection('Pemegang Saham Utama', ['Nama', '%'], shareholders)
    html += `</div>`
  }

  html += `
    <div class="mb-6">
      <h4 class="text-slate-600 dark:text-slate-300 font-semibold uppercase text-sm mb-3">Peta Relasi Kepemilikan</h4>
      <div class="flex flex-wrap items-center gap-4 mb-3 text-xs text-slate-500 dark:text-slate-400">
        <span class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-orange-500 dark:bg-orange-400"></span>
          Investor
        </span>
        <span class="flex items-center gap-2">
          <span class="w-4 h-2.5 rounded bg-sky-400 dark:bg-sky-400"></span>
          Emiten
        </span>
        <span class="flex items-center gap-2">
          <span class="w-4 h-2.5 rounded bg-emerald-500 dark:bg-emerald-400"></span>
          Emiten utama
        </span>
        <span class="text-slate-400 dark:text-slate-500">• Ukuran ∝ % kepemilikan</span>
        <span class="text-slate-400 dark:text-slate-500">• Scroll untuk zoom</span>
      </div>
      <div id="profileRelationGraph" class="w-full rounded-2xl border border-slate-200 dark:border-slate-600/40 bg-slate-50/50 dark:bg-slate-900/30 overflow-hidden relative" style="height: 560px;">
        <div class="flex items-center justify-center h-full text-slate-500 dark:text-slate-400 text-sm">Memuat grafik...</div>
      </div>
    </div>
  `

  return html || '<p class="text-slate-500">Tidak ada data</p>'
}

async function loadProfileRelationGraph(code) {
  const container = document.getElementById('profileRelationGraph')
  if (!container) return
  try {
    const r = await fetch(`${API}/api/ownership/graph/${encodeURIComponent(code)}`)
    if (!r.ok) throw new Error('Failed to load graph')
    const data = await r.json()
    if (window.location.hash !== `#/profile/${code}`) return
    if (!container.parentElement) return
    if (!data.nodes?.length) {
      container.innerHTML = '<div class="flex items-center justify-center h-full text-slate-500 dark:text-slate-400 text-sm">Tidak ada data kepemilikan KSEI untuk emiten ini</div>'
      return
    }
    renderRelationGraph(container, data, code)
  } catch (err) {
    if (container.parentElement) {
      container.innerHTML = '<div class="flex items-center justify-center h-full text-slate-500 dark:text-slate-400 text-sm">Gagal memuat grafik relasi</div>'
    }
  }
}

function renderRelationGraph(container, data, centerTicker) {
  const isDark = document.documentElement.classList.contains('dark')
  const width = container.clientWidth
  const height = container.clientHeight
  container.innerHTML = ''

  const percentValues = data.nodes
    .filter((n) => n.percent != null && n.percent > 0)
    .map((n) => n.percent)
  const minPct = percentValues.length ? Math.min(...percentValues, 1) : 1
  const maxPct = percentValues.length ? Math.max(...percentValues, 50) : 50
  const radiusScale = d3.scaleSqrt().domain([minPct, maxPct]).range([12, 28])
  const rectScale = d3.scaleSqrt().domain([minPct, maxPct]).range([40, 68])

  const svg = d3.select(container).append('svg').attr('width', width).attr('height', height)
  const g = svg.append('g')
  svg.call(d3.zoom().scaleExtent([0.5, 3]).on('zoom', (e) => g.attr('transform', e.transform)))

  const nodeById = new Map(data.nodes.map((n) => [n.id, { ...n }]))
  const nodes = data.nodes.map((n) => nodeById.get(n.id))
  const links = data.links.map((l) => ({
    source: nodeById.get(l.source) ?? l.source,
    target: nodeById.get(l.target) ?? l.target,
    percent: l.percent
  }))

  const maxRadius = Math.max(28, ...nodes.map((n) => {
    if (n.id === centerTicker) return 24
    return n.type === 'investor' ? radiusScale(n.percent ?? 5) : rectScale(n.percent ?? 5) / 2
  }))
  const simulation = d3
    .forceSimulation(nodes)
    .force('link', d3.forceLink(links).id((d) => d.id).distance(95))
    .force('charge', d3.forceManyBody().strength(-180))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide().radius((d) => maxRadius + 4))

  const linkColor = isDark ? 'rgba(148, 163, 184, 0.5)' : 'rgba(100, 116, 139, 0.5)'
  const linkStrokeScale = d3.scaleSqrt().domain([minPct, maxPct]).range([1, 3.5])
  const link = g
    .append('g')
    .selectAll('line')
    .data(links)
    .join('line')
    .attr('stroke', linkColor)
    .attr('stroke-width', (d) => (d.percent != null ? linkStrokeScale(d.percent) : 1.5))

  const node = g
    .append('g')
    .selectAll('g')
    .data(nodes)
    .join('g')
    .attr('cursor', 'default')
    .call(
      d3
        .drag()
        .on('start', (e, d) => {
          if (!e.active) simulation.alphaTarget(0.3).restart()
          d.fx = d.x
          d.fy = d.y
        })
        .on('drag', (e, d) => {
          d.fx = e.x
          d.fy = e.y
        })
        .on('end', (e, d) => {
          if (!e.active) simulation.alphaTarget(0)
          d.fx = null
          d.fy = null
        })
    )

  node.each(function (d) {
    const el = d3.select(this)
    const isInvestor = d.type === 'investor'
    const isCenter = d.id === centerTicker
    const pct = d.percent ?? 1
    if (isInvestor) {
      const r = radiusScale(pct)
      el.append('circle')
        .attr('r', r)
        .attr('fill', isDark ? '#fb923c' : '#ea580c')
        .attr('stroke', isDark ? '#fdba74' : '#f97316')
        .attr('stroke-width', 1.5)
    } else {
      const w = isCenter ? 64 : Math.max(44, Math.min(72, rectScale(pct)))
      const h = isCenter ? 34 : Math.max(26, Math.min(40, w * 0.55))
      const rect = el
        .append('rect')
        .attr('width', w)
        .attr('height', h)
        .attr('x', -w / 2)
        .attr('y', -h / 2)
        .attr('rx', 6)
        .attr('ry', 6)
        .attr('fill', isDark ? '#7dd3fc' : '#38bdf8')
        .attr('stroke', isDark ? '#0ea5e9' : '#0284c7')
        .attr('stroke-width', 1)
      if (isCenter) rect.attr('fill', isDark ? '#34d399' : '#059669').attr('stroke', isDark ? '#6ee7b7' : '#10b981')
    }
    const label = d.type === 'investor' ? (d.label.length > 32 ? d.label.slice(0, 29) + '...' : d.label) : d.label
    el.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', isInvestor ? (radiusScale(pct) || 18) + 8 : 0)
      .attr('fill', isDark ? '#e2e8f0' : '#1e293b')
      .attr('font-size', isInvestor ? 11 : 13)
      .attr('font-weight', isCenter ? 600 : 400)
      .attr('font-family', 'JetBrains Mono, monospace')
      .text(label)
  })

  const tooltip = d3.select(container).append('div')
    .attr('class', 'graph-tooltip')
    .style('position', 'absolute')
    .style('visibility', 'hidden')
    .style('z-index', '50')
    .style('padding', '12px 16px')
    .style('border-radius', '10px')
    .style('font-size', '13px')
    .style('font-family', 'Plus Jakarta Sans, sans-serif')
    .style('pointer-events', 'none')
    .style('box-shadow', '0 4px 16px rgba(0,0,0,0.2)')
    .style('max-width', '320px')
  const tooltipBg = isDark ? 'rgb(30, 41, 59)' : 'rgb(255, 255, 255)'
  const tooltipBorder = isDark ? 'rgb(71, 85, 105)' : 'rgb(226, 232, 240)'
  tooltip.style('background', tooltipBg).style('border', `1px solid ${tooltipBorder}`)

  const getConnectedWithPercent = (nodeId) => {
    return links
      .filter((l) => (typeof l.source === 'object' ? l.source.id : l.source) === nodeId || (typeof l.target === 'object' ? l.target.id : l.target) === nodeId)
      .map((l) => {
        const other = (typeof l.source === 'object' ? l.source.id : l.source) === nodeId ? l.target : l.source
        return { node: other, percent: l.percent }
      })
      .filter((x) => x.percent != null)
      .sort((a, b) => (b.percent ?? 0) - (a.percent ?? 0))
  }

  const fmtPct = (p) => p.toFixed(2).replace('.', ',')

  node.on('mouseenter', function (e, d) {
    const textColor = isDark ? '#f1f5f9' : '#0f172a'
    const subColor = isDark ? '#94a3b8' : '#64748b'
    const pctColor = isDark ? '#34d399' : '#059669'
    const connected = getConnectedWithPercent(d.id)
    let html = `<div style="font-weight:700;color:${textColor};font-size:14px;margin-bottom:6px">${escapeHtml(d.label)}</div>`
    if (connected.length > 0) {
      const subtitle = d.id === centerTicker ? 'INVESTOR' : d.type === 'investor' ? 'EMITEN' : 'INVESTOR'
      html += `<div style="font-size:10px;color:${subColor};text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px">${subtitle}</div>`
      html += connected.map((c) => {
        const label = typeof c.node === 'object' ? c.node.label : String(c.node).replace(/^inv:/, '')
        return `<div style="display:flex;justify-content:space-between;gap:16px;margin-top:4px;font-size:12px"><span style="color:${textColor}">${escapeHtml(label)}</span><span style="color:${pctColor};font-weight:600">${fmtPct(c.percent)}%</span></div>`
      }).join('')
    } else if (d.percent != null) {
      html += `<div style="color:${pctColor};margin-top:4px;font-size:12px">${fmtPct(d.percent)}% kepemilikan</div>`
    }
    tooltip.style('visibility', 'visible').html(html)
  })
  node.on('mousemove', function (e) {
    const rect = container.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const offset = 14
    let left = x + offset
    let top = y + offset
    if (left + 280 > rect.width) left = x - 280 - offset
    if (top + 120 > rect.height) top = y - 120 - offset
    tooltip.style('left', `${left}px`).style('top', `${top}px`)
  })
  node.on('mouseleave', () => tooltip.style('visibility', 'hidden'))

  simulation.on('tick', () => {
    link
      .attr('x1', (d) => d.source.x)
      .attr('y1', (d) => d.source.y)
      .attr('x2', (d) => d.target.x)
      .attr('y2', (d) => d.target.y)
    node.attr('transform', (d) => `translate(${d.x},${d.y})`)
  })

  node.on('click', (e, d) => {
    if (d.type === 'ticker' && d.id !== centerTicker) {
      window.location.hash = `#/profile/${d.id}`
    }
  })
  node.filter((d) => d.type === 'ticker' && d.id !== centerTicker).attr('cursor', 'pointer')
}

function initNav() {
  document.getElementById('openFloatBtn')?.addEventListener('click', (e) => {
    e.preventDefault()
    document.getElementById('floatSection').classList.remove('hidden')
    document.getElementById('floatSection').scrollIntoView()
    document.querySelector('.float-btn[data-min="0"][data-max="5"]')?.click()
  })
}

let searchDebounce = null
const searchInput = document.getElementById('searchInput')
const searchSuggestions = document.getElementById('searchSuggestions')
const resultSection = document.getElementById('resultSection')
const resultTitle = document.getElementById('resultTitle')
const resultTable = document.getElementById('resultTable')
const clearBtn = document.getElementById('clearBtn')
const floatTable = document.getElementById('floatTable')

function initSearch() {
  searchInput?.addEventListener('input', () => {
    clearTimeout(searchDebounce)
    const q = searchInput.value.trim()
    if (q.length < 2) { searchSuggestions?.classList.add('hidden'); return }
    searchDebounce = setTimeout(() => fetchSuggestions(q), 200)
  })
  searchInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const q = searchInput.value.trim()
      if (q) runSearch(q)
      searchSuggestions?.classList.add('hidden')
    }
  })
  document.addEventListener('click', (e) => {
    if (!searchSuggestions?.contains(e.target) && e.target !== searchInput) searchSuggestions?.classList.add('hidden')
  })
  clearBtn?.addEventListener('click', () => {
    searchInput.value = ''
    resultSection?.classList.add('hidden')
    searchInput?.focus()
  })
}

async function fetchSuggestions(q) {
  try {
    const [tickers, investors] = await Promise.all([
      fetch(`${API}/api/ownership/search/ticker?q=${encodeURIComponent(q)}&limit=5`).then(r => r.json()),
      fetch(`${API}/api/ownership/search/investor?q=${encodeURIComponent(q)}&limit=5`).then(r => r.json())
    ])
    let html = ''
    if (tickers.length) {
      html += '<div class="px-4 py-2 text-slate-500 text-xs font-medium">Ticker</div>'
      tickers.forEach(t => {
        html += `<button type="button" class="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-900 dark:text-white block" data-type="ticker" data-code="${escapeHtml(t.code)}">${escapeHtml(t.code)} — ${escapeHtml(t.emiten)}</button>`
      })
    }
    if (investors.length) {
      html += '<div class="px-4 py-2 text-slate-500 text-xs font-medium border-t border-slate-200 dark:border-slate-600/50">Investor</div>'
      investors.forEach(inv => {
        html += `<button type="button" class="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-900 dark:text-white block" data-type="investor" data-name="${escapeHtml(inv)}">${escapeHtml(inv)}</button>`
      })
    }
    if (!html) { searchSuggestions?.classList.add('hidden'); return }
    searchSuggestions.innerHTML = html
    searchSuggestions.classList.remove('hidden')
    searchSuggestions.classList.add('animate-slide-down')
    searchSuggestions.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.dataset.type === 'ticker') runSearch(btn.dataset.code, 'ticker')
        else runSearch(btn.dataset.name, 'investor')
        searchSuggestions.classList.add('hidden')
      })
    })
  } catch (err) {
    searchSuggestions?.classList.add('hidden')
  }
}

function sortResultData(data, col, dir) {
  const arr = [...data]
  const mult = dir === 'asc' ? 1 : -1
  arr.sort((a, b) => {
    let va, vb
    if (resultType === 'ticker') {
      if (col === 0) { va = (a.investor || '').toLowerCase(); vb = (b.investor || '').toLowerCase() }
      else if (col === 1) { va = (a.localForeign || ''); vb = (b.localForeign || '') }
      else if (col === 2) { va = a.shares ?? 0; vb = b.shares ?? 0 }
      else { va = a.percent ?? 0; vb = b.percent ?? 0 }
    } else {
      if (col === 0) { va = (a.code || '').toLowerCase(); vb = (b.code || '').toLowerCase() }
      else if (col === 1) { va = (a.emiten || '').toLowerCase(); vb = (b.emiten || '').toLowerCase() }
      else if (col === 2) { va = (a.localForeign || ''); vb = (b.localForeign || '') }
      else { va = a.percent ?? 0; vb = b.percent ?? 0 }
    }
    if (typeof va === 'number' && typeof vb === 'number') return mult * (va - vb)
    return mult * String(va).localeCompare(String(vb))
  })
  return arr
}

function sortFloatData(data, col, dir) {
  const arr = [...data]
  const mult = dir === 'asc' ? 1 : -1
  arr.sort((a, b) => {
    let va, vb
    if (col === 0) { va = (a.code || '').toLowerCase(); vb = (b.code || '').toLowerCase() }
    else if (col === 1) { va = (a.emiten || '').toLowerCase(); vb = (b.emiten || '').toLowerCase() }
    else if (col === 2) { va = (a.topHolder || '').toLowerCase(); vb = (b.topHolder || '').toLowerCase() }
    else if (col === 3) { va = a.totalHeldPercent ?? 0; vb = b.totalHeldPercent ?? 0 }
    else { va = a.freeFloatPercent ?? (100 - (a.totalHeldPercent ?? 0)); vb = b.freeFloatPercent ?? (100 - (b.totalHeldPercent ?? 0)) }
    if (typeof va === 'number' && typeof vb === 'number') return mult * (va - vb)
    return mult * String(va).localeCompare(String(vb))
  })
  return arr
}

function renderResultTable() {
  if (!resultData.length) {
    resultTable.innerHTML = '<p class="p-6 text-slate-500 text-center">Tidak ada data</p>'
    return
  }
  const sorted = sortResultData(resultData, resultSort.col, resultSort.dir)
  const totalPages = Math.ceil(sorted.length / RESULT_PAGE_SIZE)
  const start = (resultPage - 1) * RESULT_PAGE_SIZE
  const chunk = sorted.slice(start, start + RESULT_PAGE_SIZE)
  const headers = resultType === 'ticker'
    ? ['Investor', 'L/F', 'Lembar', '%']
    : ['Ticker', 'Emiten', 'L/F', '%']
  const sortIcon = (i) => {
    if (resultSort.col !== i) return ' <span class="text-slate-600">↕</span>'
    return resultSort.dir === 'asc' ? ' <span class="text-emerald-400">↑</span>' : ' <span class="text-emerald-400">↓</span>'
  }
  let table = `<table class="w-full"><thead><tr class="border-b border-slate-200 dark:border-slate-600/50">${headers.map((h, i) => `<th class="sort-col px-4 py-3 text-left text-slate-500 dark:text-slate-400 font-medium cursor-pointer hover:text-slate-900 dark:hover:text-white select-none" data-col="${i}">${h}${sortIcon(i)}</th>`).join('')}</tr></thead><tbody>`
  chunk.forEach((row, i) => {
    const tr = i % 2 ? 'bg-slate-50 dark:bg-slate-800/20' : ''
    if (resultType === 'ticker') {
      table += `<tr class="border-b border-slate-200 dark:border-slate-700/40 ${tr} hover:bg-slate-100 dark:hover:bg-slate-700/30 transition-colors duration-150"><td class="px-4 py-3 text-slate-700 dark:text-slate-200">${escapeHtml(row.investor)}</td><td class="px-4 py-3">${row.localForeign}</td><td class="px-4 py-3 mono text-slate-500 dark:text-slate-400">${formatNum(row.shares)}</td><td class="px-4 py-3 font-medium">${row.percent.toFixed(2)}%</td></tr>`
    } else {
      table += `<tr class="border-b border-slate-200 dark:border-slate-700/40 ${tr} hover:bg-slate-100 dark:hover:bg-slate-700/30 transition-colors duration-150"><td class="px-4 py-3 mono font-medium">${tickerLink(row.code)}</td><td class="px-4 py-3 text-slate-700 dark:text-slate-200">${escapeHtml(row.emiten)}</td><td class="px-4 py-3">${row.localForeign}</td><td class="px-4 py-3 font-medium">${row.percent.toFixed(2)}%</td></tr>`
    }
  })
  table += '</tbody></table>'
  const paginationHtml = `
    <div class="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-600/40 bg-slate-50 dark:bg-slate-800/20 rounded-b-2xl">
      <span class="text-slate-500 text-xs">${start + 1}-${start + chunk.length} of ${sorted.length}</span>
      <div class="flex gap-1">
        <button class="result-prev px-2 py-1 rounded text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700/50 text-xs disabled:opacity-40" ${resultPage <= 1 ? 'disabled' : ''}>←</button>
        <span class="px-2 py-1 text-slate-500 text-xs">${resultPage}/${totalPages}</span>
        <button class="result-next px-2 py-1 rounded text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700/50 text-xs disabled:opacity-40" ${resultPage >= totalPages ? 'disabled' : ''}>→</button>
      </div>
    </div>
  `
  resultTable.innerHTML = table + paginationHtml
  resultTable.querySelector('.result-prev')?.addEventListener('click', () => { resultPage = Math.max(1, resultPage - 1); renderResultTable() })
  resultTable.querySelector('.result-next')?.addEventListener('click', () => { resultPage = Math.min(totalPages, resultPage + 1); renderResultTable() })
  resultTable.querySelectorAll('.sort-col').forEach(th => {
    th.addEventListener('click', () => {
      const col = parseInt(th.dataset.col, 10)
      resultSort = { col, dir: resultSort.col === col && resultSort.dir === 'desc' ? 'asc' : 'desc' }
      resultPage = 1
      renderResultTable()
    })
  })
}

async function runSearch(q, type) {
  if (!type) {
    const codeMatch = q.match(/^[A-Z]{2,5}$/i)
    type = codeMatch ? 'ticker' : 'investor'
  }
  searchInput.value = q
  resultSection?.classList.remove('hidden')
  resultTitle.innerHTML = type === 'ticker' ? `Pemegang saham: ${tickerLink(q.toUpperCase())}` : `Portfolio: ${escapeHtml(q)}`
  resultTable.innerHTML = '<p class="p-6 text-slate-400 text-center">Loading...</p>'
  try {
    const url = type === 'ticker'
      ? `${API}/api/ownership/ticker/${encodeURIComponent(q.toUpperCase())}`
      : `${API}/api/ownership/investor/${encodeURIComponent(q)}`
    const data = await fetch(url).then(r => r.json())
    resultData = data
    resultType = type
    resultPage = 1
    resultSort = { col: 3, dir: 'desc' }
    renderResultTable()
    resultSection?.scrollIntoView({ behavior: 'smooth' })
  } catch (err) {
    resultTable.innerHTML = '<p class="p-6 text-red-400 text-center">Error loading data</p>'
  }
}

function renderFloatTable() {
  if (!floatData.length) {
    floatTable.innerHTML = '<p class="p-6 text-slate-500 text-center">Tidak ada data dalam range ini</p>'
    return
  }
  const sorted = sortFloatData(floatData, floatSort.col, floatSort.dir)
  const totalPages = Math.ceil(sorted.length / FLOAT_PAGE_SIZE)
  const start = (floatPage - 1) * FLOAT_PAGE_SIZE
  const chunk = sorted.slice(start, start + FLOAT_PAGE_SIZE)
  const headers = ['Ticker', 'Emiten', 'Top Holder', 'Total Held', 'Est. Free Float']
  const sortIcon = (i) => {
    if (floatSort.col !== i) return ' <span class="text-slate-600">↕</span>'
    return floatSort.dir === 'asc' ? ' <span class="text-emerald-400">↑</span>' : ' <span class="text-emerald-400">↓</span>'
  }
  let table = `<table class="w-full"><thead><tr class="border-b border-slate-200 dark:border-slate-600/50">${headers.map((h, i) => `<th class="float-sort-col px-4 py-3 text-left text-slate-500 dark:text-slate-400 font-medium cursor-pointer hover:text-slate-900 dark:hover:text-white select-none" data-col="${i}">${h}${sortIcon(i)}</th>`).join('')}</tr></thead><tbody>`
  chunk.forEach((row, i) => {
    const tr = i % 2 ? 'bg-slate-50 dark:bg-slate-800/20' : ''
    const ff = row.freeFloatPercent ?? (100 - (row.totalHeldPercent ?? 0))
    const warn = ff < 5 ? ' text-amber-400' : ''
    table += `<tr class="border-b border-slate-200 dark:border-slate-700/40 ${tr} hover:bg-slate-100 dark:hover:bg-slate-700/30 transition-colors duration-150"><td class="px-4 py-3 mono font-medium">${tickerLink(row.code)}</td><td class="px-4 py-3 text-slate-700 dark:text-slate-200">${escapeHtml(row.emiten)}</td><td class="px-4 py-3 text-slate-500 dark:text-slate-400">${escapeHtml(row.topHolder || '-')}</td><td class="px-4 py-3">${(row.totalHeldPercent ?? 0).toFixed(1)}%</td><td class="px-4 py-3 font-medium${warn}">${ff.toFixed(1)}%</td></tr>`
  })
  table += '</tbody></table>'
  const paginationHtml = `
    <div class="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-600/40 bg-slate-50 dark:bg-slate-800/20 rounded-b-2xl">
      <span class="text-slate-500 text-xs">${start + 1}-${start + chunk.length} of ${sorted.length}</span>
      <div class="flex gap-1">
        <button class="float-prev px-2 py-1 rounded text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700/50 text-xs disabled:opacity-40" ${floatPage <= 1 ? 'disabled' : ''}>←</button>
        <span class="px-2 py-1 text-slate-500 text-xs">${floatPage}/${totalPages}</span>
        <button class="float-next px-2 py-1 rounded text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700/50 text-xs disabled:opacity-40" ${floatPage >= totalPages ? 'disabled' : ''}>→</button>
      </div>
    </div>
  `
  floatTable.innerHTML = table + paginationHtml
  floatTable.querySelector('.float-prev')?.addEventListener('click', () => { floatPage = Math.max(1, floatPage - 1); renderFloatTable() })
  floatTable.querySelector('.float-next')?.addEventListener('click', () => { floatPage = Math.min(totalPages, floatPage + 1); renderFloatTable() })
  floatTable.querySelectorAll('.float-sort-col').forEach(th => {
    th.addEventListener('click', () => {
      const col = parseInt(th.dataset.col, 10)
      floatSort = { col, dir: floatSort.col === col && floatSort.dir === 'desc' ? 'asc' : 'desc' }
      floatPage = 1
      renderFloatTable()
    })
  })
}

function initFloatScreener() {
  document.querySelectorAll('.float-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const min = parseFloat(btn.dataset.min)
      const max = parseFloat(btn.dataset.max)
      document.querySelectorAll('.float-btn').forEach(b => b.classList.remove('ring-2', 'ring-emerald-500'))
      btn.classList.add('ring-2', 'ring-emerald-500')
      floatTable.innerHTML = '<p class="p-6 text-slate-400 text-center">Loading...</p>'
      try {
        const data = await fetch(`${API}/api/ownership/float?min=${min}&max=${max}`).then(r => r.json())
        floatData = data
        floatPage = 1
        floatSort = { col: 4, dir: 'asc' }
        renderFloatTable()
      } catch (err) {
        floatTable.innerHTML = '<p class="p-6 text-red-400 text-center">Error loading data</p>'
      }
    })
  })
}

function escapeHtml(s) {
  if (!s) return ''
  const div = document.createElement('div')
  div.textContent = s
  return div.innerHTML
}

function tickerLink(code) {
  if (!code) return '-'
  const c = String(code).toUpperCase()
  return `<a href="#/profile/${escapeHtml(c)}" class="ticker-link text-emerald-400 hover:text-emerald-300 transition-colors underline decoration-emerald-500/30 hover:decoration-emerald-400" title="Lihat profil" onclick="event.stopPropagation()">${escapeHtml(c)}</a>`
}

function formatNum(n) {
  if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B'
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M'
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K'
  return String(n)
}
