import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { OptimizationObjective, ReconfigurationScenario, UnitType } from '../../types';
import { 
  SplitSquareVertical, 
  Sparkles, 
  ShieldAlert, 
  Check, 
  Layers, 
  DollarSign, 
  Clock, 
  TrendingUp, 
  ArrowRight,
  Maximize2,
  Table,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  FileSpreadsheet
} from 'lucide-react';

export const ReconfigurationModule: React.FC = () => {
  const { language, t } = useLanguage();
  const { 
    selectedBuilding,
    selectedFloor,
    selectedUnit, 
    setSelectedUnit,
    units, 
    scenarios, 
    selectedScenario, 
    setSelectedScenario,
    setPreferredScenario,
    addScenario,
    canEdit
  } = useApp();

  const [activeObjective, setActiveObjective] = useState<OptimizationObjective>('best_rental_yield');
  const [viewMode, setViewMode] = useState<'cards' | 'comparison'>('comparison');
  const [showNewScenarioModal, setShowNewScenarioModal] = useState<boolean>(false);

  // New Custom Scenario inputs
  const [customTitleAr, setCustomTitleAr] = useState('');
  const [customTitleEn, setCustomTitleEn] = useState('');
  const [customUnitsCount, setCustomUnitsCount] = useState<number>(2);
  const [customCost, setCustomCost] = useState<number>(150000);
  const [customDuration, setCustomDuration] = useState<number>(8);
  const [customRent, setCustomRent] = useState<number>(10500);

  const floorUnits = units.filter(u => u.floorId === selectedFloor.id);

  const objectivesList: { id: OptimizationObjective; labelKey: string; desc: { ar: string; en: string } }[] = [
    { 
      id: 'best_rental_yield', 
      labelKey: 'أعلى عائد إيجاري (Best Yield)', 
      desc: { ar: 'تعظيم الدخل السنوي الإجمالي مع موازنة تكلفة التشطيب', en: 'Maximize annual rent return while balancing capex' } 
    },
    { 
      id: 'max_units', 
      labelKey: 'أقصى عدد وحدات (Max Units)', 
      desc: { ar: 'تحويل المساحة إلى أكبر عدد من الاستوديوهات المستقلة', en: 'Divide into maximum number of independent studio units' } 
    },
    { 
      id: 'min_cost', 
      labelKey: 'أقل تكلفة وأقل هدم (Min Capex)', 
      desc: { ar: 'تجديد عصري مع الحفاظ على التوزيع القائم وتقليل الهدم', en: 'Modern renovation with minimal partition alterations' } 
    },
    { 
      id: 'min_structural_changes', 
      labelKey: 'أقل تأثير على السباكة و MEP', 
      desc: { ar: 'الاعتماد الكلي على مناور الصرف والسباكة الحالية', en: 'Full alignment with existing plumbing stacks' } 
    },
    { 
      id: 'balanced_layout', 
      labelKey: 'توزيع متوازن (شقة عائلية + استوديو)', 
      desc: { ar: 'شقة واسعة ومريحة مع وحدة إضافية مستقلة للإيجار', en: 'Spacious main unit plus supplemental studio' } 
    }
  ];

  const handleCreateCustomScenario = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitleAr.trim()) return;

    const nextCode = String.fromCharCode(65 + scenarios.length); // E, F...
    const newScen: ReconfigurationScenario = {
      id: `scen_${Date.now()}`,
      unitId: selectedUnit?.id || 'unt_201',
      floorId: selectedFloor.id,
      buildingId: selectedBuilding.id,
      code: nextCode,
      title: customTitleEn || customTitleAr,
      titleAr: customTitleAr,
      description: 'Custom engineered reconfiguration scenario.',
      descriptionAr: 'سيناريو مخصص تم تصميمه لتلبية اشتراطات المالك والجدوى المستهدفة.',
      targetObjective: activeObjective,
      resultingUnitsCount: Number(customUnitsCount),
      unitMix: [
        { type: customUnitsCount === 1 ? '3 Bedroom' : customUnitsCount === 2 ? '1 Bedroom' : 'Studio', count: customUnitsCount, avgArea: Math.round(210 / customUnitsCount) }
      ],
      demolishedWallsLengthM: 16.0,
      newWallsLengthM: 22.0,
      wetAreaModifications: 'Moderate',
      mepImpactLevel: 'Medium',
      spaceEfficiencyScore: 88,
      renovationComplexity: 'Moderate',
      estimatedCostSar: Number(customCost),
      estimatedDurationWeeks: Number(customDuration),
      structuralRisk: 'None',
      currentMonthlyRentalSar: selectedUnit?.currentRentMonthly || 5500,
      projectedMonthlyRentalSar: Number(customRent),
      usableAreaM2: 192,
      circulationAreaM2: 18,
      status: 'Draft',
      planElements: []
    };

    addScenario(newScen);
    setShowNewScenarioModal(false);
    setCustomTitleAr('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 uppercase">
              {language === 'ar' ? 'المحرك المعماري الأساسي' : 'Core Engine'}
            </span>
            <span className="text-xs text-slate-400">
              {selectedBuilding.nameAr} • {selectedFloor.nameAr}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <SplitSquareVertical className="w-6 h-6 text-amber-400" />
            <span>{t('scenarioTitle')}</span>
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl">
            {t('scenarioDesc')}
          </p>
        </div>

        {/* Action Controls & View Switcher */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setViewMode('comparison')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'comparison' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>{t('compareScenarios')}</span>
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'cards' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'بطاقات السيناريوهات' : 'Scenario Cards'}</span>
            </button>
          </div>

          {canEdit && (
            <button
              onClick={() => setShowNewScenarioModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md shadow-amber-500/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'توليد سيناريو مخصص' : 'New Scenario'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Target Unit Selector & Objective Filter */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Selected Unit Box (4 cols) */}
        <div className="md:col-span-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2">
          <label className="text-[11px] font-semibold text-slate-400 block uppercase">
            {language === 'ar' ? 'الوحدة المستهدفة بالدراسة' : 'Target Apartment'}
          </label>
          <div className="flex items-center justify-between">
            <select
              value={selectedUnit?.id || ''}
              onChange={(e) => {
                const u = units.find(x => x.id === e.target.value);
                if (u) setSelectedUnit(u);
              }}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-white focus:outline-none focus:border-amber-500"
            >
              {floorUnits.map(u => (
                <option key={u.id} value={u.id}>
                  {language === 'ar' ? `شقة ${u.unitNumber} (${u.area} م² - ${u.unitType})` : `Unit ${u.unitNumber} (${u.area} m² - ${u.unitType})`}
                </option>
              ))}
            </select>
          </div>
          <div className="text-[11px] text-slate-400 pt-1 flex items-center justify-between">
            <span>{language === 'ar' ? 'الإيجار الحالي:' : 'Baseline Rent:'} <strong className="text-white">{selectedUnit?.currentRentMonthly?.toLocaleString()} {t('currencySar')}</strong></span>
            <span className="text-amber-400 font-semibold">{selectedUnit?.occupancyStatus}</span>
          </div>
        </div>

        {/* Optimization Objective Selector (8 cols) */}
        <div className="md:col-span-8 bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2">
          <label className="text-[11px] font-semibold text-slate-400 block uppercase">
            {language === 'ar' ? 'هدف التحسين المعماري والمالي المطلوب (Optimization Objective)' : 'Optimization Priority'}
          </label>
          <div className="flex flex-wrap gap-2">
            {objectivesList.map((obj) => {
              const isSelected = activeObjective === obj.id;
              return (
                <button
                  key={obj.id}
                  onClick={() => setActiveObjective(obj.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                    isSelected
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/50 shadow-sm'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {obj.labelKey}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Structural Safety Notice */}
      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-amber-500/30 flex items-start gap-3 text-xs text-slate-300">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-amber-400 block">
            {language === 'ar' ? 'ضوابط السلامة الإنشائية ومناور الصرف' : 'Structural & MEP Constraints'}
          </span>
          <p className="text-[11.5px] leading-relaxed text-slate-300">
            {language === 'ar'
              ? 'جميع السيناريوهات المولدة تحترم مواقع الأعمدة الخرسانية القائمة (C1 إلى C9) والمناور الخدمية دون أي تكسير خرساني. التعديلات تعتمد على قواطع جبسية عازلة خفيفة الوزن وتمديدات سباكة موصولة على شبكة الصرف الرئيسية المعتمدة.'
              : 'All generated scenarios preserve all structural columns (C1-C9) and vertical shafts. Demolition is strictly limited to non-load bearing partitions.'}
          </p>
        </div>
      </div>

      {/* View 1: Side-by-Side Comparison Matrix (The Core Decision Engine) */}
      {viewMode === 'comparison' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Table className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold text-white">
                {language === 'ar' ? 'مصفوفة المقارنة المتكاملة للسيناريوهات' : 'Side-by-Side Scenario Decision Matrix'}
              </h2>
            </div>
            <span className="text-xs text-slate-400">
              {language === 'ar' ? 'اختر السيناريو الأنسب لربطه بنطاق العمل وجدول الكميات (BOQ)' : 'Select preferred scenario to link to Scope & BOQ'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-semibold">
                  <th className="p-3.5 text-start w-56">{language === 'ar' ? 'معيار المقارنة' : 'Evaluation Metric'}</th>
                  {scenarios.map((s) => (
                    <th 
                      key={s.id} 
                      className={`p-3.5 text-center min-w-[200px] ${
                        s.isPreferred ? 'bg-amber-500/10 text-amber-400 font-bold border-x border-amber-500/30' : 'text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1.5 mb-1">
                        <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-amber-400">
                          {s.code}
                        </span>
                        <span>{language === 'ar' ? s.titleAr : s.title}</span>
                      </div>
                      {s.isPreferred && (
                        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold">
                          <Check className="w-3 h-3" />
                          {t('selectedPreferred')}
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {/* Number of Units */}
                <tr className="hover:bg-slate-850/40">
                  <td className="p-3.5 font-medium text-slate-300">{language === 'ar' ? 'عدد الوحدات الناتجة' : 'Resulting Units'}</td>
                  {scenarios.map(s => (
                    <td key={s.id} className={`p-3.5 text-center font-bold text-sm ${s.isPreferred ? 'bg-amber-500/5' : ''}`}>
                      <span className="text-white">{s.resultingUnitsCount}</span> {language === 'ar' ? 'وحدة' : 'units'}
                      <div className="text-[10px] text-slate-400 font-normal mt-0.5">
                        {s.unitMix.map(m => `${m.count}x ${m.type}`).join(' + ')}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Demolished Walls */}
                <tr className="hover:bg-slate-850/40">
                  <td className="p-3.5 font-medium text-slate-300">{t('demolishedWalls')}</td>
                  {scenarios.map(s => (
                    <td key={s.id} className={`p-3.5 text-center text-slate-200 ${s.isPreferred ? 'bg-amber-500/5' : ''}`}>
                      <span className="font-semibold text-rose-400">{s.demolishedWallsLengthM} {t('metricM')}</span>
                    </td>
                  ))}
                </tr>

                {/* New Drywall & Masonry */}
                <tr className="hover:bg-slate-850/40">
                  <td className="p-3.5 font-medium text-slate-300">{t('newDrywallMasonry')}</td>
                  {scenarios.map(s => (
                    <td key={s.id} className={`p-3.5 text-center text-slate-200 ${s.isPreferred ? 'bg-amber-500/5' : ''}`}>
                      <span className="font-semibold text-sky-400">{s.newWallsLengthM} {t('metricM')}</span>
                    </td>
                  ))}
                </tr>

                {/* Wet Area Impact */}
                <tr className="hover:bg-slate-850/40">
                  <td className="p-3.5 font-medium text-slate-300">{t('wetAreaImpact')}</td>
                  {scenarios.map(s => (
                    <td key={s.id} className={`p-3.5 text-center ${s.isPreferred ? 'bg-amber-500/5' : ''}`}>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        s.wetAreaModifications === 'None' ? 'bg-emerald-500/20 text-emerald-400' :
                        s.wetAreaModifications === 'Minor' ? 'bg-sky-500/20 text-sky-400' :
                        s.wetAreaModifications === 'Moderate' ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {s.wetAreaModifications}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Space Efficiency */}
                <tr className="hover:bg-slate-850/40">
                  <td className="p-3.5 font-medium text-slate-300">{t('spaceEfficiency')}</td>
                  {scenarios.map(s => (
                    <td key={s.id} className={`p-3.5 text-center ${s.isPreferred ? 'bg-amber-500/5' : ''}`}>
                      <div className="font-bold text-white">{s.spaceEfficiencyScore}%</div>
                      <div className="text-[10px] text-slate-400">{s.usableAreaM2} {t('metricM2')} {language === 'ar' ? 'صافي' : 'usable'}</div>
                    </td>
                  ))}
                </tr>

                {/* Estimated Renovation Cost */}
                <tr className="hover:bg-slate-850/40">
                  <td className="p-3.5 font-medium text-slate-300">{t('estRenovationCost')}</td>
                  {scenarios.map(s => (
                    <td key={s.id} className={`p-3.5 text-center ${s.isPreferred ? 'bg-amber-500/5' : ''}`}>
                      <span className="font-bold text-amber-400 text-sm">{s.estimatedCostSar.toLocaleString()}</span> {t('currencySar')}
                    </td>
                  ))}
                </tr>

                {/* Duration */}
                <tr className="hover:bg-slate-850/40">
                  <td className="p-3.5 font-medium text-slate-300">{t('estDuration')}</td>
                  {scenarios.map(s => (
                    <td key={s.id} className={`p-3.5 text-center text-slate-200 ${s.isPreferred ? 'bg-amber-500/5' : ''}`}>
                      <span className="font-semibold">{s.estimatedDurationWeeks}</span> {t('weeks')}
                    </td>
                  ))}
                </tr>

                {/* Projected Monthly Rental */}
                <tr className="hover:bg-slate-850/40">
                  <td className="p-3.5 font-medium text-slate-300">{t('projectedRent')}</td>
                  {scenarios.map(s => (
                    <td key={s.id} className={`p-3.5 text-center ${s.isPreferred ? 'bg-amber-500/5' : ''}`}>
                      <span className="font-bold text-emerald-400 text-sm">{s.projectedMonthlyRentalSar.toLocaleString()}</span> {t('currencySar')} / {language === 'ar' ? 'شهر' : 'mo'}
                    </td>
                  ))}
                </tr>

                {/* Net Rent Increase */}
                <tr className="hover:bg-slate-850/40 bg-slate-950/60 font-semibold">
                  <td className="p-3.5 text-emerald-400">{t('netGain')}</td>
                  {scenarios.map(s => {
                    const gain = s.projectedMonthlyRentalSar - s.currentMonthlyRentalSar;
                    const percent = Math.round((gain / s.currentMonthlyRentalSar) * 100);
                    return (
                      <td key={s.id} className={`p-3.5 text-center text-emerald-400 ${s.isPreferred ? 'bg-amber-500/10' : ''}`}>
                        +{gain.toLocaleString()} {t('currencySar')} (+{percent}%)
                      </td>
                    );
                  })}
                </tr>

                {/* Selection Action Row */}
                <tr>
                  <td className="p-3.5 font-medium text-slate-400">{language === 'ar' ? 'القرار والاعتماد' : 'Action'}</td>
                  {scenarios.map(s => (
                    <td key={s.id} className={`p-3.5 text-center ${s.isPreferred ? 'bg-amber-500/5' : ''}`}>
                      {s.isPreferred ? (
                        <div className="flex items-center justify-center gap-1.5 py-1.5 px-3 bg-emerald-500/20 text-emerald-400 rounded-xl font-bold text-xs">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{t('selectedPreferred')}</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => setPreferredScenario(s.id)}
                          className="w-full py-1.5 px-3 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 border border-slate-700 rounded-xl font-medium text-xs transition-all"
                        >
                          {t('selectAsPreferred')}
                        </button>
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View 2: Scenario Cards Grid */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scenarios.map((s) => {
            const isSelected = selectedScenario.id === s.id;
            return (
              <div
                key={s.id}
                onClick={() => setSelectedScenario(s)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer relative ${
                  s.isPreferred
                    ? 'bg-slate-900 border-amber-500 shadow-xl ring-1 ring-amber-500/40'
                    : isSelected
                    ? 'bg-slate-900 border-slate-600'
                    : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900'
                }`}
              >
                {s.isPreferred && (
                  <div className="absolute top-0 end-0 bg-amber-500 text-slate-950 text-[10px] font-bold px-3 py-0.5 rounded-es-lg flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>{t('selectedPreferred')}</span>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-amber-400 text-sm">
                    {s.code}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">
                      {language === 'ar' ? s.titleAr : s.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {language === 'ar' ? s.descriptionAr : s.description}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800 text-center">
                  <div className="bg-slate-950 p-2 rounded-lg">
                    <div className="text-[10px] text-slate-400">{language === 'ar' ? 'الوحدات' : 'Units'}</div>
                    <div className="text-sm font-bold text-white">{s.resultingUnitsCount}</div>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-lg">
                    <div className="text-[10px] text-slate-400">{t('estRenovationCost')}</div>
                    <div className="text-xs font-bold text-amber-400">{s.estimatedCostSar.toLocaleString()} {t('currencySar')}</div>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-lg">
                    <div className="text-[10px] text-slate-400">{t('projectedRent')}</div>
                    <div className="text-xs font-bold text-emerald-400">{s.projectedMonthlyRentalSar.toLocaleString()} {t('currencySar')}</div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {language === 'ar' ? 'مدة التنفيذ:' : 'Duration:'} <strong className="text-white">{s.estimatedDurationWeeks} {t('weeks')}</strong>
                  </span>

                  {!s.isPreferred && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreferredScenario(s.id);
                      }}
                      className="px-3 py-1 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-all"
                    >
                      {t('selectAsPreferred')}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Add New Custom Scenario */}
      {showNewScenarioModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{language === 'ar' ? 'إنشاء سيناريو مخصص لإعادة التهيئة' : 'Create Custom Scenario'}</span>
            </h2>

            <form onSubmit={handleCreateCustomScenario} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  {language === 'ar' ? 'عنوان السيناريو (بالعربية) *' : 'Scenario Title (Arabic) *'}
                </label>
                <input
                  type="text"
                  required
                  value={customTitleAr}
                  onChange={(e) => setCustomTitleAr(e.target.value)}
                  placeholder="مثال: تحويل إلى 4 غرف أعمال ومكتب مشترك"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    {language === 'ar' ? 'عدد الوحدات الناتجة' : 'Resulting Units'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={customUnitsCount}
                    onChange={(e) => setCustomUnitsCount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    {language === 'ar' ? 'المدة التقديرية (أسابيع)' : 'Duration (Weeks)'}
                  </label>
                  <input
                    type="number"
                    value={customDuration}
                    onChange={(e) => setCustomDuration(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    {language === 'ar' ? 'التكلفة التقديرية (ر.س)' : 'Estimated Cost (SAR)'}
                  </label>
                  <input
                    type="number"
                    value={customCost}
                    onChange={(e) => setCustomCost(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    {language === 'ar' ? 'الإيجار الشهري المتوقع (ر.س)' : 'Projected Rent (SAR/mo)'}
                  </label>
                  <input
                    type="number"
                    value={customRent}
                    onChange={(e) => setCustomRent(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewScenarioModal(false)}
                  className="px-3.5 py-1.5 bg-slate-800 text-slate-300 rounded-lg"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg"
                >
                  {language === 'ar' ? 'توليد وحفظ السيناريو' : 'Save Scenario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
