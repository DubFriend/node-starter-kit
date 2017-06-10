const cmd = require('./cmd');

module.exports = ({ type, transpiler }) => cmd(
  'npm',
  [
    'i', '--save',
    'lodash',
    'bluebird',
    'dotenv',
  ]
  .concat(
    type === 'express' || type === 'graphql' ? [
      'express',
      'mysql',
      'mysql-wrap-production',
      'amqp',
      'dataloader',
      'redis-dataloader',
      'slugid',
      'cors',
    ] : []
  )
  .concat(
    type === 'express' ? [
      'body-parser',
    ] : []
  )
  .concat(
    type === 'graphql' ? [
      'express-graphql',
      'graphql',
      'graphql-relay',
      // 'graphql-logger',
    ] : []
  )
)
.then(() => cmd(
  'npm',
  [
    'i', '--save-dev',
    'babel-cli',
    'babel-preset-react',
    'babel-eslint',
    'chai',
    'chai-as-promised',
    'eslint',
    'eslint-config-airbnb',
    'eslint-plugin-import',
    'eslint-plugin-jsx-a11y',
    'eslint-plugin-react',
    'gulp',
    'gulp-mocha',
    'mocha',
    'sinon',
    'yargs',
  ]
  .concat(
    transpiler === 'flow-remove-types' ? [
      'flow-remove-types',
      'through2',
    ] : []
  )
  .concat(
    ['babel-preset-es2015', 'babel-preset-node6'].indexOf(transpiler) !== -1 ?
      ['gulp-babel'] : []
  )
  .concat(
    transpiler === 'babel-preset-es2015' ?
      ['babel-preset-es2015'] : []
  )
  .concat(
    transpiler === 'babel-preset-node6' ?
      ['babel-preset-node6'] : []
  )
));
