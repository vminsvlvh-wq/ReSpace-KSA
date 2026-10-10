import React, { useState } from 'react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { useLanguage } from '../../context/LanguageContext';
import { WifiOff, Wifi, CheckCircle2, ShieldCheck, X } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const { language } = useLanguage();
  const [dismissed, setDismissed] = useState(false);

  if (isOnline) {
    return null;
  }

  if (dismissed) {
    return (
      <button
        onClick={() => setDismissed(false)}
        className="fixed bottom-6 start-6 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500 text-slate-950 font-bold text-xs shadow-xl animate-pulse"
      >
        <WifiOff className="w-3.5 h-3.5" />
        <span>{language === 'ar' ? 'وضع عدم الاتصال' : 'Offline'}</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 start-6 z-50 max-w-md bg-slate-900 border border-amber-500/50 text-slate-100 p-3.5 rounded-2xl shadow-2xl backdrop-blur-md flex items-start gap-3 no-print">
      <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0 mt-0.5">
        <WifiOff className="w-4 h-4 animate-pulse" />
      </div>

      <div className="space-y-1 text-xs flex-1">
        <div className="flex items-center gap-1.5 font-bold text-amber-400">
          <span>{language === 'ar' ? 'وضع عدم الاتصال نشط (PWA Offline Mode)' : 'Offline Mode Active'}</span>
        </div>
        <p className="text-slate-300 text-[11px] leading-relaxed">
          {language === 'ar'
            ? 'يمكنك استعراض ومراجعة المخططات الهندسية، سيناريوهات التقسيم، وجداول الكميات بدون إنترنت. سيتم حفظ أي مدخلات جديدة للمزامنة لاحقاً.'
            : 'You can review architectural plans, scenarios, and BOQ offline. All field inputs are queued locally.'}
        </p>
      </div>

      <button
        onClick={() => setDismissed(true)}
        className="text-slate-400 hover:text-white p-1 rounded-lg"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
