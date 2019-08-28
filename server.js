const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

// include database credentials in separate file for security
const conn = mysql.createConnection(require('./connection'));

// use to parse application/json
app.use(bodyParser.json());

// connect to the database
conn.connect((err) => {
  if (err) {
    console.error('Failed to connect to the database');
    throw err;
  }
  console.log('Connected to MySQL database...');
});

// specify router and other verbs
require('./router/main')(app);
require('./router/api')(app, conn);

// specify views directory
app.set('views', __dirname + '/view');

// specify directory for static content
app.use(express.static(__dirname + '/static'));

// TODO maybe there's a better rendering engine?
app.engine('html', require('ejs').renderFile);

app.listen(3000, () => {
  console.log('Started server listening on port 3000');
});
