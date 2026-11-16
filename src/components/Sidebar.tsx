import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Activity, 
  Calendar, 
  Pill, 
  Receipt, 
  FlaskConical, 
  ShieldCheck, 
  FileText, 
  Stethoscope, 
  Sparkles, 
  HardDrive, 
  Phone, 
  ChevronDown,
  X
} from 'lucide-react';
import { UserAccount } from '../types';
import { CLINIC_ACCOUNTS } from '../data/mockData';
import { getSupabaseConfig } from '../services/supabase';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: UserAccount;
  onSwitchUser: (user: UserAccount) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  patientCount: number;
  sixMonthRecallCount: number;
  pendingBalanceCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onSwitchUser,
  mobileOpen,
  setMobileOpen,
  patientCount,
  sixMonthRecallCount,
  pendingBalanceCount
}) => {
  const [showUserDropdown, setShowUserDropdown] = React.useState(false);
  const cloudConfig = getSupabaseConfig();
  const isCloudConnected = Boolean(cloudConfig.url && cloudConfig.key);

  const navItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: LayoutDashboard,
      iconColor: 'text-teal-600',
      iconBg: 'bg-teal-50'
    },
    { 
      id: 'patients', 
      label: 'Patients & Dental Chart', 
      icon: Users,
      badge: patientCount > 0 ? patientCount : undefined,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50'
    },
    { 
      id: 'specialized', 
      label: 'RCT, Crown & Aligners', 
      icon: Sparkles,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-50'
    },
    { 
      id: 'treatment-plans', 
      label: 'Treatment Planning', 
      icon: Stethoscope,
      iconColor: 'text-sky-600',
      iconBg: 'bg-sky-50'
    },
    { 
      id: 'appointments', 
      label: 'Appointments & 6M Recall', 
      icon: Calendar,
      badge: sixMonthRecallCount > 0 ? `${sixMonthRecallCount} Due` : undefined,
      badgeColor: 'bg-amber-100 text-amber-900',
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-50'
    },
    { 
      id: 'prescriptions', 
      label: 'Digital Prescriptions', 
      icon: Pill,
      iconColor: 'text-indigo-600',
      iconBg: 'bg-indigo-50'
    },
    { 
      id: 'consent', 
      label: 'Consent & USB Fingerprint', 
      icon: ShieldCheck,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50'
    },
    { 
      id: 'billing', 
      label: 'Billing & Invoices', 
      icon: Receipt,
      badge: pendingBalanceCount > 0 ? `${pendingBalanceCount} Due` : undefined,
      badgeColor: 'bg-rose-100 text-rose-800',
      iconColor: 'text-rose-600',
      iconBg: 'bg-rose-50'
    },
    { 
      id: 'lab', 
      label: 'Lab Charges', 
      icon: FlaskConical,
      iconColor: 'text-orange-600',
      iconBg: 'bg-orange-50'
    },
    { 
      id: 'clinical-notes', 
      label: 'Clinical Notes', 
      icon: FileText,
      iconColor: 'text-slate-600',
      iconBg: 'bg-slate-100'
    },
    { 
      id: 'cloud-backup', 
      label: 'Data Backup', 
      icon: HardDrive,
      iconColor: 'text-teal-700',
      iconBg: 'bg-teal-50'
    }
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    if (mobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Modern Light Medical Sidebar */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 bg-white w-72 flex flex-col transition-transform duration-200 ease-out border-r border-slate-200/90 shadow-[2px_0_12px_rgba(0,0,0,0.03)]
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Clinic Brand Area */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100 bg-gradient-to-b from-slate-50/50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-600 flex items-center justify-center text-white shadow-sm shadow-teal-600/30 flex-shrink-0">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C8.5 2 6 4.5 6 8c0 3.5 2.5 8 6 14 3.5-6 6-10.5 6-14 0-3.5-2.5-6-6-6z" fill="currentColor" fillOpacity="0.2"/>
                <path d="M9 10c0-1.5 1.5-3 3-3s3 1.5 3 3"/>
                <circle cx="12" cy="10" r="1"/>
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-black text-slate-900 tracking-tight leading-tight">
                Patil Dental Clinic
              </h1>
              <p className="text-[11px] text-teal-700 font-bold tracking-tight">
                +91 95796 49009
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Doctor Account Card & Switcher */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/30">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/80 shadow-2xs transition-all text-left"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`w-8 h-8 rounded-xl ${currentUser.avatarBg} text-white font-extrabold text-xs flex items-center justify-center shadow-xs flex-shrink-0`}>
                  {currentUser.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
                  <p className="text-[10px] text-teal-700 font-semibold truncate">{currentUser.role.split('/')[0]}</p>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0 ml-1" />
            </button>

            {/* Dropdown for 3 Accounts */}
            {showUserDropdown && (
              <div 
                className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
                onClick={() => setShowUserDropdown(false)}
              >
                <div className="px-3.5 py-1 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Switch Active Account
                </div>
                {CLINIC_ACCOUNTS.map(user => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => onSwitchUser(user)}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-left hover:bg-slate-50 transition ${
                      user.id === currentUser.id ? 'bg-teal-50/70 text-teal-900 font-bold' : 'text-slate-700 text-xs'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-lg ${user.avatarBg} text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0`}>
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate">{user.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{user.role}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Clean Navigation Menu */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin scrollbar-thumb-slate-200">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all group ${
                  isActive
                    ? 'bg-teal-700 text-white shadow-sm shadow-teal-900/10'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors flex-shrink-0 ${
                    isActive ? 'bg-white/20 text-white' : `${item.iconBg} ${item.iconColor}`
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    item.badgeColor || (isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700')
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Cloud Status & Helpline */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 px-1">
            <span className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isCloudConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
              <span>{isCloudConnected ? 'Cloud Active' : 'Offline Mode'}</span>
            </span>
          </div>

          <a
            href="https://wa.me/919579649009"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>WhatsApp (+91 95796 49009)</span>
          </a>
        </div>

      </aside>
    </>
  );
};
