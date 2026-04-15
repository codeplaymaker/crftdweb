import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import {
  baseStyle,
  colors,
  useSlideUp,
  useFadeIn,
  useCountUp,
  Logo,
  CtaBadge,
  safeZone,
} from './brand';

// ─── Video: "The Math Hurts" ──────────────────────────
// P: Punchy hook — your cheap site is costing you thousands
// A: Animate the cheap-site math in real time
// S: Animate the good-site math and show the gap

const MathRow: React.FC<{
  label: string;
  value: string;
  highlight?: boolean;
  delay: number;
}> = ({ label, value, highlight, delay }) => {
  const style = useSlideUp(delay, 14);
  return (
    <div style={{
      ...style,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '22px 28px',
      borderRadius: 16,
      backgroundColor: highlight ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)',
      border: `1px solid ${highlight ? colors.border : 'rgba(255,255,255,0.06)'}`,
      marginBottom: 10,
    }}>
      <span style={{ fontSize: 26, fontWeight: 600, color: colors.muted }}>{label}</span>
      <span style={{
        fontSize: 30,
        fontWeight: 800,
        color: highlight ? colors.white : colors.muted,
      }}>{value}</span>
    </div>
  );
};

const DividerLine: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [delay, delay + 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div style={{
      height: 1,
      backgroundColor: colors.border,
      width: `${progress * 100}%`,
      marginBottom: 10,
    }} />
  );
};

export const TheMathHurts: React.FC = () => {
  const frame = useCurrentFrame();

  // Animated revenue numbers
  const cheapRevenue = useCountUp(45, 40, 1000);
  const goodRevenue = useCountUp(35, 40, 9600);
  const gap = useCountUp(50, 40, 8600);

  return (
    <AbsoluteFill style={baseStyle}>
      <div style={safeZone}>

        {/* ── P: HOOK (0–3s) ── */}
        <Sequence layout="none" from={0} durationInFrames={90}>
          <Logo style={{ marginBottom: 32 }} />

          <div style={useSlideUp(5)}>
            <div style={{
              fontSize: 28,
              fontWeight: 700,
              color: colors.muted,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: 20,
            }}>
              The Maths
            </div>
          </div>

          <div style={useSlideUp(15)}>
            <div style={{
              fontSize: 72,
              fontWeight: 900,
              lineHeight: 1.0,
              letterSpacing: '-0.04em',
              marginBottom: 16,
            }}>
              Your cheap
            </div>
            <div style={{
              fontSize: 72,
              fontWeight: 900,
              lineHeight: 1.0,
              letterSpacing: '-0.04em',
              marginBottom: 16,
            }}>
              site costs you
            </div>
          </div>

          <div style={useSlideUp(30)}>
            <div style={{
              fontSize: 88,
              fontWeight: 900,
              lineHeight: 1.0,
              letterSpacing: '-0.04em',
              color: colors.red,
            }}>
              £8,600/mo.
            </div>
          </div>

          <div style={useSlideUp(45)}>
            <div style={{
              fontSize: 28,
              fontWeight: 500,
              color: colors.muted,
              marginTop: 24,
              lineHeight: 1.4,
            }}>
              Here's the maths.
            </div>
          </div>
        </Sequence>

        {/* ── A: THE £500 SITE MATHS (3–6s) ── */}
        <Sequence layout="none" from={90} durationInFrames={90}>
          <div style={useSlideUp(2)}>
            <div style={{
              fontSize: 22,
              fontWeight: 700,
              color: colors.red,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: 24,
            }}>
              The £500 website
            </div>
          </div>

          <MathRow label="Monthly visitors" value="1,000" delay={8} />
          <MathRow label="Conversion rate" value="0.5%" delay={18} />
          <MathRow label="Average sale value" value="£200" delay={28} />
          <DividerLine delay={38} />
          <MathRow
            label="Monthly revenue"
            value={`£${cheapRevenue.toLocaleString()}`}
            highlight
            delay={42}
          />

          <div style={useSlideUp(55)}>
            <div style={{
              fontSize: 26,
              fontWeight: 700,
              color: colors.red,
              marginTop: 16,
            }}>
              £1,000/mo from 1,000 visitors.
            </div>
          </div>
        </Sequence>

        {/* ── S: THE £5K SITE MATHS + GAP (6–10s) ── */}
        <Sequence layout="none" from={180} durationInFrames={120}>
          <div style={useSlideUp(2)}>
            <div style={{
              fontSize: 22,
              fontWeight: 700,
              color: colors.green,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: 24,
            }}>
              The £5K website
            </div>
          </div>

          <MathRow label="Monthly visitors" value="1,000" delay={8} />
          <MathRow label="Conversion rate" value="4.8%" delay={18} />
          <MathRow label="Average sale value" value="£200" delay={28} />
          <DividerLine delay={38} />
          <MathRow
            label="Monthly revenue"
            value={`£${goodRevenue.toLocaleString()}`}
            highlight
            delay={42}
          />

          <div style={useSlideUp(55)}>
            <div style={{
              fontSize: 28,
              fontWeight: 700,
              color: colors.muted,
              marginTop: 14,
            }}>
              That's{' '}
              <span style={{ color: colors.green, fontWeight: 900 }}>
                £{gap.toLocaleString()}
              </span>{' '}
              more. Every month.
            </div>
          </div>

          <div style={useSlideUp(75)}>
            <div style={{
              fontSize: 24,
              fontWeight: 600,
              color: colors.muted,
              marginTop: 10,
            }}>
              The site pays for itself in{' '}
              <span style={{ color: colors.white, fontWeight: 800 }}>
                18 days.
              </span>
            </div>
          </div>

          <div style={{
            opacity: useFadeIn(95),
            marginTop: 32,
          }}>
            <CtaBadge text="crftdweb.com — Fix your site" />
          </div>
        </Sequence>

      </div>
    </AbsoluteFill>
  );
};
