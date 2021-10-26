import queryString from 'query-string';


export function getParams(location) {
  if (!location.state && location.search.length === 0) {
      return undefined;
  } else if (location.state) {
      return location.state.params;
  } else {
      var params = queryString.parse(location.search);
      return params;
  }
}