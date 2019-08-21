const assert = require('assert');
const Player = require('../model/Player');

describe('Player', () => {
  describe('#constructor', () => {
    it('should initialize score to 0', () => {
      const defaultPlayer = new Player();
      assert.equal(defaultPlayer.score, 0);
    });
  });
});
