const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

module.exports = ({ type, transpiler }) => {
  const lines = [
    'const { argv } = require(\'yargs\');',
    'const gulp = require(\'gulp\');',
    'const mocha = require(\'gulp-mocha\');',
  ];

  if (transpiler === 'flow-remove-types') {
    lines.push(
      'const flowRemoveTypes = require(\'flow-remove-types\');',
      'const through = require(\'through2\');'
    );
  } else {
    lines.push('const babel = require(\'gulp-babel\');');
  }

  if (transpiler === 'flow-remove-types') {
    lines.push(
`gulp.task('transpile', () => {
  return gulp.src('src/**/*.js')
  .pipe(through.obj((file, enc, cb) => {
    file.contents = new Buffer(
      flowRemoveTypes(file.contents.toString('utf8')).toString()
    )
    cb(null, file);
  }))
  .pipe(gulp.dest('lib'))
});
`
    );
  } else {
    let preset;
    if (transpiler === 'babel-preset-node6') {
      preset = 'node6';
    } else if (transpiler === 'babel-preset-es2015') {
      preset = 'es2015';
    } else {
      throw new Error(`Unsupported transpiler: ${transpiler}`);
    }

    lines.push(
`gulp.task(
  'transpile',
  () => gulp.src('src/**/*.js')
  .pipe(babel({
    presets: ['flow', '${preset}']
  }))
  .pipe(gulp.dest('lib'))
);
`
    );
  }

  if (type === 'graphql') {
    lines.push(
`gulp.task('update-graphql-schema', ['transpile'], done => {
  require('./lib/update-graphql-schema')()
  .then(() => done()).done();
});
`
    );
  }

  if (type === 'graphql' || type === 'express') {
    lines.push(
`gulp.task('start-server', ['transpile'], done => {
  require('./lib/server')()
  .then(() => done()).done();
});
`
    );
  }

  lines.push(
`gulp.task(
  'test',
  [
    'transpile',
    ${type === 'graphql' ? '\'update-graphql-schema\',' : ''}
    ${(type === 'graphql' || type === 'express') ?
      '\'start-server\',' :
      ''
    }
  ],
  () => gulp.src([
    'src/**/test/**/*.unit.js',
    'src/**/test/**/*.e2e.js'
  ])
  .pipe(mocha({
    reporter: 'dot',
    timeout: 3000,
    grep: argv.grep,
  }))
  .once('error', err => {
    console.error(err.stack);
    process.exit(1);
  })
  .once('end', () => {
    process.exit();
  })
);
`
  );

  return fs.writeFileAsync(
    `${process.cwd()}/gulpfile.js`,
    /* eslint-disable prefer-template */
    lines.join('\n')
    /* eslint-enable prefer-template */
  );
};
