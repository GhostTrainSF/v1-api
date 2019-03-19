const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const StationsRouter = require('./Routers/Stations.js');
const PredictionsRouter = require('./Routers/Predictions.js');
const InitDelayRouter = require('./Routers/InitDelay.js');
const GhostRouter = require('./Routers/Ghost.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(cors());

app.use('/v1/api/stations', StationsRouter);
app.use('/v1/api/predictions', PredictionsRouter);
app.use('/v1/api/initDelay', InitDelayRouter);
app.use('/v1/api/ghosttrain', GhostRouter);

app.listen(PORT, err => {
  if (err) throw err;
  console.log(`Listening on port ${PORT}`);
});
