'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ArrowDown, ArrowUpRight, CalendarDays, Check, MapPin, Pause, Play, Share2, Volume2, VolumeX } from 'lucide-react'
import { invitationData as data } from '@/lib/invitation-data'

type AudioState = 'off' | 'playing' | 'paused' | 'error'

function RsvpButton({ className = '' }: { className?: string }) {
  const href = `https://wa.me/${data.whatsappNumber}?text=${encodeURIComponent(data.whatsappMessage)}`
  return <a className={`button button-gold ${className}`} href={href} target="_blank" rel="noreferrer"><span>Confirmar asistencia</span><ArrowUpRight aria-hidden="true" size={16} /></a>
}

function AudioController({ opened, pauseRequest, spotifyVisible }: { opened: boolean; pauseRequest: number; spotifyVisible: boolean }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [state, setState] = useState<AudioState>('off')
  const [muted, setMuted] = useState(false)
  const toggle = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) return
    if (state === 'playing') { audio.pause(); setState('paused'); return }
    try { await audio.play(); setState('playing') } catch { setState('error') }
  }, [state])
  useEffect(() => {
    if (!opened || !audioRef.current) return
    void audioRef.current.play().then(() => setState('playing')).catch(() => setState('error'))
  }, [opened])
  useEffect(() => {
    if (!pauseRequest || !audioRef.current) return
    audioRef.current.pause()
    setState((current) => current === 'playing' ? 'paused' : current)
  }, [pauseRequest])
  return <div className="audio-control"><audio ref={audioRef} src={data.audioUrl} loop preload="none" onError={() => setState('error')} onEnded={() => setState('paused')} />
    <button className="audio-button" type="button" disabled={spotifyVisible} onClick={() => { if (state === 'error' || state === 'off') void toggle(); else if (state === 'playing') void toggle(); else void toggle() }} aria-label={spotifyVisible ? 'Spotify está activo' : state === 'playing' ? 'Pausar música' : 'Reproducir música'} title={spotifyVisible ? 'La música ambiente está pausada mientras Spotify está visible' : state === 'error' ? 'Música próximamente' : state === 'playing' ? 'Pausar música' : 'Reproducir música'}>
      {state === 'playing' ? <Pause size={15} /> : <Play size={15} />}
    </button>
    <span className="audio-label">{state === 'error' ? 'Música próximamente' : state === 'playing' ? 'En la pista' : 'Música'}</span>
    <button className="mute-button" type="button" aria-label={muted ? 'Activar sonido' : 'Silenciar música'} onClick={() => { const next = !muted; setMuted(next); if (audioRef.current) audioRef.current.muted = next }}><span className="sr-only">{muted ? 'Activar sonido' : 'Silenciar música'}</span>{muted ? <VolumeX size={15} /> : <Volume2 size={15} />}</button>
  </div>
}

function EnvelopeIntro({ onOpen }: { onOpen: () => void }) {
  const [opening, setOpening] = useState(false)
  const open = () => { if (opening) return; setOpening(true); onOpen() }
  return <div className={`intro ${opening ? 'intro-opening' : ''}`} aria-hidden={opening}>
    <div className="intro-grain" />
    <div className="intro-content">
      <p className="eyebrow">UNA INVITACIÓN PERSONAL</p>
      <button className="envelope-button" type="button" aria-label="Abrir invitación" onClick={open}>
        <span className="envelope-letter"><span className="letter-small">PARA UNA NOCHE ESPECIAL</span><span className="letter-y">Y</span><span className="letter-rule" /></span>
        <span className="envelope-body"><span className="envelope-fold" /><span className="seal">Y</span></span>
      </button>
      <h1 className="intro-title">Tienes una invitación <em>especial</em></h1>
      <p className="intro-hint">Haz clic para abrir <span>·</span> Entra a la noche</p>
    </div>
    <button className="skip-intro" type="button" onClick={() => { setOpening(true); onOpen() }}>Saltar intro <ArrowUpRight size={13} /></button>
    <span className="intro-index">01 / UNA NOCHE · JIUTEPEC</span>
  </div>
}

