import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import {
  baseStyle,
  safeZone,
  colors,
  useSlideUp,
  useFadeIn,
  Logo,
  CtaBadge,
} from './brand';

// ─── Hot Take Video ────────────────────────────────
// Contrarian hook → builds argument → CTA
// "Your website doesn't need a redesign. It needs rebuilding from scratch."

export const HotTake: React.FC = () => {
  const frame = useCurrentFrame();

  const line1 = useSlideUp(10);
  const line2 = useSlideUp(50);
  const strikethrough = interpolate(frame, [80, 100], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const line3 = useSlideUp(105);
  const bulletsFade = useFadeIn(130);
  const ctaFade = useFadeIn(165);

  return (
    <AbsoluteFill style={baseStyle}>
      <div style={safeZone}>
        {/* Hot take badge */}
        <Sequence from={0}>
          <div style={{ ...useSlideUp(0), marginBottom: 32 }}>
            <span
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: colors.red,
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                padding: '8px 20px',
                border: `1px solid ${colors.red}`,
                borderRadius: 6,
              }}
            >
              Hot Take
            </span>
          </div>
        </Sequence>

        {/* Main statement */}
        <Sequence from={10}>
          <div style={line1}>
            <div
              style={{
                fontSize: 56,
                fontWeight: 800,
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
                marginBottom: 16,
              }}
            >
              Your website doesn't need a{' '}
              <span style={{ position: 'relative', display: 'inline' }}>
                <span>redesign.</span>
                <span
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: '55%',
                    height: 4,
                    width: `${strikethrough}%`,
                    backgroundColor: colors.red,
                  }}
                />
              </span>
            </div>
          </div>
        </Sequence>

        <Sequence from={50}>
          <div style={line2}>
            <div
              style={{
                fontSize: 56,
                fontWeight: 800,
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
                color: colors.green,
              }}
            >
              It needs rebuilding from scratch.
            </div>
          </div>
        </Sequence>

        {/* Supporting bullets */}
        <Sequence from={110}>
          <div
            style={{
              opacity: bulletsFade,
              marginTop: 48,
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
            }}
          >
            {[
              'A redesign puts new paint on a broken foundation.',
              'Templates can\'t rank, can\'t convert, can\'t scale.',
              'Custom code. Every line written for your business.',
            ].map((text, i) => (
              <div
                key={i}
                style={{
                  ...useSlideUp(130 + i * 12),
                  fontSize: 26,
                  color: i === 2 ? colors.white : colors.muted,
                  fontWeight: i === 2 ? 600 : 400,
                  lineHeight: 1.5,
                  paddingLeft: 24,
                  borderLeft: `3px solid ${i === 2 ? colors.green : colors.border}`,
                }}
              >
                {text}
              </div>
            ))}
          </div>
        </Sequence>

        {/* CTA */}
        <Sequence from={160}>
          <div style={{ opacity: ctaFade, marginTop: 48 }}>
            <CtaBadge text="No templates. No shortcuts. →" />
            <Logo
              size={28}
              style={{ textAlign: 'center', margin: '20px auto 0' }}
            />
          </div>
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};
