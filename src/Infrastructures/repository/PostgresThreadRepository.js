const ThreadRepository = require('../../Domains/thread/ThreadRepository');
const AddedThread = require('../../Domains/thread/entities/AddedThread');
const Thread = require('../../Domains/thread/entities/Thread');

class PostgresThreadRepository extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }
  
  async addThread(newThread) {
    const { title, body, owner } = newThread;
    const id = `thread-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO thread VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, title, body, owner, new Date().toISOString()],
    };

    const result = await this._pool.query(query);
    return new AddedThread({ ...result.rows[0] });
  }
  
  async isThreadExist(threadId) {
    const query = {
      text: 'SELECT id FROM thread WHERE id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rowCount > 0;
  }
  
  async getThreadById(threadId) {
    const query = {
      text: `SELECT 
                thread.id,
                thread.title,
                thread.body,
                thread.date,
                login.username 
              FROM thread 
              INNER JOIN login ON thread.owner = login.id 
              WHERE thread.id = $1`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      return null;
    }

    return new Thread({
      ...result.rows[0],
    });
  }    
}

module.exports = PostgresThreadRepository;