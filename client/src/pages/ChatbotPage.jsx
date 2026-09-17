import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Button, Badge } from '../components/common/index';
import { Send, Bot, User, Sparkles, RefreshCw, HelpCircle, BookOpen, AlertCircle, Copy, Check } from 'lucide-react';

const cannedResponses = {
  cpi: `### Consumer Price Index (CPI) Compilation in MoSPI

The Consumer Price Index (CPI) measures changes over time in the general level of prices of goods and services that a reference population acquires, uses or pays for consumption.

1. **Base Year**: Currently **2012 = 100** (revised periodically by the Central Statistics Office / MoSPI).
2. **Weighting Diagram**: Derived from the Consumer Expenditure Survey (CES) conducted by NSSO.
3. **Data Collection**:
   - Rural prices collected from **1,181 villages** across all States/UTs by Department of Posts.
   - Urban prices collected from **1,114 quotations** across 310 selected towns by FOD field investigators.
4. **Formula**: Modified Laspeyres' formula with chained elementary aggregates:
   $$I_t = \\sum \\left( \\frac{P_{it}}{P_{i0}} \\times W_i \\right)$$`,

  sampling: `### Sampling Variance Calculation for NSS 80th Round

In the National Sample Survey (NSS) multi-stage stratified sampling design:

- **First Stage Units (FSUs)**: Census villages in rural sector and Urban Frame Survey (UFS) blocks in urban sector.
- **Second Stage Units (SSUs)**: Households or enterprises.
- **Variance Estimation**: NSS employs the **Sub-sample Method** for unbiased variance calculation:
  $$Var(\\hat{Y}) = \\frac{1}{k(k-1)} \\sum_{s=1}^{k} (\\hat{Y}_s - \\hat{Y})^2$$
  where $k$ is the number of independent sub-samples (typically $k = 2$) and $\\hat{Y}_s$ is the estimate based on sub-sample $s$.`,

  igot: `### Mandatory iGOT Karmayogi Modules for SSS/ISS Officers

Under the National Programme for Civil Services Capacity Building (Mission Karmayogi):

1. **Official Statistics Foundation** (Course ID: *IGOT-MOSPI-101*) &bull; 4 Hours
2. **National Accounts Statistics & GVA** (Course ID: *IGOT-MOSPI-204*) &bull; 6 Hours
3. **Public Procurement & GeM Essentials** (Course ID: *IGOT-PROC-102*) &bull; 3 Hours
4. **Data Protection, Privacy & Government Cyber Ethics** (Course ID: *IGOT-IT-301*) &bull; 2.5 Hours

*Completion Deadline*: All cadre officers must achieve 100% compliance before the Q3 APAR appraisal cycle.`,

  practice: `### Practice Questions: Gross Value Added (GVA)

**Q1: How is GVA at Basic Prices linked to GDP at Market Prices?**
- *Answer*: $\\text{GDP at Market Prices} = \\text{GVA at Basic Prices} + \\text{Product Taxes} - \\text{Product Subsidies}$.

**Q2: What is the difference between Production Taxes and Product Taxes?**
- *Answer*: Production taxes are paid irrespective of production volume (e.g., land revenue, stamp duties), whereas product taxes depend directly on quantity/value produced (e.g., GST, excise duty).

**Q3: Which database is predominantly used for compiling GVA for the private corporate manufacturing sector?**
- *Answer*: MCA-21 database maintained by the Ministry of Corporate Affairs.`
};

