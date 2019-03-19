const { Pool } = require('pg');
const pgconfig = require('../pgconfig.js');

const pool = new Pool(pgconfig);

const getInitDelay = (req, res) => {

  const queryString = `SELECT * FROM dailymuniestimates WHERE route = $1 AND station = $2`;
  const { route, stopTag } = req.params;
  const params = [route, stopTag];
  pool.query(queryString, params, (err, result) => {
    if (err) {
      res.status(400).send(err);
    } else {
      const timeSeries = result.rows;
      let recent = timeSeries[timeSeries.length - 1];
      let oldest;
      for (let i = timeSeries.length - 1; i >= 0; i--) {
        if (timeSeries[i].firstestimate > timeSeries[i-1].firstestimate) {
          oldest = timeSeries[i];
          break;
        }
      }

      let realTimeDiff = Math.floor((Number(recent.querytime) - Number(oldest.querytime))/60000);

      let predictedTimeDiff = [
        oldest.firstestimate - recent.firstestimate, 
        oldest.secondestimate - recent.secondestimate,
        oldest.thirdestimate - recent.thirdestimate
      ];

      let delay = [
        realTimeDiff - predictedTimeDiff[0],
        realTimeDiff - predictedTimeDiff[1],
        realTimeDiff - predictedTimeDiff[2]
      ];

      res.status(200).send(delay);
    }
  })
};

module.exports = getInitDelay;