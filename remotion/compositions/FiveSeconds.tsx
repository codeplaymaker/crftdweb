import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import {
  baseStyle,
  colors,
  useSlideUp,
  useFadeIn,
  Logo,
  CtaBadge,
  safeZone,
} from './brand';

// ─── Video: "Five Seconds" ────────────────────────────
// P: You have 5 seconds before they're gone
// A: Countdown clock — shows what happens at each second
// S: The 3 things that make them stay — headline, CTA, trust signal

const CountdownRing: React.FC<{ seconds: number; total: number }> = ({
  seconds,
  total,
}) => {
  const frame = useCurrentFrame();
  const size = 340;
  const radius = 140;
  const circumference = 2 * Math.PI * radius;
  const progress = interpolate(frame, [0, 30 * total], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const dashOffset = circumference * (1 - progress);
  const colour = seconds > 3 ? colors.green : seconds > 1 ? '#f59e0b' : colors.red;

  return (
    <div style={{
      position: 'relative',
      width: size,
      height: size,
      margin: '0 auto',
    }}>
      <svg
        width={size}
        height={size}
        style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={8}
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colour}
          strokeWidth={8}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
        />
      </svg>
      {/* Number */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          fontSize: 130,
          fontWeight: 900,
          lineHeight: 1,
          color: colour,
          letterSpacing: '-0.05em',
        }}>
          {seconds}
        </div>
        <div style={{
          fontSize: 22,
          fontWeight: 600,
          color: colors.muted,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}>
          seconds
        </div>
      </div>
    </div>
  );
};

const StatPill: React.FC<{
  stat: string;
  label: string;
  colour?: string;
  delay: number;
}> = ({ stat, label, colour = colors.red, delay }) => {
  const style = useSlideUp(delay, 14);
  return (
    <div style={{
      ...style,
      display: 'flex',
      alignItems: 'center',
      gap: 20,
      padding: '20px 28px',
      borderRadius: 16,
      backgroundColor: 'rgba(255,255,255,0.04)',
      border: `1px solid rgba(255,255,255,0.08)`,
      marginBottom: 10,
    }}>
      <div style={{
        fontSize: 40,
        fontWeight: 900,
        color: colour,
        minWidth: 100,
      }}>
        {stat}
      </div>
      <div style={{
        fontSize: 24,
        fontWeight: 600,
        color: colors.muted,
        lineHeight: 1.3,
      }}>
        {label}
      </div>
    </div>
  );
};

const FixItem: React.FC<{
  number: string;
  title: string;
  desc: string;
  delay: number;
}> = ({ number, title, desc, delay }) => {
  const style = useSlideUp(delay, 14);
  return (
    <div style={{
      ...style,
      display: 'flex',
      gap: 20,
      padding: '22px 28px',
      borderRadius: 16,
      backgroundColor: 'rgba(255,255,255,0.04)',
      border: `1px solid rgba(255,255,255,0.08)`,
      marginBottom: 12,
    }}>
      <div style={{
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: colors.white,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 20, fontWeight: 900, color: colors.bg }}>{number}</span>
      </div>
      <div>
        <div style={{ fontSize: 26, fontWeight: 800, color: colors.white, marginBottom: 4 }}>
          {title}
        </div>
        <div style={{ fontSize: 20, fontWeight: 500, color: colors.muted, lineHeight: 1.35 }}>
          {desc}
        </div>
      </div>
    </div>
  );
};

export const FiveSeconds: React.FC = () => {
  const frame = useCurrentFrame();
  const currentSecond = Math.max(1, 5 - Math.floor(frame / 30));

  return (
    <AbsoluteFill style={baseStyle}>
      <div style={safeZone}>

        {/* ── P: HOOK + COUNTDOWN (0–5s) ── */}
        <Sequence layout="none" from={0} durationInFrames={150}>
          <Logo style={{ marginBottom: 28 }} />

          <div style={useSlideUp(5)}>
            <div style={{
              fontSize: 36,
              fontWeight: 800,
              color: colors.muted,
              marginBottom: 32,
              lineHeight: 1.3,
            }}>
              A visitor lands on your site.
            </div>
          </div>

          <CountdownRing seconds={currentSecond} total={5} />

          <div style={useSlideUp(10)}>
            <div style={{
              fontSize: 34,
              fontWeight: 700,
              color: colors.white,
              textAlign: 'center',
              marginTop: 32,
              lineHeight: 1.3,
            }}>
              That's all you get before
              <br />
              <span style={{ color: colors.red }}>they're gone forever.</span>
            </div>
          </div>
        </Sequence>

        {/* ── A: THE COST OF A SLOW / BAD FIRST IMPRESSION (5–8s) ── */}
        <Sequence layout="none" from={150} durationInFrames={90}>
          <div style={useSlideUp(2)}>
            <div style={{
              fontSize: 36,
              fontWeight: 800,
              color: colors.white,
              marginBottom: 28,
              lineHeight: 1.2,
            }}>
              What the data says:
            </div>
          </div>

          <StatPill stat="0.05s" label="to form a first impression — Stanford" colour={colors.red} delay={10} />
          <StatPill stat="53%" label="leave if load time exceeds 3 seconds" colour={colors.red} delay={22} />
          <StatPill stat="88%" label="won't return after one bad experience" colour={colors.red} delay={34} />
          <StatPill stat="75%" label="judge credibility by design alone" colour={colors.red} delay={46} />

          <div style={useSlideUp(58)}>
            <div style={{
              fontSize: 28,
              fontWeight: 700,
              color: colors.muted,
              marginTop: 10,
            }}>
              Your homepage has one job.{' '}
              <span style={{ color: colors.white }}>
                Make them stay.
              </span>
            </div>
          </div>
        </Sequence>

        {/* ── S: THE 3-PART FIX (8–12s) ── */}
        <Sequence layout="none" from={240} durationInFrames={120}>
          <div style={useSlideUp(2)}>
            <div style={{
              fontSize: 36,
              fontWeight: 800,
              color: colors.white,
              marginBottom: 28,
              lineHeight: 1.2,
            }}>
              3 things that make{' '}
              <span style={{ color: colors.green }}>them stay:</span>
            </div>
          </div>

          <FixItem
            number="1"
            title="Headline that names their pain"
            desc={'"Stop losing leads to a website that doesn\'t convert" → "Welcome to our agency"'}
            delay={12}
          />
          <FixItem
            number="2"
            title="CTA above the fold — no scroll needed"
            desc='"Get a Free Audit" visible in the first 3 seconds. One button. One action.'
            delay={26}
          />
          <FixItem
            number="3"
            title="A trust signal before they scroll"
            desc='"Trusted by 40+ businesses" or a single result number directly below the headline.'
            delay={40}
          />

          <div style={{ opacity: useFadeIn(60), marginTop: 24 }}>
            <CtaBadge text="crftdweb.com — We build sites that keep them" />
          </div>
        </Sequence>

      </div>
    </AbsoluteFill>
  );
};
