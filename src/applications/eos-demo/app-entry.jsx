import 'platform/polyfills';
import './sass/eos-demo.scss';

import startApp from 'platform/startup/router';

import routes from './routes';
import manifest from './manifest.json';

startApp({
  url: manifest.rootUrl,
  routes,
});
