/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('thread', {
        id: {
          type: 'VARCHAR(50)',
          primaryKey: true,
        },
        title: {
          type: 'TEXT',
          notNull: true,
        },
        body: {
          type: 'TEXT',
          notNull: true,
        },
        owner: {
          type: 'VARCHAR(50)',
          notNull: true,
        },
        date: {
          type: 'TEXT',
          notNull: true,
        },
      });
    
      pgm.addConstraint('thread', 'fk_thread.owner_login.id', 'FOREIGN KEY(owner) REFERENCES login(id) ON DELETE CASCADE');    
};

exports.down = pgm => {
  pgm.dropTable('thread');
};
