const rankDb = require('../db/ranks');
const companyDb = require('../db/companies');
const { seedDb } = require('../db');

module.exports.update = async (req, res, next) => {
  const {
    symbol,
    amount,
  } = req.query;

  try {
    await rankDb.zincrby(amount, symbol)

    res.json({ success: true });
  } catch (err) {
    console.log(err);

    next(err);
  }
}

module.exports.reset = async (req, res, next) => {
  try {
    await seedDb(true);

    res.json({ success: true });
  } catch (err) {
    console.log(err);

    next(err);
  }
}
