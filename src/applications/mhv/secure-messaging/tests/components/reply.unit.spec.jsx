import { render } from '@testing-library/react';
import React from 'react';
import ReplyBox from '../../components/ReplyBox';
import ReplyHeader from '../../components/ReplyHeader';
import BeforeMessageAddlInfo from '../../components/BeforeMessageAddlInfo';
import NavigationLinks from '../../components/NavigationLinks';
import OlderMessages from '../../components/OlderMessages';
import Breadcrumbs from '../../components/shared/Breadcrumbs';

describe('Breadcrumbs', () => {
  it('renders without errors', () => {
    const screen = render(
      <Breadcrumbs
        pageName="Reply"
        link="http://localhost:3001/my-health/secure-messages/reply/"
      />,
    );

    screen.getByText('reply', { exact: false });
  });
});

describe('Reply Header', () => {
  it('renders without errors', () => {
    const screen = render(<ReplyHeader />);

    screen.getByText('call', { exact: false });
  });
});

describe('Additional Info', () => {
  it('renders without errors', () => {
    render(<BeforeMessageAddlInfo />);
  });
});

describe('Navigation Links', () => {
  it('renders without errors', () => {
    const screen = render(<NavigationLinks />);

    screen.getByText('next', { exact: false });
    screen.getByText('previous', { exact: false });
  });
});

describe('Reply Box', () => {
  it('renders without errors', () => {
    render(<ReplyBox />);
  });
});

describe('Older Messages', () => {
  it('renders without errors', () => {
    render(<OlderMessages />);
  });
});