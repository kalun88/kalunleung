/* Kalun Leung — Cargo-inspired homepage v2
   Hero = alphabet soup canvas with title overlay.
   News redesigned as a typewriter dispatch column (less "website").
*/

const { useState, useEffect, useRef } = React;

// ---------- DATA ----------
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
    dateline: "MTL",
    title: "Fall 2025",
    tag: "residency",
    body:
      "Continuing my half-year residency at Perte de Signal in Montréal — mentorship time with community artists working at the intersection of sound, image, and performance. Goal this year: develop a studio practice through Ambient Parade and the mubone. If you know someone I should reach out to for help, please let me know.",
    image: "img/fall2025.webp",
  },
  {
    date: "Aug 15, 2025",
    dateline: "MTL",
    title: "August 2025",
    tag: "residency",
    body:
      "ék heading to our final creation residency for Pouet! — a 30-min new-music show for families combining mime, foley, and clown. Two friends discovering the world of sound and how it relates to music. Debut in September in Montréal — follow @ek_emailluine.",
    image: "img/ek1.webp",
  },
  {
    date: "May 13, 2025",
    dateline: "CPH",
    title: "May 2025",
    tag: "mubone",
    body:
      "Just back from Copenhagen — first mubone project with live projection mapping by co-creator Travis West. Mounted in a former boiler room with mezzo-soprano Kirsten Voss and Tonalteatret. The space's industrial past, walls beautifully stained by time, became part of our soundpainting.",
    image: "img/may2025.webp",
  },
];

const NAV = [
  { glyph: "▁", label: "about" },
  { glyph: "▄", label: "mubone" },
  { glyph: "▉", label: "news" },
  { glyph: "▇", label: "dates" },
  { glyph: "▙", label: "portfolio" },
  { glyph: "▞", label: "collaborations" },
  { glyph: "▦", label: "media" },
  { glyph: "◍", label: "contact" },
];

