const FLAGS = require('./config.js');

const buildApiUrl = options => {
  const { command, agent = FLAGS.agents.sf, stopId, route } = options;
  if (command === undefined) throw new Error('ERROR: `command` param missing');

  if (command === FLAGS.commands.predictions) {
    return `${FLAGS.root}?command=${command}&a=${agent}&stopId=${stopId}`;
  }
  
  if (command === FLAGS[routes]) {
    return `${FLAGS.root}?command=${command}&a=${agent}&r=${route}`;
  } 

  throw new Error(`ERROR: 'command' param ${command} unsupported.`);
};

module.exports = {
  buildApiUrl,
};

