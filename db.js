const { Pool } = require('pg');
const config = require('./config/database.json');

const pool = new Pool(config.development);

module.exports = {
  query: (text, params) => pool.query(text, params),
};