import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Building,
  Floor,
  Unit,
  ReconfigurationScenario,
  ConditionAssessmentItem,
  BOQItem,
  SnagItem,
  FloorPlanData,
  PlanElement,
  UserRole,
  SurveyOfflineItem,
  AuditLog,
  Company,
  Portfolio,
  FinishPackage
} from '../types';
import {
  initialCompany,
  initialPortfolio,
  initialBuildings,
  initialFloors,
  initialUnits,
  initialFloorPlan,
  initialScenarios,
  initialConditionItems,
  initialBOQItems,
  initialSnags,
  initialAuditLogs
} from '../data/mockData';

interface AppContextType {
  company: Company;
  portfolio: Portfolio;
  buildings: Building[];
  selectedBuilding: Building;
  setSelectedBuilding: (b: Building) => void;
  floors: Floor[];
  selectedFloor: Floor;
  setSelectedFloor: (f: Floor) => void;
  units: Unit[];
  selectedUnit: Unit | null;
  setSelectedUnit: (u: Unit | null) => void;
  
  // Floor Plans & Tracing
  floorPlan: FloorPlanData;
  setFloorPlan: React.Dispatch<React.SetStateAction<FloorPlanData>>;
  addPlanElement: (element: PlanElement) => void;
  removePlanElement: (id: string) => void;
  updatePlanElement: (id: string, updates: Partial<PlanElement>) => void;
  
  // Reconfiguration Scenarios
  scenarios: ReconfigurationScenario[];
  selectedScenario: ReconfigurationScenario;
  setSelectedScenario: (s: ReconfigurationScenario) => void;
  setPreferredScenario: (id: string) => void;
  addScenario: (s: ReconfigurationScenario) => void;
  
  // Condition Assessments
  conditionItems: ConditionAssessmentItem[];
  addConditionItem: (item: ConditionAssessmentItem) => void;
  updateConditionItem: (id: string, updates: Partial<ConditionAssessmentItem>) => void;
  
  // Site Survey Field Mode & Offline Sync
  offlineQueue: SurveyOfflineItem[];
  addOfflineSurveyItem: (item: Omit<SurveyOfflineItem, 'id' | 'timestamp' | 'isSynced'>) => void;
  syncOfflineQueue: () => void;
  pendingSyncCount: number;
  
  // BOQ & Cost Library
  boqItems: BOQItem[];
  addBOQItem: (item: BOQItem) => void;
  updateBOQItem: (id: string, updates: Partial<BOQItem>) => void;
  deleteBOQItem: (id: string) => void;
  finishPackage: FinishPackage;
  setFinishPackage: (pkg: FinishPackage) => void;
  
  // Snags
  snags: SnagItem[];
  addSnag: (snag: SnagItem) => void;
  updateSnagStatus: (id: string, status: SnagItem['status']) => void;
  
  // User Role & Permissions
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  canEdit: boolean;
  canApprove: boolean;
  
  // Audit Logs
  auditLogs: AuditLog[];
  logAction: (action: AuditLog['action'], entity: string, entityId: string, details: string) => void;
  
