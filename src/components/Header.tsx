import React from 'react';
import { 
  Menu, 
  Calendar, 
  Clock, 
  Phone, 
  Plus, 
  Cloud,
  CheckCircle2
} from 'lucide-react';
import { UserAccount, ClinicTiming } from '../types';
import { getSupabaseConfig } from '../services/supabase';

interface HeaderProps {
  currentUser: UserAccount;
  onOpenMobileMenu: () => void;
  onOpenSettings: () => void;
  onOpenClinicTiming: () => void;
  clinicTiming: ClinicTiming;
  onQuickAction: (action: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onOpenMobileMenu,
  onOpenSettings,
  onOpenClinicTiming,
  clinicTiming,
  onQuickAction
}) => {
  const cloudConfig = getSupabaseConfig();
  const isCloudConnected = Boolean(cloudConfig.url && cloudConfig.key);

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8">
      
      {/* Left: Mobile Burger & Today Date */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 border border-slate-200"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 bg-slate-100/80 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-teal-700" />
            <span>{todayFormatted}</span>
          </span>

          <button
            type="button"
            onClick={onOpenClinicTiming}
            className="hidden md:flex items-center gap-1.5 text-xs text-slate-600 hover:text-teal-800 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 transition"
            title="Clinic Hours"
          >
            <Clock className="w-3.5 h-3.5 text-teal-600" />
            <span>{clinicTiming.morningStart} - {clinicTiming.morningEnd} &amp; {clinicTiming.eveningStart} - {clinicTiming.eveningEnd}</span>
          </button>
        </div>
      </div>

      {/* Right: Cloud Sync Status & New Patient Button */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        
        {/* Cloud Status Button */}
        <button
          type="button"
          onClick={onOpenSettings}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
            isCloudConnected
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
              : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
          }`}
          title="Cloud Database Sync Status"
        >
          <span className={`w-2 h-2 rounded-full ${isCloudConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
          <span className="hidden sm:inline">{isCloudConnected ? 'Cloud Online' : 'Offline Mode'}</span>
        </button>

        {/* New Patient Button */}
        <button
          type="button"
          onClick={() => onQuickAction('patients')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 shadow-xs transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Patient</span>
        </button>

      </div>

    </header>
  );
};
