const NewComment = require('../../Domains/comment/entities/NewComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const newComment = new NewComment(useCasePayload);
    
    if (!await this._threadRepository.isThreadExist(newComment.threadId)) {
      throw new Error('ADD_COMMENT_USE_CASE.THREAD_NOT_FOUND');
    }
    
    return this._commentRepository.addComment(newComment);
  }
}

module.exports = AddCommentUseCase;