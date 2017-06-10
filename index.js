#!/usr/bin/env node
/* eslint-disable no-console */
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

const chalk = require('chalk');
const inquirer = require('inquirer');
const createESLintrc = require('./create-eslintrc');
const createUpdateGraphqlSchema = require('./create-update-graphql-schema');
const createGulpfile = require('./create-gulpfile');
const createEnv = require('./create-env');
const npmInstall = require('./npm-install');
const createMITLicense = require('./create-mit-license');
const createReadme = require('./create-readme');

console.log(chalk.cyan('Jumpstart!'));

inquirer.prompt([
  {
    type: 'input',
    name: 'name',
    message: 'What shall I name this thing?',
    validate: input => (
      /^[0-9a-z-]+$/i.test(input) ?
      true :
      'Name must match the regex: /^[0-9a-z-]+$/i'
    ),
  },
  {
    type: 'list',
    name: 'type',
    message: 'What kind of thing is it?',
    choices: [
      'node',
      'express',
      'graphql',
      'browser',
    ],
  },
  {
    type: 'input',
    name: 'author',
    message: 'What is your name, human?',
    default: '',
  },
  {
    type: 'input',
    name: 'description',
    message: 'Tell me what its all about, but quickly!',
    default: '',
  },
  {
    type: 'input',
    name: 'gitURL',
    message: 'Can you commit to a git URL right now?',
    default: '',
  },
  {
    type: 'list',
    name: 'transpiler',
    message: 'I will transpile your petty mortal code format. Choose:',
    choices: [
      'flow-remove-types',
      'babel-preset-node6',
      'babel-preset-es2015',
    ],
  },
  {
    type: 'list',
    name: 'license',
    message: 'Choose a software license',
    choices: [
      'MIT',
      'UNLICENSED',
    ],
  },
])
.then(
  ({
    name,
    type,
    author,
    description,
    gitURL,
    transpiler,
    license,
  }) => Promise.all([
    fs.writeFileAsync(`${process.cwd()}/package.json`, JSON.stringify({
      name,
      version: '0.0.0',
      description,
      main: 'index.js',
      repository: {
        type: 'git',
        url: gitURL,
      },
      author,
      license,
    }, null, 2)),

    fs.writeFileAsync(`${process.cwd()}/.gitignore`, [
      'node_modules',
      '.DS_Store',
      'lib',
    ].join('\n')),

    fs.mkdirAsync(`${process.cwd()}/deploy`)
    .then(() => Promise.all([
      fs.readFileAsync(`${__dirname}/files/docker-compose.yml`)
      .then(file => fs.writeFileAsync(
        `${process.cwd()}/deploy/docker-compose.yml`,
        file
      )),

      fs.readFileAsync(`${__dirname}/files/logstash.conf`)
      .then(file => fs.writeFileAsync(
        `${process.cwd()}/deploy/logstash.conf`,
        file
      )),
    ])),

    fs.mkdirAsync(`${process.cwd()}/src`)
    .then(() => fs.writeFileAsync(`${process.cwd()}/src/.gitkeep`, ''))
    .then(() => (
      fs.readFileAsync(`${__dirname}/files/env.js`)
      .then(file => fs.writeFileAsync(
        `${process.cwd()}/src/env.js`,
        file
      ))
    ))
    .then(() => (
      type === 'graphql' ?
        Promise.all([
          fs.readFileAsync(`${__dirname}/files/server-graphql.js`)
          .then(file => fs.writeFileAsync(
            `${process.cwd()}/src/server.js`,
            file
          )),

          fs.mkdirAsync(`${process.cwd()}/src/graphql`)
          .then(() => fs.writeFileAsync(
            `${process.cwd()}/src/graphql/.gitkeep`,
            ''
          ))
          .then(() => Promise.all([
            fs.readFileAsync(`${__dirname}/files/graphql-root.js`)
            .then(file => fs.writeFileAsync(
              `${process.cwd()}/src/graphql/root.js`,
              file
            )),
          ])),

          fs.readFileAsync(`${__dirname}/files/graphql-logger.js`)
          .then(file => fs.writeFileAsync(
            `${process.cwd()}/src/logger.js`,
            file
          )),
        ])
         :
        Promise.resolve()
    )),

    fs.mkdirAsync(`${process.cwd()}/lib`)
    .then(() => fs.writeFileAsync(
      `${process.cwd()}/lib/.gitkeep`,
      ''
    )),

    createESLintrc({ transpiler }),

    createGulpfile({ type, transpiler }),

    createEnv({ name, type }),

    createReadme({ name, description }),

    (license === 'MIT' ? createMITLicense({ author }) : Promise.resolve()),
  ])
  .then(() => Promise.all([
    type === 'graphql' ?
      createUpdateGraphqlSchema() :
      Promise.resolve(),
  ]))
  .then(() => npmInstall({ type, transpiler }))
)
.catch((err) => {
  console.error(err, err.stack);
  process.exit(1);
});
