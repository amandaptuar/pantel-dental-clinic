import React, { useState } from 'react';
import { ClinicTiming } from '../types';
import { StorageService } from '../services/storage';
import { 
  CalendarClock, 
  Clock, 
  Calendar, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

interface ClinicTimingModalProps {
  isOpen: boolean;
  onClose: () => void;
  timing: ClinicTiming;
  onSaveTiming: (timing: ClinicTiming) => void;
}

export const ClinicTimingModal: React.FC<ClinicTimingModalProps> = ({
  isOpen,
  onClose,
  timing,
  onSaveTiming
}) => {
  const [morningStart, setMorningStart] = useState(timing.morningStart);
  const [morningEnd, setMorningEnd] = useState(timing.morningEnd);
  const [eveningStart, setEveningStart] = useState(timing.eveningStart);
  const [eveningEnd, setEveningEnd] = useState(timing.eveningEnd);
  const [workingDays, setWorkingDays] = useState<string[]>(timing.workingDays);
  const [holidays, setHolidays] = useState<{ date: string; reason: string }[]>(timing.holidays || []);

  // New holiday input states
  const [holidayDate, setHolidayDate] = useState(new Date().toISOString().split('T')[0]);
  const [holidayReason, setHolidayReason] = useState('Public Holiday');

  if (!isOpen) return null;

  const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const toggleDay = (day: string) => {
    if (workingDays.includes(day)) {
      setWorkingDays(workingDays.filter(d => d !== day));
    } else {
      setWorkingDays([...workingDays, day]);
    }
  };

  const handleAddHoliday = (e: React.FormEvent) => {
    e.preventDefault();
    if (!holidayDate || !holidayReason) return;
    setHolidays([...holidays, { date: holidayDate, reason: holidayReason }]);
    setHolidayReason('');
  };

  const handleRemoveHoliday = (idx: number) => {
    setHolidays(holidays.filter((_, i) => i !== idx));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: ClinicTiming = {
      morningStart,
      morningEnd,
      eveningStart,
      eveningEnd,
      workingDays,
      holidays
    };
    StorageService.saveClinicTiming(updated);
    onSaveTiming(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-700 text-white flex items-center justify-center font-bold">
              <CalendarClock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Clinic Timings &amp; Holiday Calendar
              </h3>
              <p className="text-xs text-slate-500">
                Patil Dental Clinic OPD Hours &amp; Scheduled Leaves
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSave} className="py-4 space-y-5 text-xs">
          
          {/* OPD Hours */}
          <div className="space-y-3">
            <span className="font-bold text-slate-900 uppercase text-[11px] block">
              1. Daily Practice Hours (Two Shifts)
            </span>

            {/* Morning Shift */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-cyan-800 text-xs">🌅 Morning Shift:</span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-500 font-medium">Opening Time</label>
                  <input
                    type="time"
                    value={morningStart}
                    onChange={(e) => setMorningStart(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 mt-1 font-bold text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-medium">Closing Time</label>
                  <input
                    type="time"
                    value={morningEnd}
                    onChange={(e) => setMorningEnd(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 mt-1 font-bold text-xs"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Evening Shift */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-cyan-800 text-xs">🌇 Evening Shift:</span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-500 font-medium">Opening Time</label>
                  <input
                    type="time"
                    value={eveningStart}
                    onChange={(e) => setEveningStart(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 mt-1 font-bold text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-medium">Closing Time</label>
                  <input
                    type="time"
                    value={eveningEnd}
                    onChange={(e) => setEveningEnd(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 mt-1 font-bold text-xs"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Working Days */}
          <div>
            <span className="font-bold text-slate-900 uppercase text-[11px] block mb-2">
              2. Working Days of the Week
            </span>
            <div className="flex flex-wrap gap-1.5">
              {allDays.map(day => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                    workingDays.includes(day)
                      ? 'bg-cyan-700 text-white border-cyan-800 shadow-sm'
                      : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Holiday Management */}
          <div>
            <span className="font-bold text-slate-900 uppercase text-[11px] block mb-2">
              3. Clinic Scheduled Holidays &amp; Leave Days
            </span>

            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {holidays.map((h, idx) => (
                <div key={idx} className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900">{h.date}</span>
                    <span className="text-slate-600 ml-2">— {h.reason}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveHoliday(idx)}
                    className="text-rose-500 hover:text-rose-700 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Holiday Row */}
            <div className="mt-3 flex items-center gap-2">
              <input
                type="date"
                value={holidayDate}
                onChange={(e) => setHolidayDate(e.target.value)}
                className="w-36 p-1.5 rounded-lg border border-slate-200 text-xs"
              />
              <input
                type="text"
                placeholder="Reason (e.g. Diwali, Conference)"
                value={holidayReason}
                onChange={(e) => setHolidayReason(e.target.value)}
                className="flex-1 p-1.5 rounded-lg border border-slate-200 text-xs"
              />
              <button
                type="button"
                onClick={handleAddHoliday}
                className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs"
              >
                + Add
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-cyan-700 hover:bg-cyan-800 shadow-md transition"
            >
              Save Clinic Timing
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
