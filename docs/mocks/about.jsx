/* About page — three variations of a bio/about page for Kalun Leung
   Variations:
     A — editorial:  single column, large portrait stack, jury-quote pull, generous serif
     B — split:      asymmetric two-column, sticky portrait + meta, prose right, gallery interleaved
     C — index:      database-style, role / ensembles / instruments / press / contact rows
*/

const NAV_ABOUT = [
  { glyph: "▁", label: "about", href: "About.html", current: true },
  { glyph: "▄", label: "mubone", href: "#" },
  { glyph: "▉", label: "news", href: "Homepage.html#news" },
  { glyph: "▇", label: "dates", href: "Homepage.html#dates" },
  { glyph: "▙", label: "portfolio", href: "Homepage.html#portfolio" },
  { glyph: "▞", label: "collaborations", href: "#" },
  { glyph: "▦", label: "media", href: "#" },
  { glyph: "◍", label: "contact", href: "#contact" },
];

// portrait stand-ins — site has none yet; use performance images as imagery
const PORTRAIT_PRIMARY = "img/fall2025.webp";
const PORTRAIT_ALT = "img/ek1.webp";
const PORTRAIT_DETAIL = "img/may2025.webp";
const GALLERY = [
  { src: "img/csa1.webp", caption: "Conversations with Space and Architecture · Migrations · ph. Émilie Fortin" },
  { src: "img/100years1.webp", caption: "Same 36 Tunes for 100 Years · Shelland, Suffolk · ph. Marcus Roth" },
  { src: "img/bakers1.webp", caption: "Baker's Lung · #musicismore · ph. Ballade Ho" },
  { src: "img/may2025.webp", caption: "mubone CSA · Copenhagen boiler room · ph. Niklas Ottander" },
];

const JURY_QUOTE = `Kalun Leung is an exceptionally versatile artist. As a trombonist of outstanding technical skills and a highly sensitive dialogue partner, he operates in a variety of aesthetic contexts. The jury was impressed by Leung's development of the digital tool "mubone," which — originally conceived as an "augmented instrument" for the trombone — offers a creative platform for distributed authorship by performers and composers.`;
const JURY_ATTR = "Jury · Kranichstein Music Prize 2025";

