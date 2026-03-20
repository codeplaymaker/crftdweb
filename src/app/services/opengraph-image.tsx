import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'CrftdWeb Services';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 50%, #0a0a0a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px',
        }}
      >
        <div
          style={{
            fontSize: 18,
            color: '#a78bfa',
            textTransform: 'uppercase',
            letterSpacing: 4,
            marginBottom: 24,
          }}
        >
          Services
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 800,
            color: 'white',
            textAlign: 'center',
            lineHeight: 1.15,
            maxWidth: 800,
          }}
        >
          Web Design & Development
        </div>
        <div
          style={{
            fontSize: 22,
            color: 'rgba(255,255,255,0.4)',
            textAlign: 'center',
            maxWidth: 600,
            marginTop: 20,
            lineHeight: 1.5,
          }}
        >
          Custom-coded websites from £2,497. Delivered in 14 days. 95+ PageSpeed guaranteed.
        </div>
      </div>
    ),
    { ...size }
  );
}
