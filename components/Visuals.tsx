import type { CSSProperties } from 'react';

export function ArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export function MockPlayer({ screenStyle, delay }: { screenStyle?: CSSProperties; delay?: string }) {
  return (
    <div className="mock-player" style={delay ? { animationDelay: delay } : undefined}>
      <div className="mock-screen" style={screenStyle}>
        <div className="mock-play"></div>
      </div>
      <div className="mock-timeline">
        <div className="mock-track"><div className="mock-clip c1"></div><div className="mock-clip c2"></div><div className="mock-clip c3"></div></div>
        <div className="mock-track"><div className="mock-clip c5"></div><div className="mock-clip c4"></div><div className="mock-clip c6"></div></div>
      </div>
      <div className="mock-cursor"></div>
    </div>
  );
}

export function MockDoc() {
  return (
    <div className="mock-doc">
      <div className="doc-title"></div>
      <div className="doc-line"></div>
      <div className="doc-line mid"></div>
      <div className="doc-line"></div>
      <div className="doc-line short"></div>
      <div className="doc-line mid"></div>
      <div className="doc-line short"></div>
      <span className="doc-badge">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
        100% Human Written
      </span>
    </div>
  );
}
