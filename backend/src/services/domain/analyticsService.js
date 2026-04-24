const { User } = require('../../models/User');
const { Donation } = require('../../models/Donation');
const { EventRegistration } = require('../../models/EventRegistration');
const { MentorshipRequest } = require('../../models/MentorshipRequest');
const { Feedback } = require('../../models/Feedback');

const toMonth = (iso) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return 'unknown';
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

const groupCount = (items, keyFn) => {
  const map = {};
  items.forEach((item) => {
    const key = keyFn(item);
    map[key] = (map[key] || 0) + 1;
  });
  return map;
};

const groupSum = (items, keyFn, valueFn) => {
  const map = {};
  items.forEach((item) => {
    const key = keyFn(item);
    map[key] = (map[key] || 0) + valueFn(item);
  });
  return map;
};

const getEngagementInsights = async () => {
  const [users, donations, registrations, mentorship, feedback] = await Promise.all([
    User.find().lean(),
    Donation.find().lean(),
    EventRegistration.find().lean(),
    MentorshipRequest.find().lean(),
    Feedback.find().lean(),
  ]);

  const cohorts = groupCount(users, (item) => toMonth(item.createdAt));
  const eventParticipation = groupCount(registrations, (item) => toMonth(item.registeredAt));
  const donationTrends = {
    countByMonth: groupCount(donations, (item) => toMonth(item.donatedAt)),
    amountByMonth: groupSum(donations, (item) => toMonth(item.donatedAt), (item) => Number(item.amount || 0)),
  };

  const totalMentorship = mentorship.length;
  const acceptedMentorship = mentorship.filter((item) => item.status === 'accepted').length;
  const mentorSuccessRate = totalMentorship ? acceptedMentorship / totalMentorship : 0;

  const averageFeedbackRating = feedback.length
    ? feedback.reduce((sum, item) => sum + Number(item.rating || 0), 0) / feedback.length
    : 0;

  return {
    monthlyCohorts: cohorts,
    eventParticipation,
    donationTrends,
    mentorMatchSuccessRate: Number(mentorSuccessRate.toFixed(4)),
    feedback: {
      count: feedback.length,
      averageRating: Number(averageFeedbackRating.toFixed(2)),
    },
  };
};

module.exports = { getEngagementInsights };
