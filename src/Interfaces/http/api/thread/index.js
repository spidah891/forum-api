const ThreadHandler = require('./handler');
const routes = require('./routes');

const thread = {
  name: 'thread',
  register: async (server, { container }) => {
    const handler = new ThreadHandler(container);
    server.route(routes(handler));
  },
};

module.exports = thread;
