const { getAppManifests } = require('./manifest-helpers');

function getEntryManifests(entry) {
  const allManifests = getAppManifests();
  let entryManifests = allManifests;
  if (entry) {
    const entryNames = entry.split(',').map(name => name.trim());
    entryManifests = allManifests.filter(manifest =>
      entryNames.includes(manifest.entryName),
    );
  }
  return entryManifests;
}

module.exports = {
  getEntryManifests,
};
