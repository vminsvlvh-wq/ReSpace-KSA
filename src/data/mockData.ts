import {
  Building,
  Floor,
  Unit,
  ReconfigurationScenario,
  ConditionAssessmentItem,
  BOQItem,
  SnagItem,
  FloorPlanData,
  Company,
  Portfolio,
  AuditLog
} from '../types';

export const initialCompany: Company = {
  id: 'comp_01',
  name: 'شركة إتقان للتطوير العقاري وإدارة الأصول',
  crNumber: '1010892741',
  taxNumber: '310984729100003',
  city: 'الرياض',
  country: 'المملكة العربية السعودية'
};

export const initialPortfolio: Portfolio = {
  id: 'port_01',
  companyId: 'comp_01',
  name: 'محفظة العقارات القائمة وإعادة التطوير - الرياض وجدة',
  description: 'مجموعة الأصول العقارية السكنية والتجارية المستهدفة بإعادة التهيئة ورفع العائد الإيجاري',
  buildingIds: ['bld_01', 'bld_02']
};

export const initialBuildings: Building[] = [
  {
    id: 'bld_01',
    companyId: 'comp_01',
    portfolioId: 'port_01',
    name: 'Al Yasmin Residential Building',
    nameAr: 'عمارة الياسمين السكنية',
    code: 'YSM-RUH-01',
    address: 'شارع أنس بن مالك، حي الياسمين',
    city: 'الرياض',
    district: 'الياسمين',
    country: 'المملكة العربية السعودية',
    yearBuilt: 2011,
    buildingType: 'Residential',
    numberOfFloors: 5,
    basements: 1,
    parkingFloors: 1,
    totalUnits: 16,
    totalBuiltUpArea: 3200,
    landArea: 900,
    parkingSpaces: 20,
    numberOfElevators: 2,
    occupancyStatus: 'Partially Occupied',
    currentUse: 'شقق سكنية عائلية كبيرة (3 غرف نوم)',
    overallCondition: 'FAIR',
    notes: 'مبنى قائم يعاني من ضعف الإشغال بسبب كبر مساحات الشقق (210 م²) وارتفاع الإيجار الإجمالي. المقترح: إعادة تقسيم بعض الشقق إلى وحدات أصغر واستوديوهات لرفع العائد.',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80'
    ],
    floorsCount: 5
  },
  {
    id: 'bld_02',
    companyId: 'comp_01',
    portfolioId: 'port_01',
    name: 'Al Andalus Commercial Plaza',
    nameAr: 'مبنى الأندلس التجاري والمكتبي',
    code: 'AND-JED-02',
    address: 'طريق الأمير محمد بن عبدالعزيز (التحلية)',
    city: 'جدة',
    district: 'الأندلس',
    country: 'المملكة العربية السعودية',
    yearBuilt: 2014,
    buildingType: 'Mixed-use',
    numberOfFloors: 4,
    basements: 1,
    parkingFloors: 1,
    totalUnits: 12,
    totalBuiltUpArea: 4800,
    landArea: 1400,
    parkingSpaces: 35,
    numberOfElevators: 3,
    occupancyStatus: 'Partially Occupied',
    currentUse: 'معارض تجارية بالأرضي ومكاتب مفتوحة بالأدوار المتكررة',
    overallCondition: 'GOOD',
    notes: 'مكاتب بمساحات مفتوحة 380 م² تتطلب تقسيماً إلى أجنحة أعمال خاصة ورواد أعمال مع قاعات اجتماعات مشتركة.',
    images: [
      'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1000&q=80'
    ],
    floorsCount: 4
  }
];

