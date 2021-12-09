const express = require('express');
const app = express();
const PORT = 3000;
const artistRoute = require('./src/routes/routes.artist');

const { cache, rateLimiter } = require('./src/middlewares');

// set up the app and its routes
// all responses are cached in memory for some time to improve api performance
app.use(cache);
// a rate limit is set to prevent abuse of the api, ddos etc.
app.use(rateLimiter);

app.use('/api/artist', artistRoute);

// catch requests to all other routes and show an error message
app.get('*', (req, res) => {
  res.status(404).send('No such route was found. Did you mean /api/artist/:id?');
});

app.listen(PORT, () => {
  console.log('Listening on port ' + PORT + '...');
});

module.exports = app;
