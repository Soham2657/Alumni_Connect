const { createSeed } = require('../data/seed');
const { STORAGE_KEYS } = require('../constants/storageKeys');
const { User } = require('../models/User');
const { DataBucket } = require('../models/DataBucket');
const { AlumniProfile } = require('../models/AlumniProfile');
const { Job } = require('../models/Job');
const { JobApplication } = require('../models/JobApplication');
const { Event } = require('../models/Event');
const { EventRegistration } = require('../models/EventRegistration');
const { Donation } = require('../models/Donation');
const { MentorshipRequest } = require('../models/MentorshipRequest');
const { SuccessStory } = require('../models/SuccessStory');
const bcrypt = require('bcryptjs');

const ensureSeedData = async () => {
  const seed = createSeed();

  const usersCount = await User.estimatedDocumentCount();
  if (usersCount === 0) {
    const users = await Promise.all(
      seed[STORAGE_KEYS.USERS].map(async (user) => ({
        ...user,
        password: user.password.startsWith('$2') ? user.password : await bcrypt.hash(user.password, 10),
      }))
    );
    await User.insertMany(users);
  }

  const modelSeedMap = [
    { model: AlumniProfile, key: STORAGE_KEYS.ALUMNI_PROFILES },
    { model: Job, key: STORAGE_KEYS.JOBS },
    { model: JobApplication, key: STORAGE_KEYS.JOB_APPLICATIONS },
    { model: Event, key: STORAGE_KEYS.EVENTS },
    { model: EventRegistration, key: STORAGE_KEYS.EVENT_REGISTRATIONS },
    { model: Donation, key: STORAGE_KEYS.DONATIONS },
    { model: MentorshipRequest, key: STORAGE_KEYS.MENTORSHIP_REQUESTS },
    { model: SuccessStory, key: STORAGE_KEYS.SUCCESS_STORIES },
  ];

  for (const entry of modelSeedMap) {
    const count = await entry.model.estimatedDocumentCount();
    if (count === 0 && Array.isArray(seed[entry.key]) && seed[entry.key].length > 0) {
      await entry.model.insertMany(seed[entry.key]);
    }
  }

  const bucketKeys = Object.keys(seed).filter((key) => key !== STORAGE_KEYS.USERS);
  for (const key of bucketKeys) {
    const exists = await DataBucket.exists({ key });
    if (!exists) {
      await DataBucket.create({ key, value: seed[key] });
    }
  }
};

module.exports = { ensureSeedData };