  // Helpers
  addBuilding: (b: Omit<Building, 'id' | 'companyId' | 'portfolioId'>) => void;
  duplicateFloorLayout: (sourceFloorId: string, targetFloorNumbers: number[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [company] = useState<Company>(initialCompany);
  const [portfolio] = useState<Portfolio>(initialPortfolio);
  const [buildings, setBuildings] = useState<Building[]>(() => {
    const saved = localStorage.getItem('respace_buildings');
    return saved ? JSON.parse(saved) : initialBuildings;
  });
  const [selectedBuilding, setSelectedBuilding] = useState<Building>(buildings[0] || initialBuildings[0]);

  const [floors, setFloors] = useState<Floor[]>(() => {
    const saved = localStorage.getItem('respace_floors');
    return saved ? JSON.parse(saved) : initialFloors;
  });
  const [selectedFloor, setSelectedFloor] = useState<Floor>(floors[1] || floors[0]);

  const [units, setUnits] = useState<Unit[]>(() => {
    const saved = localStorage.getItem('respace_units');
    return saved ? JSON.parse(saved) : initialUnits;
  });
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(units[0] || null);

  const [floorPlan, setFloorPlan] = useState<FloorPlanData>(() => {
    const saved = localStorage.getItem('respace_floorplan');
    return saved ? JSON.parse(saved) : initialFloorPlan;
  });

  const [scenarios, setScenarios] = useState<ReconfigurationScenario[]>(() => {
    const saved = localStorage.getItem('respace_scenarios');
    return saved ? JSON.parse(saved) : initialScenarios;
  });
  const [selectedScenario, setSelectedScenario] = useState<ReconfigurationScenario>(scenarios[1] || scenarios[0]);

  const [conditionItems, setConditionItems] = useState<ConditionAssessmentItem[]>(() => {
    const saved = localStorage.getItem('respace_condition');
    return saved ? JSON.parse(saved) : initialConditionItems;
  });

  const [offlineQueue, setOfflineQueue] = useState<SurveyOfflineItem[]>(() => {
    const saved = localStorage.getItem('respace_offline_survey');
    return saved ? JSON.parse(saved) : [];
  });

  const [boqItems, setBoqItems] = useState<BOQItem[]>(() => {
    const saved = localStorage.getItem('respace_boq');
    return saved ? JSON.parse(saved) : initialBOQItems;
  });

  const [finishPackage, setFinishPackageState] = useState<FinishPackage>('Standard');

  const [snags, setSnags] = useState<SnagItem[]>(() => {
    const saved = localStorage.getItem('respace_snags');
    return saved ? JSON.parse(saved) : initialSnags;
  });

  const [currentRole, setCurrentRole] = useState<UserRole>('ARCHITECT');

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('respace_audit_logs');
    return saved ? JSON.parse(saved) : initialAuditLogs;
  });

  // Save changes locally
  useEffect(() => {
    localStorage.setItem('respace_buildings', JSON.stringify(buildings));
  }, [buildings]);

  useEffect(() => {
    localStorage.setItem('respace_floors', JSON.stringify(floors));
  }, [floors]);

  useEffect(() => {
    localStorage.setItem('respace_units', JSON.stringify(units));
  }, [units]);

  useEffect(() => {
    localStorage.setItem('respace_floorplan', JSON.stringify(floorPlan));
  }, [floorPlan]);

  useEffect(() => {
    localStorage.setItem('respace_scenarios', JSON.stringify(scenarios));
  }, [scenarios]);

  useEffect(() => {
    localStorage.setItem('respace_condition', JSON.stringify(conditionItems));
  }, [conditionItems]);

  useEffect(() => {
    localStorage.setItem('respace_boq', JSON.stringify(boqItems));
  }, [boqItems]);

  useEffect(() => {
    localStorage.setItem('respace_snags', JSON.stringify(snags));
  }, [snags]);

  useEffect(() => {
    localStorage.setItem('respace_offline_survey', JSON.stringify(offlineQueue));
  }, [offlineQueue]);

