import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { 
  TrendingUp, 
  DollarSign, 
  Clock, 
  ShieldAlert, 
  Percent, 
  PiggyBank, 
  Layers, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';

export const FinancialFeasibility: React.FC = () => {
  const { language, t } = useLanguage();
  const { selectedBuilding, selectedScenario, boqItems } = useApp();

  const [vacancyRate, setVacancyRate] = useState<number>(5); // 5%
  const [opexRate, setOpexRate] = useState<number>(8); // 8% maintenance & management

  const baseRenovationCost = selectedScenario.estimatedCostSar;
  const currentMonthlyRent = selectedScenario.currentMonthlyRentalSar;
  const projectedMonthlyRent = selectedScenario.projectedMonthlyRentalSar;

  // Annual figures
  const currentAnnualGross = currentMonthlyRent * 12;
  const projectedAnnualGross = projectedMonthlyRent * 12;
  const grossRentIncrease = projectedAnnualGross - currentAnnualGross;

  // Factoring vacancy & opex
  const effectiveProjectedAnnual = projectedAnnualGross * (1 - (vacancyRate / 100)) * (1 - (opexRate / 100));
  const effectiveCurrentAnnual = currentAnnualGross * (1 - (vacancyRate / 100)) * (1 - (opexRate / 100));
  const netAnnualGain = effectiveProjectedAnnual - effectiveCurrentAnnual;

  // Financial ratios
  const paybackYears = netAnnualGain > 0 ? Number((baseRenovationCost / netAnnualGain).toFixed(1)) : 0;
  const simpleRoi = baseRenovationCost > 0 ? Number(((netAnnualGain / baseRenovationCost) * 100).toFixed(1)) : 0;
  const simpleRentalYield = Number(((projectedAnnualGross / (selectedBuilding.landArea * 3000 + baseRenovationCost)) * 100).toFixed(1));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <span>{language === 'ar' ? 'الجدوى المالية ونموذج العائد الاستثماري' : 'Financial Feasibility & Yield Model'}</span>
          </h1>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 uppercase">
            ROI Feasibility
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          {language === 'ar'
            ? `مبني على السيناريو المعتمد: (${selectedScenario.code}) ${selectedScenario.titleAr} - تكلفة التجديد: ${baseRenovationCost.toLocaleString()} ر.س`
            : `Grounded in Preferred Scenario: (${selectedScenario.code}) ${selectedScenario.title} - Renovation capex: ${baseRenovationCost.toLocaleString()} SAR`}
        </p>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>{language === 'ar' ? 'صافي الزيادة السنوية بالإيجار' : 'Net Annual Rent Gain'}</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400">
            +{Math.round(netAnnualGain).toLocaleString()} {t('currencySar')}
          </div>
          <div className="text-[10.5px] text-slate-400">
            {language === 'ar' ? 'بعد خصم الشغور ومصاريف الإدارة' : 'After vacancy & management'}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>{language === 'ar' ? 'فترة استرداد رأس المال' : 'Payback Period'}</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-amber-400">
            {paybackYears} {language === 'ar' ? 'سنوات' : 'Years'}
          </div>
          <div className="text-[10.5px] text-slate-400">
            ({Math.round(paybackYears * 12)} {language === 'ar' ? 'شهراً لاسترداد كامل التكلفة' : 'months full capex recovery'})
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>{language === 'ar' ? 'العائد السنوي على التجديد (ROI)' : 'Annual ROI on Capex'}</span>
            <Percent className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-xl font-bold text-sky-400">
            {simpleRoi}%
          </div>
          <div className="text-[10.5px] text-slate-400">
            {language === 'ar' ? 'عائد نقدي سنوي مباشر' : 'Direct annual cash yield'}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>{language === 'ar' ? 'معدل زيادة الإيجار الإجمالي' : 'Gross Rent Multiple'}</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-bold text-purple-400">
            +{(grossRentIncrease / currentAnnualGross * 100).toFixed(0)}%
          </div>
          <div className="text-[10.5px] text-slate-400">
            {currentMonthlyRent.toLocaleString()} → {projectedMonthlyRent.toLocaleString()} {t('currencySar')}/mo
          </div>
        </div>
      </div>

      {/* Assumptions & Slider Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <PiggyBank className="w-4 h-4 text-amber-400" />
            <span>{language === 'ar' ? 'افتراضات النموذج المالي' : 'Model Sensitivity Assumptions'}</span>
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-slate-300 font-medium">
                  {language === 'ar' ? 'نسبة الشغور السنوي المتوقعة (Vacancy):' : 'Projected Vacancy Rate:'}
                </span>
                <span className="font-bold text-white font-mono">{vacancyRate}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                value={vacancyRate}
                onChange={(e) => setVacancyRate(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-slate-300 font-medium">
                  {language === 'ar' ? 'مصاريف التشغيل والصيانة والإدارة (OPEX):' : 'Operating & Maintenance (OPEX):'}
                </span>
                <span className="font-bold text-white font-mono">{opexRate}%</span>
              </div>
              <input
                type="range"
                min="3"
                max="25"
                value={opexRate}
                onChange={(e) => setOpexRate(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span>{language === 'ar' ? 'الإيجار السنوي الإجمالي قبل التجديد:' : 'Pre-Renovation Annual Rent:'}</span>
              <span className="font-mono text-slate-200">{currentAnnualGross.toLocaleString()} {t('currencySar')}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>{language === 'ar' ? 'الإيجار السنوي الإجمالي بعد إعادة التقسيم:' : 'Post-Reconfig Annual Rent:'}</span>
              <span className="font-mono text-emerald-400 font-bold">{projectedAnnualGross.toLocaleString()} {t('currencySar')}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>{language === 'ar' ? 'إجمالي الاستثمار الرأسمالي (Capex):' : 'Total Renovation Capex:'}</span>
              <span className="font-mono text-amber-400 font-bold">{baseRenovationCost.toLocaleString()} {t('currencySar')}</span>
            </div>
          </div>
        </div>

        {/* Legal & Regulatory Feasibility Box */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>{language === 'ar' ? 'إخلاء المسؤولية والضوابط النظامية' : 'Regulatory & Investment Disclaimer'}</span>
          </h3>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2 leading-relaxed">
            <p className="font-medium text-amber-400">
              {language === 'ar' 
                ? 'تنبيه نظامي واستثماري ملزم:'
                : 'Mandatory Investment & Regulatory Notice:'}
            </p>
            <p>
              {language === 'ar'
                ? 'جميع الأرقام والعوائد ونسب الزيادة المعروضة هي تقديرات مالية وافتراضات مبنية على متوسط أسعار الإيجار في السوق السعودي وقت إعداد الدراسة، ولا تشكل أي ضمان للأداء المالي أو الإشغال الفعلي.'
                : 'All figures, yields, and payback periods are financial projections based on prevailing market averages and do not constitute an investment guarantee.'}
            </p>
            <p>
              {language === 'ar'
                ? 'أي تعديل في عدد الوحدات السكنية أو تغيير استخدام المساحات يخضع لأنظمة أمانة المنطقة، والدفاع المدني، وكود البناء السعودي (SBC) وتراخيص البناء الصادرة.'
                : 'Any increase in residential unit count or change of use is subject to municipal zoning, Civil Defense, and Saudi Building Code (SBC) regulatory approvals.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
