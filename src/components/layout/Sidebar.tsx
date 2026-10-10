import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  LayoutDashboard, 
  Building, 
  Compass, 
  SplitSquareVertical, 
  ClipboardCheck, 
  Smartphone, 
  Calculator, 
  TrendingUp, 
  AlertCircle, 
  Sparkles,
  ShieldAlert
} from 'lucide-react';

export type ActiveTab = 
  | 'dashboard'
  | 'buildings'
  | 'plan-editor'
  | 'reconfiguration'
  | 'condition'
  | 'site-survey'
  | 'scope-boq'
  | 'financial'
  | 'snags'
  | 'ai-advisor';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenGeminiChat: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onOpenGeminiChat }) => {
  const { t, language } = useLanguage();

  const navGroups: {
    title: { ar: string; en: string };
    items: { id: ActiveTab; labelKey: string; icon: React.FC<{ className?: string }>; badge?: string }[];
  }[] = [
    {
      title: { ar: 'الرئيسية والمحفظة', en: 'Core Portfolio' },
      items: [
        { id: 'dashboard', labelKey: 'navDashboard', icon: LayoutDashboard },
        { id: 'buildings', labelKey: 'navBuildings', icon: Building },
      ]
    },
    {
      title: { ar: 'التصميم وإعادة التهيئة', en: 'Design & Layout' },
      items: [
        { id: 'plan-editor', labelKey: 'navPlanEditor', icon: Compass },
        { id: 'reconfiguration', labelKey: 'navReconfig', icon: SplitSquareVertical, badge: 'Core' },
      ]
    },
    {
      title: { ar: 'الفحص الميداني وضبط الجودة', en: 'Survey & Quality' },
      items: [
        { id: 'condition', labelKey: 'navCondition', icon: ClipboardCheck },
        { id: 'site-survey', labelKey: 'navSiteSurvey', icon: Smartphone, badge: 'PWA' },
        { id: 'snags', labelKey: 'navSnagging', icon: AlertCircle },
      ]
    },
    {
      title: { ar: 'التكاليف والجدوى المالية', en: 'Cost & Feasibility' },
      items: [
        { id: 'scope-boq', labelKey: 'navScopeBoq', icon: Calculator },
        { id: 'financial', labelKey: 'navFinancial', icon: TrendingUp },
      ]
    },
    {
      title: { ar: 'الذكاء الاصطناعي', en: 'AI Intelligence' },
      items: [
        { id: 'ai-advisor', labelKey: 'navAiAssistant', icon: Sparkles, badge: 'Gemini' }
      ]
    }
  ];

  return (
    <aside className="w-64 bg-slate-900 border-e border-slate-800 flex flex-col justify-between shrink-0 select-none no-print overflow-y-auto">
      <div className="p-3 space-y-4">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {group.title[language]}
            </div>

            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-semibold shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span>{t(item.labelKey)}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[9.5px] px-1.5 py-0.2 rounded font-bold uppercase ${
                      item.badge === 'Core'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : item.badge === 'Gemini'
                        ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Quick Gemini CTA & Compliance */}
      <div className="p-3 m-3 space-y-2">
        <button
          onClick={onOpenGeminiChat}
          className="w-full p-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-sky-500/15 to-amber-500/10 hover:from-amber-500/30 hover:to-sky-500/25 border border-amber-500/30 text-start transition-all shadow-md group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
              <span>{language === 'ar' ? 'مستشار Gemini الذكي' : 'Gemini AI Assistant'}</span>
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 leading-tight">
            {language === 'ar' ? 'استشارات فورية لكود البناء والتقسيم والجدوى' : 'Real-time SBC and reconfiguration advisory'}
          </p>
        </button>

        {/* Engineering disclaimer */}
        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-[10px] text-slate-500 leading-relaxed">
          <div className="flex items-center gap-1 text-slate-400 font-semibold mb-0.5">
            <ShieldAlert className="w-3 h-3 text-amber-400" />
            <span>{language === 'ar' ? 'كود البناء السعودي (SBC)' : 'SBC Compliance'}</span>
          </div>
          {language === 'ar'
            ? 'المخططات تخطيطية مفاهيمية وتتطلب مراجعة مهندس إنشائي مرخص.'
            : 'Plans are conceptual and require licensed structural engineer sign-off.'}
        </div>
      </div>
    </aside>
  );
};
