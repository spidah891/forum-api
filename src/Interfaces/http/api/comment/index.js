const CommentHandler = require('./handler');
const routes = require('./routes');

const comment = {
  name: 'comment',
  register: async (server, { container }) => {
    const handler = new CommentHandler(container);
    server.route(routes(handler));
  },
};

module.exports = comment;
