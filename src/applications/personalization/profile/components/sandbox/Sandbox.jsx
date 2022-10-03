import React from 'react';
import { useSelector } from 'react-redux';
import environment from 'platform/utilities/environment';

import { FIELD_NAMES } from 'platform/user/profile/vap-svc/constants';
import { selectVAProfilePersonalInformation } from '../../selectors';

const SandboxReduxExample = () => {
  const hasUnsavedEdits = useSelector(
    state => state?.vapService?.hasUnsavedEdits,
  );

  const { preferredName } = useSelector(state =>
    selectVAProfilePersonalInformation(state, FIELD_NAMES.PREFERRED_NAME),
  );

  return (
    <>
      <va-alert
        background-only
        status={hasUnsavedEdits ? 'error' : 'success'}
        class="vads-u-margin-bottom--2"
      >
        No pending edits detected
      </va-alert>

      <pre>{preferredName}</pre>
    </>
  );
};

const envDetails = {
  name: environment.vspEnvironment(),
  feUrl: environment.BASE_URL,
};

const SandboxInfoTable = () => {
  const { name, feUrl } = envDetails;
  return (
    <div>
      <va-table>
        <va-table-row slot="headers">
          <span>Environment</span>
          <span>Frontend URL</span>
        </va-table-row>

        <va-table-row>
          <span>{name}</span>
          <span>{feUrl}</span>
        </va-table-row>
      </va-table>
    </div>
  );
};

const Sandbox = () => {
  return (
    <div>
      <SandboxReduxExample />
      <SandboxInfoTable />
    </div>
  );
};

Sandbox.propTypes = {};

export default Sandbox;
