const axios = require('axios');
const { buildApiUrl } = require('./utils.js');
const { Pool } = require('pg');
const pgconfig = require('./pgconfig.js');

const pool = new Pool(pgconfig);

const lines = ['J', 'KT', 'L', 'M', 'N'];

const scraper = async function() {
  const queryTime = Date.now();

  // Queries for all stations in each line and stores it in a stations hash table
  // Stations hash table will have keys of the line and values of station objects
  const stations = {};
  for (let i = 0; i < lines.length; i++) {
    const queryStationsURL = buildApiUrl({command: 'routeConfig', route: lines[i]});
    try {
      const result = await axios.get(queryStationsURL);
      stations[lines[i]] = result.data.route.stop;
    } catch(error) {
      console.log(error);
    }
  }

  // Queries all predictions per station in stations hash table
  // Stores the latest three predictions per station as a 'stationPrediction' object inside the predictions array
  const predictions = [];
  for (let key in stations) {
    for (let i = 0; i < stations[key].length; i++) {
      const queryPredictionsURL = buildApiUrl({command: 'predictions', route: key, stopTag: stations[key][i].tag});
      try {
        const result = await axios.get(queryPredictionsURL);
        if (result.data.predictions) {
          const predictionArray = result.data.predictions.direction.prediction;
          const stationPrediction = {
            queryTime: queryTime,
            route: key,
            firstEstimate: predictionArray[0].minutes,
            secondEstimate: predictionArray[1].minutes,
            thirdEstimate: predictionArray[2].minutes,
            station: stations[key][i].tag
          };
          predictions.push(stationPrediction);
        }
      } catch(error) {
        console.log(error);
      }
    }
  }

  // Inserts each stationPrediction object inside the predictions array into database
  for (let i = 0; i < predictions.length; i++) {
    const { queryTime, route, firstEstimate, secondEstimate, thirdEstimate, station } = predictions[i];
    const params = [queryTime, route, firstEstimate, secondEstimate, thirdEstimate, station];
    const queryString = `INSERT INTO dailymuniestimates (queryTime, route, firstEstimate, secondEstimate, thirdEstimate, station) VALUES ($1, $2, $3, $4, $5, $6)`;
    pool.connect()
      .then(client => {
        return client.query(queryString, params)
          .then(client.release)
          .catch(err => {
            client.release;
            console.log(err.stack)
          });
      })
      .catch(error => {
        console.log(error);
      })
    };
};

scraper();