// ---------- RAIL (matches Homepage but with current=about) ----------
function AboutRail() {
  return (
    <aside className="rail">
      <div className="rail-inner">
        <a className="rail-mark" href="Homepage.html" aria-label="Home">
          {"梁\n家\n綸".split("\n").map((c, i) => (<span key={i}>{c}</span>))}
        </a>
        <nav className="rail-nav" aria-label="Main">
          {NAV_ABOUT.map((n) => (
            <a key={n.label} href={n.href} className={"rail-link " + (n.current ? "rail-link-current" : "")}>
              <span className="rail-glyph" aria-hidden="true">{n.glyph}</span>
              <span className="rail-label">{n.label}</span>
              {n.current && <span className="rail-here" aria-hidden="true">●</span>}
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

// ---------- shared bio prose (used by A & B) ----------
function BioProse({ scale = 1 }) {
  return (
    <div className="prose" style={{ fontSize: `${1 * scale}rem` }}>
      <p className="prose-lede">
        Kalun Leung is a trombonist, composer, and instrument developer
        based in Tiohtià:ke / Montréal. His practice moves between concert
        stages, parish churches, boiler rooms, and bakeries — anywhere the
        instrument can be put in conversation with a place.
      </p>
      <p>
        At the centre of that practice is the <em>mubone</em>, an augmented
        trombone he co-develops with Travis West. Originally conceived as a
        single performer's tool, the mubone has become a platform for
        distributed authorship — a way of inviting composers and performers
        to write into the instrument itself rather than just for it.
      </p>
      <p>
        Recent work includes <em>Conversations with Space and Architecture</em>,
        a series of site-specific compositions; <em>Same 36 Tunes for 100&nbsp;Years</em>,
        an installation responding to the last operational barrel organ in the UK;
        and <em>Baker's Lung</em>, the second event of the
        #musicismore series, mounted inside a working bakery.
      </p>
      <p>
        He is currently in the second half of a year-long residency at
        <em> Perte de Signal</em> in Montréal, and continues to tour with the
        family-music ensemble <em>ék</em>, whose new work <em>Pouet!</em>
        debuted in September 2025.
      </p>
    </div>
  );
}

// ---------- VARIATION A — editorial portrait ----------
function VariationEditorial({ tweaks }) {
  return (
    <article className="ab ab-editorial">
      <header className="ab-head">
        <div className="ab-mark mono">▁ about / 01</div>
        <h1 className="ab-title">
          Kalun Leung
          <span className="ab-title-zh" lang="zh">梁家綸</span>
        </h1>
        <div className="ab-role mono">Trombonist · Composer · Instrument Developer</div>
        <div className="ab-place mono dim">Tiohtià:ke / Montréal · Available worldwide</div>
      </header>

      <figure className="ab-portrait ab-portrait-hero">
        <img src={PORTRAIT_PRIMARY} alt="Kalun Leung performing with the mubone" />
        <figcaption className="mono dim">
          ph. Marcus Roth · Britten Pears Arts · Suffolk, 2024
        </figcaption>
      </figure>

      <div className="ab-body">
        <BioProse scale={1.05} />

        <aside className="ab-pull">
          <div className="ab-pull-mark mono">▞ press</div>
          <blockquote className="ab-pull-quote">
            <span className="ab-pull-open">&ldquo;</span>
            {JURY_QUOTE}
          </blockquote>
          <div className="ab-pull-attr mono">{JURY_ATTR}</div>
        </aside>

        <section className="ab-credits">
          <div className="ab-credits-row">
            <div className="ab-credits-key mono">collaborators</div>
            <div className="ab-credits-val">
              Travis West · Kirsten Voss / Tonalteatret · ék · Britten Pears Arts · Perte de Signal · Émilie Fortin · Marcus Roth · Niklas Ottander
            </div>
          </div>
          <div className="ab-credits-row">
            <div className="ab-credits-key mono">recent venues</div>
            <div className="ab-credits-val">
              Former boiler room, Copenhagen · Parish church of Shelland, Suffolk · Aldeburgh · Montréal
            </div>
          </div>
          <div className="ab-credits-row">
            <div className="ab-credits-key mono">selected support</div>
            <div className="ab-credits-val">
              Kranichstein Music Prize 2025 · Conseil des arts et des lettres du Québec · Britten Pears Arts
            </div>
          </div>
        </section>

        <section className="ab-contact" id="contact">
          <h2 className="ab-h2">Get in touch</h2>
          <ul className="ab-contact-list mono">
            <li><span className="ab-contact-glyph">▰</span> email · <a href="#">hello@kalunleung.ca</a></li>
            <li><span className="ab-contact-glyph">◗</span> instagram · <a href="https://instagram.com/kalun_____">@kalun_____</a></li>
            <li><span className="ab-contact-glyph">☗</span> newsletter · <a href="#">field notes, irregularly</a></li>
          </ul>
        </section>
      </div>
    </article>
  );
}

// ---------- VARIATION B — split / asymmetric ----------
function VariationSplit({ tweaks }) {
  return (
    <article className="ab ab-split">
      <header className="ab-head ab-head-split">
        <div className="ab-mark mono">▁ about / 02</div>
        <h1 className="ab-title ab-title-split">
          A trombonist who keeps<br />ending up in <em>strange rooms</em>.
        </h1>
      </header>

      <div className="ab-split-grid">
        <aside className="ab-split-left">
          <div className="ab-split-stick">
            <figure className="ab-portrait ab-portrait-square">
              <img src={PORTRAIT_PRIMARY} alt="Kalun Leung" />
            </figure>
            <dl className="ab-meta">
              <div><dt className="mono">name</dt><dd>Kalun Leung · 梁家綸</dd></div>
              <div><dt className="mono">role</dt><dd>Trombonist, Composer, Instrument Developer</dd></div>
              <div><dt className="mono">based</dt><dd>Tiohtià:ke / Montréal</dd></div>
              <div><dt className="mono">touring</dt><dd>Worldwide · 2025–26</dd></div>
              <div><dt className="mono">tools</dt><dd>Trombone · mubone · projection · barrel organ</dd></div>
              <div><dt className="mono">languages</dt><dd>English · French · 廣東話</dd></div>
            </dl>
            <div className="ab-meta-foot mono">
              <a href="#" className="ab-meta-link">▰ download bio (pdf)</a>
              <a href="#" className="ab-meta-link">▰ technical rider</a>
              <a href="#" className="ab-meta-link">▰ press kit</a>
            </div>
          </div>
        </aside>

        <div className="ab-split-right">
          <BioProse scale={1} />

          <figure className="ab-inline-fig">
            <img src={GALLERY[0].src} alt={GALLERY[0].caption} />
            <figcaption className="mono dim">{GALLERY[0].caption}</figcaption>
          </figure>

          <h2 className="ab-h2">On the mubone</h2>
          <div className="prose">
            <p>
              The mubone began as a question: what if the trombone could
              listen back? Built collaboratively with researcher Travis West,
              it pairs the acoustic instrument with sensors, software, and
              projection — letting a single player paint a room with sound
              and image at the same time.
            </p>
            <p>
              In Copenhagen we mounted the first version with live
              projection mapping; the walls of a former boiler room, stained
              by decades of industrial use, became a third performer.
            </p>
          </div>

          <figure className="ab-inline-fig ab-inline-fig-wide">
            <img src={GALLERY[3].src} alt={GALLERY[3].caption} />
            <figcaption className="mono dim">{GALLERY[3].caption}</figcaption>
          </figure>

          <h2 className="ab-h2">Press</h2>
          <blockquote className="ab-quote-inline">
            <p>{JURY_QUOTE}</p>
            <cite className="mono">{JURY_ATTR}</cite>
          </blockquote>

          <h2 className="ab-h2" id="contact">Contact</h2>
          <div className="prose">
            <p>
              For booking, commissions, residencies, or just to say hello —
              email is the surest way to reach me.
            </p>
          </div>
          <ul className="ab-contact-list mono">
            <li><span className="ab-contact-glyph">▰</span> email · <a href="#">hello@kalunleung.ca</a></li>
            <li><span className="ab-contact-glyph">◗</span> instagram · <a href="https://instagram.com/kalun_____">@kalun_____</a></li>
            <li><span className="ab-contact-glyph">☗</span> newsletter · <a href="#">field notes, irregularly</a></li>
          </ul>
        </div>
      </div>
    </article>
  );
}

// ---------- VARIATION C — index / database ----------
const INDEX_ROWS = [
  {
    head: "statement", glyph: "▁", body: (
      <>
        <p>
          Kalun Leung is a trombonist, composer, and instrument developer based in Tiohtià:ke / Montréal.
          His practice puts the trombone into conversation with place — a parish church, a working bakery,
          a former boiler room — and asks what the instrument could become.
        </p>
      </>
    )
  },
  {
    head: "roles", glyph: "▄", body: (
      <ul className="idx-list">
        <li><span className="idx-list-key mono">performer</span><span>Trombone, mubone (augmented trombone), bass trombone, alphorn</span></li>
        <li><span className="idx-list-key mono">composer</span><span>Site-specific, immersive, music for families, electroacoustic</span></li>
        <li><span className="idx-list-key mono">developer</span><span>mubone hardware + software · with Travis West</span></li>
        <li><span className="idx-list-key mono">curator</span><span>#musicismore series · Ambient Parade</span></li>
      </ul>
    )
  },
  {
    head: "ensembles", glyph: "▞", body: (
      <ul className="idx-list">
        <li><span className="idx-list-key mono">ék</span><span>Music + theatre for families · Pouet! (2025)</span></li>
        <li><span className="idx-list-key mono">mubone</span><span>w/ Travis West · since 2019</span></li>
        <li><span className="idx-list-key mono">guest</span><span>Britten Pears Arts · Tonalteatret · Perte de Signal residencies</span></li>
      </ul>
    )
  },
  {
    head: "projects", glyph: "▙", body: (
      <ul className="idx-list">
        <li><span className="idx-list-key mono">2025</span><span>Conversations with Space and Architecture — site-specific mubone series</span></li>
        <li><span className="idx-list-key mono">2024</span><span>Same 36 Tunes for 100 Years — barrel-organ installation, Shelland, UK</span></li>
        <li><span className="idx-list-key mono">2023</span><span>Baker's Lung — concert in a bakery, Toronto</span></li>
        <li><span className="idx-list-key mono">ongoing</span><span>Ambient Parade — installative practice in development</span></li>
      </ul>
    )
  },
  {
    head: "press", glyph: "▦", body: (
      <blockquote className="idx-quote">
        <p>{JURY_QUOTE}</p>
        <cite className="mono">{JURY_ATTR}</cite>
      </blockquote>
    )
  },
  {
    head: "support", glyph: "▇", body: (
      <ul className="idx-list">
        <li><span className="idx-list-key mono">2025</span><span>Kranichstein Music Prize · Darmstadt</span></li>
        <li><span className="idx-list-key mono">2025</span><span>Perte de Signal half-year residency · Montréal</span></li>
        <li><span className="idx-list-key mono">2024</span><span>Britten Pears Arts</span></li>
        <li><span className="idx-list-key mono">ongoing</span><span>Conseil des arts et des lettres du Québec</span></li>
      </ul>
    )
  },
  {
    head: "contact", glyph: "◍", body: (
      <ul className="idx-list">
        <li><span className="idx-list-key mono">email</span><span><a href="#">hello@kalunleung.ca</a></span></li>
        <li><span className="idx-list-key mono">instagram</span><span><a href="https://instagram.com/kalun_____">@kalun_____</a></span></li>
        <li><span className="idx-list-key mono">newsletter</span><span><a href="#">field notes, irregularly</a></span></li>
        <li><span className="idx-list-key mono">booking</span><span>For commissions, tours, residencies — email above.</span></li>
      </ul>
    )
  },
];

function VariationIndex({ tweaks }) {
  return (
    <article className="ab ab-index">
      <header className="ab-head ab-head-index">
        <div className="ab-mark mono">▁ about / 03 · index view</div>
        <h1 className="ab-title ab-title-index">Kalun Leung <span className="ab-title-zh" lang="zh">· 梁家綸</span></h1>
        <div className="idx-meta-strip mono">
          <span>Trombonist</span><span className="idx-sep">·</span>
          <span>Composer</span><span className="idx-sep">·</span>
          <span>Instrument Developer</span><span className="idx-sep">·</span>
          <span className="dim">Tiohtià:ke / Montréal</span>
        </div>
      </header>

      <figure className="ab-idx-banner">
        <img src={PORTRAIT_PRIMARY} alt="Kalun Leung in performance" />
      </figure>

      <div className="idx-table">
        {INDEX_ROWS.map((row, i) => (
          <div className="idx-row" key={row.head} id={row.head === "contact" ? "contact" : undefined}>
            <div className="idx-row-head">
              <div className="idx-row-num mono">{String(i + 1).padStart(2, "0")}</div>
              <div className="idx-row-glyph" aria-hidden="true">{row.glyph}</div>
              <div className="idx-row-label mono">{row.head}</div>
            </div>
            <div className="idx-row-body">{row.body}</div>
          </div>
        ))}
      </div>

      <section className="idx-gallery">
        <header className="idx-gallery-head">
          <div className="mono">▙ field images</div>
          <div className="mono dim">selected · 2023–2025</div>
        </header>
        <div className="idx-gallery-grid">
          {GALLERY.map((g, i) => (
            <figure key={i} className="idx-gallery-cell">
              <img src={g.src} alt={g.caption} />
              <figcaption className="mono dim">{g.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </article>
  );
}

// ---------- TWEAKS ----------
const ABOUT_DEFAULTS = /*EDITMODE-BEGIN*/{
  "variant": "editorial",
  "fontPair": "tight-jet",
  "accent": "#cb2941",
  "showRail": true
}/*EDITMODE-END*/;

const FONT_PAIRS = {
  "tight-jet":  { sans: '"Inter Tight", system-ui, sans-serif', mono: '"JetBrains Mono", ui-monospace, monospace', label: "Inter Tight + JetBrains Mono" },
  "fraunces-jet": { sans: '"Fraunces", Georgia, serif', mono: '"JetBrains Mono", ui-monospace, monospace', label: "Fraunces + JetBrains" },
  "jost-roboto": { sans: '"Jost", system-ui, sans-serif', mono: '"Roboto Mono", ui-monospace, monospace', label: "Jost + Roboto Mono" },
};

function App() {
  const [tweaks, setTweak] = useTweaks(ABOUT_DEFAULTS);

  React.useEffect(() => {
    const r = document.documentElement;
    r.style.setProperty("--accent", tweaks.accent);
    const fp = FONT_PAIRS[tweaks.fontPair] || FONT_PAIRS["tight-jet"];
    r.style.setProperty("--font-sans", fp.sans);
    r.style.setProperty("--font-mono", fp.mono);
    document.body.classList.toggle("rail-hidden", !tweaks.showRail);
  }, [tweaks]);

  let view;
  if (tweaks.variant === "split") view = <VariationSplit tweaks={tweaks} />;
  else if (tweaks.variant === "index") view = <VariationIndex tweaks={tweaks} />;
  else view = <VariationEditorial tweaks={tweaks} />;

  return (
    <div className="page">
      <AboutRail />
      <main className="main main-about" data-screen-label="about">
        {view}

        <footer className="ab-foot">
          <div className="ab-foot-row mono">
            <span>© Kalun Leung 2025</span>
            <span className="dim">site set in {FONT_PAIRS[tweaks.fontPair]?.label}</span>
            <span><a href="Homepage.html">↩ home</a></span>
          </div>
        </footer>
      </main>

      <TweaksPanel title="Tweaks" defaultPos={{ right: 24, bottom: 24 }}>
        <TweakSection title="Layout">
          <TweakRadio
            label="Variation"
            value={tweaks.variant}
            onChange={(v) => setTweak("variant", v)}
            options={[
              { value: "editorial", label: "Editorial" },
              { value: "split",     label: "Split" },
              { value: "index",     label: "Index" },
            ]}
          />
          <TweakToggle label="Show rail" value={tweaks.showRail} onChange={(v) => setTweak("showRail", v)} />
        </TweakSection>

        <TweakSection title="Type & color">
          <TweakSelect
            label="Font pair"
            value={tweaks.fontPair}
            onChange={(v) => setTweak("fontPair", v)}
            options={Object.entries(FONT_PAIRS).map(([value, v]) => ({ value, label: v.label }))}
          />
          <TweakColor label="Accent" value={tweaks.accent} onChange={(v) => setTweak("accent", v)} />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
