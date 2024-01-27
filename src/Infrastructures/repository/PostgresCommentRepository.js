const CommentRepository = require('../../Domains/comment/CommentRepository');
const AddedComment = require('../../Domains/comment/entities/AddedComment');
const Comment = require('../../Domains/comment/entities/Comment');

class PostgresCommentRepository extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }
    
  async addComment(newComment) {
    const { content, owner, threadId } = newComment;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO comment VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, content, owner, threadId, false, new Date().toISOString()],
    };

    const result = await this._pool.query(query);

    return new AddedComment({ ...result.rows[0] });
  }
    
  async isCommentExist(commentId) {
    const query = {
      text: 'SELECT * FROM comment WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    return result.rowCount > 0;
  }
    
  async isCommentOwner(commentId, owner) {
    const query = {
      text: 'SELECT owner FROM comment WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    return result.rows[0].owner === owner;
  }
    
  async deleteComment(commentId) {
    const query = {
      text: 'UPDATE comment SET is_deleted = true WHERE id = $1',
      values: [commentId],
    };

    await this._pool.query(query);
  }
    
  async getCommentsByThreadId(threadId) {
    const query = {
      text: `SELECT 
                comment.id,
                comment.content,
                comment.date,
                comment.is_deleted,
                login.username
              FROM comment 
              INNER JOIN login ON comment.owner = login.id 
              WHERE comment.thread_id = $1
              ORDER BY comment.date`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows.map((row) => new Comment({
      ...row,
      isDeleted: row.is_deleted,
    }));
  }    
}

module.exports = PostgresCommentRepository;