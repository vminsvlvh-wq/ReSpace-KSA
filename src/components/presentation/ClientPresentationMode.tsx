import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { 
  Tv, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Sparkles, 
  SplitSquareVertical, 
  Building2,
  SlidersHorizontal,
  Layers,
  X
} from 'lucide-react';

interface ClientPresentationModeProps {
  onClose: () => void;
}

export const ClientPresentationMode: React.FC<ClientPresentationModeProps> = ({ onClose }) => {
  const { language, t } = useLanguage();
  const { selectedBuilding, selectedScenario, scenarios } = useApp();

  const [sliderPos, setSliderPos] = useState<number>(50); // 50% split for Before/After
  const [activeSlide, setActiveSlide] = useState<number>(0);

  const slides = [
    {
      id: 'overview',
      titleAr: 'نظرة عامة على المبنى والفرصة الاستثمارية',
      titleEn: 'Building Overview & Strategic Opportunity'
    },
    {
      id: 'transformation',
      titleAr: 'مقارنة الوضع القائم والحل المعماري المقترح (قبل / بعد)',
      titleEn: 'Before & After Architectural Transformation'
    },
    {
      id: 'scenarios',
      titleAr: 'خيارات إعادة التهيئة والجدوى المالية',
      titleEn: 'Reconfiguration Scenarios & Investment Return'
    },
    {
      id: 'roadmap',
      titleAr: 'خطة التنفيذ والميزانية والجدول الزمني',
      titleEn: 'Execution Roadmap & Budget'
    }
  ];

  const beforePhoto = 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80';
  const afterPhoto = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-slate-100 flex flex-col overflow-y-auto no-print">
      {/* Presentation Top Control Bar */}
      <div className="sticky top-0 z-10 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-bold text-sm">
            R
          </div>
          <div>
            <div className="font-bold text-sm text-white flex items-center gap-2">
              <span>{language === 'ar' ? 'عرض المستثمر والمالك - ري سبيس' : 'Executive Presentation - ReSpace'}</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40">
                Live
              </span>
            </div>
            <div className="text-xs text-slate-400">
              {language === 'ar' ? selectedBuilding.nameAr : selectedBuilding.name} ({selectedBuilding.city})
            </div>
          </div>
        </div>

        {/* Slide navigation indicators */}
        <div className="hidden md:flex items-center gap-2">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setActiveSlide(idx)}
              className={`h-2 rounded-full transition-all ${
                activeSlide === idx ? 'w-8 bg-amber-500' : 'w-2 bg-slate-700 hover:bg-slate-600'
              }`}
            />
          ))}
        </div>

        <button
          onClick={onClose}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold border border-slate-700 transition-all"
        >
          <X className="w-4 h-4" />
          <span>{language === 'ar' ? 'الخروج من وضع العرض' : 'Exit Presentation'}</span>
        </button>
      </div>

      {/* Slide Content Area */}
      <div className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-10 space-y-8">
        {/* Slide 0: Executive Overview */}
        {activeSlide === 0 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                {language === 'ar' ? 'دراسة تطوير العقار القائم' : 'Existing Asset Repositioning'}
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                {language === 'ar' ? selectedBuilding.nameAr : selectedBuilding.name}
              </h2>
              <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
                {selectedBuilding.notes}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="text-amber-400 font-bold text-xs flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  <span>{language === 'ar' ? 'تحدي الوضع القائم' : 'Current Challenge'}</span>
                </div>
                <h3 className="font-bold text-lg text-white">
                  {language === 'ar' ? 'مساحات كبيرة وضعف بالعائد الإيجاري' : 'Oversized Units & Low Yield'}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {language === 'ar'
                    ? 'شقق 3 غرف نوم بمساحة 210 م² إيجارها 5,500 ر.س شهرياً (314 ر.س/م² سنوياً). طلب السوق الحالي يتركز على الوحدات الصغيرة والمخدومة.'
                    : 'Large 210 m² 3BR units yielding only 5,500 SAR/mo. High vacancy due to changing market preferences.'}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="text-emerald-400 font-bold text-xs flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>{language === 'ar' ? 'الحل المعماري الذكي' : 'Proposed Solution'}</span>
                </div>
                <h3 className="font-bold text-lg text-white">
                  {language === 'ar' ? 'إعادة تقسيم ذكية مع مدخلين مستقلين' : 'Subdivision with Dual Entrances'}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {language === 'ar'
                    ? 'استغلال المداخل القائمة ومناور الصرف لتحويل الشقة الواحدة إلى وحدتين مستقلتين أو 3 استوديوهات فاخرة بدون المساس بأي عمود خرساني.'
                    : 'Convert single units into dual rentable suites utilizing existing plumbing stacks with zero structural risk.'}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/30 space-y-3">
                <div className="text-amber-400 font-bold text-xs flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>{language === 'ar' ? 'الجدوى المتوقعة' : 'Projected Upside'}</span>
                </div>
                <h3 className="font-bold text-2xl text-white">
                  +109% {language === 'ar' ? 'زيادة الإيجار' : 'Rent Upside'}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {language === 'ar'
                    ? 'ارتفاع الدخل الشهري من 5,500 إلى 11,500 ر.س شهرياً مع استرداد كامل تكلفة التجديد خلال 2.3 سنة.'
                    : 'Cash flow doubles from 5.5k to 11.5k SAR/mo with estimated capex recovery in ~2.3 years.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Slide 1: Interactive Before / After Split Slider */}
        {activeSlide === 1 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                {t('beforeAfter')}
              </span>
              <h2 className="text-2xl font-bold text-white">
                {language === 'ar' ? 'مقارنة بصرية تفاعلية: الوضع القائم مقابل التجديد المقترح' : 'Interactive Before vs After Visual Comparison'}
              </h2>
              <p className="text-xs text-slate-400">
                {language === 'ar' ? 'حرك المؤشر لمشاهدة التحول المعماري والتشطيبي' : 'Drag the slider to reveal the interior renovation transformation'}
              </p>
            </div>

            {/* Visual Slider Container */}
            <div className="relative w-full h-[450px] md:h-[500px] rounded-2xl overflow-hidden border border-slate-700 select-none shadow-2xl">
              {/* After Image (Background) */}
              <img
                src={afterPhoto}
                alt="Proposed Modern Renovation"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute top-4 end-4 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-500/40 text-emerald-400 font-bold text-xs">
                {language === 'ar' ? 'التصميم العصري المقترح (بعد)' : 'Proposed Concept (After)'}
              </div>

              {/* Before Image (Clipped Layer) */}
              <div 
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${sliderPos}%` }}
              >
                <img
                  src={beforePhoto}
                  alt="Existing Condition"
                  className="absolute inset-0 w-full h-full object-cover max-w-none"
                  style={{ width: '100%', height: '100%' }}
                />
                <div className="absolute top-4 start-4 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-500/40 text-amber-400 font-bold text-xs">
                  {language === 'ar' ? 'الوضع القائم الحالي (قبل)' : 'Existing Baseline (Before)'}
                </div>
              </div>

              {/* Vertical Divider Line & Draggable Handle */}
              <div 
                className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize flex items-center justify-center shadow-2xl"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="w-8 h-8 rounded-full bg-white text-slate-950 font-bold flex items-center justify-center text-xs shadow-xl ring-4 ring-slate-950/40">
                  ↔
                </div>
              </div>

              {/* Range Input for Smooth Control */}
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPos}
                onChange={(e) => setSliderPos(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
              />
            </div>
          </div>
        )}

        {/* Slide 2: Reconfiguration Scenarios Decision Matrix */}
        {activeSlide === 2 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                {language === 'ar' ? 'دراسة البدائل' : 'Strategic Alternatives'}
              </span>
              <h2 className="text-2xl font-bold text-white">
                {language === 'ar' ? 'مقارنة السيناريوهات الأربعة لاتخاذ القرار' : 'Evaluation of Reconfiguration Scenarios'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scenarios.map((s) => (
                <div
                  key={s.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    s.isPreferred
                      ? 'bg-slate-900 border-amber-500 shadow-xl ring-1 ring-amber-500/40'
                      : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="w-7 h-7 rounded-lg bg-slate-800 text-amber-400 font-bold flex items-center justify-center text-xs">
                      {s.code}
                    </span>
                    {s.isPreferred && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-slate-950">
                        {language === 'ar' ? 'الخيار الموصى به' : 'Recommended'}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-base text-white mt-2">
                    {language === 'ar' ? s.titleAr : s.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {language === 'ar' ? s.descriptionAr : s.description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800 text-center text-xs">
                    <div>
                      <div className="text-[10px] text-slate-400">{language === 'ar' ? 'الوحدات' : 'Units'}</div>
                      <div className="font-bold text-white text-sm">{s.resultingUnitsCount}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">{language === 'ar' ? 'التكلفة' : 'Cost'}</div>
                      <div className="font-bold text-amber-400">{s.estimatedCostSar.toLocaleString()} {t('currencySar')}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">{language === 'ar' ? 'الإيجار الشهري' : 'Rent/mo'}</div>
                      <div className="font-bold text-emerald-400">{s.projectedMonthlyRentalSar.toLocaleString()} {t('currencySar')}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Slide 3: Roadmap & Execution */}
        {activeSlide === 3 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                {language === 'ar' ? 'خارطة طريق التنفيذ' : 'Execution & Phasing'}
              </span>
              <h2 className="text-2xl font-bold text-white">
                {language === 'ar' ? 'خطة التنفيذ بدون توقف التدفقات النقدية' : 'Phased Execution with Minimal Downtime'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-amber-400 block">01. {language === 'ar' ? 'المرحلة الأولى' : 'Phase 1'}</span>
                <h4 className="font-bold text-sm text-white">{language === 'ar' ? 'تجهيز الشقة 201' : 'Unit 201 Demo'}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {language === 'ar' ? 'تنفيذ القواطع الجبسية، تمديد السباكة والكهرباء، والتشطيب الكامل خلال 8 أسابيع.' : 'Interior fitout and dual metering in 8 weeks.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-amber-400 block">02. {language === 'ar' ? 'المرحلة الثانية' : 'Phase 2'}</span>
                <h4 className="font-bold text-sm text-white">{language === 'ar' ? 'المناطق المشتركة' : 'Common Areas'}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {language === 'ar' ? 'تحديث إنارة الممرات والمصاعد والمداخل لإضفاء طابع فندقي عصري.' : 'Corridor tracks and elevator cab upgrade.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-amber-400 block">03. {language === 'ar' ? 'المرحلة الثالثة' : 'Phase 3'}</span>
                <h4 className="font-bold text-sm text-white">{language === 'ar' ? 'الوحدات المتبقية' : 'Remaining Units'}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {language === 'ar' ? 'تطبيق نفس النموذج على الأدوار المتكررة فور انتهاء عقود الإيجار القائمة.' : 'Replicate model across upper repeated floors.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-amber-400 block">04. {language === 'ar' ? 'المرحلة الرابعة' : 'Phase 4'}</span>
                <h4 className="font-bold text-sm text-white">{language === 'ar' ? 'الواجهة والمواقف' : 'Façade Touch'}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {language === 'ar' ? 'دهان خارجي جوتاشيلد وإضاءة واجهات معمارية ومظلات سيارات.' : 'Exterior paint and modern facade architectural LED.'}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-amber-500/20 text-xs text-slate-400 leading-relaxed">
              <strong className="text-amber-400 block mb-0.5">{language === 'ar' ? 'اعتماد كود البناء السعودي:' : 'SBC Compliance:'}</strong>
              {language === 'ar'
                ? 'جميع الحلول المقترحة تراعي معايير السلامة ومقاومة الحريق والدفاع المدني السعودي SBC-801 ولا تتطلب أي تدعيم للأعمدة أو القواعد الخرسانية القائمة.'
                : 'All proposals adhere to Saudi Building Code SBC fire safety standards without impacting structural stability.'}
            </div>
          </div>
        )}
      </div>

      {/* Presentation Bottom Navigation Controls */}
      <div className="sticky bottom-0 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => setActiveSlide(prev => Math.max(prev - 1, 0))}
          disabled={activeSlide === 0}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSlide === 0 ? 'opacity-40 cursor-not-allowed bg-slate-800 text-slate-500' : 'bg-slate-800 hover:bg-slate-700 text-white'
          }`}
        >
          {language === 'ar' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{language === 'ar' ? 'الشريحة السابقة' : 'Previous Slide'}</span>
        </button>

        <span className="text-xs text-slate-400 font-medium">
          {activeSlide + 1} / {slides.length}
        </span>

        <button
          onClick={() => setActiveSlide(prev => Math.min(prev + 1, slides.length - 1))}
          disabled={activeSlide === slides.length - 1}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSlide === slides.length - 1 ? 'opacity-40 cursor-not-allowed bg-slate-800 text-slate-500' : 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md shadow-amber-500/20'
          }`}
        >
          <span>{language === 'ar' ? 'الشريحة التالية' : 'Next Slide'}</span>
          {language === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
