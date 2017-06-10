// @flow
/* eslint-disable no-unused-expressions */
const chai = require('chai');
chai.use(require('chai-as-promised'));

const { expect } = chai;

describe('test', () => {
  it('should be cool', () => {
    expect(true).to.be.ok;
  });
});
