import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { BuildingType, ConditionLevel, OccupancyStatus, UnitType, Building } from '../../types';
import { 
  Building2, 
  Plus, 
  Copy, 
  Home, 
  MapPin, 
  Layers, 
  Check, 
  X, 
  DollarSign,
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';

export const BuildingManager: React.FC = () => {
  const { language, t } = useLanguage();
  const { 
    buildings, 
    selectedBuilding, 
    setSelectedBuilding,
    floors, 
    selectedFloor, 
    setSelectedFloor,
    units, 
    selectedUnit, 
    setSelectedUnit,
    addBuilding,
    duplicateFloorLayout,
    canEdit
  } = useApp();

  const [showAddBuildingModal, setShowAddBuildingModal] = useState(false);
  const [showDuplicateFloorModal, setShowDuplicateFloorModal] = useState(false);
  const [duplicateTargetFloors, setDuplicateTargetFloors] = useState<string>('3, 4, 5');

  // New building form state
  const [newBldNameAr, setNewBldNameAr] = useState('');
  const [newBldNameEn, setNewBldNameEn] = useState('');
  const [newBldCode, setNewBldCode] = useState('');
  const [newBldCity, setNewBldCity] = useState('الرياض');
  const [newBldDistrict, setNewBldDistrict] = useState('');
  const [newBldAddress, setNewBldAddress] = useState('');
  const [newBldYear, setNewBldYear] = useState<number>(2015);
  const [newBldType, setNewBldType] = useState<BuildingType>('Residential');
  const [newBldFloors, setNewBldFloors] = useState<number>(4);
  const [newBldArea, setNewBldArea] = useState<number>(2400);
  const [newBldUnits, setNewBldUnits] = useState<number>(12);
  const [newBldCondition, setNewBldCondition] = useState<ConditionLevel>('FAIR');
  const [newBldNotes, setNewBldNotes] = useState('');

  const handleCreateBuilding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBldNameAr.trim()) return;

    addBuilding({
      name: newBldNameEn || newBldNameAr,
      nameAr: newBldNameAr,
      code: newBldCode || `BLD-${Date.now().toString().slice(-4)}`,
      address: newBldAddress || 'المملكة العربية السعودية',
      city: newBldCity,
      district: newBldDistrict || 'المركزي',
      country: 'المملكة العربية السعودية',
      yearBuilt: Number(newBldYear) || 2015,
      buildingType: newBldType,
      numberOfFloors: Number(newBldFloors) || 4,
      basements: 1,
      parkingFloors: 1,
      totalUnits: Number(newBldUnits) || 12,
      totalBuiltUpArea: Number(newBldArea) || 2400,
      landArea: Math.round(Number(newBldArea) / 3),
      parkingSpaces: Number(newBldUnits) * 1.2,
      numberOfElevators: 2,
      occupancyStatus: 'Partially Occupied',
      currentUse: 'مبنى قائم مستهدف بالتقييم والتطوير',
      overallCondition: newBldCondition,
      notes: newBldNotes || 'تمت إضافة المبنى لغرض دراسة إعادة التهيئة وتجديد الوحدات.',
      images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80'],
      floorsCount: Number(newBldFloors) || 4
    });

    setShowAddBuildingModal(false);
    // Reset
    setNewBldNameAr('');
    setNewBldNameEn('');
  };

  const handleDuplicateFloors = () => {
    const parsed = duplicateTargetFloors
      .split(',')
      .map(s => parseInt(s.trim(), 10))
      .filter(n => !isNaN(n) && n > 0);

    if (parsed.length > 0) {
      duplicateFloorLayout(selectedFloor.id, parsed);
      setShowDuplicateFloorModal(false);
    }
  };

  const buildingUnits = units.filter(u => u.buildingId === selectedBuilding.id);

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-400" />
            <span>{language === 'ar' ? 'إدارة المباني والأدوار والوحدات' : 'Buildings, Floors & Units Management'}</span>
          </h1>
          <p className="text-xs text-slate-400">
            {language === 'ar'
              ? 'هيكلة المبنى العقاري القائم وتحديد الوحدات المستهدفة بإعادة التقسيم والتأهيل'
              : 'Structure existing building hierarchy and designate units for reconfiguration & renovation'}
          </p>
        </div>

        {canEdit && (
          <button
            onClick={() => setShowAddBuildingModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>{t('addNewBuilding')}</span>
          </button>
        )}
      </div>

      {/* Buildings Cards Carousel / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {buildings.map((b) => {
          const isSelected = selectedBuilding.id === b.id;
          return (
            <div
              key={b.id}
              onClick={() => setSelectedBuilding(b)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'bg-slate-900 border-amber-500 shadow-xl ring-1 ring-amber-500/30'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 end-0 bg-amber-500 text-slate-950 text-[10px] font-bold px-3 py-0.5 rounded-es-lg">
                  {language === 'ar' ? 'المبنى النشط' : 'Active'}
                </div>
              )}

              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
                    {b.code}
                  </span>
                  <h3 className="font-bold text-base text-white mt-2">
                    {language === 'ar' ? b.nameAr : b.name}
                  </h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>{b.district}، {b.city}</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800 text-center">
                <div className="bg-slate-950/60 p-2 rounded-lg">
                  <div className="text-[10px] text-slate-400">{t('floors')}</div>
                  <div className="text-sm font-bold text-white">{b.numberOfFloors}</div>
                </div>
                <div className="bg-slate-950/60 p-2 rounded-lg">
                  <div className="text-[10px] text-slate-400">{t('units')}</div>
                  <div className="text-sm font-bold text-white">{b.totalUnits}</div>
                </div>
                <div className="bg-slate-950/60 p-2 rounded-lg">
                  <div className="text-[10px] text-slate-400">{language === 'ar' ? 'الحالة' : 'Condition'}</div>
                  <div className="text-xs font-semibold text-amber-400">{t(b.overallCondition)}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floors & Units Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Floors Column (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>{language === 'ar' ? 'أدوار المبنى' : 'Building Floors'}</span>
              </h3>
              <p className="text-[11px] text-slate-400">{floors.length} {t('floors')}</p>
            </div>

            {canEdit && (
              <button
                onClick={() => setShowDuplicateFloorModal(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 rounded-lg text-xs font-medium transition-all"
                title={t('duplicateFloor')}
              >
                <Copy className="w-3.5 h-3.5" />
                <span className="text-[11px]">{language === 'ar' ? 'تكرار الدور' : 'Duplicate'}</span>
              </button>
            )}
          </div>

          <div className="space-y-2">
            {floors.map((floor) => {
              const isSelected = selectedFloor.id === floor.id;
              const fUnits = units.filter(u => u.floorId === floor.id);

              return (
                <div
                  key={floor.id}
                  onClick={() => setSelectedFloor(floor)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500/50 shadow-md'
                      : 'bg-slate-950/60 border-slate-800 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-white">
                      {language === 'ar' ? floor.nameAr : floor.name}
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {floor.floorArea} {t('metricM2')}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
                    <span>{fUnits.length} {t('units')}</span>
                    {floor.repeatedOnFloors && (
                      <span className="text-[10px] text-amber-400">
                        {language === 'ar' ? `مكرر بالأدوار (${floor.repeatedOnFloors.join(',')})` : `Repeated (${floor.repeatedOnFloors.join(',')})`}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Units in Selected Floor Column (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Home className="w-4 h-4 text-amber-400" />
                <span>
                  {language === 'ar' 
                    ? `وحدات ${selectedFloor.nameAr}` 
                    : `Units of ${selectedFloor.name}`}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                {language === 'ar'
                  ? 'تفاصيل كل شقة، المساحة، الإشغال، وإمكانية إعادة التقسيم'
                  : 'Apartment specifications, occupancy, condition, and reconfiguration status'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {units
              .filter(u => u.floorId === selectedFloor.id)
              .map((u) => {
                const isSelected = selectedUnit?.id === u.id;
                return (
                  <div
                    key={u.id}
                    onClick={() => setSelectedUnit(u)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-850 border-amber-500 shadow-md ring-1 ring-amber-500/30'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-base text-white">
                            {language === 'ar' ? `شقة رقم ${u.unitNumber}` : `Unit #${u.unitNumber}`}
                          </span>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                            {u.unitType}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                          {u.bedrooms} {language === 'ar' ? 'غرف نوم' : 'Bedrooms'} • {u.bathrooms} {language === 'ar' ? 'حمامات' : 'Baths'} • {u.area} {t('metricM2')}
                        </div>
                      </div>

                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                        u.occupancyStatus === 'Vacant'
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {u.occupancyStatus === 'Vacant' ? (language === 'ar' ? 'شاغرة' : 'Vacant') : (language === 'ar' ? 'مؤجرة' : 'Occupied')}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800/80 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10.5px]">
                          {language === 'ar' ? 'الإيجار الحالي:' : 'Current Rent:'}
                        </span>
                        <span className="font-semibold text-slate-200">
                          {u.currentRentMonthly?.toLocaleString() || '-'} {t('currencySar')} / {language === 'ar' ? 'شهر' : 'mo'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10.5px]">
                          {language === 'ar' ? 'الإيجار المتوقع بعد التقسيم:' : 'Projected Post-Reconfig:'}
                        </span>
                        <span className="font-bold text-emerald-400">
                          {u.projectedRentMonthly?.toLocaleString() || '-'} {t('currencySar')} / {language === 'ar' ? 'شهر' : 'mo'}
                        </span>
                      </div>
                    </div>

                    {u.reconfigurationCandidate && (
                      <div className="mt-3 p-2 rounded-lg bg-sky-950/40 border border-sky-500/30 flex items-center justify-between text-xs text-sky-300 font-medium">
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                          <span>{language === 'ar' ? 'مرشح معتمد لإعادة التقسيم الذكي' : 'Reconfiguration Ready'}</span>
                        </span>
                        <span className="text-[11px] text-sky-400 underline">
                          {language === 'ar' ? 'السيناريوهات' : 'Scenarios'}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Modal: Add New Building */}
      {showAddBuildingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-400" />
                <span>{language === 'ar' ? 'إضافة مبنى قائم جديد' : 'Add Existing Building'}</span>
              </h2>
              <button
                onClick={() => setShowAddBuildingModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBuilding} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    {language === 'ar' ? 'اسم المبنى (بالعربية) *' : 'Building Name (Arabic) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newBldNameAr}
                    onChange={(e) => setNewBldNameAr(e.target.value)}
                    placeholder="مثال: عمارة النرجس السكنية"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    {language === 'ar' ? 'اسم المبنى (بالإنجليزية)' : 'Building Name (English)'}
                  </label>
                  <input
                    type="text"
                    value={newBldNameEn}
                    onChange={(e) => setNewBldNameEn(e.target.value)}
                    placeholder="e.g. Al Narjis Residential Building"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    {language === 'ar' ? 'كود المبنى' : 'Building Code'}
                  </label>
                  <input
                    type="text"
                    value={newBldCode}
                    onChange={(e) => setNewBldCode(e.target.value)}
                    placeholder="NRJ-RUH-03"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    {language === 'ar' ? 'المدينة (السعودية)' : 'City (KSA)'}
                  </label>
                  <select
                    value={newBldCity}
                    onChange={(e) => setNewBldCity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="الرياض">الرياض (Riyadh)</option>
                    <option value="جدة">جدة (Jeddah)</option>
                    <option value="الدمام">الدمام (Dammam)</option>
                    <option value="الخبر">الخبر (Khobar)</option>
                    <option value="مكة المكرمة">مكة المكرمة (Mecca)</option>
                    <option value="المدينة المنورة">المدينة المنورة (Medina)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    {language === 'ar' ? 'الحي' : 'District'}
                  </label>
                  <input
                    type="text"
                    value={newBldDistrict}
                    onChange={(e) => setNewBldDistrict(e.target.value)}
                    placeholder="مثال: النرجس"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    {language === 'ar' ? 'نوع المبنى' : 'Building Type'}
                  </label>
                  <select
                    value={newBldType}
                    onChange={(e) => setNewBldType(e.target.value as BuildingType)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Residential">Residential (سكني)</option>
                    <option value="Commercial">Commercial (تجاري)</option>
                    <option value="Office">Office (مكتبي)</option>
                    <option value="Mixed-use">Mixed-use (متعدد الاستخدام)</option>
                    <option value="Hospitality">Hospitality (ضيافة / شقق فندقية)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    {language === 'ar' ? 'سنة البناء' : 'Year Built'}
                  </label>
                  <input
                    type="number"
                    value={newBldYear}
                    onChange={(e) => setNewBldYear(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    {language === 'ar' ? 'عدد الأدوار' : 'Number of Floors'}
                  </label>
                  <input
                    type="number"
                    value={newBldFloors}
                    onChange={(e) => setNewBldFloors(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    {language === 'ar' ? 'إجمالي المساحة المبنية (م²)' : 'Built-up Area (m²)'}
                  </label>
                  <input
                    type="number"
                    value={newBldArea}
                    onChange={(e) => setNewBldArea(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    {language === 'ar' ? 'إجمالي الوحدات الحالية' : 'Current Units Count'}
                  </label>
                  <input
                    type="number"
                    value={newBldUnits}
                    onChange={(e) => setNewBldUnits(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  {language === 'ar' ? 'ملاحظات وأهداف إعادة التطوير' : 'Renovation & Target Notes'}
                </label>
                <textarea
                  rows={2}
                  value={newBldNotes}
                  onChange={(e) => setNewBldNotes(e.target.value)}
                  placeholder="وصف المشاكل الحالية في الشقق أو الأدوار والهدف المالي المطلوب..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddBuildingModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg shadow-md shadow-amber-500/20"
                >
                  {language === 'ar' ? 'حفظ وإنشاء المبنى' : 'Create Building'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Duplicate Floor Layout */}
      {showDuplicateFloorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Copy className="w-4 h-4 text-amber-400" />
                <span>{language === 'ar' ? 'تكرار نموذج الدور الحالي' : 'Duplicate Floor Layout'}</span>
              </h2>
              <button
                onClick={() => setShowDuplicateFloorModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-300">
                {language === 'ar'
                  ? `سيتم تطبيق نفس مسقط وتوزيع (${selectedFloor.nameAr}) على الأدوار المتكررة التالية:`
                  : `Apply the layout of (${selectedFloor.name}) to the following repeated floors:`}
              </p>
              <div>
                <label className="block text-slate-400 mb-1">
                  {language === 'ar' ? 'أرقام الأدوار المستهدفة (مفصولة بفاصلة)' : 'Target Floor Numbers (comma separated)'}
                </label>
                <input
                  type="text"
                  value={duplicateTargetFloors}
                  onChange={(e) => setDuplicateTargetFloors(e.target.value)}
                  placeholder="3, 4, 5"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowDuplicateFloorModal(false)}
                className="px-3.5 py-1.5 bg-slate-800 text-slate-300 rounded-lg"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleDuplicateFloors}
                className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg"
              >
                {language === 'ar' ? 'تطبيق التكرار' : 'Apply Layout'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
