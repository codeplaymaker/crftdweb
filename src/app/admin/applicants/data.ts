export type Verdict = 'booking' | 'trial' | 'decline';
export type ApplicantStatus = 'pending' | 'email_sent' | 'booked' | 'screened' | 'offered' | 'accepted' | 'declined' | 'no_show' | 'rejected';

export interface Applicant {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  rating: number; // 1–5
  verdict: Verdict;
  salesSignals: string;
  education: string;
  keyStrength: string;
  indeedEmail: boolean;
  notes?: string;
}

export interface ApplicantWithStatus extends Applicant {
  status: ApplicantStatus;
  emailSentAt: string | null;
  bookedAt: string | null;
}
