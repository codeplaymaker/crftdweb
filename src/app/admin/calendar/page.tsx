'use client';

import { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Clock, CalendarDays, CheckCircle2, Circle, AlertCircle, Loader2, Trash2, Plus, CalendarPlus } from 'lucide-react';
import Link from 'next/link';
import { getScreeningSlots } from '@/app/actions/getScreeningSlots';
import { deleteScreeningSlot } from '@/app/actions/deleteScreeningSlot';
import { createScreeningSlot, type ScreeningSlot } from '@/app/actions/createScreeningSlot';

// ─── To-Do items (static pipeline tasks) ──────────────────
interface Todo {
  id: string;
  text: string;
  done: boolean;
  dueLabel?: string;
  priority: 'high' | 'normal' | 'low';
}

const INITIAL_TODOS: Todo[] = [
  { id: 't1', text: 'Review new applicants from Indeed / Gumtree', done: false, dueLabel: 'Today', priority: 'high' },
  { id: 't2', text: 'Chase trial task replies (sent 48h+ ago)', done: false, dueLabel: 'Today', priority: 'high' },
  { id: 't3', text: 'Send booking links to screened applicants', done: false, priority: 'normal' },
  { id: 't4', text: 'Check rep portal activity this week', done: false, priority: 'normal' },
  { id: 't5', text: 'Post recruitment ad refresh', done: false, dueLabel: 'This week', priority: 'low' },
];

