import React from 'react';
import { useDispatch } from 'react-redux';
import { viewAttachment } from '../actions';

const Attachment = (/* props */) => {
  const dispatch = useDispatch();
  const content = dispatch(viewAttachment(/* msgId , attId */));

  // eslint-disable-next-line no-console
  console.log('Show Attachment');

  return (
    <div className="vads-l-grid-container">
      <p>This is a test</p>
      <div>{content}</div>
    </div>
  );
};

export default Attachment;
