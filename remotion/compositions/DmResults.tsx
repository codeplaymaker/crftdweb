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

// ─── DM Results Video ──────────────────────────────
// Fake iMessage-style conversation showing client results
// Blue bubbles = client, white bubbles = CrftdWeb

const Bubble: React.FC<{
  text: string;
  isClient: boolean;
  delay: number;
}> = ({ text, isClient, delay }) => {
  const style = useSlideUp(delay, 12);
  return (
    <div
      style={{
        ...style,
        display: 'flex',
        justifyContent: isClient ? 'flex-start' : 'flex-end',
        marginBottom: 16,
      }}
    >
      <div
        style={{
          maxWidth: '78%',
          padding: '20px 28px',
          borderRadius: 22,
          borderBottomLeftRadius: isClient ? 4 : 22,
          borderBottomRightRadius: isClient ? 22 : 4,
          backgroundColor: isClient ? colors.blue : 'rgba(255,255,255,0.12)',
          fontSize: 26,
          lineHeight: 1.45,
          fontWeight: 400,
          color: colors.white,
        }}
      >
        {text}
      </div>
    </div>
  );
};

const TypingIndicator: React.FC<{ delay: number }> = ({ delay }) => {
  const fade = useFadeIn(delay, 8);
  return (
    <div style={{ opacity: fade, display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
      <div
        style={{
          padding: '20px 28px',
          borderRadius: 22,
          borderBottomRightRadius: 4,
          backgroundColor: 'rgba(255,255,255,0.12)',
          fontSize: 26,
          color: colors.muted,
        }}
      >
        typing...
      </div>
    </div>
  );
};

export const DmResults: React.FC = () => {
  const headerFade = useFadeIn(0, 10);
  const ctaFade = useFadeIn(300);

  return (
    <AbsoluteFill style={baseStyle}>
      <div style={safeZone}>
        {/* Chat header */}
        <Sequence from={0}>
          <div
            style={{
              opacity: headerFade,
              textAlign: 'center',
              marginBottom: 40,
              paddingBottom: 24,
              borderBottom: `1px solid ${colors.border}`,
            }}
          >
            <div
              style={{ fontSize: 20, color: colors.muted, marginBottom: 6 }}
            >
              iMessage
            </div>
            <div style={{ fontSize: 30, fontWeight: 700 }}>Sarah — Bloom Studio</div>
            <div style={{ fontSize: 18, color: colors.muted, marginTop: 4 }}>
              Client since March 2026
            </div>
          </div>
        </Sequence>

        {/* Conversation */}
        <div style={{ flex: 1 }}>
          <Sequence from={20}>
            <Bubble
              text="Hey! Quick update — we hit 14 enquiries this month through the new site 🙌"
              isClient={true}
              delay={0}
            />
          </Sequence>

          <Sequence from={60}>
            <Bubble
              text="That's amazing — up from zero before launch right?"
              isClient={false}
              delay={0}
            />
          </Sequence>

          <Sequence from={100}>
            <Bubble
              text="Literally zero. Our old Wix site got maybe 1 enquiry every few months"
              isClient={true}
              delay={0}
            />
          </Sequence>

          <Sequence from={140}>
            <Bubble
              text="And the page speed score went from 38 to 98 👀"
              isClient={true}
              delay={0}
            />
          </Sequence>

          <Sequence from={180}>
            <Bubble
              text="Custom code hits different. Google actually knows you exist now 😄"
              isClient={false}
              delay={0}
            />
          </Sequence>

          <Sequence from={220}>
            <Bubble
              text="I've already referred two other businesses to you btw"
              isClient={true}
              delay={0}
            />
          </Sequence>

          <Sequence from={260}>
            <Bubble
              text="Legend. Let's catch up this week — might be time for the Growth upgrade 🚀"
              isClient={false}
              delay={0}
            />
          </Sequence>
        </div>

        {/* CTA */}
        <Sequence from={300}>
          <div style={{ opacity: ctaFade, marginTop: 32 }}>
            <CtaBadge text="Real results. Real code. →" />
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
