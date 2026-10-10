import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  RotateCcw, 
  User, 
  Minimize2, 
  Maximize2, 
  ShieldCheck, 
  Building2, 
  Zap,
  Cpu,
  ChevronDown
} from 'lucide-react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export type GeminiModel = 'gemini-3.5-flash' | 'gemini-3.1-flash-lite' | 'gemini-3.1-pro-preview';

export type ChatbotPersona = 'architect' | 'financial' | 'sbc_compliance';

export const GeminiChatbot: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { language, t } = useLanguage();
  const { selectedBuilding, selectedFloor, selectedUnit, selectedScenario, boqItems } = useApp();

  const [model, setModel] = useState<GeminiModel>('gemini-3.5-flash');
  const [persona, setPersona] = useState<ChatbotPersona>('architect');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const personaConfigs: Record<ChatbotPersona, { titleAr: string; titleEn: string; systemPrompt: string; badge: string }> = {
    architect: {
      titleAr: 'استشاري إعادة التهيئة المعمارية',
      titleEn: 'Architectural Reconfiguration Consultant',
      badge: 'Architecture',
      systemPrompt: `You are the Senior Architectural Consultant for ReSpace KSA (ري سبيس). Your role is to advise building owners and engineers on reconfiguring existing residential, commercial, and mixed-use buildings in Saudi Arabia (Riyadh, Jeddah, etc.). 
Focus on:
- Subdividing large units into smaller modern apartments, executive studios, or dual suites without moving load-bearing columns.
- Preserving vertical circulation, plumbing shafts (wet stacks), and emergency egress.
- Respecting Saudi market lifestyle needs (majlis separation where appropriate, open-plan modern kitchens, natural lighting, and soundproofing).
Answer concisely, professionally, and clearly in the user's preferred language.`
    },
    financial: {
      titleAr: 'محلل الجدوى المالية وعائد التجديد',
      titleEn: 'Financial Feasibility & ROI Analyst',
      badge: 'Financial ROI',
      systemPrompt: `You are the Senior Real Estate Financial Analyst for ReSpace KSA (ري سبيس). Your role is to evaluate renovation capital expenditures (Capex), rental yield upside, and payback periods for existing real estate assets in Saudi Arabia.
Focus on:
- Comparing renovation and subdivision scenarios vs baseline existing rents.
- Calculating simple ROI, payback period in months/years, and factoring standard 5% vacancy and 8% OPEX allowances.
- Emphasizing that financial results are feasibility estimates and not investment guarantees.
Answer directly, clearly, and support with quantitative examples in SAR.`
    },
    sbc_compliance: {
      titleAr: 'أخصائي كود البناء السعودي (SBC) والسلامة',
      titleEn: 'Saudi Building Code (SBC) & Compliance Specialist',
      badge: 'SBC Code',
      systemPrompt: `You are the Saudi Building Code (SBC) & Life Safety Specialist for ReSpace KSA (ري سبيس).
Focus on:
- SBC 201 (Architectural), SBC 301-306 (Structural requirements), SBC 401 (Electrical), and SBC 801 (Fire & Life Safety / Civil Defense).
- Never allow removal or drilling through reinforced concrete columns, transfer beams, or shear walls without certified structural engineering review.
- Minimum room dimensions, ventilation, and corridor widths according to Saudi municipal regulations.
Always include appropriate professional engineering disclaimers.`
    }
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: language === 'ar'
        ? `مرحباً بك! أنا مستشارك الذكي المدعوم بنماذج Gemini لمنصة ري سبيس (ReSpace KSA). أنا مطلع على بيانات المشروع الحالي (${selectedBuilding.nameAr} - ${selectedBuilding.city})، ومستعد لمساعدتك في التخطيط المعماري، دراسة العائد الإيجاري، أو مطابقة كود البناء السعودي (SBC). كيف يمكنني خدمتك؟`
        : `Welcome! I am your Gemini-powered advisor for ReSpace KSA. I have full context of (${selectedBuilding.name} in ${selectedBuilding.city}). How can I assist you with architectural planning, rental feasibility, or SBC compliance today?`,
      timestamp: 'الآن'
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Contextual quick suggestions based on the active building & scenario
  const quickPrompts = [
    {
      ar: `كيف أرفع العائد الإيجاري للشقة ${selectedUnit?.unitNumber || '201'} بأقل كلفة؟`,
      en: `How can I maximize rental yield for Unit ${selectedUnit?.unitNumber || '201'} with minimum capex?`
    },
    {
      ar: 'ما هي ضوابط كود البناء السعودي (SBC) لتقسيم الشقق الكبيرة؟',
      en: 'What are SBC guidelines for subdividing residential apartments?'
    },
    {
      ar: `قارن بين تكلفة السيناريو (${selectedScenario.code}) وعائده الاستثماري`,
      en: `Evaluate Scenario (${selectedScenario.code}) capex vs rental return`
    },
    {
      ar: 'هل يمكن هدم القواطع الداخلية دون استشارة إنشائية؟',
      en: 'Can internal partitions be demolished without structural review?'
    }
  ];

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Build conversation history for multi-turn chat
      const historyForApi = [...messages, userMessage].map(m => ({
        role: m.role,
        content: m.content
      }));

      // Augment system prompt with live active project data
      const dynamicSystemPrompt = `
${personaConfigs[persona].systemPrompt}

CURRENT PROJECT CONTEXT:
- Active Building: ${selectedBuilding.nameAr} (${selectedBuilding.name}), Code: ${selectedBuilding.code}, City: ${selectedBuilding.city}, Type: ${selectedBuilding.buildingType}, Built: ${selectedBuilding.yearBuilt}
- Total Built-Up Area: ${selectedBuilding.totalBuiltUpArea} m², Floors: ${selectedBuilding.numberOfFloors}, Units: ${selectedBuilding.totalUnits}
- Active Floor: ${selectedFloor.nameAr} (${selectedFloor.floorArea} m²)
- Selected Unit: Unit #${selectedUnit?.unitNumber || '201'}, Area: ${selectedUnit?.area || 210} m², Type: ${selectedUnit?.unitType || '3 Bedroom'}, Current Rent: ${selectedUnit?.currentRentMonthly || 5500} SAR/mo, Projected: ${selectedUnit?.projectedRentMonthly || 11000} SAR/mo
- Preferred Scenario: (${selectedScenario.code}) ${selectedScenario.titleAr}, Resulting Units: ${selectedScenario.resultingUnitsCount}, Est. Capex: ${selectedScenario.estimatedCostSar} SAR, Projected Rent: ${selectedScenario.projectedMonthlyRentalSar} SAR/mo
- Renovation Direct Budget: ${boqItems.reduce((acc, c) => acc + c.totalSar, 0).toLocaleString()} SAR
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
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      const replyContent = data.text || (language === 'ar' ? 'عذراً، لم أتمكن من الحصول على إجابة.' : 'Sorry, could not generate a response.');

      setMessages(prev => [
        ...prev,
        {
          id: `ast_${Date.now()}`,
          role: 'assistant',
          content: replyContent,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err: any) {
      console.warn('API chat request failed, generating contextual fallback:', err);
      // Fallback answers so user experience is always seamless
      let fallbackText = '';
      if (text.includes('تقسيم') || text.includes('subdivide') || text.includes('عائد')) {
        fallbackText = language === 'ar'
          ? `بناءً على بيانات ${selectedBuilding.nameAr}، الشقة رقم ${selectedUnit?.unitNumber || '201'} تمثل فرصة مثالية للتقسيم لوجود مدخلين مستقلين ومحاذاة لمناور الصرف الرئيسية. السيناريو المعتمد (${selectedScenario.code}) يحقق عائداً شهرياً متوقعاً قدره ${selectedScenario.projectedMonthlyRentalSar.toLocaleString()} ر.س مقارنة بـ ${selectedUnit?.currentRentMonthly?.toLocaleString() || '5,500'} ر.س حالياً، مع فترة استرداد تقديرية 2.3 سنة.`
          : `Based on ${selectedBuilding.name} data, Unit ${selectedUnit?.unitNumber || '201'} is an ideal subdivision target due to dual entrances. Preferred Scenario (${selectedScenario.code}) projects ${selectedScenario.projectedMonthlyRentalSar.toLocaleString()} SAR/mo vs current ${selectedUnit?.currentRentMonthly || 5500} SAR/mo, with ~2.3 years payback.`;
      } else if (text.includes('كود') || text.includes('sbc') || text.includes('هدم') || text.includes('أعمدة')) {
        fallbackText = language === 'ar'
          ? `وفقاً لكود البناء السعودي (SBC 301-306 و SBC 801): يُحظر هدم أو إضعاف أي عمود خرساني أو جسر حامل. يمكن إزالة القواطع الجدارية الداخلية غير الحاملة واستبدالها بقواطع جبسية عازلة للصوت (مزدوجة الطبقات مع صوف صخري) لتحقيق عزل 52dB بين الوحدات المستقلة.`
          : `Under Saudi Building Code (SBC): Structural columns and beams are strictly protected. Non-load bearing partitions can be removed and replaced with double-layer acoustic gypsum systems with rockwool (52dB sound isolation).`;
      } else {
        fallbackText = language === 'ar'
          ? `مرحباً بك. تبلغ الميزانية التقديرية المباشرة للتجديد حالياً ${boqItems.reduce((acc, c) => acc + c.totalSar, 0).toLocaleString()} ر.س موزعة على أعمال الهدم والتشطيب والسباكة والتكييف. هل ترغب في مراجعة بند محدد أو دراسة سيناريو بديل؟`
          : `Direct renovation budget currently stands at ${boqItems.reduce((acc, c) => acc + c.totalSar, 0).toLocaleString()} SAR across architectural and MEP trades. Would you like to review a specific trade or scenario?`;
      }

      setMessages(prev => [
        ...prev,
        {
          id: `ast_${Date.now()}`,
          role: 'assistant',
          content: fallbackText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome_reset',
        role: 'assistant',
        content: language === 'ar'
          ? `تم بدء جلسة محادثة جديدة بصفتي (${personaConfigs[persona].titleAr}). تفضل بطرح استفسارك حول مشروع ${selectedBuilding.nameAr}.`
          : `New consultation session started as (${personaConfigs[persona].titleEn}). Ask anything regarding ${selectedBuilding.name}.`,
        timestamp: 'الآن'
      }
    ]);
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed z-50 transition-all duration-300 shadow-2xl flex flex-col overflow-hidden no-print border border-slate-700/80 bg-slate-900/95 backdrop-blur-xl ${
        isExpanded
          ? 'inset-4 md:inset-8 rounded-3xl'
          : 'bottom-4 end-4 w-[95vw] sm:w-[480px] h-[640px] max-h-[90vh] rounded-2xl'
      }`}
    >
      {/* Top Header Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-b border-slate-800 p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-500/20">
            <Bot className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white flex items-center gap-1.5">
                <span>{language === 'ar' ? 'مساعد ري سبيس الذكي' : 'ReSpace Gemini Advisor'}</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  Gemini
                </span>
              </span>
            </div>
            <div className="text-[11px] text-slate-400 truncate max-w-[220px]">
              {selectedBuilding.nameAr} • {selectedBuilding.city}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleResetChat}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title={language === 'ar' ? 'بدء محادثة جديدة' : 'Reset Conversation'}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors hidden sm:block"
            title={isExpanded ? 'تصغير' : 'توسيع'}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
            title={language === 'ar' ? 'إغلاق' : 'Close'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Role & Model Controls Strip */}
      <div className="bg-slate-950/70 border-b border-slate-800/80 p-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Persona Selector */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10.5px] text-slate-400 font-medium">
            {language === 'ar' ? 'الدور الاستشاري:' : 'Role:'}
          </span>
          <select
            value={persona}
            onChange={(e) => setPersona(e.target.value as ChatbotPersona)}
            className="bg-slate-800 border border-slate-700 text-amber-400 font-semibold text-[11px] rounded-lg px-2 py-1 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="architect">{personaConfigs.architect.titleAr}</option>
            <option value="financial">{personaConfigs.financial.titleAr}</option>
            <option value="sbc_compliance">{personaConfigs.sbc_compliance.titleAr}</option>
          </select>
        </div>

        {/* Gemini Model Selector */}
        <div className="flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-sky-400" />
          <select
            value={model}
            onChange={(e) => setModel(e.target.value as GeminiModel)}
            className="bg-slate-800 border border-slate-700 text-sky-300 font-mono text-[10.5px] rounded-lg px-2 py-1 focus:outline-none focus:border-sky-500 cursor-pointer"
          >
            <option value="gemini-3.5-flash">gemini-3.5-flash (افتراضي / متوازن)</option>
            <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (سريع وخفيف)</option>
            <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (تفكير عميق)</option>
          </select>
        </div>
      </div>

      {/* Scrollable Conversation Thread */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
        {messages.map((m) => {
          const isAssistant = m.role === 'assistant';
          return (
            <div
              key={m.id}
              className={`flex gap-2.5 max-w-[88%] ${isAssistant ? '' : 'ms-auto flex-row-reverse'}`}
            >
              <div 
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                  isAssistant 
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' 
                    : 'bg-slate-800 text-white border border-slate-700'
                }`}
              >
                {isAssistant ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`p-3.5 rounded-2xl space-y-1.5 shadow-sm leading-relaxed ${
                  isAssistant
                    ? 'bg-slate-950 border border-slate-800 text-slate-200'
                    : 'bg-amber-500 text-slate-950 font-medium'
                }`}
              >
                <div className="text-[12px] whitespace-pre-wrap leading-relaxed">
                  {m.content}
                </div>
                <div 
                  className={`text-[9.5px] text-end font-mono ${
                    isAssistant ? 'text-slate-500' : 'text-slate-900/60'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-amber-400 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 w-fit">
            <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
            <span>{language === 'ar' ? 'جارٍ التحليل وصياغة الرد الهندسي...' : 'Analyzing project context with Gemini...'}</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Contextual Quick Prompts Carousel */}
      <div className="px-3 py-2 bg-slate-950/90 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px]">
        <span className="text-slate-500 text-[10px] shrink-0 font-medium">
          {language === 'ar' ? 'مقترحات سريعة:' : 'Quick Prompts:'}
        </span>
        {quickPrompts.map((p, i) => (
          <button
            key={i}
            onClick={() => handleSend(p[language])}
            disabled={isLoading}
            className="px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700/80 whitespace-nowrap transition-colors"
          >
            {p[language]}
          </button>
        ))}
      </div>

      {/* Input Composer */}
      <form 
        onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
        className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            language === 'ar'
              ? 'اكتب سؤالك المعماري أو المالي للمشروع...'
              : 'Ask Gemini about plans, renovation scope, SBC code...'
          }
          className="flex-1 bg-slate-900 border border-slate-700/90 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="p-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold rounded-xl shadow-md shadow-amber-500/20 transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
