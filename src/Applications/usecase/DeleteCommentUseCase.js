const DeletedComment = require('../../Domains/comment/entities/DeletedComment');

class DeleteCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const deletedComment = new DeletedComment(useCasePayload);

    if (!await this._threadRepository.isThreadExist(deletedComment.threadId)) {
      throw new Error('DELETE_COMMENT_USE_CASE.THREAD_NOT_FOUND');
    }

    if (!await this._commentRepository.isCommentExist(deletedComment.id)) {
      throw new Error('DELETE_COMMENT_USE_CASE.COMMENT_NOT_FOUND');
    }

    if (!await this._commentRepository.isCommentOwner(deletedComment.id, deletedComment.owner)) {
      throw new Error('DELETE_COMMENT_USE_CASE.COMMENT_NOT_OWNED');
    }

    return this._commentRepository.deleteComment(deletedComment.id);
  }
}

module.exports = DeleteCommentUseCase;
