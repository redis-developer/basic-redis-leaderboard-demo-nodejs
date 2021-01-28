require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const PORT = process.env.PORT || 5000;

const app = express();

const { seedDb } = require('./db');

// Setup routes
app.use('/', express.static(path.join(__dirname, '../public')));
app.use(cors());
require('./routes')(app);

// Seed redis db
seedDb();

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

module.exports = app
