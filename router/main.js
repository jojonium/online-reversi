module.exports = (app) => {
  app.get('/', (req, res) => {
    res.render('pages/index');
  });

  app.get('/about', (req, res) => {
    res.render('pages/about');
  });
};