function HeroSection({ onScroll, opened, pauseRequest, spotifyVisible }: { onScroll: () => void; opened: boolean; pauseRequest: number; spotifyVisible: boolean }) {
  return <section className="hero section-dark" id="inicio">
    <div className="hero-image" aria-hidden="true" style={{ backgroundImage: `url(${data.heroImage})` }} />
    <div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" /><div className="spotlight" />
    <div className="hero-topline"><span>INVITACIÓN · 06 DICIEMBRE 2026</span><span>JIUTEPEC <i>✳</i> 19°26&apos; N</span></div>
    <div className={`hero-copy ${opened ? 'hero-revealed' : ''}`}>
      <p className="eyebrow"><span className="eyebrow-dash" />UNA NOCHE PARA CELEBRAR</p>
      <h1>{data.honoreeName}<span className="hero-period">.</span></h1>
      <p className="hero-subtitle">La vida tiene mejores pasos<br className="desktop-break" /> cuando se comparte.</p>
      <div className="hero-details"><span>{data.dateLabel}</span><i /><span>{data.timeLabel}</span></div>
      <button className="discover-link" type="button" onClick={onScroll}>Descubrir la noche <ArrowDown size={15} /></button>
    </div>
    <div className="hero-side-note"><span>SU PISTA, SU MOVIMIENTO</span><b>01</b></div>
    <div className="hero-bottom"><span>BAILE · ENCUENTRO · CELEBRACIÓN</span><span className="scroll-mark">DESLIZA <span>↓</span></span><span>26° · 8PM</span></div>
    <AudioController opened={opened} pauseRequest={pauseRequest} spotifyVisible={spotifyVisible} />
  </section>
}

function EditorialQuote() { return <section className="quote-section section-cream" id="la-noche"><div className="quote-index">02 <span>—</span> EL MOVIMIENTO</div><div className="quote-layout"><div className="quote-mark">“</div><div><h2>Hay quien<br />camina.<br /><em>Ella baila.</em></h2><svg className="dance-line" viewBox="0 0 380 70" fill="none" aria-hidden="true"><path d="M2 50C61 57 74 12 129 18c53 5 36 54 92 39 49-13 43-48 91-43 27 3 44 15 66 5" stroke="currentColor" strokeWidth="1.2" pathLength="1" /></svg><p className="quote-support">Una celebración para compartir el ritmo, los abrazos y todas esas canciones que merecen una pista.</p></div><div className="quote-side">EL CUERPO<br />RECUERDA<br />EL RITMO</div></div><div className="quote-footer"><span>UNA VIDA EN MOVIMIENTO</span><span>✳</span><span>JIUTEPEC · 2026</span></div></section> }

function PersonalPhotoSection() {
  return <section className="personal-photo-section section-cream">
    <div className="personal-photo-copy">
      <span className="eyebrow">03 / LA PROTAGONISTA</span>
      <h2>Una vida<br />en <em>movimiento.</em></h2>
      <p>La celebración también vive en los momentos sencillos, en las sonrisas y en las ganas de seguir disfrutando cada paso.</p>
      <span className="personal-photo-note">UN MOMENTO PARA RECORDAR</span>
    </div>
    <figure className="personal-photo-frame">
      <Image
        src="/yadiBaile01.jpeg"
        alt="Yadi disfrutando un momento al aire libre con los brazos levantados"
        width={1080}
        height={1409}
        sizes="(max-width: 700px) 88vw, 42vw"
      />
      <figcaption>YADI · SIEMPRE EN MOVIMIENTO</figcaption>
    </figure>
  </section>
}

