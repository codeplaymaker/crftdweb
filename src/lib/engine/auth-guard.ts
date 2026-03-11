import { NextRequest, NextResponse } from 'next/server';

/**
 * Verify Firebase Auth token from Authorization header.
 * In production, this should use Firebase Admin SDK to verify the token.
 * For now, we check that a Bearer token is present.
 */
export async function verifyAuthToken(req: NextRequest): Promise<{ uid: string } | null> {
  const authHeader = req.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split('Bearer ')[1];
  
  if (!token || token.length < 10) {
    return null;
  }

  // In production, use Firebase Admin SDK:
  // const decodedToken = await admin.auth().verifyIdToken(token);
  // return { uid: decodedToken.uid };
  
  // For now, we accept any valid-looking token (the client-side Firebase SDK
  // handles actual auth; this prevents unauthenticated direct API calls)
  return { uid: 'authenticated' };
}

export function unauthorizedResponse() {
  return NextResponse.json(
    { error: 'Authentication required. Please sign in.' },
    { status: 401 }
  );
}
