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
    .then(response => {
      const data = response.data.predictions.direction.prediction;
      const predictions = data.map(data => (data.minutes));
      res.status(200).send(predictions);
    })
    .catch(err => {
      res.status(400).send(err);
    })
};

module.exports = getPredictions;