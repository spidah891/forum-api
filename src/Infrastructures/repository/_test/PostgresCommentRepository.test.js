const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UserTableTestHelper = require('../../../../tests/UserTableTestHelper');
const pool = require('../../database/postgres/pool');
const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const NewComment = require('../../../Domains/comment/entities/NewComment');
const PostgresCommentRepository = require('../PostgresCommentRepository');

describe('PostgresCommentRepository', () => {
  afterEach(async () => {
    await CommentTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await UserTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should add new comment and return added comment correctly', async () => {
      // Arrange
      const newComment = new NewComment({
        content: 'this is new comment',
        owner: 'user-123',
        threadId: 'thread-123',
      });
      const fakeIdGenerator = () => '123';
      await UserTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });
      const repository = new PostgresCommentRepository(pool, fakeIdGenerator);

      // Action
      const addedComment = await repository.addComment(newComment);

      // Assert
      expect(addedComment.id).toEqual('comment-123');
      expect(addedComment.content).toEqual(newComment.content);
      expect(addedComment.owner).toEqual(newComment.owner);

      const foundComment = await CommentTableTestHelper.findCommentById('comment-123');
      expect(foundComment.id).toEqual('comment-123');
      expect(foundComment.content).toEqual(newComment.content);
      expect(foundComment.owner).toEqual(newComment.owner);
      expect(foundComment.thread_id).toEqual(newComment.threadId);
      expect(foundComment.is_deleted).toEqual(false);
      expect(foundComment.date).toBeDefined();
    });
  });

  describe('isCommentExist function', () => {
    it('should return true if comment exists', async () => {
      // Arrange
      await UserTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });
      await CommentTableTestHelper.addComment({ id: 'comment-123' });
      const repository = new PostgresCommentRepository(pool, {});

      // Action
      const isCommentExist = await repository.isCommentExist('comment-123');

      // Assert
      expect(isCommentExist).toEqual(true);
    });

    it('should return false if comment not exists', async () => {
      // Arrange
      const repository = new PostgresCommentRepository(pool, {});

      // Action
      const isCommentExist = await repository.isCommentExist('comment-123');

      // Assert
      expect(isCommentExist).toEqual(false);
    });
  });

  describe('isCommentOwner function', () => {
    it('should return true if user is comment owner', async () => {
      // Arrange
      await UserTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });
      await CommentTableTestHelper.addComment({ id: 'comment-123', owner: 'user-123' });

      const repository = new PostgresCommentRepository(pool, {});

      // Action
      const isCommentOwner = await repository.isCommentOwner('comment-123', 'user-123');

      // Assert
      expect(isCommentOwner).toEqual(true);
    });

    it('should return false if user is not comment owner', async () => {
      // Arrange
      await UserTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });
      await CommentTableTestHelper.addComment({ id: 'comment-123', owner: 'user-123' });

      const repository = new PostgresCommentRepository(pool, {});

      // Action
      const isCommentOwner = await repository.isCommentOwner('comment-123', 'user-456');

      // Assert
      expect(isCommentOwner).toEqual(false);
    });
  });

  describe('deleteComment', () => {
    it('should update is_deleted to true', async () => {
      // Arrange
      await UserTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });
      await CommentTableTestHelper.addComment({ id: 'comment-123' });

      const repository = new PostgresCommentRepository(pool, {});

      // Action
      await repository.deleteComment('comment-123');

      // Assert
      const foundComment = await CommentTableTestHelper.findCommentById('comment-123');
      expect(foundComment.is_deleted).toEqual(true);
    });
  });

  describe('getCommentsByThreadId', () => {
    it('should return comments correctly', async () => {
      const wait = (ms) => new Promise((resolve) => {
        setTimeout(resolve, ms);
      });

      // Arrange
      await UserTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });
      await CommentTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123' });
      await wait(250);
      await CommentTableTestHelper.addComment({ id: 'comment-456', threadId: 'thread-123' });
      await wait(250);
      await CommentTableTestHelper.addComment({ id: 'comment-789', threadId: 'thread-123' });

      const repository = new PostgresCommentRepository(pool, {});

      // Action
      const comments = await repository.getCommentsByThreadId('thread-123');

      // Assert
      expect(comments).toHaveLength(3);
      expect(comments[0].id).toEqual('comment-123');
      expect(comments[1].id).toEqual('comment-456');
      expect(comments[2].id).toEqual('comment-789');
    });
  });
});