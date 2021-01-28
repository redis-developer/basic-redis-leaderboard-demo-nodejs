const { db, REDIS_LEADERBOARD } = require('.');

const zrange = async (start, end, isDesc) => {
  const results = await db(isDesc ? 'zrevrange' : 'zrange')([REDIS_LEADERBOARD, start, end, 'WITHSCORES']);

  const data = [];
  let startRank = isDesc ? start + 1 : (results.length / 2 - start);
  const increaseFactor = isDesc ? 1 : -1;

  for (let i = 0; i < results.length; i += 2) {
    data.push({
      rank: startRank,
      symbol: results[i],
      marketCap: results[i + 1],
    });
    startRank +=  increaseFactor;
  }

  return data;
}

// 1.Top 10 companies: zrevrange companyLeaderboard 0 9 WITHSCORES
module.exports.top10 = () => {
  return zrange(0, 9, true);
}

// 2.All companies: zrevrange companyLeaderboard 0 -1 WITHSCORES
module.exports.all = () => {
  return zrange(0, -1, true);
}

// 3.Bottom 10 companies: zrange companyLeaderboard 0 9 WITHSCORES 
module.exports.bottom10 = () => {
  return zrange(0, 9);
}

// 4.Between rank 10 and 15:  zrevange companyLeaderboard 9 14 WITHSCORES
module.exports.inRank = ({ start, end }) => {
  return zrange(+start, +end, true);
}

// 5.Show ranks of AAPL, FB and TSLA:  ZMSCORE companyLeaderBoard company:AAPL company:FB company:TSLA
module.exports.getBySymbol = async ({ symbols }) => {
  const results = await Promise.all(
    symbols.map(symbol => db('zscore')([REDIS_LEADERBOARD, symbol]))
  )
  const data = [];
  results.forEach((marketCap, index) => {
    data.push({
      marketCap,
      symbol: symbols[index],
    });
  });

  return data;
}

const a = async ({ nextToken }) => {
  let results = [];
  if (!!nextToken) {
    results = await db('zscan')([nextToken, REDIS_LEADERBOARD, 'COUNT', 10]);
  } else {  
    results = await db('zscan')([0, REDIS_LEADERBOARD, 'COUNT', 10]);
  }
}

// 6.Pagination: Show 1st 10 companies: ZSCAN 0 companyLeaderBoard COUNT 10
module.exports.paginate = (nextToken) => {
  return zscan(nextToken);
}

// 7.Pagination: Show next 10 companies: ZSCAN <return value from the 1st 10 companies> companyLeaderBoard COUNT 10

// 8. Adding market cap to companies: ZINCRBY companyLeaderBoard  1000000000 "company:FB" 
// 9. Reducing market cap to companies: ZINCRBY companyLeaderBoard  -1000000000 "company:FB" 
module.exports.zincrby = async (amount, symbol) => {
  return db('zincrby')([REDIS_LEADERBOARD, amount, symbol]);
}

// 10. Companies over a Trillion: ZCOUNT companyLeaderBoard 1000000000000  +inf
// 11. # companies between 500 billion and 1 trillion: ZCOUNT companyLeaderBoard 500000000000 1000000000000

