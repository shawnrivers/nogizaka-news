const now = new Date();
const tokyoDate = now.toLocaleString('en-US', {
  timeZone: 'Asia/Tokyo',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});
const [month, day, year] = tokyoDate.split('/');

module.exports = { day, month, year };
