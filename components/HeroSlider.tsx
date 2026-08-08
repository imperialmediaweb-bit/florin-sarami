'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import Photo from './Photo';
import VideoClip from './VideoClip';
import { ArrowIcon, MockDoc, MockPlayer } from './Visuals';

const INTERVAL = 6500;
const SLIDE_COUNT = 3;

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const restart = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => setCurrent(c => (c + 1) % SLIDE_COUNT), INTERVAL);
  }, []);

  useEffect(() => {
    restart();
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [restart]);

  const go = (i: number) => {
    setCurrent(((i % SLIDE_COUNT) + SLIDE_COUNT) % SLIDE_COUNT);
    restart();
  };

  const cls = (i: number) => `hero-slide${current === i ? ' active' : ''}`;

  return (
    <section className="hero" aria-label="Prezentare servicii">
      {/* Slide 1 — Editare video (mesaj principal) */}
      <div className={cls(0)}>
        <div className="container">
          <div>
            <span className="eyebrow">Editare video profesională</span>
            <h1 className="h-xl">Transformăm filmările tale în <span className="grad-text">videoclipuri</span> care atrag atenția!</h1>
            <p className="lead">Montaj, subtitrări, tranziții, corecții de culoare, efecte vizuale și optimizarea conținutului pentru rezultate profesionale — pe orice platformă.</p>
            <div className="btn-row mt-2">
              <Link href="/editare-video" className="btn btn-primary">Descoperă serviciile <ArrowIcon /></Link>
              <Link href="/portofoliu" className="btn btn-ghost">Vezi portofoliul</Link>
            </div>
          </div>
          <div className="hero-visual">
            <VideoClip
              name="editare"
              fallback={<Photo name="video-editing" alt="Editare video profesională" fallback={<MockPlayer />} />}
            />
            <div className="float-chip p1">🎬 Montaj &amp; efecte vizuale</div>
            <div className="float-chip p2">✨ Corecții de culoare</div>
          </div>
        </div>
      </div>

      {/* Slide 2 — Editare video (social media) */}
      <div className={cls(1)}>
        <div className="container">
          <div>
            <span className="eyebrow">Social Media Video</span>
            <h1 className="h-xl">Clipuri pentru <span className="grad-text">Facebook, Instagram, TikTok</span> și YouTube</h1>
            <p className="lead">Videoclipuri promoționale, podcasturi, interviuri, evenimente și clipuri de lungă durată — optimizate pentru fiecare platformă și pentru publicul tău.</p>
            <div className="btn-row mt-2">
              <Link href="/editare-video" className="btn btn-primary">Editare video <ArrowIcon /></Link>
              <Link href="/contact" className="btn btn-ghost">Cere ofertă</Link>
            </div>
          </div>
          <div className="hero-visual">
            <Photo
              name="social-media"
              alt="Clipuri pentru rețelele sociale"
              fallback={<MockPlayer delay=".5s" screenStyle={{ background: 'linear-gradient(135deg,#0ea5e9 0%,#2563eb 60%,#16307a 130%)' }} />}
            />
            <div className="float-chip p1">📱 Reels &amp; TikTok</div>
            <div className="float-chip p2">🎙️ Podcasturi &amp; interviuri</div>
          </div>
        </div>
      </div>

      {/* Slide 3 — Redactare conținut */}
      <div className={cls(2)}>
        <div className="container">
          <div>
            <span className="eyebrow">Redactare conținut</span>
            <h1 className="h-xl">Conținut scris de <span className="grad-text">oameni reali</span>, pentru oameni reali</h1>
            <p className="lead">Articole de blog, descrieri de produse, pagini de prezentare, comunicate și advertoriale — 100% Human Written, adaptate brandului tău.</p>
            <div className="btn-row mt-2">
              <Link href="/redactare-continut" className="btn btn-primary">Redactare conținut <ArrowIcon /></Link>
              <Link href="/contact" className="btn btn-ghost">Hai să vorbim</Link>
            </div>
          </div>
          <div className="hero-visual">
            <Photo name="writing" alt="Redactare de conținut" fallback={<MockDoc />} />
            <div className="float-chip p1">✍️ Articole de blog</div>
            <div className="float-chip p2">🛍️ Descrieri de produse</div>
          </div>
        </div>
      </div>

      <div className="hero-arrows">
        <button className="hero-prev" aria-label="Slide anterior" onClick={() => go(current - 1)}>‹</button>
        <button className="hero-next" aria-label="Slide următor" onClick={() => go(current + 1)}>›</button>
      </div>
      <div className="hero-dots" role="tablist" aria-label="Selectează slide">
        {Array.from({ length: SLIDE_COUNT }, (_, i) => (
          <button
            key={i}
            className={current === i ? 'active' : ''}
            aria-label={`Slide ${i + 1}`}
            onClick={() => go(i)}
          />
        ))}
      </div>
    </section>
  );
}
