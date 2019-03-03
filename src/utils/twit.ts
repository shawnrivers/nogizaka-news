const Twit = require('twit');
const config = {
  consumer_key: '5M94fgNYJGWKmQEAJiAVlxyd1',
  consumer_secret: 'pbvUWwHLLOuF957m1dyf99hi3uNkSl3ARjSWqHOs7YQFm4bu1k',
  access_token: '1042795881752276993-3jDfNktrmtdQa7PXf4vD0Ycd2EJjwY',
  access_token_secret: 'TrFzOvpKjThKLKNo4KuvlQEfF0O107ll9GEuR4NwhrAwV',
  timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
  strictSSL: true, // optional - requires SSL certificates to be valid.
};

export const T = new Twit(config);
