/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const AuthenticationTableTestHelper = {
  async addToken(token) {
    const query = {
      text: 'INSERT INTO authentication VALUES($1)',
      values: [token],
    };

    await pool.query(query);
  },

  async findToken(token) {
    const query = {
      text: 'SELECT token FROM authentication WHERE token = $1',
      values: [token],
    };

    const result = await pool.query(query);

    return result.rows;
  },
  async cleanTable() {
    await pool.query('DELETE FROM authentication WHERE 1=1');
  },
};

module.exports = AuthenticationTableTestHelper;
