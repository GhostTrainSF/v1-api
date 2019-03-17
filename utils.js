const FLAGS = require('./config.js');

const buildApiUrl = options => {
  const command = options.command;
  if (command === undefined) throw new Error('ERROR: `command` param missing');
  const agent = options.agent || FLAGS.agents.sf;
  
  if (command === FLAGS.commands.predictions) {
    const stopId = options.stopId;
    return `${FLAGS.root}?command=${command}&a=${agent}&stopId=${stopId}`;
  } else if (command === FLAGS[routes]) {
    const route = options.route;
    return `${FLAGS.root}?command=${command}&a=${agent}&r=${route}`;
  } else {
    throw new Error(`ERROR: 'command' param ${command} unsupported.`);
  }
};

module.exports = {
  buildApiUrl,
};

