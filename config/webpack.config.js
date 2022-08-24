/* eslint-disable no-console */

require('core-js/stable');
require('regenerator-runtime/runtime');
require('dotenv').config();

const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const WebpackBar = require('webpackbar');
const StylelintPlugin = require('stylelint-webpack-plugin');
const BUCKETS = require('../src/site/constants/buckets');
const ENVIRONMENTS = require('../src/site/constants/environments');

// Webpack Config imports
const { getEntryManifests } = require('./webpack/get-entry-manifests');
const { getEntryPoints } = require('./webpack/get-entry-points');
const { getScaffoldAssets } = require('./webpack/get-scaffold-assets');
const { generateHtmlFiles } = require('./webpack/generate-html-files');
const { getAbsolutePath } = require('./webpack/get-absolute-path');
const generateWebpackDevConfig = require('./webpack/webpack.dev.config');

const { VAGOVSTAGING, VAGOVPROD, LOCALHOST } = ENVIRONMENTS;

// TODO: refactor the other approach for creating files without the hash so that we're only doing that in the webpack config: https://github.com/department-of-veterans-affairs/vets-website/blob/a012bad17e5bf024b0ea7326a72ae6a737e349ec/src/site/stages/build/plugins/process-entry-names.js#L35
const vaMedalliaStylesFilename = 'va-medallia-styles';

const sharedModules = [
  getAbsolutePath('src/platform/polyfills'),
  'react',
  'react-dom',
  'react-redux',
  'redux',
  'redux-thunk',
  '@sentry/browser',
];

const globalEntryFiles = {
  polyfills: getAbsolutePath('src/platform/polyfills/preESModulesPolyfills.js'),
  style: getAbsolutePath('src/platform/site-wide/sass/style.scss'),
  [vaMedalliaStylesFilename]: getAbsolutePath(
    'src/platform/site-wide/sass/va-medallia-style.scss',
  ),
  styleConsolidated: getAbsolutePath(
    'src/applications/proxy-rewrite/sass/style-consolidated.scss',
  ),
  vendor: sharedModules,
  // This is to solve the issue of the vendor file being cached
  'shared-modules': sharedModules,
  'web-components': getAbsolutePath('src/platform/site-wide/wc-loader.js'),
};

module.exports = async (env = {}) => {
  const { buildtype = LOCALHOST } = env;
  const buildOptions = {
    api: '',
    buildtype,
    host: LOCALHOST,
    port: 3001,
    scaffold: false,
    watch: false,
    destination: buildtype,
    ...env,
  };

  const apps = getEntryPoints(buildOptions.entry);
  const entryFiles = { ...apps, ...globalEntryFiles };
  const isOptimizedBuild = [VAGOVSTAGING, VAGOVPROD].includes(buildtype);
  const scaffoldAssets = await getScaffoldAssets();
  const appRegistry = JSON.parse(scaffoldAssets['registry.json']);
  const envBucketUrl = BUCKETS[buildtype];
  const sourceMapSlug = envBucketUrl || '';

  const buildPath = path.resolve(
    __dirname,
    '../',
    'build',
    buildOptions.destination,
  );

  const baseConfig = {
    mode: isOptimizedBuild ? 'production' : 'development',
    devtool: false,
    entry: entryFiles,
    output: {
      path: path.resolve(buildPath, 'generated'),
      publicPath: '/generated/',
      filename: '[name].entry.js',
      chunkFilename: '[name].entry.js',
    },
    module: {
      strictExportPresence: true,
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              // Speed up compilation.
              cacheDirectory: '.babelcache',
              cacheCompression: false,
              // Also see .babelrc
            },
          },
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
              },
            },
            {
              loader: 'postcss-loader',
            },
            {
              loader: 'sass-loader',
              options: { sourceMap: true },
            },
          ],
        },
        {
          // if we want to minify these images, we could add img-loader
          // but it currently only would apply to three images from uswds
          test: /\.(jpe?g|png|gif)$/i,
          use: {
            loader: 'url-loader',
            options: {
              limit: 10000,
            },
          },
        },
        {
          test: /\.svg/,
          use: {
            loader: 'svg-url-loader',
            options: {
              limit: 1024,
              publicPath: './',
            },
          },
        },
        {
          test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 7000,
              mimetype: 'application/font-woff',
              name: '[name].[ext]',
            },
          },
        },
        {
          test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          use: {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
            },
          },
        },
        {
          test: /react-jsonschema-form\/lib\/components\/(widgets|fields\/ObjectField|fields\/ArrayField)/,
          exclude: [/widgets\/index\.js/, /widgets\/TextareaWidget/],
          use: {
            loader: 'null-loader',
          },
        },
      ],
      noParse: [/mapbox\/vendor\/promise.js$/],
    },
    resolve: {
      extensions: ['.js', '.jsx'],
      fallback: {
        path: require.resolve('path-browserify'),
      },
      symlinks: false,
    },
    optimization: {
      // 'chunkIds' and 'moduleIds' are set to 'named' for preserving
      // consistency between full and single app builds
      chunkIds: 'named',
      moduleIds: 'named',
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            output: {
              beautify: false,
              comments: false,
            },
            warnings: false,
          },
          parallel: true,
        }),
      ],
      splitChunks: {
        cacheGroups: {
          // this needs to be "vendors" to overwrite a default group
          vendors: {
            chunks: 'all',
            test: 'vendor',
            name: 'vendor',
            enforce: true,
          },
        },
      },
    },
    plugins: [
      new webpack.DefinePlugin({
        __BUILDTYPE__: JSON.stringify(buildtype),
        __API__: JSON.stringify(buildOptions.api),
        __REGISTRY__: JSON.stringify(appRegistry),
        'process.env.MAPBOX_TOKEN': JSON.stringify(
          process.env.MAPBOX_TOKEN || '',
        ),
      }),

      new webpack.SourceMapDevToolPlugin({
        append: `\n//# sourceMappingURL=${sourceMapSlug}/generated/[url]`,
        filename: '[file].map',
      }),

      new StylelintPlugin({
        configFile: '.stylelintrc.json',
        exclude: ['node_modules', 'build', 'coverage', '.cache'],
        fix: true,
      }),

      new MiniCssExtractPlugin(),

      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      }),

      new CopyPlugin({
        patterns: [
          {
            from: 'src/site/assets',
            to: buildPath,
          },
        ],
      }),

      new WebpackBar(),
    ],
    devServer: generateWebpackDevConfig(buildOptions),
  };

  if (!buildOptions.watch) {
    baseConfig.plugins.push(
      new WebpackManifestPlugin({
        fileName: 'file-manifest.json',
        filter: ({ isChunk }) => isChunk,
      }),
    );
  }

  // Optionally generate mocked HTML pages for apps without running content build.
  if (buildOptions.scaffold) {
    const scaffoldedHtml = generateHtmlFiles(buildPath, scaffoldAssets);
    baseConfig.plugins.push(...scaffoldedHtml);
  }

  // Open homepage or specific app in browser
  if (buildOptions.open) {
    const target =
      buildOptions.openTo || buildOptions.entry
        ? // Assumes the first in the list has a rootUrl
          getEntryManifests(buildOptions.entry)[0].rootUrl
        : '';
    baseConfig.devServer.open = { target };
  }

  if (buildOptions.analyzer) {
    baseConfig.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'disabled',
        generateStatsFile: true,
      }),
    );
  }

  return baseConfig;
};