export const initialFloors: Floor[] = [
  {
    id: 'flr_01',
    buildingId: 'bld_01',
    floorNumber: 1,
    name: 'Floor 1',
    nameAr: 'الدور الأول',
    floorArea: 640,
    numberOfUnits: 3,
    commonArea: 95,
    serviceArea: 25,
    corridorArea: 60,
    verticalCirculation: 45,
    notes: 'الدور الأول فوق الأرضي، يضم 3 شقق كبيرة بمساحات تتراوح بين 180 م² و 210 م².',
    repeatedOnFloors: [2, 3, 4],
    units: []
  },
  {
    id: 'flr_02',
    buildingId: 'bld_01',
    floorNumber: 2,
    name: 'Floor 2 (Target Reconfiguration)',
    nameAr: 'الدور الثاني (مستهدف لإعادة التقسيم)',
    floorArea: 640,
    numberOfUnits: 3,
    commonArea: 95,
    serviceArea: 25,
    corridorArea: 60,
    verticalCirculation: 45,
    notes: 'الدور الثاني شاغر حالياً وهو النموذج الأول لتطبيق إعادة التهيئة والتقسيم الذكي.',
    repeatedOnFloors: [1, 3, 4],
    units: []
  },
  {
    id: 'flr_03',
    buildingId: 'bld_01',
    floorNumber: 3,
    name: 'Floor 3',
    nameAr: 'الدور الثالث',
    floorArea: 640,
    numberOfUnits: 3,
    commonArea: 95,
    serviceArea: 25,
    corridorArea: 60,
    verticalCirculation: 45,
    notes: 'مكرر ومطابق للدور الأول والثاني.',
    units: []
  }
];

export const initialUnits: Unit[] = [
  {
    id: 'unt_201',
    buildingId: 'bld_01',
    floorId: 'flr_02',
    unitNumber: '201',
    unitType: '3 Bedroom',
    area: 210,
    bedrooms: 3,
    bathrooms: 3,
    kitchens: 1,
    livingRooms: 2,
    diningRooms: 1,
    balconies: 1,
    storage: 1,
    utilityRoom: true,
    entranceCount: 2,
    occupancyStatus: 'Vacant',
    currentRentMonthly: 5500, // 66,000 SAR/year
    projectedRentMonthly: 11000, // 132,000 SAR/year if split into 2 or 3 units
    condition: 'FAIR',
    notes: 'شقة كبيرة ذات مدخلين، قريبة من مناور الصرف الرئيسية. مرشح استراتيجي للتحويل إلى وحدتين مستقلتين أو 3 استوديوهات مخدومة.',
    photos: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'
    ],
    reconfigurationCandidate: true
  },
  {
    id: 'unt_202',
    buildingId: 'bld_01',
    floorId: 'flr_02',
    unitNumber: '202',
    unitType: '3 Bedroom',
    area: 190,
    bedrooms: 3,
    bathrooms: 2,
    kitchens: 1,
    livingRooms: 1,
    diningRooms: 1,
    balconies: 1,
    storage: 0,
    utilityRoom: false,
    entranceCount: 1,
    occupancyStatus: 'Vacant',
    currentRentMonthly: 4800,
    projectedRentMonthly: 9000,
    condition: 'POOR',
    notes: 'تحتاج لتجديد شامل للحمامات والأرضيات والتكييف، فرصة لتغيير التوزيع الداخلي وتوسيع الصالة.',
    photos: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'
    ],
    reconfigurationCandidate: true
  },
  {
    id: 'unt_203',
    buildingId: 'bld_01',
    floorId: 'flr_02',
    unitNumber: '203',
    unitType: '2 Bedroom',
    area: 155,
    bedrooms: 2,
    bathrooms: 2,
    kitchens: 1,
    livingRooms: 1,
    diningRooms: 0,
    balconies: 0,
    storage: 1,
    utilityRoom: false,
    entranceCount: 1,
    occupancyStatus: 'Occupied',
    currentRentMonthly: 4200,
    condition: 'GOOD',
    notes: 'مؤجرة حالياً بعقد ينتهي بعد 6 أشهر.',
    photos: [],
    reconfigurationCandidate: false
  }
];

