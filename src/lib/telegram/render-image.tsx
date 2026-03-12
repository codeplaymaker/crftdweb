import { ImageResponse } from 'next/og';
import { type TemplateData, TEMPLATE_THEMES, type ThemeConfig } from './templates';

/* ─── Font loading ─── */
async function fetchFont(weight: number): Promise<ArrayBuffer> {
  // Use a legacy UA so Google Fonts returns .ttf instead of .woff2
  // (Satori only supports TTF/OTF, not WOFF2)
  const api = `https://fonts.googleapis.com/css2?family=Inter:wght@${weight}&display=swap`;
  const css = await fetch(api, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Linux; U; Android 2.2)',
    },
  }).then((r) => r.text());
  const url = css.match(/src:\s*url\(([^)]+)\)/)?.[1];
  if (!url) throw new Error(`Inter wght ${weight}: font URL not found in CSS`);
  return fetch(url).then((r) => r.arrayBuffer());
}

// Module-level cache
let fontCache: Record<number, Promise<ArrayBuffer>> = {};
function getFont(w: number) {
  if (!fontCache[w]) fontCache[w] = fetchFont(w);
  return fontCache[w];
}

/* ─── Logo (base-64 data URIs for Satori reliability) ─── */
const LOGO_DARK = 'https://www.crftdweb.com/CW-logo.png'; // dark logo for light bg
const LOGO_WHITE = 'https://www.crftdweb.com/CW-logo-white.png'; // white logo for dark bg

// Logo aspect ratio: 1440 / 1024 = 1.40625
const LOGO_H = 36;
const LOGO_W = Math.round(LOGO_H * (1440 / 1024)); // ≈ 51

/* ─── Public API ─── */
export async function renderTemplate(data: TemplateData): Promise<Buffer> {
  const theme = TEMPLATE_THEMES[data.type];
  const jsx = buildTemplateJsx(data, theme);

  const [regular, bold, black] = await Promise.all([
    getFont(400),
    getFont(700),
    getFont(900),
  ]);

  const imageResponse = new ImageResponse(jsx, {
    width: 1080,
    height: 1920,
    fonts: [
      { name: 'Inter', data: regular, weight: 400 as const, style: 'normal' as const },
      { name: 'Inter', data: bold, weight: 700 as const, style: 'normal' as const },
      { name: 'Inter', data: black, weight: 900 as const, style: 'normal' as const },
    ],
  });

  const arrayBuffer = await imageResponse.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/* ─── Router ─── */
function buildTemplateJsx(data: TemplateData, theme: ThemeConfig) {
  switch (data.type) {
    case 'problem-hook':
      return problemHookTemplate(data, theme);
    case 'five-signs':
      return fiveSignsTemplate(data, theme);
    case 'case-study':
      return caseStudyTemplate(data, theme);
    case 'framework':
      return frameworkTemplate(data, theme);
    case 'cost-comparison':
      return costComparisonTemplate(data, theme);
    case 'proof':
      return proofTemplate(data, theme);
    case 'cta':
      return ctaTemplate(data, theme);
    case 'tip':
      return tipTemplate(data, theme);
    default:
      return problemHookTemplate(data, theme);
  }
}

/*
 * ON-BRAND MONOCHROME (tiktok-portfolio-ads.html)
 * Font: Inter
 * Light: #fff bg, #0a0a0a text
 * Dark:  #0a0a0a bg, white text
 * Content: 200px 170px 460px 64px  (TikTok safe zones)
 */
const SAFE = '200px 170px 460px 64px';

/* ─── Shared sub-components ─── */
function LogoBar({ dark }: { dark?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 32, height: LOGO_H }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={dark ? LOGO_WHITE : LOGO_DARK}
        width={LOGO_W}
        height={LOGO_H}
        style={{ display: 'flex', height: LOGO_H, width: LOGO_W }}
      />
    </div>
  );
}

