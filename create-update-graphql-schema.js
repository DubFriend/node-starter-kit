const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));


module.exports = () => fs.writeFileAsync(
  `${process.cwd()}/src/update-graphql-schema.js`,
`// @flow
const Promise = require('bluebird');
const fs = Promise.promsifyAll(require('fs'));
const path = require('path');
const Schema = require('./graphql/root');
const graphql = require('graphql').graphql;
const graphqlUtilities = require('graphql/utilities');

module.exports = () => Promise.resolve(
  graphql(Schema, graphqlUtilities.introspectionQuery)
)
.then(schema => Promise.all([
  fs.writeFileAsync(
    path.join(__dirname, './graphql/schema.json'),
    JSON.stringify(schema, null, 2)
  ),
  fs.writeFileAsync(
    path.join(__dirname, './graphql/schema.graphql'),
    graphqlUtilities.printSchema(Schema)
  )
]));
`);

