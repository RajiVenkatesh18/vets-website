## API Report File for "@department-of-veterans-affairs/va-forms-system-core"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts
/// <reference types="react" />

import { FieldHookConfig } from 'formik';

// Warning: (ae-forgotten-export) The symbol "CheckboxProps" needs to be exported by the entry point index.d.ts
//
// @public (undocumented)
export const CheckboxField: (props: CheckboxProps) => JSX.Element;

// @public
export const DebuggerView: () => JSX.Element;

// @beta
export function Page(props: PageProps): JSX.Element;

// @beta
export interface PageProps {
  // (undocumented)
  children: JSX.Element[];
  // (undocumented)
  path: string;
  // (undocumented)
  title: string;
}

// @beta
export interface Routable {
  // (undocumented)
  path: string;
}

// @beta
export function Router(props: RouterProps): JSX.Element;

// @beta
export interface RouterProps {
  // (undocumented)
  basename: string;
  // (undocumented)
  children: Routable | Array<Routable>;
}

// Warning: (ae-forgotten-export) The symbol "SelectProps" needs to be exported by the entry point index.d.ts
//
// @public (undocumented)
export const SelectField: (props: SelectProps) => JSX.Element;

// Warning: (ae-forgotten-export) The symbol "FieldProps" needs to be exported by the entry point index.d.ts
//
// @public (undocumented)
export const TextField: (props: FieldProps<string>) => JSX.Element;

// (No @packageDocumentation comment for this package)
```