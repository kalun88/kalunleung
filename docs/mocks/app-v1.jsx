/* Kalun Leung — Cargo-inspired homepage
   Layout: sticky left rail nav + main editorial column.
   System: Inter Tight (display) + JetBrains Mono (meta) + crimson accent.
*/

const { useState, useEffect, useMemo } = React;

// ---------- DATA (pulled from kalunleung.ca live) ----------
const PROJECTS = [
  {
    year: "2025",
    date: "May 15, 2025",
    title: "Conversations with Space and Architecture",
    tag: "mubone",
    blurb:
      "An ongoing series of site-specific compositions developed using the mubone — a custom performance technology that explores the artistic potential of environment as medium.",
    images: ["img/csa1.webp"],
    role: "Composition · Performance · Instrument",
    locations: "Copenhagen · Suffolk · Montréal",
  },
  {
    year: "2024",
    date: "Jun 7, 2024",
    title: "Same 36 Tunes for 100 Years",
    tag: "site-specific",
    blurb:
      "Immersive concert installation inspired by the last operational barrel organ in the UK, located in the parish church of Shelland, Suffolk.",
    images: ["img/100years1.webp", "img/100years2.webp"],
    role: "Composition · Installation",
    locations: "Shelland, Suffolk (UK)",
  },
  {
    year: "2023",
    date: "Aug 8, 2023",
    title: "Baker's Lung",
    tag: "interdisciplinary",
    blurb:
      "Second event of the #musicismore series. Combines professional baking and music practice — both communal experiences that connect us as human beings.",
    images: ["img/bakers1.webp", "img/bakers2.webp", "img/bakers3.webp"],
    role: "Curation · Performance",
    locations: "Toronto",
  },
];

const NEWS = [
  {
    date: "Sep 18, 2025",
    title: "Fall 2025",
    tag: "residency",
    blurb:
      "Continuing my half-year residency at Perte de Signal in Montréal — mentorship time with community artists working at the intersection of sound, image, and performance. Goal this year: develop a studio practice through Ambient Parade and the mubone.",
    image: "img/fall2025.webp",
  },
  {
    date: "Aug 15, 2025",
    title: "August 2025",
    tag: "residency",
    blurb:
      "ék heading to our final creation residency for Pouet! — a 30-min new-music show for families combining mime, foley, and clown. Debut in September in Montréal.",
    image: "img/ek1.webp",
  },
  {
    date: "May 13, 2025",
    title: "May 2025",
    tag: "mubone",
    blurb:
      "Just back from Copenhagen — first mubone project with live projection mapping by co-creator Travis West. Mounted in a former boiler room with mezzo-soprano Kirsten Voss and Tonalteatret.",
    image: "img/may2025.webp",
  },
];

const NAV = [
  { glyph: "梁\n家\n綸", label: "home", active: true },
  { glyph: "▁", label: "about" },
  { glyph: "▄", label: "mubone" },
  { glyph: "▉", label: "news" },
  { glyph: "▇", label: "dates" },
  { glyph: "▙", label: "portfolio" },
  { glyph: "▞", label: "collaborations" },
  { glyph: "▦", label: "media" },
  { glyph: "◍", label: "contact" },
];

