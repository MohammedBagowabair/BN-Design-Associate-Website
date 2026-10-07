import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { asset, useI18n } from './i18n'
import { useActiveSection, useDialogFlag, useMenu } from './hooks'
import { useOpenStatus } from './hours'
import { Reveal } from './Reveal'
import { BIZ, CLIENTS, PROJECTS, ROOM_IDS, WEEK, type Content, type RoomId, type Sector } from './content'

const PITCH_WA = 'https://wa.me/601151198497'
const wa = (t: string) => `https://wa.me/${BIZ.wa}?text=${encodeURIComponent(t)}`
const IDS = ['work', 'projects', 'services', 'awards', 'brief', 'contact']

function WaIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3 2.4.9 2.9.8 3.4.7.5-.1 1.7-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z" />
    </svg>
  )
}

function Eyebrow({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return <p className={`eyebrow ${dark ? 'text-brass' : 'text-brass-ink'}`}><span className={`h-px w-8 ${dark ? 'bg-brass' : 'bg-brass-ink'}`} aria-hidden />{children}</p>
}

function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className={`flex items-center gap-3 ${light ? 'text-stone' : 'text-forest'}`}>
      <span className="font-display text-[26px] leading-none tracking-[0.02em]">B<span className={light ? 'text-brass' : 'text-brass-ink'}>&amp;</span>N</span>
      <span className={`border-l pl-3 text-[9.5px] font-semibold uppercase leading-[1.35] tracking-[0.28em] ${light ? 'border-stone/25 text-stone/80' : 'border-forest/20 text-moss'}`}>Design<br />Associate</span>
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
    <header className="sticky top-0 z-40 border-b border-forest/10 bg-paper/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-5 sm:px-8">
        <a href="#top" className="tap flex items-center rounded-lg"><Logo /></a>
        <nav aria-label={c.a11y.main} className="hidden items-center gap-6 xl:flex">
          {c.nav.map(([id, l]) => (
            <a key={id} href={`#${id}`} aria-current={active === id ? 'true' : undefined} className={`nav-link py-2 text-[14.5px] font-medium transition hover:text-forest ${active === id ? 'text-forest' : 'text-moss'}`}>{l}</a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button data-lang-toggle onClick={() => setLang(lang === 'en' ? 'ms' : 'en')} aria-label={c.langAria} className="tap rounded-full border border-forest/20 px-3 text-xs font-bold tracking-wider text-forest transition hover:border-forest">{c.langLabel}</button>
          <a href={wa(c.waMsg)} target="_blank" rel="noopener" className="tap hidden items-center gap-2 rounded-full bg-forest px-4 text-sm font-semibold text-stone transition hover:bg-forest-3 sm:inline-flex"><WaIcon className="h-4 w-4" />{c.waCta}</a>
          <button ref={btnRef} onClick={onMenu} aria-expanded={menuOpen} aria-controls="mobile-menu" aria-label={menuOpen ? c.a11y.menuClose : c.a11y.menuOpen} className="tap grid place-items-center rounded-full border border-forest/20 xl:hidden">
            <span className="relative block h-3 w-5" aria-hidden>
              <span className={`absolute left-0 h-[2px] w-5 bg-forest transition ${menuOpen ? 'top-[5px] rotate-45' : 'top-0'}`} />
              <span className={`absolute left-0 top-[5px] h-[2px] w-5 bg-forest transition ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`absolute left-0 h-[2px] w-5 bg-forest transition ${menuOpen ? 'top-[5px] -rotate-45' : 'top-[10px]'}`} />
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
    <div id="mobile-menu" role="dialog" aria-modal="true" aria-label={c.a11y.mobile} className="grid-paper fixed inset-x-0 bottom-0 top-16 z-30 overflow-y-auto bg-paper px-5 pb-10 pt-6 text-forest xl:hidden">
      <StatusPill />
      <nav aria-label={c.a11y.mobile} className="mt-6">
        <ol className="divide-y divide-forest/10 border-y border-forest/10">
          {c.nav.map(([id, l], i) => (
            <li key={id}>
              <a href={`#${id}`} onClick={close} aria-current={active === id ? 'true' : undefined} className="flex min-h-[62px] items-center gap-4 font-display text-[26px]">
                <span className="w-8 font-sans text-[12px] font-semibold text-brass-ink" aria-hidden>0{i + 1}</span>{l}
                {active === id && <span className="ml-auto h-2 w-2 rounded-full bg-brass" aria-hidden />}
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <div className="mt-8 flex flex-col gap-3">
        <a href={wa(c.waMsg)} target="_blank" rel="noopener" className="tap inline-flex items-center justify-center gap-2 rounded-full bg-forest px-5 font-semibold text-stone"><WaIcon />{c.waCta} {BIZ.mobile}</a>
        <a href={`tel:${BIZ.officeTel}`} className="tap inline-flex items-center justify-center rounded-full border border-forest/25 px-5 font-semibold">{c.contact.office} {BIZ.office}</a>
      </div>
    </div>
  )
}

const TIER: Record<number, string> = { 0: '#DAD9D2', 1: '#C9A15A', 2: '#C3C8C4', 3: '#E8D7AE' }

function Hero() {
  const { c, lang } = useI18n<Content>()
  return (
    <section id="top" className="grid-paper relative overflow-hidden bg-stone">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 pb-14 pt-12 sm:px-8 lg:grid-cols-12 lg:items-center lg:pb-20 lg:pt-20">
        <div className="lg:col-span-7">
          <Eyebrow>{c.hero.eyebrow}</Eyebrow>
          <h1 className={`mt-7 font-display leading-[1.02] tracking-[-0.01em] text-forest ${lang === 'ms' ? 'text-[clamp(2.3rem,7vw,4.9rem)]' : 'text-[clamp(2.5rem,7.6vw,5.4rem)]'}`}>
            <span className="block">{c.hero.h1a}</span><span className="block text-brass-ink">{c.hero.h1b}</span>
          </h1>
          <p className="mt-7 max-w-xl text-[17px] leading-relaxed text-moss sm:text-[18px]">{c.hero.sub}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#brief" className="tap inline-flex items-center justify-center gap-2 rounded-full bg-forest px-7 text-[16px] font-semibold text-stone transition hover:bg-forest-3">{c.hero.cta}<span aria-hidden>→</span></a>
            <a href="#work" className="tap inline-flex items-center justify-center rounded-full border border-forest/30 px-7 text-[16px] font-semibold text-forest transition hover:border-forest">{c.hero.cta2}</a>
          </div>
        </div>
        <div className="lg:col-span-5">
          <p className="mb-4 text-center text-[11.5px] font-semibold uppercase tracking-[0.3em] text-moss lg:text-left">{c.hero.plaquesTitle}</p>
          <ol className="grid grid-cols-2 gap-3 sm:gap-4">
            {c.plaques.map((p, i) => (
              <li key={p.project} className={`plaque ${i % 2 ? 'sm:translate-y-6' : ''}`}>
                <span className="block text-[9.5px] font-semibold uppercase tracking-[0.24em] text-stone/70">Atap · 2023</span>
                <span className="mt-3 block font-display text-[21px] leading-tight sm:text-[25px]" style={{ color: TIER[i] }}>{p.tier}</span>
                <span className="mt-2 block text-[13.5px] font-semibold leading-snug text-stone sm:text-[14.5px]">{p.project}</span>
                {p.place && <span className="mt-0.5 block text-[12.5px] text-moss-dark">{p.place}</span>}
              </li>
            ))}
          </ol>
        </div>
      </div>
      <dl className="mx-auto grid max-w-7xl grid-cols-2 border-t border-forest/15 px-5 sm:px-8 lg:grid-cols-4">
        {c.stats.map(([n, l], i) => (
          <div key={i} className={`flex flex-col-reverse gap-1.5 py-6 pr-4 ${i % 2 ? 'pl-4 border-l border-forest/10 lg:pl-6' : ''} ${i === 2 ? 'lg:border-l lg:border-forest/10 lg:pl-6' : ''} ${i > 1 ? 'border-t border-forest/10 lg:border-t-0' : ''}`}>
            <dt className="text-[13.5px] leading-snug text-moss">{l}</dt>
            <dd className="font-display text-[34px] leading-none text-forest sm:text-[42px]">{n}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function Clients() {
  const { c } = useI18n<Content>()
  return (
    <section aria-labelledby="clients-h" className="bg-paper">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
        <div className="flex flex-wrap items-end justify-between gap-3"><h2 id="clients-h" className="eyebrow text-brass-ink"><span className="h-px w-8 bg-brass-ink" aria-hidden />{c.clients.eyebrow}</h2><p className="text-[13px] text-moss">{c.clients.note}</p></div>
        <ul className="mt-8 grid grid-cols-2 border-l border-t border-forest/10 sm:grid-cols-3 lg:grid-cols-4">
          {CLIENTS.map(([n, p]) => (
            <li key={n} className="border-b border-r border-forest/10 p-4 sm:p-6">
              <p className="font-display text-[16px] leading-snug text-forest sm:text-[19px]">{n}</p>
              {p && <p className="mt-1.5 text-[12.5px] leading-snug text-moss sm:text-[13.5px]">{p}</p>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/** Hand-drawn style SVG scenes interpreting B&N's Mercure Miri design notes. */
function RoomArt({ id }: { id: RoomId }) {
  const swift = (x: number, y: number, s = 1) => <path key={`${x}-${y}`} d={`M${x} ${y} q ${6 * s} ${-5 * s} ${12 * s} 0 q ${6 * s} ${-5 * s} ${12 * s} 0`} fill="none" stroke="#EEEAE1" strokeWidth="2" strokeLinecap="round" />
  if (id === 'atoti') return (
    <svg viewBox="0 0 480 360" className="h-full w-full" aria-hidden>
      <rect width="480" height="360" fill="#0C211D" />
      <path d="M0 360 V150 C60 40 170 10 240 10 C310 10 420 40 480 150 V360 Z" fill="#1A3F37" />
      <ellipse cx="240" cy="330" rx="200" ry="40" fill="#C9A15A" opacity=".18" />
      {[[60, 120, 70], [100, 70, 110], [140, 45, 80], [180, 30, 130], [220, 22, 95], [260, 22, 150], [300, 30, 90], [340, 45, 120], [380, 70, 85], [420, 120, 60]].map(([x, y, h], i) => <path key={i} d={`M${x - 12} ${y} L${x} ${y + h} L${x + 12} ${y} Z`} fill={i % 3 ? '#24524A' : '#C9A15A'} opacity={i % 3 ? 1 : 0.85} />)}
      {[swift(150, 210), swift(210, 180, 1.2), swift(280, 225), swift(320, 190, 0.9), swift(250, 255, 0.8)]}
      <rect x="150" y="300" width="180" height="16" rx="8" fill="#C9A15A" opacity=".7" />
    </svg>
  )
  if (id === 'belian') return (
    <svg viewBox="0 0 480 360" className="h-full w-full" aria-hidden>
      <rect width="480" height="360" fill="#12302A" />
      {[[30, 34], [96, 22], [150, 40], [232, 26], [300, 44], [372, 24], [430, 36]].map(([x, w], i) => <rect key={i} x={x} y="0" width={w} height="360" fill={i % 2 ? '#1A3F37' : '#24524A'} />)}
      {[[60, 60, 70], [170, 30, 90], [260, 70, 60], [390, 40, 85], [460, 90, 50]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#2F6155" opacity=".75" />)}
      {[120, 210, 300, 390].map((x) => <g key={x}><line x1={x} y1="0" x2={x} y2="150" stroke="#C9A15A" strokeWidth="1.5" /><path d={`M${x - 18} 168 Q${x} 140 ${x + 18} 168 Z`} fill="#C9A15A" /></g>)}
      <rect x="70" y="250" width="340" height="14" rx="3" fill="#7A5A22" />
      <rect x="90" y="264" width="10" height="70" fill="#7A5A22" /><rect x="380" y="264" width="10" height="70" fill="#7A5A22" />
      <rect x="0" y="334" width="480" height="26" fill="#0C211D" />
    </svg>
  )
  if (id === 'terabai') return (
    <svg viewBox="0 0 480 360" className="h-full w-full" aria-hidden>
      <rect width="480" height="360" fill="#1A3F37" />
      <circle cx="240" cy="180" r="150" fill="#C9A15A" opacity=".12" />
      <path d="M240 30 C300 60 318 120 318 180 C318 240 300 300 240 330 C180 300 162 240 162 180 C162 120 180 60 240 30 Z" fill="#9E3B2E" stroke="#C9A15A" strokeWidth="4" />
      <path d="M240 60 C282 86 292 132 292 180 C292 228 282 274 240 300 C198 274 188 228 188 180 C188 132 198 86 240 60 Z" fill="none" stroke="#EEEAE1" strokeWidth="2.5" />
      <path d="M240 110 c24 0 30 30 10 36 c-18 6 -26 -16 -10 -20 M240 250 c-24 0 -30 -30 -10 -36 c18 -6 26 16 10 20 M206 180 c0 -24 30 -30 36 -10 c6 18 -16 26 -20 10 M274 180 c0 24 -30 30 -36 10 c-6 -18 16 -26 20 -10" fill="none" stroke="#EEEAE1" strokeWidth="3" strokeLinecap="round" />
      <circle cx="240" cy="180" r="9" fill="#C9A15A" />
      {[60, 110, 370, 420].map((x, i) => <g key={x}><line x1={x} y1="0" x2={x} y2={70 + (i % 2) * 30} stroke="#C9A15A" strokeWidth="1.5" /><circle cx={x} cy={78 + (i % 2) * 30} r="8" fill="#C9A15A" /></g>)}
    </svg>
  )
  if (id === 'rooms') return (
    <svg viewBox="0 0 480 360" className="h-full w-full" aria-hidden>
      <defs><pattern id="scales" width="14" height="10" patternUnits="userSpaceOnUse"><path d="M0 10 Q7 0 14 10" fill="none" stroke="#C9A15A" strokeWidth="1.3" opacity=".8" /></pattern></defs>
      <rect width="480" height="360" fill="#EEEAE1" />
      <rect width="480" height="170" fill="#9FC3BC" />
      <path d="M0 120 C80 80 140 110 200 70 C240 45 300 80 340 60 C400 30 440 70 480 50 V170 H0 Z" fill="#24524A" />
      <path d="M0 170 V95 L40 80 L70 120 L60 170 Z" fill="#7A5A22" />
      <rect x="120" y="120" width="240" height="90" rx="10" fill="#12302A" /><rect x="120" y="120" width="240" height="90" rx="10" fill="url(#scales)" />
      <rect x="100" y="200" width="280" height="56" rx="8" fill="#F8F6F1" stroke="#12302A" strokeOpacity=".15" />
      <path d="M60 300 C140 280 340 280 420 300 C440 320 420 345 400 350 C300 362 180 362 80 350 C60 345 40 320 60 300 Z" fill="#E3DDD0" />
      {[0, 1, 2, 3].map((k) => <path key={k} d={`M${90 + k * 14} ${318 - k * 3} C180 ${300 - k * 4} 300 ${300 - k * 4} ${390 - k * 14} ${318 - k * 3}`} fill="none" stroke="#24524A" strokeWidth="1.6" opacity=".55" />)}
    </svg>
  )
  return (
    <svg viewBox="0 0 480 360" className="h-full w-full" aria-hidden>
      <defs><linearGradient id="dusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3C2A4A" /><stop offset=".55" stopColor="#9E3B2E" /><stop offset="1" stopColor="#E8A85A" /></linearGradient></defs>
      <rect width="480" height="360" fill="url(#dusk)" />
      <circle cx="240" cy="250" r="80" fill="#F3C97A" />
      <path d="M0 0 H480 V360 H400 C400 200 340 120 240 120 C140 120 80 200 80 360 H0 Z" fill="#0C211D" />
      {[110, 150, 330, 370].map((x, i) => <path key={x} d={`M${x} 0 L${x + (i < 2 ? 10 : -10)} ${40 + (i % 2) * 25} L${x + (i < 2 ? 20 : -20)} 0 Z`} fill="#1A3F37" />)}
      <rect x="80" y="300" width="320" height="10" fill="#12302A" />
      {[140, 200, 280, 340].map((x) => <g key={x}><rect x={x - 2} y="310" width="4" height="40" fill="#12302A" /><rect x={x - 14} y="304" width="28" height="7" rx="3" fill="#12302A" /></g>)}
      {[[180, 160], [300, 170]].map(([x, y]) => <path key={x} d={`M${x} ${y} q 8 -6 16 0 q 8 -6 16 0`} fill="none" stroke="#0C211D" strokeWidth="2.5" strokeLinecap="round" />)}
    </svg>
  )
}

function Work() {
  const { c } = useI18n<Content>()
  const W = c.work
  const [room, setRoom] = useState<RoomId>('atoti')
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const n = e.key === 'ArrowRight' ? (i + 1) % ROOM_IDS.length : e.key === 'ArrowLeft' ? (i + ROOM_IDS.length - 1) % ROOM_IDS.length : -1
    if (n >= 0) { e.preventDefault(); setRoom(ROOM_IDS[n]); tabs.current[n]?.focus() }
  }
  const R = W.rooms[room]
  return (
    <section id="work" className="relative overflow-hidden bg-forest text-stone">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7"><Eyebrow dark>{W.eyebrow}</Eyebrow><h2 className="h2 mt-5 text-stone">{W.title}</h2></div>
          <div className="lg:col-span-5 lg:pt-10">
            <blockquote lang="en" className="font-display text-[19px] leading-snug text-stone sm:text-[21px]">{W.quote}</blockquote>
            <p className="mt-3 text-[13px] text-moss-dark">— {W.quoteBy}</p>
            <p className="mt-5 text-[15px] leading-relaxed text-moss-dark">{W.concept}</p>
          </div>
        </div>
        <div className="mt-12">
          <p id="room-pick" className="text-[12px] font-semibold uppercase tracking-[0.2em] text-moss-dark">{W.pick}</p>
          <div role="tablist" aria-labelledby="room-pick" className="mt-3 flex flex-wrap gap-2">
            {ROOM_IDS.map((id, i) => (
              <button key={id} ref={(el) => { tabs.current[i] = el }} role="tab" id={`tab-${id}`} aria-selected={room === id} aria-controls="room-panel" tabIndex={room === id ? 0 : -1} onClick={() => setRoom(id)} onKeyDown={(e) => onKey(e, i)}
                className={`tap rounded-full border px-4 text-[14.5px] font-semibold transition ${room === id ? 'border-brass bg-brass text-forest' : 'border-stone/20 text-stone hover:border-stone/60'}`}>
                {W.rooms[id].name}
              </button>
            ))}
          </div>
          <div id="room-panel" role="tabpanel" aria-labelledby={`tab-${room}`} className="mt-6 grid overflow-hidden rounded-[28px] border border-stone/12 bg-forest-2 lg:grid-cols-2">
            <div key={room} className="room-in aspect-[4/3] lg:aspect-auto lg:min-h-[400px]"><RoomArt id={room} /></div>
            <div className="flex flex-col p-7 sm:p-10">
              <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-brass">{R.kind}</p>
              <h3 className="mt-3 font-display text-[40px] leading-none sm:text-[52px]">{R.name}</h3>
              <p className="mt-6 max-w-md text-[16.5px] leading-relaxed text-stone/90">{R.text}</p>
              <ul className="mt-6 flex flex-wrap gap-2">{R.tags.map((t) => <li key={t} className="rounded-full border border-stone/20 px-3 py-1 text-[13px] text-stone/85">{t}</li>)}</ul>
              <p className="mt-auto pt-8 text-[12.5px] leading-snug text-moss-dark">{W.illus}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Projects() {
  const { c } = useI18n<Content>()
  const P = c.projects
  const [f, setF] = useState<'all' | Sector>('all')
  const [more, setMore] = useState(false)
  const keys: ('all' | Sector)[] = ['all', 'h', 'g', 'r', 'w', 's']
  const list = PROJECTS.map((p, i) => ({ ...p, no: i + 1 })).filter((p) => f === 'all' || p.s === f)
  const count = (k: 'all' | Sector) => (k === 'all' ? PROJECTS.length : PROJECTS.filter((p) => p.s === k).length)
  return (
    <section id="projects" className="bg-paper">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7"><Eyebrow>{P.eyebrow}</Eyebrow><h2 className="h2 mt-5">{P.title}</h2></div>
          <p className="text-[16px] leading-relaxed text-moss lg:col-span-5">{P.sub}</p>
        </div>
        <div role="group" aria-label={c.a11y.filter} className="mt-10 flex flex-wrap gap-2">
          {keys.map((k) => (
            <button key={k} type="button" aria-pressed={f === k} onClick={() => setF(k)} className={`tap inline-flex items-center gap-2 rounded-full border px-4 text-[14px] font-semibold transition ${f === k ? 'border-forest bg-forest text-stone' : 'border-forest/20 text-forest hover:border-forest'}`}>
              {P.filters[k]}<span className={`text-[12px] tabular-nums ${f === k ? 'text-stone/75' : 'text-moss'}`}>{count(k)}</span>
            </button>
          ))}
        </div>
        <p className="sr-only" aria-live="polite">{list.length} {P.count}</p>
        <ol className="mt-8 grid border-t border-forest/15 md:grid-cols-2 md:gap-x-10">
          {list.map((p, i) => (
            <li key={p.n} className={`flex min-h-[60px] items-center gap-4 border-b border-forest/10 py-3 ${!more && i >= 12 ? 'max-md:hidden' : ''}`}>
              <span className="w-10 shrink-0 text-[12px] font-semibold tabular-nums text-brass-ink">P{String(p.no).padStart(2, '0')}</span>
              <span className="flex-1 font-display text-[17px] leading-snug text-forest sm:text-[18.5px]">{p.n}</span>
              {p.a ? <span className={`award award-${p.a}`}>{P.awards[p.a]}</span> : p.s !== 'o' && <span className="hidden text-[12px] text-moss sm:inline">{P.filters[p.s]}</span>}
            </li>
          ))}
        </ol>
        {!more && list.length > 12 && <button type="button" onClick={() => setMore(true)} className="tap mt-6 w-full rounded-full border border-forest/25 px-5 text-[15px] font-semibold text-forest md:hidden">{P.showAll} ({list.length})</button>}
        <a href={wa(c.waMsg)} target="_blank" rel="noopener" className="mt-8 inline-flex min-h-[44px] items-center gap-2 text-[15px] font-semibold text-forest underline decoration-brass underline-offset-4"><WaIcon className="h-4 w-4" />{P.ask}</a>
      </div>
    </section>
  )
}

function Services() {
  const { c } = useI18n<Content>()
  const S = c.services
  return (
    <section id="services" className="bg-stone">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5"><Eyebrow>{S.eyebrow}</Eyebrow><h2 className="h2 mt-5">{S.title}</h2></div>
          <ol className="divide-y divide-forest/15 border-y border-forest/15 lg:col-span-7">
            {S.items.map(([t, d], i) => (
              <li key={t} className="grid grid-cols-[3.2rem_1fr] gap-x-4 py-7 sm:grid-cols-[4.5rem_1fr]">
                <span className="font-display text-[34px] leading-none text-brass-ink sm:text-[44px]" aria-hidden>0{i + 1}</span>
                <div><h3 className="font-display text-[22px] leading-tight text-forest sm:text-[26px]">{t}</h3><p className="mt-2 max-w-xl text-[15.5px] leading-relaxed text-moss">{d}</p></div>
              </li>
            ))}
          </ol>
        </div>
        <figure className="relative mt-16 overflow-hidden rounded-[28px] bg-forest">
          <img src={asset('images/lift-760.webp')} srcSet={`${asset('images/lift-760.webp')} 760w, ${asset('images/lift-1400.webp')} 1400w`} sizes="(min-width:1280px) 1216px, 92vw" width={1400} height={600} loading="lazy" decoding="async" alt={S.photoAlt} className="aspect-[21/9] w-full object-cover" />
          <figcaption className="absolute bottom-3 left-3 rounded-full bg-forest/85 px-3 py-1 text-[12px] font-medium text-stone">{c.illustrative}</figcaption>
        </figure>
        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          <div className="rounded-[28px] bg-paper p-7 sm:p-9 lg:col-span-7">
            <h3 className="font-display text-[24px] text-forest">{S.whyTitle}</h3>
            <dl className="mt-6 grid gap-6 sm:grid-cols-2">
              {S.why.map(([t, d]) => <div key={t} className="border-l-2 border-brass pl-4"><dt className="font-semibold text-forest">{t}</dt><dd className="mt-1 text-[14.5px] leading-relaxed text-moss">{d}</dd></div>)}
            </dl>
          </div>
          <div className="flex flex-col rounded-[28px] bg-forest p-7 text-stone sm:p-9 lg:col-span-5">
            <h3 className="font-display text-[24px]">{S.benefitsTitle}</h3>
            <ul className="mt-5 space-y-3">{S.benefits.map((b) => <li key={b} className="flex gap-3 text-[15px] leading-relaxed text-stone/90"><span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brass" aria-hidden />{b}</li>)}</ul>
            <p className="mt-auto border-t border-stone/15 pt-5 text-[13.5px] leading-relaxed text-moss-dark">{S.network}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function Awards() {
  const { c } = useI18n<Content>()
  const A = c.awards
  return (
    <section id="awards" className="bg-paper">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-12 lg:py-28">
        <div className="lg:col-span-4"><Eyebrow>{A.eyebrow}</Eyebrow><h2 className="h2 mt-5">{A.title}</h2></div>
        <ol className="relative lg:col-span-8">
          <span className="absolute bottom-3 left-[5.4rem] top-3 w-px bg-forest/15 sm:left-[7rem]" aria-hidden />
          {A.items.map(([y, t, d], i) => (
            <Reveal as="li" key={t} delay={i * 50} className="relative grid grid-cols-[5.4rem_1fr] gap-x-6 pb-9 last:pb-0 sm:grid-cols-[7rem_1fr]">
              <span className={`font-display leading-none text-[26px] sm:text-[32px] ${i === 0 ? 'text-brass-ink' : 'text-forest'}`}>{y}</span>
              <span className={`absolute left-[5.4rem] top-3 h-3 w-3 -translate-x-1/2 rounded-full border-2 sm:left-[7rem] ${i === 0 ? 'border-brass bg-brass' : 'border-forest/40 bg-paper'}`} aria-hidden />
              <div className="pl-2"><h3 className="font-display text-[20px] leading-snug text-forest sm:text-[23px]">{t}</h3><p className="mt-1.5 text-[15px] leading-relaxed text-moss">{d}</p></div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Brief() {
  const { c, lang } = useI18n<Content>()
  const B = c.brief
  const [type, setType] = useState(-1)
  const [scope, setScope] = useState(-1)
  const [when, setWhen] = useState(-1)
  const [loc, setLoc] = useState('')
  const [area, setArea] = useState('')
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [date, setDate] = useState('')
  useEffect(() => { setDate(new Intl.DateTimeFormat(lang === 'ms' ? 'ms-MY' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kuala_Lumpur' }).format(new Date())) }, [lang])
  const F = B.fields
  const v = (x: string) => x.trim() || B.blank
  const client = [name.trim(), company.trim()].filter(Boolean).join(', ')
  const rows: [string, string][] = [
    [F.project, type >= 0 ? B.types[type] : B.blank], [F.scope, scope >= 0 ? B.scopes[scope] : B.blank],
    [F.loc, v(loc)], [F.area, area.trim() ? `${area.trim()} ${B.sqft}` : B.blank],
    [F.when, when >= 0 ? B.whens[when] : B.blank], [F.client, v(client)],
  ]
  const msg = [B.msgHi, '', ...rows.filter(([, x]) => x !== B.blank).map(([k, x]) => `${k}: ${x}`), '', B.msgEnd].join('\n')
  const mail = `mailto:${BIZ.email}?subject=${encodeURIComponent(`${B.subject}${type >= 0 ? ` – ${B.types[type]}` : ''}`)}&body=${encodeURIComponent(msg)}`
  const pill = (on: boolean) => `tap inline-flex items-center justify-center rounded-full border px-4 text-[14.5px] font-semibold transition ${on ? 'border-forest bg-forest text-stone' : 'border-forest/20 bg-paper text-forest hover:border-forest'}`
  const group = (legend: string, opts: string[], val: number, set: (n: number) => void, name: string) => (
    <fieldset>
      <legend className="step">{legend}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {opts.map((t, i) => <label key={t} className={`radio ${pill(val === i)}`}><input type="radio" name={name} className="sr-only" checked={val === i} onChange={() => set(i)} />{t}</label>)}
      </div>
    </fieldset>
  )
  return (
    <section id="brief" className="grid-paper bg-stone">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7"><Eyebrow>{B.eyebrow}</Eyebrow><h2 className="h2 mt-5">{B.title}</h2><p className="mt-4 max-w-2xl text-[16.5px] leading-relaxed text-moss">{B.sub}</p></div>
          <figure className="relative overflow-hidden rounded-[24px] bg-stone-2 lg:col-span-4 lg:col-start-9">
            <img src={asset('images/samples-560.webp')} srcSet={`${asset('images/samples-560.webp')} 560w, ${asset('images/samples-900.webp')} 900w`} sizes="(min-width:1024px) 400px, 92vw" width={900} height={675} loading="lazy" decoding="async" alt={B.photoAlt} className="aspect-[4/3] w-full object-cover" />
            <figcaption className="absolute bottom-3 left-3 rounded-full bg-forest/85 px-3 py-1 text-[12px] font-medium text-stone">{c.illustrative}</figcaption>
          </figure>
        </div>
        <div className="mt-12 grid gap-10 lg:grid-cols-12">
          <form className="space-y-8 lg:col-span-6" onSubmit={(e) => e.preventDefault()}>
            {group(B.type, B.types, type, setType, 'type')}
            {group(B.scope, B.scopes, scope, setScope, 'scope')}
            {group(B.when, B.whens, when, setWhen, 'when')}
            <div className="grid gap-6 sm:grid-cols-2">
              <div><label htmlFor="loc" className="step">{B.loc}</label><input id="loc" value={loc} onChange={(e) => setLoc(e.target.value.slice(0, 60))} placeholder={B.locPh} className="field mt-3" /></div>
              <div><label htmlFor="area" className="step">{B.area}</label><input id="area" value={area} inputMode="numeric" onChange={(e) => setArea(e.target.value.replace(/[^\d,.]/g, '').slice(0, 9))} placeholder={B.areaPh} className="field mt-3" /></div>
              <div><label htmlFor="bname" className="step">{B.name}</label><input id="bname" value={name} onChange={(e) => setName(e.target.value.slice(0, 50))} autoComplete="name" className="field mt-3" /></div>
              <div><label htmlFor="company" className="step">{B.company}</label><input id="company" value={company} onChange={(e) => setCompany(e.target.value.slice(0, 60))} autoComplete="organization" className="field mt-3" /></div>
            </div>
          </form>
          <div className="lg:col-span-6">
            <div className="lg:sticky lg:top-24">
              <div className="titleblock bg-paper text-forest" aria-live="polite">
                <div className="grid grid-cols-[1fr_auto] border-b-2 border-forest">
                  <div className="p-4 sm:p-5"><Logo /></div>
                  <div className="flex flex-col justify-center border-l-2 border-forest px-4 text-right sm:px-5"><span className="tb-k">{F.sheet}</span><span className="font-display text-[20px] leading-none">BRIEF-01</span></div>
                </div>
                <dl className="grid grid-cols-2">
                  {rows.map(([k, x], i) => (
                    <div key={k} className={`min-h-[78px] border-b border-forest/30 p-4 sm:p-5 ${i % 2 ? 'border-l border-forest/30' : ''}`}>
                      <dt className="tb-k">{k}</dt><dd className={`mt-1.5 break-words text-[15px] font-semibold leading-snug ${x === B.blank ? 'text-moss/60' : ''}`}>{x}</dd>
                    </div>
                  ))}
                </dl>
                <div className="flex items-center justify-between gap-3 px-4 py-3 text-[12.5px] sm:px-5"><span><span className="tb-k mr-2">{F.date}</span>{date}</span><span className="text-moss">B&amp;N Design Associate</span></div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <a href={wa(msg)} target="_blank" rel="noopener" className="tap flex items-center justify-center gap-2 rounded-full bg-forest px-5 text-[15.5px] font-semibold text-stone transition hover:bg-forest-3"><WaIcon />{B.wa}</a>
                <a href={mail} className="tap flex items-center justify-center gap-2 rounded-full border border-forest/30 bg-paper px-5 text-[15.5px] font-semibold text-forest transition hover:border-forest">{B.mail}</a>
              </div>
              <p className="mt-3 text-center text-[13px] text-moss">{B.hint}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Contact() {
  const { c } = useI18n<Content>()
  const C = c.contact
  return (
    <section id="contact" className="bg-forest text-stone">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-12 lg:py-28">
        <div className="lg:col-span-6">
          <Eyebrow dark>{C.eyebrow}</Eyebrow>
          <h2 className="h2 mt-5 text-stone">{C.title}</h2>
          <div className="mt-6"><StatusPill dark /></div>
          <dl className="mt-10 grid gap-8 sm:grid-cols-2">
            <div><dt className="dt">{C.office}</dt><dd className="mt-2"><a href={`tel:${BIZ.officeTel}`} className="inline-flex min-h-[44px] items-center text-[17px] font-semibold hover:text-brass">{BIZ.office}</a></dd></div>
            <div><dt className="dt">{C.mobile}</dt><dd className="mt-2"><a href={wa(c.waMsg)} target="_blank" rel="noopener" className="inline-flex min-h-[44px] items-center gap-2 text-[17px] font-semibold hover:text-brass"><WaIcon className="h-4 w-4" />{BIZ.mobile}</a></dd></div>
            <div><dt className="dt">{C.email}</dt><dd className="mt-2"><a href={`mailto:${BIZ.email}`} className="inline-flex min-h-[44px] items-center break-all text-[16px] font-semibold hover:text-brass">{BIZ.email}</a></dd></div>
            <div><dt className="dt">{C.fax}</dt><dd className="mt-2 text-[16px]">{BIZ.fax}</dd></div>
            <div className="sm:col-span-2"><dt className="dt">{C.address}</dt><dd className="mt-2 text-[16px] leading-relaxed">{BIZ.address}</dd></div>
            <div className="sm:col-span-2"><dt className="dt">{C.hours}</dt><dd className="mt-2 text-[16px]">{C.hoursText}</dd></div>
          </dl>
        </div>
        <div className="lg:col-span-6">
          <a href={BIZ.maps} target="_blank" rel="noopener" className="group block overflow-hidden rounded-[28px] border border-stone/12 bg-forest-2">
            <svg viewBox="0 0 520 340" className="h-auto w-full" aria-hidden>
              <rect width="520" height="340" fill="#1A3F37" />
              <g stroke="#24524A" strokeWidth="1"><path d="M0 40H520M0 80H520M0 120H520M0 160H520M0 200H520M0 240H520M0 280H520M0 320H520M40 0V340M80 0V340M120 0V340M160 0V340M200 0V340M240 0V340M280 0V340M320 0V340M360 0V340M400 0V340M440 0V340M480 0V340" /></g>
              <g stroke="#2F6155" strokeWidth="16" fill="none" strokeLinecap="round"><path d="M-10 230 C140 200 300 250 530 190" /><path d="M170 -10 L230 350" /></g>
              <g fill="#24524A" stroke="#2F6155">{[[260, 90], [330, 90], [400, 90], [260, 150], [330, 150]].map(([x, y]) => <rect key={`${x}${y}`} x={x} y={y} width="56" height="42" rx="3" />)}</g>
              <rect x="330" y="150" width="56" height="42" rx="3" fill="#C9A15A" />
              <text x="358" y="177" textAnchor="middle" fontSize="15" fontFamily="Marcellus, serif" fill="#12302A">38-1</text>
              <text x="26" y="312" fill="#A9BDB5" fontSize="12" fontFamily="Hanken Grotesk, sans-serif" letterSpacing="2.5">RAMPAI BUSINESS PARK · 53300</text>
            </svg>
            <div className="flex items-center justify-between gap-4 p-5">
              <div><p className="font-display text-[19px]">B&amp;N Design Associate</p><p className="text-[13.5px] text-moss-dark">38-1, Jalan Rampai Niaga 4</p></div>
              <span className="shrink-0 rounded-full bg-brass px-3 py-1.5 text-[13px] font-semibold text-forest transition group-hover:bg-stone">{C.maps} ↗</span>
            </div>
          </a>
          <div className="mt-4 flex flex-wrap gap-x-6">
            <a href={BIZ.directions} target="_blank" rel="noopener" className="inline-flex min-h-[44px] items-center text-[15px] font-semibold text-brass underline decoration-brass/40 underline-offset-4 hover:decoration-brass">{C.directions} ↗</a>
            <a href={BIZ.facebook} target="_blank" rel="noopener" className="inline-flex min-h-[44px] items-center text-[15px] font-semibold text-brass underline decoration-brass/40 underline-offset-4 hover:decoration-brass">{C.facebook} ↗</a>
          </div>
        </div>
      </div>
    </section>
  )
}

function Faq() {
  const { c } = useI18n<Content>()
  return (
    <section id="faq" className="bg-paper">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-12 lg:py-28">
        <div className="lg:col-span-4"><Eyebrow>{c.faq.eyebrow}</Eyebrow><h2 className="h2 mt-5">{c.faq.title}</h2></div>
        <div className="divide-y divide-forest/10 border-y border-forest/10 lg:col-span-8">
          {c.faq.items.map(([q, a]) => (
            <details key={q} className="group">
              <summary className="flex min-h-[64px] cursor-pointer items-center justify-between gap-6 py-4 font-display text-[19px] text-forest sm:text-[21px]">
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
  return (
    <footer className="bg-[#0B201C] text-stone">
      <div className="mx-auto max-w-7xl px-5 pb-28 pt-14 sm:px-8 sm:pb-12">
        <div className="flex flex-col justify-between gap-10 lg:flex-row">
          <div><Logo light /><p className="mt-4 text-[14.5px] text-stone/75">{c.footer.tagline}</p></div>
          <ul className="grid gap-x-10 gap-y-1 text-[15px] sm:grid-cols-2">
            <li><a href={`tel:${BIZ.officeTel}`} className="inline-flex min-h-[44px] items-center hover:text-brass">{BIZ.office}</a></li>
            <li><a href={wa(c.waMsg)} target="_blank" rel="noopener" className="inline-flex min-h-[44px] items-center gap-2 hover:text-brass"><WaIcon className="h-4 w-4" />{BIZ.mobile}</a></li>
            <li><a href={`mailto:${BIZ.email}`} className="inline-flex min-h-[44px] items-center break-all hover:text-brass">{BIZ.email}</a></li>
            <li><a href={BIZ.facebook} target="_blank" rel="noopener" className="inline-flex min-h-[44px] items-center hover:text-brass">Facebook ↗</a></li>
            <li className="sm:col-span-2"><a href={BIZ.maps} target="_blank" rel="noopener" className="inline-flex min-h-[44px] items-center hover:text-brass">{BIZ.address} ↗</a></li>
          </ul>
          <a href="#top" className="tap inline-flex items-center gap-2 self-start rounded-full border border-stone/20 px-5 text-sm font-semibold transition hover:border-brass hover:text-brass">{c.footer.toTop} <span aria-hidden>↑</span></a>
        </div>
        <p className="mt-12 text-[12.5px] text-stone/70">{c.footer.note}</p>
        <div className="mt-6 flex flex-col gap-3 border-t border-stone/10 pt-6 text-[13px] text-stone/75 sm:flex-row sm:items-center sm:justify-between">
          <p>{c.footer.pitch}</p>
          <a href={PITCH_WA} target="_blank" rel="noopener" className="tap inline-flex shrink-0 items-center gap-2 font-semibold text-brass hover:text-stone"><WaIcon className="h-4 w-4" />{c.footer.pitchLink}</a>
        </div>
        <p className="mt-4 text-[12px] text-stone/60">© {new Date().getFullYear()} {BIZ.name} {c.footer.rights}</p>
      </div>
    </footer>
  )
}

function Fab() {
  const { c } = useI18n<Content>()
  const [show, setShow] = useState(false)
  useEffect(() => {
    const on = () => setShow(window.scrollY > window.innerHeight * 0.9)
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return (
    <a href={wa(c.waMsg)} target="_blank" rel="noopener" aria-label={c.a11y.fab} aria-hidden={!show} tabIndex={show ? 0 : -1} data-fab
      className={`fixed bottom-5 right-5 z-30 grid h-14 w-14 place-items-center rounded-full bg-forest text-stone shadow-[0_12px_30px_rgba(18,48,42,.4)] ring-2 ring-brass/60 transition duration-300 md:hidden ${show ? 'opacity-100' : 'pointer-events-none translate-y-4 opacity-0'}`}>
      <WaIcon className="h-6 w-6" />
    </a>
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
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-forest focus:px-4 focus:py-2 focus:text-stone">{c.a11y.skip}</a>
      <Header active={active} onMenu={() => setOpen((o) => !o)} menuOpen={open} btnRef={btnRef} />
      {open && <MobileMenu close={closeMenu} active={active} />}
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <Clients />
        <Work />
        <Projects />
        <Services />
        <Awards />
        <Brief />
        <Contact />
        <Faq />
      </main>
      <Footer />
      <Fab />
    </>
  )
}
