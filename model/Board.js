const Player = require('./Player');

/**
 * This class represents a Board, including information on where all the pieces
 * are and how many people are playing
 */
class Board {
  /**
   * Creates a new Board object to keep track of the board state and players.
   * State is accessed as myBoard.state[column][row]
   * @param {number} [width=8] the width of the board
   * @param {number} [height=8] the height of the board
   * @param {number} [numPlayers=2] the number of players
   * @constructor
   */
  constructor(width = 8, height = 8, numPlayers = 2) {
    /** @type number[][] */
    const state = new Array(width);
    for (let i = 0; i < width; ++i) {
      state[i] = new Array(height);
      for (let j = 0; j < height; ++j) {
        state[i][j] = 0;
      }
    }

    this.width = width;
    this.height = height;
    this.state = state;
    this.numPlayers = numPlayers;
    this.players = new Array(numPlayers);
    for (let i = 0; i < numPlayers; ++i) {
      this.players[i] = new Player();
    }
  }


  /**
   * Sets the Board state up with the default beginning configuration for two
   * players. All spaces on the Board are empty except for a square in the
   * center that looks like this:
   *  XO
   *  OX
   * @return {Board} this, so it can be chained
   */
  defaultStart() {
    const midX = Math.floor(this.width / 2);
    const midY = Math.floor(this.height / 2);

    this.state[midX - 1][midY - 1] = 1;
    this.state[midX][midY - 1] = 2;
    this.state[midX - 1][midY] = 2;
    this.state[midX][midY] = 1;

    return this;
  }


  /**
   * Converts the state object to a string and returns it
   * @return {string} the state array, stringified
   */
  stateToString() {
    let out = '';
    for (let i = 0; i < this.width; ++i) {
      for (let j = 0; j < this.height; ++j) {
        out += this.state[i][j];
      }
      out += '\n';
    }

    return out;
  }


  /**
   * returns an array of points representing valid moves for a given player
   * @param {Player} p the player for whom the moves are valid
   * @return {[{x: number, y: number}]} the list of valid moves
   */
  getValidPlays(p) {
    // iterate through all squares on the board
    for (let i = 0; i < this.state.width; ++i) {
      for (let j = 0; j < this.state.height; ++j) {
        // at each square, we want to check if there is an unbroken line of
        // enemy pieces terminated by one of our own. That denotes a valid move
        // because it would capture those pieces
        // TODO implement this
      }
    }
    return [{x: 1, y: 2}, {x: 3, y: 4}];
  }
}


module.exports = Board;
