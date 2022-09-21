import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Breadcrumbs = () => {
  const location = useLocation();
  const [crumbs, setCrumbs] = useState();

  const paths = [
    { path: '/message', breadCrumbArray: [{ label: 'Message' }] },
    { path: '/reply', breadCrumbArray: [{ label: 'Reply' }] },
    { path: '/compose', breadCrumbArray: [{ label: 'Compose message' }] },
    { path: '/draft', breadCrumbArray: [{ label: 'Edit draft' }] },
    { path: '/drafts', breadCrumbArray: [{ label: 'Drafts' }] },
    { path: '/sent', breadCrumbArray: [{ label: 'Sent messages' }] },
    { path: '/trash', breadCrumbArray: [{ label: 'Trash' }] },
    {
      path: '/search',
      breadCrumbArray: [{ label: 'Search messages', route: '/search' }],
    },
    {
      path: '/search',
      breadCrumbArray: [
        { label: 'Search messages', route: '/search' },
        { label: 'Advanced search', route: '/search?advanced=true' },
      ],
    },
  ];

  useEffect(() => {
    paths.forEach(path => {
      if (path.path === location.pathname) {
        setCrumbs(path.breadCrumbArray);
      }
    });
  }, []);

  return (
    <va-breadcrumbs>
      <a href="/my-health/secure-messages/">VA.gov home</a>
      <a href="/my-health/secure-messages/">My Health</a>
      <a href="/my-health/secure-messages/">Messages</a>
      {crumbs &&
        crumbs.map((crumb, i) => {
          return (
            <a key={i} href={crumb.route}>
              {crumb.label}
            </a>
          );
        })}
    </va-breadcrumbs>
  );
};

export default Breadcrumbs;