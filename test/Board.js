const assert = require('assert');
const Board = require('../model/Board');
const Player = require('../model/Player');

describe('Board', function() {
  describe('#constructor', function() {
    it('should throw error on invalid input', function() {
      assert.throws(
          () => {
            new Board(-3);
          },
          new Error('Board constructor: Invalid width: -3')
      );

      assert.throws(
          () => {
            new Board(4, 45.2);
          },
          new Error('Board constructor: Invalid height: 45')
      );

      assert.throws(
          () => {
            new Board(4, 8, 0);
          },
          new Error('Board constructor: Invalid numPlayers: 0')
      );
    });

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

    it('should return `this\'', function() {
      const testBoard = new Board();
      assert.strictEqual(testBoard.defaultStart(), testBoard);
    });
  });

  describe('#stateToString', function() {
    it('should stringify the default start correctly', function() {
      const initialBoardString = new Board().defaultStart().stateToString();
      const correctString = '00000000\n00000000\n00000000\n00012000\n' +
      '00021000\n00000000\n00000000\n00000000\n';
      assert.strictEqual(initialBoardString, correctString);
    });

    it('should stringify an empty board correctly', function() {
      const emptyBoardString = new Board(3, 5).stateToString();
      const correctString = '000\n000\n000\n000\n000\n';
      assert.strictEqual(emptyBoardString, correctString);
    });
  });

  describe('#checkForLine', function() {
    const testBoard = new Board();
    const p1 = testBoard.players[0];
    const p2 = testBoard.players[1];
    testBoard.state = [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 0, 2, 1, 2, 0, 0],
      [0, 0, 2, 2, 0, 0, 0, 0],
      [0, 1, 0, 2, 0, 0, 0, 0],
      [0, 0, 0, 2, 0, 0, 0, 0],
    ];
    const randomPlayer = new Player();
    it('should throw error on invalid input', function() {
      assert.throws(
          () => {
            testBoard.checkForLine(-2, 3, 0, 0, p1);
          },
          new Error('checkForLine: Invalid x input: -2')
      );
      assert.throws(
          () => {
            testBoard.checkForLine(5, 30, 0, 0, p1);
          },
          new Error('checkForLine: Invalid y input: 30')
      );
      assert.throws(
          () => {
            testBoard.checkForLine(5.5, 7, -4, 0, p1);
          },
          new Error('checkForLine: Invalid dx input: -4')
      );
      assert.throws(
          () => {
            testBoard.checkForLine(5.5, 7, -1, 33.3, p1);
          },
          new Error('checkForLine: Invalid dy input: 33')
      );
      assert.throws(
          () => {
            testBoard.checkForLine(randomPlayer);
          },
          new Error('checkForLine: Invalid p')
      );
    });

    it('should return false on a non-empty square', function() {
      assert.strictEqual(testBoard.checkForLine(6, 1, -1, -1, p1), false);
      assert.strictEqual(testBoard.checkForLine(6, 1, -1, -1, p2), false);
    });

    it('should return false when no adjacent enemy piece', function() {
      assert.strictEqual(testBoard.checkForLine(3, 4, 0, -1, p1), false);
    });

    it('should return false when adjacent friendly piece', function() {
      assert.strictEqual(testBoard.checkForLine(3, 4, 1, 1, p1), false);
    });

    it(
        'should return false when line of enemies reaches board edge',
        function() {
          assert.strictEqual(testBoard.checkForLine(3, 4, 1, 0, p1), false);
        }
    );

    it('should return true for valid lines', function() {
      const simpleBoard = new Board(3, 3, 2);
      const simpleP1 = simpleBoard.players[0];
      simpleBoard.state = [
        [0, 2, 1],
        [0, 2, 0],
        [0, 1, 0],
      ];
      assert.strictEqual(simpleBoard.checkForLine(0, 0, 0, 1, simpleP1), true);
      assert.strictEqual(testBoard.checkForLine(2, 6, 1, -1, p2), true);
    });
  });

  describe('#getValidPlays', function() {
    it('should throw error on invalid input', function() {
      const testBoard = new Board();
      const randomPlayer = new Player();
      assert.throws(
          () => {
            testBoard.getValidPlays(randomPlayer);
          },
          new Error('getValidPlays: Invalid p')
      );
    });

    it('should correctly list all valid plays', function() {
      const testBoard = new Board(4, 4, 2).defaultStart();
      const p1 = testBoard.players[0];
      const p2 = testBoard.players[1];
      const correctP1Plays = [
        {x: 0, y: 2},
        {x: 1, y: 3},
        {x: 2, y: 0},
        {x: 3, y: 1},
      ];
      const correctP2Plays = [
        {x: 0, y: 1},
        {x: 1, y: 0},
        {x: 2, y: 3},
        {x: 3, y: 2},
      ];
      assert.deepEqual(testBoard.getValidPlays(p1), correctP1Plays);
      assert.deepEqual(testBoard.getValidPlays(p2), correctP2Plays);
    });
  });
});
