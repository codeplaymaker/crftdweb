import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import {
  baseStyle,
  safeZone,
  colors,
  useSlideUp,
  useFadeIn,
  useCountUp,
  Logo,
  CtaBadge,
} from './brand';

// ─── PAS Video 2: Before/After ─────────────────────
// P: Your site is slow, broken, invisible
// A: Metrics making you feel the gap
// S: CrftdWeb results — the transformation

const MetricRow: React.FC<{
  icon: string;
  label: string;
  value: string;
  color: string;
  delay: number;
}> = ({ icon, label, value, color, delay }) => {
  const style = useSlideUp(delay);
  return (
    <div style={{
      ...style,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.subtle,
      border: `1px solid ${colors.border}`,
      borderRadius: 16,
      padding: '28px 32px',
      marginBottom: 14,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{ fontSize: 30 }}>{icon}</span>
        <span style={{ fontSize: 24, fontWeight: 500, color: colors.muted }}>{label}</span>
      </div>
      <div style={{ fontSize: 34, fontWeight: 800, color }}>
        {value}
      </div>
    </div>
  );
};

export const BeforeAfter: React.FC = () => {
  const frame = useCurrentFrame();
  const isAfter = frame >= 150;
  const speed = useCountUp(155, 25, 97);
  const headerStyle = useSlideUp(5);
  const agitateStyle = useSlideUp(25);
  const ctaFade = useFadeIn(240);

  // Before metrics
  const b1 = useSlideUp(50);
  const b2 = useSlideUp(65);
  const b3 = useSlideUp(80);
  const b4 = useSlideUp(95);
  const b5 = useSlideUp(110);

  // After metrics
  const a1 = useSlideUp(155);
  const a2 = useSlideUp(168);
  const a3 = useSlideUp(181);
  const a4 = useSlideUp(194);
  const a5 = useSlideUp(207);

  const metrics = [
    { icon: '⚡', label: 'Speed', before: '34/100', after: `${speed}/100` },
    { icon: '📱', label: 'Mobile', before: 'Broken', after: 'Flawless' },
    { icon: '🔍', label: 'Google', before: 'Not indexed', after: 'Page 1' },
    { icon: '📧', label: 'Enquiries', before: '0/month', after: '12+/month' },
    { icon: '💷', label: 'Revenue', before: '−£347/day', after: '+£2.4k/mo' },
  ];

  const beforeStyles = [b1, b2, b3, b4, b5];
  const afterStyles = [a1, a2, a3, a4, a5];

  return (
    <AbsoluteFill style={baseStyle}>
      <div style={safeZone}>

        {/* ── P: PROBLEM header ── */}
        <div style={headerStyle}>
          <div style={{
            fontSize: 20,
            fontWeight: 700,
            color: isAfter ? colors.green : colors.red,
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            marginBottom: 10,
          }}>
            {isAfter ? '✓ AFTER CRFTDWEB' : '✗ RIGHT NOW'}
          </div>
          <div style={{
            fontSize: 48,
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            marginBottom: 12,
          }}>
            {isAfter ? 'What your site could look like' : "This is your website."}
          </div>
        </div>

        {/* ── A: AGITATE text ── */}
        <div style={{
          ...agitateStyle,
          fontSize: 28,
          color: colors.muted,
          fontWeight: 400,
          lineHeight: 1.5,
          marginBottom: 24,
          opacity: isAfter ? 0 : 1,
          height: isAfter ? 0 : 'auto',
          overflow: 'hidden',
        }}>
          Your competitors already fixed theirs. You're losing customers every single day.
        </div>

        {/* Metrics */}
        <div>
          {metrics.map((m, i) => {
            const s = isAfter ? afterStyles[i] : beforeStyles[i];
            return (
              <div key={m.label} style={{
                ...s,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: colors.subtle,
                border: `1px solid ${colors.border}`,
                borderRadius: 16,
                padding: '28px 32px',
                marginBottom: 14,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ fontSize: 30 }}>{m.icon}</span>
                  <span style={{ fontSize: 24, fontWeight: 500, color: colors.muted }}>{m.label}</span>
                </div>
                <div style={{ fontSize: 34, fontWeight: 800, color: isAfter ? colors.green : colors.red }}>
                  {isAfter ? m.after : m.before}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── S: SOLVE — CTA ── */}
        <div style={{
          opacity: isAfter ? ctaFade : 0,
          marginTop: 28,
        }}>
          <div style={{
            fontSize: 28,
            fontWeight: 400,
            color: colors.muted,
            textAlign: 'center',
            marginBottom: 20,
          }}>
            No templates. Hand-coded. 14-day delivery.
          </div>
          <CtaBadge text="See your free audit → crftdweb.com" />
          <Logo size={26} style={{ textAlign: 'center', margin: '18px auto 0' }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
