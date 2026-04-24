const { STORAGE_KEYS } = require('../constants/storageKeys');
const { User } = require('../models/User');
const { DataBucket } = require('../models/DataBucket');

const getBootstrapData = async () => {
  const users = await User.find().lean();
  const buckets = await DataBucket.find().lean();

  const data = { [STORAGE_KEYS.USERS]: users };
  buckets.forEach((bucket) => {
    data[bucket.key] = bucket.value;
  });

  return data;
};

const getDataByKey = async (key) => {
  if (key === STORAGE_KEYS.USERS) {
    return User.find().lean();
  }

  const bucket = await DataBucket.findOne({ key }).lean();
  return bucket?.value ?? null;
};

const setDataByKey = async (key, value) => {
  if (key === STORAGE_KEYS.USERS) {
    if (!Array.isArray(value)) {
      return;
    }

    await User.deleteMany({});
    if (value.length > 0) {
      await User.insertMany(value);
    }
    return;
  }

  await DataBucket.findOneAndUpdate(
    { key },
    { key, value },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
};

module.exports = {
  getBootstrapData,
  getDataByKey,
  setDataByKey,
};
