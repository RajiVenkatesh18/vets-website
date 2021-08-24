import React from 'react';
import moment from 'moment';
import { FORMAT_DATE_READABLE } from '../constants';

export default function ServicePeriodAccordionView({ formData }) {
  const {
    separationReason,
    serviceBranch,
    serviceCharacter,
    trainingPeriods,
    exclusionPeriods,
  } = formData;

  let servicePeriodFrom = '';
  let servicePeriodTo = '';
  if (formData && formData.dateRange) {
    servicePeriodFrom = moment(formData.dateRange.from).format(
      FORMAT_DATE_READABLE,
    );
    servicePeriodTo = moment(formData.dateRange.to).format(
      FORMAT_DATE_READABLE,
    );
  }

  function formatDateList(periods) {
    if (!trainingPeriods || !trainingPeriods.length) {
      return [];
    }

    return periods.map(period => (
      <span key={period.path} className="service-history-details_period">
        {moment(period.from).format(FORMAT_DATE_READABLE)} {` – `}
        {moment(period.to).format(FORMAT_DATE_READABLE)}
      </span>
    ));
  }

  const formattedTrainingPeriods = formatDateList(trainingPeriods);
  const formattedExclusionPeriods = formatDateList(exclusionPeriods);

  return (
    <dl className="service-history-details">
      {serviceBranch && (
        <>
          <dt className="service-history-details_term">Branch of service</dt>
          <dd className="service-history-details_definition">
            {serviceBranch}
          </dd>
        </>
      )}

      {servicePeriodFrom &&
        servicePeriodTo && (
          <>
            <dt className="service-history-details_term">Service period</dt>
            <dd className="service-history-details_definition">
              {servicePeriodFrom} &ndash; {servicePeriodTo}
            </dd>
          </>
        )}

      {serviceCharacter && (
        <>
          <dt className="service-history-details_term">Character of service</dt>
          <dd className="service-history-details_definition">
            {serviceCharacter}
          </dd>
        </>
      )}

      {separationReason && (
        <>
          <dt className="service-history-details_term">Separation reason</dt>
          <dd className="service-history-details_definition">
            {separationReason}
          </dd>
        </>
      )}

      {!!formattedTrainingPeriods.length && (
        <>
          <dt className="service-history-details_term">Training period</dt>
          <dd className="service-history-details_definition">
            {formattedTrainingPeriods}
          </dd>
        </>
      )}

      {!!formattedExclusionPeriods.length && (
        <>
          <dt className="service-history-details_term">Exclusion period</dt>
          <dd className="service-history-details_definition">
            {formattedExclusionPeriods}
          </dd>
        </>
      )}
    </dl>
  );
}