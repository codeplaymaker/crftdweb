import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
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

// ─── PAS Video 1: "Invisible Website" ─────────────
// P: Your website isn't getting you customers
// A: Stats showing how much you're losing daily
// S: CrftdWeb — custom-coded, conversion-first

export const PainPoint: React.FC = () => {
  const lost = useCountUp(105, 35, 347);
  const bounce = useCountUp(135, 35, 53);

  return (
    <AbsoluteFill style={baseStyle}>
      <div style={safeZone}>

        {/* ── P: PROBLEM (0–2.5s) ── */}
        <Sequence from={0} durationInFrames={75}>
          <div style={useSlideUp(8)}>
            <div style={{
              fontSize: 22,
              fontWeight: 600,
              color: colors.red,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              marginBottom: 20,
            }}>
              Honest question
            </div>
            <div style={{
              fontSize: 64,
              fontWeight: 800,
              lineHeight: 1.12,
              letterSpacing: '-0.03em',
            }}>
              Your website looks fine.
            </div>
            <div style={{
              fontSize: 64,
              fontWeight: 800,
              lineHeight: 1.12,
              letterSpacing: '-0.03em',
              color: colors.muted,
              marginTop: 8,
            }}>
              So why isn't it working?
            </div>
          </div>
        </Sequence>

        {/* ── A: AGITATE (2.5–6s) ── */}
        <Sequence from={75}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={useSlideUp(90 - 75)}>
              <div style={{
                backgroundColor: colors.subtle,
                border: `1px solid ${colors.border}`,
                borderRadius: 20,
                padding: '32px 36px',
              }}>
                <div style={{ fontSize: 52, fontWeight: 800, color: colors.red }}>
                  £{lost}/day
                </div>
                <div style={{ fontSize: 24, color: colors.muted, marginTop: 6 }}>
                  lost because your site doesn't convert
                </div>
              </div>
            </div>

            <div style={useSlideUp(120 - 75)}>
              <div style={{
                backgroundColor: colors.subtle,
                border: `1px solid ${colors.border}`,
                borderRadius: 20,
                padding: '32px 36px',
              }}>
                <div style={{ fontSize: 52, fontWeight: 800, color: colors.red }}>
                  {bounce}% bounce
                </div>
                <div style={{ fontSize: 24, color: colors.muted, marginTop: 6 }}>
                  visitors leave in under 3 seconds
                </div>
              </div>
            </div>

            <div style={useSlideUp(150 - 75)}>
              <div style={{
                backgroundColor: colors.subtle,
                border: `1px solid ${colors.border}`,
                borderRadius: 20,
                padding: '32px 36px',
              }}>
                <div style={{ fontSize: 52, fontWeight: 800, color: colors.red }}>
                  Page 4+
                </div>
                <div style={{ fontSize: 24, color: colors.muted, marginTop: 6 }}>
                  on Google — invisible to your customers
                </div>
              </div>
            </div>

            <div style={useSlideUp(165 - 75)}>
              <div style={{
                fontSize: 30,
                fontWeight: 600,
                color: colors.white,
                textAlign: 'center',
                marginTop: 8,
                lineHeight: 1.4,
              }}>
                Every day you wait, a competitor takes your leads.
              </div>
            </div>
          </div>
        </Sequence>

        {/* ── S: SOLVE (6–8s) ── */}
        <Sequence from={180}>
          <div style={{ ...useSlideUp(180), marginTop: 40 }}>
            <div style={{
              fontSize: 36,
              fontWeight: 300,
              fontStyle: 'italic',
              color: colors.muted,
              textAlign: 'center',
              marginBottom: 16,
            }}>
              We fix that.
            </div>
            <div style={{
              fontSize: 44,
              fontWeight: 800,
              textAlign: 'center',
              lineHeight: 1.3,
              marginBottom: 32,
            }}>
              Custom-coded websites that{' '}
              <span style={{ color: colors.green }}>actually convert.</span>
            </div>
            <div style={{ opacity: useFadeIn(200) }}>
              <CtaBadge text="Free site audit — crftdweb.com" />
            </div>
            <div style={{ opacity: useFadeIn(210), marginTop: 20 }}>
              <Logo size={28} style={{ textAlign: 'center', margin: '0 auto' }} />
            </div>
          </div>
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};
