'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Loader2, Clock, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';

interface Slot {
  id: string;
  label: string;
  dateTime: string;
}

type PageState = 'loading' | 'invalid' | 'slots' | 'booking' | 'confirmed';

const INVALID_MESSAGES: Record<string, string> = {
  already_used: "You've already booked a call. Check your email for the confirmed time.",
  expired: "This booking link has expired. Reply to Obi's email to request a new one.",
  error: "Something went wrong. Try refreshing the page.",
  invalid: "This booking link isn't valid or has already been used.",
};

export default function BookingPage() {
  const { token } = useParams<{ token: string }>();

  const [state, setState] = useState<PageState>('loading');
  const [applicantName, setApplicantName] = useState('');
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [invalidReason, setInvalidReason] = useState('invalid');
  const [confirmedSlot, setConfirmedSlot] = useState<Slot | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) { setState('invalid'); return; }

    Promise.all([
      fetch(`/api/screening/validate/${token}`).then((r) => r.json()),
      fetch('/api/screening/slots').then((r) => r.json()),
    ]).then(([validation, slotsData]) => {
      if (!validation.valid) {
        setInvalidReason(validation.reason ?? 'invalid');
        setState('invalid');
        return;
      }
      setApplicantName(validation.name ?? '');
      setSlots(Array.isArray(slotsData) ? slotsData : []);
      setState('slots');
    }).catch(() => {
      setInvalidReason('error');
      setState('invalid');
    });
  }, [token]);

  const handleBook = useCallback(async () => {
    if (!selectedSlot || !token) return;
    setState('booking');
    setError('');

    try {
      const res = await fetch('/api/screening/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, slotId: selectedSlot }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong');
        setState('slots');
        return;
      }

      setConfirmedSlot(slots.find((s) => s.id === selectedSlot) ?? null);
      setState('confirmed');
    } catch {
      setError('Network error — please try again');
      setState('slots');
    }
  }, [selectedSlot, token, slots]);

  if (state === 'loading') {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-white/30" />
      </div>
    );
  }

  if (state === 'invalid') {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-white mb-2">Link unavailable</h1>
          <p className="text-white/40 text-sm">{INVALID_MESSAGES[invalidReason] ?? INVALID_MESSAGES.invalid}</p>
        </div>
      </div>
    );
  }

  if (state === 'confirmed' && confirmedSlot) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-white mb-2">You&apos;re booked!</h1>
          <p className="text-white/50 text-sm mb-4">Your 15-minute call with Obi is confirmed for:</p>
          <div className="bg-white/5 border border-white/10 rounded-xl px-6 py-4 mb-6 inline-block">
            <p className="text-white font-semibold text-lg">{confirmedSlot.label}</p>
          </div>
          <p className="text-white/25 text-xs">
            You&apos;ll hear from Obi shortly with a call link. If you need to reschedule, reply to the original email.
          </p>
        </div>
      </div>
    );
  }

  const firstName = applicantName.split(' ')[0] || 'there';

  return (
    <div className="min-h-screen bg-[#0a0a0f] px-6 py-16">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-white/25 mb-4 font-medium">CrftdWeb</p>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Hi {firstName}, pick a time
          </h1>
          <p className="text-white/40 text-sm mt-2">
            15-minute screening call with Obi — pick whichever works best.
          </p>
        </div>

        {slots.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-8 h-8 text-white/15 mx-auto mb-3" />
            <p className="text-white/30 text-sm">No slots available right now.</p>
            <p className="text-white/20 text-xs mt-1">
              Reply to Obi&apos;s email and he&apos;ll find a time with you directly.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-2 mb-6">
              {slots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => setSelectedSlot(slot.id)}
                  className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl border text-left transition-all ${
                    selectedSlot === slot.id
                      ? 'bg-white text-black border-white'
                      : 'bg-white/[0.03] border-white/10 text-white hover:bg-white/[0.06] hover:border-white/20'
                  }`}
                >
                  <Clock className={`w-4 h-4 flex-shrink-0 ${selectedSlot === slot.id ? 'text-black/40' : 'text-white/30'}`} />
                  <span className="font-medium">{slot.label}</span>
                  {selectedSlot === slot.id && (
                    <CheckCircle2 className="w-4 h-4 ml-auto text-black/50" />
                  )}
                </button>
              ))}
            </div>

            {error && (
              <p className="text-xs text-red-400 mb-4 text-center">{error}</p>
            )}

            <button
              onClick={handleBook}
              disabled={!selectedSlot || state === 'booking'}
              className="w-full bg-white text-black font-bold py-3.5 rounded-xl text-sm hover:bg-white/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {state === 'booking' && <Loader2 className="w-4 h-4 animate-spin" />}
              {state === 'booking' ? 'Confirming…' : 'Confirm this time'}
            </button>
          </>
        )}

        <p className="text-center text-white/20 text-xs mt-8">crftdweb.com · admin@crftdweb.com</p>
      </div>
    </div>
  );
}
