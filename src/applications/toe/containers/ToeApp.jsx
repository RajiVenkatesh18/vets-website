import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { isArray } from 'lodash';
import PropTypes from 'prop-types';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { setData } from 'platform/forms-system/src/js/actions';

import formConfig from '../config/form';
import { fetchSponsors, fetchPersonalInformation } from '../actions';
import { mapFormSponsors, prefillTransformer } from '../helpers';
import { SPONSORS_TYPE } from '../constants';

function ToeApp({
  children,
  formData,
  getSponsors,
  location,
  setFormData,
  sponsors,
  sponsorsInitial,
  sponsorsSavedState,
  user,
  claimantInfo,
  getPersonalInformation,
}) {
  const [fetchedPersonalInfo, setFetchedPersonalInfo] = useState(false);
  const [fetchedSponsors, setFetchedSponsors] = useState(false);
  useEffect(
    () => {
      // if (!user?.login?.currentlyLoggedIn) {
      //   return;
      // }
      if (!fetchedPersonalInfo) {
        setFetchedPersonalInfo(true);
        getPersonalInformation();
      }
    },
    [fetchedPersonalInfo, getPersonalInformation],
  );
  useEffect(
    () => {
      if (!user?.login?.currentlyLoggedIn) {
        return;
      }
      if (!fetchedSponsors) {
        setFetchedSponsors(true);
        getSponsors();
      }

      if (
        !sponsors?.loadedFromSavedState &&
        isArray(sponsorsSavedState?.sponsors)
      ) {
        setFormData(mapFormSponsors(formData, sponsorsSavedState));
      } else if (sponsorsInitial && !sponsors) {
        setFormData(mapFormSponsors(formData, sponsorsInitial));
      }
    },
    [
      claimantInfo,
      fetchedSponsors,
      formData,
      getSponsors,
      location,
      setFormData,
      sponsors,
      sponsorsInitial,
      sponsorsSavedState,
      user?.login?.currentlyLoggedIn,
    ],
  );

  return (
    <>
      <va-breadcrumbs>
        <a href="/">Home</a>
        <a href="/education">Education and training</a>
        <a href="/education/survivor-dependent-benefits/apply-for-transferred-benefits-form-22-1990e">
          Apply to use transferred education benefits
        </a>
      </va-breadcrumbs>
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
    </>
  );
}

ToeApp.propTypes = {
  children: PropTypes.object,
  claimantInfo: PropTypes.object,
  formData: PropTypes.object,
  getPersonalInformation: PropTypes.func,
  getSponsors: PropTypes.func,
  location: PropTypes.object,
  setFormData: PropTypes.func,
  showUpdatedFryDeaApp: PropTypes.bool,
  sponsors: SPONSORS_TYPE,
  sponsorsInitial: SPONSORS_TYPE,
  sponsorsSavedState: SPONSORS_TYPE,
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  formData: state.form?.data || {},
  claimant: state.data?.formData?.data?.attributes?.claimant,
  fetchedSponsors: state.data?.fetchedSponsors,
  fetchedSponsorsComplete: state.data?.fetchedSponsorsComplete,
  sponsors: state.form?.data?.sponsors,
  sponsorsInitial: state?.data?.sponsors,
  sponsorsSavedState: state.form?.loadedData?.formData?.sponsors,
  user: state.user,
  claimantInfo: prefillTransformer(null, null, null, state),
});

const mapDispatchToProps = {
  getSponsors: fetchSponsors,
  getPersonalInformation: fetchPersonalInformation,
  setFormData: setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ToeApp);
