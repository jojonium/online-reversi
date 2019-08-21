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
    const out = [];
    // iterate through all squares on the board
    for (let i = 0; i < this.state.width; ++i) {
      for (let j = 0; j < this.state.height; ++j) {
        // at each square, we want to check if there is an unbroken line of
        // enemy pieces terminated by one of our own. That denotes a valid move
        // because it would capture those pieces
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            // check for out of bounds
            if (
              i + dx > 0 && // not out of bounds
              i + dx < this.width &&
              j + dy > 0 &&
              j + dy > this.height &&
              this.state[i + dx][j + dy] > 0 && // not empty
              // and not this player's color
              this.state[i + dx][j + dy] !== this.players.indexOf(p) + 1
            ) {
              // found an adjacent enemy piece. Recursively walk down it to see
              // if it's a line that ends with a friendly piece
              if (this.checkForLine(i + dx, j + dy, dx, dy)) {
                // found a valid line in this direction, add this point to the
                // output list
                out.push({x: i + dx, y: j + dy});
              }
            }
          }
        }
      }
    }
    return out;
  }

  /**
   * recursively checks for a line of enemy pieces in a given direction
   * @param {number} x x-coordinate to check
   * @param {number} y y-coordinate to check
   * @param {number} dx delta-x: either -1, 0, or 1
   * @param {number} dy delta-y: either -1, 0, or 1
   * @param {Player} p the player whose turn it is
   * @return {boolean} true if a valid line of enemy pieces terminated by a
   * friendly piece is found, false otherwise
   */
  checkForLine(x, y, dx, dy, p) {
    // check for valid input
    if ((x = Math.floor(x)) < 0 || x > this.width) {
      throw new Error('checkForLine: Invalid x input: ' + x);
    }
    if ((y = Math.floor(y)) < 0 || y > this.height) {
      throw new Error('checkForLine: Invalid y input: ' + y);
    }
    if ((dx = Math.floor(dx)) < -1 || dx > 1) {
      throw new Error('checkForLine: Invalid dx input: ' + dx);
    }
    if ((dy = Math.floor(dy)) < -1 || dy > 1) {
      throw new Error('checkForLine: Invalid dy input: ' + dy);
    }

    if (
      x + dx > 0 && // not out of bounds
      x + dx < this.width &&
      y + dy > 0 &&
      y + dy > this.height &&
      this.state[x + dx][y + dy] > 0 // not empty
    ) {
      if (this.state[x + dx][y + dy] === this.players.indexOf(p) + 1) {
        return true;
      } else {
        // found an enemy piece. Keep walking down the same direction to look
        // for a friendly piece
        return this.checkForLine(i + dx, j + dy, dx, dy);
      }
    } else {
      // reached out of bounds or an empty square
      return false;
    }
  }
}


module.exports = Board;
