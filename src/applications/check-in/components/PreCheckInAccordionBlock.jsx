import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import PropTypes from 'prop-types';
import ExternalLink from './ExternalLink';

const PreCheckInAccordionBlock = ({
  demographicsUpToDate = 'no',
  emergencyContactUpToDate = 'no',
  nextOfKinUpToDate = 'no',
  appointments = null,
  errorPage = false,
}) => {
  const { t } = useTranslation();
  let hasUpdates = false;
  let updateBody = '';
  if (demographicsUpToDate === 'no') {
    hasUpdates = true;
    updateBody = (
      <>
        <strong>{t('contact-information')}</strong>
        <p>
          {t('a-staff-member-will-help-you-on-the-day-of-your-appointment')}
        </p>
        <p>
          <Trans
            i18nKey="or-you-can-login-to-your-va-account-to-update-your-contact-information-online"
            components={[
              <ExternalLink
                key="link"
                href="https://www.va.gov/profile/personal-information"
                hrefLang="en"
              >
                link
              </ExternalLink>,
            ]}
            values={{ link: t('sign-in') }}
          />
        </p>
      </>
    );
  }
  if (emergencyContactUpToDate === 'no' || nextOfKinUpToDate === 'no') {
    let title = '';
    if (emergencyContactUpToDate === 'no' && nextOfKinUpToDate === 'no') {
      title = t('emergency-and-next-of-kin-information');
    } else if (emergencyContactUpToDate === 'no') {
      title = t('emergency-information');
    } else {
      title = t('next-of-kin');
    }
    hasUpdates = true;
    updateBody = (
      <>
        {updateBody}
        <strong>{title}</strong>
        <p>
          {t('a-staff-member-will-help-you-on-the-day-of-your-appointment')}
        </p>
      </>
    );
  }
  const accordions = [];
  if (appointments) {
    accordions.unshift(
      {
        header: t('why-do-i-need-to-make-sure-my-information-is-up-to-date'),
        body: (
          <p>
            {t(
              'we-can-better-prepare-for-your-appointment-and-contact-you-more-easily',
            )}
          </p>
        ),
        open: false,
      },
      {
        header: t('what-if-i-have-questions-about-my-appointment'),
        body: (
          <>
            <p>{t('call-your-va-health-care-team')}:</p>
            {appointments.map((appointment, index) => {
              return (
                <p key={index}>
                  {appointment.clinicFriendlyName || appointment.clinicName} at{' '}
                  <va-telephone contact={appointment.clinicPhoneNumber} />
                </p>
              );
            })}
          </>
        ),
        open: false,
      },
    );
  }

  if (hasUpdates) {
    accordions.unshift({
      header: t('how-can-i-update-my-information'),
      body: updateBody,
      open: true,
    });
  }

  if (errorPage) {
    accordions.unshift({
      header: t('what-is-pre-check-in'),
      body: (
        <>
          <p>
            {t(
              'during-pre-check-in-you-can-review-your-personal-emergency-contact-and-next-of-kin-information-and-confirm-its-up-to-date-this-helps-us-better-prepare-for-your-appointment',
            )}
          </p>
          <p>
            <Trans
              i18nKey="you-can-also-sign-in-to-your-va-account-to-review-your-information"
              components={[
                <ExternalLink
                  key="link"
                  href="https://www.va.gov/profile/personal-information"
                  hrefLang="en"
                >
                  link
                </ExternalLink>,
              ]}
              values={{ link: t('sign-in') }}
            />
          </p>
        </>
      ),
      open: false,
    });
    accordions.push({
      header: t('why-cant-i-pre-check-in'),
      body: (
        <p>
          {t(
            'you-can-pre-check-in-online-before-midnight-of-the-day-of-your-appointment',
          )}
        </p>
      ),
      open: false,
    });
  }

  return (
    <va-accordion open-single bordered data-testid="pre-check-in-accordions">
      {accordions.map((accordion, index) => {
        return (
          <va-accordion-item
            header={accordion.header}
            id={index}
            key={index}
            open={accordion.open}
          >
            {accordion.body}
          </va-accordion-item>
        );
      })}
    </va-accordion>
  );
};

PreCheckInAccordionBlock.propTypes = {
  appointments: PropTypes.array,
  demographicsUpToDate: PropTypes.string,
  emergencyContactUpToDate: PropTypes.string,
  errorPage: PropTypes.bool,
  nextOfKinUpToDate: PropTypes.string,
};

export default PreCheckInAccordionBlock;