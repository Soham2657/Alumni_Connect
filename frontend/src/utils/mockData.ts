import { STORAGE_KEYS, saveToLocalStorage, getFromLocalStorage } from './localStorage';

export interface User {
  id: string;
  email: string;
  password: string;
  role: 'alumni' | 'student' | 'admin';
  name: string;
  createdAt: string;
}

export interface AlumniProfile {
  userId: string;
  name: string;
  email: string;
  graduationYear: number;
  branch: string;
  currentCompany: string;
  role: string;
  skills: string[];
  location: string;
  bio: string;
  avatar?: string;
  linkedin?: string;
  industry: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Internship' | 'Contract';
  salary?: string;
  postedBy: string;
  postedAt: string;
  requirements: string[];
  isActive: boolean;
}

export interface JobApplication {
  id: string;
  jobId: string;
  userId: string;
  appliedAt: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  coverLetter?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: 'reunion' | 'workshop' | 'seminar' | 'networking' | 'cultural';
  createdBy: string;
  maxAttendees?: number;
  image?: string;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  registeredAt: string;
}

export interface Donation {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  purpose: 'scholarship' | 'infrastructure' | 'research' | 'general';
  message?: string;
  donatedAt: string;
  transactionId: string;
}

export interface MentorshipRequest {
  id: string;
  mentorId: string;
  menteeId: string;
  menteeName: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  requestedAt: string;
}

export interface SuccessStory {
  id: string;
  alumniName: string;
  graduationYear: number;
  branch: string;
  title: string;
  story: string;
  achievement: string;
  image?: string;
  createdAt: string;
  featured: boolean;
}

// Sample data
const sampleAlumniProfiles: AlumniProfile[] = [
  {
    userId: 'alumni-1',
    name: 'Dr. Priya Sharma',
    email: 'priya.sharma@techcorp.com',
    graduationYear: 2015,
    branch: 'Computer Science',
    currentCompany: 'Google',
    role: 'Senior Software Engineer',
    skills: ['Python', 'Machine Learning', 'Cloud Computing', 'System Design'],
    location: 'Bangalore, India',
    bio: 'Passionate about building scalable systems and mentoring young engineers. 8+ years in tech.',
    industry: 'Technology',
    linkedin: 'https://linkedin.com/in/priyasharma',
  },
  {
    userId: 'alumni-2',
    name: 'Rajesh Kumar',
    email: 'rajesh.k@startup.io',
    graduationYear: 2012,
    branch: 'Electronics',
    currentCompany: 'Flipkart',
    role: 'Product Manager',
    skills: ['Product Strategy', 'Data Analysis', 'Agile', 'Leadership'],
    location: 'Mumbai, India',
    bio: 'Ex-founder turned PM. Love building products that solve real problems.',
    industry: 'E-commerce',
    linkedin: 'https://linkedin.com/in/rajeshk',
  },
  {
    userId: 'alumni-3',
    name: 'Anita Desai',
    email: 'anita.d@consulting.com',
    graduationYear: 2018,
    branch: 'Mechanical',
    currentCompany: 'McKinsey & Company',
    role: 'Associate Consultant',
    skills: ['Strategy', 'Operations', 'Analytics', 'Presentation'],
    location: 'Delhi, India',
    bio: 'Helping enterprises transform and grow. Open to mentoring students in consulting.',
    industry: 'Consulting',
  },
  {
    userId: 'alumni-4',
    name: 'Vikram Singh',
    email: 'vikram.singh@bank.com',
    graduationYear: 2010,
    branch: 'Civil',
    currentCompany: 'HDFC Bank',
    role: 'Vice President',
    skills: ['Finance', 'Risk Management', 'Team Leadership', 'Banking Operations'],
    location: 'Chennai, India',
    bio: '14 years in banking sector. Passionate about financial inclusion.',
    industry: 'Finance',
  },
  {
    userId: 'alumni-5',
    name: 'Meera Patel',
    email: 'meera@healthtech.com',
    graduationYear: 2016,
    branch: 'Biotechnology',
    currentCompany: 'PharmEasy',
    role: 'Head of Research',
    skills: ['Biotechnology', 'Research', 'Drug Discovery', 'Team Management'],
    location: 'Hyderabad, India',
    bio: 'Leading research initiatives in healthcare technology. PhD in Molecular Biology.',
    industry: 'Healthcare',
  },
];

const sampleJobs: Job[] = [
  {
    id: 'job-1',
    title: 'Software Development Engineer',
    company: 'Amazon',
    description: 'Looking for talented SDEs to join our team. Work on large-scale distributed systems.',
    location: 'Bangalore, India',
    type: 'Full-time',
    salary: '₹18-25 LPA',
    postedBy: 'alumni-1',
    postedAt: '2025-01-15',
    requirements: ['3+ years experience', 'Strong DSA', 'Java/Python', 'System Design'],
    isActive: true,
  },
  {
    id: 'job-2',
    title: 'Product Management Intern',
    company: 'Flipkart',
    description: 'Summer internship opportunity for aspiring product managers.',
    location: 'Mumbai, India',
    type: 'Internship',
    salary: '₹50,000/month',
    postedBy: 'alumni-2',
    postedAt: '2025-01-20',
    requirements: ['Final year students', 'Strong analytical skills', 'Good communication'],
    isActive: true,
  },
  {
    id: 'job-3',
    title: 'Business Analyst',
    company: 'Deloitte',
    description: 'Join our consulting practice and work with Fortune 500 clients.',
    location: 'Delhi, India',
    type: 'Full-time',
    salary: '₹12-18 LPA',
    postedBy: 'alumni-3',
    postedAt: '2025-01-18',
    requirements: ['MBA/Engineering degree', 'Excel proficiency', 'Problem-solving skills'],
    isActive: true,
  },
];

