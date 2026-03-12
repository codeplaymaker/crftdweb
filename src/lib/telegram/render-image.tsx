import { ImageResponse } from 'next/og';
import { type TemplateData, type TemplateType, TEMPLATE_THEMES } from './templates';

// Generate a 1080x1920 TikTok-sized image from template data
export async function renderTemplate(data: TemplateData): Promise<Buffer> {
  const theme = TEMPLATE_THEMES[data.type];

  const imageResponse = new ImageResponse(
    buildTemplateJsx(data, theme),
    {
      width: 1080,
      height: 1920,
    }
  );

  const arrayBuffer = await imageResponse.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

function buildTemplateJsx(
  data: TemplateData,
  theme: { accent: string; accentRgb: string; tag: string; gradient: string }
) {
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

// Shared wrapper for all templates
function frameWrapper(
  theme: { accent: string; gradient: string },
  children: React.ReactNode
) {
  return (
    <div
      style={{
        width: '1080px',
        height: '1920px',
        background: '#050505',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, sans-serif',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top accent bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: theme.gradient, display: 'flex' }} />
      {/* Content area with safe zones */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '170px 80px 460px 64px',
          width: '100%',
          height: '100%',
        }}
      >
        {children}
      </div>
    </div>
  );
}

function tagBadge(label: string, color: string) {
  return (
    <div
      style={{
        display: 'flex',
        padding: '7px 18px',
        borderRadius: '100px',
        fontSize: '16px',
        fontWeight: 700,
        letterSpacing: '0.15em',
        textTransform: 'uppercase' as const,
        background: `rgba(${hexToRgb(color)}, 0.08)`,
        color: color,
        marginBottom: '28px',
      }}
    >
      {label}
    </div>
  );
}

function brandFooter(text: string) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
      <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.15)' }}>{text}</span>
      <span style={{ fontSize: '16px', fontWeight: 800, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.2)' }}>CRFTDWEB</span>
    </div>
  );
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '255,255,255';
  return `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`;
}

// ═══════════ PROBLEM HOOK ═══════════
function problemHookTemplate(data: TemplateData, theme: { accent: string; accentRgb: string; tag: string; gradient: string }) {
  return frameWrapper(theme, (
    <>
      {tagBadge(data.tag || theme.tag, theme.accent)}
      <div style={{ fontSize: '72px', fontWeight: 900, lineHeight: 0.95, letterSpacing: '-0.04em', marginBottom: '32px', display: 'flex', flexDirection: 'column' }}>
        {(data.headline || '').split('\n').map((line, i) => (
          <span key={i} style={{ display: 'flex' }}>
            {line.includes('losing') ? (
              <>
                {line.split('losing')[0]}<span style={{ color: theme.accent }}>losing</span>{line.split('losing')[1]}
              </>
            ) : line}
          </span>
        ))}
      </div>
      <div style={{ fontSize: '22px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.5, marginBottom: '36px', display: 'flex', flexDirection: 'column' }}>
        {(data.subheadline || '').split('\n').map((line, i) => (
          <span key={i}>{line}</span>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
        {(data.stats || []).map((stat, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '14px',
              background: `rgba(${theme.accentRgb}, 0.08)`,
              border: `1px solid rgba(${theme.accentRgb}, 0.12)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: '22px', fontWeight: 900, color: theme.accent }}>{stat.value}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '18px', fontWeight: 700 }}>{stat.label}</span>
              {stat.source && <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.25)' }}>— {stat.source}</span>}
            </div>
          </div>
        ))}
      </div>
      {brandFooter(data.footer || '')}
    </>
  ));
}

// ═══════════ FIVE SIGNS ═══════════
function fiveSignsTemplate(data: TemplateData, theme: { accent: string; accentRgb: string; tag: string; gradient: string }) {
  return frameWrapper(theme, (
    <>
      {tagBadge(data.tag || theme.tag, theme.accent)}
      <div style={{ fontSize: '62px', fontWeight: 900, lineHeight: 0.98, letterSpacing: '-0.04em', marginBottom: '12px', display: 'flex', flexDirection: 'column' }}>
        {(data.headline || '').split('\n').map((line, i) => (
          <span key={i}>{line.includes('converting') ? <><span>{line.replace('converting.', '')}</span><span style={{ color: theme.accent }}>converting.</span></> : line}</span>
        ))}
      </div>
      <div style={{ fontSize: '18px', color: 'rgba(255,255,255,0.25)', marginBottom: '32px', display: 'flex' }}>{data.subheadline}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
        {(data.items || []).map((item, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '16px',
            padding: '22px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
            flex: 1,
          }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: `linear-gradient(135deg, rgba(${theme.accentRgb},0.15), rgba(${theme.accentRgb},0.05))`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <span style={{ fontSize: '18px', fontWeight: 900, color: theme.accent }}>0{i + 1}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '20px', fontWeight: 800, marginBottom: '2px' }}>{item.title}</span>
              <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.3)', lineHeight: 1.3 }}>{item.description}</span>
            </div>
          </div>
        ))}
      </div>
      {brandFooter(data.footer || '')}
    </>
  ));
}

// ═══════════ CASE STUDY ═══════════
function caseStudyTemplate(data: TemplateData, theme: { accent: string; accentRgb: string; tag: string; gradient: string }) {
  return frameWrapper(theme, (
    <>
      {tagBadge(data.tag || theme.tag, theme.accent)}
      <div style={{ fontSize: '54px', fontWeight: 900, lineHeight: 0.98, letterSpacing: '-0.03em', marginBottom: '32px', display: 'flex', flexDirection: 'column' }}>
        {(data.headline || '').split('\n').map((line, i) => (
          <span key={i} style={{ display: 'flex' }}>
            {line.includes('industry-leading') ? <span style={{ color: theme.accent }}>{line}</span> :
             line.includes('invisible') ? <>{line.replace('invisible', '')}<span style={{ color: 'rgba(255,255,255,0.3)' }}>invisible</span></> : line}
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
        {/* Problem */}
        <div style={{ background: 'rgba(239,68,68,0.03)', border: '1px solid rgba(239,68,68,0.08)', borderRadius: '16px', padding: '22px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#f87171', letterSpacing: '0.12em', textTransform: 'uppercase' as const }}>THE PROBLEM</span>
          </div>
          <span style={{ fontSize: '17px', fontWeight: 600, color: 'rgba(255,255,255,0.7)', lineHeight: 1.4 }}>{data.problem}</span>
        </div>
        {/* Process */}
        <div style={{ background: 'rgba(245,158,11,0.03)', border: '1px solid rgba(245,158,11,0.08)', borderRadius: '16px', padding: '22px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} />
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#fbbf24', letterSpacing: '0.12em', textTransform: 'uppercase' as const }}>THE PROCESS</span>
          </div>
          <span style={{ fontSize: '17px', fontWeight: 600, color: 'rgba(255,255,255,0.7)', lineHeight: 1.4 }}>{data.process}</span>
        </div>
        {/* Result */}
        <div style={{ background: `rgba(${theme.accentRgb},0.03)`, border: `1px solid rgba(${theme.accentRgb},0.1)`, borderRadius: '16px', padding: '22px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: theme.accent }} />
            <span style={{ fontSize: '13px', fontWeight: 800, color: theme.accent, letterSpacing: '0.12em', textTransform: 'uppercase' as const }}>THE RESULT</span>
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            {(data.results || []).map((r, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '36px', fontWeight: 900, color: theme.accent }}>{r.value}</span>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>{r.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {brandFooter(data.footer || '')}
    </>
  ));
}

// ═══════════ FRAMEWORK ═══════════
function frameworkTemplate(data: TemplateData, theme: { accent: string; accentRgb: string; tag: string; gradient: string }) {
  return frameWrapper(theme, (
    <>
      {tagBadge(data.tag || theme.tag, theme.accent)}
      <div style={{ fontSize: '56px', fontWeight: 900, lineHeight: 0.98, letterSpacing: '-0.03em', marginBottom: '12px', display: 'flex', flexDirection: 'column' }}>
        {(data.headline || '').split('\n').map((line, i) => (
          <span key={i} style={i === 1 ? { color: theme.accent } : {}}>{line}</span>
        ))}
      </div>
      <div style={{ fontSize: '20px', color: 'rgba(255,255,255,0.3)', marginBottom: '32px', display: 'flex' }}>{data.subheadline}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
        {(data.steps || []).map((step, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.02)',
            border: `1px solid rgba(${theme.accentRgb},0.1)`,
            borderRadius: '16px', padding: '22px 24px',
            display: 'flex', gap: '18px', flex: 1,
          }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '14px',
              background: step.color, display: 'flex',
              alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <span style={{ fontSize: '22px', fontWeight: 900, color: 'white' }}>{step.number}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <span style={{ fontSize: '22px', fontWeight: 800, marginBottom: '3px' }}>{step.title}</span>
              <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.4 }}>{step.description}</span>
            </div>
          </div>
        ))}
      </div>
      {brandFooter(data.footer || '')}
    </>
  ));
}

// ═══════════ COST COMPARISON ═══════════
function costComparisonTemplate(data: TemplateData, theme: { accent: string; accentRgb: string; tag: string; gradient: string }) {
  return frameWrapper(theme, (
    <>
      {tagBadge(data.tag || theme.tag, theme.accent)}
      <div style={{ fontSize: '58px', fontWeight: 900, lineHeight: 0.98, letterSpacing: '-0.04em', marginBottom: '12px', display: 'flex', flexDirection: 'column' }}>
        {(data.headline || '').split('\n').map((line, i) => (
          <span key={i}>{line.includes('$500') ? <>{line.replace('$500', '')}<span style={{ color: '#ef4444' }}>$500</span></> :
            line.includes('$50,000') ? <><span style={{ color: 'rgba(255,255,255,0.3)' }}>{line}</span></> : line}</span>
        ))}
      </div>
      <div style={{ fontSize: '18px', color: 'rgba(255,255,255,0.25)', marginBottom: '28px', display: 'flex' }}>{data.subheadline}</div>
      <div style={{ display: 'flex', gap: '14px', flex: 1 }}>
        {/* Cheap */}
        <div style={{ flex: 1, background: 'rgba(239,68,68,0.02)', border: '1px solid rgba(239,68,68,0.08)', borderRadius: '16px', padding: '22px', display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '14px', fontWeight: 800, color: '#f87171', letterSpacing: '0.1em', marginBottom: '14px' }}>💸 THE $500 SITE</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
            {(data.cheapSide || []).map((item, i) => (
              <span key={i} style={{ fontSize: '16px', color: 'rgba(255,255,255,0.35)' }}>✕ {item}</span>
            ))}
          </div>
          {data.cheapResult && (
            <div style={{ borderTop: '1px solid rgba(239,68,68,0.1)', paddingTop: '14px', marginTop: '14px', display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.2)' }}>{data.cheapResult.math}</span>
              <span style={{ fontSize: '28px', fontWeight: 900, color: '#f87171' }}>{data.cheapResult.total}</span>
            </div>
          )}
        </div>
        {/* Premium */}
        <div style={{ flex: 1, background: 'rgba(34,197,94,0.02)', border: '1px solid rgba(34,197,94,0.1)', borderRadius: '16px', padding: '22px', display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '14px', fontWeight: 800, color: '#4ade80', letterSpacing: '0.1em', marginBottom: '14px' }}>✦ THE $5K SITE</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
            {(data.premiumSide || []).map((item, i) => (
              <span key={i} style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)' }}>✓ {item}</span>
            ))}
          </div>
          {data.premiumResult && (
            <div style={{ borderTop: '1px solid rgba(34,197,94,0.1)', paddingTop: '14px', marginTop: '14px', display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.2)' }}>{data.premiumResult.math}</span>
              <span style={{ fontSize: '28px', fontWeight: 900, color: '#4ade80' }}>{data.premiumResult.total}</span>
            </div>
          )}
        </div>
      </div>
      {brandFooter(data.footer || '')}
    </>
  ));
}

// ═══════════ PROOF / TESTIMONIALS ═══════════
function proofTemplate(data: TemplateData, theme: { accent: string; accentRgb: string; tag: string; gradient: string }) {
  const colors = ['#7c3aed', '#06b6d4', '#f59e0b'];
  return frameWrapper(theme, (
    <>
      {tagBadge(data.tag || theme.tag, theme.accent)}
      <div style={{ fontSize: '56px', fontWeight: 900, lineHeight: 0.98, letterSpacing: '-0.03em', marginBottom: '32px', display: 'flex', flexDirection: 'column' }}>
        {(data.headline || '').split('\n').map((line, i) => (
          <span key={i}>{line}</span>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
        {(data.testimonials || []).map((t, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '16px', padding: '24px',
            display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1,
          }}>
            <span style={{ fontSize: '36px', height: '32px', marginBottom: '8px', color: `rgba(${hexToRgb(colors[i % 3])},0.3)` }}>&ldquo;</span>
            <span style={{ fontSize: '19px', fontWeight: 600, lineHeight: 1.4, marginBottom: '16px', color: 'rgba(255,255,255,0.85)' }}>{t.quote}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: colors[i % 3],
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '14px', fontWeight: 800,
              }}>{t.name[0]}</div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '14px', fontWeight: 700 }}>{t.name}</span>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>{t.role}</span>
              </div>
              <div style={{
                marginLeft: 'auto',
                background: `rgba(${hexToRgb(colors[i % 3])},0.08)`,
                padding: '4px 12px', borderRadius: '100px', display: 'flex',
              }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: colors[i % 3] }}>{t.metric} {t.metricLabel}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {brandFooter(data.footer || '')}
    </>
  ));
}

// ═══════════ CTA ═══════════
function ctaTemplate(data: TemplateData, theme: { accent: string; accentRgb: string; tag: string; gradient: string }) {
  return (
    <div
      style={{
        width: '1080px', height: '1920px',
        background: 'linear-gradient(170deg, #0a0014, #18003a 45%, #0a0014)',
        display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif',
        color: 'white', position: 'relative', overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: theme.gradient, display: 'flex' }} />
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '170px 80px 460px 80px', width: '100%', height: '100%', textAlign: 'center',
      }}>
        {tagBadge(data.tag || theme.tag, theme.accent)}
        <div style={{ fontSize: '64px', fontWeight: 900, lineHeight: 0.98, letterSpacing: '-0.04em', marginBottom: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {(data.headline || '').split('\n').map((line, i) => (
            <span key={i} style={line.includes('making you money') ? { color: theme.accent } : {}}>{line}</span>
          ))}
        </div>
        <div style={{ fontSize: '20px', color: 'rgba(255,255,255,0.3)', lineHeight: 1.4, marginBottom: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {(data.subheadline || '').split('\n').map((line, i) => (
            <span key={i}>{line}</span>
          ))}
        </div>
        <div style={{
          background: 'white', color: 'black', padding: '20px 52px',
          borderRadius: '100px', fontSize: '22px', fontWeight: 900, marginBottom: '10px', display: 'flex',
        }}>
          {data.ctaText || "LET'S FIX YOUR SITE →"}
        </div>
        <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.15)' }}>{data.ctaSubtext}</span>
      </div>
    </div>
  );
}

// ═══════════ TIP ═══════════
function tipTemplate(data: TemplateData, theme: { accent: string; accentRgb: string; tag: string; gradient: string }) {
  return frameWrapper(theme, (
    <>
      {tagBadge(data.tag || theme.tag, theme.accent)}
      <div style={{ fontSize: '62px', fontWeight: 900, lineHeight: 0.98, letterSpacing: '-0.04em', marginBottom: '20px', display: 'flex', flexDirection: 'column' }}>
        {(data.headline || '').split('\n').map((line, i) => (
          <span key={i}>{line}</span>
        ))}
      </div>
      <div style={{ fontSize: '20px', color: 'rgba(255,255,255,0.3)', marginBottom: '32px', display: 'flex' }}>{data.subheadline}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
        {(data.stats || []).map((stat, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '18px',
              background: `rgba(${theme.accentRgb}, 0.08)`,
              border: `1px solid rgba(${theme.accentRgb}, 0.12)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: '26px', fontWeight: 900, color: theme.accent }}>{stat.value}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '22px', fontWeight: 700 }}>{stat.label}</span>
              {stat.source && <span style={{ fontSize: '15px', color: 'rgba(255,255,255,0.25)' }}>{stat.source}</span>}
            </div>
          </div>
        ))}
      </div>
      {brandFooter(data.footer || '')}
    </>
  ));
}
