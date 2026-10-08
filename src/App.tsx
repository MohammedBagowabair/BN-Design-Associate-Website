import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { asset, useI18n } from './i18n'
import { useActiveSection, useDialogFlag, useMenu, useSwipe, useWindowLoaded } from './hooks'
import { useOpenStatus } from './hours'
import { Reveal } from './Reveal'
import { BIZ, CLIENTS, HOMES, HOTEL_URL, PROJECTS, ROOM_IDS, WEEK, type Content, type RoomId, type Sector } from './content'

const PITCH_WA = 'https://wa.me/601151198497'
const wa = (t: string) => `https://wa.me/${BIZ.wa}?text=${encodeURIComponent(t)}`
const IDS = ['work', 'homes', 'projects', 'services', 'awards', 'contact']
const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function WaIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3 2.4.9 2.9.8 3.4.7.5-.1 1.7-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z" />
    </svg>
  )
}
function PhoneIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 4h3l1.5 4-2 1.2a11 11 0 0 0 5.3 5.3l1.2-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></svg>
}
function Arrow({ dir = 'right' }: { dir?: 'left' | 'right' }) {
  return <svg viewBox="0 0 20 20" className={`h-4 w-4 ${dir === 'left' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 10h12M11 5l5 5-5 5" /></svg>
}

function Eyebrow({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return <p className={`eyebrow ${dark ? 'text-brass' : 'text-brass-ink'}`}><span className={`h-px w-8 ${dark ? 'bg-brass' : 'bg-brass-ink'}`} aria-hidden />{children}</p>
}

function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className={`flex items-center gap-3 ${light ? 'text-stone' : 'text-forest'}`}>
      <span className="font-display text-[27px] leading-none tracking-[-0.01em]">B<span className={`italic ${light ? 'text-brass' : 'text-brass-ink'}`}>&amp;</span>N</span>
      <span className={`border-l pl-3 text-[9.5px] font-semibold uppercase leading-[1.35] tracking-[0.26em] ${light ? 'border-stone/25 text-stone/80' : 'border-forest/20 text-moss'}`}>Design<br />Associate</span>
    </span>
  )
}

function StatusPill({ dark = false }: { dark?: boolean }) {
  const { c } = useI18n<Content>()
  const s = useOpenStatus(WEEK)
  const S = c.status
  return (
    <span className={`inline-flex min-h-[36px] items-center gap-2 rounded-full border px-3.5 text-[13.5px] ${dark ? 'border-stone/20 text-stone' : 'border-forest/15 bg-paper text-forest'}`} role="status">
      <span className={`h-2 w-2 rounded-full ${s === null ? 'bg-moss/50' : s.open ? 'bg-[#3FAE7A]' : 'bg-terabai'}`} aria-hidden />
      {s === null ? S.checking : <><span className="font-semibold">{s.open ? S.open : S.closed}</span><span className={dark ? 'text-stone/75' : 'text-moss'}>· {s.open ? S.closes : S.opens}</span></>}
    </span>
  )
}

function Header({ active, onMenu, menuOpen, btnRef }: { active: string; onMenu: () => void; menuOpen: boolean; btnRef: React.RefObject<HTMLButtonElement | null> }) {
  const { c, lang, setLang } = useI18n<Content>()
  return (
    <header className="sticky top-0 z-40 border-b border-stone/10 bg-forest-deep/95 text-stone backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-5 sm:px-8 lg:h-16">
        <a href="#top" className="tap flex items-center rounded-lg"><Logo light /></a>
        <nav aria-label={c.a11y.main} className="hidden items-center gap-7 lg:flex">
          {c.nav.map(([id, l]) => (
            <a key={id} href={`#${id}`} aria-current={active === id ? 'true' : undefined} className={`nav-link py-3 text-[14.5px] transition hover:text-stone ${active === id ? 'text-stone' : 'text-stone/75'}`}>{l}</a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button data-lang-toggle onClick={() => setLang(lang === 'en' ? 'ms' : 'en')} aria-label={c.langAria} className="tap rounded-full border border-stone/20 px-3 text-xs font-semibold tracking-wider text-stone transition hover:border-brass">{c.langLabel}</button>
          <a href={wa(c.waMsg)} target="_blank" rel="noopener" className="tap hidden items-center gap-2 rounded-full bg-brass px-4 text-sm font-semibold text-forest-deep transition hover:bg-brass-light sm:inline-flex"><WaIcon className="h-4 w-4" />{c.waCta}</a>
          <button ref={btnRef} onClick={onMenu} aria-expanded={menuOpen} aria-controls="mobile-menu" aria-label={menuOpen ? c.a11y.menuClose : c.a11y.menuOpen} className="tap grid place-items-center rounded-full border border-stone/20 lg:hidden">
            <span className="relative block h-3 w-5" aria-hidden>
              <span className={`absolute left-0 h-[1.5px] w-5 bg-stone transition ${menuOpen ? 'top-[5px] rotate-45' : 'top-0'}`} />
              <span className={`absolute left-0 top-[5px] h-[1.5px] w-5 bg-stone transition ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`absolute left-0 h-[1.5px] w-5 bg-stone transition ${menuOpen ? 'top-[5px] -rotate-45' : 'top-[10px]'}`} />
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}

function MobileMenu({ close, active }: { close: () => void; active: string }) {
  const { c } = useI18n<Content>()
  useDialogFlag()
  return (
    <div id="mobile-menu" role="dialog" aria-modal="true" aria-label={c.a11y.mobile} className="dark fixed inset-x-0 bottom-0 top-14 z-30 overflow-y-auto bg-forest-deep px-5 pb-10 pt-6 text-stone lg:hidden">
      <StatusPill dark />
      <nav aria-label={c.a11y.mobile} className="mt-6">
        <ol className="divide-y divide-stone/10 border-y border-stone/10">
          {c.nav.map(([id, l], i) => (
            <li key={id}>
              <a href={`#${id}`} onClick={close} aria-current={active === id ? 'true' : undefined} className="flex min-h-[60px] items-center gap-4 font-display text-[27px] tracking-[-0.01em]">
                <span className="w-8 font-sans text-[12px] font-semibold text-brass" aria-hidden>0{i + 1}</span>{l}
                {active === id && <span className="ml-auto h-2 w-2 rounded-full bg-brass" aria-hidden />}
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <div className="mt-8 flex flex-col gap-3">
        <a href={wa(c.waMsg)} target="_blank" rel="noopener" className="tap inline-flex items-center justify-center gap-2 rounded-full bg-brass px-5 font-semibold text-forest-deep"><WaIcon />{c.waCta} {BIZ.mobile}</a>
        <a href={`tel:${BIZ.officeTel}`} className="tap inline-flex items-center justify-center gap-2 rounded-full border border-stone/25 px-5 font-semibold"><PhoneIcon className="h-[18px] w-[18px]" />{c.contact.office} {BIZ.office}</a>
      </div>
    </div>
  )
}


function Hero() {
  const { c, lang } = useI18n<Content>()
  return (
    <section id="top" className="dark relative overflow-hidden bg-forest-deep text-stone">
      <div className="hero-glow pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 pb-12 pt-8 sm:px-8 sm:pt-14 lg:grid-cols-12 lg:gap-10 lg:pb-16 lg:pt-20">
        <div className="lg:col-span-7">
          <p className="inline-flex items-start gap-2.5 text-[12.5px] font-medium tracking-[0.04em] text-brass sm:text-[13px]">
            <svg viewBox="0 0 20 20" className="mt-px h-4 w-4 shrink-0" fill="currentColor" aria-hidden><path d="M10 1.5l2.3 5.2 5.7.5-4.3 3.8 1.3 5.6L10 13.7l-5 2.9 1.3-5.6L2 7.2l5.7-.5z" /></svg>
            <span className="flex flex-wrap gap-x-2"><span className="whitespace-nowrap">{c.hero.proof.split(' · ')[0]}</span><span className="whitespace-nowrap"><span aria-hidden>· </span>{c.hero.proof.split(' · ').slice(1).join(' · ')}</span></span>
          </p>
          <h1 className={`mt-6 font-display font-normal leading-[0.98] tracking-[-0.025em] ${lang === 'ms' ? 'text-[clamp(2.55rem,7.4vw,5.6rem)]' : 'text-[clamp(2.75rem,7.8vw,6rem)]'}`}>
            <span className="block">{c.hero.h1a}</span><span className="block italic text-brass-light">{c.hero.h1b}</span>
          </h1>
          <p className="mt-6 max-w-[34rem] text-[16.5px] leading-relaxed text-moss-dark sm:text-[18px]">{c.hero.sub}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <a href={wa(c.waMsg)} target="_blank" rel="noopener" className="tap lift inline-flex h-[52px] items-center justify-center gap-2.5 rounded-full bg-brass px-7 text-[16px] font-semibold text-forest-deep hover:bg-brass-light"><WaIcon />{c.hero.cta}</a>
            <a href="#work" className="tap inline-flex items-center justify-center gap-2 text-[15.5px] font-medium text-stone underline decoration-brass/60 underline-offset-[6px] transition hover:decoration-brass sm:inline-flex">{c.hero.cta2}</a>
          </div>
        </div>
        <figure className="lg:col-span-5 lg:self-center">
          <div className="relative overflow-hidden rounded-[18px] bg-forest ring-1 ring-stone/10">
            <img src={asset('images/hero-720.webp')} srcSet={`${asset('images/hero-480.webp')} 480w, ${asset('images/hero-720.webp')} 720w, ${asset('images/hero-960.webp')} 960w`} sizes="(min-width:1280px) 500px, (min-width:1024px) 40vw, (min-width:640px) 92vw, 260px" width={960} height={720} alt={c.hero.photo} fetchPriority="high" decoding="async" className="aspect-[4/3] w-full object-cover" />
          </div>
          <figcaption className="mt-3 text-[13px] leading-snug text-moss-dark"><span className="text-stone/90">{c.hero.photo}</span><br />{c.hero.credit}</figcaption>
        </figure>
      </div>
      <dl className="relative mx-auto grid max-w-7xl grid-cols-2 border-t border-stone/12 px-5 sm:grid-cols-3 sm:px-8">
        {c.stats.map(([n, l], i) => (
          <div key={n} className={`flex flex-col-reverse gap-1.5 py-6 lg:py-7 ${i === 1 ? 'border-l border-stone/12 pl-5 sm:pl-8' : ''} ${i === 2 ? 'col-span-2 border-t border-stone/12 sm:col-span-1 sm:border-l sm:border-t-0 sm:pl-8' : ''}`}>
            <dt className="text-[13.5px] leading-snug text-moss-dark">{l}</dt>
            <dd className="font-display text-[34px] leading-none tracking-[-0.02em] text-stone sm:text-[44px]">{n}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function RoomPhoto({ id, alt, eager = false }: { id: RoomId; alt: string; eager?: boolean }) {
  const loaded = useWindowLoaded()
  if (!eager && !loaded) return <div role="img" aria-label={alt} className="h-full w-full bg-forest" />
  return <img src={asset(`images/m-${id}-560.webp`)} srcSet={`${asset(`images/m-${id}-560.webp`)} 560w, ${asset(`images/m-${id}-960.webp`)} 960w`} sizes="(min-width:1280px) 700px, (min-width:768px) 56vw, 300px" width={960} height={720} loading={eager ? undefined : 'lazy'} fetchPriority={eager ? undefined : 'low'} decoding="async" alt={alt} className="h-full w-full object-cover" />
}

function Rail({ label, count, children, prev, next }: { label: string; count: number; children: ReactNode; prev: string; next: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [idx, setIdx] = useState(0)
  const [end, setEnd] = useState(false)
  const step = () => { const li = ref.current?.querySelector('li'); return li ? li.getBoundingClientRect().width + 16 : 300 }
  const onScroll = () => { const el = ref.current; if (!el) return; setIdx(Math.min(count - 1, Math.round(el.scrollLeft / step()))); setEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4) }
  useEffect(() => { onScroll() }, []) // eslint-disable-line react-hooks/exhaustive-deps
  const go = (d: number) => ref.current?.scrollBy({ left: d * step(), behavior: reduced() ? 'auto' : 'smooth' })
  const btn = 'tap grid place-items-center rounded-full border border-stone/25 text-stone transition hover:bg-stone hover:text-forest disabled:opacity-35'
  return (
    <div>
      <div ref={ref} onScroll={onScroll} role="region" aria-label={label} tabIndex={0} className="rail -mx-5 scroll-px-5 overflow-x-auto px-5 sm:-mx-8 sm:scroll-px-8 sm:px-8">
        <ul className="flex gap-4">{children}</ul>
      </div>
      <div className="mt-5 flex items-center justify-between gap-4">
        <div className="flex gap-1.5" aria-hidden>
          {Array.from({ length: count }, (_, i) => <span key={i} className={`h-1.5 rounded-full transition-all duration-300 ${(end ? i === count - 1 : i === idx) ? 'w-6 bg-brass' : 'w-1.5 bg-stone/30'}`} />)}
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => go(-1)} disabled={idx === 0} aria-label={prev} className={btn}><Arrow dir="left" /></button>
          <button type="button" onClick={() => go(1)} disabled={end} aria-label={next} className={btn}><Arrow /></button>
        </div>
      </div>
    </div>
  )
}

function Work() {
  const { c } = useI18n<Content>()
  const W = c.work
  const [room, setRoom] = useState<RoomId>('atoti')
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const k = e.key
    const n = k === 'ArrowDown' || k === 'ArrowRight' ? (i + 1) % ROOM_IDS.length : k === 'ArrowUp' || k === 'ArrowLeft' ? (i + ROOM_IDS.length - 1) % ROOM_IDS.length : k === 'Home' ? 0 : k === 'End' ? ROOM_IDS.length - 1 : -1
    if (n >= 0) { e.preventDefault(); setRoom(ROOM_IDS[n]); tabs.current[n]?.focus() }
  }
  const R = W.rooms[room]
  const ri = ROOM_IDS.indexOf(room)
  return (
    <section id="work" className="dark relative bg-forest text-stone">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
        <div className="grid gap-10 md:grid-cols-12 lg:gap-14">
          <div className="md:col-span-5">
            <Eyebrow dark>{W.eyebrow}</Eyebrow>
            <h2 className="h2 mt-5 text-stone">{W.title}</h2>
            <blockquote lang="en" className="mt-7 border-l border-brass/60 pl-5 font-display text-[19px] italic leading-snug text-stone/95 sm:text-[21px]">{W.quote}</blockquote>
            <p className="mt-2 pl-5 text-[13px] text-moss-dark">— {W.quoteBy}</p>
            <p className="mt-6 hidden text-[15px] leading-relaxed text-moss-dark lg:block">{W.concept}</p>
            {/* desktop: vertical tabs */}
            <div role="tablist" aria-label={c.a11y.rooms} aria-orientation="vertical" className="mt-9 hidden border-t border-stone/12 md:block">
              {ROOM_IDS.map((id, i) => (
                <button key={id} ref={(el) => { tabs.current[i] = el }} role="tab" id={`tab-${id}`} aria-selected={room === id} aria-controls="room-panel" tabIndex={room === id ? 0 : -1} onClick={() => setRoom(id)} onKeyDown={(e) => onKey(e, i)}
                  className={`group relative flex min-h-[58px] w-full items-center gap-4 border-b border-stone/12 pl-4 pr-2 text-left transition ${room === id ? 'bg-forest-2' : 'hover:bg-forest-2/60'}`}>
                  <span className={`absolute inset-y-0 left-0 w-[2px] transition ${room === id ? 'bg-brass' : 'bg-transparent'}`} aria-hidden />
                  <span className="w-6 font-display text-[14px] italic text-brass" aria-hidden>0{i + 1}</span>
                  <span className="font-display text-[22px] leading-none tracking-[-0.01em]">{W.rooms[id].name}</span>
                  <span className="ml-auto text-right text-[12.5px] text-moss-dark">{W.rooms[id].kind.split(' · ')[0]}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="hidden md:col-span-7 md:block">
            <div id="room-panel" role="tabpanel" aria-labelledby={`tab-${room}`} className="lg:sticky lg:top-24">
              <div key={room} className="plate-in relative aspect-[4/3] overflow-hidden rounded-[22px] bg-forest-2 ring-1 ring-stone/10"><RoomPhoto id={room} alt={`${R.name}, ${R.kind.split(' · ')[0]}, Mercure Miri City Centre`} />
                <span className="absolute left-4 top-4 rounded-full bg-forest-deep/80 px-3 py-1 font-display text-[14px] italic text-brass-light">0{ri + 1} / 05</span>
              </div>
              <div className="mt-7 grid gap-x-10 gap-y-4 lg:grid-cols-[1fr_auto]">
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-brass">{R.kind}</p>
                  <h3 className="mt-2 font-display text-[40px] leading-none tracking-[-0.02em] lg:text-[48px]">{R.name}</h3>
                  <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-stone/90">{R.text}</p>
                </div>
                <ul className="flex flex-wrap content-start gap-2 lg:max-w-[13rem] lg:flex-col lg:items-start">{R.tags.map((t) => <li key={t} className="rounded-full border border-stone/20 px-3 py-1 text-[13px] text-stone/85">{t}</li>)}</ul>
              </div>
              <p className="mt-6 text-[12.5px] text-moss-dark">{W.credit} <a href={HOTEL_URL} target="_blank" rel="noopener" className="inline-flex min-h-[24px] items-center text-stone/90 underline decoration-brass/50 underline-offset-2 hover:decoration-brass">{W.hotel} ↗</a></p>
            </div>
          </div>
        </div>
        {/* mobile: swipe cards */}
        <div className="mt-10 md:hidden">
          <p className="mb-4 text-[13px] text-moss-dark">{W.swipe}</p>
          <Rail label={c.a11y.rooms} count={ROOM_IDS.length} prev={c.a11y.prev} next={c.a11y.next}>
            {ROOM_IDS.map((id, i) => {
              const X = W.rooms[id]
              return (
                <li key={id} className="w-[84%] shrink-0 overflow-hidden rounded-[20px] bg-forest-2 ring-1 ring-stone/10 sm:w-[60%]">
                  <div className="relative aspect-[4/3] bg-forest"><RoomPhoto id={id} alt={`${X.name}, ${X.kind.split(' · ')[0]}, Mercure Miri City Centre`} /><span className="absolute left-3 top-3 rounded-full bg-forest-deep/80 px-2.5 py-0.5 font-display text-[13px] italic text-brass-light">0{i + 1} / 05</span></div>
                  <div className="p-5">
                    <p className="text-[11.5px] font-semibold uppercase tracking-[0.18em] text-brass">{X.kind}</p>
                    <h3 className="mt-1.5 font-display text-[30px] leading-none tracking-[-0.01em]">{X.name}</h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-stone/90">{X.text}</p>
                  </div>
                </li>
              )
            })}
          </Rail>
          <p className="mt-4 text-[12.5px] text-moss-dark">{W.credit} <a href={HOTEL_URL} target="_blank" rel="noopener" className="inline-flex min-h-[24px] items-center text-stone/90 underline decoration-brass/50 underline-offset-2">{W.hotel} ↗</a></p>
        </div>
      </div>
    </section>
  )
}

const himg = (n: string) => asset(`images/r-${n}.webp`)

function HomeDialog({ i, setI }: { i: number; setI: (n: number | null) => void }) {
  const { c } = useI18n<Content>()
  const H = c.homes
  const ref = useRef<HTMLDialogElement>(null)
  const [k, setK] = useState(0)
  useDialogFlag()
  const h = HOMES[i]
  const n = h.imgs.length
  const go = useCallback((d: number) => setK((x) => (x + d + n) % n), [n])
  const swipe = useSwipe(go)
  useEffect(() => { const d = ref.current; if (d && !d.open) d.showModal() }, [])
  useEffect(() => { setK(0) }, [i])
  useEffect(() => {
    const kb = (e: KeyboardEvent) => { if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1) }
    window.addEventListener('keydown', kb); return () => window.removeEventListener('keydown', kb)
  }, [go])
  const t = H.items[h.id]
  const name = h.imgs[k]
  return (
    <dialog ref={ref} onClose={() => setI(null)} onClick={(e) => { if (e.target === ref.current) ref.current?.close() }} aria-labelledby="hd-title" className="pd">
      <button type="button" onClick={() => ref.current?.close()} aria-label={c.a11y.close} className="tap absolute right-3 top-3 z-10 grid place-items-center rounded-full bg-paper/90 text-2xl leading-none text-forest shadow-sm hover:bg-paper" autoFocus>×</button>
      <div className="grid max-h-[inherit] overflow-y-auto lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="relative flex items-center justify-center bg-forest-night" {...swipe}>
          <img key={name} src={himg(name)} alt={H.alts[name]} className="pd-img max-h-[62dvh] w-auto max-w-full object-contain lg:max-h-[80dvh]" />
          {n > 1 && <>
            <button type="button" onClick={() => go(-1)} aria-label={c.a11y.prevPhoto} className="tap absolute left-2 top-1/2 grid -translate-y-1/2 place-items-center rounded-full bg-paper/85 text-forest hover:bg-paper"><Arrow dir="left" /></button>
            <button type="button" onClick={() => go(1)} aria-label={c.a11y.nextPhoto} className="tap absolute right-2 top-1/2 grid -translate-y-1/2 place-items-center rounded-full bg-paper/85 text-forest hover:bg-paper"><Arrow /></button>
          </>}
        </div>
        <div className="flex min-w-0 flex-col p-6 sm:p-8">
          <p className="pr-10 text-[12px] font-semibold uppercase tracking-[0.2em] text-brass-ink">{H.eyebrow}{n > 1 && <> · {c.a11y.photo} {k + 1}/{n}</>}</p>
          <h3 id="hd-title" className="mt-2 font-display text-[30px] leading-[1.05] tracking-[-0.015em] text-forest sm:text-[36px]">{t.name}</h3>
          {t.place && <p className="mt-2 text-[15px] text-moss">{t.place}</p>}
          <p className="mt-4 text-[15.5px] leading-relaxed text-forest">{t.rooms}</p>
          <p className="mt-2 text-[14px] text-moss">{H.alts[name]}</p>
          {n > 1 && (
            <ul className="mt-5 flex flex-wrap gap-2">
              {h.imgs.map((m, j) => (
                <li key={m}><button type="button" onClick={() => setK(j)} aria-label={`${c.a11y.photo} ${j + 1}`} aria-current={j === k ? 'true' : undefined} className={`block h-12 w-16 overflow-hidden rounded-md ring-2 transition ${j === k ? 'ring-brass-ink' : 'ring-transparent opacity-75 hover:opacity-100'}`}><img src={asset(`images/rc-${m}-480.webp`)} alt="" loading="lazy" className="h-full w-full object-cover" /></button></li>
              ))}
            </ul>
          )}
          <p className="mt-auto pt-6 text-[12.5px] leading-relaxed text-moss">{H.credit}</p>
        </div>
      </div>
    </dialog>
  )
}

function Homes() {
  const { c } = useI18n<Content>()
  const H = c.homes
  const [open, setOpen] = useState<number | null>(null)
  return (
    <section id="homes" className="bg-paper">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
        <div className="grid gap-5 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7"><Eyebrow>{H.eyebrow}</Eyebrow><h2 className="h2 mt-5">{H.title}</h2></div>
          <p className="text-[16px] leading-relaxed text-moss lg:col-span-5">{H.sub}</p>
        </div>
        <ul className="mt-10 grid grid-cols-2 gap-x-3 gap-y-7 sm:gap-x-5 lg:mt-12 lg:grid-cols-3 lg:gap-y-10">
          {HOMES.map((h, i) => {
            const t = H.items[h.id]
            return (
              <li key={h.id} className="min-w-0">
                <Reveal>
                  <button type="button" onClick={() => setOpen(i)} aria-haspopup="dialog" className="tile group block w-full rounded-[14px] text-left">
                    <span className="relative block overflow-hidden rounded-[14px] bg-stone">
                      <img src={asset(`images/rc-${h.imgs[0]}-480.webp`)} width={480} height={320} loading="lazy" decoding="async" alt="" className="aspect-[3/2] w-full object-cover" />
                      {h.imgs.length > 1 && <span className="absolute bottom-2 right-2 rounded-full bg-forest-deep/80 px-2.5 py-0.5 text-[12px] font-medium text-stone">{h.imgs.length} {H.photos}</span>}
                    </span>
                    <span className="mt-3 block font-display text-[19px] leading-tight tracking-[-0.01em] text-forest group-hover:underline group-hover:decoration-brass group-hover:underline-offset-4 sm:text-[23px]">{t.name}</span>
                    <span className="mt-1 block text-[13.5px] leading-snug text-moss sm:text-[14.5px]">{t.place || t.rooms}</span>
                    <span className="sr-only">, {H.view}</span>
                  </button>
                </Reveal>
              </li>
            )
          })}
        </ul>
        <p className="mt-8 max-w-3xl text-[12.5px] leading-relaxed text-moss">{H.credit}</p>
      </div>
      {open !== null && <HomeDialog i={open} setI={setOpen} />}
    </section>
  )
}

function Projects() {
  const { c } = useI18n<Content>()
  const P = c.projects
  const [f, setF] = useState<'all' | Sector>('all')
  const [more, setMore] = useState(false)
  const keys: ('all' | Sector)[] = ['all', 'h', 'g', 'r', 'w', 's']
  const all = useMemo(() => PROJECTS.map((p, i) => ({ ...p, no: i + 1 })), [])
  const list = all.filter((p) => f === 'all' || p.s === f)
  const count = (k: 'all' | Sector) => (k === 'all' ? PROJECTS.length : PROJECTS.filter((p) => p.s === k).length)
  const order = { platinum: 0, gold: 1, silver: 2 } as const
  const winners = all.filter((p) => p.a).sort((a, b) => order[a.a!] - order[b.a!])
  const tierCls = { platinum: 'text-forest', gold: 'text-brass-ink', silver: 'text-moss' } as const
  return (
    <section id="projects" className="bg-stone">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
        <div className="grid gap-5 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7"><Eyebrow>{P.eyebrow}</Eyebrow><h2 className="h2 mt-5">{P.title}</h2></div>
          <p className="text-[16px] leading-relaxed text-moss lg:col-span-5">{P.sub}</p>
        </div>
        <p className="mt-12 text-[12px] font-semibold uppercase tracking-[0.2em] text-brass-ink">{P.winners}</p>
        <ol className="mt-3 border-t border-forest/20">
          {winners.map((p) => (
            <Reveal as="li" key={p.n} className="grid gap-x-8 gap-y-1 border-b border-forest/15 py-6 md:grid-cols-[9rem_1fr_auto] md:items-baseline lg:py-7">
              <span className={`font-display text-[19px] italic ${tierCls[p.a!]}`}>{P.awards[p.a!]}</span>
              <span className="font-display text-[27px] leading-[1.08] tracking-[-0.015em] text-forest sm:text-[34px] lg:text-[40px]">{p.n}</span>
              {p.s === 'h'
                ? <a href="#work" className="group inline-flex min-h-[44px] items-center gap-2 text-[14.5px] font-medium text-forest underline decoration-brass underline-offset-4 md:justify-end">{P.story}<span className="arrow-r"><Arrow /></span></a>
                : <span className="text-[14px] text-moss md:text-right">{P.sectors[p.s]}</span>}
            </Reveal>
          ))}
        </ol>

        <div className="mt-16 flex flex-wrap items-end justify-between gap-4">
          <h3 className="font-display text-[30px] leading-none tracking-[-0.015em] sm:text-[36px]">{P.register}</h3>
          <p className="text-[13.5px] text-moss" aria-live="polite">{list.length} {P.count}</p>
        </div>
        <div role="group" aria-label={c.a11y.filter} className="chips -mx-5 mt-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          {keys.map((k) => (
            <button key={k} type="button" aria-pressed={f === k} onClick={() => { setF(k); setMore(false) }} className={`tap inline-flex shrink-0 items-center gap-2 rounded-full border px-4 text-[14px] font-medium transition ${f === k ? 'border-forest bg-forest text-stone' : 'border-forest/20 text-forest hover:border-forest'}`}>
              {P.filters[k]}<span className={`text-[12px] tabular-nums ${f === k ? 'text-stone/75' : 'text-moss'}`}>{count(k)}</span>
            </button>
          ))}
        </div>
        <ol id="register" className="mt-6 grid border-t border-forest/15 md:grid-cols-2 md:gap-x-10 lg:grid-cols-3">
          {list.map((p, i) => (
            <li key={p.n} className={`flex min-h-[54px] items-center gap-4 border-b border-forest/10 py-2.5 ${!more && i >= 12 ? 'hidden' : !more && i >= 8 ? 'max-md:hidden' : ''}`}>
              <span className="w-8 shrink-0 font-display text-[14px] italic tabular-nums text-brass-ink">{String(p.no).padStart(2, '0')}</span>
              <span className="flex-1 text-[15.5px] leading-snug text-forest">{p.n}</span>
              {p.a && <span className={`award award-${p.a}`}>{P.awards[p.a]}</span>}
            </li>
          ))}
        </ol>
        {list.length > 8 && (
          <button type="button" aria-expanded={more} aria-controls="register" onClick={() => setMore((m) => !m)}
            className={`tap lift mt-6 inline-flex items-center justify-center gap-2 rounded-full border border-forest/25 px-6 text-[15px] font-medium text-forest hover:border-forest max-sm:w-full ${list.length <= 12 ? 'md:hidden' : ''}`}>
            {more ? P.showLess : `${P.showAll} (${list.length})`}
          </button>
        )}

        <div className="mt-16 grid gap-6 border-t border-forest/15 pt-8 lg:grid-cols-12">
          <h3 className="text-[12px] font-semibold uppercase tracking-[0.2em] text-brass-ink lg:col-span-3">{c.clients.eyebrow}</h3>
          <div className="min-w-0 lg:col-span-9">
            <ul className="flex flex-wrap gap-y-1 font-display text-[19px] leading-[1.5] text-forest sm:text-[22px]">
              {CLIENTS.map(([n], i) => <li key={n} className="flex items-baseline">{i > 0 && <span className="mx-2.5 text-brass" aria-hidden>·</span>}{n}</li>)}
            </ul>
            <p className="mt-3 text-[13px] text-moss">{c.clients.note}</p>
          </div>
        </div>
        <a href={wa(c.waMsg)} target="_blank" rel="noopener" className="mt-8 inline-flex min-h-[44px] items-center gap-2 text-[15px] font-medium text-forest underline decoration-brass underline-offset-4"><WaIcon className="h-4 w-4" />{P.ask}</a>
      </div>
    </section>
  )
}

function Services() {
  const { c } = useI18n<Content>()
  const S = c.services
  return (
    <section id="services" className="bg-paper">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <Eyebrow>{S.eyebrow}</Eyebrow>
            <h2 className="h2 mt-5">{S.title}</h2>
            <div className="mt-8 rounded-[20px] bg-forest p-6 text-stone sm:p-7">
              <h3 className="font-display text-[22px] italic text-brass-light">{S.benefitsTitle}</h3>
              <ul className="mt-4 space-y-3">{S.benefits.map((b) => <li key={b} className="flex gap-3 text-[15px] leading-relaxed text-stone/90"><span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-brass" aria-hidden />{b}</li>)}</ul>
            </div>
          </div>
          <ol className="border-t border-forest/15 lg:col-span-7">
            {S.items.map(([t, d], i) => (
              <li key={t} className="grid grid-cols-[3rem_1fr] gap-x-4 border-b border-forest/15 py-6 sm:grid-cols-[4.5rem_1fr] lg:py-7">
                <span className="font-display text-[34px] italic leading-none text-brass-ink sm:text-[44px]" aria-hidden>0{i + 1}</span>
                <div><h3 className="font-display text-[23px] leading-tight tracking-[-0.01em] text-forest sm:text-[27px]">{t}</h3><p className="mt-2 max-w-xl text-[15.5px] leading-relaxed text-moss">{d}</p></div>
              </li>
            ))}
          </ol>
        </div>
        <figure className="relative mt-14 overflow-hidden rounded-[22px] bg-forest">
          <img src={asset('images/foyer-760.webp')} srcSet={`${asset('images/foyer-760.webp')} 760w, ${asset('images/foyer-1400.webp')} 1400w`} sizes="(min-width:1280px) 1216px, 92vw" width={1400} height={600} loading="lazy" decoding="async" alt={S.photoAlt} className="aspect-[16/10] w-full object-cover sm:aspect-[21/9]" />
          <figcaption className="absolute bottom-3 left-3 right-3 w-fit rounded-lg bg-forest-deep/85 px-3 py-1.5 text-[12px] font-medium leading-snug text-stone">{S.photoCap}</figcaption>
        </figure>
        <div className="mt-10">
          <h3 className="text-[12px] font-semibold uppercase tracking-[0.2em] text-brass-ink">{S.whyTitle}</h3>
          <dl className="mt-5 grid grid-cols-2 gap-x-5 gap-y-6 lg:grid-cols-4 lg:gap-x-8">
            {S.why.map(([t, d]) => <div key={t} className="border-t border-brass-ink/50 pt-4"><dt className="font-display text-[18px] leading-snug text-forest sm:text-[20px]">{t}</dt><dd className="mt-1.5 text-[14px] leading-relaxed text-moss sm:text-[14.5px]">{d}</dd></div>)}
          </dl>
          <p className="mt-8 max-w-3xl text-[13.5px] leading-relaxed text-moss">{S.network}</p>
        </div>
      </div>
    </section>
  )
}

function Awards() {
  const { c } = useI18n<Content>()
  const A = c.awards
  return (
    <section id="awards" className="dark bg-forest-deep text-stone">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
        <div className="max-w-2xl"><Eyebrow dark>{A.eyebrow}</Eyebrow><h2 className="h2 mt-5">{A.title}</h2></div>
        <ol className="relative mt-12 grid gap-0 lg:grid-cols-7 lg:gap-6">
          <span className="absolute left-0 right-0 top-[52px] hidden h-px bg-stone/15 lg:block" aria-hidden />
          {A.items.map(([y, t, d], i) => (
            <Reveal as="li" key={t} delay={i * 40} className="relative grid grid-cols-[4.6rem_1fr] gap-x-4 border-b border-stone/10 py-4 lg:block lg:border-0 lg:py-0">
              <span className={`font-display text-[26px] leading-none tracking-[-0.02em] lg:text-[34px] ${i === 0 ? 'text-brass-light' : 'text-stone'}`}>{y}</span>
              <span className={`absolute left-0 top-[47px] hidden h-[11px] w-[11px] rounded-full border lg:block ${i === 0 ? 'border-brass bg-brass' : 'border-stone/40 bg-forest-deep'}`} aria-hidden />
              <div className="lg:mt-12">
                <h3 className="text-[15.5px] font-medium leading-snug text-stone">{t}</h3>
                <p className="mt-1 text-[14px] leading-relaxed text-moss-dark">{d}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Contact() {
  const { c } = useI18n<Content>()
  const C = c.contact
  const link = 'inline-flex min-h-[44px] items-center gap-2 text-[17px] font-medium transition hover:text-brass-light'
  return (
    <section id="contact" className="dark bg-forest text-stone">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-12 lg:py-24">
        <div className="lg:col-span-7">
          <Eyebrow dark>{C.eyebrow}</Eyebrow>
          <h2 className="h2 mt-5 text-stone">{C.title}</h2>
          <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-stone/85">{C.sub}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a href={wa(c.waMsg)} target="_blank" rel="noopener" className="tap lift inline-flex h-[50px] items-center justify-center gap-2 rounded-full bg-brass px-6 text-[15.5px] font-semibold text-forest-deep hover:bg-brass-light"><WaIcon />{c.waCta}</a>
            <a href={`mailto:${BIZ.email}?subject=${encodeURIComponent(C.subject)}`} className="tap inline-flex h-[50px] items-center justify-center rounded-full border border-stone/25 px-6 text-[15.5px] font-semibold text-stone hover:border-brass">{c.email}</a>
            <StatusPill dark />
          </div>
          <dl className="mt-10 grid gap-x-8 gap-y-7 border-t border-stone/12 pt-8 sm:grid-cols-2">
            <div><dt className="dt">{C.office}</dt><dd className="mt-1"><a href={`tel:${BIZ.officeTel}`} className={link}><PhoneIcon className="h-4 w-4 text-brass" />{BIZ.office}</a></dd></div>
            <div><dt className="dt">{C.mobile}</dt><dd className="mt-1"><a href={wa(c.waMsg)} target="_blank" rel="noopener" className={link}><WaIcon className="h-4 w-4 text-brass" />{BIZ.mobile}</a></dd></div>
            <div><dt className="dt">{C.email}</dt><dd className="mt-1"><a href={`mailto:${BIZ.email}`} className={`${link} break-all text-[16px]`}>{BIZ.email}</a></dd></div>
            <div><dt className="dt">{C.fax}</dt><dd className="mt-1 flex min-h-[44px] items-center text-[16px] text-stone/90">{BIZ.fax}</dd></div>
            <div><dt className="dt">{C.address}</dt><dd className="mt-2 text-[16px] leading-relaxed text-stone/90">{BIZ.address}</dd></div>
            <div><dt className="dt">{C.hours}</dt><dd className="mt-2 text-[16px] text-stone/90">{C.hoursText}</dd></div>
          </dl>
        </div>
        <div className="lg:col-span-5">
          <figure>
            <a href={BIZ.maps} target="_blank" rel="noopener" className="group relative block overflow-hidden rounded-[22px] ring-1 ring-stone/15">
              <img src={asset('images/map-600.webp')} srcSet={`${asset('images/map-600.webp')} 600w, ${asset('images/map-900.webp')} 900w`} sizes="(min-width:1024px) 460px, 92vw" width={900} height={560} loading="lazy" decoding="async" alt={C.mapAlt} className="aspect-[900/560] w-full object-cover" />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full" aria-hidden>
                <svg viewBox="0 0 32 42" className="h-11 w-auto drop-shadow-md"><path d="M16 0C7.2 0 0 7 0 15.7 0 27.5 16 42 16 42s16-14.5 16-26.3C32 7 24.8 0 16 0z" fill="#0E2420" /><circle cx="16" cy="15.5" r="6" fill="#C9A15A" /></svg>
              </span>
              <span className="absolute bottom-3 right-3 rounded-full bg-brass px-3.5 py-2 text-[13px] font-semibold text-forest-deep shadow transition group-hover:bg-stone">{C.maps} ↗</span>
            </a>
            <figcaption className="mt-2 text-[12px] text-moss-dark">{C.mapCredit}</figcaption>
          </figure>
          <div className="mt-4 flex flex-wrap gap-x-6">
            <a href={BIZ.directions} target="_blank" rel="noopener" className="inline-flex min-h-[44px] items-center text-[15px] font-medium text-brass-light underline decoration-brass/40 underline-offset-4 hover:decoration-brass">{C.directions} ↗</a>
            <a href={BIZ.facebook} target="_blank" rel="noopener" className="inline-flex min-h-[44px] items-center text-[15px] font-medium text-brass-light underline decoration-brass/40 underline-offset-4 hover:decoration-brass">{C.facebook} ↗</a>
          </div>
        </div>
      </div>
    </section>
  )
}

function Faq() {
  const { c } = useI18n<Content>()
  return (
    <section id="faq" className="bg-stone">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-12 lg:py-24">
        <div className="lg:col-span-4"><Eyebrow>{c.faq.eyebrow}</Eyebrow><h2 className="h2 mt-5">{c.faq.title}</h2></div>
        <div className="divide-y divide-forest/12 border-y border-forest/12 lg:col-span-8">
          {c.faq.items.map(([q, a]) => (
            <details key={q} className="group">
              <summary className="flex min-h-[64px] cursor-pointer items-center justify-between gap-6 py-4 font-display text-[20px] leading-snug tracking-[-0.01em] text-forest sm:text-[22px]">
                {q}
                <span className="faq-i grid h-9 w-9 shrink-0 place-items-center rounded-full border border-forest/20 font-sans text-lg transition" aria-hidden>+</span>
              </summary>
              <p className="max-w-2xl pb-6 text-[16px] leading-relaxed text-moss">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

function Footer() {
  const { c } = useI18n<Content>()
  const F = c.footer
  const h = 'text-[11.5px] font-semibold uppercase tracking-[0.2em] text-brass'
  const l = 'inline-flex min-h-[36px] items-center text-stone/80 hover:text-brass-light'
  return (
    <footer className="bg-forest-night text-stone">
      <div className="mx-auto max-w-7xl px-5 pb-28 pt-14 sm:px-8 lg:pb-10">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-12">
          <div className="col-span-2 lg:col-span-5">
            <Logo light />
            <p className="mt-4 max-w-sm text-[14.5px] leading-relaxed text-stone/75">{BIZ.name}<br />{F.tagline}</p>
          </div>
          <nav aria-label={F.explore} className="lg:col-span-2">
            <h2 className={h}>{F.explore}</h2>
            <ul className="mt-3 text-[14.5px]">{c.nav.map(([id, t]) => <li key={id}><a href={`#${id}`} className={l}>{t}</a></li>)}</ul>
          </nav>
          <div className="col-span-2 sm:col-span-1 lg:col-span-5">
            <h2 className={h}>{F.reach}</h2>
            <ul className="mt-3 text-[14.5px]">
              <li><a href={BIZ.maps} target="_blank" rel="noopener" className={`${l} max-w-xs`}>{BIZ.address}</a></li>
              <li className="py-1.5 text-stone/60">{c.contact.hoursText}</li>
              <li><a href={`tel:${BIZ.officeTel}`} className={l}>{BIZ.office}</a> <span className="text-stone/40">·</span> <a href={wa(c.waMsg)} target="_blank" rel="noopener" className={l}>{BIZ.mobile}</a></li>
              <li><a href={`mailto:${BIZ.email}`} className={`${l} break-all`}>{BIZ.email}</a></li>
              <li><a href={BIZ.facebook} target="_blank" rel="noopener" className={l}>Facebook ↗</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-stone/10 pt-6 text-[12.5px] text-stone/60 sm:flex-row sm:flex-wrap sm:justify-between">
          <p>© {new Date().getFullYear()} {BIZ.name} {F.rights}</p>
          <p>{F.note}</p>
        </div>
        <p className="mt-4 text-[12px] leading-relaxed text-stone/60">{F.pitch} <a href={PITCH_WA} target="_blank" rel="noopener" className="inline-flex min-h-[24px] items-center font-semibold text-stone/80 underline decoration-stone/30 underline-offset-2 hover:text-brass-light">{F.pitchLink}</a></p>
      </div>
    </footer>
  )
}

function MobileBar() {
  const { c } = useI18n<Content>()
  const [show, setShow] = useState(false)
  useEffect(() => {
    const on = () => setShow(window.scrollY > window.innerHeight * 0.7)
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  const t = show ? 0 : -1
  return (
    <nav aria-label={c.a11y.bar} aria-hidden={!show} data-fab
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-stone/10 bg-forest-deep/95 px-3 pb-[max(.6rem,env(safe-area-inset-bottom))] pt-2.5 backdrop-blur transition duration-300 lg:hidden ${show ? '' : 'pointer-events-none translate-y-full opacity-0'}`}>
      <div className="mx-auto grid max-w-md grid-cols-[1fr_1.35fr_auto] gap-2">
        <a href={`mailto:${BIZ.email}`} tabIndex={t} className="inline-flex h-12 items-center justify-center rounded-full border border-stone/25 text-[15px] font-semibold text-stone">{c.email}</a>
        <a href={wa(c.waMsg)} target="_blank" rel="noopener" tabIndex={t} className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brass text-[15px] font-semibold text-forest-deep"><WaIcon />{c.waCta}</a>
        <a href={`tel:${BIZ.officeTel}`} tabIndex={t} aria-label={`${c.call} ${BIZ.office}`} className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-stone text-forest-deep"><PhoneIcon className="h-[18px] w-[18px]" /></a>
      </div>
    </nav>
  )
}

export default function App() {
  const { c } = useI18n<Content>()
  const [open, setOpen] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)
  const closeMenu = useCallback(() => setOpen(false), [])
  useMenu(open, closeMenu, btnRef)
  const ids = useMemo(() => IDS, [])
  const active = useActiveSection(ids)
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-brass focus:px-4 focus:py-2 focus:text-forest-deep">{c.a11y.skip}</a>
      <Header active={active} onMenu={() => setOpen((o) => !o)} menuOpen={open} btnRef={btnRef} />
      {open && <MobileMenu close={closeMenu} active={active} />}
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <Work />
        <Homes />
        <Projects />
        <Services />
        <Awards />
        <Contact />
        <Faq />
      </main>
      <Footer />
      <MobileBar />
    </>
  )
}
