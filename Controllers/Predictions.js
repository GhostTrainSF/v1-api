const axios = require('axios');
const { buildApiUrl } = require('../utils.js');

const getPredictions = (req, res) => {
  const options = {
    command: 'predictions', 
    route: req.params.route,
    stopTag: req.params.stopTag
  };

  const url = buildApiUrl(options);
  
  axios.get(url)
    .then(({ data }) => {
      const directions = data.predictions.direction;
      const predictions = [];
      if (Array.isArray(directions)) {
        directions.forEach(direction => {
          direction.prediction.forEach(prediction => {
            predictions.push(Number(prediction.minutes));
          });
        });
      } else {
        directions.prediction.forEach(prediction => {
          predictions.push(prediction.minutes);
        });  
      }
      res.status(200).send(predictions.sort((a, b) => {
        return a - b;
      }));
    })
    .catch(err => {
      res.status(400).send(err);
    });
};

module.exports = getPredictions;