export const initialFloorPlan: FloorPlanData = {
  id: 'plan_201',
  buildingId: 'bld_01',
  floorId: 'flr_02',
  unitId: 'unt_201',
  title: 'مخطط الوضع القائم للشقة 201 - الدور الثاني (210 م²)',
  scale: 40, // 40px = 1m
  width: 900,
  height: 600,
  status: 'Approved',
  version: 1,
  elements: [
    // Outer perimeter walls
    { id: 'w_ext_top', type: 'wall', x: 50, y: 50, width: 800, height: 14, label: 'جدار واجهة خارجي' },
    { id: 'w_ext_bot', type: 'wall', x: 50, y: 530, width: 800, height: 14, label: 'جدار خارجي' },
    { id: 'w_ext_left', type: 'wall', x: 50, y: 50, width: 14, height: 494, label: 'جدار جار' },
    { id: 'w_ext_right', type: 'wall', x: 836, y: 50, width: 14, height: 494, label: 'جدار ممر عام' },
    
    // Structural columns (MUST NEVER BE MOVED)
    { id: 'col_1', type: 'column', x: 50, y: 50, width: 28, height: 28, label: 'عمود C1', isRestricted: true },
    { id: 'col_2', type: 'column', x: 440, y: 50, width: 28, height: 28, label: 'عمود C2', isRestricted: true },
    { id: 'col_3', type: 'column', x: 822, y: 50, width: 28, height: 28, label: 'عمود C3', isRestricted: true },
    { id: 'col_4', type: 'column', x: 50, y: 280, width: 28, height: 28, label: 'عمود C4', isRestricted: true },
    { id: 'col_5', type: 'column', x: 440, y: 280, width: 28, height: 28, label: 'عمود C5', isRestricted: true },
    { id: 'col_6', type: 'column', x: 822, y: 280, width: 28, height: 28, label: 'عمود C6', isRestricted: true },
    { id: 'col_7', type: 'column', x: 50, y: 516, width: 28, height: 28, label: 'عمود C7', isRestricted: true },
    { id: 'col_8', type: 'column', x: 440, y: 516, width: 28, height: 28, label: 'عمود C8', isRestricted: true },
    { id: 'col_9', type: 'column', x: 822, y: 516, width: 28, height: 28, label: 'عمود C9', isRestricted: true },

    // Plumbing shaft (wet stack)
    { id: 'shaft_1', type: 'shaft', x: 440, y: 220, width: 35, height: 45, label: 'منور سباكة وصرف رئيسي (MEP)', isRestricted: true },
    { id: 'shaft_2', type: 'shaft', x: 780, y: 350, width: 30, height: 40, label: 'منور تكييف وصرف', isRestricted: true },

    // Existing internal partition walls (demolishable)
    { id: 'w_part_mid_h', type: 'wall', x: 64, y: 280, width: 376, height: 10, label: 'جدار قاطع' },
    { id: 'w_part_mid_v', type: 'wall', x: 440, y: 64, width: 10, height: 216, label: 'جدار قاطع فاصل الصالة' },
    { id: 'w_part_bed1', type: 'wall', x: 250, y: 64, width: 10, height: 216, label: 'فاصل غرفة نوم 1' },
    { id: 'w_part_corr', type: 'wall', x: 450, y: 380, width: 386, height: 10, label: 'جدار ممر الغرف' },

    // Doors
    { id: 'door_main1', type: 'door', x: 836, y: 120, width: 14, height: 35, label: 'مدخل رئيسي 1' },
    { id: 'door_main2', type: 'door', x: 836, y: 440, width: 14, height: 35, label: 'مدخل خدمة 2' },

    // Windows
    { id: 'win_1', type: 'window', x: 120, y: 50, width: 60, height: 14, label: 'نافذة واجهة W1' },
    { id: 'win_2', type: 'window', x: 300, y: 50, width: 60, height: 14, label: 'نافذة واجهة W2' },
    { id: 'win_3', type: 'window', x: 560, y: 50, width: 80, height: 14, label: 'نافذة صالة W3' },
    { id: 'win_4', type: 'window', x: 140, y: 530, width: 60, height: 14, label: 'نافذة نوم W4' },
    { id: 'win_5', type: 'window', x: 620, y: 530, width: 60, height: 14, label: 'نافذة W5' },

    // Rooms
    { id: 'rm_salon', type: 'room', x: 470, y: 80, width: 340, height: 180, label: 'مجلس وصالة ضيوف (65 م²)', roomType: 'Living', areaM2: 65 },
    { id: 'rm_bed1', type: 'room', x: 70, y: 80, width: 170, height: 180, label: 'غرفة نوم رئيسية (32 م²)', roomType: 'Bedroom', areaM2: 32 },
    { id: 'rm_bed2', type: 'room', x: 265, y: 80, width: 165, height: 180, label: 'غرفة نوم 2 (28 م²)', roomType: 'Bedroom', areaM2: 28 },
    { id: 'rm_kitchen', type: 'wet_area', x: 470, y: 395, width: 160, height: 120, label: 'مطبخ قائم (22 م²)', roomType: 'Kitchen', areaM2: 22 },
    { id: 'rm_bath1', type: 'wet_area', x: 360, y: 220, width: 70, height: 50, label: 'دورة مياه (5.5 م²)', roomType: 'Bathroom', areaM2: 5.5 }
  ]
};

