const axios = require('axios');
const { buildApiUrl } = require('../utils.js');

const getStationsFromIdAndDirection = async function(req, res) {
  // Inputs:
  //   - route (String): Valid route tag (ie L, M, KT, J, N)
  //   - direction (String): Valid direction (inbound/outbound)
  // Outputs:
  //   - Success (HTTP 200): Array of { Stops } for the provided
  //     `route` and `direction` params
  //   - Error (HTTP 400): Error message string
  
  const { route, direction } = req.params;
  const urlOptions = {
    command: 'routeConfig',
    route,
  };
  const url = buildApiUrl(urlOptions);
  try {
    const { data } = await axios.get(url);
    const directionalStops = getDirectionalStopsFromRoute(data.route.direction, direction);
    const stopTagsMap = getStopTagsMapFromStops(directionalStops[0].stop);
    const filteredStops = filterStopsByStopTags(data.route.stop, stopTagsMap);
    res.send(filteredStops);
  } catch(e) {
    res.status(400).send(e);
  }
};

const getDirectionalStopsFromRoute = (directions, target) => {
  // Inputs:
  //   - directions (Array): Array of objects containing stops
  //     in the inbound or outbound direction. Each object should
  //     have the `name` prop signifying the directions of the stops
  //     in the object.
  //   - target (String): Valid direction (inbound/outbound)
  // Outputs:
  //   - (Array): Array of objects containing stops in the target 
  //     direction.

  return directions.filter(path => {
    if (path.name.toLowerCase().includes(target)) {
      return true;
    }
    return false;
  });
};

const getStopTagsMapFromStops = stops => {
  // Inputs: 
  //   - stops (Array): Array of { Stop } objects. Each object should
  //     contain a .tag prop with the stop's stopTag.
  // Outputs:
  //   - (Object): Object hash table representing all stopTags from 
  //     provided `stops` parameter.

  return stops.reduce((acc, stop) => {
    acc[stop.tag] = 1;
    return acc;
  }, {});
};

const filterStopsByStopTags = (stops, stopTagsMap) => {
  // Inputs:
  //   - stops (Array): Array of { Stop } objects. Each object should
  //     contain a .tag prop with the stop's stopTag.
  //   - stopTagsMap (Object): Object hash table where keys are stopTags
  //     and values are truthy values signifying the stopTag exists.
  //     This structure is used to perform O(1) lookups over the `stops`
  //     parameter to determine if a given stop should be returned.
  // Outputs:
  //   - (Array): Array of { Stop } objects that contain various props
  //     such as stopTag and stopId.

  return stops.filter(stop => {
    if (stopTagsMap[stop.tag]) return true;
    return false;
  });
};

module.exports = {
  getStationsFromIdAndDirection
};

