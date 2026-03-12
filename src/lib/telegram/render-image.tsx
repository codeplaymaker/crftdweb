import { ImageResponse } from 'next/og';
import { type TemplateData, TEMPLATE_THEMES } from './templates';

export async function renderTemplate(data: TemplateData): Promise<Buffer> {
  const theme = TEMPLATE_THEMES[data.type];
  const jsx = buildTemplateJsx(data, theme);
  const imageResponse = new ImageResponse(jsx, { width: 1080, height: 1920 });
  const arrayBuffer = await imageResponse.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

type Theme = { accent: string; accentRgb: string; tag: string; gradient: string };

function buildTemplateJsx(data: TemplateData, theme: Theme) {
  switch (data.type) {
    case 'problem-hook': return problemHookTemplate(data, theme);
    case 'five-signs': return fiveSignsTemplate(data, theme);
    case 'case-study': return caseStudyTemplate(data, theme);
    case 'framework': return frameworkTemplate(data, theme);
    case 'cost-comparison': return costComparisonTemplate(data, theme);
    case 'proof': return proofTemplate(data, theme);
    case 'cta': return ctaTemplate(data, theme);
    case 'tip': return tipTemplate(data, theme);
    default: return problemHookTemplate(data, theme);
  }
}

function hexToRgb(hex: string): string {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!r) return '255,255,255';
  return `${parseInt(r[1], 16)},${parseInt(r[2], 16)},${parseInt(r[3], 16)}`;
}

/* Every element must use display:'flex'. No <span>, no position:absolute,
   no flex:1, no textTransform. These are Satori limitations. */

function problemHookTemplate(data: TemplateData, theme: Theme) {
  const hl = (data.headline || '').replace(/\n/g, ' ');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: 1080, height: 1920, backgroundColor: '#050505', color: 'white', padding: '80px 64px' }}>
      <div style={{ display: 'flex', marginBottom: 32 }}>
        <div style={{ display: 'flex', padding: '8px 20px', borderRadius: 100, fontSize: 16, fontWeight: 700, letterSpacing: '0.15em', backgroundColor: `rgba(${theme.accentRgb},0.08)`, color: theme.accent }}>{data.tag || theme.tag}</div>
      </div>
      <div style={{ display: 'flex', fontSize: 72, fontWeight: 900, lineHeight: 1, letterSpacing: '-0.04em', marginBottom: 36, color: 'white' }}>{hl}</div>
      <div style={{ display: 'flex', fontSize: 22, color: 'rgba(255,255,255,0.35)', lineHeight: 1.5, marginBottom: 48 }}>{(data.subheadline || '').replace(/\n/g, ' ')}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {(data.stats || []).map((stat, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 20 }}>
            <div style={{ display: 'flex', width: 64, height: 64, borderRadius: 16, backgroundColor: `rgba(${theme.accentRgb},0.1)`, border: `1px solid rgba(${theme.accentRgb},0.15)`, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <div style={{ display: 'flex', fontSize: 24, fontWeight: 900, color: theme.accent }}>{stat.value}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <div style={{ display: 'flex', fontSize: 20, fontWeight: 700, color: 'white' }}>{stat.label}</div>
              {stat.source && <div style={{ display: 'flex', fontSize: 14, color: 'rgba(255,255,255,0.25)' }}>{stat.source}</div>}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', flexGrow: 1 }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', fontSize: 14, color: 'rgba(255,255,255,0.15)' }}>{data.footer}</div>
        <div style={{ display: 'flex', fontSize: 16, fontWeight: 800, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.2)' }}>CRFTDWEB</div>
      </div>
    </div>
  );
}

function fiveSignsTemplate(data: TemplateData, theme: Theme) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: 1080, height: 1920, backgroundColor: '#050505', color: 'white', padding: '80px 64px' }}>
      <div style={{ display: 'flex', marginBottom: 28 }}>
        <div style={{ display: 'flex', padding: '8px 20px', borderRadius: 100, fontSize: 16, fontWeight: 700, letterSpacing: '0.15em', backgroundColor: `rgba(${theme.accentRgb},0.08)`, color: theme.accent }}>{data.tag || theme.tag}</div>
      </div>
      <div style={{ display: 'flex', fontSize: 64, fontWeight: 900, lineHeight: 1, letterSpacing: '-0.04em', marginBottom: 12, color: 'white' }}>{(data.headline || '').replace(/\n/g, ' ')}</div>
      <div style={{ display: 'flex', fontSize: 20, color: 'rgba(255,255,255,0.25)', marginBottom: 36 }}>{data.subheadline}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {(data.items || []).map((item, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 20, backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '20px 24px' }}>
            <div style={{ display: 'flex', width: 48, height: 48, borderRadius: 12, backgroundColor: `rgba(${theme.accentRgb},0.12)`, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <div style={{ display: 'flex', fontSize: 18, fontWeight: 900, color: theme.accent }}>0{i + 1}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display: 'flex', fontSize: 20, fontWeight: 800, color: 'white' }}>{item.title}</div>
              <div style={{ display: 'flex', fontSize: 14, color: 'rgba(255,255,255,0.3)', lineHeight: 1.3 }}>{item.description}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', flexGrow: 1 }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', fontSize: 14, color: 'rgba(255,255,255,0.15)' }}>{data.footer}</div>
        <div style={{ display: 'flex', fontSize: 16, fontWeight: 800, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.2)' }}>CRFTDWEB</div>
      </div>
    </div>
  );
}

