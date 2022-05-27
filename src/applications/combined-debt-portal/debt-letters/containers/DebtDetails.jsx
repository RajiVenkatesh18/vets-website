import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import moment from 'moment';
import last from 'lodash/last';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import HowDoIPay from '../components/HowDoIPay';
import NeedHelp from '../components/NeedHelp';
import OnThisPageLinks from '../components/OnThisPageLinks';
import HistoryTable from '../components/HistoryTable';
import { setPageFocus, getCurrentDebt } from '../utils/page';
import {
  deductionCodes,
  renderWhyMightIHaveThisDebt,
} from '../const/deduction-codes';
import DebtDetailsCard from '../components/DebtDetailsCard';

const DebtDetails = () => {
  const { selectedDebt, debts } = useSelector(
    ({ combinedPortal }) => combinedPortal.debtLetters,
  );
  const approvedLetterCodes = ['100', '101', '102', '109', '117', '123', '130'];
  const location = useLocation();
  const currentDebt = getCurrentDebt(selectedDebt, debts, location);
  const whyContent = renderWhyMightIHaveThisDebt(currentDebt.deductionCode);
  const dateUpdated = last(currentDebt.debtHistory)?.date;
  const filteredHistory = currentDebt.debtHistory
    ?.filter(history => approvedLetterCodes.includes(history.letterCode))
    .reverse();
  const hasFilteredHistory = filteredHistory && filteredHistory.length > 0;

  const howToUserData = {
    fileNumber: currentDebt.fileNumber,
    payeeNumber: currentDebt.payeeNumber,
    personEntitled: currentDebt.personEntitled,
    deductionCode: currentDebt.deductionCode,
  };

  useEffect(() => {
    scrollToTop();
    setPageFocus('h1');
  }, []);

  if (Object.keys(currentDebt).length === 0) {
    window.location.replace('/manage-debt-and-bills/summary/debt-balances/');
    return (
      <div className="vads-u-font-family--sans vads-u-margin--0 vads-u-padding--1">
        <va-loading-indicator
          label="Loading"
          message="Please wait while we load the application for you."
          set-focus
        />
      </div>
    );
  }

  return (
    <div>
      <va-breadcrumbs label="Breadcrumb">
        <a href="/">Home</a>
        <a href="/manage-debt-and-bills/">Manage your VA debt and bills</a>
        <Link to="/manage-debt-and-bills/summary/">
          Your debt and bills summary
        </Link>
        <Link to="/debt-balances/">Benefit debt balances</Link>
        <Link
          to={`/debt-balances/details/${selectedDebt.fileNumber +
            selectedDebt.deductionCode}`}
        >
          Debt details
        </Link>
      </va-breadcrumbs>
      <h1
        className="vads-u-font-family--serif vads-u-margin-bottom--2"
        tabIndex="-1"
      >
        Your {deductionCodes[currentDebt.deductionCode]}
      </h1>
      <section className="vads-l-row">
        <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-padding-right--2p5 vads-l-col--12 vads-u-font-family--sans">
          {dateUpdated && (
            <p className="va-introtext vads-u-font-family--sans vads-u-margin-top--0">
              Updated on
              <span className="vads-u-margin-left--0p5">
                {moment(dateUpdated, 'MM-DD-YYYY').format('MMMM D, YYYY')}
              </span>
            </p>
          )}
          <DebtDetailsCard debt={currentDebt} />
          {whyContent && (
            <va-additional-info trigger="Why might I have this debt?">
              {whyContent}
            </va-additional-info>
          )}
          <OnThisPageLinks isDetailsPage hasHistory={hasFilteredHistory} />
          {hasFilteredHistory && (
            <>
              <h2
                id="debtLetterHistory"
                className="vads-u-margin-top--5 vads-u-margin-bottom--0"
              >
                Debt letter history
              </h2>
              <p className="vads-u-margin-y--2">
                You can check the status or download the letters for this debt.
              </p>
              <p className="vads-u-margin-top--0 vads-u-margin-bottom--0">
                <strong>Note:</strong> The content of the debt letters below may
                not include recent updates to your debt reflected above. If you
                have any questions about your debt history, please contact the
                Debt Management Center at{' '}
                <va-telephone
                  className="vads-u-margin-left--0p5"
                  contact="8008270648"
                />
                .
              </p>
              <HistoryTable history={filteredHistory} />
              <h3 id="downloadDebtLetters" className="vads-u-margin-top--0">
                Download debt letters
              </h3>
              <p className="vads-u-margin-bottom--0">
                You can download some of your letters for education,
                compensation and pension debt.
              </p>
              <Link
                to="/debt-balances/letters"
                className="vads-u-margin-top--1"
              >
                Download letters related to your VA debt
              </Link>
            </>
          )}
          <HowDoIPay userData={howToUserData} />
          <NeedHelp />
        </div>
      </section>
    </div>
  );
};

export default DebtDetails;