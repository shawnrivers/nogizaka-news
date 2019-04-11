import * as Twit from 'twit';

console.log('CONSUMER_KEY:', process.env.CONSUMER_KEY);
console.log('CONSUMER_SECRET:', process.env.CONSUMER_SECRET);
console.log('ACCESS_TOKEN:', process.env.ACCESS_TOKEN);
console.log('ACCESS_TOKEN_SECRET:', process.env.ACCESS_TOKEN_SECRET);

export const T = new Twit({
  consumer_key: '5M94fgNYJGWKmQEAJiAVlxyd1',
  consumer_secret: 'pbvUWwHLLOuF957m1dyf99hi3uNkSl3ARjSWqHOs7YQFm4bu1k',
  access_token: '1042795881752276993-3jDfNktrmtdQa7PXf4vD0Ycd2EJjwY',
  access_token_secret: 'TrFzOvpKjThKLKNo4KuvlQEfF0O107ll9GEuR4NwhrAwV',
  timeout_ms: 60 * 1000,
  strictSSL: true,
});
