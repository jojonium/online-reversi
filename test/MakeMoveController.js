const assert = require('assert');
const express = require('express');
const Board = require('../model/Board');
const Player = require('../model/Player');
const MakeMoveController = require('../controller/MakeMoveController');

describe('MakeMoveController', function() {
  describe('#constructor', function() {
    it('should initialize a controller object', function() {
      const app = express();
      const board = new Board().defaultStart();
      assert.strictEqual(new MakeMoveController(board, app).app, app);
    });
  });

  describe('#move', function() {
    it('should throw error on invalid input', function() {
      const app = express();
      const board = new Board().defaultStart();
      const p1 = board.players[0];
      assert.throws(
          () => {
            new MakeMoveController(board, app).move(-2, 4, p1);
          },
          new Error('move: Invalid x: -2')
      );
      assert.throws(
          () => {
            new MakeMoveController(board, app).move(2, 55.5, p1);
          },
          new Error('move: Invalid y: 55')
      );
      assert.throws(
          () => {
            new MakeMoveController(board, app).move(2, 5, new Player());
          },
          new Error('move: Invalid p')
      );
    });
  });
});
