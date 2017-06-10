const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

module.exports = ({ type }) => {
  const lines = ['// @flow'];

  if (type === 'graphql') {
    lines.push(
`process.env.BLUEBIRD_LONG_STACK_TRACES='1';
process.env.DEPLOYMENT='test';

const server = require('./server');

require('./update-graphql-schema')()
.then(() => server())
.then(() => {
  process.log('liftoff 🚀')
})
.catch((err) => {
  console.error(err);
  console.error(err.stack);
  process.exit(1);
}).done();
`
    );
  } else if (type === 'express') {
    lines.push(
`process.env.BLUEBIRD_LONG_STACK_TRACES='1';
process.env.DEPLOYMENT='test';

const server = require('./server');

server()
.then(() => {
  process.log('liftoff 🚀')
})
.catch((err) => {
  console.error(err);
  console.error(err.stack);
  process.exit(1);
}).done();
`
    );
  }

  return fs.writeFileAsync(
    `${process.cwd()}/`,
    lines.join('\n')
  );
};
