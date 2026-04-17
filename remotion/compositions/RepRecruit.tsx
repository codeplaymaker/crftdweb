import React from 'react';
import { AbsoluteFill, Sequence, staticFile, Img } from 'remotion';
import { baseStyleLight, lightColors, useSlideUp, useFadeIn } from './brand';

// ─── PIN 3: Rep Recruitment — White Brand ───────────────
// Scene 1 (0–3s):   Hook — "Earn up to 35% selling websites"
// Scene 2 (3–7s):   How it works — 3 steps
// Scene 3 (7–10s):  Commission rates
// Scene 4 (10–14s): CTA — crftdweb.com/apply

const FPS = 30;

const safeZone: React.CSSProperties = {
  paddingTop: 150,
  paddingBottom: 480,
  paddingLeft: 60,
  paddingRight: 150,
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
};

const Step: React.FC<{
  number: string;
  title: string;
  desc: string;
  delay: number;
}> = ({ number, title, desc, delay }) => {
  const style = useSlideUp(delay);
  return (
    <div style={{
      ...style,
      display: 'flex',
      gap: 20,
      alignItems: 'flex-start',
      backgroundColor: lightColors.subtle,
      border: `1px solid ${lightColors.border}`,
      borderRadius: 20,
      padding: '26px 28px',
      marginBottom: 14,
    }}>
      <div style={{
        width: 50,
        height: 50,
        borderRadius: 14,
        backgroundColor: '#0a0a0a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 22,
        fontWeight: 900,
        color: '#ffffff',
        flexShrink: 0,
      }}>
        {number}
      </div>
      <div>
        <div style={{ fontSize: 24, fontWeight: 700, color: lightColors.text, marginBottom: 6 }}>{title}</div>
        <div style={{ fontSize: 20, color: lightColors.muted, lineHeight: 1.4 }}>{desc}</div>
      </div>
    </div>
  );
};
const CommissionRow: React.FC<{ rank: string; rate: string; delay: number; highlight?: boolean }> = ({
  rank, rate, delay, highlight = false,
}) => {
  const style = useSlideUp(delay);
  return (
    <div style={{
      ...style,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: highlight ? '#0a0a0a' : lightColors.subtle,
      border: `1px solid ${highlight ? '#0a0a0a' : lightColors.border}`,
      borderRadius: 14,
      padding: '20px 28px',
      marginBottom: 10,
    }}>
      <span style={{ fontSize: 22, fontWeight: 600, color: highlight ? '#ffffff' : lightColors.muted }}>{rank}</span>
      <span style={{ fontSize: 26, fontWeight: 900, color: highlight ? '#ffffff' : lightColors.text }}>{rate}</span>
    </div>
  );
};

