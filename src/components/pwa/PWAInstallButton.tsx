import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { useLanguage } from '../../context/LanguageContext';
import { Download, Share, X, Smartphone, CheckCircle2 } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const { language } = useLanguage();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed in standalone mode, hide
  if (isInstalled) {
    return (
      <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>{language === 'ar' ? 'تطبيق مثبت' : 'PWA Installed'}</span>
      </div>
    );
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 transition-all cursor-pointer"
        title={language === 'ar' ? 'تثبيت التطبيق على جهازك للوصول بدون إنترنت' : 'Install PWA for offline access'}
      >
        <Download className="w-3.5 h-3.5" />
        <span>{language === 'ar' ? 'تثبيت التطبيق' : 'Install App'}</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-all"
        >
          <Smartphone className="w-3.5 h-3.5 text-amber-400" />
          <span>{language === 'ar' ? 'تثبيت على آيفون' : 'Install on iOS'}</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-xs">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4 text-slate-200">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-amber-400" />
                  <span>{language === 'ar' ? 'تثبيت التطبيق على iPhone / iPad' : 'Install on iOS Safari'}</span>
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 leading-relaxed text-slate-300">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center font-bold text-amber-400 shrink-0">1</span>
                  <p>{language === 'ar' ? 'انقر على زر المشاركة (Share) أسفل متصفح Safari.' : 'Tap the Share icon at the bottom of Safari.'}</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center font-bold text-amber-400 shrink-0">2</span>
                  <p>{language === 'ar' ? 'مرر للأسفل واختر "إضافة إلى الصفحة الرئيسية" (Add to Home Screen).' : 'Scroll down and select "Add to Home Screen".'}</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center font-bold text-amber-400 shrink-0">3</span>
                  <p>{language === 'ar' ? 'ستتمكن بعدها من فتح التطبيق واستعراض المخططات بدون إنترنت.' : 'Open anytime from your home screen with full offline plan access.'}</p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition-all"
              >
                {language === 'ar' ? 'فهمت ذلك' : 'Got it'}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Desktop or browsers before prompt fires
  return (
    <button
      onClick={() => {
        alert(
          language === 'ar'
            ? 'التطبيق جاهز للعمل بدون إنترنت (PWA Offline Ready). يمكنك تثبيته عبر خيار "تثبيت التطبيق" في شريط عنوان المتصفح أو قائمة المشاركة.'
            : 'ReSpace is PWA Offline Ready. You can install it via your browser address bar menu.'
        );
      }}
      className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition-all"
      title={language === 'ar' ? 'تطبيق ويب تقدمي (PWA)' : 'Progressive Web App'}
    >
      <Download className="w-3.5 h-3.5 text-amber-400" />
      <span>{language === 'ar' ? 'تثبيت PWA' : 'Install PWA'}</span>
    </button>
  );
};
