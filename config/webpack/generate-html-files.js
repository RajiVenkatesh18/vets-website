const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const facilitySidebar = require('@department-of-veterans-affairs/platform-landing-pages/facility-sidebar');
const headerFooterData = require('@department-of-veterans-affairs/platform-landing-pages/header-footer-data');

const scaffoldRegistry = require('../../src/applications/registry.scaffold.json');

/**
 * Generates HTML files for each app and widget.
 *
 * @param {String} buildPath - Path to the overall build destination.
 * @param {Object} scaffoldAssets - Map of scaffold asset filenames to file contents.
 *
 * @return {HtmlWebpackPlugin[]} - Array of HtmlWebpackPlugin instances,
 *   representing the HTML files to generate for each app and widget.
 */
function generateHtmlFiles(buildPath, scaffoldAssets) {
  const appRegistry = JSON.parse(scaffoldAssets['registry.json']);
  const loadInlineScript = filename => scaffoldAssets[filename];

  // Modify the script and style tags output from HTML Webpack Plugin
  // to match the order and attributes of tags from real content.
  const modifyScriptAndStyleTags = originalTags => {
    let scriptTags = [];
    let styleTags = [];

    originalTags.forEach(tag => {
      if (tag.attributes.src?.match(/style/)) {
        // Exclude style.entry.js, which gets included with the style chunk.
      } else if (tag.attributes.src?.match(/polyfills/)) {
        // Force polyfills.entry.js to be first since vendor.entry.js gets
        // put first even with chunksSortMode: 'manual'. Also set nomodule
        // so IE polyfills don't load in newer browsers
        const tagWithNoModule = {
          ...tag,
          attributes: { ...tag.attributes, nomodule: true },
        };
        scriptTags = [tagWithNoModule, ...scriptTags];
      } else if (tag.attributes.href?.match(/style/)) {
        // Put style.css before the app-specific stylesheet
        styleTags = [tag, ...styleTags];
      } else if (tag.attributes.src) {
        scriptTags.push(tag);
      } else if (tag.attributes.href) {
        styleTags.push(tag);
      } else {
        throw new Error('Unexpected tag in <head>:', tag);
      }
    });

    return [...styleTags, ...scriptTags].join('');
  };

  /* eslint-disable no-nested-ternary */
  const generateHtmlFile = ({
    appName,
    entryName = 'static-pages',
    rootUrl,
    template = {},
    widgetType,
    widgetTemplate,
  }) =>
    new HtmlPlugin({
      chunks: ['polyfills', 'web-components', 'vendor', 'style', entryName],
      filename: path.join(buildPath, rootUrl, 'index.html'),
      inject: false,
      scriptLoading: 'defer',
      template: 'src/platform/landing-pages/dev-template.ejs',
      templateParameters: {
        // Menu and navigation content
        headerFooterData,
        facilitySidebar,

        // Helper functions
        loadInlineScript,
        modifyScriptAndStyleTags,

        // Default template metadata.
        breadcrumbs_override: [], // eslint-disable-line camelcase
        includeBreadcrumbs: false,
        loadingMessage: 'Please wait while we load the application for you.',

        // App-specific config
        entryName,
        widgetType,
        widgetTemplate,
        rootUrl,
        ...template, // Unpack any template metadata from the registry entry.
      },
      title:
        typeof template !== 'undefined' && template.title
          ? `${template.title} | Veterans Affairs`
          : typeof appName !== 'undefined'
            ? appName
              ? `${appName} | Veterans Affairs`
              : null
            : 'VA.gov Home | Veterans Affairs',
    });
  /* eslint-enable no-nested-ternary */

  return [...appRegistry, ...scaffoldRegistry]
    .filter(({ rootUrl }) => rootUrl)
    .map(generateHtmlFile);
}

module.exports = {
  generateHtmlFiles,
};
