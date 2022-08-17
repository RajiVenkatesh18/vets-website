import React from 'react';
import {
  Page,
  CheckboxField,
  TextField,
  DateField,
  FullNameField,
} from '@department-of-veterans-affairs/va-forms-system-core';

const Page1Demo = props => {
  return (
    <>
      <Page {...props}>
        <CheckboxField
          name="doYouHavePets"
          label="Do you have pets?"
          required
        />
        <TextField
          name="favoriteTeam"
          label="What is your favorite sports team?"
          required
        />
        <DateField
          name="birthDate"
          label="Enter your date of birth"
          required
          isMemorableDate
        />
        <FullNameField name="fullName" label="fullName" required />
      </Page>
    </>
  );
};

export default Page1Demo;
