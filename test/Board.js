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

  describe('#checkForLine', function() {
    it('should throw error on invalid input', function() {
      const testBoard = new Board().defaultStart();
      assert.throws(
          () => {
            testBoard.checkForLine(-2, 3, 0, 0);
          },
          new Error('checkForLine: Invalid x input: -2')
      );
      assert.throws(
          () => {
            testBoard.checkForLine(5, 30, 0, 0);
          },
          new Error('checkForLine: Invalid y input: 30')
      );
      assert.throws(
          () => {
            testBoard.checkForLine(5.5, 8, -4, 0);
          },
          new Error('checkForLine: Invalid dx input: -4')
      );
      assert.throws(
          () => {
            testBoard.checkForLine(5.5, 8, -1, 33.3);
          },
          new Error('checkForLine: Invalid dy input: 33')
      );
    });

    it('should return false when valid line not found', function() {
      const testBoard2 = new Board();
      const p1 = testBoard2.players[0];
      testBoard2.state = [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 0, 0],
        [0, 0, 0, 2, 1, 2, 0, 0],
        [0, 0, 2, 2, 0, 0, 0, 0],
        [0, 1, 0, 2, 0, 0, 0, 0],
        [0, 0, 0, 2, 0, 0, 0, 0],
      ];
      assert.strictEqual(testBoard2.checkForLine(3, 3, -1, 0, p1), false);
      // TODO this needs more testing

    });
  });
});