export const initialScenarios: ReconfigurationScenario[] = [
  {
    id: 'scen_a',
    unitId: 'unt_201',
    floorId: 'flr_02',
    buildingId: 'bld_01',
    code: 'A',
    title: 'Scenario A: Baseline Modern Renovation (Keep 3-Bedroom)',
    titleAr: 'السيناريو أ: تجديد عصري شامل مع الإبقاء على 3 غرف نوم',
    description: 'Renovate existing finishes, bathrooms, and kitchen without altering unit partition layout.',
    descriptionAr: 'تجديد تشطيبات الشقة بالكامل، تغيير دورات المياه، تركيب مطبخ مفتوح فاخر، بدون هدم جدران أو تغيير عدد الوحدات.',
    targetObjective: 'min_cost',
    resultingUnitsCount: 1,
    unitMix: [{ type: '3 Bedroom', count: 1, avgArea: 210 }],
    demolishedWallsLengthM: 4.5,
    newWallsLengthM: 2.0,
    wetAreaModifications: 'Minor',
    mepImpactLevel: 'Low',
    spaceEfficiencyScore: 78,
    renovationComplexity: 'Low',
    estimatedCostSar: 95000,
    estimatedDurationWeeks: 6,
    structuralRisk: 'None',
    currentMonthlyRentalSar: 5500,
    projectedMonthlyRentalSar: 7200,
    usableAreaM2: 178,
    circulationAreaM2: 32,
    status: 'Approved',
    planElements: []
  },
  {
    id: 'scen_b',
    unitId: 'unt_201',
    floorId: 'flr_02',
    buildingId: 'bld_01',
    code: 'B',
    title: 'Scenario B: Dual Independent Units (1BR + 2BR)',
    titleAr: 'السيناريو ب: تحويل الشقة إلى شقتين مستقلتين (غرفة وصالة + غرفتين وصالة)',
    description: 'Utilize the two existing entrance doors to divide the unit into 2 distinct rentable apartments with independent metering.',
    descriptionAr: 'استغلال وجود مدخلين قائمين للشقة لفصلها إلى وحدتين سكنيتين مستقلتين: شقة غرفتين وصالة (120 م²) وشقة غرفة وصالة (90 م²) مع عدادات مستقلة.',
    targetObjective: 'best_rental_yield',
    resultingUnitsCount: 2,
    unitMix: [
      { type: '2 Bedroom', count: 1, avgArea: 120 },
      { type: '1 Bedroom', count: 1, avgArea: 90 }
    ],
    demolishedWallsLengthM: 18.0,
    newWallsLengthM: 26.5,
    wetAreaModifications: 'Moderate',
    mepImpactLevel: 'Medium',
    spaceEfficiencyScore: 89,
    renovationComplexity: 'Moderate',
    estimatedCostSar: 165000,
    estimatedDurationWeeks: 10,
    structuralRisk: 'None', // Uses non-load bearing drywalls only, avoids all columns
    currentMonthlyRentalSar: 5500,
    projectedMonthlyRentalSar: 11500, // 6,500 + 5,000 SAR
    usableAreaM2: 194,
    circulationAreaM2: 16,
    isPreferred: true,
    status: 'Approved',
    planElements: []
  },
  {
    id: 'scen_c',
    unitId: 'unt_201',
    floorId: 'flr_02',
    buildingId: 'bld_01',
    code: 'C',
    title: 'Scenario C: Three Premium Executive Studios (Serviced)',
    titleAr: 'السيناريو ج: تحويل الشقة إلى 3 استوديوهات فاخرة للمهنيين والشركات',
    description: 'Maximize density by creating 3 high-yield boutique studios (65-72 m² each) targeting corporate rentals and young professionals in North Riyadh.',
    descriptionAr: 'تحقيق أعلى عائد إيجاري من خلال تحويل المساحة إلى 3 استوديوهات فندقية عصرية بمساحة 65-72 م² مجهزة بمطبخ كيتشينت ودورة مياه خاصة لكل استوديو.',
    targetObjective: 'max_units',
    resultingUnitsCount: 3,
    unitMix: [
      { type: 'Studio', count: 3, avgArea: 70 }
    ],
    demolishedWallsLengthM: 32.0,
    newWallsLengthM: 42.0,
    wetAreaModifications: 'Major',
    mepImpactLevel: 'High',
    spaceEfficiencyScore: 93,
    renovationComplexity: 'High',
    estimatedCostSar: 225000,
    estimatedDurationWeeks: 14,
    structuralRisk: 'None',
    currentMonthlyRentalSar: 5500,
    projectedMonthlyRentalSar: 14400, // 3 x 4,800 SAR
    usableAreaM2: 198,
    circulationAreaM2: 12,
    status: 'Under Review',
    planElements: []
  },
  {
    id: 'scen_d',
    unitId: 'unt_201',
    floorId: 'flr_02',
    buildingId: 'bld_01',
    code: 'D',
    title: 'Scenario D: 1 Two-Bedroom Family Suite + 1 Studio',
    titleAr: 'السيناريو د: شقة عائلية غرفتين نوم + استوديو مخدوم مستقل',
    description: 'Balanced layout offering a comfortable 2-bedroom home plus a rentable independent studio to offset mortgage or increase cash flow.',
    descriptionAr: 'توزيع متوازن يوفر شقة عائلية (140 م²) مع استوديو مستقل بمدخل منفصل (70 م²) لتحقيق عائد إيجاري إضافي.',
    targetObjective: 'balanced_layout',
    resultingUnitsCount: 2,
    unitMix: [
      { type: '2 Bedroom', count: 1, avgArea: 140 },
      { type: 'Studio', count: 1, avgArea: 70 }
    ],
    demolishedWallsLengthM: 14.5,
    newWallsLengthM: 19.0,
    wetAreaModifications: 'Minor',
    mepImpactLevel: 'Medium',
    spaceEfficiencyScore: 86,
    renovationComplexity: 'Moderate',
    estimatedCostSar: 145000,
    estimatedDurationWeeks: 8,
    structuralRisk: 'None',
    currentMonthlyRentalSar: 5500,
    projectedMonthlyRentalSar: 10200,
    usableAreaM2: 188,
    circulationAreaM2: 22,
    status: 'Draft',
    planElements: []
  }
];

