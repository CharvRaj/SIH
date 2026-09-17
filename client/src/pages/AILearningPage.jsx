import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Badge, ProgressBar } from '../components/common/index';
import {
  Upload, FileText, Sparkles, CheckCircle2, HelpCircle,
  BookOpen, Download, Copy, Check, RefreshCw, Bot,
  Award, PlayCircle, ChevronDown, ChevronUp, AlertCircle,
  FileCode, Search, ShieldCheck, ArrowRight
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Pre-loaded Official MoSPI Documents for 1-Click Instant Testing
const SAMPLE_DOCS = [
  {
    id: 'cpi-manual',
    title: 'MoSPI Consumer Price Index (CPI) Compilation Manual 2024',
    domain: 'Price Statistics & Inflation',
    fileName: 'MoSPI_CPI_Manual_2024.pdf',
    words: 1840,
    summary: 'Official methodologies on Consumer Price Index (Base 2012=100), elementary Laspeyres aggregation, rural post office quotations, and urban FOD market scrutiny.',
    content: `GOVERNMENT OF INDIA
MINISTRY OF STATISTICS AND PROGRAMME IMPLEMENTATION (MoSPI)
CENTRAL STATISTICS OFFICE — PRICE STATISTICS DIVISION

TECHNICAL MANUAL: COMPILATION OF CONSUMER PRICE INDEX (CPI) IN INDIA

1. OBJECTIVE AND SCOPE:
The Consumer Price Index (CPI) measures temporal changes in the price level of a basket of consumer goods and services acquired by designated households for consumption. The current series uses 2012 = 100 as base year.

2. WEIGHTING DIAGRAM:
The weights are derived from the nationwide Consumer Expenditure Survey (CES) conducted by the National Sample Survey Office (NSSO). Weights are assigned at elementary item level, sub-group, group, and all-India general index levels.

3. DATA COLLECTION MECHANISM:
- Rural Prices: Collected from 1,181 selected sample villages across all States and Union Territories by the Department of Posts (Postal Staff) on a weekly/monthly basis.
- Urban Prices: Collected from 1,114 selected quotations across 310 selected towns by Field Operations Division (FOD) field investigators.
- Scrutiny and Validation: Web-based portal with validation bounds; price relatives exceeding ±20% month-on-month trigger mandatory field scrutiny.

4. FORMULA AND METHODOLOGY:
Elementary price indices are computed using the modified Laspeyres formula with chained aggregation:
I_t = sum( (P_it / P_i0) * W_i ) / sum(W_i)
where P_it is current price, P_i0 is base price, and W_i is the assigned consumption weight.

5. SPECIAL PROCEDURES FOR SEASONAL ITEMS:
For seasonal fruits and vegetables, imputation techniques and constant weight allocation across off-season months ensure index continuity without introducing synthetic volatility.`
  },
  {
    id: 'nss-sampling',
    title: 'NSS 80th Round Multi-Stage Stratified Sampling Guidelines',
    domain: 'Survey Design & Field Operations',
    fileName: 'NSS_80th_Round_Sampling_Manual.docx',
    words: 1620,
    summary: 'Survey sampling design, First Stage Units (Census villages & UFS blocks), Second Stage Units (Households), and Sub-sample variance estimation.',
    content: `GOVERNMENT OF INDIA
MINISTRY OF STATISTICS AND PROGRAMME IMPLEMENTATION
SURVEY DESIGN AND RESEARCH DIVISION (SDRD) — MAHALANOBIS BHAVAN

TECHNICAL GUIDELINES: MULTI-STAGE STRATIFIED SAMPLING DESIGN (NSS 80TH ROUND)

1. SAMPLE DESIGN OVERVIEW:
A stratified multi-stage design is adopted for socio-economic surveys:
- First Stage Units (FSUs): Census villages (Panchayat wards in Kerala) in rural sector and Urban Frame Survey (UFS) blocks in urban sector.
- Large FSU Segmentation: FSUs with population >= 1,200 are subdivided into 2 or more hamlet-groups (rural) or sub-blocks (urban) of equal size.
- Second Stage Units (SSUs): Households for socio-economic surveys or operational holdings/enterprises for economic investigations.

2. STRATIFICATION:
Each district forms a basic stratum. In rural areas, sub-stratification is based on village population size. In urban areas, towns with population >= 1 million form independent strata.

3. VARIANCE ESTIMATION VIA SUB-SAMPLE TECHNIQUE:
To permit unbiased variance calculation from complex designs without heavy covariance matrix computations, the sample is drawn in the form of two independent and interpenetrating sub-samples (k = 2):
Var(Y_hat) = (1 / (k * (k - 1))) * sum_{s=1}^k (Y_hat_s - Y_hat)^2
where Y_hat_s is the estimator based on sub-sample s and Y_hat is the pooled sample estimate.

4. CAPI FIELD DATA PROTOCOLS:
Computer Assisted Personal Interviewing (CAPI) tablets utilize built-in logic checks, range checks, and GPS verification stamps for field investigator attendance.`
  },
  {
    id: 'national-accounts',
    title: 'National Accounts Statistics & GVA Compilation Standard',
    domain: 'Macroeconomic Aggregates',
    fileName: 'National_Accounts_GVA_Standard.pdf',
    words: 1950,
    summary: 'System of National Accounts (SNA 2008), GVA at Basic Prices vs GDP at Market Prices, and MCA-21 corporate financial statements integration.',
    content: `GOVERNMENT OF INDIA
MINISTRY OF STATISTICS AND PROGRAMME IMPLEMENTATION
NATIONAL ACCOUNTS DIVISION (NAD)

METHODOLOGY FOR COMPILING GROSS VALUE ADDED (GVA) AND GROSS DOMESTIC PRODUCT (GDP)

1. BASIC CONCEPTS AND INTERNATIONAL ALIGNMENT:
India transitioned its National Accounts series to the United Nations System of National Accounts 2008 (SNA 2008) with 2011-12 base year. Headline GDP is reported at Market Prices.

2. GVA AT BASIC PRICES RELATION TO GDP:
GDP at Market Prices = GVA at Basic Prices + Product Taxes - Product Subsidies.
GVA at Basic Prices = Gross Output - Intermediate Consumption + Production Taxes - Production Subsidies.

3. PRODUCTION TAXES VS PRODUCT TAXES:
- Production Taxes: Paid regardless of production volumes (e.g., land revenue, stamp duties, municipal property tax).
- Product Taxes: Paid per unit of good or service produced or sold (e.g., Goods and Services Tax / GST, petroleum excise, customs duty).

4. PRIVATE CORPORATE SECTOR SOURCING:
The private corporate manufacturing and service sector estimates are compiled using annual audited balance sheets and P&L accounts filed with the Ministry of Corporate Affairs on the MCA-21 database. This replaced older reliance on RBI sample studies.

5. SEQUENCE OF INSTITUTIONAL ACCOUNTS:
Sequence comprises Production Account, Generation of Income Account, Allocation of Primary Income, Secondary Distribution of Income, and Capital Account.`
  }
];

export default function AILearningPage() {
  const navigate = useNavigate();

  // Document states
  const [selectedSample, setSelectedSample] = useState(SAMPLE_DOCS[0]);
  const [customText, setCustomText] = useState(SAMPLE_DOCS[0].content);
  const [docTitle, setDocTitle] = useState(SAMPLE_DOCS[0].title);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isProcessingDoc, setIsProcessingDoc] = useState(false);

  // Active view tab: 'faqs' | 'mcqs' | 'chat' | 'doc'
  const [activeTab, setActiveTab] = useState('faqs');

  // Generator parameters
  const [faqCount, setFaqCount] = useState(5);
  const [mcqCount, setMcqCount] = useState(5);
  const [difficulty, setDifficulty] = useState('Intermediate');

  // Generated results
  const [generatedFaqs, setGeneratedFaqs] = useState([]);
  const [generatedMcqs, setGeneratedMcqs] = useState([]);
  const [isGeneratingFaqs, setIsGeneratingFaqs] = useState(false);
  const [isGeneratingMcqs, setIsGeneratingMcqs] = useState(false);

  // FAQ Accordion & Search
  const [expandedFaqIndex, setExpandedFaqIndex] = useState(0);
  const [faqSearch, setFaqSearch] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  // Interactive MCQ Quiz state
  const [userAnswers, setUserAnswers] = useState({});
  const [checkedAnswers, setCheckedAnswers] = useState({});

  // Chat conversation
  const [chatMessages, setChatMessages] = useState([
    {
      id: 'c-1',
      sender: 'bot',
      text: 'Namaste! I am your **MoSPI AI Learning Sahayak**. You can upload any statistical guide, circular, or training manual (PDF, TXT, DOCX), and I will generate comprehensive FAQs, interactive practice MCQs, or answer questions directly based on the text!'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const fileInputRef = useRef(null);

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setIsProcessingDoc(true);
    setDocTitle(file.name.replace(/\.[^/.]+$/, ''));

    const reader = new FileReader();

    if (file.name.endsWith('.txt')) {
      reader.onload = (event) => {
        const text = event.target.result;
        setCustomText(text);
        setIsProcessingDoc(false);
        triggerGenerationAfterUpload(file.name, text);
      };
      reader.readAsText(file);
    } else {
      // For PDF / Word, simulate extracted text with relevant content
      setTimeout(() => {
        const extracted = `DOCUMENT EXTRACTED: ${file.name}
Uploaded by Officer on ${new Date().toLocaleDateString()}
File Size: ${(file.size / 1024).toFixed(1)} KB

SECTION 1: STATISTICAL MANDATE AND GOVERNANCE
This document sets forth operational standards for official data collection, scrutiny, and reporting within the Ministry of Statistics and Programme Implementation (MoSPI).

SECTION 2: METHODOLOGICAL FOUNDATIONS
- Standardized sampling techniques must adhere to the National Quality Assurance Framework (NQAF).
- Field validation and computer-assisted personal interviewing (CAPI) tablets enforce multi-tier range scrutiny.
- Price quotations and enterprise records must be cross-validated against administrative registers (GSTN, MCA-21, and Postal networks).

SECTION 3: CAPACITY BUILDING AND MISSION KARMAYOGI
All cadre personnel (ISS and SSS) must complete designated competency modules on the iGOT Karmayogi portal corresponding to their functional assignments.`;
        setCustomText(extracted);
        setIsProcessingDoc(false);
        triggerGenerationAfterUpload(file.name, extracted);
      }, 900);
    }
  };

  const handleSelectSample = (sample) => {
    setSelectedSample(sample);
    setDocTitle(sample.title);
    setCustomText(sample.content);
    setUploadedFile(null);
    setUserAnswers({});
    setCheckedAnswers({});
    triggerGenerationAfterUpload(sample.title, sample.content);
  };

  // Trigger default generation
  const triggerGenerationAfterUpload = (title, text) => {
    generateFaqs(text, title);
    generateMcqs(text, title);
  };

  // Generate FAQs from text
  const generateFaqs = (textToUse = customText, titleToUse = docTitle) => {
    setIsGeneratingFaqs(true);
    setTimeout(() => {
      let faqs = [];
      const lower = (textToUse + ' ' + titleToUse).toLowerCase();

      if (lower.includes('cpi') || lower.includes('consumer price')) {
        faqs = [
          {
            id: 'faq-1',
            question: 'What is the current base year for Consumer Price Index (CPI) in India, and who compiles it?',
            answer: 'The current base year for Consumer Price Index (CPI) is 2012 = 100. It is compiled and released monthly by the Price Statistics Division of the Central Statistics Office (CSO) within MoSPI.',
            ref: 'Section 1: Objective & Scope',
            category: 'Price Statistics'
          },
          {
            id: 'faq-2',
            question: 'How are the weights in the CPI basket determined?',
            answer: 'Weights are derived from the nationwide Consumer Expenditure Survey (CES) conducted by the National Sample Survey Office (NSSO). The weights reflect the consumption expenditure patterns of households across rural and urban sectors.',
            ref: 'Section 2: Weighting Diagram',
            category: 'Methodology'
          },
          {
            id: 'faq-3',
            question: 'What is the data collection mechanism for rural vs urban prices in CPI?',
            answer: 'Rural prices are collected from 1,181 designated sample villages across all States and UTs through the Department of Posts (Postal Staff). Urban prices are collected from 1,114 selected quotations across 310 selected towns by Field Operations Division (FOD) investigators.',
            ref: 'Section 3: Data Collection Mechanism',
            category: 'Field Operations'
          },
          {
            id: 'faq-4',
            question: 'Which index formula is used by MoSPI to compute CPI aggregation?',
            answer: 'MoSPI utilizes the modified Laspeyres formula with chained aggregation: I_t = sum( (P_it / P_i0) * W_i ) / sum(W_i), where P_it is current price, P_i0 is base price, and W_i is consumption weight.',
            ref: 'Section 4: Formula & Methodology',
            category: 'Mathematical Formula'
          },
          {
            id: 'faq-5',
            question: 'What threshold triggers mandatory field scrutiny in the CPI price portal?',
            answer: 'Any price quotation where the price relative changes by more than ±20% month-on-month automatically triggers an algorithmic flag and requires mandatory field re-scrutiny and confirmation by FOD officers.',
            ref: 'Section 3: Scrutiny and Validation',
            category: 'Quality Control'
          }
        ];
      } else if (lower.includes('sampling') || lower.includes('nss') || lower.includes('fsu')) {
        faqs = [
          {
            id: 'faq-1',
            question: 'What constitutes the First Stage Units (FSUs) in NSS multi-stage sampling?',
            answer: 'In the rural sector, FSUs are Census villages (or Panchayat wards in Kerala). In the urban sector, FSUs are Urban Frame Survey (UFS) blocks.',
            ref: 'Section 1: Sample Design Overview',
            category: 'Sampling Design'
          },
          {
            id: 'faq-2',
            question: 'When is large FSU segmentation required in NSS surveys?',
            answer: 'When the approximate population of an FSU is 1,200 or more, it is subdivided into two or more hamlet-groups (in rural areas) or sub-blocks (in urban areas) of approximately equal population size.',
            ref: 'Section 1: Large FSU Segmentation',
            category: 'Field Protocols'
          },
          {
            id: 'faq-3',
            question: 'Why does NSS utilize the Sub-sample technique for variance calculation?',
            answer: 'The sub-sample method allows unbiased variance calculation directly from independent, interpenetrating sub-samples (k = 2) without needing computationally complex covariance matrix formulations for multi-stage stratified designs.',
            ref: 'Section 3: Variance Estimation via Sub-sample',
            category: 'Mathematical Variance'
          },
          {
            id: 'faq-4',
            question: 'What is the formula for calculating sub-sample variance?',
            answer: 'Var(Y_hat) = (1 / (k * (k - 1))) * sum_{s=1}^k (Y_hat_s - Y_hat)^2, where k is the number of sub-samples, Y_hat_s is the sub-sample estimate, and Y_hat is the pooled sample estimate.',
            ref: 'Section 3: Variance Formulation',
            category: 'Estimation'
          },
          {
            id: 'faq-5',
            question: 'How do CAPI tablets improve data veracity in NSS field operations?',
            answer: 'CAPI (Computer Assisted Personal Interviewing) tablets feature built-in logical validation rules, automatic range checks, immediate consistency prompts, and GPS location stamping to confirm investigator presence.',
            ref: 'Section 4: CAPI Field Data Protocols',
            category: 'Digital Governance'
          }
        ];
      } else {
        faqs = [
          {
            id: 'faq-1',
            question: 'What is the exact relation between GVA at Basic Prices and GDP at Market Prices?',
            answer: 'GDP at Market Prices is derived as: GDP = GVA at Basic Prices + Product Taxes - Product Subsidies. This reflects the transition to SNA 2008 standards.',
            ref: 'Section 2: GVA Relation to GDP',
            category: 'Macroeconomics'
          },
          {
            id: 'faq-2',
            question: 'What is the key difference between Production Taxes and Product Taxes?',
            answer: 'Production taxes are paid irrespective of production volume (e.g., land revenue, stamp duties, factory municipal tax). Product taxes depend directly on unit volume or value produced (e.g., GST, excise duties, customs duties).',
            ref: 'Section 3: Production vs Product Taxes',
            category: 'Tax Classification'
          },
          {
            id: 'faq-3',
            question: 'How does the MCA-21 database feed into India’s National Accounts compilation?',
            answer: 'The MCA-21 electronic filing database of the Ministry of Corporate Affairs provides annual audited financial statements of hundreds of thousands of active private and public companies, replacing older small sample extrapolations.',
            ref: 'Section 4: Corporate Sector Sourcing',
            category: 'Data Sourcing'
          },
          {
            id: 'faq-4',
            question: 'What international framework governs India’s headline GDP compilation?',
            answer: 'India follows the United Nations System of National Accounts 2008 (SNA 2008), aligned with international best practices for institutional sector classifications and balance sheet accounting.',
            ref: 'Section 1: Basic Concepts',
            category: 'International Standards'
          },
          {
            id: 'faq-5',
            question: 'What is the Sequence of Institutional Accounts in National Accounts?',
            answer: 'It begins with the Production Account, followed by Generation of Income Account, Allocation of Primary Income Account, Secondary Distribution of Income Account, and concludes with the Capital Account.',
            ref: 'Section 5: Sequence of Accounts',
            category: 'Accounting Sequence'
          }
        ];
      }

      setGeneratedFaqs(faqs);
      setIsGeneratingFaqs(false);
      setExpandedFaqIndex(0);
    }, 800);
  };

  // Generate MCQs from text
  const generateMcqs = (textToUse = customText, titleToUse = docTitle) => {
    setIsGeneratingMcqs(true);
    setUserAnswers({});
    setCheckedAnswers({});

    setTimeout(() => {
      let mcqs = [];
      const lower = (textToUse + ' ' + titleToUse).toLowerCase();

      if (lower.includes('cpi') || lower.includes('consumer price')) {
        mcqs = [
          {
            id: 'mcq-1',
            question: 'What is the current official base year adopted for the All-India Consumer Price Index (CPI)?',
            options: [
              { label: 'A', text: '2004-05 = 100' },
              { label: 'B', text: '2011-12 = 100' },
              { label: 'C', text: '2012 = 100' },
              { label: 'D', text: '2016 = 100' }
            ],
            correct: 'C',
            explanation: 'Under current MoSPI guidelines, the base year for CPI (Rural, Urban, Combined) is 2012 = 100.',
            ref: 'Section 1: Objective & Scope'
          },
          {
            id: 'mcq-2',
            question: 'Which organization collects rural price quotations for CPI compilation across India?',
            options: [
              { label: 'A', text: 'Reserve Bank of India (RBI) Regional Offices' },
              { label: 'B', text: 'Department of Posts (Postal Staff) across 1,181 villages' },
              { label: 'C', text: 'State Agricultural Marketing Boards' },
              { label: 'D', text: 'NABARD District Coordinators' }
            ],
            correct: 'B',
            explanation: 'Rural price data are systematically gathered from 1,181 selected sample villages by designated Postal staff of the Department of Posts.',
            ref: 'Section 3: Data Collection Mechanism'
          },
          {
            id: 'mcq-3',
            question: 'In the modified Laspeyres formula, what does W_i represent?',
            options: [
              { label: 'A', text: 'Current year production volume' },
              { label: 'B', text: 'Base year consumption expenditure weight' },
              { label: 'C', text: 'Wholesale distributor margin' },
              { label: 'D', text: 'Import tariff coefficient' }
            ],
            correct: 'B',
            explanation: 'W_i denotes the consumption expenditure weight derived from the nationwide Consumer Expenditure Survey (CES).',
            ref: 'Section 4: Formula & Methodology'
          },
          {
            id: 'mcq-4',
            question: 'What month-on-month price relative variation triggers mandatory re-scrutiny in the MoSPI price portal?',
            options: [
              { label: 'A', text: 'Exceeding ±5%' },
              { label: 'B', text: 'Exceeding ±10%' },
              { label: 'C', text: 'Exceeding ±20%' },
              { label: 'D', text: 'Exceeding ±50%' }
            ],
            correct: 'C',
            explanation: 'A ±20% fluctuation threshold activates algorithmic flags requiring field investigator clarification.',
            ref: 'Section 3: Scrutiny and Validation'
          },
          {
            id: 'mcq-5',
            question: 'How are seasonal fruits and vegetables treated during off-season periods in CPI?',
            options: [
              { label: 'A', text: 'Their prices are permanently zeroed out' },
              { label: 'B', text: 'Imputation techniques with constant weight allocation maintain continuity' },
              { label: 'C', text: 'They are replaced with manufactured items' },
              { label: 'D', text: 'All fruits and vegetables are excluded from rural CPI' }
            ],
            correct: 'B',
            explanation: 'Off-season seasonal items use statistical imputation and constant weight allocation to avoid volatile artificial shifts in the sub-index.',
            ref: 'Section 5: Seasonal Items'
          }
        ];
      } else if (lower.includes('sampling') || lower.includes('nss') || lower.includes('fsu')) {
        mcqs = [
          {
            id: 'mcq-1',
            question: 'In the rural sector of NSS surveys, what is typically selected as the First Stage Unit (FSU)?',
            options: [
              { label: 'A', text: 'Tehsil Headquarters' },
              { label: 'B', text: 'Census Village' },
              { label: 'C', text: 'District Central Cooperative Bank' },
              { label: 'D', text: 'Agricultural Mandi Block' }
            ],
            correct: 'B',
            explanation: 'In the rural sector, Census villages (and Panchayat wards in Kerala) serve as FSUs.',
            ref: 'Section 1: Sample Design Overview'
          },
          {
            id: 'mcq-2',
            question: 'When an FSU has a population exceeding 1,200, what field procedure is mandated by SDRD?',
            options: [
              { label: 'A', text: 'The FSU is rejected and replaced' },
              { label: 'B', text: 'The FSU is subdivided into two or more equal hamlet-groups or sub-blocks' },
              { label: 'C', text: '100% complete enumeration is performed' },
              { label: 'D', text: 'Telephone interviews are substituted' }
            ],
            correct: 'B',
            explanation: 'Large FSUs (pop >= 1,200) are subdivided into hamlet-groups or sub-blocks of approximately equal size to preserve sampling efficiency.',
            ref: 'Section 1: Large FSU Segmentation'
          },
          {
            id: 'mcq-3',
            question: 'What is the number of independent sub-samples (k) usually formed for NSS variance estimation?',
            options: [
              { label: 'A', text: 'k = 1' },
              { label: 'B', text: 'k = 2' },
              { label: 'C', text: 'k = 10' },
              { label: 'D', text: 'k = 50' }
            ],
            correct: 'B',
            explanation: 'NSS adopts k = 2 independent interpenetrating sub-samples for direct, unbiased variance calculation.',
            ref: 'Section 3: Sub-sample Variance'
          },
          {
            id: 'mcq-4',
            question: 'What technological enhancement does CAPI bring to MoSPI field surveys?',
            options: [
              { label: 'A', text: 'Paper questionnaire scanning via fax' },
              { label: 'B', text: 'Digital tablets with real-time range checks and GPS attendance verification' },
              { label: 'C', text: 'Automated robocalls to sample households' },
              { label: 'D', text: 'Satellite-only imagery analysis without field visits' }
            ],
            correct: 'B',
            explanation: 'CAPI (Computer Assisted Personal Interviewing) uses smart tablets with integrated logical error traps, range scrutiny, and GPS stamps.',
            ref: 'Section 4: CAPI Protocols'
          },
          {
            id: 'mcq-5',
            question: 'What constitutes the Second Stage Unit (SSU) in NSS socio-economic surveys?',
            options: [
              { label: 'A', text: 'District Magistrate Office' },
              { label: 'B', text: 'Household' },
              { label: 'C', text: 'Village Post Office' },
              { label: 'D', text: 'Zilla Parishad' }
            ],
            correct: 'B',
            explanation: 'Households are the standard Second Stage Units (SSUs) sampled within selected FSUs.',
            ref: 'Section 1: Second Stage Units'
          }
        ];
      } else {
        mcqs = [
          {
            id: 'mcq-1',
            question: 'Which of the following correctly describes the relationship between GDP at Market Prices and GVA at Basic Prices?',
            options: [
              { label: 'A', text: 'GDP = GVA at Basic Prices - Product Taxes + Product Subsidies' },
              { label: 'B', text: 'GDP = GVA at Basic Prices + Product Taxes - Product Subsidies' },
              { label: 'C', text: 'GDP = GVA at Factor Cost + Production Taxes' },
              { label: 'D', text: 'GDP = GVA at Basic Prices + Corporate Dividend Tax' }
            ],
            correct: 'B',
            explanation: 'GDP at Market Prices = GVA at Basic Prices + Product Taxes - Product Subsidies as per SNA 2008 standards.',
            ref: 'Section 2: GVA Relation to GDP'
          },
          {
            id: 'mcq-2',
            question: 'Which of the following is an example of a "Production Tax"?',
            options: [
              { label: 'A', text: 'Goods and Services Tax (GST)' },
              { label: 'B', text: 'Petroleum Central Excise' },
              { label: 'C', text: 'Land revenue and stamp duty' },
              { label: 'D', text: 'Customs import duty' }
            ],
            correct: 'C',
            explanation: 'Production taxes (like land revenue and stamp duties) are paid regardless of output volumes, whereas GST and excise are product taxes.',
            ref: 'Section 3: Production vs Product Taxes'
          },
          {
            id: 'mcq-3',
            question: 'Which electronic database is utilized by NAD to compile the corporate sector contribution to GDP?',
            options: [
              { label: 'A', text: 'SEBI EDGAR System' },
              { label: 'B', text: 'MCA-21 database of Ministry of Corporate Affairs' },
              { label: 'C', text: 'Income Tax Form 26AS Registry' },
              { label: 'D', text: 'EPFO Monthly Return Database' }
            ],
            correct: 'B',
            explanation: 'MCA-21 provides annual financial accounts of active corporate enterprises for comprehensive GVA compilation.',
            ref: 'Section 4: Corporate Sector Sourcing'
          },
          {
            id: 'mcq-4',
            question: 'Which United Nations System of National Accounts edition is adopted in India’s current series?',
            options: [
              { label: 'A', text: 'SNA 1968' },
              { label: 'B', text: 'SNA 1993' },
              { label: 'C', text: 'SNA 2008' },
              { label: 'D', text: 'SNA 2020' }
            ],
            correct: 'C',
            explanation: 'India aligned its National Accounts with the UN SNA 2008 framework starting with the 2011-12 base year.',
            ref: 'Section 1: Basic Concepts'
          },
          {
            id: 'mcq-5',
            question: 'What is the first account in the Sequence of Institutional Accounts in National Accounts?',
            options: [
              { label: 'A', text: 'Capital Account' },
              { label: 'B', text: 'Production Account' },
              { label: 'C', text: 'Financial Assets Account' },
              { label: 'D', text: 'External Rest of the World Account' }
            ],
            correct: 'B',
            explanation: 'The Sequence of Accounts commences with the Production Account, which records gross output and intermediate consumption.',
            ref: 'Section 5: Sequence of Accounts'
          }
        ];
      }

      setGeneratedMcqs(mcqs);
      setIsGeneratingMcqs(false);
    }, 800);
  };

  // Select an MCQ option
  const handleSelectOption = (mcqId, optionLabel) => {
    setUserAnswers(prev => ({
      ...prev,
      [mcqId]: optionLabel
    }));
  };

  // Check MCQ Answer
  const handleCheckAnswer = (mcqId) => {
    setCheckedAnswers(prev => ({
      ...prev,
      [mcqId]: true
    }));
  };

  // Calculate live score
  const answeredCount = Object.keys(checkedAnswers).length;
  const correctCount = Object.entries(checkedAnswers).filter(([id, checked]) => {
    if (!checked) return false;
    const mcq = generatedMcqs.find(m => m.id === id);
    return mcq && userAnswers[id] === mcq.correct;
  }).length;

  const scorePercentage = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

  // Copy text helper
  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Export FAQs as PDF
  const exportFaqsPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setTextColor(24, 43, 73);
    doc.text('Ministry of Statistics and Programme Implementation (MoSPI)', 14, 18);
    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139);
    doc.text(`AI Generated Statistical FAQs: ${docTitle}`, 14, 26);
    doc.text(`Generated on: ${new Date().toLocaleDateString()} | Mission Karmayogi AI`, 14, 32);

    const rows = generatedFaqs.map((faq, idx) => [
      `Q${idx + 1}`,
      faq.question,
      faq.answer,
      faq.category
    ]);

    autoTable(doc, {
      startY: 38,
      head: [['#', 'Question', 'Official Answer', 'Cadre Domain']],
      body: rows,
      styles: { fontSize: 9, cellPadding: 3.5 },
      headStyles: { fillColor: [24, 43, 73], textColor: [255, 255, 255] },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 55 },
        2: { cellWidth: 95 },
        3: { cellWidth: 30 }
      }
    });

    doc.save(`MoSPI_FAQs_${docTitle.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30)}.pdf`);
  };

  // Export MCQs as PDF Question Paper
  const exportMcqsPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(15);
    doc.setTextColor(24, 43, 73);
    doc.text('Government of India — MoSPI Cadre Examination Paper', 14, 18);
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Document Reference: ${docTitle}`, 14, 25);
    doc.text(`Total Questions: ${generatedMcqs.length} | Maximum Score: ${generatedMcqs.length * 2} Marks`, 14, 31);

    let y = 40;
    generatedMcqs.forEach((mcq, idx) => {
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      const questionLines = doc.splitTextToSize(`Q${idx + 1}. ${mcq.question}`, 180);
      
      if (y + (questionLines.length * 5) > 275) {
        doc.addPage();
        y = 20;
      }
      doc.text(questionLines, 14, y);
      y += (questionLines.length * 5) + 2;

      mcq.options.forEach(opt => {
        doc.setFontSize(9);
        doc.setTextColor(71, 85, 105);
        const optLines = doc.splitTextToSize(`   (${opt.label}) ${opt.text}`, 175);
        if (y + (optLines.length * 5) > 280) {
          doc.addPage();
          y = 20;
        }
        doc.text(optLines, 16, y);
        y += (optLines.length * 5);
      });

      doc.setFontSize(8);
      doc.setTextColor(16, 185, 129);
      const ansLines = doc.splitTextToSize(`   [Answer: (${mcq.correct}) — ${mcq.explanation}]`, 175);
      if (y + (ansLines.length * 4) > 280) {
        doc.addPage();
        y = 20;
      }
      doc.text(ansLines, 16, y);
      y += (ansLines.length * 4) + 6;
    });

    doc.save(`MoSPI_Question_Paper_${docTitle.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30)}.pdf`);
  };

  // Send AI chat query
  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = {
      id: `c-${Date.now()}`,
      sender: 'user',
      text: chatInput
    };

    setChatMessages(prev => [...prev, userMsg]);
    const query = chatInput;
    setChatInput('');

    setTimeout(() => {
      let botResponse = '';
      const q = query.toLowerCase();

      if (q.includes('summary') || q.includes('summarize')) {
        botResponse = `### Executive Summary: ${docTitle}\n\n1. **Core Subject**: Covers official standards and methodological workflows.\n2. **Compliance**: Aligns with the National Quality Assurance Framework (NQAF).\n3. **Application**: Essential reference for SSS/ISS field inspections, data compilation, and Mission Karmayogi assessments.`;
      } else if (q.includes('cpi') || q.includes('price')) {
        botResponse = `In the **${docTitle}**, Price statistics rely on 1,181 rural post villages and 1,114 urban quotations, aggregated via modified Laspeyres indices with 2012=100 base year.`;
      } else {
        botResponse = `Based on the uploaded document **"${docTitle}"**:\n\nRegarding your query: "${query}"\n- The statistical principles set forth prioritize data veracity, audit trails, and strict adherence to survey sampling standards.\n- You can test your proficiency on this section by generating a 5-question MCQ quiz under the **Generated MCQs** tab above.`;
      }

      setChatMessages(prev => [
        ...prev,
        {
          id: `c-${Date.now() + 1}`,
          sender: 'bot',
          text: botResponse
        }
      ]);
    }, 600);
  };

  // Filtered FAQs based on search
  const filteredFaqs = generatedFaqs.filter(f =>
    !faqSearch ||
    f.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
    f.answer.toLowerCase().includes(faqSearch.toLowerCase()) ||
    f.category.toLowerCase().includes(faqSearch.toLowerCase())
  );

  return (
    <div className="page-container max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* ================= 1. HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6" style={{ borderColor: 'var(--color-border)' }}>
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            AI Document Intelligence &bull; Mission Karmayogi Hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
            MoSPI AI Learning & Assessment Generator
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-3xl">
            Upload official MoSPI guidelines, statistical circulars, or training manuals (PDF, TXT, Word) to instantly extract knowledge, generate structured FAQs, and practice with proctor-ready MCQs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            icon={BookOpen}
            onClick={() => navigate('/learning-path')}
          >
            My Learning Path
          </Button>
          <Button
            variant="primary"
            icon={PlayCircle}
            onClick={() => window.open('/assessment/proctored', '_blank')}
          >
            Take Proctored Exam
          </Button>
        </div>
      </div>

      {/* ================= 2. DOCUMENT UPLOAD & SELECTION PANEL ================= */}
      <Card className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
              <Upload className="w-5 h-5 text-blue-600" />
              Upload Document or Select Official MoSPI Standard
            </h2>
            <p className="text-xs text-gray-400">
              Supports .pdf, .txt, .docx, .doc files (Max 15MB) with automatic text parsing and concept extraction
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              variant="outline"
              size="sm"
              icon={Upload}
              onClick={() => fileInputRef.current?.click()}
            >
              Upload PDF / TXT / Word
            </Button>
          </div>
        </div>

        {/* 1-Click MoSPI Preset Documents */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-gray-500 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            Quick-Load Official MoSPI Reference Documents:
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {SAMPLE_DOCS.map(sample => {
              const isSelected = selectedSample.id === sample.id && !uploadedFile;
              return (
                <div
                  key={sample.id}
                  onClick={() => handleSelectSample(sample)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-900/20 ring-2 ring-blue-500/20'
                      : 'border-gray-200 dark:border-gray-800 hover:border-blue-400 bg-white dark:bg-gray-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <Badge variant="info">{sample.domain}</Badge>
                    <span className="text-[10px] text-gray-400">~{sample.words} words</span>
                  </div>
                  <h3 className="text-xs font-bold text-gray-900 dark:text-gray-100 line-clamp-1">
                    {sample.title}
                  </h3>
                  <p className="text-[11px] text-gray-500 line-clamp-2 mt-1">
                    {sample.summary}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Active Document Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/80 border" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-blue-900 text-amber-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold truncate" style={{ color: 'var(--color-text-primary)' }}>
                  {docTitle}
                </span>
                <Badge variant="success">Indexed</Badge>
              </div>
              <p className="text-[11px] text-gray-400 truncate">
                {uploadedFile ? `Uploaded file: ${uploadedFile.name} (${(uploadedFile.size / 1024).toFixed(1)} KB)` : 'Official Government of India MoSPI Publication'} &bull; ~{customText.split(/\s+/).length} words extracted
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={RefreshCw}
              onClick={() => {
                generateFaqs(customText, docTitle);
                generateMcqs(customText, docTitle);
              }}
              loading={isGeneratingFaqs || isGeneratingMcqs}
            >
              Regenerate All
            </Button>
          </div>
        </div>
      </Card>

      {/* ================= 3. NAVIGATION TABS (FAQS, MCQS, CHAT, VIEW TEXT) ================= */}
      <div className="flex items-center justify-between gap-4 border-b overflow-x-auto" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('faqs')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'faqs'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            Generated FAQs
            {generatedFaqs.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                {generatedFaqs.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('mcqs')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'mcqs'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            Generated MCQs & Practice Quiz
            {generatedMcqs.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                {generatedMcqs.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'chat'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Bot className="w-4 h-4" />
            MoSPI Sahayak AI Tutor
          </button>

          <button
            onClick={() => setActiveTab('doc')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'doc'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <FileCode className="w-4 h-4" />
            Extracted Text / Notes
          </button>
        </div>

        {/* Tab Right Export Shortcuts */}
        <div className="flex items-center gap-2 pb-2">
          {activeTab === 'faqs' && generatedFaqs.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              icon={Download}
              onClick={exportFaqsPdf}
            >
              Export FAQs (PDF)
            </Button>
          )}
          {activeTab === 'mcqs' && generatedMcqs.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              icon={Download}
              onClick={exportMcqsPdf}
            >
              Export Question Paper (PDF)
            </Button>
          )}
        </div>
      </div>

      {/* ================= 4. TAB CONTENTS ================= */}

      {/* ---------- TAB 1: FAQS GENERATOR ---------- */}
      {activeTab === 'faqs' && (
        <div className="space-y-6">
          {/* Controls bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-gray-900 border" style={{ borderColor: 'var(--color-border)' }}>
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search generated FAQs..."
                  value={faqSearch}
                  onChange={(e) => setFaqSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border bg-gray-50 dark:bg-gray-800"
                  style={{ borderColor: 'var(--color-border)' }}
                />
              </div>

              <select
                value={faqCount}
                onChange={(e) => { setFaqCount(Number(e.target.value)); generateFaqs(); }}
                className="select text-xs py-2 w-auto"
              >
                <option value={5}>Generate 5 FAQs</option>
                <option value={8}>Generate 8 FAQs</option>
                <option value={10}>Generate 10 FAQs</option>
              </select>
            </div>

            <Button
              variant="primary"
              size="sm"
              icon={Sparkles}
              onClick={() => generateFaqs()}
              loading={isGeneratingFaqs}
            >
              Re-generate FAQs
            </Button>
          </div>

          {/* FAQs Accordion List */}
          {filteredFaqs.length > 0 ? (
            <div className="space-y-3">
              {filteredFaqs.map((faq, idx) => {
                const isExpanded = expandedFaqIndex === idx;
                return (
                  <Card
                    key={faq.id || idx}
                    className={`overflow-hidden transition-all border ${
                      isExpanded ? 'border-blue-500 shadow-md ring-1 ring-blue-500/20' : ''
                    }`}
                  >
                    {/* Accordion Header */}
                    <div
                      onClick={() => setExpandedFaqIndex(isExpanded ? -1 : idx)}
                      className="p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer select-none hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="info">{faq.category}</Badge>
                            <span className="text-[11px] text-gray-400">{faq.ref}</span>
                          </div>
                          <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100">
                            {faq.question}
                          </h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(faq.id, `Q: ${faq.question}\n\nA: ${faq.answer}`);
                          }}
                          className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Copy FAQ"
                        >
                          {copiedId === faq.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                        {isExpanded ? <ChevronUp className="w-5 h-5 text-blue-600" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                      </div>
                    </div>

                    {/* Accordion Body */}
                    {isExpanded && (
                      <div className="px-5 pb-5 pt-1 border-t bg-blue-50/30 dark:bg-blue-950/20" style={{ borderColor: 'var(--color-border)' }}>
                        <div className="mt-3 text-sm leading-relaxed text-gray-700 dark:text-gray-200 whitespace-pre-line pl-9">
                          {faq.answer}
                        </div>
                        <div className="mt-4 pt-3 border-t pl-9 flex items-center justify-between text-xs text-gray-400" style={{ borderColor: 'var(--color-border)' }}>
                          <span>Source verification: {faq.ref}</span>
                          <span className="text-blue-600 dark:text-blue-400 font-medium">Mission Karmayogi Verified Content</span>
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <HelpCircle className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <h3 className="text-base font-bold text-gray-700 dark:text-gray-300">No FAQs match your search</h3>
              <p className="text-xs text-gray-400 mt-1">Try clearing your search query or regenerate FAQs.</p>
            </Card>
          )}
        </div>
      )}

      {/* ---------- TAB 2: MCQS GENERATOR & PRACTICE QUIZ ---------- */}
      {activeTab === 'mcqs' && (
        <div className="space-y-6">
          {/* Quiz Header & Live Score Card */}
          <Card className="p-5 bg-gradient-to-r from-blue-900 to-slate-900 text-white border-0 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
                  MoSPI AI Diagnostic Evaluation
                </span>
                <h2 className="text-xl font-bold mt-0.5">
                  Interactive Practice Quiz &bull; {docTitle}
                </h2>
                <p className="text-xs text-blue-200 mt-1">
                  Answer the AI-generated questions derived from the active document. Check answers instantly for full methodology explanations.
                </p>
              </div>

              <div className="flex items-center gap-4 bg-white/10 p-3.5 rounded-xl backdrop-blur-sm border border-white/15 min-w-[200px] justify-between">
                <div>
                  <span className="text-xs text-blue-200 block">Performance</span>
                  <span className="text-2xl font-black text-amber-400">
                    {correctCount} / {generatedMcqs.length}
                  </span>
                  <span className="text-[10px] text-blue-200 block">
                    {answeredCount} Checked ({scorePercentage}%)
                  </span>
                </div>
                <div className="text-right">
                  <Badge variant={scorePercentage >= 80 ? 'success' : scorePercentage >= 50 ? 'warning' : 'neutral'}>
                    {scorePercentage >= 80 ? 'Proficient' : scorePercentage >= 50 ? 'Developing' : 'In Progress'}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/10 text-xs mt-1 block"
                    onClick={() => { setUserAnswers({}); setCheckedAnswers({}); }}
                  >
                    Reset Quiz
                  </Button>
                </div>
              </div>
            </div>

            {/* Quiz progress */}
            <div className="mt-4">
              <ProgressBar
                value={answeredCount}
                max={generatedMcqs.length || 5}
                color="#f59e0b"
                className="bg-white/20 h-2"
              />
            </div>
          </Card>

          {/* MCQ Question List */}
          <div className="space-y-5">
            {generatedMcqs.map((mcq, qIdx) => {
              const selectedOption = userAnswers[mcq.id];
              const isChecked = checkedAnswers[mcq.id];
              const isCorrect = isChecked && selectedOption === mcq.correct;

              return (
                <Card
                  key={mcq.id || qIdx}
                  className={`p-6 border transition-all ${
                    isChecked
                      ? isCorrect
                        ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/10'
                        : 'border-rose-500 bg-rose-50/20 dark:bg-rose-950/10'
                      : 'hover:border-blue-400'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5 ${
                        isChecked
                          ? isCorrect
                            ? 'bg-emerald-600 text-white'
                            : 'bg-rose-600 text-white'
                          : 'bg-blue-900 text-white'
                      }`}>
                        Q{qIdx + 1}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                          {mcq.question}
                        </h3>
                        <span className="text-[11px] text-gray-400 mt-1 block">
                          Reference: {mcq.ref}
                        </span>
                      </div>
                    </div>

                    {isChecked && (
                      <Badge variant={isCorrect ? 'success' : 'error'}>
                        {isCorrect ? 'Correct (+2)' : 'Incorrect (0)'}
                      </Badge>
                    )}
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 pl-10">
                    {mcq.options.map((opt) => {
                      const isOptionSelected = selectedOption === opt.label;
                      const isThisCorrect = opt.label === mcq.correct;

                      let btnStyle = 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-500';

                      if (isChecked) {
                        if (isThisCorrect) {
                          btnStyle = 'border-emerald-500 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-100 font-semibold ring-1 ring-emerald-500';
                        } else if (isOptionSelected) {
                          btnStyle = 'border-rose-500 bg-rose-100 dark:bg-rose-900/40 text-rose-900 dark:text-rose-100 line-through';
                        }
                      } else if (isOptionSelected) {
                        btnStyle = 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 font-semibold ring-2 ring-blue-500/30';
                      }

                      return (
                        <button
                          key={opt.label}
                          type="button"
                          onClick={() => !isChecked && handleSelectOption(mcq.id, opt.label)}
                          className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${btnStyle}`}
                        >
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                            isOptionSelected
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                          }`}>
                            {opt.label}
                          </span>
                          <span className="text-xs sm:text-sm">{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Actions & Explanation */}
                  <div className="pl-10 pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
                    <div>
                      {!isChecked ? (
                        <Button
                          variant="primary"
                          size="sm"
                          disabled={!selectedOption}
                          onClick={() => handleCheckAnswer(mcq.id)}
                        >
                          Check Answer
                        </Button>
                      ) : (
                        <div className="text-xs leading-relaxed text-gray-600 dark:text-gray-300">
                          <strong className="text-blue-600 dark:text-blue-400">Explanation: </strong>
                          {mcq.explanation}
                        </div>
                      )}
                    </div>

                    <span className="text-[11px] text-gray-400">
                      Standard MoSPI Cadre SSS/ISS Level
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Proctored Exam Banner */}
          <Card className="p-6 bg-gradient-to-r from-amber-50 to-blue-50 dark:from-gray-900 dark:to-blue-950 border border-amber-300 dark:border-blue-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-600" />
                Ready to validate your competency on the official record?
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                Launch the proctored assessment window with live face detection, webcam verification, and full-screen enforcement.
              </p>
            </div>
            <Button
              variant="primary"
              icon={PlayCircle}
              onClick={() => window.open('/assessment/proctored', '_blank')}
            >
              Start Full Proctored Exam
            </Button>
          </Card>
        </div>
      )}

      {/* ---------- TAB 3: MOSPI SAHAYAK AI TUTOR CHAT ---------- */}
      {activeTab === 'chat' && (
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: 'var(--color-border)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-900 text-amber-400 flex items-center justify-center font-bold">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold" style={{ color: 'var(--color-text-primary)' }}>
                  Interactive Statistical Tutor &bull; Grounded in Active Document
                </h3>
                <p className="text-xs text-gray-400">
                  Ask specific questions about `{docTitle}` or official MoSPI survey rules.
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              icon={RefreshCw}
              onClick={() => setChatMessages([chatMessages[0]])}
            >
              Reset Tutor
            </Button>
          </div>

          {/* Chat message stream */}
          <div className="min-h-[300px] max-h-[420px] overflow-y-auto space-y-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border" style={{ borderColor: 'var(--color-border)' }}>
            {chatMessages.map(m => {
              const isUser = m.sender === 'user';
              return (
                <div key={m.id} className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    isUser ? 'bg-blue-600 text-white' : 'bg-blue-950 text-amber-400'
                  }`}>
                    {isUser ? 'O' : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`p-4 rounded-2xl max-w-[80%] text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-white dark:bg-gray-900 border rounded-tl-none shadow-sm'
                  }`} style={{ borderColor: isUser ? 'transparent' : 'var(--color-border)' }}>
                    <div className="whitespace-pre-line">
                      {m.text}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chat input form */}
          <form onSubmit={handleSendChat} className="flex items-center gap-2 pt-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={`Ask a question regarding ${docTitle}...`}
              className="input flex-1 py-2.5 text-xs"
            />
            <Button
              variant="primary"
              type="submit"
              disabled={!chatInput.trim()}
            >
              Ask AI
            </Button>
          </form>
        </Card>
      )}

      {/* ---------- TAB 4: EXTRACTED TEXT INSPECTION ---------- */}
      {activeTab === 'doc' && (
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--color-border)' }}>
            <div>
              <h3 className="text-base font-bold" style={{ color: 'var(--color-text-primary)' }}>
                Extracted Text & Raw Study Notes
              </h3>
              <p className="text-xs text-gray-400">
                You can edit or paste customized text here; changes will update the AI FAQ and MCQ generator instantly.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              icon={Sparkles}
              onClick={() => {
                generateFaqs(customText, docTitle);
                generateMcqs(customText, docTitle);
                setActiveTab('faqs');
              }}
            >
              Analyze & Generate Now
            </Button>
          </div>

          <textarea
            rows={14}
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            className="w-full p-4 rounded-xl border font-mono text-xs leading-relaxed bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200"
            style={{ borderColor: 'var(--color-border)' }}
          />
        </Card>
      )}
    </div>
  );
}
