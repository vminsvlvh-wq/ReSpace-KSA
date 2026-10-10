import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { BOQItem, FinishPackage } from '../../types';
import { 
  Calculator, 
  Plus, 
  Trash2, 
  Edit3, 
  Layers, 
  DollarSign, 
  Percent, 
  ShieldAlert, 
  Check, 
  Package, 
  Download,
  Calendar,
  Sparkles
} from 'lucide-react';

export const BOQModule: React.FC = () => {
  const { language, t } = useLanguage();
  const { 
    boqItems, 
    updateBOQItem, 
    addBOQItem, 
    deleteBOQItem, 
    finishPackage, 
    setFinishPackage,
    selectedScenario,
    canEdit
  } = useApp();

  const [activeTab, setActiveTab] = useState<'boq' | 'phases'>('boq');
  const [showAddItemModal, setShowAddItemModal] = useState<boolean>(false);

  // New BOQ Item state
  const [category, setCategory] = useState<BOQItem['category']>('Flooring');
  const [itemCode, setItemCode] = useState('');
  const [descAr, setDescAr] = useState('');
  const [descEn, setDescEn] = useState('');
  const [unit, setUnit] = useState<BOQItem['unit']>('m²');
  const [quantity, setQuantity] = useState<number>(100);
  const [rate, setRate] = useState<number>(120);
  const [notes, setNotes] = useState('');

  // Cost calculations
  const baseSubtotal = boqItems.reduce((acc, curr) => acc + curr.totalSar, 0);
  const mepItemsTotal = boqItems
    .filter(i => i.category === 'Electrical & Lighting' || i.category === 'HVAC' || i.category === 'Plumbing & Drainage' || i.category === 'Bathrooms & Sanitary')
    .reduce((acc, curr) => acc + curr.totalSar, 0);
  const archItemsTotal = baseSubtotal - mepItemsTotal;
  
  const contingencyPct = 0.10; // 10%
  const contingencySar = Math.round(baseSubtotal * contingencyPct);
  
  const feesPct = 0.07; // 7%
  const feesSar = Math.round(baseSubtotal * feesPct);

  const subtotalBeforeVat = baseSubtotal + contingencySar + feesSar;
  const vatPct = 0.15; // 15% Saudi VAT
  const vatSar = Math.round(subtotalBeforeVat * vatPct);

  const grandTotalSar = subtotalBeforeVat + vatSar;

  const handleCreateBOQItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!descAr.trim()) return;

    addBOQItem({
      id: `boq_${Date.now()}`,
      category,
      itemNumber: itemCode || `ITM-${boqItems.length + 1}`,
      description: descEn || descAr,
      descriptionAr: descAr,
      unit,
      quantity: Number(quantity),
      unitRateSar: Number(rate),
      totalSar: Number((Number(quantity) * Number(rate)).toFixed(2)),
      notes
    });

    setShowAddItemModal(false);
    setDescAr('');
    setDescEn('');
    setItemCode('');
  };

  const finishPackages: { id: FinishPackage; label: { ar: string; en: string }; mult: string; desc: { ar: string; en: string } }[] = [
    { id: 'Economic', label: { ar: 'اقتصادي (Economic)', en: 'Economic' }, mult: '0.75x', desc: { ar: 'سيراميك وطني، دهانات تجارية، تكييف سبليت قياسي', en: 'Standard local tiles & paints' } },
    { id: 'Standard', label: { ar: 'معياري (Standard)', en: 'Standard' }, mult: '1.0x', desc: { ar: 'بورسلان فرز أول، دهانات جوتن فينوماستيك، أطقم صحية جروهي', en: 'First-grade porcelain, Jotun, Grohe' } },
    { id: 'Premium', label: { ar: 'فاخر (Premium)', en: 'Premium' }, mult: '1.35x', desc: { ar: 'بورسلان إسباني، إضاءة مغناطيسية ذكية، مطابخ كوارتز', en: 'Spanish tiles, magnetic tracks, quartz' } },
    { id: 'Luxury', label: { ar: 'فندقي فاخر (Luxury)', en: 'Luxury' }, mult: '1.85x', desc: { ar: 'رخام طبيعي، تحكم ذكي KNX، مرايا شاشات، تجهيز فندقي كامل', en: 'Natural marble, KNX smart home, 5-star' } }
  ];

  const phases = [
    { 
      number: 1, 
      nameAr: 'المرحلة 1: الوحدات الشاغرة (الشقة 201 و 202)', 
      nameEn: 'Phase 1: Vacant Units (201 & 202)',
      scopeAr: 'الهدم، القواطع الجبسية الجديدة، تجديد السباكة والكهرباء، والتشطيبات الداخلية',
      costSar: Math.round(grandTotalSar * 0.45),
      duration: '8 أسابيع'
    },
    { 
      number: 2, 
      nameAr: 'المرحلة 2: الممرات والمناطق المشتركة والمصاعد', 
      nameEn: 'Phase 2: Common Corridors & Lobbies',
      scopeAr: 'تحديث إنارة الممرات، دهانات مقاومة للاحتكاك، تجديد كابينة المصعد',
      costSar: Math.round(grandTotalSar * 0.20),
      duration: '4 أسابيع'
    },
    { 
      number: 3, 
      nameAr: 'المرحلة 3: الوحدات المتبقية بعد انتهاء عقود الإيجار', 
      nameEn: 'Phase 3: Remaining Units Upon Lease Expiry',
      scopeAr: 'تطبيق نفس السيناريو المعتمد بالتتابع دون التأثير على باقي سكان العمارة',
      costSar: Math.round(grandTotalSar * 0.25),
      duration: '6 أسابيع'
    },
    { 
      number: 4, 
      nameAr: 'المرحلة 4: الواجهة الخارجية والمواقف', 
      nameEn: 'Phase 4: Exterior Façade & Parking',
      scopeAr: 'غسيل الحجر، دهانات الواجهة، الإضاءة المعمارية الخارجية، ومظلات المواقف',
      costSar: Math.round(grandTotalSar * 0.10),
      duration: '3 أسابيع'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-amber-400" />
              <span>{language === 'ar' ? 'جدول الكميات الأولي والميزانية التقديرية' : 'Preliminary BOQ & Budget Breakdown'}</span>
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 uppercase">
              Preliminary BOQ
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'ar'
              ? `مرتبط بالسيناريو المعتمد: (${selectedScenario.code}) ${selectedScenario.titleAr} - قابل للتعديل الفوري للكميات والأسعار`
              : `Linked to Preferred Scenario: (${selectedScenario.code}) ${selectedScenario.title} - Fully editable quantities and rates`}
          </p>
        </div>

        {/* Tab & Add Control */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setActiveTab('boq')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'boq' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              {language === 'ar' ? 'جدول الكميات (BOQ)' : 'BOQ Items'}
            </button>
            <button
              onClick={() => setActiveTab('phases')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'phases' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              {language === 'ar' ? 'مراحل التنفيذ (Phasing)' : 'Phased Plan'}
            </button>
          </div>

          {canEdit && (
            <button
              onClick={() => setShowAddItemModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md shadow-amber-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'ar' ? 'إضافة بند' : 'Add Item'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Finish Package Tier Selector */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white flex items-center gap-2">
            <Package className="w-4 h-4 text-amber-400" />
            <span>{language === 'ar' ? 'مستوى باقة التشطيب والمواد (Finish Package Tier)' : 'Select Finish Package Tier'}</span>
          </span>
          <span className="text-[11px] text-slate-400">
            {language === 'ar' ? 'تعديل الباقة يعيد حساب أسعار المواد آلياً' : 'Package switch recalibrates unit rates automatically'}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {finishPackages.map((pkg) => {
            const isSelected = finishPackage === pkg.id;
            return (
              <div
                key={pkg.id}
                onClick={() => setFinishPackage(pkg.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500 shadow-md ring-1 ring-amber-500/30'
                    : 'bg-slate-950/60 border-slate-800 hover:bg-slate-850'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-bold text-xs ${isSelected ? 'text-amber-400' : 'text-slate-200'}`}>
                    {pkg.label[language]}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                    {pkg.mult}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  {pkg.desc[language]}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {activeTab === 'boq' && (
        <div className="space-y-6">
          {/* BOQ Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start">
                <thead>
                  <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-semibold">
                    <th className="p-3.5 text-start">{language === 'ar' ? 'البند' : 'Item'}</th>
                    <th className="p-3.5 text-start">{language === 'ar' ? 'التصنيف' : 'Category'}</th>
                    <th className="p-3.5 text-start w-2/5">{language === 'ar' ? 'الوصف المعماري والفني' : 'Technical Description'}</th>
                    <th className="p-3.5 text-center">{language === 'ar' ? 'الوحدة' : 'Unit'}</th>
                    <th className="p-3.5 text-center">{language === 'ar' ? 'الكمية' : 'Qty'}</th>
                    <th className="p-3.5 text-center">{language === 'ar' ? 'سعر الوحدة (ر.س)' : 'Rate (SAR)'}</th>
                    <th className="p-3.5 text-center">{language === 'ar' ? 'الإجمالي (ر.س)' : 'Total (SAR)'}</th>
                    {canEdit && <th className="p-3.5 text-center">{language === 'ar' ? 'إجراء' : 'Actions'}</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {boqItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-850/40 transition-colors">
                      <td className="p-3.5 font-mono text-[11px] text-amber-400 font-bold">{item.itemNumber}</td>
                      <td className="p-3.5">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {item.category}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-200">
                        <div className="font-semibold text-white">
                          {language === 'ar' ? item.descriptionAr : item.description}
                        </div>
                        {item.notes && (
                          <div className="text-[10.5px] text-slate-400 mt-0.5">
                            {item.notes}
                          </div>
                        )}
                      </td>
                      <td className="p-3.5 text-center font-mono text-slate-300">{item.unit}</td>
                      <td className="p-3.5 text-center">
                        {canEdit ? (
                          <input
                            type="number"
                            min="0"
                            value={item.quantity}
                            onChange={(e) => updateBOQItem(item.id, { quantity: Number(e.target.value) })}
                            className="w-16 bg-slate-950 border border-slate-700 rounded px-1.5 py-1 text-center text-white focus:outline-none focus:border-amber-500 font-mono"
                          />
                        ) : (
                          <span className="font-mono text-white">{item.quantity}</span>
                        )}
                      </td>
                      <td className="p-3.5 text-center">
                        {canEdit ? (
                          <input
                            type="number"
                            min="0"
                            value={item.unitRateSar}
                            onChange={(e) => updateBOQItem(item.id, { unitRateSar: Number(e.target.value) })}
                            className="w-20 bg-slate-950 border border-slate-700 rounded px-1.5 py-1 text-center text-amber-400 font-bold focus:outline-none focus:border-amber-500 font-mono"
                          />
                        ) : (
                          <span className="font-mono text-amber-400 font-bold">{item.unitRateSar}</span>
                        )}
                      </td>
                      <td className="p-3.5 text-center font-bold text-white font-mono">
                        {item.totalSar.toLocaleString()}
                      </td>
                      {canEdit && (
                        <td className="p-3.5 text-center">
                          <button
                            onClick={() => deleteBOQItem(item.id)}
                            className="p-1 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded transition-all"
                            title="حذف البند"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Budget Breakdown & Financial Contingency Box */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>{language === 'ar' ? 'افتراضات الميزانية واشتراطات التعاقد' : 'Budget Assumptions & Contract Rules'}</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {language === 'ar'
                  ? 'هذا الجدول يمثل تقديراً مبدئياً (Preliminary BOQ) مبنياً على أسعار السوق في مدينة الرياض وجدة لعام 2026. يشمل بنود الهدم الآمن، توريد القواطع الجبسية العازلة للصوت، البورسلان الإسباني، وتحديث شبكات التغذية والصرف والتكييف. لا يعتبر هذا الجدول مستند مناقصة نهائي حتى يتم تدقيقه مع المخططات التنفيذية.'
                  : 'This schedule represents a preliminary estimate based on Riyadh & Jeddah market rates for 2026. Not for final tender until construction drawings are stamped.'}
              </p>
              <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-400">
                <span>• {language === 'ar' ? 'نسبة الطوارئ الإنشائية (Contingency):' : 'Contingency:'} 10%</span>
                <span>• {language === 'ar' ? 'أتعاب الإشراف الهندسي وإدارة المشروع:' : 'Supervision Fees:'} 7%</span>
                <span>• {language === 'ar' ? 'ضريبة القيمة المضافة السعودية (VAT):' : 'KSA VAT:'} 15%</span>
              </div>
            </div>

            {/* Financial Summary Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-850 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
              <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
                {language === 'ar' ? 'ملخص التكلفة الإجمالية التقديرية' : 'Total Renovation Budget Summary'}
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span>{language === 'ar' ? 'تكلفة الأعمال المعمارية والتشطيبات:' : 'Architectural & Finishes:'}</span>
                  <span className="font-mono">{archItemsTotal.toLocaleString()} {t('currencySar')}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>{language === 'ar' ? 'تكلفة الكهروميكانيك والسباكة والتكييف:' : 'MEP & HVAC Overhaul:'}</span>
                  <span className="font-mono">{mepItemsTotal.toLocaleString()} {t('currencySar')}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300 pt-1 border-t border-slate-800">
                  <span>{language === 'ar' ? 'إجمالي الأعمال المباشرة (Subtotal):' : 'Direct Works Subtotal:'}</span>
                  <span className="font-mono font-semibold">{baseSubtotal.toLocaleString()} {t('currencySar')}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>{language === 'ar' ? 'مخصص الطوارئ (10% Contingency):' : 'Contingency (10%):'}</span>
                  <span className="font-mono">+{contingencySar.toLocaleString()} {t('currencySar')}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>{language === 'ar' ? 'أتعاب هندسية وإشراف (7% PM Fees):' : 'Engineering & PM Fees (7%):'}</span>
                  <span className="font-mono">+{feesSar.toLocaleString()} {t('currencySar')}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>{language === 'ar' ? 'ضريبة القيمة المضافة (15% VAT):' : 'KSA VAT (15%):'}</span>
                  <span className="font-mono">+{vatSar.toLocaleString()} {t('currencySar')}</span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-700 text-sm font-bold text-white">
                  <span>{language === 'ar' ? 'إجمالي الميزانية التقديرية الشاملة:' : 'Grand Total Estimated Cost:'}</span>
                  <span className="text-amber-400 font-mono text-base">{grandTotalSar.toLocaleString()} {t('currencySar')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Phased Execution Plan */}
      {activeTab === 'phases' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
            {language === 'ar'
              ? 'تتيح خطة التنفيذ المرحلي تجديد وتأهيل المبنى دون الحاجة لإخلائه بالكامل، والبدء بالوحدات الشاغرة لتحقيق إيرادات تمول المراحل اللاحقة.'
              : 'Phased execution allows renovation while the building remains partially occupied, starting with vacant units to generate revenue.'}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {phases.map((ph) => (
              <div key={ph.number} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-sm">
                    {ph.number}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{ph.duration}</span>
                  </span>
                </div>

                <h3 className="font-bold text-base text-white">
                  {language === 'ar' ? ph.nameAr : ph.nameEn}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {ph.scopeAr}
                </p>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">{language === 'ar' ? 'التكلفة التقديرية للمرحلة:' : 'Est. Phase Cost:'}</span>
                  <span className="font-bold text-amber-400 font-mono">{ph.costSar.toLocaleString()} {t('currencySar')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Add BOQ Item */}
      {showAddItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl text-xs">
            <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Plus className="w-4 h-4 text-amber-400" />
              <span>{language === 'ar' ? 'إضافة بند جديد لجدول الكميات' : 'Add BOQ Item'}</span>
            </h2>

            <form onSubmit={handleCreateBOQItem} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    {language === 'ar' ? 'التصنيف' : 'Category'}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Demolition">Demolition (هدم)</option>
                    <option value="Drywall">Drywall (جبس وقواطع)</option>
                    <option value="Flooring">Flooring (أرضيات)</option>
                    <option value="Painting">Painting (دهانات)</option>
                    <option value="Bathrooms & Sanitary">Bathrooms (حمامات وسباكة)</option>
                    <option value="Joinery & Kitchen">Kitchen (مطابخ وخزائن)</option>
                    <option value="Electrical & Lighting">Electrical (كهرباء وإنارة)</option>
                    <option value="HVAC">HVAC (تكييف)</option>
                    <option value="Doors & Windows">Doors & Windows (أبواب ونوافذ)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    {language === 'ar' ? 'رمز البند' : 'Item Code'}
                  </label>
                  <input
                    type="text"
                    value={itemCode}
                    onChange={(e) => setItemCode(e.target.value)}
                    placeholder="مثال: FLR-02"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  {language === 'ar' ? 'الوصف بالعربية *' : 'Description (Arabic) *'}
                </label>
                <textarea
                  rows={2}
                  required
                  value={descAr}
                  onChange={(e) => setDescAr(e.target.value)}
                  placeholder="وصف المواصفات الفنية والمواد والمصنعية..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    {language === 'ar' ? 'الوحدة' : 'Unit'}
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="m²">m² (متر مربع)</option>
                    <option value="m">m (متر طولي)</option>
                    <option value="item">item (حبة/وحدة)</option>
                    <option value="set">set (طقم كامل)</option>
                    <option value="lump sum">lump sum (مقطوعية)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    {language === 'ar' ? 'الكمية' : 'Quantity'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    {language === 'ar' ? 'سعر الوحدة (ر.س)' : 'Rate (SAR)'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={rate}
                    onChange={(e) => setRate(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddItemModal(false)}
                  className="px-3.5 py-1.5 bg-slate-800 text-slate-300 rounded-lg"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg"
                >
                  {language === 'ar' ? 'إضافة البند' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
