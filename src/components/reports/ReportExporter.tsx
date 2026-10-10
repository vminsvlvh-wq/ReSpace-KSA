import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { 
  FileText, 
  Printer, 
  Download, 
  X, 
  ShieldCheck, 
  Building2, 
  Table, 
  CheckCircle2,
  Calendar,
  Layers
} from 'lucide-react';

interface ReportExporterProps {
  onClose: () => void;
}

export const ReportExporter: React.FC<ReportExporterProps> = ({ onClose }) => {
  const { language, t } = useLanguage();
  const { 
    company, 
    selectedBuilding, 
    selectedFloor, 
    selectedUnit, 
    scenarios, 
    selectedScenario, 
    boqItems, 
    conditionItems,
    snags
  } = useApp();

  const [reportType, setReportType] = useState<'reconfig' | 'condition' | 'boq' | 'handover'>('reconfig');

  const handlePrint = () => {
    window.print();
  };

  const totalBOQ = boqItems.reduce((acc, c) => acc + c.totalSar, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[95vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header - No print */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between no-print bg-slate-900">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">
              {language === 'ar' ? 'تصدير التقارير الهندسية والمالية المعتمدة' : 'Export Official Project Reports'}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md shadow-amber-500/20"
            >
              <Printer className="w-4 h-4" />
              <span>{language === 'ar' ? 'طباعة / حفظ كملف PDF' : 'Print / Save as PDF'}</span>
            </button>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Report Type Selector - No print */}
        <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs no-print">
          <button
            onClick={() => setReportType('reconfig')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              reportType === 'reconfig' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            {language === 'ar' ? 'تقرير دراسة إعادة التهيئة والجدوى' : 'Reconfiguration Study'}
          </button>
          <button
            onClick={() => setReportType('boq')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              reportType === 'boq' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            {language === 'ar' ? 'جدول الكميات والميزانية (BOQ)' : 'Preliminary BOQ'}
          </button>
          <button
            onClick={() => setReportType('condition')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              reportType === 'condition' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            {language === 'ar' ? 'تقرير المعاينة والحالة الفنية' : 'Condition Survey'}
          </button>
        </div>

        {/* Printable Paper Document Container */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-950 text-slate-100 print:bg-white print:text-black">
          <div className="max-w-3xl mx-auto space-y-6 bg-slate-900/90 print:bg-white border border-slate-800 print:border-none p-8 rounded-2xl shadow-xl">
            {/* Report Official Header */}
            <div className="flex items-start justify-between border-b border-slate-700 print:border-black pb-4">
              <div>
                <div className="text-xl font-bold text-white print:text-black flex items-center gap-2">
                  <span className="w-8 h-8 rounded bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-sm print:border print:border-black">
                    R
                  </span>
                  <span>{language === 'ar' ? 'منصة ري سبيس KSA' : 'ReSpace KSA Platform'}</span>
                </div>
                <div className="text-xs text-slate-400 print:text-gray-600 mt-1">
                  {company.name} • {company.city}
                </div>
              </div>

              <div className="text-end text-xs text-slate-400 print:text-gray-600">
                <div className="font-semibold text-white print:text-black">
                  {language === 'ar' ? 'تاريخ التقرير:' : 'Date:'} {new Date().toISOString().split('T')[0]}
                </div>
                <div>{selectedBuilding.code}</div>
              </div>
            </div>

            {/* Document Title */}
            <div className="text-center py-2 space-y-1">
              <h1 className="text-xl font-extrabold text-white print:text-black">
                {reportType === 'reconfig' && (language === 'ar' ? 'تقرير الجدوى الهندسية وإعادة تهيئة الوحدات' : 'Reconfiguration & Feasibility Report')}
                {reportType === 'boq' && (language === 'ar' ? 'جدول الكميات الأولي التقديري (Preliminary BOQ)' : 'Preliminary Bill of Quantities')}
                {reportType === 'condition' && (language === 'ar' ? 'تقرير الفحص الفني للحالة القائمة' : 'Technical Building Condition Assessment')}
              </h1>
              <div className="text-xs text-amber-400 print:text-black font-semibold">
                {selectedBuilding.nameAr} - {selectedBuilding.address}، {selectedBuilding.city}
              </div>
            </div>

            {/* Content: Reconfiguration Report */}
            {reportType === 'reconfig' && (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-950 print:bg-gray-100 border border-slate-800 print:border-gray-300 space-y-2">
                  <h3 className="font-bold text-sm text-white print:text-black">
                    {language === 'ar' ? 'السيناريو المعتمد للتنفيذ' : 'Approved Reconfiguration Scenario'}
                  </h3>
                  <div className="text-slate-300 print:text-black">
                    <strong>({selectedScenario.code}) {selectedScenario.titleAr}</strong>
                    <p className="mt-1">{selectedScenario.descriptionAr}</p>
                  </div>
                </div>

                <table className="w-full text-start border-collapse border border-slate-800 print:border-gray-400">
                  <tbody>
                    <tr className="border-b border-slate-800 print:border-gray-300">
                      <td className="p-2.5 font-semibold text-slate-400 print:text-gray-700">{language === 'ar' ? 'عدد الوحدات الناتجة' : 'Resulting Units'}</td>
                      <td className="p-2.5 font-bold text-white print:text-black">{selectedScenario.resultingUnitsCount} {language === 'ar' ? 'وحدة' : 'units'}</td>
                    </tr>
                    <tr className="border-b border-slate-800 print:border-gray-300">
                      <td className="p-2.5 font-semibold text-slate-400 print:text-gray-700">{language === 'ar' ? 'مساحة الجدران المزالة' : 'Demolished Walls'}</td>
                      <td className="p-2.5 text-white print:text-black">{selectedScenario.demolishedWallsLengthM} م.ط</td>
                    </tr>
                    <tr className="border-b border-slate-800 print:border-gray-300">
                      <td className="p-2.5 font-semibold text-slate-400 print:text-gray-700">{language === 'ar' ? 'القواطع الجبسية الجديدة' : 'New Partitions'}</td>
                      <td className="p-2.5 text-white print:text-black">{selectedScenario.newWallsLengthM} م.ط</td>
                    </tr>
                    <tr className="border-b border-slate-800 print:border-gray-300">
                      <td className="p-2.5 font-semibold text-slate-400 print:text-gray-700">{language === 'ar' ? 'التكلفة الإجمالية التقديرية' : 'Est. Renovation Cost'}</td>
                      <td className="p-2.5 font-bold text-amber-400 print:text-black">{selectedScenario.estimatedCostSar.toLocaleString()} ر.س</td>
                    </tr>
                    <tr className="border-b border-slate-800 print:border-gray-300">
                      <td className="p-2.5 font-semibold text-slate-400 print:text-gray-700">{language === 'ar' ? 'الإيجار الشهري المتوقع' : 'Projected Rent'}</td>
                      <td className="p-2.5 font-bold text-emerald-400 print:text-black">{selectedScenario.projectedMonthlyRentalSar.toLocaleString()} ر.س/شهر</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold text-slate-400 print:text-gray-700">{language === 'ar' ? 'مدة التنفيذ المقدرة' : 'Duration'}</td>
                      <td className="p-2.5 text-white print:text-black">{selectedScenario.estimatedDurationWeeks} أسابيع</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Content: BOQ Report */}
            {reportType === 'boq' && (
              <div className="space-y-4 text-xs">
                <table className="w-full text-start border-collapse border border-slate-800 print:border-gray-400">
                  <thead>
                    <tr className="bg-slate-950 print:bg-gray-100 border-b border-slate-800 print:border-gray-400 font-bold">
                      <th className="p-2 text-start">{language === 'ar' ? 'البند' : 'Item'}</th>
                      <th className="p-2 text-start">{language === 'ar' ? 'الوصف' : 'Description'}</th>
                      <th className="p-2 text-center">{language === 'ar' ? 'الكمية' : 'Qty'}</th>
                      <th className="p-2 text-center">{language === 'ar' ? 'السعر' : 'Rate'}</th>
                      <th className="p-2 text-center">{language === 'ar' ? 'الإجمالي (ر.س)' : 'Total'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 print:divide-gray-300">
                    {boqItems.map(b => (
                      <tr key={b.id}>
                        <td className="p-2 font-mono">{b.itemNumber}</td>
                        <td className="p-2 font-medium">{language === 'ar' ? b.descriptionAr : b.description}</td>
                        <td className="p-2 text-center">{b.quantity} {b.unit}</td>
                        <td className="p-2 text-center">{b.unitRateSar}</td>
                        <td className="p-2 text-center font-bold">{b.totalSar.toLocaleString()}</td>
                      </tr>
                    ))}
                    <tr className="bg-slate-950 print:bg-gray-100 font-bold">
                      <td colSpan={4} className="p-3 text-end">{language === 'ar' ? 'الإجمالي المباشر:' : 'Direct Total:'}</td>
                      <td className="p-3 text-center text-amber-400 print:text-black font-mono">{totalBOQ.toLocaleString()} ر.س</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Content: Condition Assessment Report */}
            {reportType === 'condition' && (
              <div className="space-y-3 text-xs">
                {conditionItems.map(c => (
                  <div key={c.id} className="p-3 rounded-lg border border-slate-800 print:border-gray-300 space-y-1">
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-white print:text-black">{c.spaceName} - {c.systemName}</span>
                      <span className="text-amber-400 print:text-black">{t(c.condition)}</span>
                    </div>
                    <p className="text-slate-400 print:text-gray-700">{c.notes}</p>
                    <div className="text-[11px] text-emerald-400 print:text-gray-900 font-semibold">
                      {language === 'ar' ? 'الإجراء المقترح:' : 'Action:'} {c.estimatedAction}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Official Mandatory Disclaimer */}
            <div className="pt-4 border-t border-slate-800 print:border-gray-400 text-[10.5px] text-slate-400 print:text-gray-600 space-y-1 leading-relaxed">
              <strong className="block text-slate-300 print:text-black">
                {language === 'ar' ? 'إخلاء المسؤولية الهندسية والنظامية:' : 'Engineering & Regulatory Disclaimer:'}
              </strong>
              <p>
                {t('disclaimerStructural')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
