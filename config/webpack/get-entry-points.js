const { getWebpackEntryPoints } = require('./manifest-helpers');
const { getEntryManifests } = require('./get-entry-manifests');

/**
 * Get a list of all the entry points.
 *
 * @param {String} entry - List of comma-delimited entries to build. Builds all
 *                         entries if no value is passed.
 * @return {Object} - The entry file paths mapped to the entry names
 */
function getEntryPoints(entry) {
  const manifestsToBuild = getEntryManifests(entry);

  return getWebpackEntryPoints(manifestsToBuild);
}

module.exports = {
  getEntryPoints,
};