  useEffect(() => {
    localStorage.setItem('respace_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  const logAction = (action: AuditLog['action'], entity: string, entityId: string, details: string) => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newLog: AuditLog = {
      id: `log_${Date.now()}`,
      action,
      entity,
      entityId,
      user: currentRole === 'OWNER' ? 'عبدالله الراجحي (المالك)' : currentRole === 'ARCHITECT' ? 'م. فهد القحطاني (معماري)' : 'مستخدم النظام',
      userRole: currentRole,
      timestamp: dateStr,
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const addBuilding = (b: Omit<Building, 'id' | 'companyId' | 'portfolioId'>) => {
    const newId = `bld_${Date.now()}`;
    const newBuilding: Building = {
      ...b,
      id: newId,
      companyId: company.id,
      portfolioId: portfolio.id
    };
    setBuildings(prev => [newBuilding, ...prev]);
    setSelectedBuilding(newBuilding);
    logAction('CREATE', 'Building', newId, `إضافة مبنى جديد: ${newBuilding.nameAr}`);
  };

  const duplicateFloorLayout = (sourceFloorId: string, targetFloorNumbers: number[]) => {
    const sourceFloor = floors.find(f => f.id === sourceFloorId);
    if (!sourceFloor) return;

    const newFloors: Floor[] = targetFloorNumbers.map(fn => ({
      ...sourceFloor,
      id: `flr_${Date.now()}_${fn}`,
      floorNumber: fn,
      name: `Floor ${fn}`,
      nameAr: `الدور ${fn}`,
      repeatedOnFloors: undefined
    }));

    setFloors(prev => [...prev, ...newFloors]);
    logAction('CREATE', 'Floor', sourceFloorId, `تكرار نموذج الدور ${sourceFloor.floorNumber} للأدوار: ${targetFloorNumbers.join(', ')}`);
  };

  // Plan editor
  const addPlanElement = (element: PlanElement) => {
    setFloorPlan(prev => ({
      ...prev,
      elements: [...prev.elements, element],
      version: prev.version + 1
    }));
    logAction('EDIT', 'FloorPlan', floorPlan.id, `إضافة عنصر للمخطط (${element.type})`);
  };

  const removePlanElement = (id: string) => {
    const target = floorPlan.elements.find(el => el.id === id);
    if (target?.isRestricted) {
      alert('تحذير إنشائي حرج: هذا العنصر إنشائي ثابت (عمود أو منور رئيسي) ولا يمكن حذفه إلا بموافقة مهندس إنشائي معتمد.');
      return;
    }
    setFloorPlan(prev => ({
      ...prev,
      elements: prev.elements.filter(el => el.id !== id),
      version: prev.version + 1
    }));
    logAction('DELETE', 'FloorPlan', floorPlan.id, `حذف عنصر من المخطط: ${id}`);
  };

  const updatePlanElement = (id: string, updates: Partial<PlanElement>) => {
    setFloorPlan(prev => ({
      ...prev,
      elements: prev.elements.map(el => el.id === id ? { ...el, ...updates } : el),
      version: prev.version + 1
    }));
  };

  // Reconfiguration scenarios
  const setPreferredScenario = (id: string) => {
    setScenarios(prev => prev.map(s => ({
      ...s,
      isPreferred: s.id === id,
      status: s.id === id ? 'Approved' : s.status === 'Approved' ? 'Draft' : s.status
    })));
    const target = scenarios.find(s => s.id === id);
    if (target) {
      setSelectedScenario(target);
      logAction('APPROVE', 'Scenario', id, `اعتماد السيناريو (${target.code}): ${target.titleAr}`);
    }
  };

  const addScenario = (s: ReconfigurationScenario) => {
    setScenarios(prev => [...prev, s]);
    setSelectedScenario(s);
    logAction('CREATE', 'Scenario', s.id, `توليد سيناريو جديد (${s.code}): ${s.titleAr}`);
  };

  // Condition assessment
  const addConditionItem = (item: ConditionAssessmentItem) => {
    setConditionItems(prev => [item, ...prev]);
    logAction('CREATE', 'ConditionItem', item.id, `إضافة تقييم حالة فنية: ${item.spaceName} - ${item.systemName}`);
  };

  const updateConditionItem = (id: string, updates: Partial<ConditionAssessmentItem>) => {
    setConditionItems(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    logAction('EDIT', 'ConditionItem', id, `تعديل تقييم الحالة الفنية`);
  };

  // Field Survey Offline Mode
  const addOfflineSurveyItem = (item: Omit<SurveyOfflineItem, 'id' | 'timestamp' | 'isSynced'>) => {
    const newItem: SurveyOfflineItem = {
      ...item,
      id: `surv_${Date.now()}`,
      timestamp: Date.now(),
      isSynced: false
    };
    setOfflineQueue(prev => [newItem, ...prev]);
  };

  const syncOfflineQueue = () => {
    // Convert unsynced survey items into real condition assessment and snag items
    const unsynced = offlineQueue.filter(i => !i.isSynced);
    if (unsynced.length === 0) return;

    const newConditions: ConditionAssessmentItem[] = unsynced.map(s => ({
      id: `cond_sync_${s.id}`,
      buildingId: s.buildingId,
      floorId: s.floorId,
      unitId: s.unitId,
      spaceName: s.spaceTag,
      discipline: 'Finishes',
      systemName: s.voiceNoteTranscript ? `ملاحظة صوتية: ${s.voiceNoteTranscript.slice(0, 30)}...` : 'معاينة ميدانية',
      condition: s.condition,
      priority: s.priority,
      notes: `${s.notes} ${s.voiceNoteTranscript ? `(ملاحظة صوتية: ${s.voiceNoteTranscript})` : ''}`,
      estimatedAction: 'مراجعة المعاينة وتحديد نطاق الصيانة',
      assessedBy: 'مهندس المسح الميداني (موبايل)',
      assessedDate: new Date().toISOString().split('T')[0]
    }));

    setConditionItems(prev => [...newConditions, ...prev]);
    setOfflineQueue(prev => prev.map(i => ({ ...i, isSynced: true })));
    logAction('UPLOAD', 'SurveySession', 'offline_batch', `مزامنة ${unsynced.length} سجلات مسح ميداني من وضع عدم الاتصال`);
  };

  // BOQ
  const addBOQItem = (item: BOQItem) => {
    setBoqItems(prev => [...prev, item]);
    logAction('CREATE', 'BOQItem', item.id, `إضافة بند إلى جدول الكميات: ${item.descriptionAr}`);
  };

  const updateBOQItem = (id: string, updates: Partial<BOQItem>) => {
    setBoqItems(prev => prev.map(b => {
      if (b.id === id) {
        const updated = { ...b, ...updates };
        if (updates.quantity !== undefined || updates.unitRateSar !== undefined) {
          updated.totalSar = Number((updated.quantity * updated.unitRateSar).toFixed(2));
        }
        return updated;
      }
      return b;
    }));
  };

  const deleteBOQItem = (id: string) => {
    setBoqItems(prev => prev.filter(b => b.id !== id));
    logAction('DELETE', 'BOQItem', id, `حذف بند من جدول الكميات`);
  };

  const setFinishPackage = (pkg: FinishPackage) => {
    setFinishPackageState(pkg);
    // Multiply rates based on package tier:
    // Economic: 0.75x, Standard: 1.0x, Premium: 1.35x, Luxury: 1.85x
    const multiplier = pkg === 'Economic' ? 0.75 : pkg === 'Standard' ? 1.0 : pkg === 'Premium' ? 1.35 : 1.85;
    setBoqItems(prev => prev.map(b => {
      const baseRate = initialBOQItems.find(i => i.id === b.id)?.unitRateSar || b.unitRateSar;
      const newRate = Math.round(baseRate * multiplier);
      return {
        ...b,
        unitRateSar: newRate,
        totalSar: Number((b.quantity * newRate).toFixed(2))
      };
    }));
    logAction('EDIT', 'FinishPackage', pkg, `تغيير باقة التشطيب إلى (${pkg}) وإعادة تسعير جدول الكميات`);
  };

  // Snags
  const addSnag = (snag: SnagItem) => {
    setSnags(prev => [snag, ...prev]);
    logAction('CREATE', 'SnagItem', snag.id, `تسجيل ملاحظة فنية: ${snag.descriptionAr}`);
  };

  const updateSnagStatus = (id: string, status: SnagItem['status']) => {
    setSnags(prev => prev.map(s => s.id === id ? {
      ...s,
      status,
      resolvedAt: status === 'Closed' ? new Date().toISOString().split('T')[0] : s.resolvedAt
    } : s));
    logAction('EDIT', 'SnagItem', id, `تحديث حالة الملاحظة إلى: ${status}`);
  };

  const canEdit = currentRole !== 'VIEWER' && currentRole !== 'CLIENT';
  const canApprove = currentRole === 'OWNER' || currentRole === 'ADMIN' || currentRole === 'PROJECT_MANAGER';
  const pendingSyncCount = offlineQueue.filter(i => !i.isSynced).length;

  return (
    <AppContext.Provider
      value={{
        company,
        portfolio,
        buildings,
        selectedBuilding,
        setSelectedBuilding,
        floors,
        selectedFloor,
        setSelectedFloor,
        units,
        selectedUnit,
        setSelectedUnit,
        floorPlan,
        setFloorPlan,
        addPlanElement,
        removePlanElement,
        updatePlanElement,
        scenarios,
        selectedScenario,
        setSelectedScenario,
        setPreferredScenario,
        addScenario,
        conditionItems,
        addConditionItem,
        updateConditionItem,
        offlineQueue,
        addOfflineSurveyItem,
        syncOfflineQueue,
        pendingSyncCount,
        boqItems,
        addBOQItem,
        updateBOQItem,
        deleteBOQItem,
        finishPackage,
        setFinishPackage,
        snags,
        addSnag,
        updateSnagStatus,
        currentRole,
        setCurrentRole,
        canEdit,
        canApprove,
        auditLogs,
        logAction,
        addBuilding,
        duplicateFloorLayout
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
