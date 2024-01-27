/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentTableTestHelper = {
  async findCommentById(id) {
    const query = {
      text: 'SELECT * FROM comment WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows[0];
  },

  async addComment({
    id = 'comment-123', threadId = 'thread-123', content = 'some comment', userId = 'user-123', isDeleted = false,
  }) {
    const query = {
      text: 'INSERT INTO comment VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, content, userId, threadId, isDeleted, new Date().toISOString()],
    };

    await pool.query(query);
  },

  async cleanTable() {
    await pool.query('DELETE FROM comment');
  },
};

module.exports = CommentTableTestHelper;