// ---------- SUBCOMPONENTS ----------
function Rail({ accent }) {
  return (
    <aside className="rail">
      <div className="rail-inner">
        <a className="rail-mark" href="#" aria-label="Home">
          {"梁\n家\n綸".split("\n").map((c, i) => (
            <span key={i}>{c}</span>
          ))}
        </a>
        <nav className="rail-nav" aria-label="Main">
          {NAV.slice(1).map((n) => (
            <a key={n.label} href={`#${n.label}`} className="rail-link">
              <span className="rail-glyph" aria-hidden="true">{n.glyph}</span>
              <span className="rail-label">{n.label}</span>
            </a>
          ))}
        </nav>
        <div className="rail-foot">
          <div className="rail-meta">Trombonist</div>
          <div className="rail-meta">Composer</div>
          <div className="rail-meta">Instrument Developer</div>
          <div className="rail-meta rail-meta-dim">Tiohtià:ke / Montréal</div>
        </div>
      </div>
    </aside>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="hero-meta">
        <span>Index — 001 / Home</span>
        <span>Updated 2026·05·03</span>
      </div>
      <h1 className="hero-title">
        <span className="hero-name">Kalun&nbsp;Leung</span>
        <span className="hero-roles">
          Trombonist, <em>Composer</em>, Instrument&nbsp;Developer.
        </span>
      </h1>

      <figure className="quote">
        <blockquote>
          “Kalun Leung is an exceptionally versatile artist. As a trombonist of
          outstanding technical skills and a highly sensitive dialogue partner,
          he operates in a variety of aesthetic contexts. The jury was impressed
          by Leung's development of the digital tool <em>mubone</em>, which —
          originally conceived as an ‘augmented instrument' for the trombone —
          offers a creative platform for distributed authorship by performers
          and composers.”
        </blockquote>
        <figcaption>
          <span>Jury · Kranichstein Music Prize</span>
          <span className="dot">●</span>
          <span>Darmstadt 2025</span>
        </figcaption>
      </figure>
    </section>
  );
}

function ProjectsIndex({ variant, density }) {
  return (
    <section id="portfolio" className="block">
      <header className="block-head">
        <span className="block-mark" aria-hidden="true">▙</span>
        <h2 className="block-title">Selected Works</h2>
        <span className="block-count">N=03 · 2023—2025</span>
        <a className="block-more" href="#">View all ↗</a>
      </header>

      {variant === "index" && <ProjectsList density={density} />}
      {variant === "grid" && <ProjectsGrid />}
      {variant === "hybrid" && <ProjectsHybrid />}
    </section>
  );
}

function ProjectsList({ density }) {
  return (
    <ol className={`works-list dens-${density}`}>
      <li className="works-row works-row-head" aria-hidden="true">
        <span>Yr.</span>
        <span>Title</span>
        <span>Tag</span>
        <span>Role · Place</span>
        <span></span>
      </li>
      {PROJECTS.map((p, i) => (
        <li key={p.title} className="works-row">
          <span className="works-yr">{p.year}</span>
          <span className="works-title">
            <span className="works-num">{String(i + 1).padStart(2, "0")}</span>
            <a href="#">{p.title}</a>
            <span className="works-blurb">{p.blurb}</span>
          </span>
          <span className="works-tag">[{p.tag}]</span>
          <span className="works-role">
            <span>{p.role}</span>
            <span className="dim">{p.locations}</span>
          </span>
          <span className="works-thumb">
            <img src={p.images[0]} alt="" />
          </span>
        </li>
      ))}
    </ol>
  );
}

function ProjectsGrid() {
  return (
    <div className="works-grid">
      {PROJECTS.map((p, i) => (
        <article key={p.title} className={`works-card span-${(i % 3) + 1}`}>
          <div className="works-card-img">
            <img src={p.images[0]} alt={p.title} />
            {p.images[1] && (
              <img className="works-card-img-2" src={p.images[1]} alt="" />
            )}
          </div>
          <div className="works-card-meta">
            <span className="mono">{p.date}</span>
            <span className="mono">[{p.tag}]</span>
          </div>
          <h3 className="works-card-title">
            <span className="works-num">{String(i + 1).padStart(2, "0")}</span>
            {p.title}
          </h3>
          <p className="works-card-blurb">{p.blurb}</p>
        </article>
      ))}
    </div>
  );
}

