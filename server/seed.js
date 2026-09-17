import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Employee from './models/Employee.js';
import Course from './models/Course.js';
import Assessment from './models/Assessment.js';
import Notification from './models/Notification.js';
import Task from './models/Task.js';
import Meeting from './models/Meeting.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/SIH';

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to SIH database for seeding...');

    // Clear existing collections
    await Promise.all([
      User.deleteMany({}),
      Employee.deleteMany({}),
      Course.deleteMany({}),
      Assessment.deleteMany({}),
      Notification.deleteMany({}),
      Task.deleteMany({}),
      Meeting.deleteMany({})
    ]);

    console.log('Cleared existing records.');

    // 1. Administrative Leaders
    const adminUser = await User.create({
      name: 'Dr. Alok Verma, Additional Secretary',
      email: 'admin@mospi.gov.in',
      password: 'Admin@123',
      role: 'admin',
      department: 'Coordination & Administration',
      designation: 'Super Administrator',
      cadre: 'ISS',
      employeeId: 'ADM-2020-001'
    });

    const hrUser = await User.create({
      name: 'Smt. Sunita Rao, Director (Training & HR)',
      email: 'hr@mospi.gov.in',
      password: 'Hr@123',
      role: 'hr',
      department: 'Training Division (NASA)',
      designation: 'Director (Training)',
      cadre: 'ISS',
      employeeId: 'HR-2018-042'
    });

    // 2. Realistic MoSPI Cadre Officers across ISS & SSS
    const officerProfiles = [
      {
        name: 'Shri Rajesh Sharma',
        email: 'rajesh.sharma@mospi.gov.in',
        cadre: 'SSS',
        batch: '2019',
        designation: 'Senior Statistical Officer (SSO)',
        division: 'Field Operations Division (FOD)',
        subOffice: 'Regional Office, Jaipur, Rajasthan',
        reportingOfficer: 'Dr. Anita Verma, Joint Director',
        status: 'active',
        skills: [
          { name: 'Survey Sampling & Estimation', currentScore: 85, targetScore: 90 },
          { name: 'CPI Index Calculation', currentScore: 90, targetScore: 85 },
          { name: 'Python/R Analytics', currentScore: 68, targetScore: 80 },
          { name: 'Data Ethics & NQAF', currentScore: 95, targetScore: 90 }
        ],
        progress: { overallPercentage: 76, coursesCompleted: 3, assessmentsPassed: 4, weeklyReportsSubmitted: 12 },
        onboardingCompleted: true
      },
      {
        name: 'Dr. Priya Patel',
        email: 'priya.patel@mospi.gov.in',
        cadre: 'ISS',
        batch: '2021',
        designation: 'Assistant Director',
        division: 'National Accounts Division (NAD)',
        subOffice: 'HQ, New Delhi',
        reportingOfficer: 'Shri K. S. Murthy, DDG',
        status: 'active',
        skills: [
          { name: 'Gross Value Added (GVA)', currentScore: 92, targetScore: 90 },
          { name: 'Supply Use Tables', currentScore: 82, targetScore: 85 },
          { name: 'Corporate Accounts (MCA-21)', currentScore: 86, targetScore: 80 }
        ],
        progress: { overallPercentage: 88, coursesCompleted: 5, assessmentsPassed: 5, weeklyReportsSubmitted: 16 },
        onboardingCompleted: true
      },
      {
        name: 'Shri Amit Kumar Meena',
        email: 'amit.meena@mospi.gov.in',
        cadre: 'SSS',
        batch: '2022',
        designation: 'Junior Statistical Officer (JSO)',
        division: 'Field Operations Division (FOD)',
        subOffice: 'Sub-Regional Office, Ajmer',
        reportingOfficer: 'Shri Rajesh Sharma, SSO',
        status: 'active',
        skills: [
          { name: 'CAPI Field Protocols', currentScore: 80, targetScore: 85 },
          { name: 'Primary Household Listing', currentScore: 88, targetScore: 85 },
          { name: 'Field Scrutiny Verification', currentScore: 74, targetScore: 80 }
        ],
        progress: { overallPercentage: 62, coursesCompleted: 2, assessmentsPassed: 2, weeklyReportsSubmitted: 8 },
        onboardingCompleted: true
      },
      {
        name: 'Smt. Kavita Deshmukh',
        email: 'kavita.deshmukh@mospi.gov.in',
        cadre: 'ISS',
        batch: '2018',
        designation: 'Deputy Director',
        division: 'Economic Statistics Division (ESD)',
        subOffice: 'New Delhi HQ',
        reportingOfficer: 'Dr. Alok Verma, Additional Secretary',
        status: 'active',
        skills: [
          { name: 'Index of Industrial Production (IIP)', currentScore: 94, targetScore: 90 },
          { name: 'Annual Survey of Industries (ASI)', currentScore: 91, targetScore: 90 },
          { name: 'Time Series Forecasting', currentScore: 79, targetScore: 85 }
        ],
        progress: { overallPercentage: 92, coursesCompleted: 6, assessmentsPassed: 6, weeklyReportsSubmitted: 22 },
        onboardingCompleted: true
      },
      {
        name: 'Shri Arvind Swaminathan',
        email: 'arvind.swami@mospi.gov.in',
        cadre: 'ISS',
        batch: '2020',
        designation: 'Joint Director',
        division: 'Survey Design & Research Division (SDRD)',
        subOffice: 'Mahalanobis Bhavan, Kolkata',
        reportingOfficer: 'Director General, NSSO',
        status: 'active',
        skills: [
          { name: 'Sampling Design & Stratification', currentScore: 96, targetScore: 95 },
          { name: 'Sub-Sample Variance Estimation', currentScore: 93, targetScore: 90 },
          { name: 'Questionnaire Optimization', currentScore: 89, targetScore: 85 }
        ],
        progress: { overallPercentage: 95, coursesCompleted: 7, assessmentsPassed: 6, weeklyReportsSubmitted: 24 },
        onboardingCompleted: true
      },
      {
        name: 'Smt. Meenakshi Sundaram',
        email: 'meenakshi.s@mospi.gov.in',
        cadre: 'SSS',
        batch: '2020',
        designation: 'Senior Statistical Officer (SSO)',
        division: 'Price Statistics Division (PSD)',
        subOffice: 'Regional Office, Chennai, Tamil Nadu',
        reportingOfficer: 'Dr. K. Ramanathan, Director',
        status: 'active',
        skills: [
          { name: 'Consumer Price Index (CPI)', currentScore: 92, targetScore: 90 },
          { name: 'Rural/Urban Quotation Scrutiny', currentScore: 88, targetScore: 85 },
          { name: 'Chained Laspeyres Algorithm', currentScore: 84, targetScore: 85 }
        ],
        progress: { overallPercentage: 81, coursesCompleted: 4, assessmentsPassed: 4, weeklyReportsSubmitted: 14 },
        onboardingCompleted: true
      },
      {
        name: 'Shri Aniket Mukherjee',
        email: 'aniket.m@mospi.gov.in',
        cadre: 'SSS',
        batch: '2023',
        designation: 'Junior Statistical Officer (JSO)',
        division: 'Coordination & Publication Division (CPD)',
        subOffice: 'HQ, New Delhi',
        reportingOfficer: 'Smt. Kavita Deshmukh, Deputy Director',
        status: 'probation',
        skills: [
          { name: 'Statistical Year Book Compilation', currentScore: 72, targetScore: 80 },
          { name: 'Data Visualization & Charts', currentScore: 78, targetScore: 80 },
          { name: 'Government Publication Standards', currentScore: 75, targetScore: 85 }
        ],
        progress: { overallPercentage: 45, coursesCompleted: 1, assessmentsPassed: 2, weeklyReportsSubmitted: 6 },
        onboardingCompleted: true
      },
      {
        name: 'Dr. Suresh Chandra Joshi',
        email: 'suresh.joshi@mospi.gov.in',
        cadre: 'ISS',
        batch: '2016',
        designation: 'Director',
        division: 'National Statistical Systems Training Academy (NASA)',
        subOffice: 'Greater Noida Campus, UP',
        reportingOfficer: 'Additional Director General (Training)',
        status: 'active',
        skills: [
          { name: 'Capacity Building Pedagogy', currentScore: 95, targetScore: 95 },
          { name: 'Official Statistics Framework', currentScore: 98, targetScore: 95 },
          { name: 'International UN-SDG Indicators', currentScore: 92, targetScore: 90 }
        ],
        progress: { overallPercentage: 98, coursesCompleted: 8, assessmentsPassed: 7, weeklyReportsSubmitted: 28 },
        onboardingCompleted: true
      }
    ];

    for (let i = 0; i < officerProfiles.length; i++) {
      const p = officerProfiles[i];
      const userDoc = await User.create({
        name: p.name,
        email: p.email,
        password: 'Officer@123',
        role: 'employee',
        department: p.division,
        designation: p.designation,
        cadre: p.cadre,
        employeeId: `EMP-2024-0${80 + i}`
      });

      await Employee.create({
        user: userDoc._id,
        employeeId: userDoc.employeeId,
        fullName: p.name,
        email: p.email,
        cadre: p.cadre,
        batch: p.batch,
        designation: p.designation,
        division: p.division,
        subOffice: p.subOffice,
        reportingOfficer: p.reportingOfficer,
        status: p.status,
        skills: p.skills,
        progress: p.progress,
        onboardingCompleted: p.onboardingCompleted
      });
    }

    // 3. Official iGOT Karmayogi Courses
    await Course.create([
      {
        courseId: 'IGOT-MOSPI-101',
        title: 'National Statistical Framework & Official Data Quality in India',
        description: 'Comprehensive introduction to the architecture of official statistics, NQAF standards, and MoSPI statistical mandates.',
        category: 'Official Statistics',
        cadre: ['ISS', 'SSS'],
        durationHours: 6,
        modulesCount: 5,
        isMandatory: true,
        level: 'Beginner',
        enrolledCount: 1420
      },
      {
        courseId: 'IGOT-MOSPI-202',
        title: 'Consumer Price Index (CPI) Compilation & Survey Methodologies',
        description: 'Detailed analysis of rural/urban price collections, elementary index chaining, and seasonal commodity adjustments.',
        category: 'Price Statistics',
        cadre: ['ISS', 'SSS'],
        durationHours: 8,
        modulesCount: 6,
        isMandatory: true,
        level: 'Intermediate',
        enrolledCount: 980
      },
      {
        courseId: 'IGOT-MOSPI-303',
        title: 'Survey Sampling Techniques & NSS Variance Estimation',
        description: 'Multi-stage stratified sampling designs, sub-sample variance formulation, and CAPI field protocol implementation.',
        category: 'Survey Methods',
        cadre: ['ISS', 'SSS'],
        durationHours: 10,
        modulesCount: 8,
        isMandatory: false,
        level: 'Advanced',
        enrolledCount: 750
      },
      {
        courseId: 'IGOT-MOSPI-404',
        title: 'National Accounts Statistics & Gross Value Added (GVA)',
        description: 'Compilation of institutional sector accounts, sequence of accounts, and corporate financial integration via MCA-21.',
        category: 'National Accounts',
        cadre: ['ISS'],
        durationHours: 12,
        modulesCount: 9,
        isMandatory: true,
        level: 'Advanced',
        enrolledCount: 610
      },
      {
        courseId: 'IGOT-MOSPI-505',
        title: 'Index of Industrial Production (IIP) and ASI Compilation',
        description: 'Techniques for manufacturing output indices, item weighting diagrams, and factory sector survey validation.',
        category: 'Industrial Statistics',
        cadre: ['ISS', 'SSS'],
        durationHours: 7,
        modulesCount: 5,
        isMandatory: true,
        level: 'Intermediate',
        enrolledCount: 890
      }
    ]);

    // 4. Initial Diagnostic Assessment
    await Assessment.create([
      {
        title: 'MoSPI Compulsory Baseline Diagnostic Assessment',
        type: 'initial',
        description: 'Compulsory initial evaluation to benchmark statistical, survey, and national accounts competencies.',
        durationMinutes: 25,
        passingScore: 60,
        questions: [
          {
            questionText: 'What is the base year currently utilized for compiling the All-India Consumer Price Index (CPI) combined series by MoSPI?',
            options: ['2004-05', '2011-12', '2012', '2017-18'],
            correctOptionIndex: 2,
            explanation: 'The current base year for CPI (Rural, Urban, Combined) is 2012=100.'
          },
          {
            questionText: 'In multi-stage survey sampling, what is typically the First Stage Unit (FSU) in rural sectors?',
            options: ['Gram Panchayat', 'Revenue Village / Census Village', 'Block Development Office', 'Household'],
            correctOptionIndex: 1,
            explanation: '2011 Census villages serve as FSUs in rural strata.'
          },
          {
            questionText: 'Which formula is used for compiling the Index of Industrial Production (IIP) in India?',
            options: ['Laspeyres Formula', 'Paasche Formula', 'Fisher Ideal Index', 'Marshall-Edgeworth Index'],
            correctOptionIndex: 0,
            explanation: 'IIP is compiled using the Laspeyres base-weighted formula.'
          }
        ]
      }
    ]);

    // 5. Notifications
    await Notification.create([
      {
        title: 'MoSPI Circular: Mandatory iGOT Karmayogi Q3 Training Compliance',
        message: 'All ISS and SSS officers must complete the accredited module on Data Governance and Ethics in Official Statistics before September 30, 2026.',
        type: 'circular',
        priority: 'high'
      },
      {
        title: 'Scheduled Cadre Review Meeting with Additional Secretary',
        message: 'Review of NSS 80th Round sampling verification pipelines scheduled for Sep 25 at 11:00 AM IST via NIC VC.',
        type: 'meeting',
        priority: 'medium'
      }
    ]);

    // 6. Meetings
    await Meeting.create([
      {
        title: 'Monthly Field Scrutiny Review with DDG (FOD)',
        date: new Date(Date.now() + 86400000 * 3),
        durationMinutes: 60,
        organizer: 'Dr. Rajiv Kumar, DDG (FOD)',
        meetingUrl: 'https://meet.nic.in/fod-review',
        status: 'scheduled'
      },
      {
        title: 'CAPI Tablet Validation Technical Briefing',
        date: new Date(Date.now() + 86400000 * 7),
        durationMinutes: 45,
        organizer: 'Computer Centre & SDRD',
        meetingUrl: 'https://meet.nic.in/capi-tech',
        status: 'scheduled'
      }
    ]);

    console.log('✅ MoSPI platform database successfully seeded into mongodb://localhost:27017/SIH!');
    console.log('Seeded 8 realistic ISS & SSS Cadre Officers across FOD, NAD, ESD, SDRD, PSD, CPD, and NASA.');
    console.log('Default credentials:');
    console.log('Super Admin: admin@mospi.gov.in / Admin@123');
    console.log('HR Admin: hr@mospi.gov.in / Hr@123');
    console.log('Officer: rajesh.sharma@mospi.gov.in / Officer@123');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seed();
