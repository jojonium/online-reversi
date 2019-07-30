const express    = require('express');
const bodyParser = require('body-parser');
const mysql      = require('mysql');
const app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

// specify router and other verbs
require('./router/main')(app);
require('./router/api')(app);

// use to parse application/json
app.use(bodyParser.json());

// create database connection
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'restful_db'
});

// connect to the database
conn.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database...');
});

// specify views directory
app.set('views', __dirname + '/views');

// specify directory for static content
app.use(express.static(__dirname + '/static'));

app.engine('html', require('ejs').renderFile);

const server = app.listen(3000, () => {
  console.log('Started server listening on port 3000');
});
