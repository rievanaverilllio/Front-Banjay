import Link from "next/link";

export default function NotFound() {
  return (
    <main className="notfound-root">
      <div className="notfound-inner">
        <p className="subtitle">The page you are looking for does not exist</p>

  <div className="big-404" role="img" aria-label="404">
          <div className="digit">4</div>

          {/* center asterisk built with SVG so we can match the shape and allow rotation */}
          <svg className="asterisk" width="240" height="200" viewBox="0 0 240 200" aria-hidden>
            <g transform="translate(120,100)">
              {Array.from({ length: 8 }).map((_, i) => (
                <rect
                  key={i}
                  x={-8}
                  y={-70}
                  width={16}
                  height={70}
                  rx={2}
                  fill="currentColor"
                  transform={`rotate(${i * 45})`}
                />
              ))}
            </g>
          </svg>

          <div className="digit">4</div>
        </div>

        <Link href="/" className="home-btn">GO HOME</Link>
      </div>

      <style>{`
        :root { --nf-bg: var(--sidebar, #f3f4f6); --nf-text: var(--sidebar-foreground, #0f172a); --nf-accent: var(--primary, #0b1724); }
        .notfound-root { min-height: 100vh; display:flex; align-items:center; justify-content:center; background: var(--nf-bg); }
        .notfound-inner { text-align:center; max-width: 1100px; width:100%; padding: 48px 24px; }
        .subtitle { margin:0 auto 28px; color: rgba(15,23,42,0.8); font-size:18px; }

        /* 3D container and variables controlled by pointer */
        .big-404 { --rx: 0deg; --ry: 0deg; --dz: 48px; display:flex; align-items:center; justify-content:center; margin: 10px 0 34px; transform-style: preserve-3d; perspective: 1200px; transform: perspective(1200px) rotateX(var(--rx)) rotateY(var(--ry)); transition: transform 250ms cubic-bezier(.2,.8,.2,1); }

        /* digits are extruded with layered text-shadow and subtle z-translation */
        .big-404 .digit {
          color: var(--nf-text);
          font-size: clamp(120px, 18vw, 240px);
          font-weight:900;
          line-height:0.85;
          font-family: var(--font-sans, ui-sans-serif);
          letter-spacing: -0.02em;
          position: relative;
          transform: translateZ(var(--dz));
          -webkit-font-smoothing: antialiased;
          text-shadow:
            0 1px 0 rgba(0,0,0,0.04),
            0 6px 12px rgba(5,10,25,0.12),
            0 18px 40px rgba(5,10,25,0.14);
        }

        /* asterisk sits slightly above plane and rotates in 3D */
        .asterisk { color: var(--nf-text); width: clamp(120px, 20vw, 320px); height: auto; display:block; transform: translateZ(calc(var(--dz) + 18px)) rotateX(14deg); transform-origin: center; animation: rotate-asterisk 8s linear infinite; }

        .home-btn { --btn-bg: var(--nf-accent); display:inline-block; padding:14px 36px; background:var(--btn-bg); color:var(--primary-foreground, #fff); border-radius:8px; text-decoration:none; font-weight:600; position:relative; margin-top: 12px; }
        .home-btn::before, .home-btn::after { content: ''; position:absolute; width:10px; height:10px; background:transparent; border-style: solid; top:50%; transform:translateY(-50%); }
        .home-btn::before { left:8px; border-width:6px 0 6px 8px; border-color: transparent transparent transparent rgba(255,255,255,0.06); }
        .home-btn::after { right:8px; border-width:6px 8px 6px 0; border-color: transparent rgba(255,255,255,0.06) transparent transparent; }

        /* subtle responsive tweaks */
        @media (max-width:700px) {
          .big-404 { gap:8px; }
          .subtitle { font-size:15px; }
          .home-btn { padding:10px 20px; }
        }

        /* rotate the asterisk */
        @keyframes rotate-asterisk { from { transform: translateZ(calc(var(--dz) + 18px)) rotateX(14deg) rotate(0deg);} to { transform: translateZ(calc(var(--dz) + 18px)) rotateX(14deg) rotate(360deg);} }

        /* accessibility: stop motion if user prefers reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .asterisk { animation: none; }
          .big-404 { transition: none; }
        }
      `}</style>
    </main>
  );
}

