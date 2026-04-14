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

// ─── PAS Video 4: "DM Proof" ──────────────────────
// P: "Most agencies promise results. Few deliver."
// A: iMessage thread showing the BEFORE pain
// S: Same thread showing the AFTER — CrftdWeb results

const Bubble: React.FC<{
  text: string;
  isClient: boolean;
  delay: number;
}> = ({ text, isClient, delay }) => {
  const style = useSlideUp(delay, 10);
  return (
    <div style={{
      ...style,
      display: 'flex',
      justifyContent: isClient ? 'flex-start' : 'flex-end',
      marginBottom: 14,
    }}>
      <div style={{
        maxWidth: '80%',
        padding: '18px 26px',
        borderRadius: 22,
        borderBottomLeftRadius: isClient ? 4 : 22,
        borderBottomRightRadius: isClient ? 22 : 4,
        backgroundColor: isClient ? colors.blue : 'rgba(255,255,255,0.12)',
        fontSize: 25,
        lineHeight: 1.4,
        fontWeight: 400,
        color: colors.white,
      }}>
        {text}
      </div>
    </div>
  );
};

export const DmResults: React.FC = () => {
  const ctaFade = useFadeIn(310);

  return (
    <AbsoluteFill style={baseStyle}>
      <div style={safeZone}>

        {/* ── P: PROBLEM (0–2s) ── */}
        <Sequence layout="none" from={0}>
          <div style={useSlideUp(5)}>
            <div style={{
              fontSize: 22,
              fontWeight: 600,
              color: colors.red,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              marginBottom: 12,
            }}>
              Real conversation
            </div>
            <div style={{
              fontSize: 44,
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              marginBottom: 8,
            }}>
              "Our old site got us zero leads."
            </div>
          </div>
        </Sequence>

        {/* Chat header */}
        <Sequence layout="none" from={40}>
          <div style={{
            ...useSlideUp(42),
            textAlign: 'center',
            paddingTop: 20,
            paddingBottom: 16,
            borderBottom: `1px solid ${colors.border}`,
            marginBottom: 20,
          }}>
            <div style={{ fontSize: 28, fontWeight: 700 }}>Sarah — Bloom Studio</div>
            <div style={{ fontSize: 16, color: colors.muted, marginTop: 4 }}>Client since March 2026</div>
          </div>
        </Sequence>

        {/* ── A: AGITATE — the before pain (2–5s) ── */}
        <Sequence layout="none" from={60}>
          <Bubble text="Honestly? Our Wix site was embarrassing. Maybe 1 enquiry every few months." isClient={true} delay={0} />
        </Sequence>
        <Sequence layout="none" from={90}>
          <Bubble text="What was the biggest issue?" isClient={false} delay={0} />
        </Sequence>
        <Sequence layout="none" from={115}>
          <Bubble text="Speed was terrible. Nobody could find us on Google. The contact form was buried 3 clicks deep." isClient={true} delay={0} />
        </Sequence>
        <Sequence layout="none" from={145}>
          <Bubble text="So basically invisible to your customers." isClient={false} delay={0} />
        </Sequence>
        <Sequence layout="none" from={165}>
          <Bubble text="Exactly. We were paying for a site that did nothing." isClient={true} delay={0} />
        </Sequence>

        {/* ── S: SOLVE — the after results (5–10s) ── */}
        <Sequence layout="none" from={200}>
          <div style={{
            ...useSlideUp(202),
            textAlign: 'center',
            padding: '12px 0',
            margin: '8px 0',
          }}>
            <span style={{
              fontSize: 16,
              fontWeight: 600,
              color: colors.green,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
            }}>
              After CrftdWeb rebuild
            </span>
          </div>
        </Sequence>
        <Sequence layout="none" from={215}>
          <Bubble text="Quick update — we hit 14 enquiries this month through the new site 🙌" isClient={true} delay={0} />
        </Sequence>
        <Sequence layout="none" from={245}>
          <Bubble text="Page speed went from 38 to 98 👀" isClient={true} delay={0} />
        </Sequence>
        <Sequence layout="none" from={270}>
          <Bubble text="Custom code hits different. Google actually knows you exist now 😄" isClient={false} delay={0} />
        </Sequence>
        <Sequence layout="none" from={295}>
          <Bubble text="I've already referred two other businesses to you btw" isClient={true} delay={0} />
        </Sequence>

        {/* CTA */}
        <Sequence layout="none" from={310}>
          <div style={{ opacity: ctaFade, marginTop: 24 }}>
            <CtaBadge text="Real code. Real results. → crftdweb.com" />
            <Logo size={26} style={{ textAlign: 'center', margin: '16px auto 0' }} />
          </div>
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};
