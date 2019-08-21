const assert = require('assert');
const Board = require('../model/Board');

describe('Board', () => {
  describe('#constructor', () => {
    it('should use 8, 8, and 2 as the default arguments', () => {
      const defaultBoard = new Board();
      assert.equal(defaultBoard.width, 8);
      assert.equal(defaultBoard.height, 8);
      assert.equal(defaultBoard.numPlayers, 2);
    });
  });
});
