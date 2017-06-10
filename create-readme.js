const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

module.exports = ({ name, description }) => fs.writeFileAsync(
  `${process.cwd()}/README.md`,
`# ${name}

${description}
`
);
