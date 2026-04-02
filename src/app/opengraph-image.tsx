import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'CrftdWeb';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#000000',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://crftdweb.com/CW-logo-white.png"
          alt="CrftdWeb"
          width={320}
          height={320}
          style={{ objectFit: 'contain' }}
        />
      </div>
    ),
    { ...size }
  );
}
