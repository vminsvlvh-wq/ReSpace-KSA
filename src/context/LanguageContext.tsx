import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

interface Translations {
  [key: string]: {
    ar: string;
    en: string;
  };
}

export const translations: Translations = {
  // Brand & Header
  appName: { ar: 'ري سبيس KSA', en: 'ReSpace KSA' },
  tagline: { ar: 'منصة تطوير وتجديد وإعادة تهيئة المباني والوحدات القائمة', en: 'Smart Platform for Renovating & Reconfiguring Existing Real Estate' },
  disclaimerStructural: {
    ar: 'المخططات والتصاميم المقترحة هي حلول تخطيطية ومفاهيمية أولية. أي تعديل إنشائي يتطلب مراجعة واعتماد مهندس إنشائي مرخص، والتأكد من مطابقة كود البناء السعودي (SBC) واشتراطات الدفاع المدني.',
    en: 'Generated layouts are conceptual planning tools. Any structural modification requires licensed structural engineer review and compliance with Saudi Building Code (SBC) and Civil Defense requirements.'
  },
  
  // Navigation
  navDashboard: { ar: 'لوحة التحكم والمحفظة', en: 'Portfolio Dashboard' },
  navBuildings: { ar: 'إدارة المباني والوحدات', en: 'Buildings & Units' },
  navPlanEditor: { ar: 'مخطط الأدوار والتتبع', en: 'Floor Plan Editor' },
  navReconfig: { ar: 'محرك إعادة التهيئة والتقسيم', en: 'Reconfiguration Engine' },
  navCondition: { ar: 'تقييم الحالة الفنية', en: 'Condition Assessment' },
  navSiteSurvey: { ar: 'المسح الميداني (موبايل)', en: 'Site Survey Mode' },
  navScopeBoq: { ar: 'نطاق العمل وجدول الكميات (BOQ)', en: 'Scope & BOQ' },
  navFinancial: { ar: 'التحليل المالي والعائد', en: 'Financial Feasibility' },
  navSnagging: { ar: 'قائمة الملاحظات (Snag List)', en: 'Snagging & Quality' },
  navPresentation: { ar: 'عرض العميل والمقارنة', en: 'Client Presentation' },
  navReports: { ar: 'التقارير والمستندات', en: 'Reports & Export' },
  navAiAssistant: { ar: 'المساعد الذكي للمشروع', en: 'AI Project Advisor' },

  // Roles
  roleOwner: { ar: 'مالك العقار', en: 'Property Owner' },
  roleAdmin: { ar: 'مدير النظام', en: 'System Admin' },
  roleArchitect: { ar: 'مهندس معماري', en: 'Architect' },
  roleInteriorDesigner: { ar: 'مصمم داخلي', en: 'Interior Designer' },
  roleStructuralEngineer: { ar: 'مهندس إنشائي', en: 'Structural Engineer' },
  roleMepEngineer: { ar: 'مهندس كهروميكانيك (MEP)', en: 'MEP Engineer' },
  roleProjectManager: { ar: 'مدير المشروع', en: 'Project Manager' },
  roleContractor: { ar: 'مقاول التجديد', en: 'Renovation Contractor' },
  roleClient: { ar: 'العميل / المستثمر', en: 'Client / Investor' },
  roleViewer: { ar: 'مشاهد فقط', en: 'Viewer' },

  // General & Stats
  buildings: { ar: 'المباني', en: 'Buildings' },
  floors: { ar: 'الأدوار', en: 'Floors' },
  units: { ar: 'الوحدات', en: 'Units' },
  rooms: { ar: 'الغرف والمساحات', en: 'Rooms & Spaces' },
  totalArea: { ar: 'إجمالي المساحة المبنية', en: 'Total Built-up Area' },
  vacantUnits: { ar: 'الوحدات الشاغرة', en: 'Vacant Units' },
  occupiedUnits: { ar: 'الوحدات المؤجرة', en: 'Occupied Units' },
  underRenovation: { ar: 'قيد التجديد', en: 'Under Renovation' },
  estRenovationCost: { ar: 'تكلفة التجديد التقديرية', en: 'Est. Renovation Budget' },
  currencySar: { ar: 'ر.س', en: 'SAR' },
  metricM2: { ar: 'م²', en: 'm²' },
  metricM: { ar: 'م.ط', en: 'm' },

  // Condition levels
  EXCELLENT: { ar: 'ممتازة', en: 'Excellent' },
  GOOD: { ar: 'جيدة', en: 'Good' },
  FAIR: { ar: 'متوسطة', en: 'Fair' },
  POOR: { ar: 'ضعيفة', en: 'Poor' },
  REPLACE: { ar: 'استبدال عاجل', en: 'Replace' },

  // Priority levels
  URGENT: { ar: 'حرجة / فورية', en: 'Urgent' },
  HIGH: { ar: 'عالية', en: 'High' },
  MEDIUM: { ar: 'متوسطة', en: 'Medium' },
  LOW: { ar: 'منخفضة', en: 'Low' },
  COSMETIC: { ar: 'تحسين شكلي', en: 'Cosmetic' },

  // Actions & Buttons
  addNewBuilding: { ar: 'إضافة مبنى قائم', en: 'Add Existing Building' },
  duplicateFloor: { ar: 'تكرار الدور إلى أدوار أخرى', en: 'Duplicate Floor Layout' },
  reconfigureUnit: { ar: 'إعادة تهيئة الوحدة', en: 'Reconfigure Unit' },
  compareScenarios: { ar: 'مقارنة السيناريوهات', en: 'Compare Scenarios' },
  generateBoq: { ar: 'توليد جدول الكميات الأولي', en: 'Generate Preliminary BOQ' },
  saveChanges: { ar: 'حفظ التعديلات', en: 'Save Changes' },
  cancel: { ar: 'إلغاء', en: 'Cancel' },
  filter: { ar: 'تصفية', en: 'Filter' },
  search: { ar: 'بحث...', en: 'Search...' },
  exportPdf: { ar: 'تصدير تقرير مهني (PDF)', en: 'Export Professional Report' },
  offlineSyncPending: { ar: 'بانتظار المزامنة', en: 'Pending Sync' },
  allSynced: { ar: 'تمت المزامنة بالكامل', en: 'All Synced' },
  syncNow: { ar: 'مزامنة السجلات الآن', en: 'Sync Records Now' },
  beforeAfter: { ar: 'مقارنة قبل وبعد', en: 'Before & After' },

  // Plan editor
  toolWall: { ar: 'جدار قاطع', en: 'Partition Wall' },
  toolStructuralWall: { ar: 'جدار خرساني إنشائي', en: 'Structural Wall' },
  toolColumn: { ar: 'عمود خرساني (ثابت)', en: 'Structural Column' },
  toolDoor: { ar: 'باب', en: 'Door' },
  toolWindow: { ar: 'نافذة', en: 'Window' },
  toolWetArea: { ar: 'منطقة سباكة / دورة مياه', en: 'Wet Area / Plumbing' },
  toolRoom: { ar: 'تحديد غرفة', en: 'Room Tag' },
  toolShaft: { ar: 'منور / منور خدمات', en: 'Service Shaft' },
  undo: { ar: 'تراجع', en: 'Undo' },
  redo: { ar: 'إعادة', en: 'Redo' },
  zoomIn: { ar: 'تكبير', en: 'Zoom In' },
  zoomOut: { ar: 'تصغير', en: 'Zoom Out' },
  resetZoom: { ar: 'إعادة ضبط', en: 'Reset' },
  planDisclaimer: { ar: 'العناصر الإنشائية (الأعمدة والجدران الحاملة) محمية ولا يمكن هدمها بدون إذن إنشائي معتمد.', en: 'Structural elements (columns & load-bearing walls) are protected and cannot be demolished without structural review.' },

  // Reconfiguration scenarios
  scenarioTitle: { ar: 'سيناريوهات إعادة التهيئة والتوزيع', en: 'Reconfiguration Scenarios' },
  scenarioDesc: { ar: 'خيارات متعددة لتحويل الوحدة أو الدور القائم لتوسيع نطاق العائد أو تحسين توزيع المساحة', en: 'Alternative options to convert existing units/floors for enhanced yield or space efficiency' },
  existingLayout: { ar: 'الوضع القائم الحالي', en: 'Existing Baseline Layout' },
  demolishedWalls: { ar: 'الجدران المقرر إزالتها', en: 'Demolished Walls' },
  newDrywallMasonry: { ar: 'جدران جديدة (جبس/بلك)', en: 'New Walls (Drywall/Masonry)' },
  wetAreaImpact: { ar: 'تعديلات السباكة والصرف', en: 'Wet Area & Drainage Impact' },
  mepComplexity: { ar: 'تعقيد الكهروميكانيك', en: 'MEP Complexity' },
  estDuration: { ar: 'المدة التقديرية للتنفيذ', en: 'Estimated Duration' },
  weeks: { ar: 'أسابيع', en: 'Weeks' },
  spaceEfficiency: { ar: 'كفاءة استغلال المساحة', en: 'Space Efficiency' },
  structuralRisk: { ar: 'المخاطر الإنشائية', en: 'Structural Risk' },
  projectedRent: { ar: 'الإيجار الشهري المتوقع', en: 'Projected Monthly Rent' },
  currentRent: { ar: 'الإيجار الحالي', en: 'Current Rent' },
  netGain: { ar: 'صافي الزيادة المتوقعة', en: 'Net Projected Increase' },
  selectAsPreferred: { ar: 'اعتماد هذا السيناريو للمشروع', en: 'Select Scenario for Scope' },
  selectedPreferred: { ar: 'السيناريو المعتمد', en: 'Selected Scenario' },

  // Survey
  siteSurveyTitle: { ar: 'وضع المسح الميداني السريع (Site Survey)', en: 'Site Survey Field Mode' },
  siteSurveyDesc: { ar: 'مخصص للمهندسين أثناء التجول في المبنى لتسجيل الملاحظات، الصور، القياسات، وحالة العناصر مع دعم العمل بدون إنترنت.', en: 'Optimized for field engineers walking through buildings to capture notes, photos, ratings, and audio with offline support.' },
  voiceNote: { ar: 'تسجيل صوتي للملاحظة', en: 'Record Voice Note' },
  capturePhoto: { ar: 'التقاط صورة سريعة', en: 'Attach Photo' },
  roomTag: { ar: 'تحديد الغرفة / العنصر', en: 'Space / Element Tag' },
  quickIssue: { ar: 'تسجيل ملاحظة / عيب فني', en: 'Record Issue / Snag' }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('respace_lang');
    return (saved === 'en' || saved === 'ar') ? saved : 'ar';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('respace_lang', lang);
  };

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('lang', language);
    root.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
  }, [language]);

  const t = (key: string): string => {
    if (!translations[key]) {
      return key;
    }
    return translations[key][language] || translations[key].ar || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRtl: language === 'ar' }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
