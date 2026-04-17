import React from 'react';
import { AbsoluteFill, Sequence, staticFile, Img } from 'remotion';
import { baseStyleLight, lightColors, useSlideUp, useFadeIn } from './brand';

// ─── PIN 1: Brand Intro — White Brand ───────────────
// Scene 1 (0–3s):   Hook — "Your website isn't working for you"
// Scene 2 (3–7s):   What we do — hand-coded, no templates, from £997
// Scene 3 (7–10s):  Stats — delivery, price, quality
// Scene 4 (10–13s): CTA — DM "SITE"

const safeZone: React.CSSProperties = {
  paddingTop: 150,
  paddingBottom: 480,
  paddingLeft: 60,
  paddingRight: 150,
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
};

const Pill: React.FC<{ text: string; delay: number }> = ({ text, delay }) => {
  const style = useSlideUp(delay);
  return (
    <div style={{
      ...style,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      backgroundColor: lightColors.subtle,
      border: `1px solid ${lightColors.border}`,
      borderRadius: 50,
      padding: '14px 28px',
      marginBottom: 12,
      width: 'fit-content',
    }}>
      <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#0a0a0a', flexShrink: 0 }} />
      <span style={{ fontSize: 26, fontWeight: 500, color: lightColors.text }}>{text}</span>
    </div>
  );
};

const StatCard: React.FC<{ icon: string; value: string; label: string; delay: number }> = ({ icon, value, label, delay }) => {
  const style = useSlideUp(delay);
  return (
    <div style={{
      ...style,
      backgroundColor: lightColors.subtle,
      border: `1px solid ${lightColors.border}`,
      borderRadius: 20,
      padding: '28px 32px',
      flex: 1,
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 36 }}>{icon}</div>
      <div style={{ fontSize: 44, fontWeight: 800, color: lightColors.text, marginTop: 8 }}>{value}</div>
      <div style={{ fontSize: 20, color: lightColors.muted, marginTop: 4 }}>{label}</div>
    </div>
  );
};

export const BrandIntro: React.FC = () => {
  const ctaOpacity = useFadeIn(270);

  return (
    <AbsoluteFill style={baseStyleLight}>

      {/* ── SCENE 1: Hook (0–3s, frames 0–89) ── */}
      <Sequence layout="none" from={0} durationInFrames={90}>
        <div style={{ ...safeZone }}>
          <div style={useSlideUp(5)}>
            <div style={{
              display: 'inline-block',
              padding: '9px 22px',
              borderRadius: 50,
              backgroundColor: lightColors.tagBg,
              color: lightColors.tagText,
              border: `1px solid ${lightColors.border}`,
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase' as const,
              marginBottom: 28,
            }}>
              What We Build
            </div>
            <div style={{
              fontSize: 72,
              fontWeight: 900,
              lineHeight: 0.95,
              letterSpacing: '-0.04em',
              color: lightColors.text,
              marginBottom: 28,
            }}>
              Your website<br />
              <span style={{ color: lightColors.muted }}>should be your</span><br />
              best salesperson.
            </div>
          </div>
          <div style={{ ...useSlideUp(35), marginTop: 0 }}>
            <div style={{
              fontSize: 26,
              color: lightColors.muted,
              lineHeight: 1.6,
              fontWeight: 400,
            }}>
              Most aren't. Slow. Generic.<br />
              Invisible on Google. Zero enquiries.
            </div>
          </div>
        </div>
      </Sequence>

      {/* ── SCENE 2: What we do (3–7s, frames 90–209) ── */}
      <Sequence layout="none" from={90} durationInFrames={120}>
        <div style={{ ...safeZone }}>
          <div style={useSlideUp(5)}>
            <div style={{
              fontSize: 20,
              fontWeight: 700,
              color: lightColors.muted,
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              marginBottom: 20,
            }}>
              We fix that.
            </div>
            <div style={{
              fontSize: 60,
              fontWeight: 900,
              lineHeight: 1.0,
              letterSpacing: '-0.03em',
              color: lightColors.text,
              marginBottom: 36,
            }}>
              Hand-coded sites<br />built to convert.
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <Pill text="No templates. No page builders." delay={25} />
            <Pill text="Fast. SEO-ready. Mobile perfect." delay={40} />
            <Pill text="Done in under 2 weeks." delay={55} />
            <Pill text="Starting from £997." delay={70} />
          </div>
        </div>
      </Sequence>

      {/* ── SCENE 3: Stats (7–10s, frames 210–299) ── */}
      <Sequence layout="none" from={210} durationInFrames={90}>
        <div style={{ ...safeZone }}>
          <div style={{ ...useSlideUp(5), marginBottom: 32 }}>
            <div style={{
              fontSize: 20,
              fontWeight: 700,
              color: lightColors.muted,
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              marginBottom: 16,
            }}>
              CrftdWeb
            </div>
            <div style={{
              fontSize: 56,
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: lightColors.text,
            }}>
              Premium quality.<br />Honest pricing.
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <StatCard icon="⚡" value="<2wk" label="delivery" delay={20} />
            <StatCard icon="💷" value="£997" label="starter" delay={35} />
            <StatCard icon="💯" value="100%" label="hand-coded" delay={50} />
          </div>
        </div>
      </Sequence>

      {/* ── SCENE 4: CTA (10–13s, frames 300–390) ── */}
      <Sequence layout="none" from={300} durationInFrames={90}>
        <div style={{ ...safeZone, justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ ...useSlideUp(5), marginBottom: 32 }}>
            <div style={{
              fontSize: 66,
              fontWeight: 900,
              lineHeight: 1.0,
              letterSpacing: '-0.04em',
              color: lightColors.text,
            }}>
              DM us{' '}
              <span style={{
                backgroundColor: '#0a0a0a',
                color: '#ffffff',
                borderRadius: 12,
                padding: '4px 20px',
              }}>
                "SITE"
              </span>
            </div>
            <div style={{
              fontSize: 26,
              color: lightColors.muted,
              marginTop: 20,
              fontWeight: 400,
              lineHeight: 1.6,
            }}>
              We'll tell you honestly if your<br />website needs work.
            </div>
          </div>
          <div style={useSlideUp(30)}>
            <div style={{
              padding: '16px 40px',
              borderRadius: 50,
              border: `1px solid rgba(0,0,0,0.12)`,
              backgroundColor: lightColors.subtle,
              color: lightColors.text,
              fontSize: 28,
              fontWeight: 600,
              textAlign: 'center' as const,
            }}>
              crftdweb.com
            </div>
          </div>
        </div>
      </Sequence>

      {/* ── PERSISTENT LOGO (bottom) ── */}
      <div style={{
        position: 'absolute',
        bottom: 100,
        left: 0,
        right: 150,
        display: 'flex',
        justifyContent: 'center',
        opacity: ctaOpacity,
      }}>
        <Img src={staticFile('CW-logo.png')} style={{ height: 54, objectFit: 'contain' }} />
      </div>

    </AbsoluteFill>
  );
};
