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
        .big-404 { display:flex; align-items:center; justify-content:center; margin: 10px 0 34px; }
        .big-404 .digit { color: var(--nf-text); font-size: clamp(120px, 18vw, 240px); font-weight:700; line-height:0.85; font-family: var(--font-sans, ui-sans-serif); letter-spacing: -0.02em; }
        .asterisk { color: var(--nf-text); width: clamp(120px, 20vw, 320px); height: auto; display:block; }
        .home-btn { --btn-bg: var(--nf-accent); display:inline-block; padding:14px 36px; background:var(--btn-bg); color:var(--primary-foreground, #fff); border-radius:8px; text-decoration:none; font-weight:600; position:relative; }
        /* small decorative triangles on left/right to mimic the design */
        .home-btn::before, .home-btn::after { content: ''; position:absolute; width:10px; height:10px; background:transparent; border-style: solid; top:50%; transform:translateY(-50%); }
        .home-btn::before { left:8px; border-width:6px 0 6px 8px; border-color: transparent transparent transparent rgba(255,255,255,0.06); }
        .home-btn::after { right:8px; border-width:6px 8px 6px 0; border-color: transparent rgba(255,255,255,0.06) transparent transparent; }

        /* subtle responsive tweaks */
        @media (max-width:700px) {
          .big-404 { gap:8px; }
          .subtitle { font-size:15px; }
          .home-btn { padding:10px 20px; }
        }

        /* Slight animation: rotate the asterisk slowly */
        .asterisk { animation: rotate-asterisk 6s linear infinite; transform-origin: center; }
        @keyframes rotate-asterisk { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </main>
  );
}

