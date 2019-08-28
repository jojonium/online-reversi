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
        [-1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, 0, 1, -1, -1, -1],
        [-1, -1, -1, 1, 0, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1],
      ];
      assert.deepEqual(initialBoard.state, correctBoard);
    });

    it('should set player scores to 2', function() {
      const testBoard = new Board().defaultStart();
      assert.strictEqual(testBoard.players[0].score, 2);
      assert.strictEqual(testBoard.players[1].score, 2);
    });

    it('should return `this\'', function() {
      const testBoard = new Board();
      assert.strictEqual(testBoard.defaultStart(), testBoard);
    });
  });

  describe('#stateToString', function() {
    it('should stringify the default start correctly', function() {
      const initialBoardString = new Board().defaultStart().stateToString();
      const correctString = '________\n________\n________\n___01___\n' +
      '___10___\n________\n________\n________\n';
      assert.strictEqual(initialBoardString, correctString);
    });

    it('should stringify an empty board correctly', function() {
      const emptyBoardString = new Board(3, 5).stateToString();
      const correctString = '___\n___\n___\n___\n___\n';
      assert.strictEqual(emptyBoardString, correctString);
    });
  });

  describe('#checkForLine', function() {
    const testBoard = new Board();
    const p1 = testBoard.players[0];
    const p2 = testBoard.players[1];
    testBoard.state = [
      [-1, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, 0, 0, 0, -1, -1],
      [-1, -1, -1, 1, 0, 1, -1, -1],
      [-1, -1, 1, 1, -1, -1, -1, -1],
      [-1, 0, -1, 1, -1, -1, -1, -1],
      [-1, -1, -1, 1, -1, -1, -1, -1],
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
            testBoard.checkForLine(0, 0, 0, 0, randomPlayer);
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
        [-1, 1, 0],
        [-1, 1, -1],
        [-1, 0, -1],
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

    it('should return [] when there are no valid plays', function() {
      const testBoard = new Board(4, 4, 3);
      const p1 = testBoard.players[0];
      testBoard.state = [
        [1, 0, 0, 0],
        [1, 2, 2, 2],
        [0, 0, 3, 0],
        [2, 1, 0, 3],
      ];
      assert.deepEqual(testBoard.getValidPlays(p1), []);
    });

    it('should not contain duplicate points', function() {
      const testBoard = new Board(4, 4, 2);
      const p1 = testBoard.players[0];
      testBoard.state = [
        [-1, -1, -1, -1],
        [0, 1, -1, -1],
        [-1, -1, 1, -1],
        [-1, -1, 0, -1],
      ];
      assert.deepEqual(testBoard.getValidPlays(p1), [{x: 1, y: 2}]);
    });
  });

  describe('#isValidMove', function() {
    it('should throw error on invalid input', function() {
      const testBoard = new Board();
      const randomPlayer = new Player();
      const p1 = testBoard.players[0];
      assert.throws(
          () => {
            testBoard.isValidMove(-2.3, 3, p1);
          },
          new Error('isValidMove: Invalid x input: -3')
      );
      assert.throws(
          () => {
            testBoard.isValidMove(0, 13, p1);
          },
          new Error('isValidMove: Invalid y input: 13')
      );
      assert.throws(
          () => {
            testBoard.isValidMove(0, 0, randomPlayer);
          },
          new Error('isValidMove: Invalid p')
      );
    });

    it('should return [] on occupied point', function() {
      const testBoard = new Board(4, 4, 2).defaultStart();
      const p1 = testBoard.players[0];
      assert.deepEqual(testBoard.isValidMove(2, 2, p1), []);
    });

    it('should return [] on invalid move', function() {
      const testBoard = new Board(4, 4, 2).defaultStart();
      const p1 = testBoard.players[0];
      assert.deepEqual(testBoard.isValidMove(0, 3, p1), []);
    });

    it('should correctly identify directions that would flip', function() {
      const testBoard = new Board(4, 4, 2);
      const p1 = testBoard.players[0];
      testBoard.state = [
        [-1, -1, 1, -1],
        [0, 1, -1, -1],
        [-1, 1, 1, -1],
        [0, -1, 0, -1],
      ];
      const correctDirs = [
        {dx: 0, dy: -1},
        {dx: 1, dy: -1},
        {dx: 1, dy: 0},
      ];
      assert.deepEqual(testBoard.isValidMove(1, 2, p1), correctDirs);
    });
  });

  describe('#safeMakeMove', function() {
    it('should throw error on invalid input', function() {
      const testBoard = new Board();
      const randomPlayer = new Player();
      const p1 = testBoard.players[0];
      assert.throws(
          () => {
            testBoard.safeMakeMove(-2.3, 3, p1);
          },
          new Error('safeMakeMove: Invalid x input: -3')
      );
      assert.throws(
          () => {
            testBoard.safeMakeMove(0, 13, p1);
          },
          new Error('safeMakeMove: Invalid y input: 13')
      );
      assert.throws(
          () => {
            testBoard.safeMakeMove(0, 0, randomPlayer);
          },
          new Error('safeMakeMove: Invalid p')
      );
    });

    it('should return null for an invalid move', function() {
      const testBoard = new Board().defaultStart();
      const p1 = testBoard.players[0];
      assert.strictEqual(testBoard.safeMakeMove(0, 0, p1), null);
    });

    it('should correctly flip one line', function() {
      const testBoard = new Board(4, 4, 2).defaultStart();
      const p1 = testBoard.players[0];
      const stateAfter = [
        [-1, -1, -1, -1],
        [-1, 0, 1, -1],
        [0, 0, 0, -1],
        [-1, -1, -1, -1],
      ];
      assert.deepEqual(testBoard.safeMakeMove(2, 0, p1).state, stateAfter);
    });

    it('should correctly flip multiple lines', function() {
      const testBoard = new Board(4, 4, 2);
      const p1 = testBoard.players[0];
      testBoard.state = [
        [-1, 0, -1, 0],
        [-1, 1, 1, -1],
        [-1, -1, 1, 0],
        [-1, -1, -1, -1],
      ];
      const stateAfter = [
        [-1, 0, -1, 0],
        [-1, 0, 0, -1],
        [-1, 0, 0, 0],
        [-1, -1, -1, -1],
      ];
      assert.deepEqual(testBoard.safeMakeMove(2, 1, p1).state, stateAfter);
    });

    it('should correctly set scores', function() {
      const testBoard = new Board(4, 4, 2);
      testBoard.state = [
        [-1, 0, -1, 0],
        [-1, 1, 1, -1],
        [-1, -1, 1, 0],
        [-1, -1, -1, -1],
      ];
      testBoard.players[0].score = 3;
      testBoard.players[1].score = 3;
      testBoard.safeMakeMove(2, 1, testBoard.players[0]);
      assert.strictEqual(testBoard.players[0].score, 7);
      assert.strictEqual(testBoard.players[1].score, 0);
    });
  });
});
