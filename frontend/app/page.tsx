import Link from "next/link";
import { ArrowUpRight, CalendarDays, ChevronRight, Clock3, MapPin, Megaphone, Trophy } from "lucide-react";
import { announcements, leagues, matches, results } from "@/lib/data";
import { NextMatchCountdown, PublicStats, RefereeHighlights, ScoreTicker, SeasonTimeline } from "@/components/home-experience";

export default function Home() {
  return <>
    <section className="hero"><div className="container hero-grid">
      <div className="hero-copy"><span className="eyebrow">2026–2027 SEZONU</span><h1>TEKİRDAĞ BASKETBOL<br/><em>İL TEMSİLCİLİĞİ</em></h1><p>Tekirdağ basketbolunun dijital buluşma noktası.</p><div className="hero-actions"><Link className="button primary" href="/mac-programi">Maç Programını İncele</Link><Link className="text-link" href="/mac-sonuclari">Sonuçları Görüntüle <ChevronRight size={18}/></Link></div></div>
      <div className="hero-art" aria-hidden="true"><div className="court"><span className="court-line"/><span className="basketball"><i/><b/><em/></span><span className="score-card"><small>BU HAFTA</small><strong>12</strong><b>MÜSABAKA</b></span></div></div>
    </div></section>

    <NextMatchCountdown />
    <ScoreTicker />
    <PublicStats />
    <RefereeHighlights />

    <section className="quick-bar"><div className="container quick-grid"><div><span>SEZON</span><strong>2026–2027</strong></div><div><span>AKTİF LİG</span><strong>4 Kategori</strong></div><div><span>HAFTANIN PROGRAMI</span><strong>28 Kasım – 4 Aralık</strong></div><Link href="/mac-programi">Programı aç <ArrowUpRight size={18}/></Link></div></section>

    <section className="section"><div className="container"><div className="section-head"><div><span className="eyebrow dark">BU HAFTA</span><h2>Yaklaşan maçlar</h2></div><Link className="outline-link" href="/mac-programi">Tüm program</Link></div><div className="match-list">{matches.map(m => <article className="match-row" key={m.id}><div className="date-box"><strong>{m.date.split(" ")[0]}</strong><span>{m.date.split(" ")[1]}</span><small>{m.day}</small></div><div className="match-main"><span className="category">{m.category}</span><div className="teams"><strong>{m.home}</strong><b>VS</b><strong>{m.away}</strong></div></div><div className="match-meta"><span><Clock3 size={17}/>{m.time}</span><span><MapPin size={17}/>{m.venue}</span></div><Link href="/mac-programi" aria-label="Maç programına git"><ChevronRight/></Link></article>)}</div></div></section>

    <section className="section muted"><div className="container two-col"><div><div className="section-head"><div><span className="eyebrow dark">SKORBORD</span><h2>Son sonuçlar</h2></div><Link href="/mac-sonuclari">Tümü</Link></div><div className="results-card">{results.map((r, i) => <div className="result" key={i}><div><span>{r.category}</span><small>{r.date}</small></div><div className="result-team"><strong>{r.home}</strong><b>{r.homeScore}</b></div><div className="result-team"><strong>{r.away}</strong><b>{r.awayScore}</b></div></div>)}</div></div><div><div className="section-head"><div><span className="eyebrow dark">GÜNCEL</span><h2>Duyurular</h2></div><Link href="/duyurular">Tümü</Link></div><div className="announcement-list">{announcements.map((a, i) => <Link href="/duyurular" className="announcement" key={i}><span className="icon-wrap"><Megaphone/></span><div><small>{a.tag} · {a.date}</small><strong>{a.title}</strong></div><ChevronRight/></Link>)}</div></div></div></section>

    <section className="section"><div className="container"><div className="section-head"><div><span className="eyebrow dark">MÜSABAKALAR</span><h2>Aktif ligler</h2></div><Link className="outline-link" href="/ligler">Tüm ligleri incele</Link></div><div className="league-grid">{leagues.map(l => <Link href="/ligler" className="league-card" key={l.name} style={{"--accent": l.accent} as React.CSSProperties}><Trophy/><span>2026–2027</span><h3>{l.name}</h3><p>{l.teams} takım</p><ChevronRight/></Link>)}</div></div></section>

    <section className="cta"><div className="container cta-inner"><CalendarDays/><div><span>HAFTALIK PROGRAM</span><h2>Maç günü planınızı şimdiden yapın.</h2><p>Salon, saat ve kategori bilgileriyle güncel programa ulaşın.</p></div><Link className="button white" href="/mac-programi">Programı görüntüle</Link></div></section>
    <SeasonTimeline />
  </>;
}
