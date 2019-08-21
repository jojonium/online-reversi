const assert = require('assert');
const Board = require('../model/Board');

describe('Board', function() {
  describe('#constructor', function() {
    it('should use 8, 8, and 2 as the default arguments', function() {
      const defaultBoard = new Board();
      assert.strictEqual(defaultBoard.width, 8);
      assert.strictEqual(defaultBoard.height, 8);
      assert.strictEqual(defaultBoard.numPlayers, 2);
    });
  });

  describe('#defaultStart', function() {
    it('should initialize BW pattern in center of board', function() {
      const initialBoard = new Board().defaultStart();
      const correctBoard = [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 2, 0, 0, 0],
        [0, 0, 0, 2, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
      ];
      assert.deepEqual(initialBoard.state, correctBoard);
    });
  });

  describe('#stateToString', function() {
    it('should stringify the default start correctly', function() {
      const initialBoardString = new Board().defaultStart().stateToString();
      const correctString = '00000000\n00000000\n00000000\n00012000\n' +
      '00021000\n00000000\n00000000\n00000000\n';
      assert.strictEqual(initialBoardString, correctString);
    });
  });
});
