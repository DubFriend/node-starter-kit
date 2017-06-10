const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

module.exports = ({ transpiler }) => {
  const doc = {
    extends: 'airbnb',
    env: {
      node: true,
      mocha: true,
      es6: true,
      browser: true,
    },
    rules: {
      'space-infix-ops': 0,
      'max-len': ['warn', { code: 80, ignoreComments: true }],
      'import/no-extraneous-dependencies': ['error', {
        devDependencies: true,
        optionalDependencies: false,
        peerDependencies: false,
      }],
    },
    parser: 'babel-eslint',
    parserOptions: {
      ecmaVersion: 6,
      sourceType: 'module',
      ecmaFeatures: {
        modules: true,
        jsx: true,
      },
    },
  };

  // if (['flow-'].indexOf(type) !== -1) {
  if (transpiler === 'flow-remove-types') {
    doc.rules['comma-dangle'] = ['error', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      functions: 'never',
    }];
  }

  return fs.writeFileAsync(
    `${process.cwd()}/.eslintrc`,
    JSON.stringify(doc, null, 2)
  );
};
