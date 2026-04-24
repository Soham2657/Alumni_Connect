const { STORAGE_KEYS } = require('../constants/storageKeys');

const createSeed = () => ({
  [STORAGE_KEYS.USERS]: [
    { id: 'admin-1', email: 'admin@university.edu', password: 'admin123', role: 'admin', name: 'Admin User', createdAt: '2025-01-01' },
    { id: 'alumni-1', email: 'priya.sharma@techcorp.com', password: 'alumni123', role: 'alumni', name: 'Dr. Priya Sharma', createdAt: '2025-01-01' },
    { id: 'student-1', email: 'student@example.com', password: 'student123', role: 'student', name: 'Student User', createdAt: '2025-01-01' }
  ],
  [STORAGE_KEYS.ALUMNI_PROFILES]: [
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
      bio: 'Passionate about building scalable systems and mentoring young engineers.',
      industry: 'Technology',
      linkedin: 'https://linkedin.com/in/priyasharma'
    }
  ],
  [STORAGE_KEYS.JOBS]: [
    {
      id: 'job-1',
      title: 'Software Development Engineer',
      company: 'Amazon',
      description: 'Looking for talented SDEs to join our team.',
      location: 'Bangalore, India',
      type: 'Full-time',
      salary: 'INR 18-25 LPA',
      postedBy: 'alumni-1',
      postedAt: '2025-01-15',
      requirements: ['3+ years experience', 'Strong DSA', 'Java or Python'],
      isActive: true
    }
  ],
  [STORAGE_KEYS.JOB_APPLICATIONS]: [],
  [STORAGE_KEYS.EVENTS]: [
    {
      id: 'event-1',
      title: 'Annual Alumni Reunion 2025',
      description: 'Join us for the grand annual reunion.',
      date: '2025-03-15',
      time: '10:00 AM',
      location: 'University Main Campus',
      type: 'reunion',
      createdBy: 'admin',
      maxAttendees: 500
    }
  ],
  [STORAGE_KEYS.EVENT_REGISTRATIONS]: [],
  [STORAGE_KEYS.DONATIONS]: [],
  [STORAGE_KEYS.MENTORSHIP_REQUESTS]: [],
  [STORAGE_KEYS.SUCCESS_STORIES]: [
    {
      id: 'story-1',
      alumniName: 'Dr. Priya Sharma',
      graduationYear: 2015,
      branch: 'Computer Science',
      title: 'From Campus to Google',
      story: 'After graduating, I worked at a startup before joining Google.',
      achievement: 'Led AI accessibility features used by millions',
      featured: true,
      createdAt: '2025-01-10'
    }
  ]
});

module.exports = { createSeed };