function Tag({ text, dark }: { text: string; dark?: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        padding: '7px 18px',
        borderRadius: 100,
        fontSize: 14,
        fontWeight: 600,
        letterSpacing: '0.15em',
        backgroundColor: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
        color: dark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)',
      }}
    >
      {text}
    </div>
  );
}

function Footer({ text, dark }: { text?: string; dark?: boolean }) {
  const muted = dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.2)';
  const brand = dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)';
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', fontSize: 13, color: muted }}>{text}</div>
      <div style={{ display: 'flex', fontSize: 14, fontWeight: 600, letterSpacing: '0.06em', color: brand }}>
        crftdweb.com
      </div>
    </div>
  );
}

function Spacer() {
  return <div style={{ display: 'flex', flexGrow: 1 }} />;
}

/* ─── TEMPLATES ─── */

function problemHookTemplate(data: TemplateData, theme: ThemeConfig) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: 1080, height: 1920, backgroundColor: '#ffffff', fontFamily: 'Inter', color: '#0a0a0a', padding: SAFE }}>
      <LogoBar />
      <div style={{ display: 'flex', marginBottom: 28 }}>
        <Tag text={data.tag || theme.tag} />
      </div>
      <div style={{ display: 'flex', fontSize: 72, fontWeight: 900, lineHeight: 0.95, letterSpacing: '-0.04em', marginBottom: 32, color: '#0a0a0a' }}>
        {data.headline}
      </div>
      <div style={{ display: 'flex', fontSize: 21, color: 'rgba(0,0,0,0.35)', lineHeight: 1.5, marginBottom: 36 }}>
        {data.subheadline}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {(data.stats || []).map((stat, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', width: 56, height: 56, borderRadius: 14, backgroundColor: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <div style={{ display: 'flex', fontSize: 20, fontWeight: 900, color: '#0a0a0a' }}>{stat.value}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', fontSize: 17, fontWeight: 700, color: '#0a0a0a' }}>{stat.label}</div>
              {stat.source && <div style={{ display: 'flex', fontSize: 13, color: 'rgba(0,0,0,0.25)' }}>{stat.source}</div>}
            </div>
          </div>
        ))}
      </div>
      <Spacer />
      <Footer text={data.footer} />
    </div>
  );
}

function fiveSignsTemplate(data: TemplateData, theme: ThemeConfig) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: 1080, height: 1920, backgroundColor: '#ffffff', fontFamily: 'Inter', color: '#0a0a0a', padding: SAFE }}>
      <LogoBar />
      <div style={{ display: 'flex', marginBottom: 24 }}>
        <Tag text={data.tag || theme.tag} />
      </div>
      <div style={{ display: 'flex', fontSize: 62, fontWeight: 900, lineHeight: 0.98, letterSpacing: '-0.04em', marginBottom: 12, color: '#0a0a0a' }}>
        {data.headline}
      </div>
      <div style={{ display: 'flex', fontSize: 17, color: 'rgba(0,0,0,0.25)', marginBottom: 28 }}>
        {data.subheadline}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {(data.items || []).map((item, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: 'rgba(0,0,0,0.015)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 14, padding: '20px 22px' }}>
            <div style={{ display: 'flex', width: 40, height: 40, borderRadius: 10, backgroundColor: '#0a0a0a', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <div style={{ display: 'flex', fontSize: 16, fontWeight: 800, color: 'white' }}>0{i + 1}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', fontSize: 19, fontWeight: 700, color: '#0a0a0a', marginBottom: 2 }}>{item.title}</div>
              <div style={{ display: 'flex', fontSize: 13, color: 'rgba(0,0,0,0.3)', lineHeight: 1.3 }}>{item.description}</div>
            </div>
          </div>
        ))}
      </div>
      <Spacer />
      <Footer text={data.footer} />
    </div>
  );
}

