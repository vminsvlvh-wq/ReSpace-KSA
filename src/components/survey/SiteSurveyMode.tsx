import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { ConditionLevel, PriorityLevel } from '../../types';
import { 
  Smartphone, 
  Camera, 
  Mic, 
  MicOff, 
  Upload, 
  RefreshCw, 
  Check, 
  WifiOff, 
  Wifi, 
  Tag, 
  AlertCircle,
  Sparkles,
  MapPin,
  Clock
} from 'lucide-react';

export const SiteSurveyMode: React.FC = () => {
  const { language, t } = useLanguage();
  const { 
    selectedBuilding, 
    selectedFloor, 
    selectedUnit, 
    units, 
    offlineQueue, 
    addOfflineSurveyItem, 
    syncOfflineQueue, 
    pendingSyncCount 
  } = useApp();

  const [spaceTag, setSpaceTag] = useState<string>('صالة المعيشة - شقة 201');
  const [condition, setCondition] = useState<ConditionLevel>('FAIR');
  const [priority, setPriority] = useState<PriorityLevel>('MEDIUM');
  const [notes, setNotes] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [voiceTranscript, setVoiceTranscript] = useState<string>('');
  const [hasPhoto, setHasPhoto] = useState<boolean>(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [simulatedOffline, setSimulatedOffline] = useState<boolean>(true);

  const sampleTranscripts = [
    'تسريب طفيف في السباكة السفلية تحت المغسلة، يحتاج تغيير الليات ومحبس الزاوية.',
    'الأرضيات ممتازة بدون هبوط، القواطع الجبسية جاهزة للتثبيت الميكانيكي.',
    'وحدة التكييف بحاجة لتنظيف الفلاتر واختبار سحب الأمبير.',
    'شروخ سطحية غير إنشائية في دهانات ممر الغرف، تلزم معجنة وصنفرة.'
  ];

  const handleToggleVoice = () => {
    if (!isRecording) {
      setIsRecording(true);
      // Simulate real-time speech-to-text recognition
      setTimeout(() => {
        const randomTranscript = sampleTranscripts[Math.floor(Math.random() * sampleTranscripts.length)];
        setVoiceTranscript(randomTranscript);
        setNotes(prev => prev ? `${prev} - ${randomTranscript}` : randomTranscript);
        setIsRecording(false);
      }, 2000);
    } else {
      setIsRecording(false);
    }
  };

  const handleSimulatedPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setPhotoPreview(url);
      setHasPhoto(true);
    }
  };

  const handleSaveFieldRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!spaceTag.trim()) return;

    addOfflineSurveyItem({
      buildingId: selectedBuilding.id,
      floorId: selectedFloor.id,
      unitId: selectedUnit?.id,
      spaceTag,
      condition,
      priority,
      notes: notes || 'تمت المعاينة الميدانية بواسطة المهندس في الموقع',
      voiceNoteTranscript: voiceTranscript || undefined,
      hasPhoto,
      photoPreview: photoPreview || undefined
    });

    // Reset inputs for next room
    setNotes('');
    setVoiceTranscript('');
    setPhotoPreview(null);
    setHasPhoto(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Mobile Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-emerald-400" />
              <span>{t('siteSurveyTitle')}</span>
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold uppercase">
              PWA Offline
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            {t('siteSurveyDesc')}
          </p>
        </div>

        {/* Network & Sync Control */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSimulatedOffline(!simulatedOffline)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              simulatedOffline
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
            }`}
            title="تبديل حالة الاتصال لمحاكاة العمل داخل أقبية أو مبانٍ بدون شبكة"
          >
            {simulatedOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
            <span>{simulatedOffline ? (language === 'ar' ? 'وضع غير متصل (Offline)' : 'Offline Simulation') : (language === 'ar' ? 'متصل بالإنترنت' : 'Online')}</span>
          </button>

          {pendingSyncCount > 0 && (
            <button
              onClick={syncOfflineQueue}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-amber-500/20 animate-pulse transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{t('syncNow')} ({pendingSyncCount})</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Mobile Field Form: Fast capture (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <Tag className="w-4 h-4 text-amber-400" />
              <span>{language === 'ar' ? 'تسجيل ملاحظة ميدانية سريعة' : 'Quick Field Capture'}</span>
            </span>
            <span className="text-xs text-slate-400">
              {selectedBuilding.nameAr} • {selectedFloor.nameAr}
            </span>
          </div>

          <form onSubmit={handleSaveFieldRecord} className="space-y-4 text-xs">
            {/* Space / Room Tag */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                {language === 'ar' ? 'تحديد الغرفة أو الفراغ *' : 'Space / Room Tag *'}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={spaceTag}
                  onChange={(e) => setSpaceTag(e.target.value)}
                  placeholder="مثال: حمام الضيوف، المطبخ، ممر التوزيع..."
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Quick Rating Selector */}
            <div className="space-y-1.5">
              <label className="block text-slate-300 font-semibold">
                {language === 'ar' ? 'تقييم حالة العنصر' : 'Condition Rating'}
              </label>
              <div className="grid grid-cols-5 gap-1.5 text-center">
                {(['EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'REPLACE'] as ConditionLevel[]).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCondition(c)}
                    className={`py-2 px-1 rounded-xl text-[11px] font-bold transition-all border ${
                      condition === c
                        ? c === 'EXCELLENT' || c === 'GOOD'
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                          : c === 'FAIR'
                          ? 'bg-amber-500 text-slate-950 border-amber-400'
                          : 'bg-rose-500 text-white border-rose-400'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {t(c)}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority */}
            <div className="space-y-1.5">
              <label className="block text-slate-300 font-semibold">
                {language === 'ar' ? 'مستوى الأولوية' : 'Priority Level'}
              </label>
              <div className="grid grid-cols-5 gap-1.5 text-center">
                {(['URGENT', 'HIGH', 'MEDIUM', 'LOW', 'COSMETIC'] as PriorityLevel[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`py-1.5 px-1 rounded-xl text-[10.5px] font-semibold transition-all border ${
                      priority === p
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    {t(p)}
                  </button>
                ))}
              </div>
            </div>

            {/* Voice Note Speech to Text */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t('voiceNote')}</span>
                </span>
                <button
                  type="button"
                  onClick={handleToggleVoice}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold text-[11px] transition-all ${
                    isRecording
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  }`}
                >
                  {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  <span>{isRecording ? (language === 'ar' ? 'جارٍ الاستماع...' : 'Listening...') : (language === 'ar' ? 'بدء التسجيل الصوتي' : 'Record Speech')}</span>
                </button>
              </div>

              {voiceTranscript && (
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs italic">
                  "{voiceTranscript}"
                </div>
              )}
            </div>

            {/* Photo Attachment */}
            <div className="flex items-center gap-3">
              <label className="flex-1 flex items-center justify-center gap-2 p-3 bg-slate-950 border border-dashed border-slate-700 hover:border-amber-500 rounded-xl cursor-pointer text-slate-300 hover:text-white transition-all">
                <Camera className="w-4 h-4 text-amber-400" />
                <span>{hasPhoto ? (language === 'ar' ? 'تم التقاط الصورة ✓' : 'Photo Attached ✓') : t('capturePhoto')}</span>
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleSimulatedPhoto} />
              </label>

              {photoPreview && (
                <div className="w-12 h-12 rounded-lg overflow-hidden border border-amber-500/50 shrink-0">
                  <img src={photoPreview} alt="Field preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* Written Notes */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                {language === 'ar' ? 'الملاحظات الفنية للمهندس' : 'Field Notes'}
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="تفاصيل العيب أو متطلبات الترميم والسباكة..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 text-xs transition-all"
            >
              {language === 'ar' ? 'حفظ السجل في ذاكرة الجهاز (Offline Queue)' : 'Save Record (Offline Queue)'}
            </button>
          </form>
        </div>

        {/* Offline Queue Inspector (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>{language === 'ar' ? 'طابور المزامنة الميداني' : 'Field Sync Queue'}</span>
              </h3>
              <p className="text-xs text-slate-400">
                {offlineQueue.length} {language === 'ar' ? 'سجلات مسجلة بالجهاز' : 'records on device'}
              </p>
            </div>

            {pendingSyncCount > 0 && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40">
                {pendingSyncCount} {t('offlineSyncPending')}
              </span>
            )}
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pe-1">
            {offlineQueue.length > 0 ? (
              offlineQueue.map((item) => (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-xl border text-xs transition-all ${
                    item.isSynced
                      ? 'bg-slate-950/40 border-slate-800 text-slate-400'
                      : 'bg-slate-950 border-amber-500/40 text-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-white text-sm">{item.spaceTag}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {item.condition} • {item.priority}
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.isSynced
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-amber-500/20 text-amber-400 animate-pulse'
                    }`}>
                      {item.isSynced ? (language === 'ar' ? 'تمت المزامنة' : 'Synced') : t('offlineSyncPending')}
                    </span>
                  </div>

                  <p className="mt-2 text-slate-300 text-[11.5px] leading-relaxed">
                    {item.notes}
                  </p>

                  {item.hasPhoto && (
                    <div className="mt-2 text-[10px] text-amber-400 font-semibold flex items-center gap-1">
                      <Camera className="w-3 h-3" />
                      <span>{language === 'ar' ? 'مرفق صورة فوتوغرافية' : 'Photo Attached'}</span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-xs text-slate-500 space-y-2">
                <Smartphone className="w-8 h-8 text-slate-600 mx-auto" />
                <p>{language === 'ar' ? 'لا توجد سجلات مسح بانتظار المزامنة حالياً' : 'No pending offline survey records'}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
