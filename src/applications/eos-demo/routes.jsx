// import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
// import formConfig from './config/form';
// import App from './containers/App.jsx';

// const route = {
//   path: '/',
//   component: App,
//   indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },

//   childRoutes: createRoutesWithSaveInProgress(formConfig),
// };

// export default route;

import React from 'react';
import { Route } from 'react-router-dom-v5-compat';
import {
  FormRouter,
  // transformJSONSchema,
} from '@department-of-veterans-affairs/va-forms-system-core';
// import fullSchema from 'vets-json-schema/dist/21P-530-schema.json';
import EosDemoApplication from './pages/EosDemoApplication';
import Page1Demo from './pages/Page1Demo';
import ConfirmationPage from './pages/SampleConfirmation';

// WILL NOT BE USING THIS FOR DEMO PURPOSES
// const initialValues = transformJSONSchema(fullSchema);

const initialValues2 = {
  doYouHavePets: true,
  favoriteTeam: 'NY Giants',
  birthDate: '',
  fullName: {
    first: 'Chicken',
    middle: 'Sullivan',
    last: 'McTester',
    suffix: 'Jr.',
  },
};

const routes = (
  <FormRouter
    formData={initialValues2}
    title="Burial POC"
    subTitle="Example form for Burials using VAFSC"
  >
    <Route index element={<EosDemoApplication title="Introduction Page" />} />
    <Route
      path="/page-1"
      element={<Page1Demo title="Welcome to Page 1 of the EOS Demo" />}
    />
    <Route
      path="/confirmation"
      element={<ConfirmationPage title="Confirmation Page" />}
    />
  </FormRouter>
);

export default routes;