// ---------- COMPONENTS ----------
function Rail() {
  return (
    <aside className="rail">
      <div className="rail-inner">
        <a className="rail-mark" href="#" aria-label="Home">
          {"梁\n家\n綸".split("\n").map((c, i) => (<span key={i}>{c}</span>))}
        </a>
        <nav className="rail-nav" aria-label="Main">
          {NAV.map((n) => (
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

function SoupHero({ heroMode }) {
  // re-init canvas after React mounts the wrapper
  useEffect(() => {
    if (window.__initAlphabetSoup) {
      // small tick so layout is final
      requestAnimationFrame(() => window.__initAlphabetSoup());
    }
  }, [heroMode]);

  return (
    <section className={`soup-hero soup-${heroMode}`}>
      <div id="alphabet-soup-wrapper">
        <canvas id="alphabet-soup-canvas"></canvas>
        <div id="custom-cursor" className="push-mode"></div>
        <div className="alphabet-soup-instructions" id="alphabet-soup-instructions">
          <div className="desktop-only">
            click to commit · move to push<br/>hold space to erase
          </div>
          <div className="mobile-only">hold to commit</div>
        </div>
      </div>

      <div className="hero-overlay">
        <div className="hero-meta">
          <span>Index — 001 / Home</span>
          <span>梁家綸 · est. 2018</span>
          <span>Updated 2026·05·03</span>
        </div>

        <h1 className="hero-title">
          <span className="hero-name">Kalun&nbsp;Leung</span>
          <span className="hero-roles">
            Trombonist, <em>Composer</em>,<br/>Instrument&nbsp;Developer.
          </span>
        </h1>

        <div className="hero-foot">
          <div className="hero-pull">
            <span className="mono">↳ Kranichstein 2025</span>
            <p>
              “An exceptionally versatile artist… operates in a variety of
              aesthetic contexts. The jury was impressed by Leung's
              development of the digital tool <em>mubone</em>.”
            </p>
          </div>
          <div className="hero-cta">
            <span className="mono">↓ scroll</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- PROJECTS ----------
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
        <span>Yr.</span><span>Title</span><span>Tag</span><span>Role · Place</span><span></span>
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
          <span className="works-thumb"><img src={p.images[0]} alt="" /></span>
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
            {p.images[1] && <img className="works-card-img-2" src={p.images[1]} alt="" />}
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
  const [activeIdx, setActiveIdx] = useState(0);
  const [pinned, setPinned] = useState(0); // last clicked
  const feature = PROJECTS[activeIdx];

  return (
    <div className="works-hybrid">
      <article className="hybrid-feature" key={activeIdx /* re-trigger fade */}>
        <div className="hybrid-feature-img">
          <img src={feature.images[0]} alt={feature.title} />
          {feature.images[1] && (
            <img className="hybrid-feature-img-2" src={feature.images[1]} alt="" />
          )}
          <div className="hybrid-feature-num mono">
            {String(activeIdx + 1).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")}
          </div>
        </div>
        <div className="hybrid-feature-body">
          <div className="mono dim">{feature.date} · [{feature.tag}]</div>
          <h3 className="hybrid-feature-title">{feature.title}</h3>
          <p>{feature.blurb}</p>
          <div className="mono dim">{feature.role} — {feature.locations}</div>
        </div>
      </article>
      <ol
        className="hybrid-rest"
        onMouseLeave={() => setActiveIdx(pinned)}
      >
        {PROJECTS.map((p, i) => (
          <li
            key={p.title}
            className={i === activeIdx ? "is-active" : ""}
            onMouseEnter={() => setActiveIdx(i)}
            onFocus={() => setActiveIdx(i)}
          >
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); setPinned(i); setActiveIdx(i); }}
            >
              <span className="works-num">{String(i + 1).padStart(2, "0")}</span>
              <span className="hybrid-rest-title">{p.title}</span>
              <span className="dim mono hybrid-rest-tag">[{p.tag}]</span>
              <span className="dim mono hybrid-rest-yr">{p.year}</span>
              <span className="hybrid-rest-mark" aria-hidden="true">→</span>
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}

// ---------- NEWS (multiple layouts) ----------
function NewsSection({ variant, density }) {
  return (
    <section id="news" className="block">
      <header className="block-head">
        <span className="block-mark" aria-hidden="true">▉</span>
        <h2 className="block-title">News</h2>
        <span className="block-count">{String(NEWS.length).padStart(2, "0")} entries</span>
        <a className="block-more" href="#">All news ↗</a>
      </header>
      {variant === "list" && <NewsList />}
      {variant === "index" && <NewsIndex density={density} />}
      {variant === "hybrid" && <NewsHybrid />}
    </section>
  );
}

// 1) LIST — date | title+excerpt | thumb (echoes PostPreviewWide)
function NewsList() {
  return (
    <ol className="news-list">
      {NEWS.map((n) => (
        <li key={n.title} className="news-row">
          <a className="news-row-link" href="#" aria-label={`Read: ${n.title}`}></a>
          <div className="news-meta">
            <span className="news-date mono">{n.date}</span>
            <span className="news-tag mono">[{n.tag}]</span>
          </div>
          <div className="news-body">
            <h3 className="news-title">{n.title}</h3>
            <p className="news-excerpt">{n.body}</p>
            <span className="news-dateline mono dim">↗ {n.dateline}</span>
          </div>
          <div className="news-thumb">
            <img src={n.image} alt="" />
          </div>
        </li>
      ))}
    </ol>
  );
}

// 2) INDEX — appropriated from projects index (date | num + title + excerpt | tag | dateline | thumb)
function NewsIndex({ density }) {
  return (
    <ol className={`news-idx dens-${density}`}>
      <li className="news-idx-row news-idx-head" aria-hidden="true">
        <span>Date</span><span>Entry</span><span>Tag</span><span>Place</span><span></span>
      </li>
      {NEWS.map((n, i) => (
        <li key={n.title} className="news-idx-row">
          <span className="news-idx-date mono">{n.date}</span>
          <span className="news-idx-title">
            <span className="works-num">{String(i + 1).padStart(2, "0")}</span>
            <a href="#">{n.title}</a>
            <span className="news-idx-blurb">{n.body}</span>
          </span>
          <span className="news-idx-tag mono">[{n.tag}]</span>
          <span className="news-idx-place mono dim">{n.dateline}</span>
          <span className="news-idx-thumb"><img src={n.image} alt="" /></span>
        </li>
      ))}
    </ol>
  );
}

// 3) HYBRID — feature card + sidebar list (mirrors ProjectsHybrid)
function NewsHybrid() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [pinned, setPinned] = useState(0);
  const feature = NEWS[activeIdx];

  return (
    <div className="news-hybrid">
      <article className="news-hybrid-feature" key={activeIdx}>
        <div className="news-hybrid-img">
          <img src={feature.image} alt={feature.title} />
          <div className="news-hybrid-num mono">
            {String(activeIdx + 1).padStart(2, "0")} / {String(NEWS.length).padStart(2, "0")}
          </div>
        </div>
        <div className="news-hybrid-body">
          <div className="mono dim">{feature.date} · [{feature.tag}]</div>
          <h3 className="news-hybrid-title">{feature.title}</h3>
          <p>{feature.body}</p>
          <div className="mono dim">↗ {feature.dateline}</div>
        </div>
      </article>
      <ol className="news-hybrid-rest" onMouseLeave={() => setActiveIdx(pinned)}>
        {NEWS.map((n, i) => (
          <li
            key={n.title}
            className={i === activeIdx ? "is-active" : ""}
            onMouseEnter={() => setActiveIdx(i)}
            onFocus={() => setActiveIdx(i)}
          >
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); setPinned(i); setActiveIdx(i); }}
            >
              <span className="works-num">{String(i + 1).padStart(2, "0")}</span>
              <span className="hybrid-rest-title">{n.title}</span>
              <span className="dim mono hybrid-rest-tag">[{n.tag}]</span>
              <span className="dim mono hybrid-rest-yr">{n.date.split(",")[1] || n.date}</span>
              <span className="hybrid-rest-mark" aria-hidden="true">→</span>
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}

// ---------- DATES ----------
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
        <h2 className="block-title">Upcoming</h2>
        <span className="block-count">N=04</span>
        <a className="block-more" href="#">All dates ↗</a>
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
            {NAV.map((n) => (
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
            and JetBrains&nbsp;Mono. The hero is a particle field of the artist's
            own glyph alphabet — click to paint, hold space to erase.
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
  "showRail": true,
  "heroMode": "soup-tall",
  "newsLayout": "hybrid"
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = window.useTweaks(TWEAK_DEFAULTS);

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
      {tweaks.showRail && <Rail />}
      <main className="main">
        {tweaks.heroMode !== "type" ? <SoupHero heroMode={tweaks.heroMode} /> : <TypeHero />}
        <ProjectsIndex variant={tweaks.layout} density={tweaks.density} />
        <NewsSection variant={tweaks.newsLayout} density={tweaks.density} />
        <DatesStrip />
        <FooterIndex />
      </main>

      <window.TweaksPanel title="Tweaks" defaultPosition={{ right: 24, bottom: 24 }}>
        <window.TweakSection title="Hero">
          <window.TweakRadio
            label="Hero treatment"
            value={tweaks.heroMode}
            onChange={(v) => setTweak("heroMode", v)}
            options={[
              { value: "soup", label: "Soup (full)" },
              { value: "soup-tall", label: "Soup (tall)" },
              { value: "type", label: "Type only" },
            ]}
          />
        </window.TweakSection>

        <window.TweakSection title="Layout">
          <window.TweakRadio
            label="Projects"
            value={tweaks.layout}
            onChange={(v) => setTweak("layout", v)}
            options={[
              { value: "index", label: "Index" },
              { value: "grid", label: "Grid" },
              { value: "hybrid", label: "Hybrid" },
            ]}
          />
          <window.TweakRadio
            label="News"
            value={tweaks.newsLayout}
            onChange={(v) => setTweak("newsLayout", v)}
            options={[
              { value: "list", label: "List" },
              { value: "index", label: "Index" },
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
            {[["#cb2941","Crimson"],["#0a0a0a","Ink"],["#1d4ed8","Cobalt"],["#15803d","Pine"],["#ea580c","Vermillion"]].map(([c, n]) => (
              <button key={c} className="tw-preset" style={{ background: c }} title={n} onClick={() => setTweak("accent", c)} />
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
              { value: "neue-mono", label: "All Inter Tight" },
              { value: "jost-roboto", label: "Jost + Roboto Mono (current)" },
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
              { value: "on", label: "On" },
            ]}
          />
        </window.TweakSection>
      </window.TweaksPanel>
    </div>
  );
}

function TypeHero() {
  return (
    <section className="hero type-hero">
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
    </section>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
