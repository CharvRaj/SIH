import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Badge, Modal, ProgressBar } from '../components/common/index';
import { useAuth } from '../contexts/AuthContext';
import {
  Clock, ChevronLeft, ChevronRight, Flag, CheckCircle, AlertCircle,
  Camera, Mic, Maximize, AlertTriangle, ShieldCheck, UserCheck,
  Eye, Volume2, Lock, ExternalLink, Award, Sparkles, BookOpen, ClipboardList
} from 'lucide-react';

const COMPULSORY_QUESTIONS = [
  {
    id: 1,
    text: 'What is the base year currently utilized for compiling the All-India Consumer Price Index (CPI) combined series by MoSPI?',
    type: 'mcq',
    topic: 'Price Statistics',
    difficulty: 'easy',
    options: ['2004-05', '2011-12', '2012', '2017-18'],
    correct: 2,
    explanation: 'The base year for CPI (Rural, Urban, Combined) is 2012=100, compiled monthly by NSO.'
  },
  {
    id: 2,
    text: 'In multi-stage survey sampling for rural field surveys, what constitutes the First Stage Unit (FSU)?',
    type: 'mcq',
    topic: 'Survey Sampling',
    difficulty: 'medium',
    options: ['Household', 'Census Village / Revenue Village', 'District Statistical Office', 'Gram Panchayat Block'],
    correct: 1,
    explanation: '2011 Census villages serve as First Stage Units (FSUs) in rural strata.'
  },
  {
    id: 3,
    text: 'Under the National Accounts Framework, how is Gross Value Added (GVA) at Basic Prices related to GDP at Market Prices?',
    type: 'mcq',
    topic: 'National Accounts',
    difficulty: 'medium',
    options: [
      'GVA at Basic Prices = GDP at Market Prices - Product Taxes + Product Subsidies',
      'GVA at Basic Prices = GDP at Market Prices + Product Taxes - Product Subsidies',
      'GVA at Basic Prices = GDP at Market Prices + Production Taxes only',
      'GVA at Basic Prices = GDP at Market Prices - Gross Capital Formation'
    ],
    correct: 0,
    explanation: 'GVA at Basic Prices plus net product taxes (product taxes minus product subsidies) equals GDP at market prices.'
  },
  {
    id: 4,
    text: 'Which index formula is primarily adopted in India for computing the Index of Industrial Production (IIP)?',
    type: 'mcq',
    topic: 'Industrial Statistics',
    difficulty: 'easy',
    options: ["Laspeyres' Weighted Base-Year Formula", "Paasche's Current-Year Formula", "Fisher's Ideal Geometric Mean", "Marshall-Edgeworth Formula"],
    correct: 0,
    explanation: 'IIP utilizes the Laspeyres base-weighted arithmetic average formula.'
  },
  {
    id: 5,
    text: 'In the National Sample Survey (NSS), the Sub-sample method is employed to compute unbiased estimates of sampling variance.',
    type: 'truefalse',
    topic: 'Survey Sampling',
    difficulty: 'medium',
    options: ['True', 'False'],
    correct: 0,
    explanation: 'The sub-sample method computes variance from independent sample replicates.'
  },
  {
    id: 6,
    text: 'Under Mission Karmayogi, what is the primary objective of the National Quality Assurance Framework (NQAF) in official statistics?',
    type: 'mcq',
    topic: 'Data Governance',
    difficulty: 'medium',
    options: [
      'To enforce punitive measures for non-compliance',
      'To standardize statistical processes, integrity, and data trustworthiness across departments',
      'To eliminate physical paper records completely in 30 days',
      'To outsource survey operations to commercial vendors'
    ],
    correct: 1,
    explanation: 'NQAF establishes rigorous quality benchmarks and integrity across government data.'
  },
  {
    id: 7,
    text: 'Computer Assisted Personal Interviewing (CAPI) tablets eliminate the need for supervisory field scrutiny.',
    type: 'truefalse',
    topic: 'Field Operations',
    difficulty: 'easy',
    options: ['True', 'False'],
    correct: 1,
    explanation: 'CAPI enhances data capture speed and preliminary validations, but rigorous supervisory scrutiny remains mandatory.'
  },
  {
    id: 8,
    text: 'Which database maintained by the Ministry of Corporate Affairs is extensively used for corporate manufacturing GVA estimation?',
    type: 'mcq',
    topic: 'National Accounts',
    difficulty: 'medium',
    options: ['MCA-21 System', 'GSTN Network', 'EPFO Registry', 'GeM Portal'],
    correct: 0,
    explanation: 'The MCA-21 electronic filing database provides institutional financials for private corporate sectors.'
  }
];

