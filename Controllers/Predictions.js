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

      // have to do type checking with every loop because the NextBus API
      // changes the provided datatypes on its own accord
      if (Array.isArray(directions)) {
        directions.forEach(direction => {
          if (Array.isArray(direction.prediction)) {
            direction.prediction.forEach(prediction => {
              predictions.push(Number(prediction.minutes));
            });
          } else {
            predictions.push(Number(direction.prediction.minutes));
          }
        });
      } else {
        if (Array.isArray(directions.prediction)) {
          directions.prediction.forEach(prediction => {
            predictions.push(Number(prediction.minutes));
          });
        } else {
          predictions.push(Number(directions.prediction.minutes));
        }
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
