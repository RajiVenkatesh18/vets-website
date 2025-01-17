import manifest from '../manifest.json';

describe.skip(manifest.appName, () => {
  // Skip tests in CI until the app is released.
  // Remove this block when the app has a content page in production.
  //new comment
  before(function () {
    if (Cypress.env('CI')) this.skip();
  });

  it('is accessible', () => {
    cy.visit(manifest.rootUrl)
      .injectAxe()
      .axeCheck();
  });
});
