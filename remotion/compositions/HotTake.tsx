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

// ─── PAS Video 3: "Redesign vs Rebuild" ───────────
// P: "Your website doesn't need a redesign"
// A: Strikethrough + why redesigns fail
// S: "It needs rebuilding from scratch" — CrftdWeb

export const HotTake: React.FC = () => {
  const frame = useCurrentFrame();

  const strikethrough = interpolate(frame, [70, 90], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={baseStyle}>
      <div style={safeZone}>

        {/* ── P: PROBLEM (0–2s) ── */}
        <Sequence from={0}>
          <div style={useSlideUp(8)}>
            <span style={{
              fontSize: 18,
              fontWeight: 700,
              color: colors.red,
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              padding: '8px 18px',
              border: `1px solid ${colors.red}`,
              borderRadius: 6,
            }}>
              Hot Take
            </span>
          </div>
        </Sequence>

        <Sequence from={15}>
          <div style={{ ...useSlideUp(18), marginTop: 32 }}>
            <div style={{
              fontSize: 56,
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
            }}>
              Your website doesn't need a{' '}
              <span style={{ position: 'relative', display: 'inline' }}>
                <span>redesign.</span>
                <span style={{
                  position: 'absolute',
                  left: 0,
                  top: '55%',
                  height: 4,
                  width: `${strikethrough}%`,
                  backgroundColor: colors.red,
                }} />
              </span>
            </div>
          </div>
        </Sequence>

        {/* ── A: AGITATE (2–4.5s) ── */}
        <Sequence from={60}>
          <div style={{
            marginTop: 40,
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
          }}>
            {[
              'A redesign puts new paint on a broken foundation.',
              'Templates can\'t rank. Can\'t convert. Can\'t scale.',
              'You keep paying. Nothing changes.',
            ].map((text, i) => (
              <div key={i} style={{
                ...useSlideUp(70 + i * 15),
                fontSize: 26,
                color: colors.muted,
                fontWeight: 400,
                lineHeight: 1.5,
                paddingLeft: 24,
                borderLeft: `3px solid ${colors.red}`,
              }}>
                {text}
              </div>
            ))}
          </div>
        </Sequence>

        {/* ── S: SOLVE (4.5–7s) ── */}
        <Sequence from={135}>
          <div style={{ ...useSlideUp(138), marginTop: 48 }}>
            <div style={{
              fontSize: 56,
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              color: colors.green,
              marginBottom: 24,
            }}>
              It needs rebuilding from scratch.
            </div>

            <div style={{
              ...useSlideUp(160),
              fontSize: 26,
              color: colors.white,
              fontWeight: 500,
              lineHeight: 1.5,
              paddingLeft: 24,
              borderLeft: `3px solid ${colors.green}`,
              marginBottom: 36,
            }}>
              Custom code. Every line written for your business.
            </div>

            <div style={{ opacity: useFadeIn(170) }}>
              <CtaBadge text="No templates. No shortcuts. →" />
            </div>
            <div style={{ opacity: useFadeIn(180), marginTop: 18 }}>
              <Logo size={28} style={{ textAlign: 'center', margin: '0 auto' }} />
            </div>
          </div>
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};
