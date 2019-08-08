module.exports = (app, conn) => {

  // get info about a single game from the database, the last time it was
  // modified and the names of each of the players
  app.get('/api/game/:id', (req, res) => {
    let sql =
      `SELECT P.name, G.modified
       FROM player P, plays Z, game G
       WHERE G.id = '${req.params.id}' AND  Z.gID = G.id AND P.id = Z.pID;`
    let query = conn.query(sql, (err, results) => {
      if (err) throw err;
     
      if (results.length < 1) {
        // if no results, send an error
        res.send(JSON.stringify({
          'status': 400, 
          'error': 'Database returned no data. Probably an invalid game ID', 
          'response': null
        }));
      } else {
        // otherwise make the results a little more readable and send them
        let players = results.map((r) => r.name);
        let output = {'players': players, 'modified': results[0].modified};
        res.send(JSON.stringify(
          {'status': 200, 'error': null, 'response': output}
        ));
      }
    });
  });


  /*
   * The rest of these are just examples and won't actually work as-is
   * They should eventually be removed
   */
  // show all products
  app.get('/api/products', (req, res) => {
    let sql = 'SELECT * FROM product';
    let query = conn.query(sql, (err, results) => {
      if (err) throw err;
      res.send(JSON.stringify(
        {'status': 200, 'error': null, 'response': results}
      ));
    });
  });

  // show single product by id
  app.get('api/products/:id', (req, res) => {
    let sql = 'SELECT * FROM product WHERE product_id=' + req.params.id;
    let query = conn.query(sql, (err, results) => {
      if (err) throw err;
      res.send(JSON.stringify(
        {'status': 200, 'error': null, 'response': results}
      ));
    });
  });

  // add new product
  app.post('/api/products', (req, res) => {
    let data = {
      product_name: req.body.product_name,
      product_price: req.body.product_price
    };
    let sql = 'INSERT INTO product SET ?';
    let query = conn.query(sql, data, (err, results) => {
      if (err) throw err;
      res.send(JSON.stringify(
        {'status': 200, 'error': null, 'response': results}
      ));
    });
  });

  // update product
  app.put('/api/products/:id', (req, res) => {
    let sql = 'UPDATE product SET product_name=\'' + req.body.product_name + 
      '\', product_price=\'' + req.body.product_price + '\' WHERE product_id=' + 
      req.params.id;
    let query = conn.query(sql, (err, results) => {
      if (err) throw err;
      res.send(JSON.stringify(
        {'status': 200, 'error': null, 'response': results}
      ));
    });
  });

  // delete product
  app.delete('/api/products/:id', (req, res) => {
    let sql = 'DELETE FROM product WHERE product_id=' + req.params.id;
    let query = conn.query(sql, (err, results) => {
      if (err) throw err;
      res.send(JSON.stringify(
        {'status': 200, 'error': null, 'response': results}
      ));
    });
  });
}