const sampleEvents: Event[] = [
  {
    id: 'event-1',
    title: 'Annual Alumni Reunion 2025',
    description: 'Join us for the grand annual reunion! Meet old friends, network, and celebrate our alma mater.',
    date: '2025-03-15',
    time: '10:00 AM',
    location: 'University Main Campus',
    type: 'reunion',
    createdBy: 'admin',
    maxAttendees: 500,
  },
  {
    id: 'event-2',
    title: 'Tech Talk: Future of AI',
    description: 'An insightful session by Dr. Priya Sharma on the latest trends in AI and Machine Learning.',
    date: '2025-02-20',
    time: '3:00 PM',
    location: 'Virtual (Zoom)',
    type: 'seminar',
    createdBy: 'admin',
    maxAttendees: 200,
  },
  {
    id: 'event-3',
    title: 'Career Workshop: Breaking into Consulting',
    description: 'Learn how to crack consulting interviews from industry experts.',
    date: '2025-02-28',
    time: '11:00 AM',
    location: 'Seminar Hall B',
    type: 'workshop',
    createdBy: 'admin',
    maxAttendees: 100,
  },
];

const sampleSuccessStories: SuccessStory[] = [
  {
    id: 'story-1',
    alumniName: 'Dr. Priya Sharma',
    graduationYear: 2015,
    branch: 'Computer Science',
    title: 'From Campus to Google: A Journey of Persistence',
    story: 'After graduating, I joined a startup where I learned the ropes of building products. The challenges I faced there prepared me for bigger opportunities. Today, I lead a team at Google working on cutting-edge AI projects.',
    achievement: 'Led the development of AI-powered accessibility features used by millions',
    featured: true,
    createdAt: '2025-01-10',
  },
  {
    id: 'story-2',
    alumniName: 'Arjun Reddy',
    graduationYear: 2013,
    branch: 'Electrical',
    title: 'Building India\'s Leading EdTech Startup',
    story: 'The entrepreneurship cell at our university sparked my passion for startups. After working at a few companies, I founded EduLearn, which now serves 5 million students across India.',
    achievement: 'Founded EduLearn - valued at $100M',
    featured: true,
    createdAt: '2025-01-08',
  },
  {
    id: 'story-3',
    alumniName: 'Sneha Gupta',
    graduationYear: 2017,
    branch: 'Chemical',
    title: 'Pioneering Sustainable Manufacturing',
    story: 'My research during college on sustainable materials led me to pursue a career in green technology. Now I help Fortune 500 companies reduce their carbon footprint.',
    achievement: 'Helped companies reduce 50,000 tons of CO2 emissions annually',
    featured: false,
    createdAt: '2025-01-05',
  },
];

const sampleDonations: Donation[] = [
  {
    id: 'donation-1',
    userId: 'alumni-1',
    userName: 'Dr. Priya Sharma',
    amount: 100000,
    purpose: 'scholarship',
    message: 'For bright students who need financial support',
    donatedAt: '2025-01-10',
    transactionId: 'TXN123456',
  },
  {
    id: 'donation-2',
    userId: 'alumni-2',
    userName: 'Rajesh Kumar',
    amount: 250000,
    purpose: 'infrastructure',
    message: 'For the new computer lab',
    donatedAt: '2025-01-05',
    transactionId: 'TXN123457',
  },
];

// Initialize mock data
export const initializeMockData = () => {
  // Only initialize if data doesn't exist
  if (!getFromLocalStorage(STORAGE_KEYS.ALUMNI_PROFILES, null)) {
    saveToLocalStorage(STORAGE_KEYS.ALUMNI_PROFILES, sampleAlumniProfiles);
  }
  if (!getFromLocalStorage(STORAGE_KEYS.JOBS, null)) {
    saveToLocalStorage(STORAGE_KEYS.JOBS, sampleJobs);
  }
  if (!getFromLocalStorage(STORAGE_KEYS.EVENTS, null)) {
    saveToLocalStorage(STORAGE_KEYS.EVENTS, sampleEvents);
  }
  if (!getFromLocalStorage(STORAGE_KEYS.SUCCESS_STORIES, null)) {
    saveToLocalStorage(STORAGE_KEYS.SUCCESS_STORIES, sampleSuccessStories);
  }
  if (!getFromLocalStorage(STORAGE_KEYS.DONATIONS, null)) {
    saveToLocalStorage(STORAGE_KEYS.DONATIONS, sampleDonations);
  }
  if (!getFromLocalStorage(STORAGE_KEYS.USERS, null)) {
    const defaultUsers: User[] = [
      { id: 'admin-1', email: 'admin@university.edu', password: 'admin123', role: 'admin', name: 'Admin User', createdAt: '2025-01-01' },
    ];
    saveToLocalStorage(STORAGE_KEYS.USERS, defaultUsers);
  }
};

// Generate unique ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
