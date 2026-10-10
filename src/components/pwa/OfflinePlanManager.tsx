import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { 
  Database, 
  CheckCircle2, 
  HardDriveDownload, 
  Compass, 
  Layers, 
  Calculator, 
  ClipboardCheck, 
  X,
  Wifi,
  Sparkles
} from 'lucide-react';

interface OfflinePlanManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OfflinePlanManager: React.FC<OfflinePlanManagerProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const { 
    selectedBuilding, 
    floors, 
    units, 
    floorPlan, 
    scenarios, 
    boqItems, 
    conditionItems 
  } = useApp();

  const [isCaching, setIsCaching] = useState(false);
  const [cachedSuccess, setCachedSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePrecacheAll = () => {
    setIsCaching(true);
    // Simulate pre-caching vector assets and JSON datasets
    setTimeout(() => {
      // Force mirror to localStorage
      localStorage.setItem('respace_offline_cache_timestamp', Date.now().toString());
      setIsCaching(false);
      setCachedSuccess(true);
      setTimeout(() => setCachedSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm no-print">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-5 text-xs text-slate-200">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                {language === 'ar' ? 'إدارة الوصول بدون إنترنت للمخططات (Offline Plans)' : 'Offline Plans & Data Cache'}
              </h2>
              <p className="text-[11px] text-slate-400">
                {selectedBuilding.nameAr} • {selectedBuilding.city}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-slate-300 leading-relaxed">
          {language === 'ar'
            ? 'تتيح تقنية PWA لمديري المشاريع والمهندسين المعماريين مراجعة المخططات الهندسية وسيناريوهات التقسيم وجداول الكميات في المواقع الإنشائية والأقبية حتى في حال انقطاع شبكة الإنترنت تماماً.'
            : 'PWA service workers enable site project managers to review architectural drawings, subdivision scenarios, and preliminary BOQs offline in basements or remote sites.'}
        </p>

        {/* Cached Data Inventory */}
        <div className="space-y-2">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-amber-400" />
              <div>
                <span className="font-semibold text-white block">{language === 'ar' ? 'مخطط الدور التفاعلي (SVG As-Built Vector)' : 'Interactive SVG Floor Plan'}</span>
                <span className="text-[10px] text-slate-400">{floorPlan.elements.length} {language === 'ar' ? 'عنصر معماري وإنشائي' : 'plan elements'}</span>
              </div>
            </div>
            <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'مخزن محلياً' : 'Cached'}</span>
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-400" />
              <div>
                <span className="font-semibold text-white block">{language === 'ar' ? 'سيناريوهات إعادة التهيئة (Scenarios A-D)' : 'Subdivision Scenarios (A-D)'}</span>
                <span className="text-[10px] text-slate-400">{scenarios.length} {language === 'ar' ? 'سيناريوهات معتمدة' : 'configured scenarios'}</span>
              </div>
            </div>
            <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'مخزن محلياً' : 'Cached'}</span>
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-purple-400" />
              <div>
                <span className="font-semibold text-white block">{language === 'ar' ? 'جدول الكميات والتكاليف (BOQ Items)' : 'Preliminary BOQ Schedule'}</span>
                <span className="text-[10px] text-slate-400">{boqItems.length} {language === 'ar' ? 'بند تسعير' : 'cost items'}</span>
              </div>
            </div>
            <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'مخزن محلياً' : 'Cached'}</span>
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4 text-rose-400" />
              <div>
                <span className="font-semibold text-white block">{language === 'ar' ? 'سجل الفحص الفني والملاحظات' : 'Technical Inspection & Snags'}</span>
                <span className="text-[10px] text-slate-400">{conditionItems.length} {language === 'ar' ? 'سجل فحص' : 'inspections'}</span>
              </div>
            </div>
            <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'مخزن محلياً' : 'Cached'}</span>
            </span>
          </div>
        </div>

        {/* Action Button: Pre-cache All */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-3">
          <div className="text-[11px] text-slate-400">
            {language === 'ar' ? 'حجم البيانات المحفوظة: ~4.2 ميجابايت' : 'Cached payload size: ~4.2 MB'}
          </div>

          <button
            onClick={handlePrecacheAll}
            disabled={isCaching}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-xl text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            <HardDriveDownload className="w-4 h-4" />
            <span>
              {isCaching 
                ? (language === 'ar' ? 'جارٍ المزامنة والتخزين...' : 'Pre-caching Assets...')
                : cachedSuccess
                ? (language === 'ar' ? 'تم التخزين بنجاح ✓' : 'Cached Successfully ✓')
                : (language === 'ar' ? 'تحديث التخزين بدون اتصال' : 'Pre-cache for Site Review')}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
