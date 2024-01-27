/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('comment', {
        id: {
          type: 'VARCHAR(50)',
          primaryKey: true,
        },
        content: {
          type: 'TEXT',
          notNull: true,
        },
        owner: {
          type: 'VARCHAR(50)',
          notNull: true,
        },
        thread_id: {
          type: 'VARCHAR(50)',
          notNull: true,
        },
        is_deleted: {
          type: 'BOOLEAN',
          notNull: true,
          default: false,
        },
        date: {
          type: 'TEXT',
          notNull: true,
        },
      });
    
      pgm.addConstraint('comment', 'fk_comment.owner_login.id', 'FOREIGN KEY(owner) REFERENCES login(id) ON DELETE CASCADE');
      pgm.addConstraint('comment', 'fk_comment.thread_id_thread.id', 'FOREIGN KEY(thread_id) REFERENCES thread(id) ON DELETE CASCADE');    
};

exports.down = pgm => {
    pgm.dropTable('comment');
};
