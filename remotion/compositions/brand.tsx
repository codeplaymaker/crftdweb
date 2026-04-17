import React from 'react';
import { interpolate, useCurrentFrame, staticFile, Img } from 'remotion';

// ─── BRAND COLORS (dark) ───────────────────────────
export const colors = {
  bg: '#0a0a0a',
  white: '#ffffff',
  red: '#ef4444',
  green: '#10b981',
  blue: '#3b82f6',
  muted: 'rgba(255,255,255,0.45)',
  subtle: 'rgba(255,255,255,0.08)',
  border: 'rgba(255,255,255,0.12)',
};

// ─── BRAND COLORS (light / white) ─────────────────
export const lightColors = {
  bg: '#ffffff',
  text: '#0a0a0a',
  muted: 'rgba(0,0,0,0.38)',
  subtle: 'rgba(0,0,0,0.015)',
  border: 'rgba(0,0,0,0.07)',
  tagBg: 'rgba(0,0,0,0.04)',
  tagText: 'rgba(0,0,0,0.4)',
};

export const baseStyleLight: React.CSSProperties = {
  backgroundColor: lightColors.bg,
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
  color: lightColors.text,
  overflow: 'hidden',
};

// ─── SHARED STYLES ─────────────────────────────────
export const baseStyle: React.CSSProperties = {
  backgroundColor: colors.bg,
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
  color: colors.white,
  overflow: 'hidden',
};

export const safeZone: React.CSSProperties = {
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

// ─── ANIMATION HELPERS ─────────────────────────────
export function useFadeIn(delay: number, duration = 12) {
  const frame = useCurrentFrame();
  return interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
}

export function useSlideUp(delay: number, duration = 15) {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const y = interpolate(frame, [delay, delay + duration], [40, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return { opacity, transform: `translateY(${y}px)` };
}

export function useCountUp(delay: number, duration: number, target: number) {
  const frame = useCurrentFrame();
  const value = interpolate(frame, [delay, delay + duration], [0, target], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return Math.round(value);
}

// ─── LOGO COMPONENT ────────────────────────────────
export const Logo: React.FC<{ size?: number; style?: React.CSSProperties }> = ({
  size = 36,
  style,
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...style,
    }}
  >
    <Img
      src={staticFile('CW-logo-white.png')}
      style={{ height: size * 2, objectFit: 'contain' }}
    />
  </div>
);

// ─── CTA BADGE ─────────────────────────────────────
export const CtaBadge: React.FC<{
  text?: string;
  style?: React.CSSProperties;
}> = ({ text = 'crftdweb.com', style }) => (
  <div
    style={{
      padding: '16px 32px',
      borderRadius: 50,
      border: `1px solid ${colors.border}`,
      backgroundColor: 'rgba(255,255,255,0.06)',
      color: colors.white,
      fontSize: 28,
      fontWeight: 500,
      textAlign: 'center',
      ...style,
    }}
  >
    {text}
  </div>
);