// ─── Helpers ──────────────────────────────────────────────
function toLocalDateStr(dateTime: string): string {
  const d = new Date(dateTime);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function formatTime(dateTime: string): string {
  const d = new Date(dateTime);
  return d.toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function formatLabel(dateTime: string): string {
  const d = new Date(dateTime);
  const day = d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  const time = d.toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit', hour12: true });
  return `${day} · ${time}`;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function getMonthDays(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  // Monday-first offset
  const startOffset = (firstDay.getDay() + 6) % 7;
  const totalCells = Math.ceil((startOffset + lastDay.getDate()) / 7) * 7;
  const cells: (Date | null)[] = [];
  for (let i = 0; i < totalCells; i++) {
    const dayNum = i - startOffset + 1;
    if (dayNum < 1 || dayNum > lastDay.getDate()) {
      cells.push(null);
    } else {
      cells.push(new Date(year, month, dayNum));
    }
  }
  return cells;
}

// ─── Main Page ────────────────────────────────────────────
export default function CalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string>(
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  );
  const [slots, setSlots] = useState<ScreeningSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [todos, setTodos] = useState<Todo[]>(INITIAL_TODOS);
  const [newTodoText, setNewTodoText] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [timeInput, setTimeInput] = useState('');
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState('');

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  useEffect(() => {
    getScreeningSlots().then((s) => { setSlots(s); setLoadingSlots(false); });
  }, []);

  // Group slots by local date string
  const slotsByDate = useMemo(() => {
    const map: Record<string, ScreeningSlot[]> = {};
    for (const slot of slots) {
      const key = toLocalDateStr(slot.dateTime);
      if (!map[key]) map[key] = [];
      map[key].push(slot);
    }
    return map;
  }, [slots]);

  const cells = useMemo(() => getMonthDays(year, month), [year, month]);

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  };

  const selectedSlots = useMemo(() =>
    (slotsByDate[selectedDate] ?? []).sort((a, b) => a.dateTime.localeCompare(b.dateTime)),
    [slotsByDate, selectedDate]
  );

  const upcomingBooked = useMemo(() =>
    slots
      .filter((s) => !s.available && s.dateTime >= new Date().toISOString())
      .sort((a, b) => a.dateTime.localeCompare(b.dateTime))
      .slice(0, 5),
    [slots]
  );

  const handleDelete = async (slotId: string) => {
    setDeleting(slotId);
    await deleteScreeningSlot(slotId);
    setSlots((prev) => prev.filter((s) => s.id !== slotId));
    setDeleting(null);
  };

  const handleAdd = async () => {
    if (!dateInput || !timeInput) return;
    setAdding(true);
    setAddError('');
    try {
      const dateTime = `${dateInput}T${timeInput}`;
      const label = formatLabel(dateTime);
      const result = await createScreeningSlot(dateTime, label);
      if (result.success && result.slot) {
        setSlots((prev) => [...prev, result.slot!].sort((a, b) => a.dateTime.localeCompare(b.dateTime)));
        setDateInput('');
        setTimeInput('');
      } else {
        setAddError(result.error ?? 'Failed to add slot');
      }
    } catch {
      setAddError('Network error — please try again');
    } finally {
      setAdding(false);
    }
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) => prev.map((t) => t.id === id ? { ...t, done: !t.done } : t));
  };

  const addTodo = () => {
    const text = newTodoText.trim();
    if (!text) return;
    setTodos((prev) => [...prev, { id: `t${Date.now()}`, text, done: false, priority: 'normal' }]);
    setNewTodoText('');
  };

  const removeTodo = (id: string) => setTodos((prev) => prev.filter((t) => t.id !== id));

  const pendingTodos = todos.filter((t) => !t.done);
  const doneTodos = todos.filter((t) => t.done);

  return (
    <div className="min-h-screen bg-[#0a0a0f] px-4 py-10 md:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin/reps" className="text-xs text-white/30 hover:text-white/50 transition-colors mb-2 inline-block">← Back to Reps</Link>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-sky-400" />
              Calendar
            </h1>
            <p className="text-xs text-white/30 mt-0.5">Screening slots, bookings &amp; pipeline to-dos</p>
          </div>
          {upcomingBooked.length > 0 && (
            <div className="hidden md:flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-emerald-300 font-medium">
                {upcomingBooked.length} upcoming call{upcomingBooked.length > 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">

          {/* ── Left: Calendar + Add Slot ──────────────────── */}
          <div className="space-y-4">

            {/* Month navigator */}
            <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-5">
                <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors text-white/40 hover:text-white/70">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <h2 className="text-sm font-semibold text-white">
                  {MONTHS[month]} {year}
                </h2>
                <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors text-white/40 hover:text-white/70">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 mb-2">
                {DAYS.map((d) => (
                  <div key={d} className="text-center text-[10px] font-semibold text-white/20 uppercase tracking-wider py-1">
                    {d}
                  </div>
                ))}
              </div>

              {/* Day cells */}
              <div className="grid grid-cols-7 gap-0.5">
                {cells.map((date, i) => {
                  if (!date) return <div key={i} />;
                  const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                  const daySlots = slotsByDate[dateStr] ?? [];
                  const isToday = dateStr === todayStr;
                  const isSelected = dateStr === selectedDate;
                  const hasAvailable = daySlots.some((s) => s.available);
                  const hasBooked = daySlots.some((s) => !s.available);

                  return (
                    <button
                      key={dateStr}
                      onClick={() => setSelectedDate(dateStr)}
                      className={`relative flex flex-col items-center rounded-xl p-1.5 min-h-[52px] transition-all ${
                        isSelected
                          ? 'bg-white/10 ring-1 ring-white/20'
                          : 'hover:bg-white/[0.04]'
                      }`}
                    >
                      <span className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full mb-0.5 ${
                        isToday
                          ? 'bg-sky-500 text-white font-bold'
                          : isSelected
                          ? 'text-white'
                          : 'text-white/50'
                      }`}>
                        {date.getDate()}
                      </span>
                      <div className="flex gap-0.5 flex-wrap justify-center">
                        {hasBooked && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Booked" />
                        )}
                        {hasAvailable && (
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-400" title="Available" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-400" />
                  <span className="text-[10px] text-white/30">Available</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-[10px] text-white/30">Booked</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-500" />
                  <span className="text-[10px] text-white/30">Today</span>
                </div>
              </div>
            </div>

            {/* Add Slot */}
            <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-5">
              <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3 flex items-center gap-2">
                <CalendarPlus className="w-3.5 h-3.5 text-sky-400" />
                Add Slot
              </h3>
              <div className="flex gap-2 flex-wrap">
                <input
                  type="date"
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30"
                />
                <input
                  type="time"
                  value={timeInput}
                  onChange={(e) => setTimeInput(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30"
                />
                <button
                  onClick={handleAdd}
                  disabled={!dateInput || !timeInput || adding}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-sky-600/20 hover:bg-sky-600/30 border border-sky-500/30 text-sky-300 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  {adding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                  Add
                </button>
              </div>
              {addError && <p className="text-xs text-red-400 mt-2">{addError}</p>}
            </div>

            {/* To-Do List */}
            <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-5">
              <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                Pipeline To-Dos
                {pendingTodos.length > 0 && (
                  <span className="ml-auto text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded-full">
                    {pendingTodos.length} pending
                  </span>
                )}
              </h3>

              <div className="space-y-1.5">
                {pendingTodos.map((todo) => (
                  <div key={todo.id} className="flex items-start gap-2.5 group">
                    <button onClick={() => toggleTodo(todo.id)} className="mt-0.5 flex-shrink-0 text-white/20 hover:text-emerald-400 transition-colors">
                      <Circle className="w-3.5 h-3.5" />
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white/70 leading-relaxed">{todo.text}</p>
                      {todo.dueLabel && (
                        <span className={`text-[10px] font-medium ${
                          todo.priority === 'high' ? 'text-red-400' : 'text-white/25'
                        }`}>
                          {todo.dueLabel}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => removeTodo(todo.id)}
                      className="flex-shrink-0 opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition-all"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {doneTodos.length > 0 && (
                  <div className="pt-2 mt-2 border-t border-white/5 space-y-1.5">
                    {doneTodos.map((todo) => (
                      <div key={todo.id} className="flex items-start gap-2.5 group opacity-40">
                        <button onClick={() => toggleTodo(todo.id)} className="mt-0.5 flex-shrink-0 text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </button>
                        <p className="text-xs text-white/40 line-through flex-1">{todo.text}</p>
                        <button onClick={() => removeTodo(todo.id)} className="flex-shrink-0 opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition-all">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add todo */}
              <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
                <input
                  type="text"
                  value={newTodoText}
                  onChange={(e) => setNewTodoText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addTodo()}
                  placeholder="Add a to-do…"
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-white/25"
                />
                <button
                  onClick={addTodo}
                  disabled={!newTodoText.trim()}
                  className="px-3 py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.09] border border-white/10 text-white/40 hover:text-white/70 text-xs transition-all disabled:opacity-30"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* ── Right Sidebar ──────────────────────────────── */}
          <div className="space-y-4">

            {/* Selected day detail */}
            <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-5">
              <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-1">
                {selectedDate === todayStr ? 'Today' : new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
              </h3>

              {loadingSlots ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="w-4 h-4 animate-spin text-white/20" />
                </div>
              ) : selectedSlots.length === 0 ? (
                <p className="text-xs text-white/20 py-4 text-center">No slots on this day</p>
              ) : (
                <div className="space-y-2 mt-3">
                  {selectedSlots.map((slot) => (
                    <div
                      key={slot.id}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl border ${
                        slot.available
                          ? 'bg-sky-500/5 border-sky-500/15'
                          : 'bg-emerald-500/5 border-emerald-500/15'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Clock className={`w-3.5 h-3.5 flex-shrink-0 ${slot.available ? 'text-sky-400' : 'text-emerald-400'}`} />
                        <div className="min-w-0">
                          <p className={`text-xs font-medium ${slot.available ? 'text-sky-200' : 'text-emerald-200'}`}>
                            {formatTime(slot.dateTime)}
                          </p>
                          {!slot.available && slot.bookedByName && (
                            <p className="text-[10px] text-emerald-400/70 mt-0.5">{slot.bookedByName}</p>
                          )}
                          {slot.available && (
                            <p className="text-[10px] text-sky-400/50 mt-0.5">Available</p>
                          )}
                        </div>
                      </div>
                      {slot.available && (
                        <button
                          onClick={() => handleDelete(slot.id)}
                          disabled={deleting === slot.id}
                          className="text-white/15 hover:text-red-400 transition-colors disabled:opacity-40 ml-2 flex-shrink-0"
                        >
                          {deleting === slot.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upcoming booked calls */}
            <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-5">
              <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3 flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-emerald-400" />
                Upcoming Calls
              </h3>
              {loadingSlots ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-4 h-4 animate-spin text-white/20" />
                </div>
              ) : upcomingBooked.length === 0 ? (
                <p className="text-xs text-white/20 text-center py-3">No calls booked yet</p>
              ) : (
                <div className="space-y-2">
                  {upcomingBooked.map((slot) => (
                    <div key={slot.id} className="flex items-start gap-3 px-3 py-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                      <div className="w-1 h-full min-h-[28px] rounded-full bg-emerald-500/40 flex-shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <p className="text-xs text-emerald-200 font-medium">{slot.bookedByName ?? 'Unknown'}</p>
                        <p className="text-[10px] text-emerald-400/60 mt-0.5">{slot.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* All slots summary */}
            <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-5">
              <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">All Slots</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-sky-500/5 border border-sky-500/15 rounded-xl px-3 py-3 text-center">
                  <p className="text-xl font-bold text-sky-300">{slots.filter((s) => s.available).length}</p>
                  <p className="text-[10px] text-sky-400/60 mt-0.5">Available</p>
                </div>
                <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-3 py-3 text-center">
                  <p className="text-xl font-bold text-emerald-300">{slots.filter((s) => !s.available).length}</p>
                  <p className="text-[10px] text-emerald-400/60 mt-0.5">Booked</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