function caseStudyTemplate(data: TemplateData, theme: ThemeConfig) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: 1080, height: 1920, backgroundColor: '#ffffff', fontFamily: 'Inter', color: '#0a0a0a', padding: SAFE }}>
      <LogoBar />
      <div style={{ display: 'flex', marginBottom: 24 }}>
        <Tag text={data.tag || theme.tag} />
      </div>
      <div style={{ display: 'flex', fontSize: 52, fontWeight: 900, lineHeight: 0.98, letterSpacing: '-0.03em', marginBottom: 28, color: '#0a0a0a' }}>
        {data.headline}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Problem */}
        <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'rgba(0,0,0,0.015)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 14, padding: '20px 22px' }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ display: 'flex', width: 7, height: 7, borderRadius: '50%', backgroundColor: '#0a0a0a' }} />
            <div style={{ display: 'flex', fontSize: 12, fontWeight: 700, color: 'rgba(0,0,0,0.35)', letterSpacing: '0.12em' }}>THE PROBLEM</div>
          </div>
          <div style={{ display: 'flex', fontSize: 14, color: 'rgba(0,0,0,0.3)', lineHeight: 1.4 }}>{data.problem}</div>
        </div>
        {/* Process */}
        <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'rgba(0,0,0,0.015)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 14, padding: '20px 22px' }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ display: 'flex', width: 7, height: 7, borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.3)' }} />
            <div style={{ display: 'flex', fontSize: 12, fontWeight: 700, color: 'rgba(0,0,0,0.35)', letterSpacing: '0.12em' }}>THE PROCESS</div>
          </div>
          <div style={{ display: 'flex', fontSize: 14, color: 'rgba(0,0,0,0.3)', lineHeight: 1.4 }}>{data.process}</div>
        </div>
        {/* Result — inverted black card */}
        <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#0a0a0a', borderRadius: 14, padding: '20px 22px' }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ display: 'flex', width: 7, height: 7, borderRadius: '50%', backgroundColor: 'white' }} />
            <div style={{ display: 'flex', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.12em' }}>THE RESULT</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', gap: 24 }}>
            {(data.results || []).map((r, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', fontSize: 34, fontWeight: 900, color: 'white' }}>{r.value}</div>
                <div style={{ display: 'flex', fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{r.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Spacer />
      <Footer text={data.footer} />
    </div>
  );
}

function frameworkTemplate(data: TemplateData, theme: ThemeConfig) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: 1080, height: 1920, backgroundColor: '#ffffff', fontFamily: 'Inter', color: '#0a0a0a', padding: SAFE }}>
      <LogoBar />
      <div style={{ display: 'flex', marginBottom: 24 }}>
        <Tag text={data.tag || theme.tag} />
      </div>
      <div style={{ display: 'flex', fontSize: 56, fontWeight: 900, lineHeight: 0.98, letterSpacing: '-0.03em', marginBottom: 12, color: '#0a0a0a' }}>
        {data.headline}
      </div>
      <div style={{ display: 'flex', fontSize: 18, color: 'rgba(0,0,0,0.3)', marginBottom: 28 }}>
        {data.subheadline}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {(data.steps || []).map((step, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'row', gap: 18, backgroundColor: 'rgba(0,0,0,0.015)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 14, padding: 22, alignItems: 'center' }}>
            <div style={{ display: 'flex', width: 48, height: 48, borderRadius: 12, backgroundColor: '#0a0a0a', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <div style={{ display: 'flex', fontSize: 18, fontWeight: 900, color: 'white' }}>{step.number}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', fontSize: 21, fontWeight: 800, color: '#0a0a0a', marginBottom: 3 }}>{step.title}</div>
              <div style={{ display: 'flex', fontSize: 14, color: 'rgba(0,0,0,0.3)', lineHeight: 1.4 }}>{step.description}</div>
            </div>
          </div>
        ))}
      </div>
      <Spacer />
      <Footer text={data.footer} />
    </div>
  );
}

function costComparisonTemplate(data: TemplateData, theme: ThemeConfig) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: 1080, height: 1920, backgroundColor: '#ffffff', fontFamily: 'Inter', color: '#0a0a0a', padding: SAFE }}>
      <LogoBar />
      <div style={{ display: 'flex', marginBottom: 24 }}>
        <Tag text={data.tag || theme.tag} />
      </div>
      <div style={{ display: 'flex', fontSize: 56, fontWeight: 900, lineHeight: 0.98, letterSpacing: '-0.04em', marginBottom: 10, color: '#0a0a0a' }}>
        {data.headline}
      </div>
      <div style={{ display: 'flex', fontSize: 17, color: 'rgba(0,0,0,0.25)', marginBottom: 24 }}>
        {data.subheadline}
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', gap: 12 }}>
        {/* Cheap side — light */}
        <div style={{ display: 'flex', flexDirection: 'column', width: 430, backgroundColor: 'rgba(0,0,0,0.015)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 14, padding: 20 }}>
          <div style={{ display: 'flex', fontSize: 13, fontWeight: 700, color: 'rgba(0,0,0,0.35)', letterSpacing: '0.08em', marginBottom: 14 }}>THE $500 SITE</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(data.cheapSide || []).map((item, i) => (
              <div key={i} style={{ display: 'flex', fontSize: 15, color: 'rgba(0,0,0,0.3)' }}>x {item}</div>
            ))}
          </div>
          {data.cheapResult && (
            <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: 14, marginTop: 14 }}>
              <div style={{ display: 'flex', fontSize: 12, color: 'rgba(0,0,0,0.2)' }}>{data.cheapResult.math}</div>
              <div style={{ display: 'flex', fontSize: 26, fontWeight: 900, color: 'rgba(0,0,0,0.3)' }}>{data.cheapResult.total}</div>
            </div>
          )}
        </div>
        {/* Premium side — inverted black */}
        <div style={{ display: 'flex', flexDirection: 'column', width: 430, backgroundColor: '#0a0a0a', borderRadius: 14, padding: 20 }}>
          <div style={{ display: 'flex', fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.08em', marginBottom: 14 }}>THE $5K SITE</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(data.premiumSide || []).map((item, i) => (
              <div key={i} style={{ display: 'flex', fontSize: 15, color: 'rgba(255,255,255,0.7)' }}>+ {item}</div>
            ))}
          </div>
          {data.premiumResult && (
            <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 14, marginTop: 14 }}>
              <div style={{ display: 'flex', fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>{data.premiumResult.math}</div>
              <div style={{ display: 'flex', fontSize: 26, fontWeight: 900, color: 'white' }}>{data.premiumResult.total}</div>
            </div>
          )}
        </div>
      </div>
      <Spacer />
      <Footer text={data.footer} />
    </div>
  );
}

