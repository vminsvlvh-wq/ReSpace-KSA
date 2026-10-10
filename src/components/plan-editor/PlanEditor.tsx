import React, { useState, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { PlanElement } from '../../types';
import { 
  Compass, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Trash2, 
  ShieldAlert, 
  Upload, 
  Layers, 
  Maximize2, 
  Check, 
  Info,
  Grid,
  Square,
  DoorOpen,
  SplitSquareVertical
} from 'lucide-react';

type ToolMode = 'select' | 'wall' | 'structural_wall' | 'column' | 'door' | 'window' | 'wet_area' | 'shaft' | 'room';

export const PlanEditor: React.FC = () => {
  const { language, t } = useLanguage();
  const { 
    floorPlan, 
    setFloorPlan, 
    addPlanElement, 
    removePlanElement, 
    selectedFloor, 
    selectedUnit,
    canEdit
  } = useApp();

  const [activeTool, setActiveTool] = useState<ToolMode>('select');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [snapToGrid, setSnapToGrid] = useState<boolean>(true);
  const [showDimensions, setShowDimensions] = useState<boolean>(true);
  const [bgUploadNotice, setBgUploadNotice] = useState<string | null>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);

  const selectedElement = floorPlan.elements.find(el => el.id === selectedElementId);

  // Handle clicking on the canvas to place a new element based on activeTool
  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (activeTool === 'select' || !canEdit) return;

    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    let rawX = (e.clientX - rect.left) / zoomLevel;
    let rawY = (e.clientY - rect.top) / zoomLevel;

    // Snap to 10px grid if enabled
    const gridSize = 10;
    const x = snapToGrid ? Math.round(rawX / gridSize) * gridSize : Math.round(rawX);
    const y = snapToGrid ? Math.round(rawY / gridSize) * gridSize : Math.round(rawY);

    const newId = `elem_${Date.now()}`;

    let newElement: PlanElement;

    switch (activeTool) {
      case 'column':
        newElement = {
          id: newId,
          type: 'column',
          x,
          y,
          width: 28,
          height: 28,
          label: `عمود خرساني C-${floorPlan.elements.filter(e => e.type === 'column').length + 1}`,
          isRestricted: true
        };
        break;
      case 'structural_wall':
        newElement = {
          id: newId,
          type: 'structural_wall',
          x,
          y,
          width: 160,
          height: 20,
          label: 'جدار خرساني حامل (محمي)',
          isRestricted: true
        };
        break;
      case 'wall':
        newElement = {
          id: newId,
          type: 'wall',
          x,
          y,
          width: 120,
          height: 10,
          label: 'جدار قاطع قابل للتعديل'
        };
        break;
      case 'door':
        newElement = {
          id: newId,
          type: 'door',
          x,
          y,
          width: 14,
          height: 36,
          label: 'باب مدخل/غرفة'
        };
        break;
      case 'window':
        newElement = {
          id: newId,
          type: 'window',
          x,
          y,
          width: 70,
          height: 14,
          label: 'نافذة إضاءة طبيعية'
        };
        break;
      case 'wet_area':
        newElement = {
          id: newId,
          type: 'wet_area',
          x,
          y,
          width: 80,
          height: 70,
          label: 'منطقة سباكة / حمام',
          roomType: 'Bathroom',
          areaM2: 5.6
        };
        break;
      case 'shaft':
        newElement = {
          id: newId,
          type: 'shaft',
          x,
          y,
          width: 32,
          height: 40,
          label: 'منور خدمات MEP رئيسي',
          isRestricted: true
        };
        break;
      case 'room':
        newElement = {
          id: newId,
          type: 'room',
          x,
          y,
          width: 140,
          height: 120,
          label: 'فراغ غرفة نوم / معيشة',
          roomType: 'Living',
          areaM2: 16.8
        };
        break;
      default:
        return;
    }

    addPlanElement(newElement);
    setSelectedElementId(newId);
    setActiveTool('select');
  };

  const handleSimulatedPlanUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBgUploadNotice(
        language === 'ar'
          ? `تم تحميل المخطط القائم (${file.name}). يرجى مراجعة وتأكيد مطابقة الجدران والأعمدة الإنشائية قبل اعتماد التقسيم.`
          : `Existing plan (${file.name}) uploaded. Please inspect and confirm walls and load-bearing columns before final sign-off.`
      );
    }
  };

  return (
    <div className="space-y-4">
      {/* Title & Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-400" />
              <span>{floorPlan.title}</span>
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
              V{floorPlan.version}.0 {floorPlan.status}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'ar'
              ? 'مقياس الرسم: 40 بكسل = 1 متر طولي | الأعمدة والمناور الملونة بالأحمر عناصر إنشائية مقيدة لا يمكن هدمها'
              : 'Scale: 40px = 1 linear meter | Red columns & shafts are protected structural elements'}
          </p>
        </div>

        {/* Upload Existing Drawing & Scale Tools */}
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium cursor-pointer transition-all">
            <Upload className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'ar' ? 'رفع مخطط معماري قائم (PDF/PNG)' : 'Upload As-Built Drawing'}</span>
            <input type="file" accept="image/*,.pdf" className="hidden" onChange={handleSimulatedPlanUpload} />
          </label>

          <button
            onClick={() => setSnapToGrid(!snapToGrid)}
            className={`p-1.5 rounded-lg border text-xs transition-all ${
              snapToGrid ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
            title="المحاذاة التلقائية للشبكة (Snap to Grid)"
          >
            <Grid className="w-4 h-4" />
          </button>

          <button
            onClick={() => setZoomLevel(prev => Math.min(prev + 0.15, 2.0))}
            className="p-1.5 bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-700"
            title={t('zoomIn')}
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            onClick={() => setZoomLevel(prev => Math.max(prev - 0.15, 0.6))}
            className="p-1.5 bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-700"
            title={t('zoomOut')}
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <button
            onClick={() => setZoomLevel(1)}
            className="p-1.5 bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-700"
            title={t('resetZoom')}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {bgUploadNotice && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs text-amber-300">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{bgUploadNotice}</span>
          </div>
          <button onClick={() => setBgUploadNotice(null)} className="text-slate-400 hover:text-white">
            <Check className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Workspace: Left Tool Palette + Center Canvas + Right Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Architectural Element Palette (2 cols) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-2">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-2 py-1">
            {language === 'ar' ? 'أدوات التتبع المعماري' : 'Tracing Elements'}
          </div>

          <button
            onClick={() => setActiveTool('select')}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTool === 'select' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>{language === 'ar' ? 'تحديد ومعاينة' : 'Select Tool'}</span>
          </button>

          <button
            onClick={() => setActiveTool('wall')}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTool === 'wall' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="w-3.5 h-1.5 bg-slate-300 rounded-sm"></div>
            <span>{t('toolWall')}</span>
          </button>

          <button
            onClick={() => setActiveTool('column')}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTool === 'column' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-rose-300 hover:bg-slate-800'
            }`}
          >
            <div className="w-3.5 h-3.5 bg-rose-500 rounded-sm"></div>
            <span>{t('toolColumn')}</span>
          </button>

          <button
            onClick={() => setActiveTool('structural_wall')}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTool === 'structural_wall' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-rose-400 hover:bg-slate-800'
            }`}
          >
            <div className="w-4 h-2 bg-rose-600 rounded-sm"></div>
            <span>{t('toolStructuralWall')}</span>
          </button>

          <button
            onClick={() => setActiveTool('door')}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTool === 'door' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <DoorOpen className="w-4 h-4 text-emerald-400" />
            <span>{t('toolDoor')}</span>
          </button>

          <button
            onClick={() => setActiveTool('window')}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTool === 'window' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="w-4 h-1.5 bg-sky-400 rounded-sm"></div>
            <span>{t('toolWindow')}</span>
          </button>

          <button
            onClick={() => setActiveTool('wet_area')}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTool === 'wet_area' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-sky-300 hover:bg-slate-800'
            }`}
          >
            <div className="w-3.5 h-3.5 bg-sky-600/70 border border-sky-400 rounded-sm"></div>
            <span>{t('toolWetArea')}</span>
          </button>

          <button
            onClick={() => setActiveTool('shaft')}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTool === 'shaft' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-amber-300 hover:bg-slate-800'
            }`}
          >
            <div className="w-3.5 h-3.5 bg-amber-600/60 border border-amber-400 rounded-sm"></div>
            <span>{t('toolShaft')}</span>
          </button>

          <button
            onClick={() => setActiveTool('room')}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTool === 'room' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Square className="w-4 h-4 text-purple-400" />
            <span>{t('toolRoom')}</span>
          </button>

          <div className="pt-3 border-t border-slate-800 text-[10.5px] text-slate-400 leading-tight">
            {activeTool !== 'select' && (
              <span className="text-amber-400 font-semibold block mb-1">
                {language === 'ar' ? 'انقر على المسقط لوضع العنصر' : 'Click canvas to place element'}
              </span>
            )}
            {language === 'ar' ? 'العناصر الإنشائية تظهر بحدود تحذيرية حمراء ولا يجوز حذفها.' : 'Structural elements are highlighted in red.'}
          </div>
        </div>

        {/* SVG Drawing Canvas (7 cols) */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-4 overflow-auto flex items-center justify-center min-h-[520px] blueprint-grid relative">
          <div 
            style={{ 
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'center center',
              transition: 'transform 0.15s ease-out'
            }}
          >
            <svg
              ref={svgRef}
              width={floorPlan.width}
              height={floorPlan.height}
              onClick={handleSvgClick}
              className="bg-slate-900/90 shadow-2xl rounded-xl border border-slate-700 cursor-crosshair select-none"
            >
              {/* Background grid lines */}
              <defs>
                <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                </pattern>
                <pattern id="diagonalHatch" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="0" y2="10" stroke="rgba(244, 63, 94, 0.4)" strokeWidth="1.5" />
                </pattern>
              </defs>
              <rect width={floorPlan.width} height={floorPlan.height} fill="url(#smallGrid)" />

              {/* Render Plan Elements */}
              {floorPlan.elements.map((el) => {
                const isSelected = el.id === selectedElementId;

                // 1. Rooms
                if (el.type === 'room') {
                  return (
                    <g key={el.id} onClick={(e) => { e.stopPropagation(); setSelectedElementId(el.id); }}>
                      <rect
                        x={el.x}
                        y={el.y}
                        width={el.width || 100}
                        height={el.height || 100}
                        fill="rgba(147, 51, 234, 0.08)"
                        stroke={isSelected ? '#f59e0b' : 'rgba(147, 51, 234, 0.35)'}
                        strokeWidth={isSelected ? 2 : 1}
                        strokeDasharray="4 2"
                      />
                      <text
                        x={el.x + (el.width || 100) / 2}
                        y={el.y + (el.height || 100) / 2}
                        textAnchor="middle"
                        fill="#cbd5e1"
                        fontSize="11"
                        fontWeight="600"
                      >
                        {el.label}
                      </text>
                    </g>
                  );
                }

                // 2. Wet Area (Kitchen / Bathroom)
                if (el.type === 'wet_area') {
                  return (
                    <g key={el.id} onClick={(e) => { e.stopPropagation(); setSelectedElementId(el.id); }}>
                      <rect
                        x={el.x}
                        y={el.y}
                        width={el.width || 80}
                        height={el.height || 70}
                        fill="rgba(14, 165, 233, 0.15)"
                        stroke={isSelected ? '#f59e0b' : '#38bdf8'}
                        strokeWidth={isSelected ? 2 : 1.2}
                      />
                      <text
                        x={el.x + (el.width || 80) / 2}
                        y={el.y + (el.height || 70) / 2}
                        textAnchor="middle"
                        fill="#7dd3fc"
                        fontSize="10"
                        fontWeight="600"
                      >
                        {el.label}
                      </text>
                    </g>
                  );
                }

                // 3. Service Shafts (Protected MEP)
                if (el.type === 'shaft') {
                  return (
                    <g key={el.id} onClick={(e) => { e.stopPropagation(); setSelectedElementId(el.id); }}>
                      <rect
                        x={el.x}
                        y={el.y}
                        width={el.width || 30}
                        height={el.height || 40}
                        fill="url(#diagonalHatch)"
                        stroke="#f43f5e"
                        strokeWidth={isSelected ? 2.5 : 1.5}
                      />
                      <text
                        x={el.x + (el.width || 30) / 2}
                        y={el.y - 4}
                        textAnchor="middle"
                        fill="#f43f5e"
                        fontSize="9"
                        fontWeight="bold"
                      >
                        {el.label}
                      </text>
                    </g>
                  );
                }

                // 4. Structural Columns (Fixed C1..C9)
                if (el.type === 'column') {
                  return (
                    <g key={el.id} onClick={(e) => { e.stopPropagation(); setSelectedElementId(el.id); }}>
                      <rect
                        x={el.x}
                        y={el.y}
                        width={el.width || 28}
                        height={el.height || 28}
                        fill="#f43f5e"
                        stroke={isSelected ? '#ffffff' : '#fda4af'}
                        strokeWidth={isSelected ? 2.5 : 1.5}
                        rx="2"
                      />
                      {/* Architectural cross mark inside column */}
                      <line x1={el.x} y1={el.y} x2={el.x + (el.width || 28)} y2={el.y + (el.height || 28)} stroke="#881337" strokeWidth="1" />
                      <line x1={el.x + (el.width || 28)} y1={el.y} x2={el.x} y2={el.y + (el.height || 28)} stroke="#881337" strokeWidth="1" />
                      <text
                        x={el.x + (el.width || 28) / 2}
                        y={el.y + (el.height || 28) + 12}
                        textAnchor="middle"
                        fill="#fda4af"
                        fontSize="9"
                        fontWeight="bold"
                      >
                        {el.label}
                      </text>
                    </g>
                  );
                }

                // 5. Walls (Partition or Structural)
                if (el.type === 'wall' || el.type === 'structural_wall') {
                  const isStructural = el.type === 'structural_wall' || el.isRestricted;
                  return (
                    <g key={el.id} onClick={(e) => { e.stopPropagation(); setSelectedElementId(el.id); }}>
                      <rect
                        x={el.x}
                        y={el.y}
                        width={el.width || 100}
                        height={el.height || 12}
                        fill={isStructural ? '#991b1b' : '#334155'}
                        stroke={isSelected ? '#f59e0b' : isStructural ? '#f87171' : '#64748b'}
                        strokeWidth={isSelected ? 2 : 1}
                      />
                    </g>
                  );
                }

                // 6. Doors
                if (el.type === 'door') {
                  return (
                    <g key={el.id} onClick={(e) => { e.stopPropagation(); setSelectedElementId(el.id); }}>
                      {/* Door swing arc */}
                      <path
                        d={`M ${el.x} ${el.y} A ${el.height || 36} ${el.height || 36} 0 0 1 ${el.x + (el.height || 36)} ${el.y + (el.height || 36)}`}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="1.2"
                        strokeDasharray="2 2"
                      />
                      {/* Door leaf */}
                      <rect
                        x={el.x}
                        y={el.y}
                        width={el.width || 12}
                        height={el.height || 36}
                        fill="#10b981"
                        stroke={isSelected ? '#ffffff' : '#059669'}
                        strokeWidth="1"
                      />
                    </g>
                  );
                }

                // 7. Windows
                if (el.type === 'window') {
                  return (
                    <g key={el.id} onClick={(e) => { e.stopPropagation(); setSelectedElementId(el.id); }}>
                      <rect
                        x={el.x}
                        y={el.y}
                        width={el.width || 60}
                        height={el.height || 14}
                        fill="rgba(56, 189, 248, 0.3)"
                        stroke={isSelected ? '#f59e0b' : '#38bdf8'}
                        strokeWidth="1.2"
                      />
                      <line
                        x1={el.x}
                        y1={el.y + (el.height || 14) / 2}
                        x2={el.x + (el.width || 60)}
                        y2={el.y + (el.height || 14) / 2}
                        stroke="#38bdf8"
                        strokeWidth="1"
                      />
                    </g>
                  );
                }

                return null;
              })}
            </svg>
          </div>
        </div>

        {/* Right Inspector & Structural Compliance Guard (3 cols) */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-400" />
              <span>{language === 'ar' ? 'فاحص العناصر المعمارية' : 'Element Inspector'}</span>
            </h3>
            <p className="text-xs text-slate-400">
              {language === 'ar' ? 'بيانات العنصر المختار وقيوده الإنشائية' : 'Selected element properties & constraints'}
            </p>
          </div>

          {selectedElement ? (
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-0.5">{language === 'ar' ? 'التسمية / المعرّف' : 'Label / Tag'}</label>
                <div className="font-semibold text-white">{selectedElement.label || selectedElement.id}</div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-0.5">{language === 'ar' ? 'النوع' : 'Type'}</label>
                  <span className="font-mono text-amber-400 font-semibold uppercase">{selectedElement.type}</span>
                </div>
                <div>
                  <label className="text-slate-400 block mb-0.5">{language === 'ar' ? 'الأبعاد' : 'Dimensions'}</label>
                  <span className="text-slate-200">
                    {((selectedElement.width || 0) / 40).toFixed(1)}m × {((selectedElement.height || 0) / 40).toFixed(1)}m
                  </span>
                </div>
              </div>

              {selectedElement.isRestricted ? (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-rose-400">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>{language === 'ar' ? 'عنصر إنشائي محمي' : 'Protected Structural Element'}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    {language === 'ar'
                      ? 'هذا العنصر (عمود خرساني أو منور رئيسي) محمي بنظام كود البناء السعودي. يمنع حذفه أو نقله منعاً باتاً للحفاظ على السلامة الإنشائية للمبنى.'
                      : 'Load-bearing column or major MEP shaft. Strictly protected against demolition.'}
                  </p>
                </div>
              ) : (
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px]">
                  {language === 'ar' ? 'قاطع غير حامل - يمكن تعديله أو دمجه في سيناريوهات إعادة التهيئة.' : 'Non-structural partition - safe for reconfiguration.'}
                </div>
              )}

              {canEdit && (
                <div className="pt-3 border-t border-slate-800">
                  <button
                    onClick={() => {
                      if (selectedElement.isRestricted) {
                        alert(language === 'ar' ? 'لا يمكن حذف العناصر الإنشائية المحمية!' : 'Cannot delete protected structural element!');
                        return;
                      }
                      removePlanElement(selectedElement.id);
                      setSelectedElementId(null);
                    }}
                    disabled={selectedElement.isRestricted}
                    className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all ${
                      selectedElement.isRestricted
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'حذف العنصر من المخطط' : 'Delete Element'}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-500 space-y-1">
              <Compass className="w-8 h-8 text-slate-600 mx-auto" />
              <p>{language === 'ar' ? 'حدد أي عنصر في المسقط للاطلاع على بياناته وقيوده الإنشائية' : 'Select an element on canvas to inspect properties'}</p>
            </div>
          )}

          {/* Quick Legend */}
          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 space-y-1.5">
            <div className="font-semibold text-slate-300 text-xs">{language === 'ar' ? 'دليل العناصر' : 'Legend'}</div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-rose-500 rounded-sm"></span>
              <span>{language === 'ar' ? 'عمود إنشائي ثابت (محمي)' : 'Fixed Structural Column'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-slate-700 rounded-sm"></span>
              <span>{language === 'ar' ? 'جدار قاطع (قابل للإزالة)' : 'Demolishable Partition'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-sky-500 rounded-sm"></span>
              <span>{language === 'ar' ? 'منطقة سباكة / دورة مياه' : 'Wet Area / Plumbing'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
