const companies = require('./companies');

module.exports = app => {
  app.get('/list/:method', companies.getList);

  app.use((err, req, res, next) => {
    err.statusCode = err.statusCode ? err.statusCode : 413;
    var errData = { reason: err.message, info: err.info };
    
    if (!res.headersSent) {
      res.status(err.statusCode).send(errData);
    }

    console.log('Unexpected server error', err, err.stack);

    err = new Error('Unexpected server error');
    err.statusCode = err.statusCode || 500;
  });
};
