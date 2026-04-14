import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import {
  baseStyle,
  safeZone,
  colors,
  useSlideUp,
  useCountUp,
  useFadeIn,
  Logo,
  CtaBadge,
} from './brand';

// ─── Pain Point Video ──────────────────────────────
// Hook: "Is your website costing you clients?"
// Stats animate in showing real conversion losses
// CTA: "crftdweb.com — Free site audit"

const StatCard: React.FC<{
  value: string;
  label: string;
  color: string;
  delay: number;
}> = ({ value, label, color, delay }) => {
  const style = useSlideUp(delay);
  return (
    <div
      style={{
        ...style,
        backgroundColor: colors.subtle,
        border: `1px solid ${colors.border}`,
        borderRadius: 20,
        padding: '36px 40px',
        marginBottom: 20,
      }}
    >
      <div style={{ fontSize: 56, fontWeight: 800, color, marginBottom: 8 }}>
        {value}
      </div>
      <div style={{ fontSize: 26, color: colors.muted, fontWeight: 400 }}>
        {label}
      </div>
    </div>
  );
};

export const PainPoint: React.FC = () => {
  const hookStyle = useSlideUp(10);
  const lost = useCountUp(60, 40, 347);
  const bounce = useCountUp(90, 40, 53);
  const ctaFade = useFadeIn(180);

  return (
    <AbsoluteFill style={baseStyle}>
      <div style={safeZone}>
        {/* Hook */}
        <Sequence from={0}>
          <div style={{ ...hookStyle, marginBottom: 60 }}>
            <div
              style={{
                fontSize: 28,
                fontWeight: 300,
                fontStyle: 'italic',
                color: colors.muted,
                marginBottom: 16,
              }}
            >
              Honest question...
            </div>
            <div
              style={{
                fontSize: 62,
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
              }}
            >
              Is your website{' '}
              <span style={{ color: colors.red }}>costing you</span> clients?
            </div>
          </div>
        </Sequence>

        {/* Stats */}
        <Sequence from={45}>
          <StatCard
            value={`£${lost}/day`}
            label="Average revenue lost to a slow website"
            color={colors.red}
            delay={0}
          />
        </Sequence>

        <Sequence from={75}>
          <StatCard
            value={`${bounce}%`}
            label="of visitors leave after 3 seconds"
            color={colors.red}
            delay={0}
          />
        </Sequence>

        <Sequence from={105}>
          <StatCard
            value="0 leads"
            label="if your site has no clear CTA"
            color={colors.red}
            delay={0}
          />
        </Sequence>

        {/* CTA */}
        <Sequence from={150}>
          <div style={{ opacity: ctaFade, marginTop: 40 }}>
            <CtaBadge text="Free site audit — crftdweb.com" />
          </div>
        </Sequence>

        {/* Logo */}
        <Sequence from={150}>
          <div style={{ opacity: ctaFade, marginTop: 24, textAlign: 'center' }}>
            <Logo size={30} style={{ textAlign: 'center', margin: '0 auto' }} />
          </div>
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};