function caseStudyTemplate(data: TemplateData, theme: Theme) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: 1080, height: 1920, backgroundColor: '#050505', color: 'white', padding: '80px 64px' }}>
      <div style={{ display: 'flex', marginBottom: 28 }}>
        <div style={{ display: 'flex', padding: '8px 20px', borderRadius: 100, fontSize: 16, fontWeight: 700, letterSpacing: '0.15em', backgroundColor: `rgba(${theme.accentRgb},0.08)`, color: theme.accent }}>{data.tag || theme.tag}</div>
      </div>
      <div style={{ display: 'flex', fontSize: 54, fontWeight: 900, lineHeight: 1, letterSpacing: '-0.03em', marginBottom: 36, color: 'white' }}>{(data.headline || '').replace(/\n/g, ' ')}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'rgba(239,68,68,0.03)', border: '1px solid rgba(239,68,68,0.08)', borderRadius: 16, padding: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ display: 'flex', width: 10, height: 10, borderRadius: '50%', backgroundColor: '#ef4444' }} />
            <div style={{ display: 'flex', fontSize: 13, fontWeight: 800, color: '#f87171', letterSpacing: '0.12em' }}>THE PROBLEM</div>
          </div>
          <div style={{ display: 'flex', fontSize: 18, fontWeight: 600, color: 'rgba(255,255,255,0.7)', lineHeight: 1.4 }}>{data.problem}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'rgba(245,158,11,0.03)', border: '1px solid rgba(245,158,11,0.08)', borderRadius: 16, padding: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ display: 'flex', width: 10, height: 10, borderRadius: '50%', backgroundColor: '#f59e0b' }} />
            <div style={{ display: 'flex', fontSize: 13, fontWeight: 800, color: '#fbbf24', letterSpacing: '0.12em' }}>THE PROCESS</div>
          </div>
          <div style={{ display: 'flex', fontSize: 18, fontWeight: 600, color: 'rgba(255,255,255,0.7)', lineHeight: 1.4 }}>{data.process}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: `rgba(${theme.accentRgb},0.03)`, border: `1px solid rgba(${theme.accentRgb},0.1)`, borderRadius: 16, padding: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ display: 'flex', width: 10, height: 10, borderRadius: '50%', backgroundColor: theme.accent }} />
            <div style={{ display: 'flex', fontSize: 13, fontWeight: 800, color: theme.accent, letterSpacing: '0.12em' }}>THE RESULT</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', gap: 32 }}>
            {(data.results || []).map((r, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', fontSize: 40, fontWeight: 900, color: theme.accent }}>{r.value}</div>
                <div style={{ display: 'flex', fontSize: 13, color: 'rgba(255,255,255,0.25)' }}>{r.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', flexGrow: 1 }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', fontSize: 14, color: 'rgba(255,255,255,0.15)' }}>{data.footer}</div>
        <div style={{ display: 'flex', fontSize: 16, fontWeight: 800, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.2)' }}>CRFTDWEB</div>
      </div>
    </div>
  );
}

function frameworkTemplate(data: TemplateData, theme: Theme) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: 1080, height: 1920, backgroundColor: '#050505', color: 'white', padding: '80px 64px' }}>
      <div style={{ display: 'flex', marginBottom: 28 }}>
        <div style={{ display: 'flex', padding: '8px 20px', borderRadius: 100, fontSize: 16, fontWeight: 700, letterSpacing: '0.15em', backgroundColor: `rgba(${theme.accentRgb},0.08)`, color: theme.accent }}>{data.tag || theme.tag}</div>
      </div>
      <div style={{ display: 'flex', fontSize: 56, fontWeight: 900, lineHeight: 1, letterSpacing: '-0.03em', marginBottom: 12, color: 'white' }}>{(data.headline || '').replace(/\n/g, ' ')}</div>
      <div style={{ display: 'flex', fontSize: 20, color: 'rgba(255,255,255,0.3)', marginBottom: 36 }}>{data.subheadline}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {(data.steps || []).map((step, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'row', gap: 20, backgroundColor: 'rgba(255,255,255,0.02)', border: `1px solid rgba(${theme.accentRgb},0.1)`, borderRadius: 16, padding: '22px 24px', alignItems: 'center' }}>
            <div style={{ display: 'flex', width: 56, height: 56, borderRadius: 14, backgroundColor: step.color, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <div style={{ display: 'flex', fontSize: 22, fontWeight: 900, color: 'white' }}>{step.number}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display: 'flex', fontSize: 22, fontWeight: 800, color: 'white' }}>{step.title}</div>
              <div style={{ display: 'flex', fontSize: 14, color: 'rgba(255,255,255,0.35)', lineHeight: 1.4 }}>{step.description}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', flexGrow: 1 }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', fontSize: 14, color: 'rgba(255,255,255,0.15)' }}>{data.footer}</div>
        <div style={{ display: 'flex', fontSize: 16, fontWeight: 800, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.2)' }}>CRFTDWEB</div>
      </div>
    </div>
  );
}

