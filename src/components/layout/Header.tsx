import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { PWAInstallButton } from '../pwa/PWAInstallButton';
import { 
  Building2, 
  Globe2, 
  UserCheck, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Tv, 
  FileText,
  ShieldAlert,
  ChevronDown,
  HardDrive
} from 'lucide-react';

interface HeaderProps {
  onTogglePresentation: () => void;
  isPresentationMode: boolean;
  onOpenReportModal: () => void;
  onOpenGeminiChat: () => void;
  onOpenOfflinePlanManager?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onTogglePresentation,
  isPresentationMode,
  onOpenReportModal,
  onOpenGeminiChat,
  onOpenOfflinePlanManager
}) => {
  const { language, setLanguage, t, isRtl } = useLanguage();
  const { 
    company, 
    buildings, 
    selectedBuilding, 
    setSelectedBuilding,
    currentRole, 
    setCurrentRole,
    pendingSyncCount,
    syncOfflineQueue
  } = useApp();

  const roleLabels: Record<UserRole, { ar: string; en: string }> = {
    OWNER: { ar: 'مالك العقار', en: 'Property Owner' },
    ADMIN: { ar: 'مدير النظام', en: 'Admin' },
    ARCHITECT: { ar: 'مهندس معماري', en: 'Architect' },
    INTERIOR_DESIGNER: { ar: 'مصمم داخلي', en: 'Interior Designer' },
    STRUCTURAL_ENGINEER: { ar: 'مهندس إنشائي', en: 'Structural Eng.' },
    MEP_ENGINEER: { ar: 'مهندس كهروميكانيك', en: 'MEP Eng.' },
    PROJECT_MANAGER: { ar: 'مدير المشروع', en: 'Project Manager' },
    CONTRACTOR: { ar: 'مقاول التجديد', en: 'Contractor' },
    CLIENT: { ar: 'العميل / المستثمر', en: 'Client' },
    VIEWER: { ar: 'مشاهد', en: 'Viewer' }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100 px-4 lg:px-6 py-3 transition-colors no-print">
      <div className="flex items-center justify-between gap-3">
        {/* Brand & Project Selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-bold text-xl">
              <span className="tracking-tighter">R</span>
              <span className="text-xs ml-0.5 text-white">KSA</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-white tracking-wide">
                  {language === 'ar' ? 'ري سبيس KSA' : 'ReSpace KSA'}
                </span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  Renovation SaaS
                </span>
              </div>
              <div className="text-xs text-slate-400 truncate max-w-[200px] sm:max-w-[280px]">
                {company.name}
              </div>
            </div>
          </div>

          {/* Building Selector Dropdown */}
          <div className="hidden md:flex items-center gap-2 ms-4 ps-4 border-s border-slate-800">
            <Building2 className="w-4 h-4 text-amber-400" />
            <select
              value={selectedBuilding.id}
              onChange={(e) => {
                const b = buildings.find(x => x.id === e.target.value);
                if (b) setSelectedBuilding(b);
              }}
              className="bg-slate-800/80 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              {buildings.map((b) => (
                <option key={b.id} value={b.id}>
                  {language === 'ar' ? b.nameAr : b.name} ({b.city})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Controls: Offline Sync, Role, Language, Presentation */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* PWA In-App Install Button */}
          <PWAInstallButton />

          {/* Offline Plan Access Trigger */}
          {onOpenOfflinePlanManager && (
            <button
              onClick={onOpenOfflinePlanManager}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-all"
              title={language === 'ar' ? 'المخططات المخزنة بدون اتصال' : 'Offline Plans Cache'}
            >
              <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden xl:inline">
                {language === 'ar' ? 'المخططات بدون إنترنت' : 'Offline Plans'}
              </span>
            </button>
          )}

          {/* Offline Sync Indicator */}
          {pendingSyncCount > 0 ? (
            <button
              onClick={syncOfflineQueue}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-500/15 border border-amber-500/40 text-amber-400 rounded-lg text-xs font-medium hover:bg-amber-500/25 transition-all animate-pulse"
              title="سجلات مسح ميداني بانتظار المزامنة"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{pendingSyncCount} {t('offlineSyncPending')}</span>
            </button>
          ) : (
            <div className="hidden lg:flex items-center gap-1.5 px-2 py-1 bg-slate-800/50 rounded-md text-[11px] text-emerald-400 border border-emerald-500/20">
              <Wifi className="w-3 h-3" />
              <span>{t('allSynced')}</span>
            </div>
          )}

          {/* Role Switcher */}
          <div className="relative flex items-center">
            <label className="text-[11px] text-slate-400 hidden xl:inline me-1.5">
              {language === 'ar' ? 'الدور:' : 'Role:'}
            </label>
            <select
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value as UserRole)}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              {(Object.keys(roleLabels) as UserRole[]).map((r) => (
                <option key={r} value={r}>
                  {roleLabels[r][language]}
                </option>
              ))}
            </select>
          </div>

          {/* Gemini AI Advisor Trigger */}
          <button
            onClick={onOpenGeminiChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-amber-500/15 to-sky-500/15 hover:from-amber-500/25 hover:to-sky-500/25 text-amber-300 border border-amber-500/40 transition-all shadow-sm"
            title="فتح مستشار Gemini الذكي للمشروع"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            <span className="hidden sm:inline">
              {language === 'ar' ? 'مستشار Gemini' : 'Gemini Advisor'}
            </span>
          </button>

          {/* Presentation Mode Toggle */}
          <button
            onClick={onTogglePresentation}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isPresentationMode 
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/30' 
                : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700'
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {language === 'ar' ? 'عرض العميل' : 'Client Mode'}
            </span>
          </button>

          {/* Reports & PDF Trigger */}
          <button
            onClick={onOpenReportModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
            title="تصدير التقرير الفني المعتمد"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">
              {language === 'ar' ? 'التقارير' : 'Reports'}
            </span>
          </button>

          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-amber-400 font-semibold rounded-lg transition-all"
            aria-label="تبديل اللغة / Switch Language"
          >
            <Globe2 className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'English' : 'عربي'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