export const initialConditionItems: ConditionAssessmentItem[] = [
  {
    id: 'cond_01',
    buildingId: 'bld_01',
    floorId: 'flr_02',
    unitId: 'unt_201',
    spaceName: 'الحمامات والمطابخ (الوحدة 201)',
    discipline: 'Plumbing',
    systemName: 'شبكة التغذية والصرف والمحابس',
    condition: 'POOR',
    priority: 'HIGH',
    notes: 'تسريب خفيف في محبس التغذية الرئيسي، تلف في عوازل أرضيات دورة المياه يحتاج تجديد طبقة العزل المائي قبل أي بلاط جديد.',
    estimatedAction: 'إزالة البلاط القديم، إعادة تنفيذ عزل إيبوكسي/بيتومين، استبدال مواسير الـ PPR والمحابس الإيطالية.',
    estimatedCostSar: 14000,
    assessedBy: 'م. فهد القحطاني',
    assessedDate: '2026-09-15'
  },
  {
    id: 'cond_02',
    buildingId: 'bld_01',
    floorId: 'flr_02',
    unitId: 'unt_201',
    spaceName: 'نظام التكييف والمجاري الهوائية',
    discipline: 'HVAC',
    systemName: 'وحدات تكييف سبليت ومواسير النحاس',
    condition: 'FAIR',
    priority: 'MEDIUM',
    notes: 'الوحدات الحالية قديمة وتستهلك طاقة كهربائية عالية (SEER منخفض). مواسير النحاس بحالة مقبولة ولكن يلزم تنظيفها واختبار الضغط.',
    estimatedAction: 'استبدال الوحدات بأنظمة إنفرتر موفرة للطاقة متوافقة مع متطلبات كفاءة الطاقة السعودية SASO.',
    estimatedCostSar: 18500,
    assessedBy: 'م. أحمد الشريف',
    assessedDate: '2026-09-15'
  },
  {
    id: 'cond_03',
    buildingId: 'bld_01',
    floorId: 'flr_02',
    spaceName: 'الهيكل الخرساني والأعمدة',
    discipline: 'Structure',
    systemName: 'الأعمدة والجسور الخرسانية',
    condition: 'EXCELLENT',
    priority: 'LOW',
    notes: 'لا توجد أي شروخ إنشائية أو هبوط أو صدأ في حديد التسليح. الهيكل الإنشائي سليم بنسبة 100% وجاهز للأحمال الخفيفة المقترحة للجدران الجبسية.',
    estimatedAction: 'الحفاظ على مناطق الأعمدة بدون أي تكسير، تثبيت القواطع بطريقة ميكانيكية معتمدة.',
    estimatedCostSar: 0,
    assessedBy: 'د. م. طارق العتيبي (استشاري إنشائي)',
    assessedDate: '2026-09-12'
  },
  {
    id: 'cond_04',
    buildingId: 'bld_01',
    spaceName: 'واجهة المبنى الخارجية والمداخل',
    discipline: 'Façade',
    systemName: 'دهانات الواجهة والحجر والإنارة الخارجية',
    condition: 'FAIR',
    priority: 'MEDIUM',
    notes: 'تأثر الدهان الخارجي بعوامل الطقس والغبار، الإنارة الجدارية قديمة وغير جمالية.',
    estimatedAction: 'غسيل الحجر بالرمل، دهان خارجي جوتن جوتاشيلد مقاوم للأتربة، وإضافة إضاءة ليد معمارية مخفية.',
    estimatedCostSar: 35000,
    assessedBy: 'م. ليندا الصالح',
    assessedDate: '2026-09-18'
  },
  {
    id: 'cond_05',
    buildingId: 'bld_01',
    spaceName: 'المصاعد وغرف المحركات',
    discipline: 'Elevators',
    systemName: 'مصعد الركاب الرئيسي (أوتيس)',
    condition: 'GOOD',
    priority: 'LOW',
    notes: 'المصعد يعمل بكفاءة، تم إجراء الصيانة الدورية الشهرية. يوصى فقط بتحديث تكسية الكابينة الداخلية لإعطاء طابع فندقي عصري.',
    estimatedAction: 'تحديث مرآة الكابينة وألواح الستانلس ستيل وشاشات العرض الرقمية.',
    estimatedCostSar: 12000,
    assessedBy: 'شركة صيانة المصاعد المعتمدة',
    assessedDate: '2026-09-10'
  }
];

