import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { ConditionLevel, PriorityLevel, ConditionAssessmentItem } from '../../types';
import { 
  ClipboardCheck, 
  Plus, 
  AlertTriangle, 
  Camera, 
  Wrench, 
  CheckCircle2, 
  Filter, 
  X, 
  DollarSign, 
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react';

export const ConditionAssessment: React.FC = () => {
  const { language, t } = useLanguage();
  const { 
    selectedBuilding, 
    selectedFloor, 
    selectedUnit, 
    conditionItems, 
    addConditionItem,
    canEdit
  } = useApp();

  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('All');
  const [selectedCondition, setSelectedCondition] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New assessment form state
  const [spaceName, setSpaceName] = useState('');
  const [discipline, setDiscipline] = useState<ConditionAssessmentItem['discipline']>('Plumbing');
  const [systemName, setSystemName] = useState('');
  const [condition, setCondition] = useState<ConditionLevel>('FAIR');
  const [priority, setPriority] = useState<PriorityLevel>('MEDIUM');
  const [notes, setNotes] = useState('');
  const [estimatedAction, setEstimatedAction] = useState('');
  const [estimatedCost, setEstimatedCost] = useState<number>(5000);
  const [assessorName, setAssessorName] = useState('م. أحمد الشريف');

  const filteredItems = conditionItems.filter(item => {
    if (selectedDiscipline !== 'All' && item.discipline !== selectedDiscipline) return false;
    if (selectedCondition !== 'All' && item.condition !== selectedCondition) return false;
    return true;
  });

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!spaceName.trim() || !systemName.trim()) return;

    addConditionItem({
      id: `cond_${Date.now()}`,
      buildingId: selectedBuilding.id,
      floorId: selectedFloor.id,
      unitId: selectedUnit?.id,
      spaceName,
      discipline,
      systemName,
      condition,
      priority,
      notes,
      estimatedAction,
      estimatedCostSar: Number(estimatedCost),
      assessedBy: assessorName,
      assessedDate: new Date().toISOString().split('T')[0]
    });

    setShowAddModal(false);
    setSpaceName('');
    setSystemName('');
    setNotes('');
    setEstimatedAction('');
  };

  const disciplines: ConditionAssessmentItem['discipline'][] = [
    'Architecture', 
    'Structure', 
    'Electrical', 
    'Plumbing', 
    'HVAC', 
    'Fire Systems', 
    'Façade', 
    'Finishes', 
    'Elevators'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-amber-400" />
            <span>{language === 'ar' ? 'تقييم الحالة الفنية للمبنى القائم' : 'Building Technical Condition Assessment'}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'ar'
              ? 'فحص أنظمة المبنى (الإنشائية، المعمارية، السباكة، التكييف، الواجهات) وتحديد أولويات الصيانة والتكاليف'
              : 'Assess building systems across all disciplines, define priorities and estimate required rehabilitation actions'}
          </p>
        </div>

        {canEdit && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'ar' ? 'إضافة فحص جديد' : 'New Assessment'}</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-slate-400 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'ar' ? 'التخصص:' : 'Discipline:'}</span>
          </span>
          <button
            onClick={() => setSelectedDiscipline('All')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              selectedDiscipline === 'All' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            {language === 'ar' ? 'الكل' : 'All'}
          </button>
          {disciplines.map(d => (
            <button
              key={d}
              onClick={() => setSelectedDiscipline(d)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                selectedDiscipline === d ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Condition Filter */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400">{language === 'ar' ? 'الحالة:' : 'Condition:'}</span>
          <select
            value={selectedCondition}
            onChange={(e) => setSelectedCondition(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="All">{language === 'ar' ? 'جميع الحالات' : 'All Conditions'}</option>
            <option value="EXCELLENT">{t('EXCELLENT')}</option>
            <option value="GOOD">{t('GOOD')}</option>
            <option value="FAIR">{t('FAIR')}</option>
            <option value="POOR">{t('POOR')}</option>
            <option value="REPLACE">{t('REPLACE')}</option>
          </select>
        </div>
      </div>

      {/* Condition Records Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => {
          const isUrgent = item.priority === 'URGENT' || item.priority === 'HIGH';
          return (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border transition-all bg-slate-900 ${
                isUrgent ? 'border-amber-500/40 shadow-lg' : 'border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {item.discipline}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      item.priority === 'URGENT' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' :
                      item.priority === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {t(item.priority)}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mt-2">
                    {item.spaceName}
                  </h3>
                  <p className="text-xs text-amber-400/90 font-medium">
                    {item.systemName}
                  </p>
                </div>

                <div className={`px-2.5 py-1 rounded-lg text-xs font-bold text-center ${
                  item.condition === 'EXCELLENT' || item.condition === 'GOOD' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                  item.condition === 'FAIR' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                  'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}>
                  {t(item.condition)}
                </div>
              </div>

              {/* Notes */}
              <div className="mt-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                <span className="font-semibold text-slate-400 block mb-1">
                  {language === 'ar' ? 'الملاحظة الفنية:' : 'Inspection Notes:'}
                </span>
                {item.notes}
              </div>

              {/* Recommended Action */}
              <div className="mt-2.5 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-slate-200">
                <div className="flex items-center gap-1.5 font-bold text-amber-400 mb-1">
                  <Wrench className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'الإجراء المقترح للتأهيل:' : 'Recommended Action:'}</span>
                </div>
                {item.estimatedAction}
              </div>

              {/* Footer */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <div>
                  <span>{item.assessedBy}</span> • <span>{item.assessedDate}</span>
                </div>
                {item.estimatedCostSar !== undefined && item.estimatedCostSar > 0 && (
                  <div className="font-semibold text-amber-400 text-xs">
                    {item.estimatedCostSar.toLocaleString()} {t('currencySar')}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Add Assessment Record */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <ClipboardCheck className="w-4 h-4 text-amber-400" />
                <span>{language === 'ar' ? 'تسجيل فحص حالة فنية جديدة' : 'Add Technical Inspection Record'}</span>
              </h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="space-y-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  {language === 'ar' ? 'المكان / الفراغ المستهدف *' : 'Space / Location *'}
                </label>
                <input
                  type="text"
                  required
                  value={spaceName}
                  onChange={(e) => setSpaceName(e.target.value)}
                  placeholder="مثال: دورة مياه غرفة النوم الرئيسية - شقة 201"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    {language === 'ar' ? 'التخصص الهندسي' : 'Discipline'}
                  </label>
                  <select
                    value={discipline}
                    onChange={(e) => setDiscipline(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    {disciplines.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    {language === 'ar' ? 'النظام / العنصر المفحوص' : 'System / Element'}
                  </label>
                  <input
                    type="text"
                    required
                    value={systemName}
                    onChange={(e) => setSystemName(e.target.value)}
                    placeholder="مثال: شبكة التغذية وعزل الأرضيات"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    {language === 'ar' ? 'تقييم الحالة' : 'Condition Level'}
                  </label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as ConditionLevel)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="EXCELLENT">{t('EXCELLENT')}</option>
                    <option value="GOOD">{t('GOOD')}</option>
                    <option value="FAIR">{t('FAIR')}</option>
                    <option value="POOR">{t('POOR')}</option>
                    <option value="REPLACE">{t('REPLACE')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    {language === 'ar' ? 'أولوية الصيانة' : 'Maintenance Priority'}
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="URGENT">{t('URGENT')}</option>
                    <option value="HIGH">{t('HIGH')}</option>
                    <option value="MEDIUM">{t('MEDIUM')}</option>
                    <option value="LOW">{t('LOW')}</option>
                    <option value="COSMETIC">{t('COSMETIC')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  {language === 'ar' ? 'الملاحظات والعيوب المرصودة' : 'Observed Issues & Defects'}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="وصف المشكلة، الشروخ، التسريبات، أو التلف..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  {language === 'ar' ? 'الإجراء المقترح لمعالجة المشكلة' : 'Estimated Remedial Action'}
                </label>
                <textarea
                  rows={2}
                  value={estimatedAction}
                  onChange={(e) => setEstimatedAction(e.target.value)}
                  placeholder="الإجراء الهندسي المطلوب لتصحيح الوضع وتأهيل العنصر..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    {language === 'ar' ? 'التكلفة التقديرية (ر.س)' : 'Est. Cost (SAR)'}
                  </label>
                  <input
                    type="number"
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    {language === 'ar' ? 'اسم المهندس الفاحص' : 'Inspector Name'}
                  </label>
                  <input
                    type="text"
                    value={assessorName}
                    onChange={(e) => setAssessorName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-1.5 bg-slate-800 text-slate-300 rounded-lg"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg"
                >
                  {language === 'ar' ? 'حفظ الفحص' : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
