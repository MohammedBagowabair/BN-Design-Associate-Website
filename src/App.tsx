import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { asset, useI18n } from './i18n'
import { useActiveSection, useDialogFlag, useMenu } from './hooks'
import { useOpenStatus } from './hours'
import { Reveal } from './Reveal'
import { BIZ, CLIENTS, PROJECTS, ROOM_IDS, WEEK, type Content, type RoomId, type Sector } from './content'

const PITCH_WA = 'https://wa.me/601151198497'
const wa = (t: string) => `https://wa.me/${BIZ.wa}?text=${encodeURIComponent(t)}`
const IDS = ['work', 'projects', 'services', 'awards', 'brief', 'contact']
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

const TIER_COLOR = ['#E4E2DA', '#DCC08A', '#C9CFCB', '#EDE8DF']
const NUMERAL = ['I', 'II', 'III', 'IV']

function Hero() {
  const { c, lang } = useI18n<Content>()
  const [lead, ...rest] = c.plaques
  return (
    <section id="top" className="dark relative overflow-hidden bg-forest-deep text-stone">
      <div className="hero-glow pointer-events-none absolute inset-0" aria-hidden />
      <span className="amp pointer-events-none absolute -right-[4vw] top-[-2vw] hidden select-none text-[44vw] lg:block xl:text-[38vw]" aria-hidden>&amp;</span>
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
            <a href="#brief" className="tap lift inline-flex h-[52px] items-center justify-center gap-2.5 rounded-full bg-brass px-7 text-[16px] font-semibold text-forest-deep hover:bg-brass-light">{c.hero.cta}<span className="arrow-r"><Arrow /></span></a>
            <a href="#work" className="tap hidden items-center gap-2 text-[15.5px] font-medium text-stone underline decoration-brass/60 underline-offset-[6px] transition hover:decoration-brass sm:inline-flex">{c.hero.cta2}</a>
          </div>
        </div>
        <div className="lg:col-span-5 lg:pt-3">
          <section aria-label={c.a11y.ledger} className="relative">
            <div className="flex items-baseline justify-between border-b border-brass/50 pb-3 text-[11.5px] font-semibold uppercase tracking-[0.22em] text-brass"><span>Atap Design Award</span><span className="font-display text-[20px] normal-case tracking-normal">2023</span></div>
            <ol>
              <li className="grid grid-cols-[2.2rem_1fr] border-b border-stone/12 py-5 sm:py-6">
                <span className="pt-2 font-display text-[15px] italic text-brass" aria-hidden>{NUMERAL[0]}</span>
                <div>
                  <p className="font-display text-[44px] italic leading-none tracking-[-0.02em] sm:text-[56px]" style={{ color: TIER_COLOR[0] }}>{lead.tier}</p>
                  <p className="mt-3 text-[16px] font-medium text-stone">{lead.project}</p>
                  <p className="text-[14px] text-moss-dark">{lead.place}</p>
                </div>
              </li>
              {rest.map((p, i) => (
                <li key={p.tier} className="grid grid-cols-[2.2rem_1fr] items-baseline border-b border-stone/12 py-3.5 sm:py-4">
                  <span className="font-display text-[15px] italic text-brass" aria-hidden>{NUMERAL[i + 1]}</span>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
                    <p className="font-display text-[24px] leading-tight sm:text-[27px]" style={{ color: TIER_COLOR[i + 1] }}>{p.tier}</p>
                    <p className="text-[14px] text-moss-dark">{p.project}{p.place && <span className="text-stone/70">, {p.place}</span>}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>
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

/** Abstract plates: colour and texture fields drawn from B&N's notes for each space. */
function Plate({ id }: { id: RoomId }) {
  const g = `p-${id}`
  if (id === 'atoti') return (
    <svg viewBox="0 0 480 360" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id={g} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#081613" /><stop offset="1" stopColor="#24524A" /></linearGradient>
        <radialGradient id={`${g}r`} cx=".5" cy="1" r=".7"><stop offset="0" stopColor="#C9A15A" stopOpacity=".35" /><stop offset="1" stopColor="#C9A15A" stopOpacity="0" /></radialGradient>
      </defs>
      <rect width="480" height="360" fill={`url(#${g})`} />
      <path d="M40 360 V200 C40 90 140 40 240 40 C340 40 440 90 440 200 V360" fill="none" stroke="#C9A15A" strokeOpacity=".35" />
      <rect width="480" height="360" fill={`url(#${g}r)`} />
      {Array.from({ length: 30 }, (_, i) => { const x = 14 + i * 15.6; const h = 40 + ((i * 53) % 9) * 19 + (i % 2) * 14; return <g key={i}><line x1={x} y1="0" x2={x} y2={h} stroke="#C9A15A" strokeOpacity={0.35 + (i % 3) * 0.2} strokeWidth="1.1" /><circle cx={x} cy={h + 3} r="2" fill="#DCC08A" opacity=".85" /></g> })}
      {[[150, 230, 1], [214, 200, 1.3], [292, 244, 1], [330, 206, 0.8], [252, 270, 0.75]].map(([x, y, s]) => <path key={x} d={`M${x} ${y} q ${7 * s} ${-6 * s} ${14 * s} 0 q ${7 * s} ${-6 * s} ${14 * s} 0`} fill="none" stroke="#EDE8DF" strokeWidth="1.6" strokeLinecap="round" opacity=".85" />)}
    </svg>
  )
  if (id === 'belian') return (
    <svg viewBox="0 0 480 360" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <radialGradient id={g} cx=".55" cy=".35" r=".6"><stop offset="0" stopColor="#E8C98A" /><stop offset=".5" stopColor="#7A5A22" /><stop offset="1" stopColor="#12302A" /></radialGradient>
        <linearGradient id={`${g}s`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3A2614" /><stop offset=".5" stopColor="#5C3D1E" /><stop offset="1" stopColor="#2A1B0E" /></linearGradient>
      </defs>
      <rect width="480" height="360" fill={`url(#${g})`} />
      {Array.from({ length: 22 }, (_, i) => <rect key={i} x={i * 22 - 2} y="0" width={12 + (i % 3) * 2} height="360" fill={`url(#${g}s)`} />)}
      {[[90, 40, 70], [210, 10, 90], [330, 50, 80], [440, 20, 70]].map(([x, y, r]) => <circle key={x} cx={x} cy={y} r={r} fill="#1A3F37" opacity=".55" />)}
      <rect x="0" y="262" width="480" height="2" fill="#C9A15A" opacity=".8" />
      <rect x="0" y="264" width="480" height="96" fill="#12302A" opacity=".72" />
    </svg>
  )
  if (id === 'terabai') return (
    <svg viewBox="0 0 480 360" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs><radialGradient id={g} cx=".5" cy=".5" r=".75"><stop offset="0" stopColor="#B4483A" /><stop offset="1" stopColor="#4A1A14" /></radialGradient></defs>
      <rect width="480" height="360" fill={`url(#${g})`} />
      {[0, 1, 2, 3].map((k) => <path key={k} d={`M240 ${24 + k * 20} C${304 - k * 8} ${56 + k * 14} ${326 - k * 16} ${120 + k * 8} ${326 - k * 16} 180 C${326 - k * 16} ${240 - k * 8} ${304 - k * 8} ${304 - k * 14} 240 ${336 - k * 20} C${176 + k * 8} ${304 - k * 14} ${154 + k * 16} ${240 - k * 8} ${154 + k * 16} 180 C${154 + k * 16} ${120 + k * 8} ${176 + k * 8} ${56 + k * 14} 240 ${24 + k * 20} Z`} fill="none" stroke={k === 0 ? '#DCC08A' : '#EDE8DF'} strokeOpacity={k === 0 ? 1 : 0.55 - k * 0.1} strokeWidth={k === 0 ? 1.6 : 1} />)}
      <path d="M240 118 c22 0 28 28 9 34 c-16 6 -24 -14 -9 -18 M240 242 c-22 0 -28 -28 -9 -34 c16 -6 24 14 9 18 M208 180 c0 -22 28 -28 34 -9 c6 16 -14 24 -18 9 M272 180 c0 22 -28 28 -34 9 c-6 -16 14 -24 18 -9" fill="none" stroke="#DCC08A" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="240" cy="180" r="5" fill="#DCC08A" />
      {Array.from({ length: 9 }, (_, i) => <line key={i} x1={30 + i * 6} y1="0" x2={30 + i * 6} y2="360" stroke="#DCC08A" strokeOpacity=".18" />)}
      {Array.from({ length: 9 }, (_, i) => <line key={`r${i}`} x1={402 + i * 6} y1="0" x2={402 + i * 6} y2="360" stroke="#DCC08A" strokeOpacity=".18" />)}
    </svg>
  )
  if (id === 'rooms') return (
    <svg viewBox="0 0 480 360" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id={g} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#B9D3CC" /><stop offset="1" stopColor="#7FA8A0" /></linearGradient>
        <pattern id={`${g}p`} width="16" height="11" patternUnits="userSpaceOnUse"><path d="M0 11 Q8 0 16 11" fill="none" stroke="#C9A15A" strokeWidth="1" /></pattern>
      </defs>
      <rect width="480" height="150" fill={`url(#${g})`} />
      <path d="M0 112 C70 84 130 104 190 72 C240 48 300 82 350 62 C400 42 440 66 480 52 V150 H0 Z" fill="#24524A" />
      <path d="M0 132 C90 116 160 136 240 122 C330 108 400 132 480 118 V150 H0 Z" fill="#12302A" />
      <rect y="150" width="480" height="58" fill="#12302A" /><rect y="150" width="480" height="58" fill={`url(#${g}p)`} opacity=".7" />
      <rect y="208" width="480" height="152" fill="#E2DBCE" />
      {Array.from({ length: 7 }, (_, k) => <path key={k} d={`M${40 + k * 10} ${330 - k * 9} C160 ${286 - k * 10} 320 ${286 - k * 10} ${440 - k * 10} ${330 - k * 9}`} fill="none" stroke="#24524A" strokeWidth="1.1" opacity={0.65 - k * 0.07} />)}
    </svg>
  )
  return (
    <svg viewBox="0 0 480 360" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs><linearGradient id={g} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3C2A4A" /><stop offset=".55" stopColor="#B04A35" /><stop offset="1" stopColor="#ECB063" /></linearGradient></defs>
      <rect width="480" height="360" fill={`url(#${g})`} />
      <circle cx="240" cy="262" r="70" fill="#F6D08A" opacity=".95" />
      {[0, 1, 2].map((k) => <line key={k} x1="60" x2="420" y1={300 + k * 16} y2={300 + k * 16} stroke="#F6D08A" strokeOpacity={0.5 - k * 0.15} />)}
      <path d="M0 0 H480 V360 H410 C410 196 340 112 240 112 C140 112 70 196 70 360 H0 Z" fill="#0A1B18" />
      {[100, 128, 158, 322, 352, 380].map((x, i) => <line key={x} x1={x} y1="0" x2={x} y2={70 + (i % 3) * 26} stroke="#24524A" strokeWidth="1.4" />)}
      {[[188, 168], [292, 182]].map(([x, y]) => <path key={x} d={`M${x} ${y} q 8 -6 16 0 q 8 -6 16 0`} fill="none" stroke="#0A1B18" strokeWidth="2" strokeLinecap="round" />)}
    </svg>
  )
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
              <div key={room} className="plate-in relative aspect-[4/3] overflow-hidden rounded-[22px] ring-1 ring-stone/10"><Plate id={room} />
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
              <p className="mt-6 text-[12.5px] text-moss-dark">{W.illus}</p>
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
                  <div className="relative aspect-[4/3]"><Plate id={id} /><span className="absolute left-3 top-3 rounded-full bg-forest-deep/80 px-2.5 py-0.5 font-display text-[13px] italic text-brass-light">0{i + 1} / 05</span></div>
                  <div className="p-5">
                    <p className="text-[11.5px] font-semibold uppercase tracking-[0.18em] text-brass">{X.kind}</p>
                    <h3 className="mt-1.5 font-display text-[30px] leading-none tracking-[-0.01em]">{X.name}</h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-stone/90">{X.text}</p>
                  </div>
                </li>
              )
            })}
          </Rail>
          <p className="mt-4 text-[12.5px] text-moss-dark">{W.illus}</p>
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
          <img src={asset('images/lift-760.webp')} srcSet={`${asset('images/lift-760.webp')} 760w, ${asset('images/lift-1400.webp')} 1400w`} sizes="(min-width:1280px) 1216px, 92vw" width={1400} height={600} loading="lazy" decoding="async" alt={S.photoAlt} className="aspect-[16/10] w-full object-cover sm:aspect-[21/8]" />
          <figcaption className="absolute bottom-3 left-3 rounded-full bg-forest-deep/85 px-3 py-1 text-[12px] font-medium text-stone">{c.illustrative}</figcaption>
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
  const pill = (on: boolean) => `tap inline-flex items-center justify-center rounded-full border px-3.5 text-[14px] font-medium transition ${on ? 'border-forest bg-forest text-stone' : 'border-forest/20 bg-paper text-forest hover:border-forest'}`
  const group = (legend: string, opts: string[], val: number, set: (n: number) => void, nm: string, no: number) => (
    <fieldset>
      <legend className="step"><span className="mr-2 font-display italic text-brass-ink">0{no}</span>{legend}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {opts.map((t, i) => <label key={t} className={`radio ${pill(val === i)}`}><input type="radio" name={nm} className="sr-only" checked={val === i} onChange={() => set(i)} />{t}</label>)}
      </div>
    </fieldset>
  )
  return (
    <section id="brief" className="bg-stone">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
        <div className="max-w-3xl"><Eyebrow>{B.eyebrow}</Eyebrow><h2 className="h2 mt-5">{B.title}</h2><p className="mt-4 max-w-2xl text-[16.5px] leading-relaxed text-moss">{B.sub}</p></div>
        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-14">
          <form className="space-y-7 lg:col-span-7" onSubmit={(e) => e.preventDefault()}>
            {group(B.type, B.types, type, setType, 'type', 1)}
            {group(B.scope, B.scopes, scope, setScope, 'scope', 2)}
            {group(B.when, B.whens, when, setWhen, 'when', 3)}
            <div className="grid grid-cols-2 gap-x-4 gap-y-5">
              <div className="min-w-0"><label htmlFor="loc" className="step">{B.loc}</label><input id="loc" value={loc} onChange={(e) => setLoc(e.target.value.slice(0, 60))} placeholder={B.locPh} className="field mt-2.5" /></div>
              <div className="min-w-0"><label htmlFor="area" className="step">{B.area}</label><input id="area" value={area} inputMode="numeric" onChange={(e) => setArea(e.target.value.replace(/[^\d,.]/g, '').slice(0, 9))} placeholder={B.areaPh} className="field mt-2.5" /></div>
              <div className="min-w-0"><label htmlFor="bname" className="step">{B.name}</label><input id="bname" value={name} onChange={(e) => setName(e.target.value.slice(0, 50))} autoComplete="name" className="field mt-2.5" /></div>
              <div className="min-w-0"><label htmlFor="company" className="step">{B.company}</label><input id="company" value={company} onChange={(e) => setCompany(e.target.value.slice(0, 60))} autoComplete="organization" className="field mt-2.5" /></div>
            </div>
          </form>
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <div className="titleblock bg-paper text-forest" aria-live="polite">
                <div className="grid grid-cols-[1fr_auto] border-b-2 border-forest">
                  <div className="p-4 sm:p-5"><Logo /></div>
                  <div className="flex flex-col justify-center border-l-2 border-forest px-4 text-right sm:px-5"><span className="tb-k">{F.sheet}</span><span className="font-display text-[20px] leading-none">BRIEF-01</span></div>
                </div>
                <dl className="grid grid-cols-2">
                  {rows.map(([k, x], i) => (
                    <div key={k} className={`min-h-[74px] min-w-0 border-b border-forest/30 p-4 ${i % 2 ? 'border-l border-forest/30' : ''}`}>
                      <dt className="tb-k">{k}</dt><dd className={`mt-1.5 break-words text-[15px] font-medium leading-snug ${x === B.blank ? 'text-moss/60' : ''}`}>{x}</dd>
                    </div>
                  ))}
                </dl>
                <div className="flex items-center justify-between gap-3 px-4 py-3 text-[12.5px]"><span><span className="tb-k mr-2">{F.date}</span>{date}</span><span className="text-moss">B&amp;N Design Associate</span></div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <a href={wa(msg)} target="_blank" rel="noopener" className="tap lift flex h-[52px] items-center justify-center gap-2 rounded-full bg-forest px-5 text-[15.5px] font-semibold text-stone hover:bg-forest-3"><WaIcon />{B.wa}</a>
                <a href={mail} className="tap lift flex h-[52px] items-center justify-center gap-2 rounded-full border border-forest/30 bg-paper px-5 text-[15.5px] font-semibold text-forest hover:border-forest">{B.mail}</a>
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
  const link = 'inline-flex min-h-[44px] items-center gap-2 text-[17px] font-medium transition hover:text-brass-light'
  return (
    <section id="contact" className="dark bg-forest text-stone">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-12 lg:py-24">
        <div className="lg:col-span-7">
          <Eyebrow dark>{C.eyebrow}</Eyebrow>
          <h2 className="h2 mt-5 text-stone">{C.title}</h2>
          <div className="mt-6"><StatusPill dark /></div>
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
          <a href={BIZ.maps} target="_blank" rel="noopener" className="group block overflow-hidden rounded-[22px] bg-forest-2 ring-1 ring-stone/10">
            <svg viewBox="0 0 520 320" className="h-auto w-full" aria-hidden>
              <rect width="520" height="320" fill="#1A3F37" />
              <g stroke="#24524A" strokeWidth="1"><path d="M0 40H520M0 80H520M0 120H520M0 160H520M0 200H520M0 240H520M0 280H520M40 0V320M80 0V320M120 0V320M160 0V320M200 0V320M240 0V320M280 0V320M320 0V320M360 0V320M400 0V320M440 0V320M480 0V320" /></g>
              <g stroke="#2F6155" strokeWidth="14" fill="none" strokeLinecap="round"><path d="M-10 220 C140 190 300 240 530 180" /><path d="M170 -10 L230 330" /></g>
              <g fill="#24524A" stroke="#2F6155">{[[260, 80], [330, 80], [400, 80], [260, 140], [330, 140]].map(([x, y]) => <rect key={`${x}${y}`} x={x} y={y} width="56" height="42" rx="3" />)}</g>
              <rect x="330" y="140" width="56" height="42" rx="3" fill="#C9A15A" />
              <text x="358" y="167" textAnchor="middle" fontSize="16" fontStyle="italic" fontFamily="Newsreader, serif" fill="#0E2420">38-1</text>
              <text x="26" y="296" fill="#A9BDB5" fontSize="12" fontFamily="Geist, sans-serif" letterSpacing="2.5">RAMPAI BUSINESS PARK · 53300</text>
            </svg>
            <div className="flex items-center justify-between gap-4 p-5">
              <div><p className="font-display text-[20px]">B&amp;N Design Associate</p><p className="text-[13.5px] text-moss-dark">38-1, Jalan Rampai Niaga 4</p></div>
              <span className="shrink-0 rounded-full bg-brass px-3 py-1.5 text-[13px] font-semibold text-forest-deep transition group-hover:bg-stone">{C.maps} ↗</span>
            </div>
          </a>
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
  return (
    <footer className="bg-forest-night text-stone">
      <div className="mx-auto max-w-7xl px-5 pb-28 pt-14 sm:px-8 lg:pb-12">
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
        <p className="mt-12 text-[12.5px] leading-relaxed text-stone/70">{c.footer.note}</p>
        <div className="mt-6 flex flex-col gap-3 border-t border-stone/10 pt-6 text-[13px] text-stone/75 sm:flex-row sm:items-center sm:justify-between">
          <p>{c.footer.pitch}</p>
          <a href={PITCH_WA} target="_blank" rel="noopener" className="tap inline-flex shrink-0 items-center gap-2 font-semibold text-brass hover:text-stone"><WaIcon className="h-4 w-4" />{c.footer.pitchLink}</a>
        </div>
        <p className="mt-4 text-[12px] text-stone/60">© {new Date().getFullYear()} {BIZ.name} {c.footer.rights}</p>
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
        <a href="#brief" tabIndex={t} className="inline-flex h-12 items-center justify-center rounded-full border border-stone/25 text-[15px] font-semibold text-stone">{c.briefCta}</a>
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
        <Projects />
        <Services />
        <Awards />
        <Brief />
        <Contact />
        <Faq />
      </main>
      <Footer />
      <MobileBar />
    </>
  )
}