function proofTemplate(data: TemplateData, theme: ThemeConfig) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: 1080, height: 1920, backgroundColor: '#0a0a0a', fontFamily: 'Inter', color: 'white', padding: SAFE }}>
      <LogoBar dark />
      <div style={{ display: 'flex', marginBottom: 24 }}>
        <Tag text={data.tag || theme.tag} dark />
      </div>
      <div style={{ display: 'flex', fontSize: 56, fontWeight: 900, lineHeight: 0.98, letterSpacing: '-0.03em', marginBottom: 28, color: 'white' }}>
        {data.headline}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {(data.testimonials || []).map((t, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: 22 }}>
            <div style={{ display: 'flex', fontSize: 18, fontWeight: 600, lineHeight: 1.4, marginBottom: 14, color: 'rgba(255,255,255,0.85)' }}>
              {t.quote}
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <div style={{ display: 'flex', width: 32, height: 32, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: 'white' }}>
                {t.name[0]}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', fontSize: 13, fontWeight: 700, color: 'white' }}>{t.name}</div>
                <div style={{ display: 'flex', fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{t.role}</div>
              </div>
              <div style={{ display: 'flex', marginLeft: 'auto', backgroundColor: 'rgba(255,255,255,0.06)', padding: '3px 10px', borderRadius: 100 }}>
                <div style={{ display: 'flex', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)' }}>
                  {t.metric} {t.metricLabel}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Spacer />
      <Footer text={data.footer} dark />
    </div>
  );
}

function ctaTemplate(data: TemplateData, theme: ThemeConfig) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: 1080, height: 1920, backgroundColor: '#0a0a0a', fontFamily: 'Inter', color: 'white', padding: SAFE, alignItems: 'center', textAlign: 'center' }}>
      <div style={{ display: 'flex', width: '100%' }}>
        <LogoBar dark />
      </div>
      <Spacer />
      <div style={{ display: 'flex', fontSize: 62, fontWeight: 900, lineHeight: 0.98, letterSpacing: '-0.04em', marginBottom: 16, color: 'white', textAlign: 'center' }}>
        {data.headline}
      </div>
      <div style={{ display: 'flex', fontSize: 19, color: 'rgba(255,255,255,0.3)', lineHeight: 1.4, marginBottom: 32, textAlign: 'center' }}>
        {data.subheadline}
      </div>
      <div style={{ display: 'flex', backgroundColor: 'white', color: '#0a0a0a', padding: '18px 48px', borderRadius: 100, fontSize: 20, fontWeight: 700, marginBottom: 10 }}>
        {data.ctaText || "Let's Fix Your Site"}
      </div>
      <div style={{ display: 'flex', fontSize: 13, color: 'rgba(255,255,255,0.15)' }}>{data.ctaSubtext}</div>
      <Spacer />
      <div style={{ display: 'flex', flexDirection: 'row', gap: 12, color: 'rgba(255,255,255,0.15)', fontSize: 11, fontWeight: 500, letterSpacing: '0.08em' }}>
        <div style={{ display: 'flex' }}>Discover</div>
        <div style={{ display: 'flex', color: 'rgba(255,255,255,0.08)' }}>-</div>
        <div style={{ display: 'flex' }}>Design</div>
        <div style={{ display: 'flex', color: 'rgba(255,255,255,0.08)' }}>-</div>
        <div style={{ display: 'flex' }}>Develop</div>
        <div style={{ display: 'flex', color: 'rgba(255,255,255,0.08)' }}>-</div>
        <div style={{ display: 'flex' }}>Deliver</div>
      </div>
    </div>
  );
}

