const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

module.exports = ({ name, type }) => {
  const lines = [
    `NAME=${name}`,
    'DEPLOYMENT=test',
  ];

  if (type === 'graphql' || type === 'express') {
    lines.push(
      'AMQP_HOST=127.0.0.1',
      'AMQP_USER=username',
      'AMQP_PASS=password',
      'PORT=3000'
    );
  }

  return fs.writeFileAsync(
    `${process.cwd()}/.env`,
    `${lines.join('\n')}\n`
  );
};
