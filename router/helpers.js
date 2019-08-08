
/*
* Pads a 1 or 2 digit number to two digits. Throws an error if given an
* input that is more than two digits already or isn't a number
*/
const twoDigits = (n) => {
  if (isNaN(n) || n.toString().length > 2) {
    throw new TypeError('Received input that is too long or not a number');
  }
  return n.toString().padStart(2, '0');
};


/*
 * Converts a JavaScript Date object to a MySQL DateTime string
 */
const toMySQLDateTime = (d) => {
  return d.getUTCFullYear() + '-' + twoDigits(1 + d.getUTCMonth()) + '-' +
  twoDigits(d.getUTCDate()) + ' ' + twoDigits(d.getUTCHours()) + ':' +
  twoDigits(d.getUTCMinutes()) + ':' + twoDigits(d.getUTCSeconds());
};


/*
 * Generates a 6-10 digit random string to be used as a game id
 */
const genGameID = () => {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
  const length = Math.floor(Math.random() * 5) + 6;
  let out = '';
  for (let i = 0; i < length; ++i) {
    out += chars[Math.floor(Math.random() * 36)];
  }
  return out;
};


module.exports = {
  twoDigits,
  toMySQLDateTime,
  genGameID,
};