export default function ChatbotPage() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([
    {
      id: 'm-1',
      sender: 'bot',
      text: `Namaste! I am **MoSPI Sahayak**, your AI Adaptive Learning Assistant. 

I can assist you with:
- MoSPI statistical methodologies (CPI, IIP, GDP, NSS sampling)
- iGOT Karmayogi course curriculum and recommendations
- Assessment preparations and practice questions
- Cadre guidelines and reporting workflows.

How may I assist your learning today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (textToSend) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg = {
      id: `m-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      let botAnswer = '';
      const q = query.toLowerCase();
      if (q.includes('cpi') || q.includes('consumer price') || q.includes('index')) {
        botAnswer = cannedResponses.cpi;
      } else if (q.includes('sampling') || q.includes('variance') || q.includes('nss')) {
        botAnswer = cannedResponses.sampling;
      } else if (q.includes('igot') || q.includes('mandatory') || q.includes('course') || q.includes('karmayogi')) {
        botAnswer = cannedResponses.igot;
      } else if (q.includes('practice') || q.includes('gva') || q.includes('question')) {
        botAnswer = cannedResponses.practice;
      } else {
        botAnswer = `Based on the **Ministry of Statistics and Programme Implementation (MoSPI)** guidelines:

Regarding your query **"${query}"**:
- In official data pipelines, ensure adherence to the National Quality Assurance Framework (NQAF).
- For further conceptual drilldown, refer to the accredited training modules in the **Courses** section or take the specialized diagnostic assessment in the **Assessment Player**.
- Would you like me to generate a 5-question mock quiz on this topic?`;
      }

      setMessages(prev => [
        ...prev,
        {
          id: `m-${Date.now() + 1}`,
          sender: 'bot',
          text: botAnswer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
    }, 700);
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="page-container max-w-5xl mx-auto py-8 px-4 sm:px-6 h-[calc(100vh-5rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b flex-shrink-0" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-900 text-amber-400 flex items-center justify-center font-bold shadow">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
                MoSPI Sahayak &bull; AI Learning Tutor
              </h1>
              <Badge variant="info">Mission Karmayogi AI</Badge>
            </div>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              Domain-tuned assistant for official statistics, survey methodology, and cadre training
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          icon={RefreshCw}
          onClick={() => setMessages([messages[0]])}
        >
          Reset Chat
        </Button>
      </div>

      {/* Suggested prompts */}
      <div className="flex items-center gap-2 py-3 overflow-x-auto text-xs flex-shrink-0">
        <span className="font-semibold text-gray-500 whitespace-nowrap flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Prompts:
        </span>
        <button
          onClick={() => handleSend("Explain Consumer Price Index (CPI) methodology")}
          className="px-3 py-1.5 rounded-full border bg-white dark:bg-gray-800 hover:border-blue-500 whitespace-nowrap transition-colors"
          style={{ borderColor: 'var(--color-border)' }}
        >
          📊 Explain CPI Methodology
        </button>
        <button
          onClick={() => handleSend("What are the mandatory iGOT courses for SSS cadre?")}
          className="px-3 py-1.5 rounded-full border bg-white dark:bg-gray-800 hover:border-blue-500 whitespace-nowrap transition-colors"
          style={{ borderColor: 'var(--color-border)' }}
        >
          🎓 Mandatory iGOT Courses
        </button>
        <button
          onClick={() => handleSend("Generate 3 practice questions on Gross Value Added (GVA)")}
          className="px-3 py-1.5 rounded-full border bg-white dark:bg-gray-800 hover:border-blue-500 whitespace-nowrap transition-colors"
          style={{ borderColor: 'var(--color-border)' }}
        >
          📝 Practice Questions on GVA
        </button>
        <button
          onClick={() => handleSend("How do I calculate sampling variance in NSS 80th round?")}
          className="px-3 py-1.5 rounded-full border bg-white dark:bg-gray-800 hover:border-blue-500 whitespace-nowrap transition-colors"
          style={{ borderColor: 'var(--color-border)' }}
        >
          📐 NSS Sampling Variance
        </button>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 rounded-xl border space-y-4 my-2" style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                isUser ? 'bg-blue-600 text-white' : 'bg-blue-950 text-amber-400'
              }`}>
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`group relative max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed ${
                isUser
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-gray-100 dark:bg-gray-800/80 rounded-tl-none border'
              }`} style={{ borderColor: isUser ? 'transparent' : 'var(--color-border)', color: isUser ? '#ffffff' : 'var(--color-text-primary)' }}>
                <div className="whitespace-pre-wrap font-sans">
                  {m.text}
                </div>

                <div className={`flex items-center justify-between mt-2 pt-1 text-[10px] ${isUser ? 'text-blue-200' : 'text-gray-400'}`}>
                  <span>{m.timestamp}</span>
                  {!isUser && (
                    <button
                      onClick={() => handleCopy(m.id, m.text)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 p-1 hover:text-blue-500"
                      title="Copy response"
                    >
                      {copiedId === m.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-950 text-amber-400 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl rounded-tl-none bg-gray-100 dark:bg-gray-800/80 border text-xs flex items-center gap-1.5" style={{ borderColor: 'var(--color-border)' }}>
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]" />
              <span className="text-gray-400 ml-2">MoSPI Sahayak is consulting statistical guidelines...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input box */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        className="flex items-center gap-2 pt-2 flex-shrink-0"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask MoSPI Sahayak regarding statistical methodologies, iGOT courses, or rules..."
          className="input flex-1 py-3"
        />
        <Button
          variant="primary"
          type="submit"
          disabled={!inputQuery.trim() || isTyping}
          icon={Send}
        >
          Send
        </Button>
      </form>
    </div>
  );
}
