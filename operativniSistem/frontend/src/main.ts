import './style.css'

type PropertyType = 'Stanovanje' | 'Hiša' | 'Vikend' | 'Poslovni prostor'
type ListingKind = 'Prodaja' | 'Oddaja'
type Property = { id: number; title: string; location: string; region: string; price: number; area: number; rooms: number; year: number; type: PropertyType; listingKind: ListingKind; description: string; image: string; featured: boolean; createdAt: string }

const seedProperties: Property[] = [
  { id: 1, title: 'Svetlo stanovanje v Šiški', location: 'Ljubljana, Šiška', region: 'Ljubljana', price: 289000, area: 68, rooms: 3, year: 2018, type: 'Stanovanje', listingKind: 'Prodaja', description: 'Sodobno in svetlo trisobno stanovanje z veliko teraso, dvigalom in lastnim parkirnim mestom. Mirna lokacija z odlično povezavo do središča mesta.', image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=85', featured: true, createdAt: '2026-10-12' },
  { id: 2, title: 'Družinska hiša pod Pohorjem', location: 'Maribor, Radvanje', region: 'Podravska', price: 385000, area: 184, rooms: 5, year: 2012, type: 'Hiša', listingKind: 'Prodaja', description: 'Prostorna družinska hiša z urejenim vrtom, garažo za dva avtomobila in odprtim pogledom proti Pohorju.', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85', featured: true, createdAt: '2026-10-09' },
  { id: 3, title: 'Apartma s pogledom na morje', location: 'Piran, Punta', region: 'Obalno-kraška', price: 1250, area: 52, rooms: 2, year: 2006, type: 'Stanovanje', listingKind: 'Oddaja', description: 'Popolnoma opremljen apartma v starem mestnem jedru, le nekaj korakov od morja. Na voljo za dolgoročni najem.', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=85', featured: false, createdAt: '2026-10-08' },
  { id: 4, title: 'Leseni vikend ob jezeru', location: 'Bohinj, Ribčev Laz', region: 'Gorenjska', price: 248000, area: 76, rooms: 3, year: 1998, type: 'Vikend', listingKind: 'Prodaja', description: 'Prijeten lesen vikend na robu gozda z razgledom na gore. Jezero je oddaljeno deset minut hoje.', image: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1400&q=85', featured: false, createdAt: '2026-10-04' },
  { id: 5, title: 'Prenovljena meščanska garsonjera', location: 'Celje, Center', region: 'Savinjska', price: 590, area: 34, rooms: 1, year: 1974, type: 'Stanovanje', listingKind: 'Oddaja', description: 'Elegantno prenovljena garsonjera v neposredni bližini mestnega jedra. Stroški so nizki, vselitev je možna takoj.', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=85', featured: false, createdAt: '2026-09-28' },
  { id: 6, title: 'Moderna pisarna ob obvoznici', location: 'Ljubljana, Rudnik', region: 'Ljubljana', price: 2100, area: 126, rooms: 4, year: 2021, type: 'Poslovni prostor', listingKind: 'Oddaja', description: 'Svetel poslovni prostor z recepcijo, tremi pisarnami in sejno sobo. V ceno so vključena štiri parkirna mesta.', image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=85', featured: false, createdAt: '2026-09-22' },
]

const storageKey = 'domio-properties-v1'
const favoriteKey = 'domio-favorites-v1'
let properties = loadProperties()
let favorites = new Set<number>(JSON.parse(localStorage.getItem(favoriteKey) || '[]'))
let currentKind: 'Vse' | ListingKind = 'Vse'
let visibleCount = 6

const icons = {
  logo: '<svg viewBox="0 0 36 36" aria-hidden="true"><path d="M6 17.5 18 7l12 10.5v12a2 2 0 0 1-2 2h-7v-9h-6v9H8a2 2 0 0 1-2-2v-12Z"/><path d="m11 12 7-6 7 6v-5H11v5Z"/></svg>',
  search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>',
  pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  area: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v16H4zM4 9h4V4M20 15h-4v5"/></svg>',
  bed: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 19v-8m18 8v-6a2 2 0 0 0-2-2H9a3 3 0 0 0-3 3v2m0-5V8a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3M3 16h18"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2Zm2-2v4m10-4v4M3 9h18"/></svg>',
  heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/></svg>',
  plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>',
  edit: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 5 5 5M4 20l3.5-.7L20 6.8 17.2 4 4.7 16.5 4 20Z"/></svg>',
  trash: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 3h6l1 4H8l1-4Zm-3 4 1 14h10l1-14M10 11v6m4-6v6"/></svg>',
}

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <header class="site-header">
    <a class="brand" href="#" aria-label="Domio domov">${icons.logo}<span>domio<span class="brand-dot">.</span></span></a>
    <nav aria-label="Glavna navigacija"><a class="active" href="#ponudba">Ponudba</a><a href="#kako-deluje">Kako deluje</a><a href="#kontakt">Kontakt</a></nav>
    <button class="button button-primary header-add" data-action="new">${icons.plus} Objavi nepremičnino</button>
    <button class="menu-button" aria-label="Meni">☰</button>
  </header>
  <main>
    <section class="hero-section">
      <div class="hero-content">
        <p class="eyebrow"><span></span> Prostor za vaš naslednji korak</p>
        <h1>Najdite dom,<br><em>ki vam pripada.</em></h1>
        <p class="hero-copy">Preverjene nepremičnine na najlepših lokacijah po Sloveniji. Brez zapletov, pregledno in po vaše.</p>
        <form class="hero-search" id="hero-search">
          <div class="search-field">${icons.search}<label for="hero-location">Lokacija</label><input id="hero-location" name="location" placeholder="Kraj ali regija"></div>
          <div class="search-field"><span class="field-symbol">⌂</span><label for="hero-type">Vrsta</label><select id="hero-type" name="type"><option value="">Vse nepremičnine</option><option>Stanovanje</option><option>Hiša</option><option>Vikend</option><option>Poslovni prostor</option></select></div>
          <button class="button button-dark" type="submit">${icons.search}<span>Poišči</span></button>
        </form>
        <div class="hero-stats"><div><strong id="stat-count">0</strong><span>aktivnih oglasov</span></div><div><strong>12</strong><span>slovenskih regij</span></div><div><strong>4.9</strong><span>povprečna ocena</span></div></div>
      </div>
      <div class="hero-image" role="img" aria-label="Sodobna hiša v naravi"><div class="hero-badge"><span class="badge-icon">✓</span><div><strong>Preverjeni oglasi</strong><small>Vsak oglas ročno pregledamo</small></div></div></div>
    </section>
    <section class="listing-section" id="ponudba">
      <div class="section-heading"><div><p class="eyebrow"><span></span> Sveže na trgu</p><h2>Izbrane nepremičnine</h2></div><button class="text-link" id="show-all">Prikaži vse <span>→</span></button></div>
      <div class="toolbar">
        <div class="tabs" role="tablist"><button class="tab active" data-kind="Vse">Vse</button><button class="tab" data-kind="Prodaja">Naprodaj</button><button class="tab" data-kind="Oddaja">Za najem</button></div>
        <div class="filters"><label class="compact-search">${icons.search}<input id="list-search" placeholder="Išči oglase ..."></label><select id="region-filter" aria-label="Regija"><option value="">Vse regije</option></select><select id="sort-filter" aria-label="Razvrščanje"><option value="newest">Najnovejše</option><option value="price-asc">Cena: nižja najprej</option><option value="price-desc">Cena: višja najprej</option><option value="area-desc">Največja površina</option></select></div>
      </div>
      <div class="property-grid" id="property-grid"></div>
      <div class="empty-state" id="empty-state" hidden><div>⌂</div><h3>Ni zadetkov</h3><p>Poskusite spremeniti iskalni izraz ali filtre.</p><button class="button button-outline" id="clear-filters">Ponastavi filtre</button></div>
      <button class="button button-outline load-more" id="load-more">Prikaži več oglasov</button>
    </section>
    <section class="steps-section" id="kako-deluje"><div><p class="eyebrow light"><span></span> Enostavno do novega doma</p><h2>Od iskanja do ključa.</h2></div><div class="steps"><article><b>01</b><h3>Odkrijte</h3><p>Prebrskajte preverjene oglase in poiščite prostor po svoji meri.</p></article><article><b>02</b><h3>Dogovorite se</h3><p>Stopite v stik z oglaševalcem in se dogovorite za ogled.</p></article><article><b>03</b><h3>Vselite se</h3><p>Uredite podrobnosti, prevzemite ključe in začnite novo poglavje.</p></article></div></section>
  </main>
  <footer id="kontakt"><a class="brand brand-footer" href="#">${icons.logo}<span>domio<span class="brand-dot">.</span></span></a><p>Vaš prostor. Vaša zgodba.</p><small>© 2026 Domio. Študijski projekt.</small></footer>
  <div class="modal" id="property-modal" aria-hidden="true"><div class="modal-backdrop" data-action="close-modal"></div><div class="modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button class="icon-button modal-close" data-action="close-modal" aria-label="Zapri">${icons.close}</button><p class="eyebrow"><span></span> Urejanje oglasa</p><h2 id="modal-title">Dodaj nepremičnino</h2><form id="property-form"><input type="hidden" name="id"><div class="form-grid"><label class="full">Naslov oglasa<input name="title" required placeholder="npr. Svetlo stanovanje v centru"></label><label>Vrsta oglasa<select name="listingKind" required><option>Prodaja</option><option>Oddaja</option></select></label><label>Vrsta nepremičnine<select name="type" required><option>Stanovanje</option><option>Hiša</option><option>Vikend</option><option>Poslovni prostor</option></select></label><label>Lokacija<input name="location" required placeholder="Ljubljana, Center"></label><label>Regija<input name="region" required placeholder="Ljubljana"></label><label>Cena (€)<input name="price" type="number" min="1" required placeholder="250000"></label><label>Površina (m²)<input name="area" type="number" min="1" required placeholder="75"></label><label>Število sob<input name="rooms" type="number" min="1" step="0.5" required placeholder="3"></label><label>Leto izgradnje<input name="year" type="number" min="1500" max="2030" required placeholder="2020"></label><label class="full">URL slike<input name="image" type="url" required placeholder="https://..."></label><label class="full">Opis<textarea name="description" rows="4" required placeholder="Opišite nepremičnino ..."></textarea></label></div><div class="form-actions"><button type="button" class="button button-ghost" data-action="close-modal">Prekliči</button><button type="submit" class="button button-primary">Shrani oglas</button></div></form></div></div>
  <div class="modal" id="detail-modal" aria-hidden="true"><div class="modal-backdrop" data-action="close-details"></div><div class="detail-panel" id="detail-content"></div></div>
  <div class="toast" id="toast" role="status"></div>
`

function loadProperties(): Property[] { try { const saved = localStorage.getItem(storageKey); return saved ? JSON.parse(saved) : [...seedProperties] } catch { return [...seedProperties] } }
function saveProperties() { localStorage.setItem(storageKey, JSON.stringify(properties)) }
function formatPrice(property: Property) { const price = new Intl.NumberFormat('sl-SI').format(property.price); return property.listingKind === 'Oddaja' ? `${price} € <small>/ mesec</small>` : `${price} €` }
function escapeHtml(value: string) { return value.replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]!) }
function renderRegions() { const select = document.querySelector<HTMLSelectElement>('#region-filter')!; const selected = select.value; const regions = [...new Set(properties.map(property => property.region))].sort(); select.innerHTML = '<option value="">Vse regije</option>' + regions.map(region => `<option ${region === selected ? 'selected' : ''}>${escapeHtml(region)}</option>`).join('') }

function getFilteredProperties() {
  const query = document.querySelector<HTMLInputElement>('#list-search')!.value.trim().toLocaleLowerCase('sl')
  const region = document.querySelector<HTMLSelectElement>('#region-filter')!.value
  const sort = document.querySelector<HTMLSelectElement>('#sort-filter')!.value
  const terms = query.split(/\s+/).filter(Boolean)
  const filtered = properties.filter(property => {
    const searchable = `${property.title} ${property.location} ${property.region} ${property.type}`.toLocaleLowerCase('sl')
    return (currentKind === 'Vse' || property.listingKind === currentKind) && terms.every(term => searchable.includes(term)) && (!region || property.region === region)
  })
  filtered.sort((a, b) => sort === 'price-asc' ? a.price - b.price : sort === 'price-desc' ? b.price - a.price : sort === 'area-desc' ? b.area - a.area : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  return filtered
}

function renderProperties() {
  const filtered = getFilteredProperties(), visible = filtered.slice(0, visibleCount)
  document.querySelector<HTMLDivElement>('#property-grid')!.innerHTML = visible.map(property => `<article class="property-card" data-id="${property.id}"><div class="card-image"><img src="${escapeHtml(property.image)}" alt="${escapeHtml(property.title)}" loading="lazy"><span class="listing-badge ${property.listingKind === 'Oddaja' ? 'rent' : ''}">${property.listingKind === 'Prodaja' ? 'Naprodaj' : 'Za najem'}</span><button class="favorite ${favorites.has(property.id) ? 'selected' : ''}" data-action="favorite" aria-label="Priljubljeno">${icons.heart}</button><div class="card-admin"><button data-action="edit" aria-label="Uredi">${icons.edit}</button><button data-action="delete" aria-label="Izbriši">${icons.trash}</button></div></div><div class="card-content"><p class="card-location">${icons.pin}${escapeHtml(property.location)}</p><h3>${escapeHtml(property.title)}</h3><p class="price">${formatPrice(property)}</p><div class="card-meta"><span>${icons.area}<b>${property.area}</b> m²</span><span>${icons.bed}<b>${property.rooms}</b> ${property.rooms === 1 ? 'soba' : 'sobe'}</span><span>${icons.calendar}<b>${property.year}</b></span></div><button class="card-link" data-action="details">Poglej podrobnosti <span>→</span></button></div></article>`).join('')
  document.querySelector<HTMLElement>('#empty-state')!.hidden = filtered.length > 0
  document.querySelector<HTMLButtonElement>('#load-more')!.hidden = visible.length >= filtered.length || filtered.length === 0
  document.querySelector<HTMLElement>('#stat-count')!.textContent = String(properties.length)
}

function openForm(property?: Property) {
  const modal = document.querySelector<HTMLElement>('#property-modal')!, form = document.querySelector<HTMLFormElement>('#property-form')!
  form.reset(); document.querySelector<HTMLElement>('#modal-title')!.textContent = property ? 'Uredi nepremičnino' : 'Dodaj nepremičnino'
  if (property) Object.entries(property).forEach(([key, value]) => { const field = form.elements.namedItem(key) as HTMLInputElement | null; if (field) field.value = String(value) })
  modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); document.body.classList.add('no-scroll'); window.setTimeout(() => form.querySelector<HTMLInputElement>('input[name="title"]')?.focus(), 100)
}
function closeModal(id: string) { const modal = document.querySelector<HTMLElement>(id)!; modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); if (!document.querySelector('.modal.open')) document.body.classList.remove('no-scroll') }
function showDetails(property: Property) {
  document.querySelector<HTMLDivElement>('#detail-content')!.innerHTML = `<button class="icon-button detail-close" data-action="close-details" aria-label="Zapri">${icons.close}</button><img class="detail-image" src="${escapeHtml(property.image)}" alt="${escapeHtml(property.title)}"><div class="detail-body"><span class="listing-badge inline">${property.listingKind === 'Prodaja' ? 'Naprodaj' : 'Za najem'}</span><p class="card-location">${icons.pin}${escapeHtml(property.location)}</p><h2>${escapeHtml(property.title)}</h2><p class="price detail-price">${formatPrice(property)}</p><div class="detail-meta"><span>${icons.area}<b>${property.area} m²</b></span><span>${icons.bed}<b>${property.rooms} sobe</b></span><span>${icons.calendar}<b>Letnik ${property.year}</b></span></div><p class="detail-description">${escapeHtml(property.description)}</p><div class="detail-actions"><button class="button button-outline" data-action="edit" data-id="${property.id}">${icons.edit} Uredi</button><a class="button button-primary" href="mailto:info@domio.si?subject=${encodeURIComponent(property.title)}">Pošlji povpraševanje</a></div></div>`
  const modal = document.querySelector<HTMLElement>('#detail-modal')!; modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); document.body.classList.add('no-scroll')
}
function showToast(message: string) { const toast = document.querySelector<HTMLElement>('#toast')!; toast.textContent = message; toast.classList.add('show'); window.setTimeout(() => toast.classList.remove('show'), 2600) }

document.addEventListener('click', event => {
  const target = (event.target as HTMLElement).closest<HTMLElement>('[data-action]'); if (!target) return
  const action = target.dataset.action, card = target.closest<HTMLElement>('[data-id]'), id = Number(target.dataset.id || card?.dataset.id), property = properties.find(item => item.id === id)
  if (action === 'new') openForm()
  if (action === 'close-modal') closeModal('#property-modal')
  if (action === 'close-details') closeModal('#detail-modal')
  if (action === 'details' && property) showDetails(property)
  if (action === 'edit' && property) { closeModal('#detail-modal'); openForm(property) }
  if (action === 'delete' && property && confirm(`Ali želite izbrisati oglas »${property.title}«?`)) { properties = properties.filter(item => item.id !== id); saveProperties(); renderRegions(); renderProperties(); showToast('Oglas je bil izbrisan.') }
  if (action === 'favorite' && property) { favorites.has(id) ? favorites.delete(id) : favorites.add(id); localStorage.setItem(favoriteKey, JSON.stringify([...favorites])); renderProperties() }
})

document.querySelector<HTMLFormElement>('#property-form')!.addEventListener('submit', event => {
  event.preventDefault(); const form = event.currentTarget as HTMLFormElement, data = new FormData(form), id = Number(data.get('id'))
  const property: Property = { id: id || Date.now(), title: String(data.get('title')), location: String(data.get('location')), region: String(data.get('region')), price: Number(data.get('price')), area: Number(data.get('area')), rooms: Number(data.get('rooms')), year: Number(data.get('year')), type: data.get('type') as PropertyType, listingKind: data.get('listingKind') as ListingKind, image: String(data.get('image')), description: String(data.get('description')), featured: false, createdAt: id ? properties.find(item => item.id === id)?.createdAt || new Date().toISOString() : new Date().toISOString() }
  const index = properties.findIndex(item => item.id === id); if (index >= 0) properties[index] = property; else properties.unshift(property)
  saveProperties(); renderRegions(); renderProperties(); closeModal('#property-modal'); showToast(index >= 0 ? 'Spremembe so shranjene.' : 'Nepremičnina je objavljena.')
})

document.querySelectorAll<HTMLButtonElement>('.tab').forEach(tab => tab.addEventListener('click', () => { document.querySelectorAll('.tab').forEach(item => item.classList.remove('active')); tab.classList.add('active'); currentKind = tab.dataset.kind as typeof currentKind; visibleCount = 6; renderProperties() }))
document.querySelector<HTMLFormElement>('#hero-search')!.addEventListener('submit', event => { event.preventDefault(); const data = new FormData(event.currentTarget as HTMLFormElement); const place = String(data.get('location') || ''), type = String(data.get('type') || ''); document.querySelector<HTMLInputElement>('#list-search')!.value = `${place} ${type}`.trim(); document.querySelector('#ponudba')?.scrollIntoView({ behavior: 'smooth' }); renderProperties() })
document.querySelector<HTMLInputElement>('#list-search')!.addEventListener('input', () => { visibleCount = 6; renderProperties() })
document.querySelector<HTMLSelectElement>('#region-filter')!.addEventListener('change', () => { visibleCount = 6; renderProperties() })
document.querySelector<HTMLSelectElement>('#sort-filter')!.addEventListener('change', renderProperties)
document.querySelector<HTMLButtonElement>('#load-more')!.addEventListener('click', () => { visibleCount += 6; renderProperties() })
document.querySelector<HTMLButtonElement>('#show-all')!.addEventListener('click', () => { currentKind = 'Vse'; visibleCount = properties.length; document.querySelectorAll('.tab').forEach((tab, index) => tab.classList.toggle('active', index === 0)); renderProperties() })
document.querySelector<HTMLButtonElement>('#clear-filters')!.addEventListener('click', () => { document.querySelector<HTMLInputElement>('#list-search')!.value = ''; document.querySelector<HTMLSelectElement>('#region-filter')!.value = ''; currentKind = 'Vse'; document.querySelectorAll('.tab').forEach((tab, index) => tab.classList.toggle('active', index === 0)); renderProperties() })
document.addEventListener('keydown', event => { if (event.key === 'Escape') { closeModal('#property-modal'); closeModal('#detail-modal') } })

renderRegions()
renderProperties()
