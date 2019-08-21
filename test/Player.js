const assert = require('assert');
const Player = require('../model/Player');

describe('Player', function() {
  describe('#constructor', function() {
    it('should initialize score to 0', function() {
      const defaultPlayer = new Player();
      assert.equal(defaultPlayer.score, 0);
    });
  });
});
