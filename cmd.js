/* eslint-disable no-console */
const Promise = require('bluebird');
const { spawn } = require('child_process');

module.exports = (commandString, args=[]) => new Promise((resolve, reject) => {
  const p = spawn(commandString, args, { cwd: process.cwd() });
  p.stdout.on('data', (data) => {
    console.log(data.toString());
  });
  p.stderr.on('data', (data) => {
    console.error(data.toString());
  });
  p.on('close', (code) => {
    if (code) {
      console.error(`exited with code: ${code}`);
      reject();
    } else {
      console.log(`exited with code: ${code}`);
      resolve();
    }
  });
});
