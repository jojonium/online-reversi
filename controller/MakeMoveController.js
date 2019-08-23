// TODO remove these eslint-disables
// eslint-disable-next-line no-unused-vars
const Board = require('../model/Board');
// eslint-disable-next-line no-unused-vars
const Player = require('../model/Player');
// eslint-disable-next-line no-unused-vars
const express = require('express');

/**
 * Controller class for making a move on the board. It checks whether the move
 * is valid and then performs it
 */
class MakeMoveController {
  /**
   * @param {Board} b the Board
   * @param {express.Express} app the top-level app
   * @constructor
   */
  constructor(b, app) {
    this.board = b;
    this.app = app;
  }


  /**
   * Checks whether a move is valid; then makes the move and returns an object
   * containing the new board state, returns an object containing an error if
   * the move is invalid
   * @param {number} x x-coordinate of the move to make
   * @param {number} y y-coordinate of the move to make
   * @param {Player} p the player making the move
   */
  move(x, y, p) {
    // check for invalid input
    if ((x = Math.floor(x)) < 0 || x >= this.board.width) {
      throw new Error('move: Invalid x: ' + x);
    }
    if ((y = Math.floor(y)) < 0 || y >= this.board.height) {
      throw new Error('move: Invalid y: ' + y);
    }
    if (this.board.players.indexOf(p) < 0) {
      throw new Error('move: Invalid p');
    }

    // check to make sure the move is valid
    // TODO implement
    // if (this.board.isValidMove(x, y, p)) {
    //   ...
    // }
  }
}


module.exports = MakeMoveController;