function CountdownSection() {
  const [remaining, setRemaining] = useState<number | null>(null)
  useEffect(() => { const update = () => setRemaining(new Date(data.dateISO).getTime() - Date.now()); update(); const timer = window.setInterval(update, 1000); return () => window.clearInterval(timer) }, [])
  const start = new Date(data.dateISO).getTime(); const end = start + 4 * 60 * 60 * 1000
  const status = remaining === null ? 'loading' : remaining > 0 ? 'before' : Date.now() < end ? 'arrived' : 'ended'
  const total = Math.max(0, remaining ?? 0)
  const values = [Math.floor(total / 86400000), Math.floor(total / 3600000) % 24, Math.floor(total / 60000) % 60, Math.floor(total / 1000) % 60]
  return <section className="countdown-section section-dark"><div className="countdown-header"><span className="eyebrow"><span className="eyebrow-dash" />MARCA EL COMPÁS</span><span>03 / 06</span></div><div className="countdown-main"><p className="countdown-beat">5 <i>·</i> 6 <i>·</i> 7 <i>·</i> 8</p><h2>{status === 'arrived' ? 'La noche llegó' : status === 'ended' ? 'Gracias por compartir la pista' : 'Faltan pocos pasos para encontrarnos en la pista.'}</h2>{status === 'before' && <div className="countdown-grid" aria-label="Cuenta regresiva">{values.map((value, index) => <div className="count-unit" key={index}><span className="count-number">{String(value).padStart(2, '0')}</span><span className="count-label">{['DÍAS', 'HORAS', 'MINUTOS', 'SEGUNDOS'][index]}</span></div>)}</div>}</div><div className="countdown-footer"><span>EL TIEMPO TAMBIÉN BAILA</span><span>✳</span><span>14 · 03 · 26</span></div></section>
}

const schedule = [
  ['8:00 PM', 'Bienvenida, abrazos y primeros brindis.'],
  ['8:45 PM', 'A celebrar a Yadi.'],
  ['9:15 PM', 'Música y pista abierta.'],
  ['10:30 PM', 'Pastel, fotografías y recuerdos.'],
]
function NightSchedule() { return <section className="schedule-section section-cream"><div className="section-heading"><span className="eyebrow">04 / EL PROGRAMA</span><h2>El ritmo<br /><em>de la noche</em></h2><p>Una noche sin prisa, con espacio<br />para cada canción.</p></div><div className="schedule-list">{schedule.map(([time, text], index) => <article className="schedule-item" key={time}><span className="schedule-no">0{index + 1}</span><span className="schedule-time">{time}</span><span className="schedule-text">{text}</span><span className="schedule-star">✳</span></article>)}</div><div className="schedule-endnote">EL MEJOR MOMENTO ES EL QUE BAILAMOS JUNTOS.</div></section> }

function VenueSection() { return <section className="venue-section section-dark" id="lugar"><div className="venue-top"><span className="eyebrow"><span className="eyebrow-dash" />05 / EL LUGAR</span><span>UNA DIRECCIÓN, MIL RECUERDOS</span></div><div className="venue-layout"><div className="venue-info"><h2>Nos vemos<br />en <em>la pista.</em></h2><span className="venue-rule" /><h3>{data.venueName}</h3><p>{data.venueAddress}</p><p className="venue-date">{data.dateLabel}<br />{data.timeLabel}</p><a className="button button-outline" href={data.mapUrl} target="_blank" rel="noreferrer"><MapPin size={16} />Abrir en mapas <ArrowUpRight size={15} /></a><p className="venue-note">Referencia: a pasos del corazón de la ciudad.<br />Estacionamiento disponible en la zona.</p></div><div className="venue-ticket"><div className="map-art" aria-hidden="true"><div className="map-grid" /><svg viewBox="0 0 440 340" preserveAspectRatio="xMidYMid slice"><path d="M-12 243C64 201 93 289 166 222S260 118 321 156s87 7 139-33" /><path d="M2 103c61 35 92-10 149 20s63 95 130 82 83-48 159-29" /><path d="M104-20c-8 66 31 73 17 143s-32 91-8 150 18 52 22 103" /><path d="M314-18c-25 50 15 78-11 127s-42 74-25 125 32 75 22 128" /></svg><div className="map-pin"><MapPin size={20} /><span>RITMO</span></div><span className="map-north">N<br />↑</span></div><div className="ticket-bottom"><span>Mi Casa</span><span>19°26&apos; N · 99°08&apos; O</span></div></div></div></section> }

