
/**
 * Pads a one or two digit number to two digits
 * @param {number} n a one or two digit number
 * @return {string} the string representation of n, left-padded with zeroes to
 * be exactly two characters
 */
const twoDigits = (n) => {
  if (isNaN(n) || n.toString().length > 2) {
    throw new TypeError('Received input that is too long or not a number');
  }
  return n.toString().padStart(2, '0');
};

/**
 * Converts a JavaScript Date object to a MySQL DateTime string
 * @param {Date} d a JavaScript Date object
 * @return{string} a MySQL-compatible string version of d
 */
const toMySQLDateTime = (d) => {
  return d.getUTCFullYear() + '-' + twoDigits(1 + d.getUTCMonth()) + '-' +
  twoDigits(d.getUTCDate()) + ' ' + twoDigits(d.getUTCHours()) + ':' +
  twoDigits(d.getUTCMinutes()) + ':' + twoDigits(d.getUTCSeconds());
};


/**
 * Generates a 6-10 digit random string to be used as a game id, consisting of
 * lowercase letters and numbers
 * @return {string} the random game ID
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
