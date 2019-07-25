var express = require('express');
var app = express();

require('./router/main')(app);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.get('/', (req, res) => {
  res.send('Hello World');
});

var server = app.listen(3000, () => {
  console.log('Started server listening on port 3000');
});
