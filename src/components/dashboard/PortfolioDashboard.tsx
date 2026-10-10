import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  Layers, 
  Home, 
  DollarSign, 
  AlertCircle, 
  CheckCircle2, 
  ArrowUpRight, 
  Wrench,
  Sparkles,
  TrendingUp,
  MapPin,
  Calendar,
  SplitSquareVertical
} from 'lucide-react';
import { ActiveTab } from '../layout/Sidebar';

interface PortfolioDashboardProps {
  onNavigateTab: (tab: ActiveTab) => void;
}

export const PortfolioDashboard: React.FC<PortfolioDashboardProps> = ({ onNavigateTab }) => {
  const { language, t } = useLanguage();
  const { 
    portfolio, 
    buildings, 
    selectedBuilding, 
    setSelectedBuilding,
    floors, 
    selectedFloor, 
    setSelectedFloor,
    units, 
    selectedUnit, 
    setSelectedUnit,
    boqItems,
    snags,
    scenarios
  } = useApp();

  // Metrics calculation
  const totalUnits = units.length;
  const vacantUnits = units.filter(u => u.occupancyStatus === 'Vacant').length;
  const occupiedUnits = units.filter(u => u.occupancyStatus === 'Occupied').length;
  const underRenovationUnits = units.filter(u => u.occupancyStatus === 'Under Renovation').length;
  
  const totalBOQEst = boqItems.reduce((acc, curr) => acc + curr.totalSar, 0);
  const openSnagsCount = snags.filter(s => s.status !== 'Closed').length;

  return (
    <div className="space-y-6">
      {/* Portfolio Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-slate-850 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
              {language === 'ar' ? 'المحفظة العقارية النشطة' : 'Active Real Estate Portfolio'}
            </span>
            <span className="text-xs text-slate-400">
              {portfolio.name}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {language === 'ar' ? selectedBuilding.nameAr : selectedBuilding.name}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              {selectedBuilding.address}, {selectedBuilding.city}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              {language === 'ar' ? 'سنة البناء:' : 'Year Built:'} {selectedBuilding.yearBuilt}
            </span>
            <span className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              {selectedBuilding.buildingType} ({selectedBuilding.numberOfFloors} {language === 'ar' ? 'أدوار' : 'Floors'})
            </span>
          </div>
        </div>

        {/* Quick Launch Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onNavigateTab('reconfiguration')}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 text-xs transition-all"
          >
            <SplitSquareVertical className="w-4 h-4" />
            <span>{language === 'ar' ? 'إعادة تهيئة وتقسيم الشقق' : 'Launch Reconfiguration'}</span>
          </button>
          <button
            onClick={() => onNavigateTab('site-survey')}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium rounded-xl text-xs transition-all"
          >
            <Wrench className="w-4 h-4 text-emerald-400" />
            <span>{language === 'ar' ? 'مسح ميداني PWA' : 'Field Survey Mode'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl shadow-sm space-y-1">
          <div className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
            <span>{language === 'ar' ? 'إجمالي المباني' : 'Buildings'}</span>
            <Building2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-white">{buildings.length}</div>
          <div className="text-[10.5px] text-slate-400">{selectedBuilding.city}</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl shadow-sm space-y-1">
          <div className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
            <span>{language === 'ar' ? 'إجمالي الوحدات' : 'Total Units'}</span>
            <Home className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-xl font-bold text-white">{totalUnits}</div>
          <div className="text-[10.5px] text-emerald-400">
            {occupiedUnits} {language === 'ar' ? 'مؤجرة حالياً' : 'Occupied'}
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl shadow-sm space-y-1">
          <div className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
            <span>{language === 'ar' ? 'الوحدات الشاغرة' : 'Vacant Units'}</span>
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          </div>
          <div className="text-xl font-bold text-amber-400">{vacantUnits}</div>
          <div className="text-[10.5px] text-amber-400/80">
            {language === 'ar' ? 'مرشحة لإعادة التقسيم' : 'Reconfig Targets'}
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl shadow-sm space-y-1">
          <div className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
            <span>{language === 'ar' ? 'مساحة البناء (BUA)' : 'Total BUA'}</span>
            <Layers className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-bold text-white">{selectedBuilding.totalBuiltUpArea}</div>
          <div className="text-[10.5px] text-slate-400">{t('metricM2')}</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl shadow-sm space-y-1">
          <div className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
            <span>{language === 'ar' ? 'ميزانية التجديد (BOQ)' : 'Renovation Budget'}</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400">
            {(totalBOQEst / 1000).toFixed(0)}k
          </div>
          <div className="text-[10.5px] text-slate-400">{t('currencySar')} (تقديري)</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl shadow-sm space-y-1">
          <div className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
            <span>{language === 'ar' ? 'ملاحظات الجودة' : 'Open Snags'}</span>
            <AlertCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-xl font-bold text-rose-400">{openSnagsCount}</div>
          <div className="text-[10.5px] text-slate-400">{language === 'ar' ? 'تحت المعالجة' : 'Pending action'}</div>
        </div>
      </div>

      {/* Digital Building View (Elevation Stack) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              {language === 'ar' ? 'المسقط الرأسي الرقمي للمبنى (Digital Building Elevation)' : 'Digital Building Elevation View'}
            </h2>
            <p className="text-xs text-slate-400">
              {language === 'ar' 
                ? 'استعراض أدوار ووحدات المبنى وحالتها الفنية مع إمكانية التحديد الفوري لإعادة التهيئة'
                : 'Interactive floor stack and unit cards with real-time condition & reconfiguration tags'}
            </p>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-emerald-500"></span>
              {language === 'ar' ? 'ممتازة / جيدة' : 'Good'}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-amber-500"></span>
              {language === 'ar' ? 'تتطلب تجديد' : 'Renovation Req.'}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-sky-500"></span>
              {language === 'ar' ? 'مرشحة للتقسيم' : 'Reconfig Candidate'}
            </span>
          </div>
        </div>

        {/* Floors Stack Top to Bottom */}
        <div className="space-y-3">
          {floors.map((floor) => {
            const isSelected = selectedFloor.id === floor.id;
            const floorUnits = units.filter(u => u.floorId === floor.id);

            return (
              <div 
                key={floor.id}
                onClick={() => setSelectedFloor(floor)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-850/90 border-amber-500/50 shadow-md ring-1 ring-amber-500/20'
                    : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-850/50 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  {/* Floor Label */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-amber-400 text-sm border border-slate-700">
                      F{floor.floorNumber}
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-slate-100 flex items-center gap-2">
                        <span>{language === 'ar' ? floor.nameAr : floor.name}</span>
                        {floor.repeatedOnFloors && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                            {language === 'ar' ? `مكرر للأدوار: ${floor.repeatedOnFloors.join(', ')}` : `Repeated: ${floor.repeatedOnFloors.join(', ')}`}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-3 mt-0.5">
                        <span>{floor.floorArea} {t('metricM2')}</span>
                        <span>•</span>
                        <span>{floorUnits.length} {t('units')}</span>
                        <span>•</span>
                        <span>{language === 'ar' ? 'الممرات والخدمات:' : 'Circulation:'} {floor.corridorArea + floor.commonArea} {t('metricM2')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Units Cards in this Floor */}
                  <div className="flex flex-wrap items-center gap-2">
                    {floorUnits.length > 0 ? (
                      floorUnits.map((u) => {
                        const isUnitSelected = selectedUnit?.id === u.id;
                        return (
                          <div
                            key={u.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFloor(floor);
                              setSelectedUnit(u);
                              onNavigateTab('reconfiguration');
                            }}
                            className={`px-3 py-2 rounded-lg text-xs border transition-all cursor-pointer ${
                              u.reconfigurationCandidate
                                ? 'bg-sky-950/40 border-sky-500/40 text-sky-200 hover:border-sky-400'
                                : u.condition === 'POOR' || u.condition === 'REPLACE'
                                ? 'bg-amber-950/40 border-amber-500/40 text-amber-200 hover:border-amber-400'
                                : 'bg-slate-900 border-slate-700 text-slate-200 hover:border-slate-600'
                            } ${isUnitSelected ? 'ring-2 ring-amber-400' : ''}`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <span className="font-bold text-white">
                                {language === 'ar' ? `شقة ${u.unitNumber}` : `Unit ${u.unitNumber}`}
                              </span>
                              <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                                u.occupancyStatus === 'Vacant' 
                                  ? 'bg-amber-500/20 text-amber-400' 
                                  : 'bg-emerald-500/20 text-emerald-400'
                              }`}>
                                {u.occupancyStatus === 'Vacant' ? (language === 'ar' ? 'شاغرة' : 'Vacant') : (language === 'ar' ? 'مؤجرة' : 'Occupied')}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
                              <span>{u.unitType}</span>
                              <span>•</span>
                              <span>{u.area} {t('metricM2')}</span>
                            </div>
                            {u.reconfigurationCandidate && (
                              <div className="mt-1.5 flex items-center gap-1 text-[10px] font-semibold text-sky-400">
                                <Sparkles className="w-3 h-3" />
                                <span>{language === 'ar' ? 'مرشح للتقسيم' : 'Reconfig Target'}</span>
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <span className="text-xs text-slate-400 italic">
                        {language === 'ar' ? 'مطابق لمخطط الدور الثاني المتكرر (3 وحدات)' : 'Identical to Floor 2 template'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Featured Strategic Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recommended Reconfiguration Opportunity */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-850 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30">
              {language === 'ar' ? 'فرصة إعادة التهيئة الأبرز' : 'Top Reconfiguration Pick'}
            </span>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              {language === 'ar' ? '+109% زيادة متوقعة بالإيجار' : '+109% Projected Rent Upside'}
            </span>
          </div>
          <h3 className="text-base font-bold text-white">
            {language === 'ar' ? 'تقسيم الشقة 201 (210 م²) إلى وحدتين مستقلتين' : 'Divide Unit 201 (210 m²) into 2 Independent Units'}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {language === 'ar'
              ? 'الشقة شاغرة حالياً وتتمتع بمدخلين مستقلين وموقع ملاصق لمناور الصرف الرئيسية. السيناريو (ب) يحولها إلى شقة غرفتين وصالة + شقة غرفة وصالة، ليرتفع الدخل من 5,500 إلى 11,500 ر.س شهرياً بدون المساس بالأعمدة الإنشائية.'
              : 'Unit is vacant with 2 separate entrances and adjacent MEP shafts. Scenario B converts it into a 2BR + 1BR apartment, raising monthly rent from 5,500 to 11,500 SAR with zero column alterations.'}
          </p>
          <div className="pt-2 flex items-center justify-between">
            <div className="text-xs text-slate-400">
              {language === 'ar' ? 'فترة استرداد التكلفة التقديرية:' : 'Est. Payback:'} <span className="font-bold text-amber-400">2.3 {language === 'ar' ? 'سنة' : 'Years'}</span>
            </div>
            <button
              onClick={() => onNavigateTab('reconfiguration')}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
            >
              <span>{language === 'ar' ? 'عرض دراسة السيناريو' : 'View Scenario Study'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Technical Health & SBC Compliance */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-850 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              {language === 'ar' ? 'تقرير السلامة الفنية' : 'Technical Condition Summary'}
            </span>
            <span className="text-xs text-slate-400">
              {language === 'ar' ? 'آخر فحص: 18 سبتمبر 2026' : 'Last Survey: Sep 18, 2026'}
            </span>
          </div>
          <h3 className="text-base font-bold text-white">
            {language === 'ar' ? 'سلامة الهيكل الإنشائي والحاجة لتحديث السباكة' : 'Structural Soundness & Plumbing Modernization'}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {language === 'ar'
              ? 'الأعمدة والجسور الخرسانية بحالة ممتازة وخالية تماماً من الشروخ. تم رصد حاجة لتجديد عوازل دورات المياه القديمة وشبكة الصرف قبل تطبيق أي تشطيبات جديدة.'
              : 'Columns and beams are in excellent condition. Waterproofing in older bathrooms and branch drainage lines need renewal prior to laying new porcelain tiling.'}
          </p>
          <div className="pt-2 flex items-center justify-between">
            <div className="text-xs text-slate-400">
              {language === 'ar' ? 'حالة المبنى العامة:' : 'Overall Condition:'} <span className="font-bold text-amber-400">{t(selectedBuilding.overallCondition)}</span>
            </div>
            <button
              onClick={() => onNavigateTab('condition')}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
            >
              <span>{language === 'ar' ? 'استعراض سجل الفحص' : 'Open Inspection Log'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
