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

// ─── Before/After Video ────────────────────────────
// Shows "before" bad metrics (red) then flips to "after" CrftdWeb results (green)

const MetricRow: React.FC<{
  icon: string;
  label: string;
  before: string;
  after: string;
  delay: number;
  showAfter: boolean;
}> = ({ icon, label, before, after, delay, showAfter }) => {
  const style = useSlideUp(delay);
  return (
    <div
      style={{
        ...style,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.subtle,
        border: `1px solid ${colors.border}`,
        borderRadius: 16,
        padding: '28px 32px',
        marginBottom: 16,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ fontSize: 32 }}>{icon}</span>
        <span style={{ fontSize: 26, fontWeight: 500, color: colors.muted }}>
          {label}
        </span>
      </div>
      <div
        style={{
          fontSize: 36,
          fontWeight: 800,
          color: showAfter ? colors.green : colors.red,
        }}
      >
        {showAfter ? after : before}
      </div>
    </div>
  );
};

export const BeforeAfter: React.FC = () => {
  const frame = useCurrentFrame();
  const showAfter = frame > 150; // Flip at 5 seconds

  const headerStyle = useSlideUp(5);
  const flipFade = useFadeIn(150, 8);
  const ctaFade = useFadeIn(220);
  const speedScore = useCountUp(155, 30, 97);

  const headerText = showAfter
    ? 'After CrftdWeb'
    : 'Your current website';
  const headerColor = showAfter ? colors.green : colors.red;

  const staggerBase = showAfter ? 155 : 30;

  return (
    <AbsoluteFill style={baseStyle}>
      <div style={safeZone}>
        {/* Phase label */}
        <div style={{ ...headerStyle, marginBottom: 16 }}>
          <div
            style={{
              fontSize: 22,
              fontWeight: 600,
              color: headerColor,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              marginBottom: 8,
            }}
          >
            {showAfter ? '✓ AFTER' : '✗ BEFORE'}
          </div>
          <div
            style={{
              fontSize: 52,
              fontWeight: 800,
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
            }}
          >
            {headerText}
          </div>
        </div>

        <div style={{ marginTop: 32 }}>
          <MetricRow
            icon="⚡"
            label="Page Speed"
            before="34/100"
            after={`${speedScore}/100`}
            delay={staggerBase}
            showAfter={showAfter}
          />
          <MetricRow
            icon="📱"
            label="Mobile"
            before="Broken"
            after="Flawless"
            delay={staggerBase + 15}
            showAfter={showAfter}
          />
          <MetricRow
            icon="🔍"
            label="SEO"
            before="Not indexed"
            after="Page 1"
            delay={staggerBase + 30}
            showAfter={showAfter}
          />
          <MetricRow
            icon="📧"
            label="Enquiries"
            before="0/month"
            after="12+/month"
            delay={staggerBase + 45}
            showAfter={showAfter}
          />
          <MetricRow
            icon="💷"
            label="Revenue impact"
            before="−£347/day"
            after="+£2.4k/mo"
            delay={staggerBase + 60}
            showAfter={showAfter}
          />
        </div>

        {/* CTA */}
        {showAfter && (
          <Sequence from={220}>
            <div style={{ opacity: ctaFade, marginTop: 36 }}>
              <CtaBadge text="See what a rebuild looks like →" />
              <Logo
                size={28}
                style={{ textAlign: 'center', margin: '20px auto 0' }}
              />
            </div>
          </Sequence>
        )}
      </div>
    </AbsoluteFill>
  );
};