function DressCodeSection() { return <section className="dress-section section-cream"><span className="eyebrow">06 / EL ESTILO</span><div className="dress-frame"><div className="dress-orbit" /><span className="dress-number">✳</span><div><p className="dress-kicker">UNA PISTA PARA SER TÚ</p><h2>Elegante con<br /><em>movimiento</em></h2><p>Ven como te sientas increíble. Tacones de baile, zapatos cómodos o cualquier look que te permita disfrutar la pista.</p></div><span className="dress-side">SIN REGLAS,<br />CON RITMO.</span></div></section> }

function PlaylistSection({ onEngage, onVisibilityChange }: { onEngage: () => void; onVisibilityChange: (visible: boolean) => void }) {
  const sectionRef = useRef<HTMLElement>(null)
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const observer = new IntersectionObserver(([entry]) => {
      const visible = entry.isIntersecting
      onVisibilityChange(visible)
      if (visible) onEngage()
    }, { threshold: 0.35 })
    observer.observe(section)
    return () => observer.disconnect()
  }, [onEngage, onVisibilityChange])

  return <section ref={sectionRef} className="playlist-section section-dark">
    <div className="playlist-copy">
      <span className="eyebrow"><span className="eyebrow-dash" />EL PRIMER COMPÁS</span>
      <h2>La música<br /><em>de la noche</em></h2>
      <p>Toda celebración tiene una canción que la hace comenzar.</p>
    </div>
    <div className="spotify-embed" onPointerDown={onEngage} onFocusCapture={onEngage}>
      <iframe
        title="Playlist de Spotify para la celebración de Yadi"
        src="https://open.spotify.com/embed/playlist/0I3nH7lUGgcv06GrW1fVZx?utm_source=generator&si=943e9645c7bc4e05"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
      <p className="spotify-note">Al reproducir Spotify, la música de ambiente se pausará.</p>
    </div>
  </section>
}

function RsvpSection() { const [song, setSong] = useState(''); const [sent, setSent] = useState(false); return <section className="rsvp-section section-cream" id="confirmacion"><div className="rsvp-decoration">Y</div><span className="eyebrow">07 / TU LUGAR EN LA PISTA</span><h2>¿Nos acompañas<br />a <em>celebrar?</em></h2><p>Confirma tu lugar en la pista.</p><RsvpButton className="rsvp-main-button" /><div className="song-prompt"><label htmlFor="song">¿Cuál es tu canción para bailar?</label><div className="song-input-row"><input id="song" value={song} onChange={(event) => { setSong(event.target.value); setSent(false) }} placeholder="Una canción que no puede faltar…" /><button onClick={() => { if (song.trim()) setSent(true) }} aria-label="Enviar sugerencia de canción"><ArrowUpRight size={17} /></button></div><span className="song-feedback" aria-live="polite">{sent ? <><Check size={13} /> Gracias, la agregaremos a la playlist.</> : 'Una sugerencia para la pista; no se guardará en un servidor.'}</span></div><span className="rsvp-endnote">LA NOCHE NO SERÁ IGUAL SIN TI</span></section> }

