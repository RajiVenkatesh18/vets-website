import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteMessage } from '../actions';

const MessageActionButtons = () => {
  const dispatch = useDispatch();
  return (
    <div className="message-action-buttons vads-l-row vads-u-justify-content--space-around">
      <button type="button" className="message-action-button">
        <i className="fas fa-print" />
        <span className="message-action-button-text">Print</span>
      </button>

      <button
        type="button"
        className="message-action-button"
        onClick={() => dispatch(deleteMessage(/* id */))}
      >
        <i className="fas fa-trash-alt" />
        <span className="message-action-button-text">Delete</span>
      </button>

      <button type="button" className="message-action-button">
        <i className="fas fa-folder" />
        <span className="message-action-button-text">Move</span>
      </button>

      <button type="button" className="message-action-button">
        <i className="fas fa-reply" />
        <span className="message-action-button-text">Reply</span>
      </button>
    </div>
  );
};

export default MessageActionButtons;
