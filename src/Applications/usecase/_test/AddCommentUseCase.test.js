const ThreadRepository = require('../../../Domains/thread/ThreadRepository');
const CommentRepository = require('../../../Domains/comment/CommentRepository');
const AddCommentUseCase = require('../AddCommentUseCase');
const AddedComment = require('../../../Domains/comment/entities/AddedComment');

describe('AddCommentUseCase', () => {
  it('should throw error when thread is not found', async () => {
    // Arrange
    const useCasePayload = {
      content: 'this is content',
      threadId: 'thread-123',
      owner: 'user-123',
    };
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    mockThreadRepository.isThreadExist = jest.fn(() => Promise.resolve(false));
    const expectedError = new Error('ADD_COMMENT_USE_CASE.THREAD_NOT_FOUND');

    const useCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action & Assert
    await expect(useCase.execute(useCasePayload)).rejects.toThrowError(expectedError);
    expect(mockThreadRepository.isThreadExist).toBeCalledWith(useCasePayload.threadId);
  });

  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'this is content',
      threadId: 'thread-123',
      owner: 'user-123',
    };
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReturnAddComment = new AddedComment({
      id: 'comment-123',
      content: 'this is content',
      owner: 'user-123',
    });

    mockThreadRepository.isThreadExist = jest.fn(() => Promise.resolve(true));
    mockCommentRepository.addComment = jest.fn(() => Promise.resolve(mockReturnAddComment));

    const expectedAddedComment = new AddedComment({
      id: 'comment-123',
      content: 'this is content',
      owner: 'user-123',
    });

    const useCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedComment = await useCase.execute(useCasePayload);

    // Assert
    expect(addedComment).toStrictEqual(expectedAddedComment);
    expect(mockThreadRepository.isThreadExist).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.addComment).toBeCalledWith(useCasePayload);
  });
});
