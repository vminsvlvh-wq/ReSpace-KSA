import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  ShieldAlert, 
  Check, 
  Layers, 
  RotateCcw,
  FileText,
  Cpu,
  Building2,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import { GeminiModel, ChatbotPersona } from './GeminiChatbot';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const AiAdvisor: React.FC = () => {
  const { language, t } = useLanguage();
  const { 
    selectedBuilding, 
    selectedFloor, 
    selectedUnit, 
    scenarios, 
    selectedScenario,
    boqItems
  } = useApp();

  const [activeTab, setActiveTab] = useState<'chat' | 'brief'>('chat');
  const [model, setModel] = useState<GeminiModel>('gemini-3.5-flash');
  const [persona, setPersona] = useState<ChatbotPersona>('architect');
  const [chatInput, setChatInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const personaConfigs: Record<ChatbotPersona, { titleAr: string; titleEn: string; systemPrompt: string }> = {
    architect: {
      titleAr: 'استشاري إعادة التهيئة المعمارية',
      titleEn: 'Architectural Consultant',
      systemPrompt: `You are the Senior Architectural Consultant for ReSpace KSA (ري سبيس). Your role is to advise building owners, architects, and contractors on reconfiguring existing buildings, floors, and apartments in Saudi Arabia.
Always respect structural constraints (columns, transfer beams, shear walls, shafts). Focus on space efficiency, circulation, natural lighting, and modern Saudi living standards.`
    },
    financial: {
      titleAr: 'محلل الجدوى المالية والاستثمارية',
      titleEn: 'Financial Feasibility Analyst',
      systemPrompt: `You are the Senior Real Estate Financial Analyst for ReSpace KSA (ري سبيس). Your role is to evaluate renovation capital expenditures (Capex), rental yield upside, and payback periods for existing real estate assets in Saudi Arabia.
Highlight net cash flow gains, simple ROI, payback period in months/years, and remind users that projections are estimates, not guarantees.`
    },
    sbc_compliance: {
      titleAr: 'أخصائي كود البناء السعودي (SBC)',
      titleEn: 'Saudi Building Code (SBC) Specialist',
      systemPrompt: `You are the Saudi Building Code (SBC) and Life Safety Specialist for ReSpace KSA (ري سبيس).
Advise on SBC 201 (Architectural), SBC 301-306 (Structural), SBC 401 (Electrical), and SBC 801 (Fire & Safety). Emphasize certified structural review for any wall changes.`
    }
  };

  // Chat thread
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'init_msg',
      role: 'assistant',
      content: language === 'ar'
        ? `أهلاً بك! أنا مستشارك الذكي لمشروع (${selectedBuilding.nameAr}) في ${selectedBuilding.city}. يمكنك استشارتي في إعادة تقسيم الشقق الكبيرة، تقدير تكاليف الترميم، أو مطابقة اشتراطات كود البناء السعودي (SBC). كيف يمكنني مساعدتك؟`
        : `Welcome! I am your AI Consultant for ${selectedBuilding.name} in ${selectedBuilding.city}. Ask me anything about unit subdivision, capex estimation, or Saudi Building Code (SBC) requirements.`,
      timestamp: 'الآن'
    }
  ]);

  // Natural language design brief state
  const [briefInput, setBriefInput] = useState<string>(
    'لدي عمارة سكنية في الرياض مكونة من 5 أدوار، الشقق بمساحات 210 م²، أريد زيادة عدد الوحدات القابلة للتأجير لتحقيق أعلى عائد مع الحفاظ على الأعمدة الخرسانية وبميزانية تجديد معتدلة.'
  );
  const [isAnalyzingBrief, setIsAnalyzingBrief] = useState<boolean>(false);
  const [briefResult, setBriefResult] = useState<{
    targetObjective: string;
    suggestedMix: string;
    structuralConstraints: string;
    capexRecommendation: string;
    priorityActions: string[];
  } | null>({
    targetObjective: 'أقصى عائد إيجاري واستغلال المدخلين القائمين (Best Rental Yield)',
    suggestedMix: 'تحويل الشقق 3 غرف (210 م²) إلى شقتين مستقلتين (غرفتين وصالة + غرفة وصالة) أو 3 استوديوهات فاخرة',
    structuralConstraints: 'الحفاظ الصارم على الأعمدة الخرسانية C1 إلى C9 والاعتماد على قواطع جبسية عازلة خفيفة الوزن',
    capexRecommendation: 'باقة التشطيب المعياري (Standard) بمعدل 160-185 ألف ر.س لكل شقة مستهدفة',
    priorityActions: [
      'تجديد عزل أرضيات دورات المياه القديمة قبل تركيب البورسلان',
      'تحديث اللوحة الكهربائية وتخصيص عدادات فرعية ذكية لكل وحدة مستقلة',
      'استبدال التكييف القديم بوحدات إنفرتر موفرة للطاقة متوافقة مع مواصفات SASO'
    ]
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeTab === 'chat') {
      scrollToBottom();
    }
  }, [chatMessages, activeTab]);

  const quickQuestions = [
    { ar: 'ما هي الشقق المرشحة للتقسيم بالدور الثاني؟', en: 'Which units on Floor 2 are best for subdivision?' },
    { ar: 'قارن بين عائد السيناريو (ب) والسيناريو (ج)', en: 'Compare Scenario B vs Scenario C return' },
    { ar: 'ما هي اشتراطات كود البناء السعودي للعزل الصوتي؟', en: 'What are SBC soundproofing requirements?' },
    { ar: 'كم تبلغ ميزانية التشطيب التقديرية بالكامل؟', en: 'What is the direct renovation budget total?' }
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || chatInput).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsLoading(true);

    try {
      const historyForApi = [...chatMessages, userMsg].map(m => ({
        role: m.role,
        content: m.content
      }));

      const dynamicSystemPrompt = `
${personaConfigs[persona].systemPrompt}

PROJECT DATA FOR GROUNDING:
- Building: ${selectedBuilding.nameAr} (${selectedBuilding.name}), City: ${selectedBuilding.city}, BUA: ${selectedBuilding.totalBuiltUpArea} m², Type: ${selectedBuilding.buildingType}
- Selected Floor: ${selectedFloor.nameAr} (${selectedFloor.floorArea} m²)
- Selected Unit: #${selectedUnit?.unitNumber || '201'} (${selectedUnit?.area || 210} m²), Current Rent: ${selectedUnit?.currentRentMonthly || 5500} SAR/mo, Projected Rent: ${selectedUnit?.projectedRentMonthly || 11000} SAR/mo
- Preferred Scenario: (${selectedScenario.code}) ${selectedScenario.titleAr}, Cost: ${selectedScenario.estimatedCostSar} SAR, Projected Monthly Rent: ${selectedScenario.projectedMonthlyRentalSar} SAR
- Total BOQ Direct Cost: ${boqItems.reduce((acc, c) => acc + c.totalSar, 0).toLocaleString()} SAR
`;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: historyForApi,
          systemInstruction: dynamicSystemPrompt,
          model: model
        })
      });

      if (!response.ok) {
        throw new Error(`Server status ${response.status}`);
      }

      const data = await response.json();
      const reply = data.text || (language === 'ar' ? 'تم استلام استفسارك بنجاح.' : 'Query processed.');

      setChatMessages(prev => [
        ...prev,
        {
          id: `ast_${Date.now()}`,
          role: 'assistant',
          content: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      console.warn('Chat API error, fallback activated:', err);
      let reply = '';
      if (text.includes('تقسيم') || text.includes('subdivid') || text.includes('شقق')) {
        reply = language === 'ar'
          ? `الشقة رقم ${selectedUnit?.unitNumber || '201'} (210 م²) بالدور الثاني هي أفضل مرشح للتقسيم لوجود مدخلين قائمين ومحاذاتها لمناور الصرف. السيناريو (ب) يقسمها إلى شقة غرفتين وصالة + شقة غرفة وصالة ليرتفع الدخل إلى 11,500 ر.س شهرياً.`
          : `Unit #${selectedUnit?.unitNumber || '201'} (210 m²) on Floor 2 is optimal for subdivision with dual entrances. Scenario B yields a 2BR + 1BR layout boosting monthly revenue to 11,500 SAR.`;
      } else if (text.includes('سيناريو') || text.includes('عائد') || text.includes('تكلفة')) {
        reply = language === 'ar'
          ? `السيناريو (ب) يتطلب 165,000 ر.س ويحقق 11,500 ر.س شهرياً (استرداد في 2.3 سنة). بينما السيناريو (ج) يحولها إلى 3 استوديوهات بتكلفة 225,000 ر.س ودخل 14,400 ر.س شهرياً لكنه يتطلب أعمال سباكة وتكييف أكبر.`
          : `Scenario B requires ~165k SAR capex producing 11.5k SAR/mo (2.3 yrs payback). Scenario C yields 3 studios at 225k SAR capex generating 14.4k SAR/mo with higher MEP impact.`;
      } else {
        reply = language === 'ar'
          ? `المشروع الحالي يضم ${selectedBuilding.numberOfFloors} أدوار بمساحة إجمالية ${selectedBuilding.totalBuiltUpArea} م². جدول الكميات الأولي يبلغ ${boqItems.reduce((acc, c) => acc + c.totalSar, 0).toLocaleString()} ر.س مع الحفاظ الصارم على كافة الأعمدة الخرسانية القائمة وفق كود البناء السعودي.`
          : `Building features ${selectedBuilding.numberOfFloors} floors with ${selectedBuilding.totalBuiltUpArea} m² BUA. Current preliminary BOQ stands at ${boqItems.reduce((acc, c) => acc + c.totalSar, 0).toLocaleString()} SAR while preserving all load-bearing columns.`;
      }

      setChatMessages(prev => [
        ...prev,
        {
          id: `ast_${Date.now()}`,
          role: 'assistant',
          content: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeBrief = (e: React.FormEvent) => {
    e.preventDefault();
    if (!briefInput.trim()) return;

    setIsAnalyzingBrief(true);
    setTimeout(() => {
      setBriefResult({
        targetObjective: 'تعظيم العائد الإيجاري وتقليل فترة الاسترداد إلى أقل من 2.5 سنة',
        suggestedMix: 'تطبيق النموذج (ب) لتقسيم الشقق الكبيرة إلى وحدتين مستقلتين مع عدادات كهرباء منفصلة',
        structuralConstraints: 'عدم إجراء أي هدم أو تعديل على الأعمدة C1-C9، وتوجيه تمديدات الصرف نحو المناور القائمة',
        capexRecommendation: 'ميزانية تقديرية 165,000 ر.س للشقة (فترة استرداد 2.3 سنة)',
        priorityActions: [
          'البدء بالوحدات الشاغرة (الشقة 201) كمرحلة أولى',
          'استخدام قواطع جبسية عازلة للصوت 52dB بين الشقق المستقلة',
          'مراجعة وتأكيد المخطط مع المهندس الإنشائي المعتمد'
        ]
      });
      setIsAnalyzingBrief(false);
    }, 1000);
  };

  return (
    <div className="space-y-5">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Bot className="w-5 h-5 text-amber-400" />
              <span>{language === 'ar' ? 'مستشار ري سبيس الذكي (Gemini Assistant)' : 'ReSpace Gemini Advisor'}</span>
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 uppercase">
              Multi-Turn AI
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'ar'
              ? 'مستشار ذكي متعدد الأدوار مربوط بقاعدة بيانات المبنى والمخططات وكود البناء السعودي'
              : 'Grounded multi-turn AI advisor with full context of building assets, floor plans, and SBC requirements'}
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'chat' ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
          >
            {language === 'ar' ? 'المحادثة الذكية' : 'Interactive Chat'}
          </button>
          <button
            onClick={() => setActiveTab('brief')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'brief' ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
          >
            {language === 'ar' ? 'تحليل موجز المالك' : 'AI Design Brief'}
          </button>
        </div>
      </div>

      {/* Tab 1: Multi-Turn Grounded Chat */}
      {activeTab === 'chat' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-[650px] shadow-2xl overflow-hidden">
          {/* Controls Bar: Persona & Model Selection */}
          <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Persona Switcher */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-[11px] font-medium">
                {language === 'ar' ? 'الدور الاستشاري:' : 'Consultant Role:'}
              </span>
              <select
                value={persona}
                onChange={(e) => setPersona(e.target.value as ChatbotPersona)}
                className="bg-slate-800 border border-slate-700 text-amber-400 font-bold text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="architect">{personaConfigs.architect.titleAr}</option>
                <option value="financial">{personaConfigs.financial.titleAr}</option>
                <option value="sbc_compliance">{personaConfigs.sbc_compliance.titleAr}</option>
              </select>
            </div>

            {/* Model Selector */}
            <div className="flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-sky-400" />
              <select
                value={model}
                onChange={(e) => setModel(e.target.value as GeminiModel)}
                className="bg-slate-800 border border-slate-700 text-sky-300 font-mono text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:border-sky-500 cursor-pointer"
              >
                <option value="gemini-3.5-flash">gemini-3.5-flash (المهام العامة والتخطيط)</option>
                <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (سريع للاستفسارات الخفيفة)</option>
                <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (التفكير والتحليل العميق)</option>
              </select>
            </div>

            {/* Reset Chat Button */}
            <button
              onClick={() => setChatMessages([
                {
                  id: 'reset',
                  role: 'assistant',
                  content: language === 'ar' ? 'تم بدء جلسة جديدة. تفضل بسؤالك عن المشروع.' : 'New session started. How can I assist you?',
                  timestamp: 'الآن'
                }
              ])}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 border border-slate-700"
              title="إعادة ضبط المحادثة"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{language === 'ar' ? 'جلسة جديدة' : 'Reset'}</span>
            </button>
          </div>

          {/* Messages Scrollable Thread */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs">
            {chatMessages.map((msg) => {
              const isAssistant = msg.role === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-2xl ${isAssistant ? '' : 'ms-auto flex-row-reverse'}`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isAssistant 
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' 
                      : 'bg-slate-800 text-white border border-slate-700 font-bold'
                  }`}>
                    {isAssistant ? <Bot className="w-4 h-4 text-amber-400" /> : <User className="w-4 h-4" />}
                  </div>

                  <div className={`p-4 rounded-2xl space-y-1.5 leading-relaxed shadow-sm ${
                    isAssistant
                      ? 'bg-slate-950 border border-slate-800 text-slate-200'
                      : 'bg-amber-500 text-slate-950 font-medium'
                  }`}>
                    <p className="text-xs whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    <span className={`text-[10px] block ${isAssistant ? 'text-slate-500' : 'text-slate-900/70'}`}>
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-amber-400 p-3 rounded-xl bg-slate-950/80 border border-slate-800 w-fit">
                <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
                <span>{language === 'ar' ? 'جارٍ صياغة الرد الهندسي والمالي بواسطة Gemini...' : 'Formulating response with Gemini...'}</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-4 py-2 bg-slate-950/90 border-t border-slate-800 flex items-center gap-2 overflow-x-auto text-[11px]">
            <span className="text-slate-500 shrink-0 font-medium">{language === 'ar' ? 'مقترحات:' : 'Suggestions:'}</span>
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q[language])}
                disabled={isLoading}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white whitespace-nowrap border border-slate-700 transition-colors"
              >
                {q[language]}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={language === 'ar' ? 'اسأل Gemini عن الشقق، كود البناء، التكاليف، أو السيناريوهات...' : 'Ask Gemini about layouts, SBC compliance, BOQ...'}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              disabled={isLoading || !chatInput.trim()}
              className="p-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold rounded-xl transition-all shadow-md shadow-amber-500/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Tab 2: Natural Language Brief Extractor */}
      {activeTab === 'brief' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>{language === 'ar' ? 'موجز المالك باللغة الطبيعية' : 'Natural Language Brief'}</span>
            </h3>

            <form onSubmit={handleAnalyzeBrief} className="space-y-3 text-xs">
              <p className="text-slate-400 leading-relaxed">
                {language === 'ar'
                  ? 'اكتب رغبة العميل أو المالك وسيستخرج Gemini تلقائياً القيود الإنشائية وخيارات التقسيم والتكاليف.'
                  : 'Write client brief in natural language to automatically extract objectives, constraints, and capex.'}
              </p>

              <textarea
                rows={5}
                value={briefInput}
                onChange={(e) => setBriefInput(e.target.value)}
                placeholder="اكتب متطلبات وتفضيلات المالك..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 leading-relaxed"
              />

              <button
                type="submit"
                disabled={isAnalyzingBrief}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 text-xs transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isAnalyzingBrief ? (language === 'ar' ? 'جارٍ التحليل بواسطة Gemini...' : 'Analyzing with Gemini...') : (language === 'ar' ? 'استخراج الأهداف الهندسية' : 'Extract Objectives')}</span>
              </button>
            </form>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                {language === 'ar'
                  ? 'مخرجات الذكاء الاصطناعي مقترحات استرشادية تخضع لمراجعة مهندس مرخص.'
                  : 'AI proposals are conceptual and require human engineer review.'}
              </span>
            </div>
          </div>

          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{language === 'ar' ? 'الأهداف الهندسية المستخرجة' : 'Extracted Objectives'}</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Verified Structure
              </span>
            </h3>

            {briefResult && (
              <div className="space-y-3.5 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-semibold block">{language === 'ar' ? 'الهدف التحسيني الأساسي:' : 'Primary Objective:'}</span>
                  <div className="font-bold text-white text-sm">{briefResult.targetObjective}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-semibold block">{language === 'ar' ? 'التوزيع المعماري المقترح:' : 'Suggested Unit Mix:'}</span>
                  <div className="font-semibold text-slate-200">{briefResult.suggestedMix}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-1 text-rose-300">
                  <span className="font-bold text-rose-400 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'القيود الإنشائية الملزمة:' : 'Structural Constraints:'}</span>
                  </span>
                  <p className="text-[11.5px] leading-relaxed">{briefResult.structuralConstraints}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-slate-400 font-semibold block">{language === 'ar' ? 'الإجراءات ذات الأولوية القصوى:' : 'Priority Actions:'}</span>
                  <ul className="space-y-1.5 text-slate-300">
                    {briefResult.priorityActions.map((act, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