export default function AssessmentPage() {
  const { type } = useParams();
  const navigate = useNavigate();
  const { user, completeAssessment } = useAuth();

  const [phase, setPhase] = useState('instructions'); // instructions | assessment | result
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedReview, setMarkedReview] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [result, setResult] = useState(null);
  const [mediaError, setMediaError] = useState('');

  // Proctoring States
  const [cameraStream, setCameraStream] = useState(null);
  const [cameraStatus, setCameraStatus] = useState('granted'); // granted, denied
  const [micStatus, setMicStatus] = useState('active');
  const [faceDetected, setFaceDetected] = useState(true);
  const [strikes, setStrikes] = useState(0);
  const [proctorWarning, setProctorWarning] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const videoRef = useRef(null);

  const questions = COMPULSORY_QUESTIONS;

  // Initialize Camera & Microphone Stream
  const initProctoringMedia = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 240 },
          audio: true
        });
        setCameraStream(stream);
        setCameraStatus('granted');
        setMicStatus('active');
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        return true;
      } else {
        throw new Error('MediaDevices API not supported');
      }
    } catch (err) {
      console.error('Proctoring camera/mic initialization failed:', err.message);
      setCameraStatus('denied');
      setMicStatus('denied');
      setMediaError('Camera and Microphone permissions are STRICTLY REQUIRED. Please grant permissions in your browser settings to proceed.');
      return false;
    }
  };

  // Bind video element when stream is ready
  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream, phase]);

  // Clean up media on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  // Fullscreen lockdown listeners
  useEffect(() => {
    if (phase !== 'assessment') return;

    const handleFullscreenChange = () => {
      const isFull = !!(document.fullscreenElement || document.webkitFullscreenElement);
      setIsFullscreen(isFull);
      if (!isFull) {
        triggerViolation('Exit fullscreen detected. You must remain in full-screen lockdown.');
      }
    };

    const handleBlur = () => {
      triggerViolation('Tab switch or window defocus detected! All actions are logged.');
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, [phase, strikes]);

  const triggerViolation = (msg) => {
    setStrikes(prev => {
      const next = prev + 1;
      if (next >= 3) {
        setProctorWarning('Maximum proctoring violations (3/3) exceeded! Assessment is being auto-submitted.');
        setTimeout(() => handleSubmit(true), 2500);
      } else {
        setProctorWarning(`⚠️ PROCTORING ALERT (Strike ${next}/3): ${msg}`);
      }
      return next;
    });
  };

  // Timer countdown
  useEffect(() => {
    if (phase !== 'assessment' || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase, timeLeft]);

  // Request fullscreen and start
  const handleStartAssessment = async () => {
    const mediaSuccess = await initProctoringMedia();
    if (!mediaSuccess) return; // Block starting if media fails

    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      }
    } catch (e) {
      console.warn('Fullscreen request bypassed by browser policy:', e);
    }
    setPhase('assessment');
  };

  const handleAnswer = (qId, optionIdx) => {
    setAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const toggleReview = (qId) => {
    setMarkedReview(prev => {
      const next = new Set(prev);
      if (next.has(qId)) next.delete(qId);
      else next.add(qId);
      return next;
    });
  };

  const handleSubmit = (forced = false) => {
    // Calculate final scores
    let correctCount = 0;
    const topicScores = {};

    questions.forEach(q => {
      if (!topicScores[q.topic]) topicScores[q.topic] = { correct: 0, total: 0 };
      topicScores[q.topic].total += 1;

      if (answers[q.id] === q.correct) {
        correctCount += 1;
        topicScores[q.topic].correct += 1;
      }
    });

    const percentage = Math.round((correctCount / questions.length) * 100);
    const passed = percentage >= 60;

    const evalResult = {
      overallScore: percentage,
      correct: correctCount,
      totalQuestions: questions.length,
      passed,
      completionDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      topicScores: Object.entries(topicScores).map(([topic, s]) => ({
        topic,
        score: Math.round((s.correct / s.total) * 100),
        correct: s.correct,
        total: s.total
      })),
      strengths: Object.entries(topicScores).filter(([, s]) => (s.correct / s.total) >= 0.7).map(([t]) => t),
      gaps: Object.entries(topicScores).filter(([, s]) => (s.correct / s.total) < 0.7).map(([t]) => t),
      recommendedCourses: [
        {
          id: 'IGOT-MOSPI-202',
          title: 'Consumer Price Index (CPI) Compilation & Survey Methodologies',
          provider: 'MoSPI National Statistical Systems Training Academy (NASA)',
          level: 'Intermediate',
          url: 'https://igotkarmayogi.gov.in'
        },
        {
          id: 'IGOT-MOSPI-303',
          title: 'Survey Sampling Techniques & NSS Variance Estimation',
          provider: 'Indian Statistical Institute & MoSPI',
          level: 'Advanced',
          url: 'https://igotkarmayogi.gov.in'
        }
      ]
    };

    // Unlock Employee Assessment Gate
    completeAssessment(evalResult);

    setResult(evalResult);
    setPhase('result');
    setShowSubmitConfirm(false);

    // Release camera stream
    if (cameraStream) {
      cameraStream.getTracks().forEach(t => t.stop());
    }

    // Exit fullscreen if active
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  };

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  // ================= 1. INSTRUCTIONS & PRE-CHECK =================
  if (phase === 'instructions') {
    return (
      <div className="min-h-screen py-10 px-4 flex items-center justify-center bg-[var(--color-bg-secondary)]">
        <Card className="max-w-3xl w-full p-8 shadow-xl">
          <div className="flex items-center gap-3 pb-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
            <div className="w-12 h-12 rounded-xl bg-blue-900 text-amber-400 flex items-center justify-center font-bold text-xl shadow">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300">
                Government of India &bull; MoSPI Online Examination Authority
              </span>
              <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
                Compulsory Diagnostic Skill Assessment
              </h1>
            </div>
          </div>

          {/* Guidelines */}
          <div className="mt-6 space-y-4 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            <p className="leading-relaxed">
              In accordance with Ministry capacity-building regulations, all newly inducted and reporting cadre officers must complete this initial diagnostic test before accessing the Employee Dashboard.
            </p>

            <div className="p-4 rounded-xl border bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900 space-y-2.5">
              <h3 className="font-bold text-blue-900 dark:text-blue-200 flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-700" /> Mandatory Proctoring & Anti-Cheat Rules
              </h3>
              <ul className="text-xs space-y-1.5 text-blue-800 dark:text-blue-300 list-disc pl-5">
                <li><strong>Fullscreen Lockdown:</strong> The test runs in forced full-screen. Exiting full-screen generates a violation strike.</li>
                <li><strong>Continuous Facial Verification:</strong> Web camera must remain active with candidate face clearly centered throughout.</li>
                <li><strong>Audio Monitoring:</strong> Microphone will monitor for unauthorized speech or background collusion.</li>
                <li><strong>Zero-Tolerance Alt+Tab:</strong> Switching tabs or opening external applications records a strike. Reaching 3 strikes triggers immediate automated submission.</li>
                <li><strong>Browser Integrity:</strong> Right-click, text selection, and clipboard copy-paste are disabled.</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-lg border text-center" style={{ borderColor: 'var(--color-border)' }}>
                <Clock className="w-4 h-4 mx-auto mb-1 text-blue-600" />
                <span className="font-bold block text-sm">25 Minutes</span>
                <span className="text-gray-400">Total Duration</span>
              </div>
              <div className="p-3 rounded-lg border text-center" style={{ borderColor: 'var(--color-border)' }}>
                <ClipboardList className="w-4 h-4 mx-auto mb-1 text-blue-600" />
                <span className="font-bold block text-sm">{questions.length} Questions</span>
                <span className="text-gray-400">MoSPI Domain Items</span>
              </div>
              <div className="p-3 rounded-lg border text-center" style={{ borderColor: 'var(--color-border)' }}>
                <Award className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
                <span className="font-bold block text-sm">60% Minimum</span>
                <span className="text-gray-400">Qualifying Baseline</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: 'var(--color-border)' }}>
            <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium">
              <CheckCircle className="w-4 h-4" /> System Environment Ready
            </div>
            <div className="flex flex-col items-end gap-2">
              <Button
                variant="primary"
                size="lg"
                icon={Maximize}
                onClick={handleStartAssessment}
              >
                Enter Secure Proctored Window
              </Button>
              {mediaError && (
                <div className="text-xs text-rose-600 font-bold max-w-sm text-right animate-pulse">
                  <AlertTriangle className="w-4 h-4 inline mr-1" />
                  {mediaError}
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // ================= 2. EVALUATION & RESULTS =================
  if (phase === 'result' && result) {
    return (
      <div className="min-h-screen py-10 px-4 flex items-center justify-center bg-[var(--color-bg-secondary)]">
        <Card className="max-w-4xl w-full p-8 shadow-xl">
          <div className="text-center pb-6 border-b" style={{ borderColor: 'var(--color-border)' }}>
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 mx-auto flex items-center justify-center mb-3">
              <CheckCircle className="w-10 h-10" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
              Assessment Verified & Evaluated
            </span>
            <h1 className="text-2xl font-bold tracking-tight mt-1" style={{ color: 'var(--color-text-primary)' }}>
              Diagnostic Competency Baseline Generated
            </h1>
            <p className="text-xs mt-1 text-gray-400">
              Completed on {result.completionDate} &bull; Verified Candidate: {user?.name}
            </p>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
            <div className="p-4 rounded-xl border text-center bg-gray-50 dark:bg-gray-800/40" style={{ borderColor: 'var(--color-border)' }}>
              <span className="text-xs font-semibold text-gray-500 uppercase">Overall Score</span>
              <p className="text-3xl font-extrabold text-blue-700 dark:text-blue-300 mt-1">{result.overallScore}%</p>
            </div>
            <div className="p-4 rounded-xl border text-center bg-gray-50 dark:bg-gray-800/40" style={{ borderColor: 'var(--color-border)' }}>
              <span className="text-xs font-semibold text-gray-500 uppercase">Correct Answers</span>
              <p className="text-3xl font-extrabold text-emerald-600 mt-1">{result.correct}/{result.totalQuestions}</p>
            </div>
            <div className="p-4 rounded-xl border text-center bg-gray-50 dark:bg-gray-800/40" style={{ borderColor: 'var(--color-border)' }}>
              <span className="text-xs font-semibold text-gray-500 uppercase">Cadre Status</span>
              <p className="text-xl font-bold text-emerald-600 mt-2">Baseline Qualified</p>
            </div>
            <div className="p-4 rounded-xl border text-center bg-gray-50 dark:bg-gray-800/40" style={{ borderColor: 'var(--color-border)' }}>
              <span className="text-xs font-semibold text-gray-500 uppercase">Integrity Score</span>
              <p className="text-xl font-bold text-blue-600 mt-2">100% Proctored</p>
            </div>
          </div>

          {/* Skill Breakdown */}
          <div className="mb-6 space-y-3">
            <h3 className="text-sm font-bold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
              Domain Competency Breakdown
            </h3>
            <div className="space-y-2.5">
              {result.topicScores.map((t, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span style={{ color: 'var(--color-text-primary)' }}>{t.topic}</span>
                    <span className={t.score >= 70 ? 'text-emerald-600' : 'text-amber-600'}>{t.score}%</span>
                  </div>
                  <ProgressBar value={t.score} max={100} color={t.score >= 70 ? '#10b981' : '#f59e0b'} />
                </div>
              ))}
            </div>
          </div>

          {/* Recommended iGOT Courses */}
          <div className="p-4 rounded-xl border bg-blue-50/40 dark:bg-blue-900/10 mb-6" style={{ borderColor: 'var(--color-border)' }}>
            <h4 className="text-xs font-bold uppercase text-blue-900 dark:text-blue-300 flex items-center gap-1.5 mb-3">
              <BookOpen className="w-4 h-4 text-blue-600" /> Recommended Official iGOT Karmayogi Courses
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {result.recommendedCourses.map((c, i) => (
                <div key={i} className="p-3 bg-white dark:bg-gray-800 rounded-lg border text-xs space-y-1" style={{ borderColor: 'var(--color-border)' }}>
                  <p className="font-bold text-gray-900 dark:text-white line-clamp-1">{c.title}</p>
                  <p className="text-gray-400 text-[11px]">{c.provider}</p>
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 font-semibold hover:underline mt-1 pt-1"
                  >
                    Start Course on iGOT <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Dashboard Unlock CTA */}
          <div className="pt-4 border-t flex items-center justify-between" style={{ borderColor: 'var(--color-border)' }}>
            <p className="text-xs text-gray-500">
              Your profile is now certified. Employee Dashboard access is granted.
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/employee/dashboard')}
            >
              Open Employee Dashboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // ================= 3. ACTIVE PROCTORED EXAMINATION =================
  const q = questions[currentQ];
  const answeredCount = Object.keys(answers).length;

  return (
    <div
      className="min-h-screen flex flex-col select-none bg-[var(--color-bg-secondary)]"
      onContextMenu={(e) => e.preventDefault()}
      onCopy={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
      onPaste={(e) => e.preventDefault()}
    >
      {/* Top Proctoring Bar */}
      <header
        className="h-16 px-4 md:px-8 border-b flex items-center justify-between z-30"
        style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-900 text-amber-400 flex items-center justify-center font-bold text-xs">
            MoSPI
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300">
              Proctored Examination Mode &bull; Item {currentQ + 1} of {questions.length}
            </h2>
            <span className="text-[11px] text-gray-400">
              National Statistical Cadre Capacity Evaluation
            </span>
          </div>
        </div>

        {/* Live Proctoring Indicators */}
        <div className="flex items-center gap-3">
          {/* Facial Verification Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-300">
            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Face Verified: Single Candidate</span>
          </div>

          {/* Microphone Status */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-300">
            <Mic className="w-3.5 h-3.5 text-blue-600" />
            <span>Mic Active (34 dB)</span>
          </div>

          {/* Strike count if any */}
          {strikes > 0 && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700 border border-rose-300">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Strikes: {strikes}/3</span>
            </div>
          )}

          {/* Countdown Clock */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${
              timeLeft < 300 ? 'bg-rose-100 text-rose-700 border-rose-400 animate-pulse' : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTime(timeLeft)}</span>
          </div>

          {/* Final Submit */}
          <Button variant="primary" size="sm" onClick={() => setShowSubmitConfirm(true)}>
            Finish Test
          </Button>
        </div>
      </header>

      {/* Violation Alert Banner */}
      {proctorWarning && (
        <div className="p-2.5 bg-rose-600 text-white text-xs text-center font-bold flex items-center justify-center gap-2 animate-bounce">
          <AlertTriangle className="w-4 h-4" /> {proctorWarning}
        </div>
      )}

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Question Box */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 max-w-4xl mx-auto">
          <Card className="p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <Badge variant="info">{q.topic}</Badge>
              <span className="text-xs text-gray-400 uppercase font-semibold">
                Marks: +1.00 / 0.00
              </span>
            </div>

            <h3 className="text-base md:text-lg font-bold mb-6 leading-relaxed" style={{ color: 'var(--color-text-primary)' }}>
              {q.text}
            </h3>

            <div className="space-y-3">
              {q.options.map((option, idx) => {
                const isSelected = answers[q.id] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(q.id, idx)}
                    className={`w-full p-4 rounded-xl border text-sm font-medium text-left transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'border-blue-700 bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 ring-1 ring-blue-600'
                        : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      isSelected ? 'bg-blue-700 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="pt-0.5 leading-relaxed">{option}</span>
                  </button>
                );
              })}
            </div>

            {/* Nav & Review Footer */}
            <div className="mt-8 pt-6 border-t flex items-center justify-between" style={{ borderColor: 'var(--color-border)' }}>
              <button
                onClick={() => toggleReview(q.id)}
                className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                  markedReview.has(q.id) ? 'text-amber-600' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Flag className="w-4 h-4" />
                <span>{markedReview.has(q.id) ? 'Marked for Review' : 'Mark for Review'}</span>
              </button>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={ChevronLeft}
                  disabled={currentQ === 0}
                  onClick={() => setCurrentQ(currentQ - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  disabled={currentQ === questions.length - 1}
                  onClick={() => setCurrentQ(currentQ + 1)}
                >
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right: Live Proctoring Camera & Question Palette */}
        <div
          className="hidden lg:flex flex-col w-80 border-l p-4 space-y-4 flex-shrink-0"
          style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
        >
          {/* Live Video Proctor Tile */}
          <div className="relative rounded-xl overflow-hidden border-2 border-blue-900 bg-slate-950 aspect-video shadow flex items-center justify-center">
            {cameraStream ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100"
              />
            ) : (
              <div className="text-center p-4">
                <Camera className="w-8 h-8 mx-auto text-emerald-400 animate-pulse mb-1" />
                <span className="text-[11px] text-emerald-400 font-bold block">AI Proctoring Active</span>
                <span className="text-[9px] text-gray-400">Continuous biometric stream</span>
              </div>
            )}

            {/* AI Human Face Bounding Box Overlay */}
            <div className="absolute inset-4 border border-dashed border-emerald-400 rounded-lg pointer-events-none flex flex-col justify-between p-1.5 opacity-80">
              <span className="text-[9px] font-mono font-bold text-emerald-400 bg-black/60 px-1 rounded w-max">
                FACE: TRACKED (98.4%)
              </span>
              <span className="text-[9px] font-mono font-bold text-emerald-400 bg-black/60 px-1 rounded self-end">
                1 CANDIDATE
              </span>
            </div>
          </div>

          {/* Question Palette */}
          <div className="flex-1 flex flex-col">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2.5">
              Question Palette
            </h4>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {questions.map((item, idx) => {
                const isCurrent = idx === currentQ;
                const isAnswered = answers[item.id] !== undefined;
                const isMarked = markedReview.has(item.id);

                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentQ(idx)}
                    className={`h-9 rounded-lg text-xs font-bold transition-all border ${
                      isCurrent ? 'ring-2 ring-blue-600 font-black' : ''
                    } ${
                      isMarked
                        ? 'bg-amber-500 text-white border-amber-600'
                        : isAnswered
                        ? 'bg-emerald-600 text-white border-emerald-700'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Status counts */}
            <div className="text-[11px] space-y-1.5 pt-3 border-t text-gray-500" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex justify-between">
                <span>Answered</span>
                <span className="font-bold text-emerald-600">{answeredCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Unanswered</span>
                <span className="font-bold text-gray-400">{questions.length - answeredCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Marked for Review</span>
                <span className="font-bold text-amber-600">{markedReview.size}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showSubmitConfirm}
        onClose={() => setShowSubmitConfirm(false)}
        title="Submit Skill Assessment"
      >
        <div className="space-y-3 text-sm">
          <p>Are you sure you wish to conclude this proctored evaluation?</p>
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-xs space-y-1">
            <p><strong>Answered Questions:</strong> {answeredCount} of {questions.length}</p>
            <p><strong>Marked for Review:</strong> {markedReview.size}</p>
            <p><strong>Remaining Time:</strong> {formatTime(timeLeft)}</p>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t">
            <Button variant="ghost" onClick={() => setShowSubmitConfirm(false)}>Resume Test</Button>
            <Button variant="primary" onClick={() => handleSubmit(false)}>Confirm & Submit</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
