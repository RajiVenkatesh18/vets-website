const path = require('path');

function getAbsolutePath(relativePath) {
  return path.join(__dirname, '../../', relativePath);
}

module.exports = {
  getAbsolutePath,
};