export const RepRecruit: React.FC = () => {
  const logoOpacity = useFadeIn(0, 20);

  return (
    <AbsoluteFill style={baseStyleLight}>

      {/* ── SCENE 1: Hook (0–3s, frames 0–89) ── */}
      <Sequence layout="none" from={0} durationInFrames={90}>
        <div style={{ ...safeZone }}>
          <div style={useSlideUp(5)}>
            <div style={{
              display: 'inline-block',
              padding: '9px 22px',
              borderRadius: 50,
              backgroundColor: '#0a0a0a',
              color: '#ffffff',
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase' as const,
              marginBottom: 28,
            }}>
              Now Hiring
            </div>
            <div style={{
              fontSize: 72,
              fontWeight: 900,
              lineHeight: 0.95,
              letterSpacing: '-0.04em',
              color: lightColors.text,
              marginBottom: 24,
            }}>
              Earn up to<br />
              35% selling<br />
              <span style={{ color: lightColors.muted }}>websites.</span>
            </div>
          </div>
          <div style={{ ...useSlideUp(30), marginTop: 8 }}>
            <div style={{
              fontSize: 26,
              color: lightColors.muted,
              lineHeight: 1.6,
              fontWeight: 400,
            }}>
              No experience needed.<br />
              Work from anywhere.<br />
              Commission only — up to <span style={{ color: lightColors.text, fontWeight: 700 }}>35% per deal.</span>
            </div>
          </div>
        </div>
      </Sequence>

      {/* ── SCENE 2: How it works (3–7s, frames 90–209) ── */}
      <Sequence layout="none" from={90} durationInFrames={120}>
        <div style={{ ...safeZone }}>
          <div style={{ ...useSlideUp(5), marginBottom: 28 }}>
            <div style={{
              fontSize: 20,
              fontWeight: 700,
              color: lightColors.muted,
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              marginBottom: 12,
            }}>
              How it works
            </div>
            <div style={{
              fontSize: 50,
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: lightColors.text,
            }}>
              Three steps.<br />You keep the cut.
            </div>
          </div>
          <Step number="1" title="Find the lead" desc="Spot UK businesses with a bad website" delay={30} />
          <Step number="2" title="We close & build" desc="Our team handles the sale, design, and delivery" delay={50} />
          <Step number="3" title="You get paid" desc="Commission within 7 days of client deposit" delay={70} />
        </div>
      </Sequence>

      {/* ── SCENE 3: Commission (7–10s, frames 210–299) ── */}
      <Sequence layout="none" from={210} durationInFrames={90}>
        <div style={{ ...safeZone }}>
          <div style={{ ...useSlideUp(5), marginBottom: 28 }}>
            <div style={{
              fontSize: 20,
              fontWeight: 700,
              color: lightColors.muted,
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              marginBottom: 12,
            }}>
              What you earn
            </div>
            <div style={{
              fontSize: 50,
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: lightColors.text,
            }}>
              Up to £1,000<br />per deal.
            </div>
          </div>
          <CommissionRow rank="Starter site  (£997)"  rate="£199 / deal" delay={25} />
          <CommissionRow rank="Launch site  (£2,497)" rate="£375 / deal" delay={38} />
          <CommissionRow rank="Growth site  (£4,997)" rate="£600 / deal" delay={51} highlight />
          <CommissionRow rank="Scale site   (£9,997)" rate="£1,000 / deal" delay={64} />
        </div>
      </Sequence>

      {/* ── SCENE 4: CTA (10–14s, frames 300–420) ── */}
      <Sequence layout="none" from={300} durationInFrames={120}>
        <div style={{ ...safeZone, justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ ...useSlideUp(5), marginBottom: 16 }}>
            <div style={{
              fontSize: 66,
              fontWeight: 900,
              lineHeight: 1.0,
              letterSpacing: '-0.04em',
              color: lightColors.text,
              marginBottom: 20,
            }}>
              Ready to apply?
            </div>
            <div style={{
              fontSize: 26,
              color: lightColors.muted,
              fontWeight: 400,
              lineHeight: 1.6,
              marginBottom: 40,
            }}>
              Full training. Real tools.<br />AI-powered sales portal.<br />
              <span style={{ color: lightColors.text, fontWeight: 600 }}>You just need the drive.</span>
            </div>
          </div>
          <div style={useSlideUp(30)}>
            <div style={{
              padding: '18px 44px',
              borderRadius: 50,
              backgroundColor: '#0a0a0a',
              color: '#ffffff',
              fontSize: 30,
              fontWeight: 800,
              textAlign: 'center' as const,
            }}>
              crftdweb.com/apply
            </div>
          </div>
        </div>
      </Sequence>

      {/* ── PERSISTENT LOGO ── */}
      <div style={{
        position: 'absolute',
        bottom: 100,
        left: 0,
        right: 150,
        display: 'flex',
        justifyContent: 'center',
        opacity: logoOpacity,
      }}>
        <Img src={staticFile('CW-logo.png')} style={{ height: 48, objectFit: 'contain' }} />
      </div>

    </AbsoluteFill>
  );
};
