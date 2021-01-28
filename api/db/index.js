const redis = require('redis');
const seedData = require('./seed');

const DATA_READY_REDIS_KEY = 'LEADERBOARD_DATA_READY';
const REDIS_LEADERBOARD = 'REDIS_LEADERBOARD';
const { promisify } = require("util");

const client = redis.createClient(process.env.REDIS_ENDPOINT_URI, {
  password: process.env.REDIS_PASSWORD,
});

const db = (func) => {
  return promisify(client[func]).bind(client);
};

const seedDb = async (force) => {
  const isDataReady = await db('get')(DATA_READY_REDIS_KEY);
  const shouldRunSeed = force || !isDataReady;

  if (!shouldRunSeed) return;

  console.log('Loading Seed Data');

  try {
    const loadCompany = (company, index) => {
      client.zadd([
        REDIS_LEADERBOARD,
        company.marketCap,
        company.symbol.toLowerCase(),
      ]);

      client.hset([
        company.symbol.toLowerCase(),
        'company',
        company.company,
        'country',
        company.country,
      ]);
    }

    seedData.forEach(loadCompany);

    await db('set')(DATA_READY_REDIS_KEY, true)
  } catch (err) {
    // pass
  }
}

module.exports = {
  client,
  seedDb,
  REDIS_LEADERBOARD,
  db,
}

