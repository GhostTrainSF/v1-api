const axios = require('axios');
const { buildApiUrl } = require('../utils.js');

const checkGhostTrain = async function(req, res) {
  // Inputs:
  //   - route (String): Valid route tag (ie L, M, KT, J, N)
  // Outputs:
  //   - Success (HTTP 200): Boolean indicating if the estimates
  //     for a given route are ghost trains. `true` indicates that
  //     all estimates are ghost trains. `false` indicates that not
  //     all estimates are ghost trains.
  //   - Error (HTTP 400): Error message string
  
  const { route } = req.params;
  const urlOptions = {
    command: 'vehicleLocations',
    route,
  };
  const url = buildApiUrl(urlOptions);
  try {
    const { data: { vehicle } } = await axios.get(url);
    res.send(vehicle.length === 0);
  } catch(e) {
    res.status(400).send(e);
  }
};
module.exports = {
  checkGhostTrain
};

