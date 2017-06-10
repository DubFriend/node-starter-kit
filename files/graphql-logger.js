// @flow
const env = require('./env');
const amqp = require('amqp');
const graphqlLogger = require('graphql-logger');

const connection = amqp.createConnection({
  host: env('AMQP_HOST'),
  login: env('AMQP_USER'),
  password: env('AMQP_PASS'),
});

connection.on('error', err => console.error(err, err.stack));

connection.on('ready', () => {
  console.log('amqp ready');
});

module.exports = graphqlLogger({
  indexPrefix: `${env('NAME')}-${env('DEPLOYMENT')}-`,
  indexPrefix: 'weekly',
  connection,
  disableLists: false,
  disableResponseData: false,
});
