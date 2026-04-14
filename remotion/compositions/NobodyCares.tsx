import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import {
  baseStyle,
  safeZone,
  colors,
  useSlideUp,
  useFadeIn,
  Logo,
  CtaBadge,
} from './brand';

// ─── PAS Video 5: "Nobody Cares What You Do" ──────
// P: Your website talks about YOU, not your customer
// A: Real examples of self-centred copy vs customer-centred
// S: CrftdWeb builds sites that speak to the customer's problem

const CompareRow: React.FC<{
  bad: string;
  good: string;
  delay: number;
}> = ({ bad, good, delay }) => {
  const style = useSlideUp(delay);
  return (
    <div style={{
      ...style,
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      marginBottom: 20,
    }}>
      <div style={{
        backgroundColor: 'rgba(239,68,68,0.08)',
        border: `1px solid rgba(239,68,68,0.25)`,
        borderRadius: 14,
        padding: '18px 24px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 14,
      }}>
        <span style={{ fontSize: 22, color: colors.red, fontWeight: 700, flexShrink: 0 }}>✗</span>
        <span style={{ fontSize: 23, color: colors.red, fontWeight: 500, lineHeight: 1.35 }}>{bad}</span>
      </div>
      <div style={{
        backgroundColor: 'rgba(16,185,129,0.08)',
        border: `1px solid rgba(16,185,129,0.25)`,
        borderRadius: 14,
        padding: '18px 24px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 14,
      }}>
        <span style={{ fontSize: 22, color: colors.green, fontWeight: 700, flexShrink: 0 }}>✓</span>
        <span style={{ fontSize: 23, color: colors.green, fontWeight: 500, lineHeight: 1.35 }}>{good}</span>
      </div>
    </div>
  );
};

export const NobodyCares: React.FC = () => {
  return (
    <AbsoluteFill style={baseStyle}>
      <div style={safeZone}>

        {/* ── P: PROBLEM (0–3s) ── */}
        <Sequence layout="none" from={0} durationInFrames={90}>
          <div style={useSlideUp(8)}>
            <div style={{
              fontSize: 22,
              fontWeight: 600,
              color: colors.red,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              marginBottom: 20,
            }}>
              Hard truth
            </div>
            <div style={{
              fontSize: 60,
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
            }}>
              Nobody cares what you do.
            </div>
            <div style={{
              fontSize: 42,
              fontWeight: 800,
              lineHeight: 1.15,
              color: colors.muted,
              marginTop: 16,
            }}>
              They care what you can do{' '}
              <span style={{ color: colors.green }}>for them.</span>
            </div>
          </div>
        </Sequence>

        {/* ── A: AGITATE (3–7.5s) ── */}
        <Sequence layout="none" from={90}>
          <div style={useSlideUp(92)}>
            <div style={{
              fontSize: 26,
              fontWeight: 600,
              color: colors.white,
              marginBottom: 24,
            }}>
              Your homepage probably says:
            </div>
          </div>

          <CompareRow
            bad={`"We are a leading provider of digital solutions"`}
            good={`"Get 3x more enquiries from your website in 30 days"`}
            delay={110}
          />
          <CompareRow
            bad={`"Our team has 15 years of experience"`}
            good={`"Your customers find you on Google — not your competitors"`}
            delay={140}
          />
          <CompareRow
            bad={`"We offer web design, SEO, and branding"`}
            good={`"A website that works while you sleep"`}
            delay={170}
          />

          <div style={useSlideUp(200)}>
            <div style={{
              fontSize: 28,
              fontWeight: 600,
              color: colors.white,
              textAlign: 'center',
              marginTop: 16,
              lineHeight: 1.4,
            }}>
              Your visitor doesn't care about you.{'\n'}
              They care about their problem.
            </div>
          </div>
        </Sequence>

        {/* ── S: SOLVE (7.5–10s) ── */}
        <Sequence layout="none" from={225}>
          <div style={{ ...useSlideUp(228), marginTop: 36 }}>
            <div style={{
              fontSize: 36,
              fontWeight: 300,
              fontStyle: 'italic',
              color: colors.muted,
              textAlign: 'center',
              marginBottom: 14,
            }}>
              We build websites that speak to them.
            </div>
            <div style={{
              fontSize: 40,
              fontWeight: 800,
              textAlign: 'center',
              lineHeight: 1.3,
              marginBottom: 28,
            }}>
              Conversion-first copy.{' '}
              <span style={{ color: colors.green }}>Customer-first design.</span>
            </div>
            <div style={{ opacity: useFadeIn(248) }}>
              <CtaBadge text="Free site audit — crftdweb.com" />
            </div>
            <div style={{ opacity: useFadeIn(258), marginTop: 18 }}>
              <Logo size={28} style={{ textAlign: 'center', margin: '0 auto' }} />
            </div>
          </div>
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};
