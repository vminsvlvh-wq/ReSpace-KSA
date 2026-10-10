import React, { useState } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar, ActiveTab } from './components/layout/Sidebar';
import { PortfolioDashboard } from './components/dashboard/PortfolioDashboard';
import { BuildingManager } from './components/building/BuildingManager';
import { PlanEditor } from './components/plan-editor/PlanEditor';
import { ReconfigurationModule } from './components/reconfiguration/ReconfigurationModule';
import { ConditionAssessment } from './components/condition/ConditionAssessment';
import { SiteSurveyMode } from './components/survey/SiteSurveyMode';
import { BOQModule } from './components/boq/BOQModule';
import { FinancialFeasibility } from './components/financial/FinancialFeasibility';
import { SnagListModule } from './components/snags/SnagListModule';
import { AiAdvisor } from './components/ai/AiAdvisor';
import { ClientPresentationMode } from './components/presentation/ClientPresentationMode';
import { ReportExporter } from './components/reports/ReportExporter';
import { GeminiChatbot } from './components/ai/GeminiChatbot';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';
import { OfflinePlanManager } from './components/pwa/OfflinePlanManager';
import { Sparkles, Bot } from 'lucide-react';

function MainAppContent() {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isPresentationMode, setIsPresentationMode] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [isGeminiChatOpen, setIsGeminiChatOpen] = useState<boolean>(false);
  const [showOfflinePlanModal, setShowOfflinePlanModal] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-amber-500/20 selection:text-amber-300 relative">
      {/* Top Header */}
      <Header
        isPresentationMode={isPresentationMode}
        onTogglePresentation={() => setIsPresentationMode(prev => !prev)}
        onOpenReportModal={() => setShowReportModal(true)}
        onOpenGeminiChat={() => setIsGeminiChatOpen(true)}
        onOpenOfflinePlanManager={() => setShowOfflinePlanModal(true)}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onOpenGeminiChat={() => setIsGeminiChatOpen(true)}
        />

        {/* Dynamic Main Workspace Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6">
          {activeTab === 'dashboard' && <PortfolioDashboard onNavigateTab={setActiveTab} />}
          {activeTab === 'buildings' && <BuildingManager />}
          {activeTab === 'plan-editor' && <PlanEditor />}
          {activeTab === 'reconfiguration' && <ReconfigurationModule />}
          {activeTab === 'condition' && <ConditionAssessment />}
          {activeTab === 'site-survey' && <SiteSurveyMode />}
          {activeTab === 'scope-boq' && <BOQModule />}
          {activeTab === 'financial' && <FinancialFeasibility />}
          {activeTab === 'snags' && <SnagListModule />}
          {activeTab === 'ai-advisor' && <AiAdvisor />}
        </main>
      </div>

      {/* Floating Gemini Chatbot Trigger Button (Accessible from any screen) */}
      {!isGeminiChatOpen && (
        <button
          onClick={() => setIsGeminiChatOpen(true)}
          className="fixed bottom-6 end-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-amber-500 via-amber-600 to-sky-600 hover:from-amber-600 hover:to-sky-700 text-slate-950 font-bold text-xs rounded-full shadow-2xl shadow-amber-500/30 hover:scale-105 transition-all group no-print"
          title="مستشار Gemini الذكي للمشروع"
        >
          <div className="w-6 h-6 rounded-full bg-slate-950 text-amber-400 flex items-center justify-center font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
          </div>
          <span className="font-extrabold text-white">
            {language === 'ar' ? 'مستشار Gemini' : 'Gemini AI'}
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </button>
      )}

      {/* Multi-turn Gemini Chatbot Drawer */}
      <GeminiChatbot 
        isOpen={isGeminiChatOpen} 
        onClose={() => setIsGeminiChatOpen(false)} 
      />

      {/* Offline Mode Status Banner */}
      <OfflineIndicator />

      {/* Offline Plans & Cache Management Modal */}
      <OfflinePlanManager 
        isOpen={showOfflinePlanModal} 
        onClose={() => setShowOfflinePlanModal(false)} 
      />

      {/* Full-Screen Presentation Mode Overlay */}
      {isPresentationMode && (
        <ClientPresentationMode onClose={() => setIsPresentationMode(false)} />
      )}

      {/* Exportable PDF Report Modal */}
      {showReportModal && (
        <ReportExporter onClose={() => setShowReportModal(false)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppProvider>
        <MainAppContent />
      </AppProvider>
    </LanguageProvider>
  );
}
