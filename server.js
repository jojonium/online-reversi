const express = require('express');
const app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

// specify router
require('./router/main')(app);

// specify views directory
app.set('views', __dirname + '/views');

app.engine('html', require('ejs').renderFile);

const server = app.listen(3000, () => {
  console.log('Started server listening on port 3000');
});
