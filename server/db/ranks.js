const { db, REDIS_LEADERBOARD } = require('.');

const zrange = async (start, end, isDesc) => {
  const results = await db(isDesc ? 'zrange' : 'zrevrange')([REDIS_LEADERBOARD, start, end, 'WITHSCORES']);

  const data = [];
  for (let i = 0; i < results.length; i += 2) {
    data.push({
      symbol: results[i],
      marketCap: results[i + 1],
    });
  }

  return data;
}

// 1.Top 10 companies: zrevrange companyLeaderboard 0 9 WITHSCORES
module.exports.top10 = () => {
  return zrange(0, 9, true);
}

// 2.All companies: zrevrange companyLeaderboard 0 -1 WITHSCORES
module.exports.all = () => {
  return zrange(0, -1);
}

// 3.Bottom 10 companies: zrange companyLeaderboard 0 9 WITHSCORES 
module.exports.bottom10 = () => {
  return zrange(0, -1, true);
}

// 4.Between rank 10 and 15:  zrevange companyLeaderboard 9 14 WITHSCORES
module.exports.inRank = ({ start, end }) => {
  return zrange(start, end, true);
}

// 5.Show ranks of AAPL, FB and TSLA:  ZMSCORE companyLeaderBoard company:AAPL company:FB company:TSLA
module.exports.getBySymbol = ({ symbols }) => {
  return db('zscore')([REDIS_LEADERBOARD].concat(symbols));
}

const zscan = async ({ nextToken }) => {
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
// 10. Companies over a Trillion: ZCOUNT companyLeaderBoard 1000000000000  +inf
// 11. # companies between 500 billion and 1 trillion: ZCOUNT companyLeaderBoard 500000000000 1000000000000

