const { Event } = require('../../models/Event');
const { EventRegistration } = require('../../models/EventRegistration');
const { generateId } = require('../../utils/id');

const listEvents = async (_req, res) => {
  const data = await Event.find().sort({ createdAt: -1 }).lean();
  res.json({ success: true, data });
};

const createEvent = async (req, res) => {
  const data = await Event.create({
    id: generateId(),
    ...req.body,
    createdBy: req.user.id,
  });
  res.status(201).json({ success: true, data });
};

const registerForEvent = async (req, res) => {
  const { id } = req.params;
  const exists = await EventRegistration.findOne({ eventId: id, userId: req.user.id }).lean();
  if (exists) return res.status(409).json({ success: false, error: 'Already registered' });

  const data = await EventRegistration.create({
    id: generateId(),
    eventId: id,
    userId: req.user.id,
    registeredAt: new Date().toISOString(),
  });
  res.status(201).json({ success: true, data });
};

const listEventRegistrations = async (req, res) => {
  const data = await EventRegistration.find({ eventId: req.params.id }).lean();
  res.json({ success: true, data });
};

module.exports = {
  listEvents,
  createEvent,
  registerForEvent,
  listEventRegistrations,
};
