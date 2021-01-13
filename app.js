require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const PORT = process.env.PORT || 5000;

const app = express();

const { seedDb } = require('./server/db');

// Setup routes
app.use('/', express.static(path.join(__dirname, 'client/dist')));
app.use(cors());
require('./server/routes')(app);

// Seed redis db
seedDb();

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

module.exports = app