function tipTemplate(data: TemplateData, theme: ThemeConfig) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: 1080, height: 1920, backgroundColor: '#ffffff', fontFamily: 'Inter', color: '#0a0a0a', padding: SAFE }}>
      <LogoBar />
      <div style={{ display: 'flex', marginBottom: 24 }}>
        <Tag text={data.tag || theme.tag} />
      </div>
      <div style={{ display: 'flex', fontSize: 62, fontWeight: 900, lineHeight: 0.95, letterSpacing: '-0.04em', marginBottom: 20, color: '#0a0a0a' }}>
        {data.headline}
      </div>
      <div style={{ display: 'flex', fontSize: 20, color: 'rgba(0,0,0,0.3)', marginBottom: 32 }}>
        {data.subheadline}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {(data.stats || []).map((stat, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', width: 56, height: 56, borderRadius: 14, backgroundColor: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <div style={{ display: 'flex', fontSize: 20, fontWeight: 900, color: '#0a0a0a' }}>{stat.value}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', fontSize: 17, fontWeight: 700, color: '#0a0a0a' }}>{stat.label}</div>
              {stat.source && <div style={{ display: 'flex', fontSize: 13, color: 'rgba(0,0,0,0.25)' }}>{stat.source}</div>}
            </div>
          </div>
        ))}
      </div>
      <Spacer />
      <Footer text={data.footer} />
    </div>
  );
}
