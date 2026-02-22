export { auth, db } from './config';
export { 
  signUp, 
  signIn, 
  signInWithGoogle, 
  signOut, 
  resetPassword,
  onAuthChange,
  getCurrentUser 
} from './auth';
export { AuthProvider, useAuth } from './AuthContext';
export * from './firestore';
