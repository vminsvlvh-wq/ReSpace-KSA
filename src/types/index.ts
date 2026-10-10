export type Language = 'ar' | 'en';

export type UserRole = 
  | 'OWNER'
  | 'ADMIN'
  | 'ARCHITECT'
  | 'INTERIOR_DESIGNER'
  | 'STRUCTURAL_ENGINEER'
  | 'MEP_ENGINEER'
  | 'PROJECT_MANAGER'
  | 'CONTRACTOR'
  | 'CLIENT'
  | 'VIEWER';

export type BuildingType = 
  | 'Residential'
  | 'Commercial'
  | 'Office'
  | 'Mixed-use'
  | 'Hospitality'
  | 'Retail'
  | 'Medical'
  | 'Educational'
  | 'Other';

export type ConditionLevel = 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'REPLACE';

export type PriorityLevel = 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW' | 'COSMETIC';

export type OccupancyStatus = 'Vacant' | 'Occupied' | 'Under Renovation' | 'Unavailable';

export type UnitType = 
  | 'Studio'
  | '1 Bedroom'
  | '2 Bedroom'
  | '3 Bedroom'
  | '4 Bedroom+'
  | 'Office'
  | 'Shop'
  | 'Clinic'
  | 'Other';

export interface Company {
  id: string;
  name: string;
  crNumber?: string;
  taxNumber?: string;
  city: string;
  country: string;
}

export interface Portfolio {
  id: string;
  companyId: string;
  name: string;
  description?: string;
  buildingIds: string[];
}

export interface Building {
  id: string;
  companyId: string;
  portfolioId: string;
  name: string;
  nameAr: string;
  code: string;
  address: string;
  city: string;
  district: string;
  country: string;
  yearBuilt: number;
  buildingType: BuildingType;
  numberOfFloors: number;
  basements: number;
  parkingFloors: number;
  totalUnits: number;
  totalBuiltUpArea: number; // m²
  landArea: number; // m²
  parkingSpaces: number;
  numberOfElevators: number;
  occupancyStatus: 'Fully Occupied' | 'Partially Occupied' | 'Vacant';
  currentUse: string;
  overallCondition: ConditionLevel;
  notes: string;
  images: string[];
  floorsCount: number;
}

export interface Floor {
  id: string;
  buildingId: string;
  floorNumber: number; // e.g. -1, 0 (ground), 1, 2...
  name: string;
  nameAr: string;
  floorArea: number; // m²
  numberOfUnits: number;
  commonArea: number; // m²
  serviceArea: number; // m²
  corridorArea: number; // m²
  verticalCirculation: number; // m²
  notes: string;
  floorPlanUrl?: string;
  repeatedOnFloors?: number[]; // e.g. [2, 3, 4, 5]
  units: Unit[];
}

export interface Unit {
  id: string;
  buildingId: string;
  floorId: string;
  unitNumber: string;
  unitType: UnitType;
  area: number; // m²
  bedrooms: number;
  bathrooms: number;
  kitchens: number;
  livingRooms: number;
  diningRooms: number;
  balconies: number;
  storage: number;
  utilityRoom: boolean;
  entranceCount: number;
  occupancyStatus: OccupancyStatus;
  currentRentMonthly?: number; // SAR
  projectedRentMonthly?: number; // SAR
  condition: ConditionLevel;
  notes?: string;
  photos: string[];
  reconfigurationCandidate?: boolean;
}

export interface PlanElement {
  id: string;
  type: 'wall' | 'structural_wall' | 'column' | 'door' | 'window' | 'wet_area' | 'room' | 'shaft' | 'corridor';
  x: number;
  y: number;
  width?: number;
  height?: number;
  x2?: number;
  y2?: number;
  rotation?: number;
  label?: string;
  isRestricted?: boolean; // Cannot be demolished without structural permit
  roomType?: string;
  areaM2?: number;
}

export interface FloorPlanData {
  id: string;
  buildingId: string;
  floorId: string;
  unitId?: string;
  title: string;
  scale: number; // pixels per meter
  width: number;
  height: number;
  elements: PlanElement[];
  backgroundImageUrl?: string;
  status: 'Draft' | 'Under Review' | 'Approved';
  version: number;
}