function ClosingSection() {
  const [message, setMessage] = useState('')
  const makeIcs = () => { const start = new Date(data.dateISO); const finish = new Date(start.getTime() + 4 * 60 * 60 * 1000); const format = (date: Date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''); const content = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Yadi//Invitacion//ES\nBEGIN:VEVENT\nUID:yadi-${start.getTime()}@invitacion\nDTSTAMP:${format(new Date())}\nDTSTART:${format(start)}\nDTEND:${format(finish)}\nSUMMARY:${data.eventTitle} — ${data.honoreeName}\nLOCATION:${data.venueName}, ${data.venueAddress}\nDESCRIPTION:${data.whatsappMessage}\nEND:VEVENT\nEND:VCALENDAR`; const url = URL.createObjectURL(new Blob([content], { type: 'text/calendar;charset=utf-8' })); const link = document.createElement('a'); link.href = url; link.download = 'noche-para-celebrar.ics'; link.click(); URL.revokeObjectURL(url); setMessage('Tu archivo de calendario está listo.') }
  const share = async () => { const shareData = { title: `${data.eventTitle} · ${data.honoreeName}`, text: `${data.dateLabel} · ${data.timeLabel} · ${data.venueName}`, url: window.location.href }; try { if (navigator.share) await navigator.share(shareData); else { await navigator.clipboard.writeText(window.location.href); setMessage('Enlace copiado para compartir.') } } catch { setMessage('Puedes copiar el enlace desde la barra del navegador.') } }
  return <footer className="closing-section section-dark"><span className="eyebrow">HASTA PRONTO, EN LA PISTA</span><div className="closing-star">✳</div><h2>La pista<br />está lista.</h2><p>Solo faltas tú.</p><RsvpButton className="closing-rsvp" /><div className="closing-actions"><button onClick={makeIcs}><CalendarDays size={15} />Agregar al calendario</button><button onClick={() => void share()}><Share2 size={15} />Compartir</button></div><p className="closing-feedback" aria-live="polite">{message}</p><div className="closing-signature"><span>SU PISTA, SU MOVIMIENTO</span><span>YADI <i>✳</i> 2026</span><span>CON CARIÑO, PARA TI</span></div><span className="closing-script">Con cariño</span></footer>
}

function SiteNavigation() { return <nav className="site-nav" aria-label="Navegación principal"><a className="nav-monogram" href="#inicio" aria-label="Yadi, inicio">Y<span>.</span></a><div><a href="#inicio">Inicio</a><a href="#la-noche">La noche</a><a href="#lugar">Lugar</a><a href="#confirmacion">Confirmación</a></div><a className="nav-date" href="#confirmacion">14 <i>·</i> 03 <i>·</i> 26</a></nav> }

export default function Invitation() {
  const [isOpened, setIsOpened] = useState(false)
  const [introDone, setIntroDone] = useState(false)
  const [spotifyEngagement, setSpotifyEngagement] = useState(0)
  const [spotifyVisible, setSpotifyVisible] = useState(false)
  const showInvite = () => { setIsOpened(true); window.setTimeout(() => setIntroDone(true), 1050) }
  const scrollToQuote = () => document.getElementById('la-noche')?.scrollIntoView({ behavior: 'smooth' })
  const handleSpotifyEngage = useCallback(() => setSpotifyEngagement((current) => current + 1), [])
  const handleSpotifyVisibility = useCallback((visible: boolean) => setSpotifyVisible(visible), [])
  return <main className="invitation-shell">{!introDone && <EnvelopeIntro onOpen={showInvite} />}<div className={`invitation-content ${isOpened ? 'content-visible' : ''}`} aria-hidden={!isOpened}><SiteNavigation /><HeroSection onScroll={scrollToQuote} opened={isOpened} pauseRequest={spotifyEngagement} spotifyVisible={spotifyVisible} /><EditorialQuote /><PersonalPhotoSection /><CountdownSection /><NightSchedule /><VenueSection /><DressCodeSection /><PlaylistSection onEngage={handleSpotifyEngage} onVisibilityChange={handleSpotifyVisibility} /><RsvpSection /><ClosingSection /></div></main>
}
