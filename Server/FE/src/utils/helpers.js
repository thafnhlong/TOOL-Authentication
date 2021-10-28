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

export function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
};