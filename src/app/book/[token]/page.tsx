'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { Loader2, CheckCircle2, AlertCircle, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import Image from 'next/image';

interface Slot {
  id: string;
  label: string;
  dateTime: string;
}

type PageState = 'loading' | 'invalid' | 'slots' | 'booking' | 'confirmed';

const INVALID_MESSAGES: Record<string, string> = {
  already_used: "You've already booked a call. Check your email for the confirmed time.",
  expired: "This booking link has expired. Reply to the original email to request a new one.",
  error: "Something went wrong. Try refreshing the page.",
  invalid: "This booking link isn't valid or has already been used.",
};

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function toDateStr(dateTime: string) {
  const d = new Date(dateTime);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function formatTime(dateTime: string) {
  return new Date(dateTime).toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function getMonthCells(year: number, month: number): (Date | null)[] {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const offset = (first.getDay() + 6) % 7;
  const total = Math.ceil((offset + last.getDate()) / 7) * 7;
  return Array.from({ length: total }, (_, i) => {
    const d = i - offset + 1;
    return d < 1 || d > last.getDate() ? null : new Date(year, month, d);
  });
}

export default function BookingPage() {
  const { token } = useParams<{ token: string }>();

  const [state, setState] = useState<PageState>('loading');
  const [applicantName, setApplicantName] = useState('');
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [invalidReason, setInvalidReason] = useState('invalid');
  const [confirmedSlot, setConfirmedSlot] = useState<Slot | null>(null);
  const [error, setError] = useState('');

  const today = useMemo(() => new Date(), []);
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const todayStr = toDateStr(today.toISOString());

  useEffect(() => {
    if (!token) { setState('invalid'); return; }

    if (token === 'preview') {
      fetch('/api/screening/slots').then((r) => r.json()).then((slotsData) => {
        setApplicantName('Preview');
        setSlots(Array.isArray(slotsData) ? slotsData : []);
        setState('slots');
      }).catch(() => { setState('slots'); });
      return;
    }

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
      const slotList: Slot[] = Array.isArray(slotsData) ? slotsData : [];
      setSlots(slotList);
      // Auto-jump calendar to first available slot's month
      if (slotList.length > 0) {
        const first = new Date(slotList[0].dateTime);
        setCalYear(first.getFullYear());
        setCalMonth(first.getMonth());
      }
      setState('slots');
    }).catch(() => {
      setInvalidReason('error');
      setState('invalid');
    });
  }, [token]);

  const slotsByDate = useMemo(() => {
    const map: Record<string, Slot[]> = {};
    for (const s of slots) {
      const key = toDateStr(s.dateTime);
      if (!map[key]) map[key] = [];
      map[key].push(s);
    }
    return map;
  }, [slots]);

  const cells = useMemo(() => getMonthCells(calYear, calMonth), [calYear, calMonth]);

  const prevMonth = () => { if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); } else setCalMonth(m => m - 1); };
  const nextMonth = () => { if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); } else setCalMonth(m => m + 1); };

  const daySlots = useMemo(() =>
    selectedDate ? (slotsByDate[selectedDate] ?? []).sort((a, b) => a.dateTime.localeCompare(b.dateTime)) : [],
    [selectedDate, slotsByDate]
  );

  const handleBook = useCallback(async () => {
    if (!selectedSlot || !token) return;
    if (token === 'preview') { setError('Preview mode — no real booking made.'); return; }
    setState('booking');
    setError('');
    try {
      const res = await fetch('/api/screening/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, slotId: selectedSlot }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Something went wrong'); setState('slots'); return; }
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
          <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-8">
            <Image src="/CW-logo-white.png" alt="CrftdWeb" width={40} height={40} className="w-9 h-9 object-contain" />
          </div>
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-white mb-2">You&apos;re booked!</h1>
          <p className="text-white/50 text-sm mb-4">Your 15-minute call is confirmed for:</p>
          <div className="bg-white/5 border border-white/10 rounded-xl px-6 py-4 mb-6 inline-block">
            <p className="text-white font-semibold text-lg">{confirmedSlot.label}</p>
          </div>
          <p className="text-white/25 text-xs">
            We&apos;ll be in touch shortly before the call. If you need to reschedule, reply to the original email.
          </p>
        </div>
      </div>
    );
  }

  const firstName = applicantName.split(' ')[0] || 'there';
  const selectedSlotObj = slots.find((s) => s.id === selectedSlot) ?? null;

  return (
    <div className="min-h-screen bg-[#0a0a0f] px-4 py-12">
      <div className="max-w-md mx-auto">

        {/* Logo + header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Image src="/CW-logo-white.png" alt="CrftdWeb" width={40} height={40} className="w-9 h-9 object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Hi {firstName}, pick a time</h1>
          <p className="text-white/40 text-sm mt-2">15-minute screening call — pick a date then choose a time.</p>
        </div>

        {slots.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/30 text-sm">No slots available right now.</p>
            <p className="text-white/20 text-xs mt-1">Reply to the original email and we&apos;ll find a time directly.</p>
          </div>
        ) : (
          <>
            {/* Calendar */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 mb-4">
              {/* Month nav */}
              <div className="flex items-center justify-between mb-4">
                <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-white/[0.06] text-white/40 hover:text-white/70 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm font-semibold text-white">{MONTHS[calMonth]} {calYear}</span>
                <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-white/[0.06] text-white/40 hover:text-white/70 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 mb-1">
                {DAYS.map((d) => (
                  <div key={d} className="text-center text-[10px] font-semibold text-white/20 uppercase tracking-wider py-1">{d}</div>
                ))}
              </div>

              {/* Cells */}
              <div className="grid grid-cols-7 gap-0.5">
                {cells.map((date, i) => {
                  if (!date) return <div key={i} />;
                  const ds = toDateStr(date.toISOString());
                  const hasSlots = !!slotsByDate[ds];
                  const isToday = ds === todayStr;
                  const isSelected = ds === selectedDate;
                  const isPast = date < today && !isToday;

                  return (
                    <button
                      key={ds}
                      disabled={!hasSlots || isPast}
                      onClick={() => { setSelectedDate(ds); setSelectedSlot(null); }}
                      className={`relative flex flex-col items-center justify-center rounded-xl h-10 transition-all
                        ${isPast || !hasSlots ? 'opacity-25 cursor-default' : ''}
                        ${isSelected ? 'bg-white' : hasSlots && !isPast ? 'hover:bg-white/[0.07] cursor-pointer' : ''}
                      `}
                    >
                      <span className={`text-xs font-semibold w-7 h-7 flex items-center justify-center rounded-full
                        ${isSelected ? 'text-black' : isToday ? 'bg-white/20 text-white' : 'text-white/70'}
                      `}>
                        {date.getDate()}
                      </span>
                      {hasSlots && !isPast && (
                        <span className={`absolute bottom-1 w-1 h-1 rounded-full ${isSelected ? 'bg-black/30' : 'bg-white/40'}`} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time slots for selected day */}
            {selectedDate && (
              <div className="mb-4">
                <p className="text-xs text-white/30 font-medium mb-2 px-1">
                  {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
                {daySlots.length === 0 ? (
                  <p className="text-xs text-white/20 text-center py-4">No slots on this day</p>
                ) : (
                  <div className="space-y-2">
                    {daySlots.map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => setSelectedSlot(slot.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left transition-all ${
                          selectedSlot === slot.id
                            ? 'bg-white text-black border-white'
                            : 'bg-white/[0.03] border-white/10 text-white hover:bg-white/[0.06] hover:border-white/20'
                        }`}
                      >
                        <Clock className={`w-4 h-4 flex-shrink-0 ${selectedSlot === slot.id ? 'text-black/40' : 'text-white/30'}`} />
                        <span className="font-medium text-sm">{formatTime(slot.dateTime)}</span>
                        {selectedSlot === slot.id && <CheckCircle2 className="w-4 h-4 ml-auto text-black/50" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {error && <p className="text-xs text-red-400 mb-3 text-center">{error}</p>}

            <button
              onClick={handleBook}
              disabled={!selectedSlot || state === 'booking'}
              className="w-full bg-white text-black font-bold py-3.5 rounded-xl text-sm hover:bg-white/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {state === 'booking' && <Loader2 className="w-4 h-4 animate-spin" />}
              {state === 'booking' ? 'Confirming…' : selectedSlotObj ? `Confirm — ${formatTime(selectedSlotObj.dateTime)}` : 'Select a time above'}
            </button>
          </>
        )}

        <p className="text-center text-white/15 text-xs mt-8">crftdweb.com · admin@crftdweb.com</p>
      </div>
    </div>
  );
}

