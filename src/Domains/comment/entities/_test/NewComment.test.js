const NewComment = require('../NewComment');

describe('NewComment entity', () => {
  it('should throw error when payload does not contain needed properties', () => {
    // Arrange
    const payload = {
      content: 'abc',
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new NewComment(payload))
      .toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not meet data types specification', () => {
    // Arrange
    const payload = {
      threadId: true,
      content: 123,
      owner: {},
    };

    // Action and Assert
    expect(() => new NewComment(payload))
      .toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewComment object correctly', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      content: 'this is a content of comment',
      owner: 'user-123',
    };

    // Action
    const newComment = new NewComment(payload);

    // Assert
    expect(newComment.threadId).toEqual(payload.threadId);
    expect(newComment.content).toEqual(payload.content);
    expect(newComment.owner).toEqual(payload.owner);
  });
});
