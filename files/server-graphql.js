const Promise = require('bluebird');
const cors = require('cors');
const express = require('express');
const expressGraphql = require('express-graphql');
const env = require('./env');
const graphqlRoot = require('./graphql/root');
const project = require('../package');
const { attachLogger } = require('./logger');

const app = express();

app.enable('trust proxy');
app.disable('x-powered-by');

module.exports = () => Promise.resolve((resolve) => {
  app.use(cors());

  app.use(attachLogger());

  app.use('/graphql', expressGraphql(req => ({
    schema: graphqlRoot,
    graphiql: true,
    formatError: (err) => {
      req.addLog({
        type: 'error',
        error: JSON.stringify(err, null, 2),
        stack: err.stack,
      });
      return {
        message: err.message,
        locations: err.locations,
        path: err.path,
      };
    },
    // extensions: args => {
    //     console.log(args);
    //     if(args.result.errors) {
    //         console.log(
    //             JSON.stringify(args.result.errors, null, 2)
    //         );
    //     }
    // }
  })));

  app.get('/', (req, res) => res.send({
    name: project.name,
    version: project.version,
    deployment: env('DEPLOYMENT'),
  }));

  app.use('*', (req, res) => {
    res.status(404);
    res.sendError(new Error(
      404, { message: 'Not Found' }
    ));
  });

  app.use((err, req, res) => {
    res.sendError(err);
  });

  app.listen(env('PORT'), () => {
    console.log(`Listening on port: ${env('PORT')}`);
    resolve();
  });
});
