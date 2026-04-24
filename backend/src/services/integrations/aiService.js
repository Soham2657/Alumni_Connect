const { OpenAI } = require('openai');
const { OPENAI_API_KEY } = require('../../config/env');

const client = OPENAI_API_KEY ? new OpenAI({ apiKey: OPENAI_API_KEY }) : null;

const normalize = (value) => String(value || '').trim().toLowerCase();

const scoreByOverlap = (querySkills, candidateSkills) => {
  const q = querySkills.map(normalize);
  const c = candidateSkills.map(normalize);
  const overlap = c.filter((skill) => q.includes(skill)).length;
  const union = new Set([...q, ...c]).size || 1;
  return overlap / union;
};

const extractKeywordsHeuristic = (text) =>
  String(text || '')
    .split(/[^a-zA-Z0-9+#.]+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 2);

const extractTags = async (text) => {
  const prompt = `Generate up to 8 concise tags (single words or short phrases) for this text. Return only comma-separated tags. Text: ${text}`;

  if (!client) {
    return extractKeywordsHeuristic(text).slice(0, 8);
  }

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.2,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.choices?.[0]?.message?.content || '';
    return content
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
      .slice(0, 8);
  } catch {
    return extractKeywordsHeuristic(text).slice(0, 8);
  }
};

const rankMentors = ({ querySkills, mentors, limit = 5 }) => {
  return mentors
    .map((mentor) => ({
      mentor,
      score: scoreByOverlap(querySkills, mentor.skills || []),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};

const recommendJobs = ({ profileSkills, jobs, limit = 5 }) => {
  return jobs
    .filter((job) => job.isActive)
    .map((job) => {
      const textSkills = [...(job.requirements || []), job.title, job.description];
      return {
        job,
        score: scoreByOverlap(profileSkills, textSkills),
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};

module.exports = {
  extractTags,
  rankMentors,
  recommendJobs,
};