export type OptimizationObjective = 
  | 'max_units'
  | 'max_usable_area'
  | 'min_cost'
  | 'min_structural_changes'
  | 'best_efficiency'
  | 'best_rental_yield'
  | 'largest_living_areas'
  | 'balanced_layout';

export interface ReconfigurationScenario {
  id: string;
  unitId?: string;
  floorId: string;
  buildingId: string;
  code: string; // Scenario A, B, C...
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  targetObjective: OptimizationObjective;
  resultingUnitsCount: number;
  unitMix: { type: UnitType; count: number; avgArea: number }[];
  demolishedWallsLengthM: number;
  newWallsLengthM: number;
  wetAreaModifications: 'None' | 'Minor' | 'Moderate' | 'Major';
  mepImpactLevel: 'Low' | 'Medium' | 'High';
  spaceEfficiencyScore: number; // % e.g. 88%
  renovationComplexity: 'Low' | 'Moderate' | 'High' | 'Extensive';
  estimatedCostSar: number;
  estimatedDurationWeeks: number;
  structuralRisk: 'None' | 'Low' | 'Requires Structural Review';
  projectedMonthlyRentalSar: number;
  currentMonthlyRentalSar: number;
  usableAreaM2: number;
  circulationAreaM2: number;
  isPreferred?: boolean;
  status: 'Draft' | 'Under Review' | 'Approved' | 'Rejected';
  planElements: PlanElement[];
}

export interface ConditionAssessmentItem {
  id: string;
  buildingId: string;
  floorId?: string;
  unitId?: string;
  spaceName: string;
  discipline: 'Architecture' | 'Structure' | 'Electrical' | 'Plumbing' | 'HVAC' | 'Fire Systems' | 'Façade' | 'Finishes' | 'Elevators';
  systemName: string;
  condition: ConditionLevel;
  priority: PriorityLevel;
  notes: string;
  estimatedAction: string;
  photoUrl?: string;
  estimatedCostSar?: number;
  assessedBy: string;
  assessedDate: string;
}

export interface BOQItem {
  id: string;
  category: 'Demolition' | 'Masonry' | 'Drywall' | 'Flooring' | 'Ceiling' | 'Painting' | 'Doors & Windows' | 'Joinery & Kitchen' | 'Bathrooms & Sanitary' | 'Plumbing & Drainage' | 'Electrical & Lighting' | 'HVAC' | 'Façade' | 'Common Areas';
  itemNumber: string;
  description: string;
  descriptionAr: string;
  unit: 'm²' | 'm' | 'item' | 'point' | 'lump sum' | 'set';
  quantity: number;
  unitRateSar: number;
  totalSar: number;
  notes?: string;
}

export interface SnagItem {
  id: string;
  buildingId: string;
  floorId: string;
  unitId?: string;
  locationDetails: string;
  category: 'Finishes' | 'MEP' | 'Carpentry' | 'Paint' | 'Masonry' | 'Plumbing' | 'Safety';
  description: string;
  descriptionAr: string;
  priority: PriorityLevel;
  status: 'Open' | 'In Progress' | 'Ready for Inspection' | 'Closed';
  assignedTo: string;
  assignedRole: UserRole;
  dueDate: string;
  photoUrl?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface SurveyOfflineItem {
  id: string;
  timestamp: number;
  buildingId: string;
  floorId: string;
  unitId?: string;
  spaceTag: string;
  condition: ConditionLevel;
  priority: PriorityLevel;
  notes: string;
  voiceNoteTranscript?: string;
  hasPhoto: boolean;
  photoPreview?: string;
  isSynced: boolean;
}

export interface AuditLog {
  id: string;
  action: 'CREATE' | 'EDIT' | 'DELETE' | 'RESTORE' | 'APPROVE' | 'REJECT' | 'EXPORT' | 'UPLOAD';
  entity: string;
  entityId: string;
  user: string;
  userRole: UserRole;
  timestamp: string;
  details: string;
}

export type FinishPackage = 'Economic' | 'Standard' | 'Premium' | 'Luxury';
