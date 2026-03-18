import { initializeApp, getApps, cert, type ServiceAccount } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

function getFirebaseAdminApp() {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  // Use service account credentials if available (recommended for production)
  if (process.env.FIREBASE_ADMIN_CLIENT_EMAIL && process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
    const serviceAccount: ServiceAccount = {
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
    };

    return initializeApp({ credential: cert(serviceAccount) });
  }

  // Fallback: use project ID only (works in Google Cloud environments with default credentials)
  return initializeApp({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });
}

const app = getFirebaseAdminApp();

export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);
