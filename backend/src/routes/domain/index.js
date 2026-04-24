const express = require('express');
const jobsRoutes = require('./jobsRoutes');
const alumniRoutes = require('./alumniRoutes');
const applicationsRoutes = require('./applicationsRoutes');
const mentorshipRoutes = require('./mentorshipRoutes');
const eventsRoutes = require('./eventsRoutes');
const donationsRoutes = require('./donationsRoutes');
const storiesRoutes = require('./storiesRoutes');
const feedbackRoutes = require('./feedbackRoutes');
const aiRoutes = require('./aiRoutes');
const analyticsRoutes = require('./analyticsRoutes');

const router = express.Router();

router.use('/jobs', jobsRoutes);
router.use('/alumni', alumniRoutes);
router.use('/applications', applicationsRoutes);
router.use('/mentorship', mentorshipRoutes);
router.use('/events', eventsRoutes);
router.use('/donations', donationsRoutes);
router.use('/stories', storiesRoutes);
router.use('/feedback', feedbackRoutes);
router.use('/ai', aiRoutes);
router.use('/analytics', analyticsRoutes);

module.exports = router;