export const initialBOQItems: BOQItem[] = [
  {
    id: 'boq_01',
    category: 'Demolition',
    itemNumber: 'DEM-01',
    description: 'Demolition of non-load bearing interior partition walls (blockwork/gypsum) including debris bagging, chute handling, and official municipal disposal.',
    descriptionAr: 'هدم وإزالة القواطع الجدارية الداخلية غير الحاملة، مع تنظيف الموقع وترحيل المخلفات إلى المدافن البلدية المعتمدة مع إرفاق بيان التخلص.',
    unit: 'm²',
    quantity: 48,
    unitRateSar: 65,
    totalSar: 3120,
    notes: 'يشمل حماية الأعمدة والمناور المجاورة من الصدمات'
  },
  {
    id: 'boq_02',
    category: 'Drywall',
    itemNumber: 'DW-01',
    description: 'Double-layer acoustic moisture-resistant gypsum partition (Knauf/Gyproc) on heavy galvanized steel studs with 50mm rockwool insulation 50kg/m³.',
    descriptionAr: 'توريد وتركيب قواطع جبسية مزدوجة الطبقات مقاومة للرطوبة والحريق مع عازل صوف صخري كثافة 50 كجم/م³ لعزل الصوت بين الوحدات المستقلة.',
    unit: 'm²',
    quantity: 65,
    unitRateSar: 185,
    totalSar: 12025,
    notes: 'عزل صوتي لا يقل عن 52dB بين الشقق'
  },
  {
    id: 'boq_03',
    category: 'Flooring',
    itemNumber: 'FLR-01',
    description: 'Supply & install 60x120cm first-grade porcelain tiles (Spanish/Saudi Ceramex) including screed leveling, adhesive, and flexible epoxy grout.',
    descriptionAr: 'توريد وتركيب بورسلان فرز أول مقاس 60×120 سم لكامل المساحات المفتوحة والصالات والغرف مع لياسة التسوية وغراء عالي الالتصاق وترويبة إيبوكسية.',
    unit: 'm²',
    quantity: 195,
    unitRateSar: 160,
    totalSar: 31200,
    notes: 'تشمل نعلات مخفية بارتفاع 8 سم'
  },
  {
    id: 'boq_04',
    category: 'Painting',
    itemNumber: 'PNT-01',
    description: 'Interior luxury wall finish (Jotun Fenomastic Pure Colours) 2 coats putty, 1 coat primer, 2 finish coats in matte modern warm tones.',
    descriptionAr: 'دهانات داخلية فاخرة (جوتن فينوماستيك ناصع) تشمل وجهين معجون وجه أساس ووجهين دهان نهائي مطفي قابل للغسيل بالألوان المعتمدة.',
    unit: 'm²',
    quantity: 420,
    unitRateSar: 32,
    totalSar: 13440,
    notes: 'ألوان حيادية حديثة (Warm Off-white / Greige)'
  },
  {
    id: 'boq_05',
    category: 'Bathrooms & Sanitary',
    itemNumber: 'SAN-01',
    description: 'Full bathroom renovation: waterproofing, Italian concealed cistern wall-hung toilets (Grohe/Geberit), walk-in glass shower, and vanity set.',
    descriptionAr: 'تجديد متكامل لدورة المياه: عزل مائي إيبوكسي معتمد، كراسي معلقة سيفون مدفون جروهي، شاور زجاج سيكوريت 10 مم، ومغسلة خشبية مع مرايا ليد.',
    unit: 'set',
    quantity: 3,
    unitRateSar: 9500,
    totalSar: 28500,
    notes: 'ضمان 10 سنوات على العزل والسيفونات'
  },
  {
    id: 'boq_06',
    category: 'Joinery & Kitchen',
    itemNumber: 'KIT-01',
    description: 'Custom contemporary open kitchen cabinet units with quartz countertop, soft-close hinges, undermount sink, and integrated hood/stove cutout.',
    descriptionAr: 'توريد وتركيب مطابخ عصرية مفتوحة خشب HDF مقاوم للرطوبة، أسطح كوارتز صناعي، إكسسوارات بلوم هيدروليك، وحوض ساقط من الستانلس ستيل.',
    unit: 'set',
    quantity: 2,
    unitRateSar: 14500,
    totalSar: 29000,
    notes: 'شامل التمديدات والتوصيلات الكهربائية للأجهزة'
  },
  {
    id: 'boq_07',
    category: 'Electrical & Lighting',
    itemNumber: 'ELE-01',
    description: 'Electrical overhaul: modern distribution panel, smart sub-meters for divided units, magnetic architectural track lighting, and Schneider switches.',
    descriptionAr: 'تحديث اللوحات الكهربائية وإضافة قواطع وعدادات ذكية فرعية لحساب استهلاك كل وحدة، وتركيب مسارات إضاءة مغناطيسية ومفاتيح شنايدر عصرية.',
    unit: 'lump sum',
    quantity: 1,
    unitRateSar: 22000,
    totalSar: 22000,
    notes: 'مطابقة لكود البناء السعودي SBC-401'
  },
  {
    id: 'boq_08',
    category: 'HVAC',
    itemNumber: 'HVC-01',
    description: 'Supply & install energy-efficient Inverter Split AC units (Gree/LG Dual Inverter) including refrigerant copper piping and wireless controllers.',
    descriptionAr: 'توريد وتركيب مكيفات سبليت إنفرتر موفرة للطاقة بطاقة كفاءة 7 نجوم، مع مواسير نحاسية مولر أمريكية ودرين مخفي ومعزول.',
    unit: 'item',
    quantity: 5,
    unitRateSar: 3400,
    totalSar: 17000,
    notes: 'موزعة: وحدتين لكل شقة ووحدة للصالة'
  },
  {
    id: 'boq_09',
    category: 'Doors & Windows',
    itemNumber: 'DOR-01',
    description: 'Solid core acoustic flush doors with magnetic locks and digital smart lock for unit main entrances (fingerprint/passcode/app).',
    descriptionAr: 'أبواب داخلية وخارجية خشب معزول مع أقفال مغناطيسية صامتة، وأقفال ذكية رقمية لمداخل الوحدات (بصمة + رمز + بطاقة).',
    unit: 'item',
    quantity: 6,
    unitRateSar: 1450,
    totalSar: 8700,
    notes: 'مقاومة للحريق لمدة 30 دقيقة للمداخل'
  }
];