function costComparisonTemplate(data: TemplateData, theme: Theme) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: 1080, height: 1920, backgroundColor: '#050505', color: 'white', padding: '80px 64px' }}>
      <div style={{ display: 'flex', marginBottom: 28 }}>
        <div style={{ display: 'flex', padding: '8px 20px', borderRadius: 100, fontSize: 16, fontWeight: 700, letterSpacing: '0.15em', backgroundColor: `rgba(${theme.accentRgb},0.08)`, color: theme.accent }}>{data.tag || theme.tag}</div>
      </div>
      <div style={{ display: 'flex', fontSize: 56, fontWeight: 900, lineHeight: 1, letterSpacing: '-0.04em', marginBottom: 12, color: 'white' }}>{(data.headline || '').replace(/\n/g, ' ')}</div>
      <div style={{ display: 'flex', fontSize: 18, color: 'rgba(255,255,255,0.25)', marginBottom: 32 }}>{data.subheadline}</div>
      <div style={{ display: 'flex', flexDirection: 'row', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', width: 468, backgroundColor: 'rgba(239,68,68,0.03)', border: '1px solid rgba(239,68,68,0.08)', borderRadius: 16, padding: 24 }}>
          <div style={{ display: 'flex', fontSize: 14, fontWeight: 800, color: '#f87171', letterSpacing: '0.1em', marginBottom: 16 }}>THE $500 SITE</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {(data.cheapSide || []).map((item, i) => (
              <div key={i} style={{ display: 'flex', fontSize: 16, color: 'rgba(255,255,255,0.35)' }}>x {item}</div>
            ))}
          </div>
          {data.cheapResult && (
            <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid rgba(239,68,68,0.1)', paddingTop: 16, marginTop: 20 }}>
              <div style={{ display: 'flex', fontSize: 13, color: 'rgba(255,255,255,0.2)' }}>{data.cheapResult.math}</div>
              <div style={{ display: 'flex', fontSize: 28, fontWeight: 900, color: '#f87171' }}>{data.cheapResult.total}</div>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', width: 468, backgroundColor: 'rgba(34,197,94,0.03)', border: '1px solid rgba(34,197,94,0.1)', borderRadius: 16, padding: 24 }}>
          <div style={{ display: 'flex', fontSize: 14, fontWeight: 800, color: '#4ade80', letterSpacing: '0.1em', marginBottom: 16 }}>THE $5K SITE</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {(data.premiumSide || []).map((item, i) => (
              <div key={i} style={{ display: 'flex', fontSize: 16, color: 'rgba(255,255,255,0.6)' }}>+ {item}</div>
            ))}
          </div>
          {data.premiumResult && (
            <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid rgba(34,197,94,0.1)', paddingTop: 16, marginTop: 20 }}>
              <div style={{ display: 'flex', fontSize: 13, color: 'rgba(255,255,255,0.2)' }}>{data.premiumResult.math}</div>
              <div style={{ display: 'flex', fontSize: 28, fontWeight: 900, color: '#4ade80' }}>{data.premiumResult.total}</div>
            </div>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', flexGrow: 1 }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', fontSize: 14, color: 'rgba(255,255,255,0.15)' }}>{data.footer}</div>
        <div style={{ display: 'flex', fontSize: 16, fontWeight: 800, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.2)' }}>CRFTDWEB</div>
      </div>
    </div>
  );
}

function proofTemplate(data: TemplateData, theme: Theme) {
  const colors = ['#7c3aed', '#06b6d4', '#f59e0b'];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: 1080, height: 1920, backgroundColor: '#050505', color: 'white', padding: '80px 64px' }}>
      <div style={{ display: 'flex', marginBottom: 28 }}>
        <div style={{ display: 'flex', padding: '8px 20px', borderRadius: 100, fontSize: 16, fontWeight: 700, letterSpacing: '0.15em', backgroundColor: `rgba(${theme.accentRgb},0.08)`, color: theme.accent }}>{data.tag || theme.tag}</div>
      </div>
      <div style={{ display: 'flex', fontSize: 56, fontWeight: 900, lineHeight: 1, letterSpacing: '-0.03em', marginBottom: 36, color: 'white' }}>{(data.headline || '').replace(/\n/g, ' ')}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {(data.testimonials || []).map((t, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24 }}>
            <div style={{ display: 'flex', fontSize: 20, fontWeight: 600, lineHeight: 1.4, marginBottom: 16, color: 'rgba(255,255,255,0.85)' }}>{t.quote}</div>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <div style={{ display: 'flex', width: 36, height: 36, borderRadius: '50%', backgroundColor: colors[i % 3], alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: 'white' }}>{t.name[0]}</div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', fontSize: 14, fontWeight: 700, color: 'white' }}>{t.name}</div>
                <div style={{ display: 'flex', fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>{t.role}</div>
              </div>
              <div style={{ display: 'flex', marginLeft: 'auto', backgroundColor: `rgba(${hexToRgb(colors[i % 3])},0.1)`, padding: '4px 12px', borderRadius: 100 }}>
                <div style={{ display: 'flex', fontSize: 12, fontWeight: 700, color: colors[i % 3] }}>{t.metric} {t.metricLabel}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', flexGrow: 1 }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', fontSize: 14, color: 'rgba(255,255,255,0.15)' }}>{data.footer}</div>
        <div style={{ display: 'flex', fontSize: 16, fontWeight: 800, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.2)' }}>CRFTDWEB</div>
      </div>
    </div>
  );
}

function ctaTemplate(data: TemplateData, theme: Theme) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: 1080, height: 1920, backgroundColor: '#0a0014', color: 'white', padding: '80px 80px', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', padding: '8px 20px', borderRadius: 100, fontSize: 16, fontWeight: 700, letterSpacing: '0.15em', backgroundColor: `rgba(${theme.accentRgb},0.08)`, color: theme.accent, marginBottom: 32 }}>{data.tag || theme.tag}</div>
      <div style={{ display: 'flex', fontSize: 64, fontWeight: 900, lineHeight: 1, letterSpacing: '-0.04em', marginBottom: 24, color: 'white', textAlign: 'center' }}>{(data.headline || '').replace(/\n/g, ' ')}</div>
      <div style={{ display: 'flex', fontSize: 22, color: 'rgba(255,255,255,0.3)', lineHeight: 1.4, marginBottom: 40, textAlign: 'center' }}>{(data.subheadline || '').replace(/\n/g, ' ')}</div>
      <div style={{ display: 'flex', backgroundColor: 'white', color: 'black', padding: '22px 56px', borderRadius: 100, fontSize: 24, fontWeight: 900, marginBottom: 12 }}>{data.ctaText || 'LETS FIX YOUR SITE'}</div>
      <div style={{ display: 'flex', fontSize: 15, color: 'rgba(255,255,255,0.15)' }}>{data.ctaSubtext}</div>
    </div>
  );
}

