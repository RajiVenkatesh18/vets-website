/* eslint-disable camelcase */

/*
This component handles:
- displaying a list of 10 messages per page
- pagination logic
- sorting messages in some order

Assumptions that may need to be addressed:
- This component assumes it receives a payload containing ALL messages. Of the provided
pagination metadata, per_page and total_entries is used. If each page change requires another 
api call to fetch the next set of messages, this logic will need to be refactored, but shouldn't be difficult.

Outstanding work:
- links for componse and search currently do nothing
- individual message links go nowhere. Another component would need to be made 
to display message details. Another react route would need to be set up to handle this view, 
probably needing to accept a URL parameter
*/
import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { chunk } from 'lodash';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import InboxListItem from './InboxListItem';

// Arbitrarily set because the VaPagination component has a required prop for this.
// This value dictates how many pages are displayed in a pagination component
const MAX_PAGE_LIST_LENGTH = 5;

const InboxListView = props => {
  const {
    messages,
    messages: {
      meta: {
        pagination: { per_page, total_entries },
      },
    },
  } = props;

  const [currentMessages, setCurrentMessages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = per_page;
  const totalEntries = total_entries;
  const paginatedMessages = useRef([]);

  // split messages into pages
  const paginateData = data => {
    return chunk(data, perPage);
  };

  // get display numbers
  const fromToNums = (page, total) => {
    const from = (page - 1) * perPage + 1;
    const to = Math.min(page * perPage, total);

    return [from, to];
  };

  // run once on component mount to set initial message and page data
  useEffect(() => {
    paginatedMessages.current = paginateData(messages.data);

    setCurrentMessages(paginatedMessages.current[currentPage - 1]);
  }, []);

  // update pagination values on...page change
  const onPageChange = page => {
    setCurrentMessages(paginatedMessages.current[page - 1]);
    setCurrentPage(page);
  };

  // sort messages
  const onSelectChange = sortValue => {
    let sorted;
    if (sortValue === 'DESC') {
      sorted = currentMessages.sort((a, b) => {
        return a.attributes.send_date - b.attributes.send_date;
      });
    } else if (sortValue === 'UNREAD') {
      sorted = currentMessages.sort((a, b) => {
        return a.attributes.read_receipt - b.attributes.read_receipt;
      });
    }
    setCurrentMessages([...sorted]);
  };

  const displayNums = fromToNums(currentPage, messages.data.length);

  return (
    <div className="message-list vads-l-row vads-u-flex-direction--column">
      <div className="message-list-sort">
        <va-select
          class="vads-u-margin-top--neg1p5"
          label="Show messages by"
          name="sort order"
          onVaSelect={e => {
            onSelectChange(e.detail.value);
          }}
        >
          <option value="desc">Newest to oldest</option>
          <option value="asc">Oldest to newest</option>
        </va-select>
        <button type="button">Sort</button>
      </div>
      <div className="vads-u-padding-y--1p5 vads-l-row vads-u-margin-top--2 vads-u-border-top--1px vads-u-border-bottom--1px vads-u-border-color--gray-light">
        Displaying {displayNums[0]}
        &#8211;
        {displayNums[1]} of {totalEntries} messages
      </div>
      {currentMessages.map((message, idx) => (
        <InboxListItem
          key={`${message.id}+${idx}`}
          attributes={message.attributes}
          link={message.link}
        />
      ))}
      <VaPagination
        onPageSelect={e => onPageChange(e.detail.page)}
        page={currentPage}
        pages={paginatedMessages.current.length}
        maxPageListLength={MAX_PAGE_LIST_LENGTH}
        showLastPage
      />
    </div>
  );
};

export default InboxListView;

InboxListView.propTypes = {
  messages: PropTypes.object,
  meta: PropTypes.object,
};