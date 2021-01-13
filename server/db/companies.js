const { db, REDIS_LEADERBOARD } = require('.');

module.exports.getBySymbol = async (symbol) => {
  return db('hgetall')(symbol);
}
