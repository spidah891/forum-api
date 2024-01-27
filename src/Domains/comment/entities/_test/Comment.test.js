const Comment = require('../Comment');

describe('Comment entity', () => {
  it('should throw error when payload does not contain needed properties', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2021-08-08T07:59:57.000Z',
      content: 'sebuah comment',
    };

    // Action and Assert
    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not meet data types specification', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2021-08-08T07:59:57.000Z',
      content: 'sebuah comment',
      isDeleted: 'false',
    };

    // Action and Assert
    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create Comment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2021-08-08T07:59:57.000Z',
      content: 'sebuah comment',
      isDeleted: false,
    };

    // Action
    const comment = new Comment(payload);

    // Assert
    expect(comment.id).toEqual(payload.id);
    expect(comment.username).toEqual(payload.username);
    expect(comment.date).toEqual(payload.date);
    expect(comment.content).toEqual(payload.content);
  });

  it('should create deleted comment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2021-08-08T07:59:57.000Z',
      content: 'sebuah comment',
      isDeleted: true,
    };

    // Action
    const comment = new Comment(payload);

    // Assert
    expect(comment.id).toEqual(payload.id);
    expect(comment.username).toEqual(payload.username);
    expect(comment.date).toEqual(payload.date);
    expect(comment.content).toEqual('**komentar telah dihapus**');
  });
});
