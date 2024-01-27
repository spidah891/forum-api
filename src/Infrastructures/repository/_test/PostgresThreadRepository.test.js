const PostgresThreadRepository = require('../PostgresThreadRepository');
const UserTableTestHelper = require('../../../../tests/UserTableTestHelper');
const pool = require('../../database/postgres/pool');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const NewThread = require('../../../Domains/thread/entities/NewThread');
const AddedThread = require('../../../Domains/thread/entities/AddedThread');

describe('PostgresThreadRepository', () => {
  afterEach(async () => {
    await UserTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread', () => {
    it('should add new thread and return added thread correctly', async () => {
      // Arrange
      const newThread = new NewThread({
        title: 'dicoding',
        body: 'ini body',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      const repository = new PostgresThreadRepository(
        pool,
        fakeIdGenerator,
      );

      // Action
      await UserTableTestHelper.addUser({ id: 'user-123' });
      const addedThread = await repository.addThread(newThread);
      const threads = await ThreadTableTestHelper.findThreadById('thread-123');

      // Assert
      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: 'thread-123',
          title: 'dicoding',
          owner: 'user-123',
        }),
      );
      expect(threads).toHaveLength(1);
    });
  });

  describe('isThreadExist', () => {
    it('should return true if thread exists', async () => {
      // Arrange
      await UserTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      const repository = new PostgresThreadRepository(pool, {});

      // Action & Assert
      await expect(repository.isThreadExist('thread-123')).resolves.toBe(true);
    });

    it('should return false if thread does not exist', async () => {
      // Arrange
      const repository = new PostgresThreadRepository(pool, {});

      // Action & Assert
      await expect(repository.isThreadExist('thread-123')).resolves.toBe(false);
    });
  });

  describe('getThreadById', () => {
    it('should return null if thread does not exist', async () => {
      // Arrange
      const repository = new PostgresThreadRepository(pool, {});

      // Action
      const thread = await repository.getThreadById('thread-123');

      // Assert
      expect(thread).toBeNull();
    });

    it('should return the thread object correctly', async () => {
      // Arrange
      await UserTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      const repository = new PostgresThreadRepository(pool, {});

      // Action
      const thread = await repository.getThreadById('thread-123');

      // Assert
      expect(thread.id).toEqual('thread-123');
      expect(thread.title).toEqual('title');
      expect(thread.body).toEqual('body');
      expect(thread.date).toEqual(expect.any(String));
      expect(thread.username).toEqual('dicoding');
      expect(thread.comments).toEqual([]);
    });
  });
});