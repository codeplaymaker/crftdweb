import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'CrftdWeb — Premium Web Design Agency';
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
            fontSize: 72,
            fontWeight: 800,
            color: 'white',
            textAlign: 'center',
            lineHeight: 1.1,
            marginBottom: 24,
          }}
        >
          CrftdWeb
        </div>
        <div
          style={{
            fontSize: 28,
            color: 'rgba(255,255,255,0.5)',
            textAlign: 'center',
            maxWidth: 700,
            lineHeight: 1.4,
          }}
        >
          Custom-coded websites that convert. Built in 14 days. 95+ PageSpeed.
        </div>
        <div
          style={{
            display: 'flex',
            gap: 40,
            marginTop: 48,
          }}
        >
          {[
            { label: 'Custom Code', value: '100%' },
            { label: 'PageSpeed', value: '95+' },
            { label: 'Delivery', value: '14 days' },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div style={{ fontSize: 36, fontWeight: 700, color: '#a78bfa' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
