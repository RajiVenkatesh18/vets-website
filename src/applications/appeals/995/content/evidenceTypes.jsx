import React from 'react';

export const titles = {
  types:
    'What type of evidence do you want us to review as part of your claim?',
  vaMr: 'VA medical records',
  privateMr: 'Private medical records',
  other: 'Supporting (lay) statements or other evidence',
};

export const EvidenceTypeHelp = (
  <va-additional-info trigger="Which evidence type should I choose?">
    <h3 className="vads-u-margin-top--0">Types of evidence</h3>
    <h4>VA medical records</h4>
    <p>
      If you were treated at a VA medical center or clinic, or by a doctor
      through the TRICARE health care program, you’ll have VA medical records.
    </p>
    <h4>Private medical records</h4>
    <p>
      If you were treated by a private doctor, including a Veteran’s Choice
      doctor, you’ll have private medical records. We’ll need to see those
      records to make a decision on your claim. A Disability Benefits
      Questionnaire is an example of a private medical record.
    </p>
    <h4>Lay statements or other evidence</h4>
    <p>
      A lay statement is a written statement from family, friends, or coworkers
      to help support your claim. Lay statements are also called “buddy
      statements.” In most cases, you’ll only need your medical records to
      support your disability claim. But some claims—such as those for
      Posttraumatic Stress Disorder or military sexual trauma—could benefit from
      a lay or buddy statement.
    </p>
  </va-additional-info>
);
