import { Scissors, Shield, Server, Eye, Cookie, Mail, ChevronRight } from 'lucide-react'
import styles from './PrivacyPolicy.module.css'

const LAST_UPDATED = 'April 7, 2026'

const SECTIONS = [
  {
    id: 'overview',
    icon: <Shield size={18} />,
    title: 'Overview',
    content: (
      <>
        <p>
          ZeroBG ("<strong>we</strong>", "<strong>us</strong>", or "<strong>our</strong>") is a free,
          browser-based AI background removal tool available at <strong>zerobg.net</strong>.
          This Privacy Policy explains what information we collect, how we use it, and your rights
          regarding that information.
        </p>
        <p>
          The short version: <strong>your images never leave your device.</strong> All AI processing
          happens locally in your browser. We do not upload, store, or process your photos on any server.
        </p>
      </>
    ),
  },
  {
    id: 'images',
    icon: <Server size={18} />,
    title: 'Your images & files',
    content: (
      <>
        <p>
          ZeroBG performs all background removal entirely client-side using the RMBG-1.4 AI model,
          which runs in your browser via WebGPU or WebAssembly. This means:
        </p>
        <ul>
          <li>Your images are <strong>never uploaded</strong> to our servers or any third-party server.</li>
          <li>Your images are <strong>never stored</strong> — they exist only in your browser's memory while you use the tool and are discarded when you close or refresh the page.</li>
          <li>Your images are <strong>never shared</strong> with any third party for any purpose.</li>
          <li>We have <strong>no technical access</strong> to the contents of any image you process.</li>
        </ul>
        <p>
          The AI model itself (~170 MB) is downloaded once from the Hugging Face CDN
          (<a href="https://cdn.jsdelivr.net" target="_blank" rel="noreferrer">cdn.jsdelivr.net</a>)
          and cached in your browser. Subsequent uses load the model from your local browser cache —
          no network request is made.
        </p>
      </>
    ),
  },
  {
    id: 'data-collected',
    icon: <Eye size={18} />,
    title: 'Information we collect',
    content: (
      <>
        <p>
          We collect minimal data necessary to operate and improve the service:
        </p>
        <h4>Analytics (anonymous)</h4>
        <p>
          We may use privacy-respecting analytics tools to understand general usage patterns such as
          page views, country of origin, and browser type. This data is aggregated and anonymous —
          it cannot be used to identify you personally. No personally identifiable information (PII)
          is collected through analytics.
        </p>
        <h4>Server logs</h4>
        <p>
          Like all websites, our hosting provider (Render / Cloudflare) may automatically log
          standard web server data including your IP address, browser user-agent, pages visited,
          and the date and time of your visit. These logs are retained for a short period for
          security and diagnostic purposes and are not used for advertising.
        </p>
        <h4>What we do NOT collect</h4>
        <ul>
          <li>Your name, email address, or any account information (no accounts required)</li>
          <li>Payment information (the service is free)</li>
          <li>The contents of any image you process</li>
          <li>Your precise location</li>
          <li>Any data from third-party platforms or social networks</li>
        </ul>
      </>
    ),
  },
  {
    id: 'cookies',
    icon: <Cookie size={18} />,
    title: 'Cookies & local storage',
    content: (
      <>
        <p>
          ZeroBG uses browser storage only for functional purposes:
        </p>
        <ul>
          <li>
            <strong>Model cache</strong> — The AI model is stored in your browser's cache after
            the first download so subsequent visits are faster. This is standard browser caching
            behavior and contains no personal information.
          </li>
          <li>
            <strong>No tracking cookies</strong> — We do not use cookies to track you across
            websites or build advertising profiles.
          </li>
          <li>
            <strong>No third-party tracking</strong> — We do not embed Facebook Pixel, Google
            Analytics tracking cookies, or similar cross-site trackers.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'advertising',
    icon: <Eye size={18} />,
    title: 'Advertising',
    content: (
      <>
        <p>
          ZeroBG is supported by Google AdSense advertisements. Google, as a third-party vendor,
          uses cookies to serve ads based on your prior visits to this and other websites.
        </p>
        <p>
          You can opt out of personalised advertising by visiting{' '}
          <a href="https://www.google.com/settings/ads" target="_blank" rel="noreferrer">
            Google's Ads Settings
          </a>{' '}
          or by visiting{' '}
          <a href="https://www.aboutads.info" target="_blank" rel="noreferrer">
            aboutads.info
          </a>
          .
        </p>
        <p>
          Google's use of advertising cookies enables it and its partners to serve ads based on
          your visit to our site and/or other sites on the internet. For more information, see
          Google's{' '}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">
            Privacy Policy
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: 'third-parties',
    icon: <Server size={18} />,
    title: 'Third-party services',
    content: (
      <>
        <p>ZeroBG uses the following third-party services to operate:</p>
        <div className={styles.thirdPartyTable}>
          {[
            { name: 'Cloudflare',      purpose: 'DNS, CDN, and DDoS protection',       policy: 'https://www.cloudflare.com/privacypolicy/' },
            { name: 'Render',          purpose: 'Website hosting',                       policy: 'https://render.com/privacy' },
            { name: 'Hugging Face / jsDelivr', purpose: 'AI model CDN delivery (first load only)', policy: 'https://huggingface.co/privacy' },
            { name: 'Google AdSense',  purpose: 'Advertising',                           policy: 'https://policies.google.com/privacy' },
            { name: 'Google Fonts',    purpose: 'Typography (Inter font)',                policy: 'https://policies.google.com/privacy' },
          ].map(r => (
            <div key={r.name} className={styles.thirdPartyRow}>
              <div className={styles.tpName}>{r.name}</div>
              <div className={styles.tpPurpose}>{r.purpose}</div>
              <a href={r.policy} target="_blank" rel="noreferrer" className={styles.tpLink}>
                Privacy policy <ChevronRight size={11} />
              </a>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    id: 'childrens',
    icon: <Shield size={18} />,
    title: "Children's privacy",
    content: (
      <p>
        ZeroBG is not directed at children under the age of 13. We do not knowingly collect
        personal information from children. If you believe a child has provided us with personal
        information, please contact us and we will promptly delete it.
      </p>
    ),
  },
  {
    id: 'rights',
    icon: <Shield size={18} />,
    title: 'Your rights',
    content: (
      <>
        <p>
          Depending on your location, you may have rights regarding your personal data including:
        </p>
        <ul>
          <li><strong>Right to access</strong> — request a copy of data we hold about you</li>
          <li><strong>Right to deletion</strong> — request deletion of your personal data</li>
          <li><strong>Right to opt out</strong> — opt out of personalised advertising</li>
          <li><strong>Right to complain</strong> — lodge a complaint with your local data protection authority</li>
        </ul>
        <p>
          Since we collect minimal data and process no images server-side, most of these rights
          have limited practical application. To exercise any right, contact us at the email below.
        </p>
      </>
    ),
  },
  {
    id: 'changes',
    icon: <Eye size={18} />,
    title: 'Changes to this policy',
    content: (
      <p>
        We may update this Privacy Policy from time to time. When we do, we will update the
        "Last updated" date at the top of this page. Continued use of ZeroBG after changes
        constitutes acceptance of the updated policy. We encourage you to review this page
        periodically.
      </p>
    ),
  },
  {
    id: 'contact',
    icon: <Mail size={18} />,
    title: 'Contact',
    content: (
      <>
        <p>
          If you have any questions, concerns, or requests regarding this Privacy Policy or
          how we handle your data, please contact us:
        </p>
        <div className={styles.contactBox}>
          <div className={styles.contactRow}>
            <span>Website</span>
            <a href="https://zerobg.net" target="_blank" rel="noreferrer">zerobg.net</a>
          </div>
          <div className={styles.contactRow}>
            <span>GitHub</span>
            <a href="https://github.com/jomdacillo/cutout-app" target="_blank" rel="noreferrer">
              github.com/jomdacillo/cutout-app
            </a>
          </div>
        </div>
        <p className={styles.contactNote}>
          We aim to respond to all privacy-related enquiries within 5 business days.
        </p>
      </>
    ),
  },
]

export default function PrivacyPolicy() {
  return (
    <div className={styles.page}>
      {/* ── Header ── */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <a href="/" className={styles.logo}>
            <div className={styles.logoIcon}>
              <Scissors size={14} strokeWidth={2.5} />
            </div>
            ZeroBG
          </a>
          <a href="/" className={styles.backLink}>← Back to app</a>
        </div>
      </header>

      <main className={styles.main}>
        {/* Hero */}
        <div className={styles.hero}>
          <div className={styles.heroIcon}>
            <Shield size={32} strokeWidth={1.5} />
          </div>
          <h1 className={styles.heroTitle}>Privacy Policy</h1>
          <p className={styles.heroSub}>
            We built ZeroBG with privacy at its core. Your images never leave your device.
          </p>
          <div className={styles.heroBadges}>
            <span className={styles.badge}>🔒 No image uploads</span>
            <span className={styles.badge}>✦ No account required</span>
            <span className={styles.badge}>∞ No data selling</span>
          </div>
          <p className={styles.lastUpdated}>Last updated: {LAST_UPDATED}</p>
        </div>

        {/* Table of contents */}
        <div className={styles.toc}>
          <div className={styles.tocTitle}>Table of contents</div>
          <div className={styles.tocLinks}>
            {SECTIONS.map(s => (
              <a key={s.id} href={`#${s.id}`} className={styles.tocLink}>
                <ChevronRight size={13} />
                {s.title}
              </a>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div className={styles.sections}>
          {SECTIONS.map(s => (
            <section key={s.id} id={s.id} className={styles.section}>
              <div className={styles.sectionHead}>
                <div className={styles.sectionIcon}>{s.icon}</div>
                <h2 className={styles.sectionTitle}>{s.title}</h2>
              </div>
              <div className={styles.sectionBody}>{s.content}</div>
            </section>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <span>© {new Date().getFullYear()} ZeroBG</span>
          <a href="/">← Back to app</a>
        </div>
      </footer>
    </div>
  )
}
