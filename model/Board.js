const Player = require('./Player');

/**
 * This class represents a Board, including information on where all the pieces
 * are and how many people are playing
 */
class Board {
  /**
   * Creates a new Board object to keep track of the board state and players.
   * State is accessed as myBoard.state[x][y], because it is an array of
   * columns
   *
   * In the board state, -1 represents an empty space, and a 0 or positive
   * number represents a piece belonging to the player with that index in
   * this.players
   * @param {number} [width=8] the width of the board, between 2 and 16
   * @param {number} [height=8] the height of the board
   * @param {number} [numPlayers=2] the number of players
   * @constructor
   */
  constructor(width = 8, height = 8, numPlayers = 2) {
    // check for invalid input
    if ((width = Math.floor(width)) < 2 || width > 16) {
      throw new Error('Board constructor: Invalid width: ' + width);
    }
    if ((height = Math.floor(height)) < 2 || height > 16) {
      throw new Error('Board constructor: Invalid height: ' + height);
    }
    if ((numPlayers = Math.floor(numPlayers)) < 2) {
      // TODO set upper limit on numPlayers
      throw new Error('Board constructor: Invalid numPlayers: ' + numPlayers);
    }

    /** @type number[][] */
    this.state = new Array(width);
    for (let i = 0; i < width; ++i) {
      this.state[i] = new Array(height);
      for (let j = 0; j < height; ++j) {
        this.state[i][j] = -1; // empty
      }
    }

    this.width = width;
    this.height = height;
    this.numPlayers = numPlayers;
    /** @type Player[] */
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
   * Also sets initial scores for the two players
   * @return {Board} this, so it can be chained
   */
  defaultStart() {
    const midX = Math.floor(this.width / 2);
    const midY = Math.floor(this.height / 2);

    this.state[midX - 1][midY - 1] = 0;
    this.state[midX][midY - 1] = 1;
    this.state[midX - 1][midY] = 1;
    this.state[midX][midY] = 0;

    this.players[0].score = 2;
    this.players[1].score = 2;

    return this;
  }


  /**
   * Converts the state object to a string and returns it
   * @return {string} the state array, stringified
   */
  stateToString() {
    let out = '';
    for (let j = 0; j < this.height; ++j) {
      for (let i = 0; i < this.width; ++i) {
        // empty squares should be spaces
        if (this.state[i][j] === -1) {
          out += '_';
        } else {
          // otherwise add a number or letter for the square on this space
          out += this.state[i][j].toString(36);
        }
      }
      out += '\n';
    }

    return out;
  }


  /**
   * Returns an array of points representing valid moves for a given player,
   * with no duplicates (even if a singple piece could flip multiple lines)
   * @param {Player} p the player for whom the moves are valid
   * @return {Array<{x: number, y: number}>} the list of valid moves
   */
  getValidPlays(p) {
    // check for invalid player
    if (this.players.indexOf(p) < 0) {
      throw new Error('getValidPlays: Invalid p');
    }

    const out = [];
    // iterate through all squares on the board
    for (let i = 0; i < this.width; ++i) {
      for (let j = 0; j < this.height; ++j) {
        // at each empty square, we want to check if there is an unbroken line
        // of enemy pieces terminated by one of our own. That denotes a valid
        // move because it would capture those pieces
        if (this.state[i][j] === -1) { // this square is empty
          squareChecker: // label this loop so we can break out later
          for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
              // check adjacent squares
              if (
                i + dx >= 0 && // not out of bounds
                i + dx < this.width &&
                j + dy >= 0 &&
                j + dy < this.height &&
                this.state[i + dx][j + dy] >= 0 && // not empty
                // and not this player's color
                this.state[i + dx][j + dy] !== this.players.indexOf(p) &&
                // Recursively walk down this direction to see if it's a line
                // that ends with a friendly piece
                this.checkForLine(i, j, dx, dy, p)
              ) {
                // found a valid line in this direction, add this point to the
                // output list
                out.push({x: i, y: j});
                // now break out of the for loop so we don't add the same
                // point multiple times
                break squareChecker;
              }
            }
          }
        }
      }
    }
    return out;
  }

  /**
   * Checks whether a player can legally place a piece at a given location
   * @param {number} x the x-coordinate to check
   * @param {number} y the y-coordinate to check
   * @param {Player} p the player making the move
   * @return {Array<{dx: number, dy: number}>} a list of directions
   * representing which lines would be flipped if a piece is placed here. The
   * array is empty if this is not a valid move
   */
  isValidMove(x, y, p) {
    // check for valid input
    if ((x = Math.floor(x)) < 0 || x >= this.width) {
      throw new Error('isValidMove: Invalid x input: ' + x);
    }
    if ((y = Math.floor(y)) < 0 || y >= this.height) {
      throw new Error('isValidMove: Invalid y input: ' + y);
    }
    if (this.players.indexOf(p) < 0) {
      throw new Error('isValidMove: Invalid p');
    }

    const out = [];
    // if this spot isn't empty it can't be valid
    if (this.state[x][y] !== -1) {
      return out;
    }
    // for each direction
    for (let dx = -1; dx <= 1; ++dx) {
      for (let dy = -1; dy <= 1; ++dy) {
        if (
          x + dx >= 0 && // not out of bounds
          x + dx < this.width &&
          y + dy >= 0 &&
          y + dy < this.height &&
          this.state[x + dx][y + dy] >= 0 && // not empty
          // and not this player's color
          this.state[x + dx][y + dy] !== this.players.indexOf(p) &&
          // Recursively walk down this direction to see if it's a line
          // that ends with a friendly piece
          this.checkForLine(x, y, dx, dy, p)
        ) {
          out.push({dx: dx, dy: dy});
        }
      }
    }
    return out;
  }

  /**
   * Checks if placing a piece here would be a valid move for a particular
   * direction
   *
   * x and y are the coordinates of an empty space on the board. dx and dy are
   * offsets specifying the direction to check in (e.g. dx = -1, dy = 0 means
   * check to the left). This method recursively walks in the given direction,
   * looking for an unbroken chain of enemy pieces terminated by a friendly
   * piece. If it finds this, it returns true, false otherwise.
   *
   * @param {number} x x-coordinate to check
   * @param {number} y y-coordinate to check
   * @param {number} dx delta-x: either -1, 0, or 1. Positive dx goes right
   * while negative dx goes left
   * @param {number} dy delta-y: either -1, 0, or 1. Note that positive dy goes
   * down while negative dy goes up
   * @param {Player} p the player whose turn it is
   * @param {boolean} [first=true] whether this is the first place we've checked
   * @return {boolean} true if a valid line of enemy pieces terminated by a
   * friendly piece is found, false otherwise
   */
  checkForLine(x, y, dx, dy, p, first = true) {
    // check for valid input
    if ((x = Math.floor(x)) < 0 || x >= this.width) {
      throw new Error('checkForLine: Invalid x input: ' + x);
    }
    if ((y = Math.floor(y)) < 0 || y >= this.height) {
      throw new Error('checkForLine: Invalid y input: ' + y);
    }
    if ((dx = Math.floor(dx)) < -1 || dx > 1) {
      throw new Error('checkForLine: Invalid dx input: ' + dx);
    }
    if ((dy = Math.floor(dy)) < -1 || dy > 1) {
      throw new Error('checkForLine: Invalid dy input: ' + dy);
    }
    if (this.players.indexOf(p) < 0) {
      throw new Error('checkForLine: Invalid p');
    }

    // if the first space isn't empty it obviously can't be a valid move
    if (first && this.state[x][y] >= 0) {
      return false;
    }

    if (
      x + dx >= 0 && // not out of bounds
      x + dx < this.width &&
      y + dy >= 0 &&
      y + dy < this.height &&
      this.state[x + dx][y + dy] >= 0 // not empty
    ) {
      if (this.state[x + dx][y + dy] === this.players.indexOf(p)) {
        return true;
      } else {
        // found an enemy piece. Keep walking down the same direction to look
        // for a friendly piece
        return this.checkForLine(x + dx, y + dy, dx, dy, p, false);
      }
    } else {
      // reached out of bounds or an empty square
      return false;
    }
  }


  /**
   * Makes a move at a location for a player. First checks to make sure the
   * move is valid, then makes it, flipping the correct pieces and adjusting
   * scores. Returns null if the move is invalid, or the new Board otherwise
   * @param {number} x the x-coordinate of the move
   * @param {number} y the y-coordinate of the move
   * @param {Player} p the player making the move
   * @return {Board}
   */
  safeMakeMove(x, y, p) {
    // check for valid input
    if ((x = Math.floor(x)) < 0 || x >= this.width) {
      throw new Error('safeMakeMove: Invalid x input: ' + x);
    }
    if ((y = Math.floor(y)) < 0 || y >= this.height) {
      throw new Error('safeMakeMove: Invalid y input: ' + y);
    }
    const myNum = this.players.indexOf(p);
    if (myNum < 0) {
      throw new Error('safeMakeMove: Invalid p');
    }

    // see which directions would be flipped
    const dirs = this.isValidMove(x, y, p);
    if (dirs.length === 0) {
      // if the move is invalid just return null
      return null;
    }

    // place a piece here
    this.state[x][y] = myNum;
    // add a score for this piece
    p.score++;

    for (const d in dirs) {
      if (dirs[d]) {
        // for each direction, walk in that direction flipping enemy pieces
        // until we reach a friendly piece
        const dx = dirs[d].dx;
        const dy = dirs[d].dy;
        let i = x + dx;
        let j = y + dy;
        while (this.state[i][j] !== myNum) {
          // subtract one from enemy score
          this.players[this.state[i][j]].score--;
          // add one to this player's score
          p.score++;
          // flip the piece
          this.state[i][j] = myNum;
          i += dx;
          j += dy;
        }
      }
    }
    return this;
  }
}


module.exports = Board;