export const initialSnags: SnagItem[] = [
  {
    id: 'sng_01',
    buildingId: 'bld_01',
    floorId: 'flr_02',
    unitId: 'unt_201',
    locationDetails: 'مدخل الشقة 201 - الجدار الأيمن',
    category: 'Paint',
    description: 'Uneven paint texture near the entrance switch panel requiring fine sanding and touch-up coat.',
    descriptionAr: 'وجود تموجات في الدهان حول لوحة المفاتيح الكهربائية بجانب المدخل، يلزم صقل ناعم وإعادة وجه تشطيب.',
    priority: 'COSMETIC',
    status: 'Open',
    assignedTo: 'مقاول أعمال الدهانات (مؤسسة الأفق)',
    assignedRole: 'CONTRACTOR',
    dueDate: '2026-10-05',
    createdAt: '2026-09-26'
  },
  {
    id: 'sng_02',
    buildingId: 'bld_01',
    floorId: 'flr_02',
    unitId: 'unt_201',
    locationDetails: 'دورة مياه الضيوف',
    category: 'Plumbing',
    description: 'Slight water pressure drop at bidet spray fixture; needs aerator cleaning and angle valve adjustment.',
    descriptionAr: 'انخفاض في ضغط تدفق شطاف دورة المياه؛ يتطلب تنظيف الفلتر وضبط محبس الزاوية.',
    priority: 'MEDIUM',
    status: 'In Progress',
    assignedTo: 'فني السباكة المعتمد',
    assignedRole: 'CONTRACTOR',
    dueDate: '2026-10-02',
    createdAt: '2026-09-27'
  },
  {
    id: 'sng_03',
    buildingId: 'bld_01',
    floorId: 'flr_02',
    locationDetails: 'ممر الدور الثاني أمام المصعد',
    category: 'Safety',
    description: 'Emergency exit sign luminaire battery test failure; backup unit needs replacement.',
    descriptionAr: 'فشل اختبار البطارية الاحتياطية لكشاف مخرج الطوارئ، يلزم استبدال وحدة التخزين وفق اشتراطات السلامة.',
    priority: 'URGENT',
    status: 'Ready for Inspection',
    assignedTo: 'مهندس السلامة والدفاع المدني',
    assignedRole: 'MEP_ENGINEER',
    dueDate: '2026-09-30',
    createdAt: '2026-09-24'
  }
];

