const DeletedComment = require('../DeletedComment');

describe('DeletedComment entity', () => {
  it('should throw error when payload does not contain needed properties', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
    };

    // Action and Assert
    expect(() => new DeletedComment(payload)).toThrowError('DELETED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not meet data types specification', () => {
    // Arrange
    const payload = {
      id: 123,
      owner: true,
      threadId: {},
    };

    // Action and Assert
    expect(() => new DeletedComment(payload)).toThrowError('DELETED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DeletedComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      owner: 'user-123',
      threadId: 'thread-123',
    };

    // Action
    const deleteComment = new DeletedComment(payload);

    // Assert
    expect(deleteComment.id).toEqual(payload.id);
    expect(deleteComment.owner).toEqual(payload.owner);
    expect(deleteComment.threadId).toEqual(payload.threadId);
  });
});