function ProjectsHybrid() {
  const [feature, ...rest] = PROJECTS;
  return (
    <div className="works-hybrid">
      <article className="hybrid-feature">
        <div className="hybrid-feature-img">
          <img src={feature.images[0]} alt={feature.title} />
        </div>
        <div className="hybrid-feature-body">
          <div className="mono dim">{feature.date} · [{feature.tag}]</div>
          <h3 className="hybrid-feature-title">{feature.title}</h3>
          <p>{feature.blurb}</p>
          <div className="mono dim">{feature.role} — {feature.locations}</div>
        </div>
      </article>
      <ol className="hybrid-rest">
        {rest.map((p, i) => (
          <li key={p.title}>
            <span className="works-num">{String(i + 2).padStart(2, "0")}</span>
            <a href="#">{p.title}</a>
            <span className="dim mono">[{p.tag}]</span>
            <span className="dim mono">{p.year}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function NewsStrip() {
  return (
    <section id="news" className="block">
      <header className="block-head">
        <span className="block-mark" aria-hidden="true">▉</span>
        <h2 className="block-title">News</h2>
        <span className="block-count">Recent dispatches</span>
        <a className="block-more" href="#">View all ↗</a>
      </header>
      <div className="news-grid">
        {NEWS.map((n) => (
          <article key={n.title} className="news-card">
            <div className="news-img">
              <img src={n.image} alt="" />
            </div>
            <div className="news-meta">
              <span className="mono">{n.date}</span>
              <span className="mono">[{n.tag}]</span>
            </div>
            <h3 className="news-title">{n.title}</h3>
            <p className="news-blurb">{n.blurb}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function DatesStrip() {
  const dates = [
    ["2026·05·22", "Tonalteatret · Boiler Room", "Copenhagen, DK"],
    ["2026·06·11", "Perte de Signal — Open Studio", "Montréal, QC"],
    ["2026·07·03", "Pouet! · Festival d'Aix Jeune Public", "Aix-en-Provence, FR"],
    ["2026·09·09", "Ambient Parade · No. 04", "Tiohtià:ke"],
  ];
  return (
    <section id="dates" className="block">
      <header className="block-head">
        <span className="block-mark" aria-hidden="true">▇</span>
        <h2 className="block-title">Upcoming Dates</h2>
        <span className="block-count">N=04</span>
        <a className="block-more" href="#">View all ↗</a>
      </header>
      <ol className="dates-list">
        {dates.map(([d, t, l]) => (
          <li key={d}>
            <span className="mono">{d}</span>
            <span className="dates-title">{t}</span>
            <span className="mono dim">{l}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function FooterIndex() {
  return (
    <footer className="footer">
      <div className="footer-mark">梁家綸</div>
      <div className="footer-cols">
        <div>
          <div className="mono dim">§ Index</div>
          <ul>
            {NAV.slice(1).map((n) => (
              <li key={n.label}>
                <a href={`#${n.label}`}>
                  <span className="mono">{n.glyph}</span> {n.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="mono dim">§ Elsewhere</div>
          <ul>
            <li><a href="mailto:kalunis+website@gmail.com">▰ email</a></li>
            <li><a href="https://instagram.com/kalun_____">◗ instagram @kalun_____</a></li>
            <li><a href="#">☗ newsletter</a></li>
          </ul>
        </div>
        <div>
          <div className="mono dim">§ Colophon</div>
          <p className="footer-colo">
            Built in Astro on a Notion CMS via Webtrotion. Set in Inter&nbsp;Tight
            and JetBrains&nbsp;Mono. Updated continuously from a database
            in Tiohtià:ke / Montréal.
          </p>
          <p className="footer-colo dim">© 2026 Kalun Leung · CC BY-NC 4.0</p>
        </div>
      </div>
    </footer>
  );
}

// ---------- TWEAKS ----------
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "layout": "index",
  "density": "loose",
  "accent": "#cb2941",
  "typePair": "intertight-jbmono",
  "surprise": "off",
  "showRail": true
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = window.useTweaks(TWEAK_DEFAULTS);
  const accent = tweaks.accent;

  // Apply CSS vars from tweaks
  useEffect(() => {
    const r = document.documentElement;
    r.style.setProperty("--accent", tweaks.accent);
    const pairs = {
      "intertight-jbmono": ['"Inter Tight", system-ui, sans-serif', '"JetBrains Mono", ui-monospace, monospace'],
      "fraunces-jbmono":   ['"Fraunces", Georgia, serif', '"JetBrains Mono", ui-monospace, monospace'],
      "neue-mono":         ['"Inter Tight", system-ui, sans-serif', '"Inter Tight", system-ui, sans-serif'],
      "jost-roboto":       ['"Jost", system-ui, sans-serif', '"Roboto Mono", ui-monospace, monospace'],
    };
    const [s, m] = pairs[tweaks.typePair] || pairs["intertight-jbmono"];
    r.style.setProperty("--font-sans", s);
    r.style.setProperty("--font-mono", m);
    document.body.classList.toggle("surprise-on", tweaks.surprise === "on");
    document.body.classList.toggle("rail-hidden", !tweaks.showRail);
  }, [tweaks]);

  return (
    <div className="page">
      {tweaks.showRail && <Rail accent={accent} />}
      <main className="main">
        <Hero />
        <ProjectsIndex variant={tweaks.layout} density={tweaks.density} />
        <NewsStrip />
        <DatesStrip />
        <FooterIndex />
      </main>

      <window.TweaksPanel title="Tweaks" defaultPosition={{ right: 24, bottom: 24 }}>
        <window.TweakSection title="Layout">
          <window.TweakRadio
            label="Projects layout"
            value={tweaks.layout}
            onChange={(v) => setTweak("layout", v)}
            options={[
              { value: "index", label: "Index" },
              { value: "grid", label: "Grid" },
              { value: "hybrid", label: "Hybrid" },
            ]}
          />
          <window.TweakRadio
            label="Density"
            value={tweaks.density}
            onChange={(v) => setTweak("density", v)}
            options={[
              { value: "tight", label: "Tight" },
              { value: "loose", label: "Loose" },
            ]}
          />
          <window.TweakToggle
            label="Show side rail"
            value={tweaks.showRail}
            onChange={(v) => setTweak("showRail", v)}
          />
        </window.TweakSection>

        <window.TweakSection title="Colour">
          <window.TweakColor
            label="Accent"
            value={tweaks.accent}
            onChange={(v) => setTweak("accent", v)}
          />
          <div className="tw-presets">
            {[
              ["#cb2941", "Crimson"],
              ["#0a0a0a", "Ink"],
              ["#1d4ed8", "Cobalt"],
              ["#15803d", "Pine"],
              ["#ea580c", "Vermillion"],
            ].map(([c, n]) => (
              <button
                key={c}
                className="tw-preset"
                style={{ background: c }}
                title={n}
                onClick={() => setTweak("accent", c)}
              />
            ))}
          </div>
        </window.TweakSection>

        <window.TweakSection title="Typography">
          <window.TweakSelect
            label="Pairing"
            value={tweaks.typePair}
            onChange={(v) => setTweak("typePair", v)}
            options={[
              { value: "intertight-jbmono", label: "Inter Tight + JetBrains Mono" },
              { value: "fraunces-jbmono", label: "Fraunces (serif) + JetBrains Mono" },
              { value: "neue-mono", label: "All Inter Tight (mono swapped)" },
              { value: "jost-roboto", label: "Jost + Roboto Mono (current site)" },
            ]}
          />
        </window.TweakSection>

        <window.TweakSection title="Surprise">
          <window.TweakRadio
            label="Editorial flair"
            value={tweaks.surprise}
            onChange={(v) => setTweak("surprise", v)}
            options={[
              { value: "off", label: "Off" },
              { value: "on", label: "On — drop caps, rule lines, marginalia" },
            ]}
          />
        </window.TweakSection>
      </window.TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
