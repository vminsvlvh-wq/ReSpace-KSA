import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { SnagItem, PriorityLevel } from '../../types';
import { 
  AlertCircle, 
  Plus, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  Camera, 
  FileCheck2, 
  X, 
  ShieldCheck,
  Building2,
  Calendar
} from 'lucide-react';

export const SnagListModule: React.FC = () => {
  const { language, t } = useLanguage();
  const { 
    snags, 
    addSnag, 
    updateSnagStatus, 
    selectedBuilding, 
    selectedFloor, 
    selectedUnit,
    canEdit
  } = useApp();

  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showHandoverModal, setShowHandoverModal] = useState<boolean>(false);

  // New Snag state
  const [locationDetails, setLocationDetails] = useState('');
  const [category, setCategory] = useState<SnagItem['category']>('Finishes');
  const [descAr, setDescAr] = useState('');
  const [descEn, setDescEn] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('MEDIUM');
  const [assignedTo, setAssignedTo] = useState('مقاول أعمال الدهانات (مؤسسة الأفق)');
  const [dueDate, setDueDate] = useState('2026-10-10');

  const filteredSnags = snags.filter(s => {
    if (filterStatus !== 'All' && s.status !== filterStatus) return false;
    return true;
  });

  const openCount = snags.filter(s => s.status === 'Open').length;
  const inProgressCount = snags.filter(s => s.status === 'In Progress').length;
  const readyCount = snags.filter(s => s.status === 'Ready for Inspection').length;
  const closedCount = snags.filter(s => s.status === 'Closed').length;

  const handleCreateSnag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!descAr.trim() || !locationDetails.trim()) return;

    addSnag({
      id: `sng_${Date.now()}`,
      buildingId: selectedBuilding.id,
      floorId: selectedFloor.id,
      unitId: selectedUnit?.id,
      locationDetails,
      category,
      description: descEn || descAr,
      descriptionAr: descAr,
      priority,
      status: 'Open',
      assignedTo,
      assignedRole: 'CONTRACTOR',
      dueDate,
      createdAt: new Date().toISOString().split('T')[0]
    });

    setShowAddModal(false);
    setLocationDetails('');
    setDescAr('');
    setDescEn('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-400" />
              <span>{language === 'ar' ? 'سجل الملاحظات الفنية وضبط الجودة (Snag List)' : 'Snagging & Quality Control'}</span>
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 uppercase">
              Snagging
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'ar'
              ? 'متابعة الملاحظات والعيوب مع المقاولين وفرق التنفيذ حتى الاستلام النهائي (Handover)'
              : 'Track defects, corrective actions with contractors, and finalize project handover'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHandoverModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-all"
          >
            <FileCheck2 className="w-4 h-4 text-emerald-400" />
            <span>{language === 'ar' ? 'حزمة الاستلام (Handover Pack)' : 'Handover Pack'}</span>
          </button>

          {canEdit && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md shadow-amber-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'ar' ? 'تسجيل ملاحظة فنية' : 'New Snag'}</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Status Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setFilterStatus('Open')}
          className={`p-3.5 rounded-xl border text-start transition-all ${
            filterStatus === 'Open' ? 'bg-rose-500/15 border-rose-500 shadow-md' : 'bg-slate-900 border-slate-800 hover:bg-slate-850'
          }`}
        >
          <div className="text-[11px] text-slate-400">{language === 'ar' ? 'ملاحظات مفتوحة' : 'Open Snags'}</div>
          <div className="text-xl font-bold text-rose-400">{openCount}</div>
        </button>

        <button
          onClick={() => setFilterStatus('In Progress')}
          className={`p-3.5 rounded-xl border text-start transition-all ${
            filterStatus === 'In Progress' ? 'bg-amber-500/15 border-amber-500 shadow-md' : 'bg-slate-900 border-slate-800 hover:bg-slate-850'
          }`}
        >
          <div className="text-[11px] text-slate-400">{language === 'ar' ? 'قيد المعالجة' : 'In Progress'}</div>
          <div className="text-xl font-bold text-amber-400">{inProgressCount}</div>
        </button>

        <button
          onClick={() => setFilterStatus('Ready for Inspection')}
          className={`p-3.5 rounded-xl border text-start transition-all ${
            filterStatus === 'Ready for Inspection' ? 'bg-sky-500/15 border-sky-500 shadow-md' : 'bg-slate-900 border-slate-800 hover:bg-slate-850'
          }`}
        >
          <div className="text-[11px] text-slate-400">{language === 'ar' ? 'جاهزة للفحص' : 'Ready for Inspection'}</div>
          <div className="text-xl font-bold text-sky-400">{readyCount}</div>
        </button>

        <button
          onClick={() => setFilterStatus('Closed')}
          className={`p-3.5 rounded-xl border text-start transition-all ${
            filterStatus === 'Closed' ? 'bg-emerald-500/15 border-emerald-500 shadow-md' : 'bg-slate-900 border-slate-800 hover:bg-slate-850'
          }`}
        >
          <div className="text-[11px] text-slate-400">{language === 'ar' ? 'مغلقة ومستلمة' : 'Closed / Resolved'}</div>
          <div className="text-xl font-bold text-emerald-400">{closedCount}</div>
        </button>
      </div>

      {/* Snags List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-white flex items-center gap-2">
            <span>{language === 'ar' ? 'قائمة الملاحظات الفنية' : 'Defect Items'}</span>
            <span className="text-slate-400 font-normal">({filteredSnags.length})</span>
          </span>
          {filterStatus !== 'All' && (
            <button
              onClick={() => setFilterStatus('All')}
              className="text-xs text-amber-400 hover:underline"
            >
              {language === 'ar' ? 'إظهار الكل' : 'Clear Filter'}
            </button>
          )}
        </div>

        <div className="divide-y divide-slate-800/60 text-xs">
          {filteredSnags.map((snag) => (
            <div key={snag.id} className="p-4 hover:bg-slate-850/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
                    {snag.category}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    snag.priority === 'URGENT' ? 'bg-rose-500/20 text-rose-400' :
                    snag.priority === 'HIGH' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {t(snag.priority)}
                  </span>
                  <span className="text-slate-400 font-medium">{snag.locationDetails}</span>
                </div>

                <p className="text-white font-semibold text-sm">
                  {language === 'ar' ? snag.descriptionAr : snag.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                    <span>{snag.assignedTo}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{language === 'ar' ? 'تاريخ الإنجاز المطلوب:' : 'Due:'} {snag.dueDate}</span>
                  </span>
                </div>
              </div>

              {/* Status Selector */}
              <div className="flex items-center gap-2 self-start md:self-center">
                <select
                  value={snag.status}
                  onChange={(e) => updateSnagStatus(snag.id, e.target.value as any)}
                  className={`text-xs font-bold rounded-xl px-3 py-1.5 border focus:outline-none cursor-pointer ${
                    snag.status === 'Open' ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' :
                    snag.status === 'In Progress' ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' :
                    snag.status === 'Ready for Inspection' ? 'bg-sky-500/20 text-sky-400 border-sky-500/40' :
                    'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  }`}
                >
                  <option value="Open">Open (مفتوحة)</option>
                  <option value="In Progress">In Progress (قيد المعالجة)</option>
                  <option value="Ready for Inspection">Ready for Inspection (جاهزة للفحص)</option>
                  <option value="Closed">Closed (مغلقة ومستلمة)</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Add Snag */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl text-xs">
            <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>{language === 'ar' ? 'تسجيل ملاحظة فنية / عيب تشطيب' : 'Record Snag'}</span>
            </h2>

            <form onSubmit={handleCreateSnag} className="space-y-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  {language === 'ar' ? 'الموقع الدقيق للملاحظة *' : 'Exact Location *'}
                </label>
                <input
                  type="text"
                  required
                  value={locationDetails}
                  onChange={(e) => setLocationDetails(e.target.value)}
                  placeholder="مثال: شقة 201 - جدار الممر أمام الحمام"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

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
                    <option value="Paint">Paint (دهانات)</option>
                    <option value="Finishes">Finishes (تشطيبات وبورسلان)</option>
                    <option value="Plumbing">Plumbing (سباكة وأطقم)</option>
                    <option value="MEP">MEP (كهرباء وتكييف)</option>
                    <option value="Carpentry">Carpentry (نجارة وأبواب)</option>
                    <option value="Safety">Safety (سلامة ودفاع مدني)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    {language === 'ar' ? 'الأولوية' : 'Priority'}
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
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
                  {language === 'ar' ? 'وصف الملاحظة بالعربية *' : 'Description (Arabic) *'}
                </label>
                <textarea
                  rows={2}
                  required
                  value={descAr}
                  onChange={(e) => setDescAr(e.target.value)}
                  placeholder="وصف المشكلة المطلوب تصحيحها..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    {language === 'ar' ? 'المسؤول المكلف بالمعالجة' : 'Assigned To'}
                  </label>
                  <input
                    type="text"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    {language === 'ar' ? 'تاريخ الإنجاز المطلوب' : 'Due Date'}
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
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
                  {language === 'ar' ? 'حفظ الملاحظة' : 'Save Snag'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Handover Pack */}
      {showHandoverModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>{language === 'ar' ? 'حزمة الاستلام النهائي للمشروع (Handover Pack)' : 'Project Handover Pack'}</span>
              </h2>
              <button onClick={() => setShowHandoverModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-slate-300">
              <p className="leading-relaxed">
                {language === 'ar'
                  ? 'ملف التسليم الشامل لمالك العقار يوثق إغلاق الملاحظات والضمانات الرسمية المعتمدة:'
                  : 'Comprehensive project delivery pack documenting warranties, snag closures, and certifications:'}
              </p>

              <div className="space-y-2">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span>1. المخططات التنفيذية المنفذة على الطبيعة (As-Built Drawings)</span>
                  <span className="text-emerald-400 font-bold">معتمد ✓</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span>2. شهادة ضمان العزل المائي للأسطح ودورات المياه (10 سنوات)</span>
                  <span className="text-emerald-400 font-bold">معتمد ✓</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span>3. ضمان أجهزة التكييف الإنفرتر واللوحات الكهربائية</span>
                  <span className="text-emerald-400 font-bold">معتمد ✓</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span>4. محضر إغلاق قائمة الملاحظات (Snag List 100% Closure)</span>
                  <span className="text-emerald-400 font-bold">
                    {closedCount}/{snags.length} {language === 'ar' ? 'مغلق' : 'Closed'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowHandoverModal(false)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg"
              >
                {language === 'ar' ? 'إغلاق المعاينة' : 'Close Preview'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