export const initialAuditLogs: AuditLog[] = [
  {
    id: 'log_01',
    action: 'CREATE',
    entity: 'Building',
    entityId: 'bld_01',
    user: 'م. فهد القحطاني',
    userRole: 'ARCHITECT',
    timestamp: '2026-09-12 10:20',
    details: 'إنشاء مبنى عمارة الياسمين السكنية وتوثيق البيانات الأولية وعدد الأدوار'
  },
  {
    id: 'log_02',
    action: 'UPLOAD',
    entity: 'FloorPlan',
    entityId: 'plan_201',
    user: 'م. فهد القحطاني',
    userRole: 'ARCHITECT',
    timestamp: '2026-09-14 14:45',
    details: 'رفع المخطط المعماري القائم للشقة 201 وتحديد الأعمدة الخرسانية المحمية'
  },
  {
    id: 'log_03',
    action: 'CREATE',
    entity: 'Scenario',
    entityId: 'scen_b',
    user: 'م. سارة المهيدب',
    userRole: 'INTERIOR_DESIGNER',
    timestamp: '2026-09-18 11:30',
    details: 'توليد السيناريو (ب): تقسيم الشقة 201 إلى وحدتين مستقلتين مع دراسة العائد'
  },
  {
    id: 'log_04',
    action: 'APPROVE',
    entity: 'Scenario',
    entityId: 'scen_b',
    user: 'عبدالله الراجحي',
    userRole: 'OWNER',
    timestamp: '2026-09-22 16:15',
    details: 'اعتماد السيناريو (ب) كحل مفضل للتنفيذ وإصدار نطاق الأعمال وجدول الكميات'
  }
];