function tipTemplate(data: TemplateData, theme: Theme) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: 1080, height: 1920, backgroundColor: '#050505', color: 'white', padding: '80px 64px' }}>
      <div style={{ display: 'flex', marginBottom: 28 }}>
        <div style={{ display: 'flex', padding: '8px 20px', borderRadius: 100, fontSize: 16, fontWeight: 700, letterSpacing: '0.15em', backgroundColor: `rgba(${theme.accentRgb},0.08)`, color: theme.accent }}>{data.tag || theme.tag}</div>
      </div>
      <div style={{ display: 'flex', fontSize: 62, fontWeight: 900, lineHeight: 1, letterSpacing: '-0.04em', marginBottom: 20, color: 'white' }}>{(data.headline || '').replace(/\n/g, ' ')}</div>
      <div style={{ display: 'flex', fontSize: 22, color: 'rgba(255,255,255,0.3)', marginBottom: 40 }}>{data.subheadline}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {(data.stats || []).map((stat, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 24 }}>
            <div style={{ display: 'flex', width: 80, height: 80, borderRadius: 20, backgroundColor: `rgba(${theme.accentRgb},0.1)`, border: `1px solid rgba(${theme.accentRgb},0.15)`, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <div style={{ display: 'flex', fontSize: 28, fontWeight: 900, color: theme.accent }}>{stat.value}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display: 'flex', fontSize: 24, fontWeight: 700, color: 'white' }}>{stat.label}</div>
              {stat.source && <div style={{ display: 'flex', fontSize: 16, color: 'rgba(255,255,255,0.25)' }}>{stat.source}</div>}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', flexGrow: 1 }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', fontSize: 14, color: 'rgba(255,255,255,0.15)' }}>{data.footer}</div>
        <div style={{ display: 'flex', fontSize: 16, fontWeight: 800, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.2)' }}>CRFTDWEB</div>
      </div>
    </div>
  );
}
