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

// ─── Video: "Dead Words" ──────────────────────────────
// P: Hook — "Delete these words from your site. Right now."
// A: 7 vague words appear one by one, each gets struck through
// S: The swap rule — replace with numbers, names, outcomes

const DEAD_WORDS = [
  { word: 'Solutions',   swap: 'Name what you actually build' },
  { word: 'World-class', swap: 'Show a result that proves it' },
  { word: 'Innovative',  swap: 'Describe the specific novelty' },
  { word: 'Leading',     swap: '"Ranked #1 for…" is proof. This isn\'t.' },
  { word: 'Passionate',  swap: 'Clients care about outcomes, not feelings' },
  { word: 'Bespoke',     swap: 'If everyone\'s bespoke, nobody is' },
  { word: 'Synergy',     swap: 'Nobody knows what this means' },
];

// Each word gets 18 frames of screen time within the agitate sequence
const WORD_DURATION = 18;

const StrikeWord: React.FC<{
  word: string;
  swap: string;
  localFrame: number; // frame relative to this word's start
}> = ({ word, swap, localFrame }) => {
  const appear = interpolate(localFrame, [0, 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const strikeProgress = interpolate(localFrame, [8, 16], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const swapOpacity = interpolate(localFrame, [14, 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{ opacity: appear, marginBottom: 8 }}>
      {/* Word + strikethrough */}
      <div style={{ position: 'relative', display: 'inline-block', marginBottom: 6 }}>
        <div style={{
          fontSize: 64,
          fontWeight: 900,
          letterSpacing: '-0.03em',
          color: colors.white,
          lineHeight: 1.1,
        }}>
          {word}
        </div>
        {/* Animated strike line */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          height: 5,
          width: `${strikeProgress * 100}%`,
          backgroundColor: colors.red,
          borderRadius: 4,
        }} />
      </div>
      {/* Swap hint */}
      <div style={{
        opacity: swapOpacity,
        fontSize: 22,
        fontWeight: 600,
        color: colors.muted,
        paddingLeft: 4,
      }}>
        → {swap}
      </div>
    </div>
  );
};

export const DeadWords: React.FC = () => {
  const frame = useCurrentFrame();

  // Agitate block starts at frame 90 and each word takes WORD_DURATION frames
  const agitate_start = 90;
  const totalAgitate = DEAD_WORDS.length * WORD_DURATION; // 126 frames = 4.2s

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
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: 20,
            }}>
              Ctrl+F these words
            </div>
          </div>

          <div style={useSlideUp(15)}>
            <div style={{
              fontSize: 68,
              fontWeight: 900,
              lineHeight: 1.0,
              letterSpacing: '-0.04em',
              marginBottom: 12,
            }}>
              Delete them
            </div>
            <div style={{
              fontSize: 68,
              fontWeight: 900,
              lineHeight: 1.0,
              letterSpacing: '-0.04em',
              color: colors.red,
              marginBottom: 12,
            }}>
              from your site.
            </div>
          </div>

          <div style={useSlideUp(35)}>
            <div style={{
              fontSize: 30,
              fontWeight: 600,
              color: colors.muted,
              lineHeight: 1.4,
            }}>
              They make you sound like every
              <br />
              other agency. They kill trust.
            </div>
          </div>
        </Sequence>

        {/* ── A: 7 DEAD WORDS — each strikes through (3–7.2s) ── */}
        <Sequence layout="none" from={agitate_start} durationInFrames={totalAgitate}>
          {DEAD_WORDS.map((item, i) => {
            const wordStart = i * WORD_DURATION;
            const localFrame = frame - agitate_start - wordStart;
            // Only render when this word's time has started
            if (frame < agitate_start + wordStart) return null;
            // Fade out once the next word has fully appeared
            const isLatest = i === Math.floor((frame - agitate_start) / WORD_DURATION);
            const opacity = isLatest
              ? 1
              : interpolate(
                  frame - agitate_start - wordStart,
                  [WORD_DURATION, WORD_DURATION + 8],
                  [1, 0.25],
                  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                );
            return (
              <div key={item.word} style={{ opacity }}>
                <StrikeWord
                  word={item.word}
                  swap={item.swap}
                  localFrame={Math.max(0, localFrame)}
                />
              </div>
            );
          })}
        </Sequence>

        {/* ── S: THE SWAP RULE (7.2–10s) ── */}
        <Sequence layout="none" from={agitate_start + totalAgitate} durationInFrames={84}>
          <div style={useSlideUp(2)}>
            <div style={{
              fontSize: 30,
              fontWeight: 700,
              color: colors.muted,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: 24,
            }}>
              The swap rule
            </div>
          </div>

          <div style={useSlideUp(10)}>
            <div style={{
              fontSize: 52,
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              marginBottom: 20,
            }}>
              Replace every vague word with a{' '}
              <span style={{ color: colors.green }}>number,</span>{' '}
              a{' '}
              <span style={{ color: colors.green }}>name,</span>{' '}
              or an{' '}
              <span style={{ color: colors.green }}>outcome.</span>
            </div>
          </div>

          <div style={useSlideUp(30)}>
            <div style={{
              padding: '24px 28px',
              borderRadius: 16,
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: `1px solid ${colors.border}`,
              marginBottom: 16,
            }}>
              <div style={{
                fontSize: 28,
                color: colors.muted,
                textDecoration: 'line-through',
                marginBottom: 8,
              }}>
                "We deliver fast results"
              </div>
              <div style={{
                fontSize: 28,
                fontWeight: 700,
                color: colors.white,
              }}>
                → "We deliver in 14 days. Guaranteed."
              </div>
            </div>
          </div>

          <div style={{ opacity: useFadeIn(55), marginTop: 16 }}>
            <CtaBadge text="crftdweb.com — We write copy that converts" />
          </div>
        </Sequence>

      </div>
    </AbsoluteFill>
  );
};
