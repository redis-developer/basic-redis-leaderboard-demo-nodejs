const rankDb = require('../db/ranks');
const companyDb = require('../db/companies');

module.exports.getList = async (req, res, next) => {
  const { method } = req.params;

  if (typeof rankDb[method] !== 'function') {
    return res.status(404).json({ msg: 'Method not allowed' });
  }

  try {
    const ranks = await rankDb[method](req.query);
    const symbols = ranks.map(r => r.symbol);
    const companies = await Promise.all(symbols.map(companyDb.getBySymbol));


    const results = companies.map((company, index) => ({
      ...company,
      marketCap: ranks[index].marketCap,
      rank: ranks[index].rank,
      symbol: symbols[index],
    }))
    res.json(results);
  } catch (err) {
    console.log(err);

    next(err);
  }
}
