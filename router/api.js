const helpers = require('./helpers');
const Board = require('../model/Board');
const bcrypt = require('bcrypt');

module.exports = (app, conn) => {
  /*
   * get info about a single game from the database, including the last time it
   * was modified and the names of each of the players
   */
  app.get('/api/game/:id', (req, res) => {
    // error check
    if (typeof req.params.id !== 'string' || req.params.id.length < 6 ||
        req.params.id.length > 10) {
      res.status(400).send(JSON.stringify(
          {'status': 400, 'error': 'Invalid game ID', 'response': null}
      ));
    } else {
      const sql =
        `SELECT P.name, G.modified
        FROM player P, plays Z, game G
        WHERE G.id = ? AND  Z.gID = G.id AND P.id = Z.pID;`;
      conn.query(sql, [req.params.id], (err, results) => {
        if (err) throw err;
        if (results.length < 1) {
          // if no results, send an error
          res.status(400).send(JSON.stringify({
            'status': 404,
            'error': 'No game found with ID ' + req.params.id,
            'response': null,
          }));
        } else {
          // otherwise make the results a little more readable and send them
          /** @type string[] */
          const players = results.map((r) => r.name);
          const output = {'players': players, 'modified': results[0].modified};
          res.status(200).send(JSON.stringify(
              {'status': 200, 'error': null, 'response': output}
          ));
        }
      });
    }
  });


  /*
   * Create a game. This adds a new game to the database with a particular
   * number of players
   * Input format: {
   *   numPlayers: 2,
   *   boardWidth: 8,
   *   boardHeight: 8
   * }
   * Output format: {
   *   id: 'c9bn3k1',
   * }
   */
  app.post('/api/game', (req, res) => {
    // error checking
    if (isNaN(req.body.numPlayers) || req.body.numPlayers < 2 ||
        req.body.numPlayers > 10) {
      res.status(400).send(JSON.stringify({
        'status': 400,
        'error': 'Invalid or missing numPlayers',
        'response': null,
      }));
      return;
    } if (isNaN(req.body.boardWidth) || req.body.boardWidth < 4 ||
        req.body.boardWidth > 16) {
      res.status(400).send(JSON.stringify({
        'status': 400,
        'error': 'Invalid or missing boardWidth',
        'response': null,
      }));
      return;
    } if (isNaN(req.body.boardHeight) || req.body.boardHeight < 4 ||
        req.body.boardHeight > 16) {
      res.status(400).send(JSON.stringify({
        'status': 400,
        'error': 'Invalid or missing boardHeight',
        'response': null,
      }));
      return;
    }

    const numPlayers = req.body.numPlayers; /** @type number */
    const nowMySQL = helpers.toMySQLDateTime(new Date());
    const newID = helpers.genGameID();
    const b = new Board.Board(req.body.boardWidth, req.body.BoardHeight,
        numPlayers);
    const boardString = b.defaultStart().stateToString();
    const sql = 'INSERT INTO game (id, created, modified, numPlayers,' +
      'width, height, boardState) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const vals = [newID, nowMySQL, nowMySQL, numPlayers,
      req.body.boardWidth, req.body.boardHeight, boardString];

    conn.query(sql, vals, (err, results) => {
      if (err) throw err;
      res.status(201).send(JSON.stringify(
          {'status': 201, 'error': null, 'response': {id: newID}}
      ));
    });
  });


  /**
   * Adds a new player to an existing game. This first checks to make sure the
   * game exists and isn't full already, then adds a player with the given name
   * and password, if provided. If name is omitted it chooses a random one. If
   * password is omitted a user is created with no password.
   * Input format: {
   *   name: "Steve",
   *   password: "12345"
   * }
   * Names longer than 20 characters will be truncated to 20 characters.
   */
  app.post('/api/game/:id/player', (req, res) => {
    // error check
    if (typeof req.params.id !== 'string' || req.params.id.length < 6 ||
        req.params.id.length > 10) {
      res.status(400).send(JSON.stringify(
          {'status': 400, 'error': 'Invalid game ID', 'response': null}
      ));
      return;
    }

    const sql =
      `SELECT COUNT(*) AS n, G.numPlayers AS t
      FROM plays Q, game G
      WHERE Q.gID = ? AND G.id = Q.gID;`;
    conn.query(sql, [req.params.id], (err, results) => {
      if (err) throw err;

      const usedPlayers = results[0].n; /** @type number */
      const totalPlayers = results[0].t; /** @type number */

      if (usedPlayers >= totalPlayers) {
        // all players already exist, send an error
        res.status(403).send(JSON.stringify(
            {'status': 403, 'error': 'Game already full', 'response': null}
        ));
        return;
      }

      let newPassword = '';
      let newName = '';
      if (typeof req.body.name === 'string') {
        newName = req.body.name.trim().substring(0, 20);
      } else {
        // TODO choose a random name
      }
      if (typeof req.body.password === 'string') {
        newPassword = req.body.password.trim();
      }
      if (typeof req.body.password === 'string') {
        const saltRounds = 10;
        bcrypt.hash(newPassword, saltRounds, function(err, hash) {
          if (err) throw err;

          console.log('name:' + newName + ', pass: ' + hash);
        });
      }
    });
  });


  /*
   * The rest of these are just examples and won't actually work as-is
   * They should eventually be removed
   */
  // show all products
  app.get('/api/products', (req, res) => {
    const sql = 'SELECT * FROM product';
    conn.query(sql, (err, results) => {
      if (err) throw err;
      res.status(200).send(JSON.stringify(
          {'status': 200, 'error': null, 'response': results}
      ));
    });
  });

  // show single product by id
  app.get('api/products/:id', (req, res) => {
    const sql = 'SELECT * FROM product WHERE product_id=' + req.params.id;
    conn.query(sql, (err, results) => {
      if (err) throw err;
      res.status(200).send(JSON.stringify(
          {'status': 200, 'error': null, 'response': results}
      ));
    });
  });

  // add new product
  app.post('/api/products', (req, res) => {
    const data = {
      product_name: req.body.product_name,
      product_price: req.body.product_price,
    };
    const sql = 'INSERT INTO product SET ?';
    conn.query(sql, data, (err, results) => {
      if (err) throw err;
      res.status(200).send(JSON.stringify(
          {'status': 200, 'error': null, 'response': results}
      ));
    });
  });

  // update product
  app.put('/api/products/:id', (req, res) => {
    const sql = 'UPDATE product SET product_name=\'' + req.body.product_name +
      '\', product_price=\'' + req.body.product_price + '\' WHERE product_id=' +
      req.params.id;
    conn.query(sql, (err, results) => {
      if (err) throw err;
      res.status(200).send(JSON.stringify(
          {'status': 200, 'error': null, 'response': results}
      ));
    });
  });

  // delete product
  app.delete('/api/products/:id', (req, res) => {
    const sql = 'DELETE FROM product WHERE product_id=' + req.params.id;
    conn.query(sql, (err, results) => {
      if (err) throw err;
      res.status(200).send(JSON.stringify(
          {'status': 200, 'error': null, 'response': results}
      ));
    });
  });
};
