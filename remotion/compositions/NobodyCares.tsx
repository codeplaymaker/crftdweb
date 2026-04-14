import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import {
  baseStyle,
  colors,
  useSlideUp,
  useFadeIn,
  Logo,
  CtaBadge,
} from './brand';

// ─── PAS Video 5: "Nobody Cares What You Do" ──────
// P: Punchy hook — nobody cares
// A: Phone mockup showing bad vs good hero, then 2 tight comparisons
// S: Specific CrftdWeb solve

// Phone mockup showing a website hero section
const PhoneMockup: React.FC<{
  headline: string;
  subline: string;
  cta: string;
  isBad: boolean;
  delay: number;
}> = ({ headline, subline, cta, isBad, delay }) => {
  const style = useSlideUp(delay, 18);
  const accent = isBad ? colors.red : colors.green;
  return (
    <div style={{
      ...style,
      width: 520,
      margin: '0 auto',
      borderRadius: 36,
      border: `2px solid ${isBad ? 'rgba(239,68,68,0.4)' : 'rgba(16,185,129,0.4)'}`,
      backgroundColor: isBad ? 'rgba(239,68,68,0.04)' : 'rgba(16,185,129,0.04)',
      overflow: 'hidden',
    }}>
      {/* Status bar */}
      <div style={{
        padding: '12px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: 14,
        color: colors.muted,
      }}>
        <span>{isBad ? '✗' : '✓'} {isBad ? 'their-site.co.uk' : 'their-site.co.uk'}</span>
        <span style={{ color: accent, fontWeight: 700 }}>{isBad ? 'BEFORE' : 'AFTER'}</span>
      </div>
      {/* Hero content */}
      <div style={{ padding: '28px 32px 36px' }}>
        <div style={{
          fontSize: 32,
          fontWeight: 800,
          lineHeight: 1.2,
          color: colors.white,
          marginBottom: 12,
        }}>
          {headline}
        </div>
        <div style={{
          fontSize: 20,
          color: colors.muted,
          lineHeight: 1.4,
          marginBottom: 24,
        }}>
          {subline}
        </div>
        <div style={{
          display: 'inline-flex',
          padding: '14px 28px',
          borderRadius: 10,
          backgroundColor: accent,
          color: isBad ? colors.white : '#000',
          fontSize: 18,
          fontWeight: 700,
        }}>
          {cta}
        </div>
      </div>
    </div>
  );
};

export const NobodyCares: React.FC = () => {
  const frame = useCurrentFrame();

  // Shake effect on the "bad" phone at frame ~110
  const shake = frame >= 95 && frame <= 105
    ? interpolate(frame, [95, 97, 99, 101, 103, 105], [0, -6, 5, -4, 3, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;

  const safe: React.CSSProperties = {
    paddingTop: 150,
    paddingBottom: 480,
    paddingLeft: 60,
    paddingRight: 60,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  };

  return (
    <AbsoluteFill style={baseStyle}>
      <div style={safe}>

        {/* ── P: PROBLEM (0–3s) ── */}
        <Sequence layout="none" from={0} durationInFrames={90}>
          <div style={useSlideUp(5)}>
            <div style={{
              fontSize: 60,
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: '-0.03em',
            }}>
              Nobody cares
            </div>
            <div style={{
              fontSize: 60,
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: '-0.03em',
              color: colors.red,
            }}>
              what you do.
            </div>
          </div>

          <div style={useSlideUp(25)}>
            <div style={{
              fontSize: 44,
              fontWeight: 800,
              lineHeight: 1.15,
              marginTop: 28,
            }}>
              Everyone cares what you
            </div>
            <div style={{
              fontSize: 44,
              fontWeight: 800,
              lineHeight: 1.15,
              color: colors.green,
            }}>
              can do for them.
            </div>
          </div>
        </Sequence>

        {/* ── A: AGITATE — bad phone mockup (3–5.5s) ── */}
        <Sequence layout="none" from={90} durationInFrames={75}>
          <div style={useSlideUp(92)}>
            <div style={{
              fontSize: 24,
              fontWeight: 600,
              color: colors.muted,
              textAlign: 'center',
              marginBottom: 20,
            }}>
              This is what most business websites say:
            </div>
          </div>

          <div style={{ transform: `translateX(${shake}px)` }}>
            <PhoneMockup
              headline="Welcome to Smith & Sons Plumbing Ltd"
              subline="We are a family-run plumbing company with over 15 years of experience serving the local area."
              cta="Learn More"
              isBad={true}
              delay={98}
            />
          </div>

          <div style={useSlideUp(120)}>
            <div style={{
              fontSize: 30,
              fontWeight: 700,
              color: colors.red,
              textAlign: 'center',
              marginTop: 24,
            }}>
              Nobody's calling from that.
            </div>
          </div>
        </Sequence>

        {/* ── A→S: FLIP — good phone mockup (5.5–8s) ── */}
        <Sequence layout="none" from={165} durationInFrames={75}>
          <div style={useSlideUp(167)}>
            <div style={{
              fontSize: 24,
              fontWeight: 600,
              color: colors.muted,
              textAlign: 'center',
              marginBottom: 20,
            }}>
              This is what it should say:
            </div>
          </div>

          <PhoneMockup
            headline="Burst pipe at 2am? We're there in 30 minutes."
            subline="Emergency plumbing across Bristol. Fixed pricing. No call-out fee."
            cta="Call Now — Free Quote"
            isBad={false}
            delay={172}
          />

          <div style={useSlideUp(195)}>
            <div style={{
              fontSize: 30,
              fontWeight: 700,
              color: colors.green,
              textAlign: 'center',
              marginTop: 24,
            }}>
              That gets the phone ringing.
            </div>
          </div>
        </Sequence>

        {/* ── S: SOLVE (8–10s) ── */}
        <Sequence layout="none" from={240}>
          <div style={{ ...useSlideUp(242), marginTop: 32 }}>
            <div style={{
              fontSize: 34,
              fontWeight: 800,
              textAlign: 'center',
              lineHeight: 1.35,
              marginBottom: 10,
            }}>
              We rewrite your site around
            </div>
            <div style={{
              fontSize: 34,
              fontWeight: 800,
              textAlign: 'center',
              lineHeight: 1.35,
              color: colors.green,
              marginBottom: 28,
            }}>
              what your customer is actually searching for.
            </div>
            <div style={{ opacity: useFadeIn(260) }}>
              <CtaBadge text="Free site audit — crftdweb.com" />
            </div>
            <div style={{ opacity: useFadeIn(270), marginTop: 16 }}>
              <Logo size={28} style={{ textAlign: 'center', margin: '0 auto' }} />
            </div>
          </div>
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};
